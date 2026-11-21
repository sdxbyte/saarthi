import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/serverApp';

const TEST_ADMIN_PASS = 'SaarthiSecAudit!2026#99';

describe('SAARTHI Security Controls & Core API Flows (OWASP + Play Store)', () => {
  beforeAll(() => {
    process.env.ADMIN_USERNAME = 's.adhikari';
    process.env.ADMIN_NOTIFICATION_EMAIL = 'sudipadhikari8107@gmail.com';
    process.env.ADMIN_PASSWORD = TEST_ADMIN_PASS;
  });

  describe('1. Security Headers & Protected Path Hardening', () => {
    it('sets Helmet CSP, Referrer-Policy, Permissions-Policy, and nosniff headers', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
      expect(res.headers['permissions-policy']).toContain('microphone=()');
      expect(res.headers['content-security-policy']).toContain("object-src 'none'");
      expect(res.headers['content-security-policy']).toContain("base-uri 'self'");
    });

    it('blocks path traversal and sensitive internal files with 403', async () => {
      const r1 = await request(app).get('/..%2f.env');
      expect(r1.status).toBe(403);

      const r2 = await request(app).get('/docs/smtp-credentials.json');
      expect(r2.status).toBe(403);

      const r3 = await request(app).get('/.git/config');
      expect(r3.status).toBe(403);
    });

    it('serves Android Digital Asset Links cleanly at /.well-known/assetlinks.json', async () => {
      const prevSha = process.env.ANDROID_PLAY_SIGNING_SHA256;
      process.env.ANDROID_PLAY_SIGNING_SHA256 =
        'AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99';

      const res = await request(app).get('/.well-known/assetlinks.json');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('application/json');
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]?.target?.package_name).toBe('com.sdxbyte.saarthi');
      expect(res.body[0]?.target?.sha256_cert_fingerprints).toContain(
        process.env.ANDROID_PLAY_SIGNING_SHA256
      );

      if (prevSha === undefined) {
        delete process.env.ANDROID_PLAY_SIGNING_SHA256;
      } else {
        process.env.ANDROID_PLAY_SIGNING_SHA256 = prevSha;
      }
    });
  });

  describe('2. Server-Side Admin Authentication & Cookie Security', () => {
    it('rejects unauthenticated access and forged local_token_* headers on protected routes', async () => {
      const r1 = await request(app).get('/api/support/tickets');
      expect(r1.status).toBe(401);

      const r2 = await request(app).get('/api/db/status');
      expect(r2.status).toBe(401);

      const r3 = await request(app).post('/api/sitehub/sync');
      expect(r3.status).toBe(401);

      const forged = await request(app)
        .get('/api/support/tickets')
        .set('Authorization', 'Bearer local_token_forged_123456');
      expect(forged.status).toBe(401);
    });

    it('authenticates with valid credentials, issues HttpOnly SameSite=Lax cookie, and invalidates on logout', async () => {
      const badLogin = await request(app)
        .post('/api/admin/login')
        .set('X-Forwarded-For', '203.0.113.10')
        .send({ username: 's.adhikari', password: 'wrongpassword' });
      expect(badLogin.status).toBe(401);

      const agent = request.agent(app);
      const loginRes = await agent
        .post('/api/admin/login')
        .set('X-Forwarded-For', '203.0.113.11')
        .send({ username: 's.adhikari', password: TEST_ADMIN_PASS });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body.success).toBe(true);

      const rawCookies = loginRes.headers['set-cookie'];
      const cookieList: string[] = Array.isArray(rawCookies)
        ? rawCookies
        : typeof rawCookies === 'string'
        ? [rawCookies]
        : [];
      expect(cookieList.length).toBeGreaterThan(0);
      const sessionCookie = cookieList.find((c) => c.startsWith('saarthi_admin_session='));
      expect(sessionCookie).toBeTruthy();
      expect(sessionCookie).toContain('HttpOnly');
      expect(sessionCookie).toContain('SameSite=Lax');

      const authedCheck = await agent.get('/api/admin/verify-session');
      expect(authedCheck.status).toBe(200);
      expect(authedCheck.body.valid).toBe(true);

      const ticketsCheck = await agent.get('/api/support/tickets');
      expect(ticketsCheck.status).toBe(200);
      expect(ticketsCheck.body.success).toBe(true);

      await agent.post('/api/admin/logout');
      const afterLogout = await agent.get('/api/admin/verify-session');
      expect(afterLogout.status).toBe(401);
    });
  });

  describe('3. Support Tickets, Bug Reports & Account Deletion End-to-End Flow', () => {
    it('validates input strictly and rejects invalid ticket payloads with 400', async () => {
      const res = await request(app)
        .post('/api/support/tickets')
        .set('X-Forwarded-For', '203.0.113.20')
        .send({ fullName: 'A', email: 'not-an-email', message: 'hi' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('creates BUG and ACCOUNT_DELETION tickets in persistent store and allows admin status updates', async () => {
      const bugRes = await request(app)
        .post('/api/support/tickets')
        .set('X-Forwarded-For', '203.0.113.21')
        .send({
          fullName: 'Aarav Shrestha',
          email: 'aarav.test@example.com',
          phone: '+9779800000001',
          category: 'BUG',
          priority: 'HIGH',
          subject: 'Offline indicator overlap check',
          message: 'Verified E2E bug report flow submission with script tag test <script>alert(1)</script>.',
        });

      expect(bugRes.status).toBe(201);
      expect(bugRes.body.success).toBe(true);
      expect(bugRes.body.ticket.id).toMatch(/^SRT-/);
      expect(bugRes.body.ticket.status).toBe('NEW');
      expect(bugRes.body.ticket.bsDateStr).toContain('B.S.');

      const delRes = await request(app)
        .post('/api/support/tickets')
        .set('X-Forwarded-For', '203.0.113.22')
        .send({
          fullName: 'Sita Gurung',
          email: 'sita.test@example.com',
          category: 'ACCOUNT_DELETION',
          priority: 'HIGH',
          subject: 'Play Store Account & Data Deletion Request',
          message: 'Please permanently delete my profile and local vault metadata for sita.test@example.com.',
        });

      expect(delRes.status).toBe(201);
      expect(delRes.body.ticket.category).toBe('ACCOUNT_DELETION');

      const agent = request.agent(app);
      await agent
        .post('/api/admin/login')
        .set('X-Forwarded-For', '203.0.113.23')
        .send({ username: 's.adhikari', password: TEST_ADMIN_PASS });

      const listRes = await agent.get('/api/support/tickets');
      expect(listRes.status).toBe(200);
      const found = listRes.body.tickets.find((t: any) => t.id === bugRes.body.ticket.id);
      expect(found).toBeTruthy();

      const patchRes = await agent
        .patch(`/api/support/tickets/${bugRes.body.ticket.id}`)
        .send({ status: 'RESOLVED', adminReply: 'Fixed in v1.9.1.' });
      expect(patchRes.status).toBe(200);
      expect(patchRes.body.ticket.status).toBe('RESOLVED');
      expect(patchRes.body.ticket.adminReply).toBe('Fixed in v1.9.1.');
    });

    it('enforces rate limiting (429) on support/issue-report endpoint after 10 submissions', async () => {
      const rateIp = '203.0.113.99';
      let lastStatus = 200;
      for (let i = 0; i < 11; i++) {
        const res = await request(app)
          .post('/api/support/tickets')
          .set('X-Forwarded-For', rateIp)
          .send({ fullName: 'X', email: 'bad', message: 'short' });
        lastStatus = res.status;
      }
      expect(lastStatus).toBe(429);
    });
  });

  describe('4. SSRF & Email Recipient Hardening', () => {
    it('blocks private, loopback, metadata IPs, restricted ports, and bad protocols on /api/public-apis/proxy', async () => {
      const blockedTargets = [
        'http://127.0.0.1:3000/api/health',
        'http://localhost/secret',
        'http://[::1]/admin',
        'http://169.254.169.254/latest/meta-data/',
        'http://10.0.0.1/internal',
        'https://example.com:6379/',
      ];

      for (const targetUrl of blockedTargets) {
        const res = await request(app)
          .post('/api/public-apis/proxy')
          .set('X-Forwarded-For', '203.0.113.30')
          .send({ targetUrl, method: 'GET' });
        expect(res.status).toBe(403);
      }

      const fileProto = await request(app)
        .post('/api/public-apis/proxy')
        .set('X-Forwarded-For', '203.0.113.30')
        .send({ targetUrl: 'file:///etc/passwd', method: 'GET' });
      expect(fileProto.status).toBe(400);

      const credsUrl = await request(app)
        .post('/api/public-apis/proxy')
        .set('X-Forwarded-For', '203.0.113.30')
        .send({ targetUrl: 'https://user:secret@example.com/data', method: 'GET' });
      expect(credsUrl.status).toBe(400);
    });

    it('pins public notification/email dispatch recipients to platform owner for non-admin callers', async () => {
      const res = await request(app)
        .post('/api/notifications/dispatch')
        .set('X-Forwarded-For', '203.0.113.40')
        .send({
          eventType: 'SUPPORT_INQUIRY',
          recipient: 'attacker@evil.example',
          subject: 'Spoof attempt',
          details: { message: 'Hello <img src=x onerror=alert(1)>' },
        });
      expect(res.status).toBe(200);
      expect(res.body.recipient).toBe('sudipadhikari8107@gmail.com');
    });
  });

  describe('5. Standalone Android APK CORS & Server Sync', () => {
    it('allows Capacitor Android origins cleanly via CORS and rejects arbitrary unknown origins', async () => {
      const capPreflight = await request(app)
        .options('/api/health')
        .set('Origin', 'https://localhost');
      expect(capPreflight.status).toBe(204);
      expect(capPreflight.headers['access-control-allow-origin']).toBe('https://localhost');
      expect(capPreflight.headers['access-control-allow-credentials']).toBe('true');

      const unknownOrigin = await request(app)
        .get('/api/health')
        .set('Origin', 'https://untrusted-site.example');
      expect(unknownOrigin.status).toBe(200);
      expect(unknownOrigin.headers['access-control-allow-origin']).toBeUndefined();
    });

    it('exposes /api/app/sync-info with website URL and direct APK release download link', async () => {
      const res = await request(app).get('/api/app/sync-info');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.websiteUrl).toBe('https://saarthi.dpdns.org');
      expect(res.body.apkDownloadUrl).toBe('https://github.com/sdxbyte/saarthi/releases/latest/download/saarthi-latest.apk');
    });
  });
});
