export type SyncCollectionName = 'vaultDocs' | 'keeperItems' | 'savedItems';

export type SixStateSyncStatus =
  | 'synced'
  | 'syncing'
  | 'offline'
  | 'pending'
  | 'failed'
  | 'conflict';

export interface StoredEntityRecord<T = Record<string, any>> {
  compositeKey: string; // `${collection}:${id}`
  id: string;
  collection: SyncCollectionName;
  data: T;
  baseData?: T;
  version: number;
  baseVersion: number;
  deviceId: string;
  idempotencyKey: string;
  deleted: boolean;
  pendingSync: boolean;
  createdAtIso: string;
  updatedAtIso: string;
}

export interface SyncOutboxItem {
  idempotencyKey: string;
  compositeKey: string;
  collection: SyncCollectionName;
  entityId: string;
  operation: 'upsert' | 'delete';
  payload: Record<string, any>;
  baseData?: Record<string, any>;
  expectedVersion: number;
  deviceId: string;
  retryCount: number;
  status: 'pending' | 'in_flight' | 'failed' | 'conflict';
  lastError?: string;
  createdAtIso: string;
  updatedAtIso: string;
}

export interface SyncConflictRecord {
  conflictId: string; // `${collection}:${entityId}`
  compositeKey: string;
  collection: SyncCollectionName;
  entityId: string;
  localPayload: Record<string, any>;
  remotePayload: Record<string, any>;
  basePayload?: Record<string, any>;
  localVersion: number;
  remoteVersion: number;
  detectedAtIso: string;
}

const DB_NAME = 'saarthi_offline_v2';
const DB_VERSION = 1;

const STORE_ENTITIES = 'entities';
const STORE_OUTBOX = 'sync_outbox';
const STORE_CONFLICTS = 'conflicts';
const STORE_META = 'sync_meta';

// In-memory fallback for environments where IndexedDB is unavailable
const memEntities = new Map<string, StoredEntityRecord>();
const memOutbox = new Map<string, SyncOutboxItem>();
const memConflicts = new Map<string, SyncConflictRecord>();
const memMeta = new Map<string, { key: string; value: any }>();

const REQUIRED_STORES = [STORE_ENTITIES, STORE_OUTBOX, STORE_CONFLICTS, STORE_META];

let cachedDbPromise: Promise<IDBDatabase | null> | null = null;
let customIdbFactory: IDBFactory | null = null;
let idbDisabled = false;

export function setIndexedDbFactoryForTests(factory: IDBFactory | null): void {
  customIdbFactory = factory;
  cachedDbPromise = null;
  idbDisabled = false;
}

export function resetOfflineDbMemoryForTests(): void {
  memEntities.clear();
  memOutbox.clear();
  memConflicts.clear();
  memMeta.clear();
  cachedDbPromise = null;
  idbDisabled = false;
}

function getIdbFactory(): IDBFactory | null {
  if (idbDisabled) return null;
  if (customIdbFactory) return customIdbFactory;
  if (typeof indexedDB !== 'undefined') return indexedDB;
  if (typeof globalThis !== 'undefined' && (globalThis as any).indexedDB) {
    return (globalThis as any).indexedDB;
  }
  return null;
}

function hasAllStores(db: IDBDatabase): boolean {
  try {
    return REQUIRED_STORES.every((name) => db.objectStoreNames.contains(name));
  } catch {
    return false;
  }
}

function deleteCorruptDb(factory: IDBFactory): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (!settled) {
        settled = true;
        resolve();
      }
    };
    const timer = setTimeout(finish, 800);
    try {
      const req = factory.deleteDatabase(DB_NAME);
      req.onsuccess = () => {
        clearTimeout(timer);
        finish();
      };
      req.onerror = () => {
        clearTimeout(timer);
        finish();
      };
      req.onblocked = () => {
        clearTimeout(timer);
        finish();
      };
    } catch {
      clearTimeout(timer);
      finish();
    }
  });
}

