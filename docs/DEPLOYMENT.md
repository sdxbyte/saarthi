# SAARTHI Deployment Guide (`v1.0.0`)

## 1. Web & Serverless Backend Deployment (Vercel)

- **Hosting**: `https://saarthi.dpdns.org` (routed through Vercel).
- **Build & Routing (`vercel.json`)**:
  - `buildCommand`: `npm run build` (`vite build` + `esbuild` bundles `dist/server.cjs` and `dist/vercel-server.cjs`).
  - `/api/(.*)` -> `/api/index` serverless handler (`maxDuration: 30s`).
  - `/((?!api/).*)` -> `/index.html` SPA rewrite.
- **Required Environment Variables (Vercel Project Settings)**:
  - `NODE_ENV=production`
  - `ALLOWED_OWNER_EMAIL=sudipadhikari8107@gmail.com`
  - `GEMINI_API_KEY` (optional AI notice breakdown enhancement; core runs without it)
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (optional automated notification emails)
  - `GITHUB_TOKEN` (for GitHub Actions / server sync operations; never prefixed with `VITE_`)

---

## 2. CI/CD Pipelines (`.github/workflows/`)

### `.github/workflows/deploy.yml`
Runs on push/dispatch:
1. Installs Node.js 22 dependencies (`npm ci || npm install`).
2. Executes `npm test` (fails pipeline if any test fails).
3. Runs `npm run lint` and `npm run build`.
4. Logs release metadata dynamically from `package.json` (`1.0.0`).

### `.github/workflows/build-playstore-aab.yml`
Runs on `main`/`master` pushes (ignoring `**.md`), daily cron (`15 0 * * *`), or manual `workflow_dispatch`:
1. Runs `npm test`.
2. Builds Capacitor web assets with `VITE_IS_NATIVE_APK=true` and `VITE_API_BASE_URL=https://saarthi.dpdns.org`.
3. Installs Android SDK 35, generates `android/` via `npx cap add android && npx cap sync android`, stamps `versionCode`/`versionName`, generates mipmap icons, and injects `SaarthiUpdaterPlugin.java` via `scripts/inject-android-updater.mjs`.
4. Signs APK (and Play Store `.aab` when `ANDROID_KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD` secrets are configured) and publishes GitHub Release artifacts.

---

## 3. Firebase Rules Deployment

Whenever `firestore.rules` is updated:

```bash
npx eslint firestore.rules
# Deploy rules via Firebase CLI or AI Studio deploy_firebase / DeployRules RPC
```
