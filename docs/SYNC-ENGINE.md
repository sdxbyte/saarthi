# SAARTHI Online / Offline Sync Engine (`v1.0.0`)

Implemented in `/src/services/offlineDb.ts`, `/src/services/syncEngine.ts`, and `/src/context/SyncAuthContext.tsx`.

---

## 1. Local Persistence Layer (`IndexedDB`)

- **Database Name**: `saarthi_offline_v2` (schema v1) with automatic in-memory fallback when IndexedDB is unavailable in constrained runtimes.
- **Object Stores**:
  - `entities`: Authoritative local entity cache keyed by `${collection}:${id}` (`vaultDocs`, `keeperItems`, `savedItems`), tracking `version`, `baseVersion`, `deviceId`, `idempotencyKey`, `deleted`, `pendingSync`, `createdAtIso`, and `updatedAtIso`.
  - `sync_outbox`: Persistent mutation queue preserving mutations offline across app restarts/reloads, deduplicating repeated edits to the same `${collection}:${id}` before upload.
  - `conflicts`: Stores unresolved 3-way conflict records (`basePayload`, `localPayload`, `remotePayload`, `localVersion`, `remoteVersion`) until resolved via `ConflictResolutionModal`.
  - `sync_meta`: Stores device identifier (`saarthi_device_id`) and last successful sync timestamps.

---

## 2. Six-State Visible Sync Indicator (`SyncStatusBadge`)

| Status | Meaning |
|---|---|
| **Synced** | Outbox empty, online, and zero unresolved conflicts |
| **Syncing** | Active flush/reconciliation in flight with Firestore |
| **Offline** | Device lacks network connectivity; edits continue queueing locally |
| **Pending changes (N)** | Online with queued outbox mutations awaiting server confirmation |
| **Sync failed** | Last flush attempt encountered a network/permission error (safe retry enabled) |
| **Conflict detected (N)** | Non-trivial multi-device concurrent edit requires user resolution |

**Honesty Rule**: `Synced` is never reported until Firestore confirms the write (`writeRemoteDoc` resolves).

---

## 3. Multi-Device Conflict Detection & Resolution

1. Every synced document carries a monotonic integer `version`, `deviceId`, and deterministic `idempotencyKey`.
2. **Idempotency Replay Guard**: If the remote document already has the identical `idempotencyKey`, the sync engine recognizes the retried ACK and clears the outbox entry without duplicating server writes.
3. **Version Divergence Check**: When `remote.version > expectedVersion` from another `deviceId`:
   - **Auto-Merge**: If a `baseData` snapshot exists and local vs. remote modified **disjoint fields**, `syncEngine` merges both field sets cleanly, increments version, and uploads without prompting.
   - **Manual Conflict Modal**: If both devices edited overlapping fields (e.g., `docNumber` changed both on Website and APK), `ConflictResolutionModal` presents **Keep Local**, **Keep Cloud**, and **Merge Field-by-Field** options and logs the resolution in `/users/{uid}/syncHistory`.

---

## 4. Safe Legacy `localStorage` Migration

Upon Firebase Google Sign-In, `detectLegacyLocalData()` checks legacy browser keys (`saarthi_vault_docs`, `saarthi_sajilo_keeper_items`):
1. Writes an immutable recovery copy to `saarthi_pre_migration_backup_v1` (with AD/BS timestamp).
2. Migrates items via `queueUpsert` -> `flushOutbox` without overwriting existing newer cloud versions or deleting legacy keys prematurely.
