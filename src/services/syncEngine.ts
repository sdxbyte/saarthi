import {
  collection as fsCollection,
  doc as fsDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  Unsubscribe,
} from 'firebase/firestore';
import {
  auth,
  db,
  handleFirestoreError,
  isFirebaseConfigured,
  OperationType,
} from '../lib/firebase';
import {
  offlineDb,
  SixStateSyncStatus,
  StoredEntityRecord,
  SyncCollectionName,
  SyncConflictRecord,
  SyncOutboxItem,
} from './offlineDb';
import { convertAdToBs } from '../utils/bsAdConverter';
import { isNativeAndroidShell } from '../utils/apiClient';
import { VaultDocument } from '../types';
import { KeeperItem } from '../types/sajiloTypes';

export interface CloudTransport {
  fetchRemoteDoc(
    uid: string,
    col: SyncCollectionName,
    id: string
  ): Promise<Record<string, any> | null>;
  writeRemoteDoc(
    uid: string,
    col: SyncCollectionName,
    id: string,
    payload: Record<string, any>,
    isCreate: boolean
  ): Promise<Record<string, any>>;
  writeSyncAudit?(
    uid: string,
    audit: {
      id: string;
      action: string;
      entityType: string;
      entityId: string;
      deviceId: string;
      summary: string;
    }
  ): Promise<void>;
}

const VALID_DOC_TYPES = new Set([
  'Citizenship',
  'Passport',
  'Driving License',
  'Bluebook',
  'PAN Card',
  'Academic',
  'Other',
]);

const VALID_SAVED_KINDS = new Set(['shortcut', 'saved_service', 'watchlist', 'note']);

export function sanitizeId(raw: string): string {
  const cleaned = String(raw || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 120);
  return cleaned || `id-${Date.now()}`;
}

export function clampStr(val: unknown, maxLen: number, fallback = ''): string {
  const str = typeof val === 'string' ? val.trim() : fallback;
  return str.slice(0, maxLen);
}

/**
 * Normalizes and validates outbound entity payloads strictly against firebase-blueprint.json
 * maxLength/enum constraints before sending to Firestore.
 */
export function buildBlueprintCompliantPayload(
  col: SyncCollectionName,
  uid: string,
  id: string,
  raw: Record<string, any>,
  version: number,
  deviceId: string,
  idempotencyKey: string,
  deleted: boolean
): Record<string, any> {
  const safeId = sanitizeId(id);
  const safeDeviceId = clampStr(deviceId, 64, 'web-device');
  const safeIdemKey = clampStr(idempotencyKey, 128, `idem-${Date.now()}`);

  if (col === 'vaultDocs') {
    const docType = VALID_DOC_TYPES.has(raw.documentType) ? raw.documentType : 'Other';
    const payload: Record<string, any> = {
      id: safeId,
      ownerId: uid,
      title: clampStr(raw.title, 160, 'Untitled Document'),
      documentType: docType,
      docNumber: clampStr(raw.docNumber, 80, 'N/A'),
      issueDate: clampStr(raw.issueDate, 32, new Date().toISOString().slice(0, 10)),
      issuer: clampStr(raw.issuer, 160, 'Government Authority'),
      version: Math.max(1, Math.floor(version)),
      deviceId: safeDeviceId,
      idempotencyKey: safeIdemKey,
      deleted: Boolean(deleted),
      clientUpdatedAt: clampStr(raw.clientUpdatedAt || new Date().toISOString(), 64),
    };
    if (raw.expiryDate) {
      payload.expiryDate = clampStr(raw.expiryDate, 32);
    }
    if (raw.notes) {
      payload.notes = clampStr(raw.notes, 1000);
    }
    return payload;
  }

  if (col === 'keeperItems') {
    const payload: Record<string, any> = {
      id: safeId,
      ownerId: uid,
      title: clampStr(raw.title, 160, 'Untitled Reminder'),
      category: clampStr(raw.category, 40, 'other'),
      expiryDateAd: clampStr(raw.expiryDateAd, 32, new Date().toISOString().slice(0, 10)),
      remindDaysBefore: Math.max(0, Math.min(3650, Math.floor(Number(raw.remindDaysBefore ?? 30)))),
      version: Math.max(1, Math.floor(version)),
      deviceId: safeDeviceId,
      idempotencyKey: safeIdemKey,
      deleted: Boolean(deleted),
      clientUpdatedAt: clampStr(raw.clientUpdatedAt || new Date().toISOString(), 64),
    };
    if (raw.documentNumber) {
      payload.documentNumber = clampStr(raw.documentNumber, 80);
    }
    if (raw.expiryDateBs) {
      payload.expiryDateBs = clampStr(raw.expiryDateBs, 32);
    }
    if (raw.notes) {
      payload.notes = clampStr(raw.notes, 1000);
    }
    return payload;
  }

  // savedItems
  const kind = VALID_SAVED_KINDS.has(raw.kind) ? raw.kind : 'saved_service';
  const tags = Array.isArray(raw.tags)
    ? raw.tags
        .filter((t) => typeof t === 'string')
        .map((t) => clampStr(t, 40))
        .filter(Boolean)
        .slice(0, 10)
    : [];
  const payload: Record<string, any> = {
    id: safeId,
    ownerId: uid,
    kind,
    targetId: clampStr(raw.targetId, 128, safeId),
    title: clampStr(raw.title, 160, 'Saved Item'),
    pinned: Boolean(raw.pinned),
    version: Math.max(1, Math.floor(version)),
    deviceId: safeDeviceId,
    idempotencyKey: safeIdemKey,
    deleted: Boolean(deleted),
  };
  if (raw.subtitle) {
    payload.subtitle = clampStr(raw.subtitle, 240);
  }
  if (tags.length > 0) {
    payload.tags = tags;
  }
  return payload;
}

