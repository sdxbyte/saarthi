# SAARTHI Firestore Security Specification (Phase 0 TDD)

## 1. Core Data Invariants
1. **Strict Tenant & Owner Isolation**: All citizen personal records (`/users/{userId}`, `/users/{userId}/vaultDocs/{docId}`, `/users/{userId}/keeperItems/{itemId}`, `/users/{userId}/savedItems/{itemId}`, `/users/{userId}/devices/{deviceId}`, `/users/{userId}/syncHistory/{historyId}`) belong strictly to `userId == request.auth.uid` with `request.auth.token.email_verified == true`. No authenticated non-owner may read or mutate another citizen's PII or documents.
2. **Master Gate Parent Integrity**: No document in `/users/{userId}/vaultDocs`, `/keeperItems`, `/savedItems`, `/devices`, or `/syncHistory` may be created or updated unless the parent `/users/{userId}` document exists (checked via `exists(...) || existsAfter(...)`).
3. **Immutable Ownership & Creation Metadata**: `ownerId` and `createdAt` are locked after creation (`incoming().ownerId == existing().ownerId && incoming().createdAt == existing().createdAt`).
4. **Zero Self-Assigned Privilege Escalation**: Citizen profiles under `/users/{userId}` lock `role` to `'citizen'` on self-creation and block modifying `role` or `isAdmin` fields via client writes. Admin authority is verified strictly via `/admins/$(request.auth.uid)` or verified owner bootstrap email (`sudipadhikari8107@gmail.com` with `email_verified == true`).
5. **Server Timestamp Integrity**: `createdAt` on create and `updatedAt` on update must equal `request.time` (Firestore `serverTimestamp()`).
6. **Version Monotonicity & Conflict Guard**: Synced records carry an integer `version >= 1` (`int`), `deviceId` string (`<= 64`), and `idempotencyKey` (`<= 128`) so multi-device edits detect conflicting versions rather than silently corrupting state.
7. **Terminal State Locking**: `/supportTickets/{ticketId}` with `status == 'closed'` cannot be reopened or altered by non-admin users.
8. **Append-Only Audit Trail**: `/users/{userId}/syncHistory/{historyId}` permits `create` and `get`/`list` by the owner, and denies `update` and `delete` from clients (`allow update, delete: if false;`) to preserve append-only sync history.
9. **Path & Payload Bounds (Denial-of-Wallet Guard)**: Every document ID matches `^[a-zA-Z0-9_-]{1,128}$`, every string enforces `.size()` limits, and bounded arrays enforce `.size() <= 10` with type checks.

---

## 2. The "Dirty Dozen" Adversarial Payloads

| # | Attack Class | Target Path & Operation | Malicious Payload / Condition | Expected Result |
|---|--------------|-------------------------|-------------------------------|-----------------|
| 1 | Cross-Tenant Read (PII Leak) | `GET /users/victim-uid` as `attacker-uid` | Authenticated attacker reads another user's profile containing email/phone | `PERMISSION_DENIED` |
| 2 | Self-Privilege Escalation | `CREATE /users/attacker-uid` | `{ ownerId: 'attacker-uid', role: 'SUPER_ADMIN', ... }` | `PERMISSION_DENIED` |
| 3 | Ghost Field Injection | `UPDATE /users/u1` | Update `displayName` plus hidden `isVerified: true` / `tier: 'admin'` | `PERMISSION_DENIED` |
| 4 | Unverified Email Spoof | `CREATE /users/u1/vaultDocs/d1` | Auth token has `email: 'sudipadhikari8107@gmail.com'`, `email_verified: false` | `PERMISSION_DENIED` |
| 5 | Owner Spoofing in Subcollection | `CREATE /users/u1/vaultDocs/d1` as `u2` | `{ ownerId: 'u2', title: 'Fake Doc', ... }` under `/users/u1` | `PERMISSION_DENIED` |
| 6 | ID Poisoning (1.5KB Key) | `CREATE /users/u1/keeperItems/<1500 chars>` | Document ID exceeds 128 chars or contains `/`, `.`, `$` | `PERMISSION_DENIED` |
| 7 | Client Clock Manipulation | `CREATE /users/u1/vaultDocs/d1` | `createdAt: Timestamp.fromMillis(0)` instead of `request.time` | `PERMISSION_DENIED` |
| 8 | Immutable Field Tampering | `UPDATE /users/u1/vaultDocs/d1` | Attempt to mutate `ownerId` or `createdAt` | `PERMISSION_DENIED` |
| 9 | Unbounded Array / 1MB String DoW | `UPDATE /users/u1/savedItems/s1` | `tags: [ ... 50 items ]` or `title` with 500KB string | `PERMISSION_DENIED` |
| 10 | Sync History Tampering | `DELETE` or `UPDATE /users/u1/syncHistory/h1` | Owner tries to delete or rewrite an append-only sync log | `PERMISSION_DENIED` |
| 11 | Terminal State Bypass | `UPDATE /supportTickets/t1` as ticket owner | Existing `status == 'closed'`, user tries to change `status: 'open'` | `PERMISSION_DENIED` |
| 12 | Blanket List Query Scraping | `LIST /supportTickets` without owner filter | Authenticated non-admin tries to list all users' tickets | `PERMISSION_DENIED` |
