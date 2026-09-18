import { getPostgresPool } from './index.ts';
import { DbUpdateManifest, DbEmailRecord, DbAuditEvent } from './persistentStore.ts';
import fs from 'fs';
import path from 'path';

export async function initPostgresTables(): Promise<void> {
  const pool = getPostgresPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS update_counters (
        key TEXT PRIMARY KEY,
        val BIGINT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS email_counters (
        key TEXT PRIMARY KEY,
        val BIGINT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS update_manifests (
        id SERIAL PRIMARY KEY,
        update_id TEXT NOT NULL UNIQUE,
        update_number INTEGER NOT NULL UNIQUE,
        version TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        timestamp_utc BIGINT NOT NULL,
        timezone TEXT NOT NULL,
        ad_date TEXT NOT NULL,
        bs_date TEXT NOT NULL,
        status TEXT NOT NULL,
        change_manifest TEXT NOT NULL,
        github_status TEXT NOT NULL,
        github_commit_sha TEXT,
        email_status TEXT NOT NULL,
        email_number INTEGER,
        title TEXT,
        summary TEXT,
        update_type TEXT,
        synchronization_id TEXT,
        repo_url TEXT,
        final_status TEXT,
        ad_time_str TEXT,
        day_of_week TEXT
      );

      CREATE TABLE IF NOT EXISTS email_records (
        id SERIAL PRIMARY KEY,
        email_number INTEGER NOT NULL UNIQUE,
        update_id TEXT NOT NULL,
        status TEXT NOT NULL,
        provider_message_id TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        sent_at TIMESTAMP WITH TIME ZONE,
        retry_count INTEGER NOT NULL DEFAULT 0,
        error_message TEXT,
        synchronization_id TEXT,
        version TEXT,
        update_number INTEGER,
        recipient TEXT,
        subject TEXT,
        mode TEXT
      );

      CREATE TABLE IF NOT EXISTS idempotency_locks (
        lock_key TEXT PRIMARY KEY,
        update_id TEXT,
        operation_type TEXT,
        status TEXT NOT NULL,
        owner TEXT NOT NULL,
        acquired_at TIMESTAMP WITH TIME ZONE NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        completed_at TIMESTAMP WITH TIME ZONE
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        event_id TEXT,
        update_id TEXT,
        event_type TEXT NOT NULL,
        actor TEXT NOT NULL,
        timestamp_utc BIGINT NOT NULL,
        timezone TEXT NOT NULL,
        ad_date TEXT NOT NULL,
        bs_date TEXT NOT NULL,
        result TEXT,
        github_commit_sha TEXT,
        email_provider_id TEXT,
        metadata TEXT,
        source_id TEXT,
        action TEXT,
        risk_level TEXT,
        timestamp_iso TEXT
      );

      CREATE SEQUENCE IF NOT EXISTS update_number_seq START WITH 28;
      CREATE SEQUENCE IF NOT EXISTS email_number_seq START WITH 1;
    `);

    await client.query('COMMIT');
    console.log('[PostgreSQL] Database tables and sequences verified.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[PostgreSQL Init Error]', err);
    throw err;
  } finally {
    client.release();
  }
}

// 1. ATOMIC SEQUENCES FOR MULTI-INSTANCE CONCURRENCY
export async function allocateNextUpdateNumberPostgres(): Promise<number> {
  const pool = getPostgresPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Ensure update_counters has a record
    const seqRes = await client.query("SELECT nextval('update_number_seq') AS val");
    let nextVal = parseInt(seqRes.rows[0].val, 10);

    // Also update update_counters table atomically
    await client.query(
      `INSERT INTO update_counters (key, val, updated_at)
       VALUES ('update_counter', $1, NOW())
       ON CONFLICT(key) DO UPDATE SET val = EXCLUDED.val, updated_at = NOW()`,
      [nextVal]
    );

    await client.query('COMMIT');
    return nextVal;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function allocateNextEmailNumberPostgres(): Promise<number> {
  const pool = getPostgresPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const seqRes = await client.query("SELECT nextval('email_number_seq') AS val");
    let nextVal = parseInt(seqRes.rows[0].val, 10);

    await client.query(
      `INSERT INTO email_counters (key, val, updated_at)
       VALUES ('email_counter', $1, NOW())
       ON CONFLICT(key) DO UPDATE SET val = EXCLUDED.val, updated_at = NOW()`,
      [nextVal]
    );

    await client.query('COMMIT');
    return nextVal;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getCurrentUpdateCounterPostgres(): Promise<number> {
  const pool = getPostgresPool();
  const res = await pool.query('SELECT MAX(update_number) as max_num FROM update_manifests');
  const maxNum = res.rows[0]?.max_num;
  return maxNum ? parseInt(maxNum, 10) : 28;
}

// 2. UPDATE MANIFEST PERSISTENCE
export async function saveUpdateManifestPostgres(manifest: DbUpdateManifest): Promise<void> {
  const pool = getPostgresPool();
  const timestampUtc = manifest.timestampUtc || new Date(manifest.timestampIso || Date.now()).getTime();

  const changeManifestJson = JSON.stringify({
    added: manifest.added || [],
    modified: manifest.modified || [],
    removed: manifest.removed || [],
    totalFilesCount: manifest.totalFilesCount || 0,
  });

  await pool.query(
    `INSERT INTO update_manifests (
      update_id, update_number, version, ad_date, ad_time_str, day_of_week,
      bs_date, timezone, created_at, timestamp_utc, update_type, title,
      summary, change_manifest, synchronization_id, github_status, github_commit_sha,
      repo_url, email_status, email_number, final_status, status
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
    ) ON CONFLICT(update_id) DO UPDATE SET
      version = EXCLUDED.version,
      github_status = EXCLUDED.github_status,
      github_commit_sha = EXCLUDED.github_commit_sha,
      email_status = EXCLUDED.email_status,
      email_number = EXCLUDED.email_number,
      final_status = EXCLUDED.final_status,
      status = EXCLUDED.status`,
    [
      manifest.updateId,
      manifest.updateNumber,
      manifest.version,
      manifest.adDateStr || '',
      manifest.adTimeStr || '',
      manifest.dayOfWeek || '',
      manifest.bsDateStr || '',
      manifest.timeZone || 'Asia/Kathmandu',
      timestampUtc,
      manifest.updateType || 'Other',
      manifest.title || '',
      manifest.summary || '',
      changeManifestJson,
      manifest.synchronizationId || '',
      manifest.githubStatus || 'PENDING',
      manifest.remoteCommitSha || null,
      manifest.repoUrl || '',
      manifest.emailStatus || 'SKIPPED',
      manifest.emailNumber || null,
      manifest.finalStatus || '',
      manifest.status || 'SUCCESS',
    ]
  );
}

export async function getUpdateManifestPostgres(updateId: string): Promise<DbUpdateManifest | null> {
  const pool = getPostgresPool();
  const res = await pool.query('SELECT * FROM update_manifests WHERE update_id = $1', [updateId]);
  if (res.rows.length === 0) return null;
  return rowToManifestPostgres(res.rows[0]);
}

export async function getManifestHistoryPostgres(limit: number = 200): Promise<DbUpdateManifest[]> {
  const pool = getPostgresPool();
  const res = await pool.query('SELECT * FROM update_manifests ORDER BY update_number DESC LIMIT $1', [limit]);
  return res.rows.map(rowToManifestPostgres);
}

function rowToManifestPostgres(row: any): DbUpdateManifest {
  let changeData = { added: [], modified: [], removed: [], totalFilesCount: 0 };
  try {
    if (row.change_manifest) {
      changeData = JSON.parse(row.change_manifest);
    }
  } catch (e) {}

  return {
    updateId: row.update_id,
    updateNumber: row.update_number,
    version: row.version,
    adDateStr: row.ad_date,
    adTimeStr: row.ad_time_str || '',
    dayOfWeek: row.day_of_week || '',
    bsDateStr: row.bs_date,
    timeZone: row.timezone,
    timestampIso: new Date(Number(row.timestamp_utc)).toISOString(),
    timestampUtc: Number(row.timestamp_utc),
    updateType: row.update_type || 'Other',
    title: row.title || '',
    summary: row.summary || '',
    added: changeData.added || [],
    modified: changeData.modified || [],
    removed: changeData.removed || [],
    totalFilesCount: changeData.totalFilesCount || 0,
    synchronizationId: row.synchronization_id || '',
    githubStatus: row.github_status,
    remoteCommitSha: row.github_commit_sha || undefined,
    repoUrl: row.repo_url || '',
    emailStatus: row.email_status,
    emailNumber: row.email_number || undefined,
    finalStatus: row.final_status || '',
    status: row.status as DbUpdateManifest['status'],
  };
}

// 3. EMAIL DISPATCH PERSISTENCE
export async function recordEmailDispatchPostgres(record: DbEmailRecord): Promise<void> {
  const pool = getPostgresPool();
  await pool.query(
    `INSERT INTO email_records (
      email_number, update_id, synchronization_id, version, update_number,
      recipient, subject, status, sent_at, mode, error_message, retry_count
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9, $10, $11)
    ON CONFLICT(email_number) DO UPDATE SET
      status = EXCLUDED.status,
      sent_at = NOW(),
      mode = EXCLUDED.mode,
      error_message = EXCLUDED.error_message,
      retry_count = EXCLUDED.retry_count`,
    [
      record.emailNumber,
      record.updateId,
      record.synchronizationId || '',
      record.version || '',
      record.updateNumber || 0,
      record.recipient || '',
      record.subject || '',
      record.status,
      record.mode || 'SMTP',
      record.errorMessage || null,
      record.retryCount || 0,
    ]
  );
}

export async function getEmailHistoryPostgres(limit: number = 300): Promise<DbEmailRecord[]> {
  const pool = getPostgresPool();
  const res = await pool.query('SELECT * FROM email_records ORDER BY email_number DESC LIMIT $1', [limit]);
  return res.rows.map((r) => ({
    emailNumber: r.email_number,
    updateId: r.update_id,
    synchronizationId: r.synchronization_id || '',
    version: r.version || '',
    updateNumber: r.update_number || 0,
    recipient: r.recipient || '',
    subject: r.subject || '',
    status: r.status,
    sentAtIso: r.sent_at ? new Date(r.sent_at).toISOString() : new Date().toISOString(),
    mode: r.mode || 'SMTP',
    errorMessage: r.error_message || undefined,
    retryCount: r.retry_count || 0,
  }));
}

export async function findEmailByUpdateIdPostgres(updateId: string): Promise<DbEmailRecord | null> {
  const pool = getPostgresPool();
  const res = await pool.query('SELECT * FROM email_records WHERE update_id = $1 AND status = \'SENT\' LIMIT 1', [
    updateId,
  ]);
  if (res.rows.length === 0) return null;
  const r = res.rows[0];
  return {
    emailNumber: r.email_number,
    updateId: r.update_id,
    synchronizationId: r.synchronization_id || '',
    version: r.version || '',
    updateNumber: r.update_number || 0,
    recipient: r.recipient || '',
    subject: r.subject || '',
    status: r.status,
    sentAtIso: r.sent_at ? new Date(r.sent_at).toISOString() : new Date().toISOString(),
    mode: r.mode || 'SMTP',
    errorMessage: r.error_message || undefined,
    retryCount: r.retry_count || 0,
  };
}

// 4. AUDIT LOG PERSISTENCE
export async function saveAuditEventPostgres(event: DbAuditEvent): Promise<void> {
  const pool = getPostgresPool();
  const timestampUtc = event.timestampUtc || new Date(event.timestampIso || Date.now()).getTime();

  await pool.query(
    `INSERT INTO audit_logs (
      id, event_type, source_id, actor, action, ad_date, bs_date,
      timezone, timestamp_utc, metadata, risk_level, result, timestamp_iso
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    ON CONFLICT(id) DO NOTHING`,
    [
      event.id,
      event.eventType,
      event.sourceId || null,
      event.actor,
      event.action || '',
      event.adDateStr || '',
      event.bsDateStr || '',
      event.timeZone || 'Asia/Kathmandu',
      timestampUtc,
      JSON.stringify(event.details || {}),
      event.riskLevel || 'LOW',
      'SUCCESS',
      event.timestampIso || new Date(timestampUtc).toISOString(),
    ]
  );
}

export async function getAuditLogsPostgres(limit: number = 300): Promise<DbAuditEvent[]> {
  const pool = getPostgresPool();
  const res = await pool.query('SELECT * FROM audit_logs ORDER BY timestamp_utc DESC LIMIT $1', [limit]);
  return res.rows.map((r) => {
    let details = {};
    try {
      if (r.metadata) details = JSON.parse(r.metadata);
    } catch (e) {}

    return {
      id: r.id,
      eventType: r.event_type,
      sourceId: r.source_id || undefined,
      actor: r.actor,
      action: r.action || '',
      adDateStr: r.ad_date || '',
      bsDateStr: r.bs_date || '',
      timeStr: r.ad_date ? '' : '',
      timeZone: r.timezone || 'Asia/Kathmandu',
      timestampIso: r.timestamp_iso || new Date(Number(r.timestamp_utc)).toISOString(),
      timestampUtc: Number(r.timestamp_utc),
      details,
      riskLevel: (r.risk_level || 'LOW') as DbAuditEvent['riskLevel'],
    };
  });
}

// 5. DISTRIBUTED IDEMPOTENCY LOCKS
export async function acquireDistributedLockPostgres(
  lockKey: string,
  ownerId: string,
  ttlMs: number = 30000
): Promise<{ acquired: boolean; owner: string }> {
  const pool = getPostgresPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlMs);

    const checkRes = await client.query('SELECT * FROM idempotency_locks WHERE lock_key = $1 FOR UPDATE', [lockKey]);

    if (checkRes.rows.length > 0) {
      const lock = checkRes.rows[0];
      const isExpired = new Date(lock.expires_at).getTime() < now.getTime();
      if (!isExpired && lock.owner !== ownerId) {
        await client.query('COMMIT');
        return { acquired: false, owner: lock.owner };
      }
    }

    await client.query(
      `INSERT INTO idempotency_locks (lock_key, owner, acquired_at, expires_at, status)
       VALUES ($1, $2, $3, $4, 'LOCKED')
       ON CONFLICT(lock_key) DO UPDATE SET
         owner = EXCLUDED.owner,
         acquired_at = EXCLUDED.acquired_at,
         expires_at = EXCLUDED.expires_at,
         status = 'LOCKED'`,
      [lockKey, ownerId, now.toISOString(), expiresAt.toISOString()]
    );

    await client.query('COMMIT');
    return { acquired: true, owner: ownerId };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function releaseDistributedLockPostgres(lockKey: string, ownerId: string): Promise<void> {
  const pool = getPostgresPool();
  await pool.query('DELETE FROM idempotency_locks WHERE lock_key = $1 AND owner = $2', [lockKey, ownerId]);
}

// 6. ONE-TIME MIGRATION FROM SQLITE / JSON TO POSTGRESQL
export async function migrateLegacyDataToPostgres(): Promise<{
  manifestsMigrated: number;
  emailsMigrated: number;
  auditLogsMigrated: number;
  maxUpdateNumber: number;
  maxEmailNumber: number;
}> {
  await initPostgresTables();

  let manifestsMigrated = 0;
  let emailsMigrated = 0;
  let auditLogsMigrated = 0;

  // 1. Migrate manifests from JSON
  const MANIFESTS_FILE = path.join(process.cwd(), 'data_update_manifests.json');
  if (fs.existsSync(MANIFESTS_FILE)) {
    try {
      const manifests: DbUpdateManifest[] = JSON.parse(fs.readFileSync(MANIFESTS_FILE, 'utf-8'));
      for (const m of manifests) {
        if (m.updateId && m.updateNumber) {
          await saveUpdateManifestPostgres({
            ...m,
            status: m.status || (m.githubStatus === 'VERIFIED' ? 'SUCCESS' : 'FAILED'),
          });
          manifestsMigrated++;
        }
      }
    } catch (e) {
      console.warn('[PostgreSQL Migration] Warning reading manifests JSON:', e);
    }
  }

  // 2. Migrate email records from JSON
  const EMAIL_FILE = path.join(process.cwd(), 'data_email_history.json');
  if (fs.existsSync(EMAIL_FILE)) {
    try {
      const emails: DbEmailRecord[] = JSON.parse(fs.readFileSync(EMAIL_FILE, 'utf-8'));
      for (const e of emails) {
        if (e.emailNumber) {
          await recordEmailDispatchPostgres(e);
          emailsMigrated++;
        }
      }
    } catch (e) {
      console.warn('[PostgreSQL Migration] Warning reading email history JSON:', e);
    }
  }

  // 3. Migrate audit logs from JSON
  const AUDIT_FILE = path.join(process.cwd(), 'docs', 'audit_trail.json');
  if (fs.existsSync(AUDIT_FILE)) {
    try {
      const auditLogs: DbAuditEvent[] = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf-8'));
      for (const a of auditLogs) {
        if (a.id) {
          await saveAuditEventPostgres(a);
          auditLogsMigrated++;
        }
      }
    } catch (e) {
      console.warn('[PostgreSQL Migration] Warning reading audit trail JSON:', e);
    }
  }

  // Synchronize PostgreSQL sequences to highest numbers
  const pool = getPostgresPool();

  const maxUpRes = await pool.query('SELECT COALESCE(MAX(update_number), 28) as max_val FROM update_manifests');
  const maxUpdateNumber = parseInt(maxUpRes.rows[0].max_val, 10);
  await pool.query(`SELECT setval('update_number_seq', $1, true)`, [maxUpdateNumber + 1]);

  const maxEmRes = await pool.query('SELECT COALESCE(MAX(email_number), 1) as max_val FROM email_records');
  const maxEmailNumber = parseInt(maxEmRes.rows[0].max_val, 10);
  await pool.query(`SELECT setval('email_number_seq', $1, true)`, [maxEmailNumber + 1]);

  console.log(
    `[PostgreSQL Migration Complete] Manifests: ${manifestsMigrated}, Emails: ${emailsMigrated}, Audit Logs: ${auditLogsMigrated}. Max Update #: ${maxUpdateNumber}, Max Email #: ${maxEmailNumber}`
  );

  return {
    manifestsMigrated,
    emailsMigrated,
    auditLogsMigrated,
    maxUpdateNumber,
    maxEmailNumber,
  };
}
