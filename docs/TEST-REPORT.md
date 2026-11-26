# SAARTHI Verification & Test Report (`v1.0.0`)

**Verified Date:** `2026-11-26 A.D.` / `२०८३-०८-१० B.S.` (`Asia/Kathmandu`)

---

## 1. Automated Test Suite (`npm test` -> `vitest run`)

**Result:** **5 Test Files Passed (5/5) | 36 Tests Passed (36/36)**

| Test File | Scope Covered | Tests Passed |
|---|---|---|
| `tests/serverSecurityAndFlows.test.ts` | Auth boundaries, RBAC, SSRF host blocking, email recipient pinning, `/api/receipt/scan` honesty, `/api/meroshare/auto-apply-batch` auth guard, `/api/live/*` feeds | **12 / 12** |
| `tests/financialCalculators.test.ts` | Nepal IRD income tax slabs, EMI calculations, Provincial Bluebook tax rates | **9 / 9** |
| `tests/firestore.rules.test.ts` | Structural & adversarial rule invariants on `firestore.rules` (owner isolation, parent gate, immutable fields, append-only `syncHistory`, closed ticket lock) | **4 / 4** |
| `tests/offlineSyncEngine.test.ts` | `IndexedDB` outbox queueing, deduplication, idempotency replay guard, auto-merge on disjoint fields, manual `keep_local`/`keep_remote` conflict resolution, immutable pre-migration backup | **5 / 5** |
| `tests/uiAndTheme.test.tsx` | Light/Dark theme persistence, 6-state `SyncStatusBadge`, 5-item `MobileBottomNav`, Zero-Mock unavailable feed states, clean `DocumentVaultView`, Rule 8 Donation unpublished & published states | **6 / 6** |

---

## 2. Security Rules Linting (`npx eslint firestore.rules`)

- **Parser/Plugin:** `eslint` (`^10.15.0`) + `@firebase/eslint-plugin-security-rules` (`eslint.config.mjs`)
- **Result:** Passed with **0 errors** (exit code `0`).

---

## 3. Production Build & Bundle Splitting (`npm run build`)

- **Frontend (`vite build`)**: `2,476` modules transformed in `13.48s` with **zero chunk size warnings** (`chunkSizeWarningLimit: 700`).
- **Key Split Chunks**:
  - `vendor-react`: `9.61 kB` (gzip `3.08 kB`)
  - `vendor-dates`: `17.95 kB` (gzip `3.19 kB`)
  - `vendor-ui`: `184.86 kB` (gzip `53.81 kB`)
  - `vendor-pdf` (dynamic `jspdf` import): `391.94 kB` (gzip `129.36 kB`)
  - `vendor-firebase`: `672.05 kB` (gzip `166.93 kB`)
  - PWA Workbox SW: `dist/sw.js` (76 precached entries, `5800.62 KiB`)
- **Backend (`esbuild`)**:
  - `dist/server.cjs` (`604.9 kb`)
  - `dist/vercel-server.cjs` (`601.2 kb`)

---

## 4. Live Local Runtime Endpoint Checks (`http://localhost:3000`)

Verified after `restart_dev_server`:
- `GET /` -> HTTP `200` (HTML shell with `#root`)
- `GET /api/health` -> HTTP `200` (`{"status":"ok","service":"SAARTHI Tech Backend"}`)
- `GET /api/time` -> HTTP `200` (`2026-11-22 A.D.` / `2083-08-06 B.S.`, `Asia/Kathmandu`)
- `GET /api/live/forex` -> HTTP `200` (Official NRB reference rates)
- `GET /api/live/kalimati` -> HTTP `200` (Honest `isLive: false` / `OFFICIAL_FEED_UNAVAILABLE` when external endpoint unreachable—zero fake numbers)
- `GET /api/live/sources/health` -> HTTP `200` (Live concurrent probe statuses)
- `GET /api/app/sync-info` -> HTTP `200` (`1.0.0`)
- `GET /.well-known/assetlinks.json` -> HTTP `200` (Android package `com.sdxbyte.saarthi`)
