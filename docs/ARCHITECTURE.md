# SAARTHI Cross-Platform Architecture (`v1.9.1`)

## 1. Unified Multi-Platform Topology

SAARTHI operates as a single product across **Website (`saarthi.dpdns.org`)**, **PWA (Workbox)**, and **Android APK (`com.sdxbyte.saarthi`)** backed by one account system and one authoritative cloud schema:

```
┌──────────────────────────────────────────────────────────────────────┐
│                         CLIENT SURFACES                              │
│  • Website / Mobile Browser  (https://saarthi.dpdns.org)             │
│  • Installable PWA           (Workbox Offline Shell + Manifest)      │
│  • Standalone Android APK    (Capacitor 7 + Native Updater Plugin)   │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
           ┌───────────────────┴───────────────────┐
           ▼                                       ▼
┌────────────────────────────┐      ┌──────────────────────────────────┐
│   LOCAL-FIRST ENGINE       │      │   FIREBASE CLOUD (SPARK TIER)    │
│  • IndexedDB               │◄────►│  • Firebase Auth (Google OAuth)  │
│    (saarthi_offline_v2)    │ Sync │  • Cloud Firestore Database:     │
│  • Deduplicated Outbox     │Engine│    ai-studio-sarathi-54a6a23c... │
│  • Pre-Migration Backup    │      │  • Strict Owner Security Rules   │
└────────────────────────────┘      └──────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                   EXPRESS / VERCEL API BACKEND                       │
│  • Public Official Feeds: NRB Forex, NEPSE, CDSC IPO, NOC Fuel,      │
│    Kalimati Wholesale, Gold/Silver, Bikram Sambat Dual-Date Time     │
│  • Server Security: Helmet, Rate Limiter, SSRF Allowlist, Bearer Auth│
│  • GitHub Sync & Release Automation (sdxbyte/saarthi)                │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Database & Cost Analysis (Free-Tier Transparency)

| Layer | Technology | Limits & Quota Reality | Billing Dependency |
|---|---|---|---|
| **Local Persistence** | IndexedDB (`saarthi_offline_v2`) | Origin quota (~50 MB–several GB per device browser/WebView); zero network cost | **$0 (Always Free)** |
| **Cloud Identity** | Firebase Authentication (Google Sign-In) | Spark Plan: generous free MAU/verification quotas | **$0 on Spark Plan** |
| **Cloud User Sync** | Cloud Firestore (`ai-studio-sarathi-54a6a23c-5552-499c-9038-48dd469ebf11`) | **Spark Free Tier Limits**: `1 GiB` total storage, `50,000` reads/day, `20,000` writes/day, `20,000` deletes/day, `10 GiB`/month egress | **$0 on Spark Plan** (hard quota caps stop writes if exceeded; requires Blaze upgrade only if scaling past free limits) |
| **Source Code & Releases** | GitHub (`sdxbyte/saarthi`) + Vercel Hobby + GitHub Actions | Free tier CI minutes and hobby deployments | **$0 on Free Tiers** |

**Rule**: GitHub stores source code, schemas, rules, release metadata, and public civic snapshots—never private citizen records, PII, passwords, or GitHub PATs.

---

## 3. UI & Design System Layers

- **Design Tokens**: `/src/styles/designTokens.ts` & `/src/index.css` implementing Navy Blue (`#0B1F3A` / `#102A4C`) primary trust surfaces and Subtle Blue (`#2563EB` / `#3B82F6`) accents across both Light and Dark themes.
- **Typography**: `Outfit` (headings), `Plus Jakarta Sans` (body), `JetBrains Mono` (`tabular-nums` for currency/indices/BS-AD timestamps).
- **Theme Persistence**: `ThemeContext` synchronizes `saarthi_theme_preference_v2` (`light` | `dark` | `system`) on `<html class>` and with authenticated user profiles.
- **Navigation**: `EditorialHeader` for desktop viewports, 5-destination `MobileBottomNav` (`Home`, `Services`, `Finance`, `Calendar`, `Account`) below `768px`.

---

## 4. Lazy Loading & Chunk Strategy

Configured in `vite.config.ts` and `src/utils/pdfExporter.ts`:
- `vendor-react`: React & React DOM runtime
- `vendor-firebase`: Firebase Auth & Firestore SDKs
- `vendor-dates`: Bikram Sambat conversion libraries (`nepali-date-converter`, `@sbmdkl/nepali-date-converter`)
- `vendor-ui`: `lucide-react`, `motion`
- `vendor-pdf`: `jspdf` dynamically imported on demand only when exporting PDF reports