async function openDb(allowRepair = true): Promise<IDBDatabase | null> {
  if (idbDisabled) return null;
  if (cachedDbPromise) return cachedDbPromise;
  const factory = getIdbFactory();
  if (!factory) {
    return null;
  }

  const openPromise = new Promise<IDBDatabase | null>((resolve) => {
    try {
      const request = factory.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_ENTITIES)) {
          const store = db.createObjectStore(STORE_ENTITIES, { keyPath: 'compositeKey' });
          store.createIndex('collection', 'collection', { unique: false });
          store.createIndex('updatedAtIso', 'updatedAtIso', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_OUTBOX)) {
          const store = db.createObjectStore(STORE_OUTBOX, { keyPath: 'idempotencyKey' });
          store.createIndex('compositeKey', 'compositeKey', { unique: false });
          store.createIndex('createdAtIso', 'createdAtIso', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_CONFLICTS)) {
          db.createObjectStore(STORE_CONFLICTS, { keyPath: 'conflictId' });
        }
        if (!db.objectStoreNames.contains(STORE_META)) {
          db.createObjectStore(STORE_META, { keyPath: 'key' });
        }
      };
      request.onsuccess = async () => {
        const db = request.result;
        if (!hasAllStores(db)) {
          try {
            db.close();
          } catch {
            // ignore close error
          }
          cachedDbPromise = null;
          if (allowRepair) {
            await deleteCorruptDb(factory);
            const repaired = await openDb(false);
            resolve(repaired);
          } else {
            idbDisabled = true;
            resolve(null);
          }
          return;
        }
        db.onclose = () => {
          cachedDbPromise = null;
        };
        db.onversionchange = () => {
          try {
            db.close();
          } catch {
            // ignore
          }
          cachedDbPromise = null;
        };
        resolve(db);
      };
      request.onerror = () => {
        cachedDbPromise = null;
        resolve(null);
      };
      request.onblocked = () => {
        cachedDbPromise = null;
        resolve(null);
      };
    } catch {
      cachedDbPromise = null;
      resolve(null);
    }
  });

  cachedDbPromise = openPromise;
  return openPromise;
}

function idbReq<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withIdbStore<R>(
  storeName: string,
  mode: IDBTransactionMode,
  runIdb: (store: IDBObjectStore) => Promise<R>,
  runFallback: () => R | Promise<R>
): Promise<R> {
  const db = await openDb();
  if (!db) {
    return runFallback();
  }
  try {
    const tx = db.transaction(storeName, mode);
    return await runIdb(tx.objectStore(storeName));
  } catch {
    try {
      db.close();
    } catch {
      // ignore
    }
    cachedDbPromise = null;

    const retryDb = await openDb(true);
    if (retryDb) {
      try {
        const tx = retryDb.transaction(storeName, mode);
        return await runIdb(tx.objectStore(storeName));
      } catch {
        try {
          retryDb.close();
        } catch {
          // ignore
        }
      }
    }

    cachedDbPromise = null;
    idbDisabled = true;
    return runFallback();
  }
}