/**
 * Attempts a non-overlapping field merge when remote and local both changed from baseData.
 * Returns { merged, conflictFields }. If conflictFields is non-empty, requires manual resolution.
 */
export function attemptFieldMerge(
  base: Record<string, any> | undefined,
  local: Record<string, any>,
  remote: Record<string, any>
): { merged: Record<string, any> | null; conflictFields: string[] } {
  const ignored = new Set([
    'id',
    'ownerId',
    'version',
    'deviceId',
    'idempotencyKey',
    'createdAt',
    'updatedAt',
    'clientUpdatedAt',
  ]);
  const allKeys = new Set([
    ...Object.keys(local || {}),
    ...Object.keys(remote || {}),
  ]);
  const merged: Record<string, any> = { ...remote };
  const conflictFields: string[] = [];

  for (const key of allKeys) {
    if (ignored.has(key)) continue;
    const localVal = JSON.stringify(local[key] ?? null);
    const remoteVal = JSON.stringify(remote[key] ?? null);
    if (localVal === remoteVal) continue;

    if (!base) {
      conflictFields.push(key);
      continue;
    }

    const baseVal = JSON.stringify(base[key] ?? null);
    const localChanged = localVal !== baseVal;
    const remoteChanged = remoteVal !== baseVal;

    if (localChanged && !remoteChanged) {
      merged[key] = local[key];
    } else if (!localChanged && remoteChanged) {
      merged[key] = remote[key];
    } else if (localChanged && remoteChanged) {
      conflictFields.push(key);
    }
  }

  return {
    merged: conflictFields.length === 0 ? merged : null,
    conflictFields,
  };
}

export async function getOrCreateDeviceId(): Promise<string> {
  const existing = await offlineDb.getMeta<string>('deviceId');
  if (existing) return existing;

  const prefix = isNativeAndroidShell()
    ? 'apk'
    : typeof window !== 'undefined' &&
        (window.matchMedia?.('(display-mode: standalone)')?.matches ||
          (window.navigator as any)?.standalone)
      ? 'pwa'
      : 'web';

  const rand =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().slice(0, 12)
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  const deviceId = `${prefix}-${rand}`;
  await offlineDb.setMeta('deviceId', deviceId);
  return deviceId;
}

