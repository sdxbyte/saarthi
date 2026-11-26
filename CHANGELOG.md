# Changelog - SAARTHI Platform

All notable changes to the SAARTHI project are documented in this file.

## [1.0.0] - 2026-11-26 A.D. / २०८३-०८-१० B.S.

### Title
SAARTHI v1.0.0 — Unified Web, PWA & Native Android App Release

### Added
- **App-First Native Android APK Experience (`isNativeAndroidShell()`)**: Material 3 TopAppBar with sub-screen Back navigation, Android hardware back-stack handling (`MainActivity.java`), Android status/navigation bar theme sync, tactile haptics, and distraction-free layout hiding marketing headers/footers.
- **APK Mobile Home Launcher & Companion Strip**: Kathmandu greeting & live clock card, thumb-first search bar, horizontal swipeable live NRB/Gold/NEPSE/Fuel market strip, 4-column quick services grid (12 tiles), 1-tap Live Nepali FM Radio player, and Offline Vault readiness card.
- **Background Pre-Download & 1-Tap Install Updater (`SaarthiUpdaterPlugin.java`, `AppUpdateChecker.tsx`)**: Automatically downloads new APK releases in the background, validates `PackageManager` package archive & signing key parity, retains verified cached APKs for instant 1-tap **Install Downloaded Update** confirmation, and resumes installation immediately after granting Android `"Install unknown apps"` permission.
- **Unified Account Center (`/account`) & Cross-Device Cloud Sync**: Synchronizes citizen documents, keeper reminders, saved items, and device sessions across Web, PWA, and Android APK via Firebase Auth + Cloud Firestore backed by resilient offline-first IndexedDB storage (`saarthi_offline_v2`) and 3-way conflict resolution.
- **Authentic Nepal Civic & Financial Suites (Rule 16)**: Official NRB Forex (160+ world currencies), NEPSE & CDSC IPO tools, Kalimati Wholesale Bazar, FENEGOSIDA Gold/Silver, NOC fuel tariffs, IRD income tax & provincial Bluebook calculators, and DoTM services.

### Updated
- Synchronized version baseline cleanly at `v1.0.0` across `package.json`, `vite.config.ts`, UI components, documentation, API endpoints, and GitHub Actions APK/deployment pipelines.
- Lowered `/api/app/sync-info` GitHub release cache TTL to 20s with `?force=1` bypass for rapid update detection.
- Enforced strict Rule 16 unavailable-data states whenever external official feeds cannot be reached.
