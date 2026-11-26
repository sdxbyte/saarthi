# SAARTHI (सारथि) — Cross-Platform Civic & Financial Platform

**Version:** `1.9.1` | **Web:** `https://saarthi.dpdns.org` | **Android Package:** `com.sdxbyte.saarthi` | **Repository:** `sdxbyte/saarthi`

SAARTHI is a unified civic, capital-market, and personal citizen utility platform for Nepal built to share one account system, one cloud data layer, one offline synchronization engine, and one hybrid Material 3 + fintech design system across:

1. **Live Website & Desktop Browser** (`https://saarthi.dpdns.org` / Vercel)
2. **Progressive Web App (PWA)** (`vite-plugin-pwa` offline precache + Workbox runtime cache)
3. **Standalone Android APK** (Capacitor 7 native shell syncing with `saarthi.dpdns.org`)

---

## Core Architecture Highlights

- **Unified Identity & Shared Cloud Storage**: Firebase Authentication (Google Sign-In) + Cloud Firestore (`ai-studio-sarathi-54a6a23c-5552-499c-9038-48dd469ebf11`, database project `friendly-canto-3ds98`) with strict owner-isolated security rules (`firestore.rules`) plus local-only workspace mode.
- **Offline-First Sync Engine**: Browser/WebView `IndexedDB` (`saarthi_offline_v2`) stores entities (`vaultDocs`, `keeperItems`, `savedItems`), deduplicated mutation outbox (`sync_outbox`), versioned idempotency keys, field-level auto-merge, and interactive 3-way conflict resolution UI (`Synced`, `Syncing`, `Offline`, `Pending changes`, `Sync failed`, `Conflict detected`).
- **Safe Local-to-Cloud Migration**: Signing in automatically exports an immutable pre-migration JSON recovery snapshot (`saarthi_pre_migration_backup_v1`) before migrating legacy `localStorage` data without deleting local backups.
- **Authentic Financial & Capital Market Feeds (Rule 16)**: Strict zero-fabrication policy across NRB Forex, NEPSE, IPO/CDSC, Kalimati Wholesale, Bullion, Fuel, and News. Unavailable external feeds display `"Official data is currently unavailable."` rather than synthetic values.
- **Hybrid Navy/Blue Design System**: Accessible Light and Dark themes (`ThemeContext`), `Outfit` / `Plus Jakarta Sans` / `JetBrains Mono` (`tabular-nums`), responsive desktop header, and 5-item Mobile Bottom Navigation (`< 768px`).
- **In-App Android APK Updater**: Native `SaarthiUpdater` Capacitor plugin checks `/api/app/sync-info` + GitHub Releases (`sdxbyte/saarthi`) and downloads/installs signed APKs from trusted HTTPS hosts.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template (never commit real secrets)
cp .env.example .env

# 3. Start Express + Vite dev server on http://localhost:3000
npm run dev
```

### Verification & Build Commands

```bash
npm test                     # Run all Vitest suites (security, sync engine, rules, UI, calculators)
npx eslint firestore.rules   # Validate Firestore security rules AST
npm run lint                 # TypeScript strict check (tsc --noEmit)
npm run build                # Build Vite SPA + Express + Vercel bundles
npm run android:sync         # Build native-flagged dist/ and sync Capacitor Android project
```

---

## Documentation Index

- `CHANGELOG.md` & `docs/CHANGELOG.md` — Dual AD/BS release history
- `docs/ARCHITECTURE.md` — System topology, Firebase Spark quotas, and data flow
- `docs/SECURITY.md` — Firestore RBAC rules, server protections, and secret hygiene
- `docs/SYNC-ENGINE.md` — IndexedDB schema, outbox queue, idempotency, and conflict resolution
- `docs/ANDROID-UPDATES.md` — Capacitor architecture, in-APK updater, and keystore requirements
- `docs/DEPLOYMENT.md` — Vercel, GitHub Actions CI/CD, and Firebase rule deployment
- `docs/BACKUP-RESTORE.md` — JSON export/import, pre-migration backups, and disaster recovery
- `docs/TEST-REPORT.md` — Verified Vitest, ESLint, bundle chunk, and runtime checks
