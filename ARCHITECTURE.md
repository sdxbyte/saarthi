# SAARTHI Cross-Platform Master Architecture (`v1.9.1`)

> See `/docs/ARCHITECTURE.md` for full quota tables, chunk configuration, and operational specifications.

## Core Principles

1. **Single Authoritative Cross-Platform Architecture**: Website (`saarthi.dpdns.org`), PWA, and Android APK (`com.sdxbyte.saarthi`) share Firebase Authentication, Cloud Firestore (`ai-studio-sarathi-54a6a23c-5552-499c-9038-48dd469ebf11`), and IndexedDB (`saarthi_offline_v2`).
2. **GitHub as Code & Release Authority**: `sdxbyte/saarthi` stores source code, `firestore.rules`, `firebase-blueprint.json`, CI workflows, and signed Android release APKs—never private citizen documents or credentials.
3. **Strict Authentic Market & Financial Feeds (Rule 16)**: Financial endpoints verify live upstream responses and stamp dual AD/BS timestamps (`Asia/Kathmandu`). When official sources are unreachable, SAARTHI returns `"Official data is currently unavailable."` instead of fabricated placeholders.
4. **AI-Independent Core**: Authentication, sync, document vault, tax/EMI/Bluebook calculators, BS/AD calendar, and official feeds run deterministically at **$0** runtime cost with zero blocking AI dependency (`src/services/aiCircuitBreaker.ts`).
