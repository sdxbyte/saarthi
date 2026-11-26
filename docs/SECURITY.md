# SAARTHI Security Specification & Controls (`v1.9.1`)

## 1. Secret & Credential Hygiene

- **No Client-Exposed Secrets**: GitHub PATs, SMTP credentials, and Gemini API keys never live in `src/` client bundles or `VITE_*` variables.
- **Plaintext PAT Removed**: `/docs/github-credentials.json` holds `"githubToken": ""`. Runtime GitHub sync scripts (`src/lib/releaseEngine.ts`, `src/services/githubSyncService.ts`) prioritize `process.env.GITHUB_TOKEN` (injected via GitHub Actions / server environment).
- **Safe Automation**: Automatic `postbuild` push hooks and unconditional `git push --force` were removed; GitHub syncing runs explicitly via `npm run sync:github` or Admin APIs.

---

## 2. Cloud Firestore & Authentication Rules (`firestore.rules`)

Deployed to database `ai-studio-sarathi-54a6a23c-5552-499c-9038-48dd469ebf11` and linted via `@firebase/eslint-plugin-security-rules`:

1. **Tenant Isolation**: `/users/{userId}` and subcollections (`vaultDocs`, `keeperItems`, `savedItems`, `devices`, `syncHistory`) require `request.auth != null && request.auth.uid == userId && request.auth.token.email_verified == true`.
2. **Parent Existence Gate**: Subcollection creates/updates require the parent `/users/{userId}` document (`exists(...) || existsAfter(...)`).
3. **Immutable Ownership & Timestamps**: `ownerId` and `createdAt` cannot change after creation; `createdAt`/`updatedAt` must match `request.time`.
4. **No Self-Privilege Escalation**: User self-creation enforces `role == 'citizen'`; updating `role` or `isAdmin` is rejected. Admin elevation comes strictly from `/admins/{uid}` or verified owner bootstrap email (`sudipadhikari8107@gmail.com`).
5. **Append-Only Sync History**: `/users/{userId}/syncHistory/{historyId}` allows `create` + `get`/`list` by owner and explicitly sets `allow update, delete: if false;`.
6. **Support Ticket Terminal Lock**: Closed tickets (`status == 'closed'`) cannot be reopened by non-admin callers; non-admin `list` requires `ownerId == request.auth.uid`.
7. **Denial-of-Wallet Bounds**: Document IDs must match `^[a-zA-Z0-9_-]{1,128}$`, strings enforce explicit `.size()` caps, and bounded arrays enforce `.size() <= 10`.

---

## 3. Express Backend Controls (`src/serverApp.ts`)

- **HTTP Security Headers & Rate Limiting**: `helmet` (CSP/headers) and `express-rate-limit` on public endpoints.
- **SSRF Protection**: Outbound URL resolution enforces public `https://` allowlisted hosts; private RFC-1918/loopback IPs are blocked (`tests/serverSecurityAndFlows.test.ts`).
- **Recipient Pinning**: Non-admin notification/inquiry endpoints pin recipients to the platform owner (`sudipadhikari8107@gmail.com`) rather than honoring arbitrary target emails.
- **Session Verification**: `GET /api/auth/session-verify` validates Firebase Bearer ID tokens via `firebase-admin/auth` (`projectId`-scoped).
- **Zero Simulated Fallbacks**: `/api/meroshare/auto-apply-batch` requires a real CDSC authorization header (`401` if absent, never substitutes mock bearer tokens) and masks Demat BOIDs in audit records; `/api/receipt/scan` parses structured text lines or returns `501` (`OCR_SERVICE_NOT_CONFIGURED`) on raw images when OCR is unconfigured.

> **Pre-Launch Review**: Review `firestore.rules` and admin bootstrap assignments in the Firebase Console before opening broad multi-admin operations.
