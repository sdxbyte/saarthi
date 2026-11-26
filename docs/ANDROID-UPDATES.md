# SAARTHI Android APK & Update Architecture (`v2.0.0`)

## 1. Capacitor 7 Standalone Shell (`com.sdxbyte.saarthi`)

Configured via `/capacitor.config.ts`:
- `webDir`: `'dist'` — APK bundles offline-capable Vite web assets locally so core features (`Document Vault`, `Sajilo Keeper`, `BS/AD Calendar`, `Tax/Bluebook/EMI calculators`, `Offline Outbox`) launch and operate immediately with **zero internet**.
- **Real-Time Server Synchronization (`src/utils/apiClient.ts`)**: When running inside Capacitor (`capacitor:` scheme or `VITE_IS_NATIVE_APK=true`), `installUniversalApiFetch()` intercepts relative `/api/*` requests and routes them over HTTPS to `https://saarthi.dpdns.org` with `X-Saarthi-Client: android-apk`.
- **Cloud User Account Sync**: Signing in with Firebase Auth + Cloud Firestore syncs personal documents, reminders, saved shortcuts, and preferences identically between Website and APK.

---

## 2. How Updates Reach Android Safely

Unlike live website deployments (Vercel updates HTML/JS automatically on refresh), Android security restricts silent arbitrary native code replacement:

1. **Real-Time Content & API Data**: Updated immediately from `https://saarthi.dpdns.org/api/*` and Firestore without rebuilding the APK.
2. **UI / Native Binary Updates (In-APK Signed Updater)**:
   - `scripts/inject-android-updater.mjs` injects `SaarthiUpdaterPlugin.java` (`@CapacitorPlugin(name = "SaarthiUpdater")`) and `saarthi_file_paths.xml` (`FileProvider`) into the Android build.
   - `AppUpdateChecker.tsx` & `liveSyncEngine.ts` poll `/api/app/sync-info` and GitHub Releases (`sdxbyte/saarthi`).
   - Download URLs are strictly allowlisted in native Java (`isAllowedApkUrl`) to `https://github.com`, `*.github.com`, `*.githubusercontent.com`, `saarthi.dpdns.org`, and `*.saarthi.dpdns.org`.
   - When an update is approved, the APK downloads the signed `.apk` into cache, checks Android `"Install unknown apps"` permission (`ACTION_MANAGE_UNKNOWN_APP_SOURCES`), and invokes Android's system `PackageInstaller` prompt—never bypassing Android's signature verification.
3. **Why Custom Unverified JS Bundle Swapping Is Avoided**: Replacing bundled `dist/` JS outside signed APK verification introduces supply-chain/integrity risk without a cryptographically signed OTA service, so SAARTHI delivers binary-verified GitHub Release APKs built reproducibly by CI.

---

## 3. Signing Keystore Warning (Important)

- In `.github/workflows/build-playstore-aab.yml`, if GitHub Secrets `ANDROID_KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, and `KEY_PASSWORD` are **not** configured, CI emits a warning and generates an **ephemeral keystore** per run.
- **Operational Impact**: Ephemeral keys allow clean fresh installs, whereas **in-place upgrades** over an already installed APK require Android signatures to match. Configure those 4 repository secrets in GitHub Settings -> Secrets and variables -> Actions to enable seamless in-place APK upgrades and `.aab` Play Store bundles.
