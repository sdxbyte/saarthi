import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import { app } from '../src/serverApp';
import { buildBlueprintCompliantPayload, sanitizeId } from '../src/services/syncEngine';

describe('SAARTHI Firestore Security Rules, Blueprint Parity & Zero-Fabrication Verification', () => {
  const rulesText = fs.readFileSync(path.join(process.cwd(), 'firestore.rules'), 'utf-8');
  const blueprint = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'firebase-blueprint.json'), 'utf-8')
  );
  const securitySpec = fs.readFileSync(path.join(process.cwd(), 'security_spec.md'), 'utf-8');

  it('enforces default deny-all safety net and forbids unauthenticated open reads', () => {
    expect(rulesText).toContain('match /{document=**}');
    expect(rulesText).toMatch(/allow read, write:\s*if false;/);
    expect(rulesText).not.toMatch(/allow\s+(?:read|get|list|write)\s*:\s*if true;/);
  });

  it('covers all 10 blueprint paths in firestore.rules with strict ownership and immutability invariants', () => {
    const expectedMatchClauses = [
      'match /test/connection',
      'match /admins/{userId}',
      'match /releaseNotices/{noticeId}',
      'match /supportTickets/{ticketId}',
      'match /users/{userId}',
      'match /vaultDocs/{docId}',
      'match /keeperItems/{itemId}',
      'match /savedItems/{itemId}',
      'match /devices/{deviceId}',
      'match /syncHistory/{historyId}',
    ];

    for (const clause of expectedMatchClauses) {
      expect(rulesText).toContain(clause);
    }

    expect(Object.keys(blueprint.firestore)).toHaveLength(10);
    expect(rulesText).toContain('match /syncHistory/{historyId}');
    expect(rulesText).toMatch(/allow update, delete:\s*if false;/);
    expect(rulesText).toContain('allow create, update, delete: if false;'); // admins immutable from client
    expect(rulesText).toContain('request.auth.token.email_verified == true');
    expect(securitySpec).toContain('Dirty Dozen');
  });

  it('clamps and sanitizes payloads strictly against firebase-blueprint.json bounds (Dirty Dozen defense)', () => {
    const dirtyTitle = 'A'.repeat(400);
    const dirtyNotes = 'N'.repeat(3000);
    const uid = 'uid-owner-123';

    const vaultPayload = buildBlueprintCompliantPayload(
      'vaultDocs',
      uid,
      '../evil/id?foo=1',
      {
        ownerId: 'uid-attacker-999',
        title: dirtyTitle,
        documentType: 'FakeForgedType',
        docNumber: 'DOC-99',
        issueDate: '2026-08-05',
        issuer: 'Department of Passports',
        notes: dirtyNotes,
      },
      0,
      'dev-1',
      'idem-1',
      false
    );

    expect(vaultPayload.ownerId).toBe(uid);
    expect(vaultPayload.id).toBe(sanitizeId('../evil/id?foo=1'));
    expect(vaultPayload.id).not.toContain('/');
    expect(vaultPayload.title.length).toBeLessThanOrEqual(160);
    expect(vaultPayload.notes.length).toBeLessThanOrEqual(1000);
    expect(vaultPayload.documentType).toBe('Other');
    expect(vaultPayload.version).toBe(1);

    const keeperPayload = buildBlueprintCompliantPayload(
      'keeperItems',
      uid,
      'keep-1',
      {
        title: 'Passport Expiry',
        category: 'passport',
        expiryDateAd: '2027-01-01',
        remindDaysBefore: 999999,
      },
      2,
      'dev-1',
      'idem-2',
      false
    );
    expect(keeperPayload.remindDaysBefore).toBe(3650);

    const savedPayload = buildBlueprintCompliantPayload(
      'savedItems',
      uid,
      'save-1',
      {
        kind: 'malicious_kind',
        targetId: 'forex',
        title: 'NRB Forex',
        tags: Array.from({ length: 20 }, (_, i) => `tag-${i}`),
        pinned: true,
      },
      1,
      'dev-1',
      'idem-3',
      false
    );
    expect(savedPayload.kind).toBe('saved_service');
    expect(savedPayload.tags).toHaveLength(10);
  });

  it('rejects missing Firebase ID token on /api/auth/session-verify and removes mock fallbacks on receipt/meroshare/kalimati', async () => {
    const authRes = await request(app).get('/api/auth/session-verify');
    expect(authRes.status).toBe(401);
    expect(authRes.body.authenticated).toBe(false);

    const receiptImgOnly = await request(app)
      .post('/api/receipt/scan')
      .send({ imageBase64: 'data:image/png;base64,iVBORw0KGgo=' });
    expect(receiptImgOnly.status).toBe(501);
    expect(receiptImgOnly.body.success).toBe(false);

    const receiptParsed = await request(app)
      .post('/api/receipt/scan')
      .send({ rawText: 'Merchant: Kathmandu Grocer\nDate: 2026-08-05\nMilk 1L - 120\nVAT: 15' });
    expect(receiptParsed.status).toBe(200);
    expect(receiptParsed.body.receipt.merchantName).toBe('Kathmandu Grocer');
    expect(receiptParsed.body.receipt.totalAmount).toBe(135);

    const meroNoToken = await request(app)
      .post('/api/meroshare/auto-apply-batch')
      .send({ requests: [{ accountId: '1', companyShareId: 100, kitta: 10, dematNumber: '1301020001234567', crnNumber: 'CRN', pin: '0000' }] });
    expect(meroNoToken.status).toBe(401);

    const kalimatiRes = await request(app).get('/api/live/kalimati');
    expect(kalimatiRes.status).toBe(200);
    expect(kalimatiRes.body.isLive).toBe(false);
    expect(kalimatiRes.body.data).toEqual([]);
    expect(kalimatiRes.body.error).toBe('Official data is currently unavailable.');
  });
});
