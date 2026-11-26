import { describe, it, expect, beforeEach } from 'vitest';
import { IDBFactory } from 'fake-indexeddb';
import {
  offlineDb,
  setIndexedDbFactoryForTests,
  resetOfflineDbMemoryForTests,
} from '../src/services/offlineDb';
import {
  SaarthiSyncEngine,
  CloudTransport,
  migrateLegacyLocalDataToCloud,
  detectLegacyLocalData,
} from '../src/services/syncEngine';

class InMemoryCloudMock implements CloudTransport {
  store = new Map<string, Record<string, any>>();
  writes = 0;

  async fetchRemoteDoc(uid: string, col: string, id: string) {
    return this.store.get(`${uid}/${col}/${id}`) || null;
  }

  async writeRemoteDoc(uid: string, col: string, id: string, payload: Record<string, any>) {
    this.writes++;
    const saved = { ...payload, updatedAtIso: new Date().toISOString() };
    this.store.set(`${uid}/${col}/${id}`, saved);
    return saved;
  }

  async writeSyncAudit() {
    // No-op in unit test
  }
}

describe('SAARTHI Online/Offline Sync Engine (IndexedDB + Outbox + Conflict Resolution)', () => {
  let engine: SaarthiSyncEngine;
  let cloud: InMemoryCloudMock;
  const uid = 'citizen-uid-001';

  beforeEach(async () => {
    setIndexedDbFactoryForTests(new IDBFactory());
    resetOfflineDbMemoryForTests();
    await offlineDb.clearAll();
    engine = new SaarthiSyncEngine();
    cloud = new InMemoryCloudMock();
  });

  it('queues offline edits, deduplicates repeated mutations, and flushes cleanly once online', async () => {
    // Queue 2 edits offline for same doc -> deduplicated into 1 outbox item
    await engine.queueUpsert(
      'vaultDocs',
      'doc-cit-1',
      {
        title: 'Citizenship Draft 1',
        documentType: 'Citizenship',
        docNumber: '27-01-75-001',
        issueDate: '2020-01-10',
        issuer: 'DAO Kathmandu',
      },
      null
    );
    await engine.queueUpsert(
      'vaultDocs',
      'doc-cit-1',
      {
        title: 'Citizenship Final',
        documentType: 'Citizenship',
        docNumber: '27-01-75-001',
        issueDate: '2020-01-10',
        issuer: 'DAO Kathmandu',
      },
      null
    );

    const offlineStatus = await engine.getStatusSnapshot(false);
    expect(offlineStatus.status).toBe('offline');
    expect(offlineStatus.pendingCount).toBe(1);

    const onlinePending = await engine.getStatusSnapshot(true);
    expect(onlinePending.status).toBe('pending');

    const flush = await engine.flushOutbox(uid, cloud);
    expect(flush.status).toBe('synced');
    expect(flush.syncedCount).toBe(1);
    expect(cloud.writes).toBe(1);

    const syncedDoc = await cloud.fetchRemoteDoc(uid, 'vaultDocs', 'doc-cit-1');
    expect(syncedDoc?.title).toBe('Citizenship Final');
    expect(syncedDoc?.version).toBe(1);

    const finalSnap = await engine.getStatusSnapshot(true);
    expect(finalSnap.status).toBe('synced');
    expect(finalSnap.pendingCount).toBe(0);
  });

  it('prevents duplicate server writes via idempotency key replay protection', async () => {
    const rec = await engine.queueUpsert(
      'savedItems',
      'save-forex',
      {
        kind: 'saved_service',
        targetId: 'forex',
        title: 'NRB Forex Rates',
        pinned: true,
      },
      null
    );

    // Pre-populate cloud with exact same idempotencyKey (simulating retry after lost ACK)
    cloud.store.set(`${uid}/savedItems/save-forex`, {
      id: 'save-forex',
      ownerId: uid,
      kind: 'saved_service',
      targetId: 'forex',
      title: 'NRB Forex Rates',
      pinned: true,
      version: 1,
      idempotencyKey: rec.idempotencyKey,
      deviceId: rec.deviceId,
      deleted: false,
    });

    const flush = await engine.flushOutbox(uid, cloud);
    expect(flush.syncedCount).toBe(1);
    expect(cloud.writes).toBe(0); // Did not replay write!
  });

  it('auto-merges non-overlapping field edits from two devices without conflict', async () => {
    await engine.queueUpsert(
      'vaultDocs',
      'doc-pass-1',
      {
        title: 'Original Passport',
        documentType: 'Passport',
        docNumber: 'PA100001',
        issueDate: '2024-05-01',
        issuer: 'Dept of Passports',
      },
      null
    );
    await engine.flushOutbox(uid, cloud);

    // Another device updates `issuer` remotely to version 2
    cloud.store.set(`${uid}/vaultDocs/doc-pass-1`, {
      id: 'doc-pass-1',
      ownerId: uid,
      title: 'Original Passport',
      documentType: 'Passport',
      docNumber: 'PA100001',
      issueDate: '2024-05-01',
      issuer: 'Department of Passports Nepal',
      version: 2,
      deviceId: 'apk-other-device',
      idempotencyKey: 'remote-v2',
      deleted: false,
    });

    // Local device updates only `title`
    await engine.queueUpsert(
      'vaultDocs',
      'doc-pass-1',
      {
        title: 'e-Passport Book',
        documentType: 'Passport',
        docNumber: 'PA100001',
        issueDate: '2024-05-01',
        issuer: 'Dept of Passports',
      },
      null
    );

    const flush = await engine.flushOutbox(uid, cloud);
    expect(flush.status).toBe('synced');
    expect(flush.conflictCount).toBe(0);

    const merged = await cloud.fetchRemoteDoc(uid, 'vaultDocs', 'doc-pass-1');
    expect(merged?.title).toBe('e-Passport Book');
    expect(merged?.issuer).toBe('Department of Passports Nepal');
    expect(merged?.version).toBe(3);
  });

  it('detects colliding edits on the same field and resolves via keep_local, keep_remote, and merge_both', async () => {
    await engine.queueUpsert(
      'vaultDocs',
      'doc-lic-1',
      {
        title: 'Driving License',
        documentType: 'Driving License',
        docNumber: 'LIC-001',
        issueDate: '2023-01-01',
        issuer: 'DoTM',
      },
      null
    );
    await engine.flushOutbox(uid, cloud);

    // Remote device edits docNumber -> version 2
    cloud.store.set(`${uid}/vaultDocs/doc-lic-1`, {
      id: 'doc-lic-1',
      ownerId: uid,
      title: 'Driving License',
      documentType: 'Driving License',
      docNumber: 'LIC-REMOTE-222',
      issueDate: '2023-01-01',
      issuer: 'DoTM',
      version: 2,
      deviceId: 'apk-remote',
      idempotencyKey: 'rem-2',
      deleted: false,
    });

    // Local device edits same field docNumber
    await engine.queueUpsert(
      'vaultDocs',
      'doc-lic-1',
      {
        title: 'Driving License',
        documentType: 'Driving License',
        docNumber: 'LIC-LOCAL-111',
        issueDate: '2023-01-01',
        issuer: 'DoTM',
      },
      null
    );

    const flush = await engine.flushOutbox(uid, cloud);
    expect(flush.status).toBe('conflict');
    expect(flush.conflictCount).toBe(1);

    const conflicts = await offlineDb.listConflicts();
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].localPayload.docNumber).toBe('LIC-LOCAL-111');
    expect(conflicts[0].remotePayload.docNumber).toBe('LIC-REMOTE-222');

    // Resolve via merge_both: preserves remote doc AND creates separate Device Copy
    await engine.resolveConflict(conflicts[0].conflictId, 'merge_both', uid, cloud);
    const remainingConflicts = await offlineDb.listConflicts();
    expect(remainingConflicts).toHaveLength(0);

    const allDocs = await offlineDb.listEntities('vaultDocs');
    expect(allDocs.length).toBe(2);
    expect(allDocs.some((d) => d.data.docNumber === 'LIC-REMOTE-222')).toBe(true);
    expect(allDocs.some((d) => d.data.docNumber === 'LIC-LOCAL-111')).toBe(true);

    // Verify keep_remote & keep_local resolution paths cleanly too
    cloud.store.set(`${uid}/vaultDocs/doc-lic-1`, {
      ...cloud.store.get(`${uid}/vaultDocs/doc-lic-1`),
      docNumber: 'LIC-REMOTE-333',
      version: 4,
      deviceId: 'apk-remote',
    });
    await engine.queueUpsert(
      'vaultDocs',
      'doc-lic-1',
      {
        title: 'Driving License',
        documentType: 'Driving License',
        docNumber: 'LIC-LOCAL-444',
        issueDate: '2023-01-01',
        issuer: 'DoTM',
      },
      null
    );
    const flush2 = await engine.flushOutbox(uid, cloud);
    expect(flush2.status).toBe('conflict');
    const c2 = await offlineDb.listConflicts();
    await engine.resolveConflict(c2[0].conflictId, 'keep_local', uid, cloud);
    const updatedRemote = await cloud.fetchRemoteDoc(uid, 'vaultDocs', 'doc-lic-1');
    expect(updatedRemote?.docNumber).toBe('LIC-LOCAL-444');

    // Keep remote check
    cloud.store.set(`${uid}/vaultDocs/doc-lic-1`, {
      ...updatedRemote,
      docNumber: 'LIC-REMOTE-555',
      version: Number(updatedRemote?.version || 5) + 2,
      deviceId: 'apk-remote',
    });
    await engine.queueUpsert(
      'vaultDocs',
      'doc-lic-1',
      {
        title: 'Driving License',
        documentType: 'Driving License',
        docNumber: 'LIC-LOCAL-666',
        issueDate: '2023-01-01',
        issuer: 'DoTM',
      },
      null
    );
    await engine.flushOutbox(uid, cloud);
    const c3 = await offlineDb.listConflicts();
    await engine.resolveConflict(c3[0].conflictId, 'keep_remote', uid, cloud);
    const finalLocal = await offlineDb.getEntity('vaultDocs', 'doc-lic-1');
    expect(finalLocal?.data.docNumber).toBe('LIC-REMOTE-555');
  });

  it('creates an immutable pre-migration JSON backup and migrates legacy localStorage data without loss', async () => {
    const store: Record<string, string> = {
      saarthi_vault_docs: JSON.stringify([
        {
          id: 'legacy-1',
          title: 'Legacy Citizenship',
          documentType: 'Citizenship',
          docNumber: 'LEG-123',
          issueDate: '2021-02-02',
          issuer: 'DAO Lalitpur',
          createdAt: '2021-02-02',
        },
      ]),
      saarthi_sajilo_keeper_items: JSON.stringify([
        {
          id: 'leg-keep-1',
          title: 'Annual Bluebook Renewal',
          category: 'bluebook',
          expiryDateAd: '2027-03-01',
          remindDaysBefore: 30,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
      ]),
    };

    (globalThis as any).window = {
      localStorage: {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => {
          store[k] = v;
        },
      },
    };

    try {
      const detected = detectLegacyLocalData();
      expect(detected.hasData).toBe(true);
      expect(detected.vaultDocs).toHaveLength(1);
      expect(detected.keeperItems).toHaveLength(1);

      const res = await migrateLegacyLocalDataToCloud(engine, uid, cloud);
      expect(res.vaultMigrated).toBe(1);
      expect(res.keeperMigrated).toBe(1);

      // Recovery backup written & original localStorage untouched
      expect(store['saarthi_pre_migration_backup_v1']).toBeTruthy();
      expect(store['saarthi_vault_docs']).toBeTruthy();

      const cloudVault = await cloud.fetchRemoteDoc(uid, 'vaultDocs', 'legacy-1');
      expect(cloudVault?.docNumber).toBe('LEG-123');
    } finally {
      delete (globalThis as any).window;
    }
  });

  it('recovers gracefully without crashing when native IDBDatabase.transaction throws or object stores are missing', async () => {
    const brokenFactory = {
      open: () => {
        const req: any = {
          onupgradeneeded: null,
          onsuccess: null,
          onerror: null,
          onblocked: null,
          result: {
            objectStoreNames: { contains: () => true },
            close: () => {},
            transaction: () => {
              throw new Error('transaction@[native code] InvalidStateError');
            },
          },
        };
        queueMicrotask(() => req.onsuccess?.());
        return req;
      },
      deleteDatabase: () => {
        const req: any = { onsuccess: null, onerror: null, onblocked: null };
        queueMicrotask(() => req.onsuccess?.());
        return req;
      },
    } as unknown as IDBFactory;

    setIndexedDbFactoryForTests(brokenFactory);
    resetOfflineDbMemoryForTests();

    // Must not throw even when db.transaction throws natively
    const initial = await offlineDb.listEntities('vaultDocs');
    expect(initial).toEqual([]);

    await engine.queueUpsert(
      'vaultDocs',
      'doc-fallback-1',
      {
        title: 'Fallback Safe Citizenship',
        documentType: 'Citizenship',
        docNumber: 'FB-001',
        issueDate: '2025-01-01',
        issuer: 'DAO',
      },
      null
    );

    const listed = await offlineDb.listEntities('vaultDocs');
    expect(listed).toHaveLength(1);
    expect(listed[0].data.title).toBe('Fallback Safe Citizenship');

    const status = await engine.getStatusSnapshot(false);
    expect(status.pendingCount).toBe(1);
    expect(status.status).toBe('offline');
  });
});
