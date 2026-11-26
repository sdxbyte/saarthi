# SAARTHI Android APK & Update Architecture (`v1.0.0`)

## 1. Capacitor 7 Native App Experience (`com.sdxbyte.saarthi`)

Configured via `/capacitor.config.ts`:
- `webDir`: `'dist'` — APK bundles offline-capable Vite web assets locally so core features (`Document Vault`, `Sajilo Keeper`, `BS/AD Calendar`, `Tax/Bluebook/EMI calculators`, `Offline Outbox`) launch and operate immediately with **zero internet**.
- **Native App UI (`isNativeAndroidShell()`)**:
  - Uses a unified Material 3 TopAppBar with sub-screen Back button & dynamic title, Android hardware Back navigation (`MainActivity.java`), Android status/navigation bar Light/Dark color sync (`setSystemBarsTheme`), tactile haptic feedback (`appFeedback.ts`), and hides marketing website headers/footers.
  - Opens directly to an app-first Mobile Launcher (live Kathmandu clock & dual-date, search bar, swipeable NRB/Gold/NEPSE/Fuel strip, 4-column quick app grid, 1-tap Live Nepali FM Radio player, and Offline Vault card).
- **Real-Time Server Synchronization (`src/utils/apiClient.ts`)**: `installUniversalApiFetch()` routes relative `/api/*` requests over HTTPS to `https://saarthi.dpdns.org` with `X-Saarthi-Client: android-apk`.
- **Cloud User Account Sync**: Firebase Auth + Cloud Firestore syncs documents, reminders, saved shortcuts, and layout preferences identically between Website and APK.

---

## 2. Background Pre-Download & 1-Tap Install Updater

Android OS security does not allow standard non-system/non-MDM apps to silently overwrite themselves without user confirmation in Android's `PackageInstaller`. SAARTHI implements the smoothest possible compliant update experience:

1. **Automatic Background Pre-Download**:
   - `liveSyncEngine.ts` + `AppUpdateChecker.tsx` check `/api/app/sync-info` and GitHub Releases (`sdxbyte/saarthi`).
   - When a newer release is found and Auto-Update is enabled, `SaarthiUpdaterPlugin.java` downloads the APK to a temporary cache file in the background, validates it via `PackageManager.getPackageArchiveInfo(...)` (verifying package ID `com.sdxbyte.saarthi`, higher `versionCode`, and signing certificate match), and saves `saarthi-update.apk` + `saarthi-update.meta.json`.
2. **Instant Install Prompt & Resume from Permission Settings**:
   - Once cached, `SaarthiUpdaterPlugin` opens Android's `PackageInstaller` (`ACTION_VIEW` via `FileProvider`) if permission is granted, OR keeps the pre-downloaded APK ready with a persistent **`Install Downloaded Update`** button waiting for the user tap (`0s` download wait).
   - If Android `"Install unknown apps"` permission is needed, tapping **`Allow & Install Update`** opens Android Settings; returning to SAARTHI automatically detects the granted permission and launches the installer immediately.
3. **Security Allowlist**:
   - Download URLs and HTTP redirects are strictly allowlisted in Java (`isAllowedApkUrl`) to `github.com`, `*.github.com`, `*.githubusercontent.com`, `saarthi.dpdns.org`, and `*.saarthi.dpdns.org`.

---

## 3. Signing Keystore Warning (Important for Seamless In-Place Upgrades)

- In `.github/workflows/build-playstore-aab.yml`, if GitHub Secrets `ANDROID_KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, and `KEY_PASSWORD` are **not** configured, CI generates an **ephemeral keystore** per run.
- **Operational Impact**: Android's `PackageInstaller` requires matching signing certificates for in-place upgrades over an existing installation. `SaarthiUpdaterPlugin` checks certificate SHA-256 parity (`signatureMatches`) before launching the installer and alerts the user if a one-time reinstall is required due to ephemeral CI keys. Configuring those 4 secrets in GitHub Settings -> Secrets and variables -> Actions enables zero-uninstall in-place upgrades across every future release.
