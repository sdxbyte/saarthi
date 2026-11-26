# SAARTHI Backup, Export & Account Recovery Guide (`v1.0.0`)

## 1. Citizen Self-Service Backup & Export

From the **Account / Sync Modal (`AuthLoginModal`)** or **Document Vault**, citizens can:
1. **Export Full Account JSON Backup** (`exportUserDataJson` in `SyncAuthContext`): Downloads a timestamped JSON archive containing `vaultDocs`, `keeperItems`, `savedItems`, active profile preferences, and AD/BS export metadata.
2. **Pre-Migration Safety Snapshot**: Before any legacy `localStorage` data is migrated into Cloud Firestore, `migrateLegacyLocalDataToCloud()` writes an untouched JSON snapshot to `localStorage['saarthi_pre_migration_backup_v1']`.
3. **PDF Reports**: Tax, Bluebook, and Receipt PDF exports run client-side via lazy-loaded `jspdf` (`src/utils/pdfExporter.ts`) without requiring cloud storage.

---

## 2. IndexedDB & Firestore Recovery Flows

| Scenario | Recovery Mechanism |
|---|---|
| **Offline Device Loss / App Crash** | `sync_outbox` and `entities` inside `saarthi_offline_v2` persist locally; re-opening SAARTHI replays pending mutations cleanly via `idempotencyKey`. |
| **Multi-Device Overwrite Conflict** | `ConflictResolutionModal` retains both `localPayload`, `remotePayload`, and `basePayload` until explicitly resolved; resolution writes an immutable audit record to `/users/{uid}/syncHistory`. |
| **Accidental Browser Clear (Signed-In User)** | Signing back in pulls authoritative citizen collections from Cloud Firestore (`ai-studio-sarathi-54a6a23c-5552-499c-9038-48dd469ebf11`). |
| **Migration Rollback** | Legacy keys (`saarthi_vault_docs`, `saarthi_sajilo_keeper_items`) are never deleted by migration; `saarthi_pre_migration_backup_v1` holds the exact pre-migration JSON snapshot. |

---

## 3. Code & Operational Backup (GitHub + Express)

- **Source & Schema Authority**: All application code, `firestore.rules`, `firebase-blueprint.json`, SQL schemas (`/database/`, `/migrations/`), and release metadata are versioned in `sdxbyte/saarthi`.
- **Manual Repo Sync**: Run `npm run sync:github` with `GITHUB_TOKEN` set in environment (automatic post-build git pushing was intentionally disabled for safety).
- **Platform Admin Audit & Snapshot Endpoints**: Available to authenticated admins under `/api/admin/*` (`src/serverApp.ts`) with full append-only dual AD/BS audit logging.