export function createFirestoreTransport(): CloudTransport {
  return {
    async fetchRemoteDoc(uid, col, id) {
      const path = `users/${uid}/${col}/${id}`;
      try {
        const snap = await getDoc(fsDoc(db, 'users', uid, col, id));
        return snap.exists() ? (snap.data() as Record<string, any>) : null;
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, path);
      }
    },

    async writeRemoteDoc(uid, col, id, payload, isCreate) {
      const path = `users/${uid}/${col}/${id}`;
      try {
        const ref = fsDoc(db, 'users', uid, col, id);
        const toWrite: Record<string, any> = {
          ...payload,
          updatedAt: serverTimestamp(),
        };
        if (isCreate) {
          toWrite.createdAt = serverTimestamp();
        }
        await setDoc(ref, toWrite, isCreate ? undefined : { merge: true });
        return { ...payload, updatedAtIso: new Date().toISOString() };
      } catch (err) {
        handleFirestoreError(err, isCreate ? OperationType.CREATE : OperationType.UPDATE, path);
      }
    },

    async writeSyncAudit(uid, audit) {
      const safeId = sanitizeId(audit.id);
      const path = `users/${uid}/syncHistory/${safeId}`;
      try {
        const now = new Date();
        const adDate = now.toISOString().slice(0, 10);
        const bsDate = convertAdToBs(adDate);
        await setDoc(fsDoc(db, 'users', uid, 'syncHistory', safeId), {
          id: safeId,
          ownerId: uid,
          action: clampStr(audit.action, 64),
          entityType: clampStr(audit.entityType, 64),
          entityId: clampStr(audit.entityId, 128),
          deviceId: clampStr(audit.deviceId, 64),
          adDate,
          bsDate,
          summary: clampStr(audit.summary, 320),
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }
    },
  };
}

export interface FlushResult {
  status: SixStateSyncStatus;
  syncedCount: number;
  conflictCount: number;
  failedCount: number;
  lastError: string | null;
}

export class SaarthiSyncEngine {
  private flushingPromise: Promise<FlushResult> | null = null;
  private listeners = new Set<() => void>();

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify(): void {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch {
        // Ignore subscriber error
      }
    });
  }

  async getStatusSnapshot(isOnline: boolean): Promise<{
    status: SixStateSyncStatus;
    pendingCount: number;
    conflictCount: number;
    lastSyncedAtIso: string | null;
    lastError: string | null;
  }> {
    const [outbox, conflicts, lastSyncedAtIso, lastError] = await Promise.all([
      offlineDb.listOutboxItems(),
      offlineDb.listConflicts(),
      offlineDb.getMeta<string>('lastSyncedAtIso'),
      offlineDb.getMeta<string>('lastSyncError'),
    ]);

    let status: SixStateSyncStatus = 'synced';
    if (conflicts.length > 0) {
      status = 'conflict';
    } else if (!isOnline) {
      status = 'offline';
    } else if (outbox.some((i) => i.status === 'failed')) {
      status = 'failed';
    } else if (outbox.some((i) => i.status === 'in_flight')) {
      status = 'syncing';
    } else if (outbox.length > 0) {
      status = 'pending';
    }

    return {
      status,
      pendingCount: outbox.length,
      conflictCount: conflicts.length,
      lastSyncedAtIso,
      lastError,
    };
  }

  async queueUpsert(
    collection: SyncCollectionName,
    id: string,
    data: Record<string, any>,
    uid: string | null
  ): Promise<StoredEntityRecord> {
    const safeId = sanitizeId(id);
    const deviceId = await getOrCreateDeviceId();
    const existing = await offlineDb.getEntity(collection, safeId);
    const nowIso = new Date().toISOString();

    const expectedVersion = existing?.baseVersion ?? existing?.version ?? 0;
    const nextVersion = Math.max(1, (existing?.version ?? 0) + 1);
    const idempotencyKey = `${collection}-${safeId}-${deviceId}-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 6)}`;

    const record: StoredEntityRecord = {
      compositeKey: `${collection}:${safeId}`,
      id: safeId,
      collection,
      data: { ...data, id: safeId },
      baseData: existing?.baseData ?? (existing && !existing.pendingSync ? existing.data : undefined),
      version: nextVersion,
      baseVersion: expectedVersion,
      deviceId,
      idempotencyKey,
      deleted: false,
      pendingSync: true,
      createdAtIso: existing?.createdAtIso || nowIso,
      updatedAtIso: nowIso,
    };

    await offlineDb.putEntity(record);

    // Replace existing pending outbox mutation for same entity to avoid duplicate queue bloat
    const outbox = await offlineDb.listOutboxItems();
    for (const item of outbox) {
      if (item.compositeKey === record.compositeKey && item.status !== 'in_flight') {
        await offlineDb.removeOutboxItem(item.idempotencyKey);
      }
    }

    const outboxItem: SyncOutboxItem = {
      idempotencyKey,
      compositeKey: record.compositeKey,
      collection,
      entityId: safeId,
      operation: 'upsert',
      payload: record.data,
      baseData: record.baseData,
      expectedVersion,
      deviceId,
      retryCount: 0,
      status: 'pending',
      createdAtIso: nowIso,
      updatedAtIso: nowIso,
    };

    await offlineDb.putOutboxItem(outboxItem);
    await offlineDb.setMeta('lastSyncError', null);
    this.notify();

    if (uid && typeof navigator !== 'undefined' && navigator.onLine && isFirebaseConfigured()) {
      void this.flushOutbox(uid);
    }

    return record;
  }

  async queueDelete(
    collection: SyncCollectionName,
    id: string,
    uid: string | null
  ): Promise<void> {
    const safeId = sanitizeId(id);
    const deviceId = await getOrCreateDeviceId();
    const existing = await offlineDb.getEntity(collection, safeId);
    const nowIso = new Date().toISOString();

    const expectedVersion = existing?.baseVersion ?? existing?.version ?? 0;
    const nextVersion = Math.max(1, (existing?.version ?? 0) + 1);
    const idempotencyKey = `${collection}-${safeId}-del-${Date.now().toString(36)}`;

    const record: StoredEntityRecord = {
      compositeKey: `${collection}:${safeId}`,
      id: safeId,
      collection,
      data: existing?.data || { id: safeId },
      baseData: existing?.baseData,
      version: nextVersion,
      baseVersion: expectedVersion,
      deviceId,
      idempotencyKey,
      deleted: true,
      pendingSync: true,
      createdAtIso: existing?.createdAtIso || nowIso,
      updatedAtIso: nowIso,
    };

    await offlineDb.putEntity(record);

    const outbox = await offlineDb.listOutboxItems();
    for (const item of outbox) {
      if (item.compositeKey === record.compositeKey && item.status !== 'in_flight') {
        await offlineDb.removeOutboxItem(item.idempotencyKey);
      }
    }

    await offlineDb.putOutboxItem({
      idempotencyKey,
      compositeKey: record.compositeKey,
      collection,
      entityId: safeId,
      operation: 'delete',
      payload: record.data,
      baseData: record.baseData,
      expectedVersion,
      deviceId,
      retryCount: 0,
      status: 'pending',
      createdAtIso: nowIso,
      updatedAtIso: nowIso,
    });

    this.notify();

    if (uid && typeof navigator !== 'undefined' && navigator.onLine && isFirebaseConfigured()) {
      void this.flushOutbox(uid);
    }
  }

  async flushOutbox(
    uid: string,
    transport: CloudTransport = createFirestoreTransport()
  ): Promise<FlushResult> {
    if (this.flushingPromise) return this.flushingPromise;

    this.flushingPromise = this.runFlush(uid, transport).finally(() => {
      this.flushingPromise = null;
      this.notify();
    });

    return this.flushingPromise;
  }

  private async runFlush(uid: string, transport: CloudTransport): Promise<FlushResult> {
    const outbox = await offlineDb.listOutboxItems();
    let syncedCount = 0;
    let conflictCount = 0;
    let failedCount = 0;
    let lastError: string | null = null;

    if (outbox.length === 0) {
      const existingConflicts = await offlineDb.listConflicts();
      return {
        status: existingConflicts.length > 0 ? 'conflict' : 'synced',
        syncedCount: 0,
        conflictCount: existingConflicts.length,
        failedCount: 0,
        lastError: null,
      };
    }

    for (const item of outbox) {
      if (item.status === 'conflict') {
        conflictCount++;
        continue;
      }

      try {
        await offlineDb.putOutboxItem({
          ...item,
          status: 'in_flight',
          updatedAtIso: new Date().toISOString(),
        });
        this.notify();

        const remote = await transport.fetchRemoteDoc(uid, item.collection, item.entityId);

        // Idempotency replay protection
        if (remote && remote.idempotencyKey === item.idempotencyKey) {
          await offlineDb.removeOutboxItem(item.idempotencyKey);
          const stored = await offlineDb.getEntity(item.collection, item.entityId);
          if (stored) {
            await offlineDb.putEntity({
              ...stored,
              version: Number(remote.version || stored.version),
              baseVersion: Number(remote.version || stored.version),
              baseData: stored.data,
              pendingSync: false,
            });
          }
          syncedCount++;
          continue;
        }

        // Conflict detection if remote moved past our expected version
        if (
          remote &&
          typeof remote.version === 'number' &&
          item.expectedVersion > 0 &&
          remote.version > item.expectedVersion &&
          remote.deviceId !== item.deviceId
        ) {
          const { merged, conflictFields } =
            item.operation === 'delete'
              ? { merged: null, conflictFields: ['deleted'] }
              : attemptFieldMerge(item.baseData, item.payload, remote);

          if (conflictFields.length > 0 || !merged) {
            const conflictRecord: SyncConflictRecord = {
              conflictId: item.compositeKey,
              compositeKey: item.compositeKey,
              collection: item.collection,
              entityId: item.entityId,
              localPayload: item.payload,
              remotePayload: remote,
              basePayload: item.baseData,
              localVersion: item.expectedVersion + 1,
              remoteVersion: remote.version,
              detectedAtIso: new Date().toISOString(),
            };
            await offlineDb.putConflict(conflictRecord);
            await offlineDb.putOutboxItem({
              ...item,
              status: 'conflict',
              lastError: `Conflict on fields: ${conflictFields.join(', ')}`,
              updatedAtIso: new Date().toISOString(),
            });
            conflictCount++;
            continue;
          }

          // Non-overlapping auto-merge succeeded safely!
          const nextVer = remote.version + 1;
          const payload = buildBlueprintCompliantPayload(
            item.collection,
            uid,
            item.entityId,
            merged,
            nextVer,
            item.deviceId,
            item.idempotencyKey,
            false
          );
          await transport.writeRemoteDoc(uid, item.collection, item.entityId, payload, false);
          await offlineDb.removeOutboxItem(item.idempotencyKey);
          await offlineDb.putEntity({
            compositeKey: item.compositeKey,
            id: item.entityId,
            collection: item.collection,
            data: payload,
            baseData: payload,
            version: nextVer,
            baseVersion: nextVer,
            deviceId: item.deviceId,
            idempotencyKey: item.idempotencyKey,
            deleted: false,
            pendingSync: false,
            createdAtIso: storedCreatedAt(remote),
            updatedAtIso: new Date().toISOString(),
          });
          syncedCount++;
          continue;
        }

        const isCreate = !remote;
        const nextVersion = remote ? Number(remote.version || 1) + 1 : 1;
        const payload = buildBlueprintCompliantPayload(
          item.collection,
          uid,
          item.entityId,
          item.payload,
          nextVersion,
          item.deviceId,
          item.idempotencyKey,
          item.operation === 'delete'
        );

        await transport.writeRemoteDoc(uid, item.collection, item.entityId, payload, isCreate);
        await offlineDb.removeOutboxItem(item.idempotencyKey);

        const existingLocal = await offlineDb.getEntity(item.collection, item.entityId);
        await offlineDb.putEntity({
          compositeKey: item.compositeKey,
          id: item.entityId,
          collection: item.collection,
          data: payload,
          baseData: payload,
          version: nextVersion,
          baseVersion: nextVersion,
          deviceId: item.deviceId,
          idempotencyKey: item.idempotencyKey,
          deleted: item.operation === 'delete',
          pendingSync: false,
          createdAtIso: existingLocal?.createdAtIso || new Date().toISOString(),
          updatedAtIso: new Date().toISOString(),
        });

        if (transport.writeSyncAudit) {
          void transport.writeSyncAudit(uid, {
            id: `sync-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
            action: item.operation === 'delete' ? 'DELETE_SYNCED' : isCreate ? 'CREATE_SYNCED' : 'UPDATE_SYNCED',
            entityType: item.collection,
            entityId: item.entityId,
            deviceId: item.deviceId,
            summary: `${item.operation === 'delete' ? 'Deleted' : isCreate ? 'Created' : 'Updated'} ${item.collection} item (${item.entityId}) v${nextVersion}`,
          }).catch(() => {});
        }

        syncedCount++;
      } catch (err: any) {
        failedCount++;
        lastError = err?.message || 'Sync failed';
        await offlineDb.putOutboxItem({
          ...item,
          retryCount: item.retryCount + 1,
          status: 'failed',
          lastError,
          updatedAtIso: new Date().toISOString(),
        });
      }
    }

    const nowIso = new Date().toISOString();
    if (failedCount === 0 && conflictCount === 0) {
      await offlineDb.setMeta('lastSyncedAtIso', nowIso);
      await offlineDb.setMeta('lastSyncError', null);
    } else if (lastError) {
      await offlineDb.setMeta('lastSyncError', lastError);
    }

    const totalConflicts = (await offlineDb.listConflicts()).length;
    const status: SixStateSyncStatus =
      totalConflicts > 0 ? 'conflict' : failedCount > 0 ? 'failed' : 'synced';

    return {
      status,
      syncedCount,
      conflictCount: totalConflicts,
      failedCount,
      lastError,
    };
  }

  async resolveConflict(
    conflictId: string,
    strategy: 'keep_local' | 'keep_remote' | 'merge_both',
    uid: string | null,
    transport: CloudTransport = createFirestoreTransport()
  ): Promise<void> {
    const conflicts = await offlineDb.listConflicts();
    const conflict = conflicts.find((c) => c.conflictId === conflictId);
    if (!conflict) return;

    const deviceId = await getOrCreateDeviceId();
    const outbox = await offlineDb.listOutboxItems();
    for (const item of outbox) {
      if (item.compositeKey === conflict.compositeKey) {
        await offlineDb.removeOutboxItem(item.idempotencyKey);
      }
    }

    if (strategy === 'keep_remote') {
      await offlineDb.putEntity({
        compositeKey: conflict.compositeKey,
        id: conflict.entityId,
        collection: conflict.collection,
        data: conflict.remotePayload,
        baseData: conflict.remotePayload,
        version: conflict.remoteVersion,
        baseVersion: conflict.remoteVersion,
        deviceId: conflict.remotePayload.deviceId || 'cloud',
        idempotencyKey: conflict.remotePayload.idempotencyKey || `remote-${Date.now()}`,
        deleted: Boolean(conflict.remotePayload.deleted),
        pendingSync: false,
        createdAtIso: storedCreatedAt(conflict.remotePayload),
        updatedAtIso: new Date().toISOString(),
      });
      await offlineDb.removeConflict(conflictId);
      this.notify();
      return;
    }

    if (strategy === 'keep_local') {
      const nextVersion = Math.max(conflict.remoteVersion, conflict.localVersion) + 1;
      const idemKey = `res-${conflict.entityId}-${Date.now().toString(36)}`;
      await offlineDb.putEntity({
        compositeKey: conflict.compositeKey,
        id: conflict.entityId,
        collection: conflict.collection,
        data: { ...conflict.localPayload, version: nextVersion },
        baseData: conflict.remotePayload,
        version: nextVersion,
        baseVersion: conflict.remoteVersion,
        deviceId,
        idempotencyKey: idemKey,
        deleted: Boolean(conflict.localPayload.deleted),
        pendingSync: true,
        createdAtIso: storedCreatedAt(conflict.remotePayload),
        updatedAtIso: new Date().toISOString(),
      });
      await offlineDb.putOutboxItem({
        idempotencyKey: idemKey,
        compositeKey: conflict.compositeKey,
        collection: conflict.collection,
        entityId: conflict.entityId,
        operation: conflict.localPayload.deleted ? 'delete' : 'upsert',
        payload: conflict.localPayload,
        baseData: conflict.remotePayload,
        expectedVersion: conflict.remoteVersion,
        deviceId,
        retryCount: 0,
        status: 'pending',
        createdAtIso: new Date().toISOString(),
        updatedAtIso: new Date().toISOString(),
      });
      await offlineDb.removeConflict(conflictId);
      this.notify();
      if (uid) await this.flushOutbox(uid, transport);
      return;
    }

    // merge_both: keep remote in original ID AND create duplicate copy of local record with new ID
    await offlineDb.putEntity({
      compositeKey: conflict.compositeKey,
      id: conflict.entityId,
      collection: conflict.collection,
      data: conflict.remotePayload,
      baseData: conflict.remotePayload,
      version: conflict.remoteVersion,
      baseVersion: conflict.remoteVersion,
      deviceId: conflict.remotePayload.deviceId || 'cloud',
      idempotencyKey: conflict.remotePayload.idempotencyKey || `remote-${Date.now()}`,
      deleted: Boolean(conflict.remotePayload.deleted),
      pendingSync: false,
      createdAtIso: storedCreatedAt(conflict.remotePayload),
      updatedAtIso: new Date().toISOString(),
    });
    const copyId = `${conflict.entityId}-copy-${Date.now().toString(36)}`;
    await offlineDb.removeConflict(conflictId);
    await this.queueUpsert(
      conflict.collection,
      copyId,
      {
        ...conflict.localPayload,
        id: copyId,
        title: `${conflict.localPayload.title || 'Item'} (Device Copy)`.slice(0, 160),
      },
      uid
    );
    if (uid) await this.flushOutbox(uid, transport);
  }

  async ingestRemoteSnapshot(
    collection: SyncCollectionName,
    remoteDocs: Record<string, any>[]
  ): Promise<void> {
    const outbox = await offlineDb.listOutboxItems();
    const pendingKeys = new Set(outbox.map((i) => i.compositeKey));
    const conflicts = await offlineDb.listConflicts();
    const conflictKeys = new Set(conflicts.map((c) => c.compositeKey));

    for (const remote of remoteDocs) {
      const id = sanitizeId(remote.id);
      const compositeKey = `${collection}:${id}`;
      // Do not clobber uncommitted local edits or unresolved conflicts
      if (pendingKeys.has(compositeKey) || conflictKeys.has(compositeKey)) {
        continue;
      }

      const local = await offlineDb.getEntity(collection, id);
      const remoteVersion = Number(remote.version || 1);
      if (!local || remoteVersion >= local.version) {
        await offlineDb.putEntity({
          compositeKey,
          id,
          collection,
          data: remote,
          baseData: remote,
          version: remoteVersion,
          baseVersion: remoteVersion,
          deviceId: remote.deviceId || 'cloud',
          idempotencyKey: remote.idempotencyKey || `snap-${id}`,
          deleted: Boolean(remote.deleted),
          pendingSync: false,
          createdAtIso: storedCreatedAt(remote),
          updatedAtIso: new Date().toISOString(),
        });
      }
    }

    await offlineDb.setMeta('lastSyncedAtIso', new Date().toISOString());
    this.notify();
  }

  attachCloudListeners(
    uid: string,
    onDataChanged: () => void
  ): () => void {
    if (!isFirebaseConfigured() || !auth.currentUser || auth.currentUser.uid !== uid) {
      return () => {};
    }

    const unsubscribers: Unsubscribe[] = [];
    const collections: SyncCollectionName[] = ['vaultDocs', 'keeperItems', 'savedItems'];

    for (const col of collections) {
      const path = `users/${uid}/${col}`;
      const q = query(fsCollection(db, 'users', uid, col), where('ownerId', '==', uid));
      const unsub = onSnapshot(
        q,
        async (snap) => {
          const docs = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
          await this.ingestRemoteSnapshot(col, docs);
          onDataChanged();
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, path);
        }
      );
      unsubscribers.push(unsub);
    }

    return () => {
      unsubscribers.forEach((u) => {
        try {
          u();
        } catch {
          // Ignore unsubscribe failure
        }
      });
    };
  }
}

function storedCreatedAt(docData: Record<string, any>): string {
  if (typeof docData?.createdAt === 'string') return docData.createdAt;
  if (docData?.createdAt?.toDate) {
    try {
      return docData.createdAt.toDate().toISOString();
    } catch {
      // Fallback
    }
  }
  return new Date().toISOString();
}

export interface LegacyLocalSnapshot {
  vaultDocs: VaultDocument[];
  keeperItems: KeeperItem[];
  hasData: boolean;
  detectedAtIso: string;
}

export function detectLegacyLocalData(): LegacyLocalSnapshot {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { vaultDocs: [], keeperItems: [], hasData: false, detectedAtIso: new Date().toISOString() };
  }

  let vaultDocs: VaultDocument[] = [];
  let keeperItems: KeeperItem[] = [];

  try {
    const rawVault = window.localStorage.getItem('saarthi_vault_docs');
    if (rawVault) {
      const parsed = JSON.parse(rawVault);
      if (Array.isArray(parsed)) vaultDocs = parsed;
    }
  } catch {
    // Ignore parse error
  }

  try {
    const rawKeeper = window.localStorage.getItem('saarthi_sajilo_keeper_items');
    if (rawKeeper) {
      const parsed = JSON.parse(rawKeeper);
      if (Array.isArray(parsed)) keeperItems = parsed;
    }
  } catch {
    // Ignore parse error
  }

  const alreadyMigrated = window.localStorage.getItem('saarthi_cloud_migrated_v2');
  return {
    vaultDocs,
    keeperItems,
    hasData: !alreadyMigrated && (vaultDocs.length > 0 || keeperItems.length > 0),
    detectedAtIso: new Date().toISOString(),
  };
}

export function createPreMigrationBackupJson(snapshot: LegacyLocalSnapshot): string {
  return JSON.stringify(
    {
      schema: 'saarthi-pre-migration-backup-v1',
      exportedAtIso: new Date().toISOString(),
      adDate: new Date().toISOString().slice(0, 10),
      bsDate: convertAdToBs(new Date().toISOString().slice(0, 10)),
      vaultDocs: snapshot.vaultDocs,
      keeperItems: snapshot.keeperItems,
    },
    null,
    2
  );
}

export async function migrateLegacyLocalDataToCloud(
  engine: SaarthiSyncEngine,
  uid: string | null,
  transport?: CloudTransport
): Promise<{ vaultMigrated: number; keeperMigrated: number }> {
  const snapshot = detectLegacyLocalData();

  if (typeof window !== 'undefined' && window.localStorage) {
    // Store immutable recovery backup before syncing, never silently wiping user records
    window.localStorage.setItem(
      'saarthi_pre_migration_backup_v1',
      createPreMigrationBackupJson(snapshot)
    );
  }

  let vaultMigrated = 0;
  for (const docItem of snapshot.vaultDocs) {
    const existing = await offlineDb.getEntity('vaultDocs', sanitizeId(docItem.id));
    if (!existing) {
      await engine.queueUpsert('vaultDocs', docItem.id, docItem, uid);
      vaultMigrated++;
    }
  }

  let keeperMigrated = 0;
  for (const keeperItem of snapshot.keeperItems) {
    const existing = await offlineDb.getEntity('keeperItems', sanitizeId(keeperItem.id));
    if (!existing) {
      await engine.queueUpsert('keeperItems', keeperItem.id, keeperItem, uid);
      keeperMigrated++;
    }
  }

  if (uid && (transport || (typeof navigator !== 'undefined' && navigator.onLine))) {
    await engine.flushOutbox(uid, transport);
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('saarthi_cloud_migrated_v2', new Date().toISOString());
  }

  return { vaultMigrated, keeperMigrated };
}

export const syncEngine = new SaarthiSyncEngine();

export async function ensureUserRootDocument(
  uid: string,
  profile: {
    email: string;
    displayName: string;
    phone?: string;
    nagarikId?: string;
    photoUrl?: string;
    preferredTheme: 'light' | 'dark' | 'system';
    preferredLang: 'en' | 'ne';
    devanagariNumerals: boolean;
  }
): Promise<void> {
  if (!isFirebaseConfigured() || !auth.currentUser || auth.currentUser.uid !== uid) return;
  const path = `users/${uid}`;
  try {
    const ref = fsDoc(db, 'users', uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ownerId: uid,
        email: clampStr(profile.email, 254, 'citizen@saarthi.dpdns.org'),
        displayName: clampStr(profile.displayName, 120, 'SAARTHI Citizen'),
        ...(profile.phone ? { phone: clampStr(profile.phone, 32) } : {}),
        ...(profile.nagarikId ? { nagarikId: clampStr(profile.nagarikId, 64) } : {}),
        ...(profile.photoUrl ? { photoUrl: clampStr(profile.photoUrl, 512) } : {}),
        role: 'citizen',
        preferredTheme: profile.preferredTheme,
        preferredLang: profile.preferredLang,
        devanagariNumerals: Boolean(profile.devanagariNumerals),
        version: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      const existingData = snap.data() || {};
      await setDoc(
        ref,
        {
          displayName: clampStr(profile.displayName, 120, existingData.displayName || 'SAARTHI Citizen'),
          ...(profile.phone !== undefined ? { phone: clampStr(profile.phone, 32) } : {}),
          ...(profile.nagarikId !== undefined ? { nagarikId: clampStr(profile.nagarikId, 64) } : {}),
          preferredTheme: profile.preferredTheme,
          preferredLang: profile.preferredLang,
          devanagariNumerals: Boolean(profile.devanagariNumerals),
          version: Number(existingData.version || 1) + 1,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function registerCurrentDeviceSession(
  uid: string,
  appVersion: string,
  syncState: SixStateSyncStatus
): Promise<{ deviceId: string; revoked: boolean }> {
  const deviceId = sanitizeId(await getOrCreateDeviceId());
  if (!isFirebaseConfigured() || !auth.currentUser || auth.currentUser.uid !== uid) {
    return { deviceId, revoked: false };
  }
  const path = `users/${uid}/devices/${deviceId}`;
  const platform: 'web' | 'pwa' | 'android-apk' = isNativeAndroidShell()
    ? 'android-apk'
    : typeof window !== 'undefined' &&
        window.matchMedia?.('(display-mode: standalone)')?.matches
      ? 'pwa'
      : 'web';

  const label =
    platform === 'android-apk'
      ? 'SAARTHI Android App'
      : platform === 'pwa'
        ? 'Installed PWA'
        : typeof navigator !== 'undefined' && /Mobile|Android/i.test(navigator.userAgent)
          ? 'Mobile Browser'
          : 'Desktop Browser';

  try {
    const ref = fsDoc(db, 'users', uid, 'devices', deviceId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        id: deviceId,
        ownerId: uid,
        platform,
        deviceLabel: clampStr(label, 120),
        appVersion: clampStr(appVersion, 32, '2.0.0'),
        revoked: false,
        lastSyncState: syncState,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { deviceId, revoked: false };
    }

    const existing = snap.data() || {};
    if (existing.revoked === true) {
      return { deviceId, revoked: true };
    }

    await setDoc(
      ref,
      {
        deviceLabel: clampStr(label, 120),
        appVersion: clampStr(appVersion, 32, '2.0.0'),
        lastSyncState: syncState,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { deviceId, revoked: false };
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export function subscribeToCurrentDeviceRevocation(
  uid: string,
  deviceId: string,
  onRevoked: () => void
): () => void {
  if (!isFirebaseConfigured() || !auth.currentUser || auth.currentUser.uid !== uid) {
    return () => {};
  }
  const safeDeviceId = sanitizeId(deviceId);
  const path = `users/${uid}/devices/${safeDeviceId}`;
  return onSnapshot(
    fsDoc(db, 'users', uid, 'devices', safeDeviceId),
    (snap) => {
      if (snap.exists() && snap.data()?.revoked === true) {
        onRevoked();
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function listUserDevicesFromCloud(uid: string): Promise<Record<string, any>[]> {
  if (!isFirebaseConfigured() || !auth.currentUser || auth.currentUser.uid !== uid) return [];
  const path = `users/${uid}/devices`;
  try {
    const q = query(fsCollection(db, 'users', uid, 'devices'), where('ownerId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data(), id: d.id }));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}