export const offlineDb = {
  async putEntity<T = Record<string, any>>(record: StoredEntityRecord<T>): Promise<void> {
    memEntities.set(record.compositeKey, record as StoredEntityRecord);
    await withIdbStore(
      STORE_ENTITIES,
      'readwrite',
      (store) => idbReq(store.put(record)).then(() => undefined),
      () => undefined
    );
  },

  async getEntity<T = Record<string, any>>(
    collection: SyncCollectionName,
    id: string
  ): Promise<StoredEntityRecord<T> | null> {
    const key = `${collection}:${id}`;
    return withIdbStore<StoredEntityRecord<T> | null>(
      STORE_ENTITIES,
      'readonly',
      async (store) => {
        const res = await idbReq(store.get(key));
        return (res as StoredEntityRecord<T>) || null;
      },
      () => (memEntities.get(key) as StoredEntityRecord<T>) || null
    );
  },

  async listEntities<T = Record<string, any>>(
    collection: SyncCollectionName,
    includeDeleted = false
  ): Promise<StoredEntityRecord<T>[]> {
    const all = await withIdbStore<StoredEntityRecord<T>[]>(
      STORE_ENTITIES,
      'readonly',
      async (store) => {
        if (store.indexNames.contains('collection')) {
          return (await idbReq(store.index('collection').getAll(collection))) as StoredEntityRecord<T>[];
        }
        const rows = (await idbReq(store.getAll())) as StoredEntityRecord<T>[];
        return rows.filter((r) => r.collection === collection);
      },
      () =>
        Array.from(memEntities.values()).filter(
          (r) => r.collection === collection
        ) as StoredEntityRecord<T>[]
    );
    return all
      .filter((r) => includeDeleted || !r.deleted)
      .sort((a, b) => (b.updatedAtIso || '').localeCompare(a.updatedAtIso || ''));
  },

  async putOutboxItem(item: SyncOutboxItem): Promise<void> {
    memOutbox.set(item.idempotencyKey, item);
    await withIdbStore(
      STORE_OUTBOX,
      'readwrite',
      (store) => idbReq(store.put(item)).then(() => undefined),
      () => undefined
    );
  },

  async removeOutboxItem(idempotencyKey: string): Promise<void> {
    memOutbox.delete(idempotencyKey);
    await withIdbStore(
      STORE_OUTBOX,
      'readwrite',
      (store) => idbReq(store.delete(idempotencyKey)).then(() => undefined),
      () => undefined
    );
  },

  async listOutboxItems(): Promise<SyncOutboxItem[]> {
    const all = await withIdbStore<SyncOutboxItem[]>(
      STORE_OUTBOX,
      'readonly',
      async (store) => (await idbReq(store.getAll())) as SyncOutboxItem[],
      () => Array.from(memOutbox.values())
    );
    return all.sort((a, b) => (a.createdAtIso || '').localeCompare(b.createdAtIso || ''));
  },

  async putConflict(conflict: SyncConflictRecord): Promise<void> {
    memConflicts.set(conflict.conflictId, conflict);
    await withIdbStore(
      STORE_CONFLICTS,
      'readwrite',
      (store) => idbReq(store.put(conflict)).then(() => undefined),
      () => undefined
    );
  },

  async removeConflict(conflictId: string): Promise<void> {
    memConflicts.delete(conflictId);
    await withIdbStore(
      STORE_CONFLICTS,
      'readwrite',
      (store) => idbReq(store.delete(conflictId)).then(() => undefined),
      () => undefined
    );
  },

  async listConflicts(): Promise<SyncConflictRecord[]> {
    return withIdbStore<SyncConflictRecord[]>(
      STORE_CONFLICTS,
      'readonly',
      async (store) => (await idbReq(store.getAll())) as SyncConflictRecord[],
      () => Array.from(memConflicts.values())
    );
  },

  async setMeta(key: string, value: any): Promise<void> {
    memMeta.set(key, { key, value });
    await withIdbStore(
      STORE_META,
      'readwrite',
      (store) => idbReq(store.put({ key, value })).then(() => undefined),
      () => undefined
    );
  },

  async getMeta<T = any>(key: string): Promise<T | null> {
    return withIdbStore<T | null>(
      STORE_META,
      'readonly',
      async (store) => {
        const res = await idbReq(store.get(key));
        return (res?.value as T) ?? null;
      },
      () => (memMeta.get(key)?.value as T) ?? null
    );
  },

  async clearAll(): Promise<void> {
    memEntities.clear();
    memOutbox.clear();
    memConflicts.clear();
    for (const storeName of [STORE_ENTITIES, STORE_OUTBOX, STORE_CONFLICTS]) {
      await withIdbStore(
        storeName,
        'readwrite',
        (store) => idbReq(store.clear()).then(() => undefined),
        () => undefined
      );
    }
  },
};
