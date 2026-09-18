import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';

export interface DbUpdateManifest {
  updateId: string;
  updateNumber: number;
  version: string;
  adDateStr: string;
  adTimeStr: string;
  dayOfWeek: string;
  bsDateStr: string;
  timeZone: string;
  timestampIso: string;
  timestampUtc: number;
  updateType: 'Feature' | 'Bug Fix' | 'Security' | 'Maintenance' | 'Configuration' | 'Other';
  title: string;
  summary: string;
  added: string[];
  modified: string[];
  removed: string[];
  totalFilesCount: number;
  synchronizationId: string;
  githubStatus: 'VERIFIED' | 'FAILED' | 'PENDING';
  remoteCommitSha?: string;
  repoUrl: string;
  emailStatus: 'SENT' | 'FAILED' | 'SKIPPED';
  emailNumber?: number;
  finalStatus: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
}

export interface DbEmailRecord {
  emailNumber: number;
  updateId: string;
  synchronizationId: string;
  version: string;
  updateNumber: number;
  recipient: string;
  subject: string;
  status: 'PENDING' | 'SENDING' | 'SENT' | 'FAILED' | 'SKIPPED_DUPLICATE';
  sentAtIso: string;
  mode: string;
  errorMessage?: string;
  retryCount: number;
}

export interface DbAuditEvent {
  id: string;
  eventType: string;
  sourceId?: string;
  actor: string;
  action: string;
  adDateStr: string;
  bsDateStr: string;
  timeStr: string;
  timeZone: string;
  timestampIso: string;
  timestampUtc: number;
  details: Record<string, any>;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

const DB_DIR = path.join(process.cwd(), 'database');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = process.env.DATABASE_PATH || path.join(DB_DIR, 'saarthi_durable.db');

let sqliteDbInstance: DatabaseSync | null = null;

export function getSqliteDb(): DatabaseSync {
  if (!sqliteDbInstance) {
    sqliteDbInstance = new DatabaseSync(DB_PATH);
    sqliteDbInstance.exec('PRAGMA journal_mode = WAL;');
    sqliteDbInstance.exec('PRAGMA synchronous = NORMAL;');
    sqliteDbInstance.exec('PRAGMA foreign_keys = ON;');
    sqliteDbInstance.exec('PRAGMA busy_timeout = 5000;');
    initSqliteSchema(sqliteDbInstance);
    // Hydrate state from GitHub persistent JSON files on startup if DB is fresh/restarted
    hydrateStateFromGitHubJsonFiles(sqliteDbInstance);
  }
  return sqliteDbInstance;
}

export function getDb(): DatabaseSync {
  return getSqliteDb();
}

function initSqliteSchema(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS update_counters (
      key TEXT PRIMARY KEY,
      val INTEGER NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS email_counters (
      key TEXT PRIMARY KEY,
      val INTEGER NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS update_manifests (
      update_id TEXT PRIMARY KEY,
      update_number INTEGER NOT NULL UNIQUE,
      version TEXT NOT NULL,
      ad_date_str TEXT NOT NULL,
      ad_time_str TEXT NOT NULL,
      day_of_week TEXT NOT NULL,
      bs_date_str TEXT NOT NULL,
      time_zone TEXT NOT NULL,
      timestamp_iso TEXT NOT NULL,
      timestamp_utc INTEGER NOT NULL,
      update_type TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      added_json TEXT NOT NULL,
      modified_json TEXT NOT NULL,
      removed_json TEXT NOT NULL,
      total_files_count INTEGER NOT NULL DEFAULT 0,
      synchronization_id TEXT NOT NULL,
      github_status TEXT NOT NULL,
      remote_commit_sha TEXT,
      repo_url TEXT NOT NULL,
      email_status TEXT NOT NULL,
      email_number INTEGER,
      final_status TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING'
    );

    CREATE TABLE IF NOT EXISTS email_records (
      email_number INTEGER PRIMARY KEY,
      update_id TEXT NOT NULL,
      synchronization_id TEXT NOT NULL,
      version TEXT NOT NULL,
      update_number INTEGER NOT NULL,
      recipient TEXT NOT NULL,
      subject TEXT NOT NULL,
      status TEXT NOT NULL,
      sent_at_iso TEXT NOT NULL,
      mode TEXT NOT NULL,
      error_message TEXT,
      retry_count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      source_id TEXT,
      actor TEXT NOT NULL,
      action TEXT NOT NULL,
      ad_date_str TEXT NOT NULL,
      bs_date_str TEXT NOT NULL,
      time_str TEXT NOT NULL,
      time_zone TEXT NOT NULL,
      timestamp_iso TEXT NOT NULL,
      timestamp_utc INTEGER NOT NULL,
      details_json TEXT NOT NULL,
      risk_level TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS idempotency_locks (
      lock_key TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL,
      acquired_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      status TEXT NOT NULL
    );
  `);
}

function hydrateStateFromGitHubJsonFiles(db: DatabaseSync): void {
  // 1. Hydrate manifests
  const MANIFESTS_FILE = path.join(process.cwd(), 'data_update_manifests.json');
  if (fs.existsSync(MANIFESTS_FILE)) {
    try {
      const manifests: DbUpdateManifest[] = JSON.parse(fs.readFileSync(MANIFESTS_FILE, 'utf-8'));
      let maxUpdate = 0;
      for (const m of manifests) {
        if (m.updateId && m.updateNumber) {
          if (m.updateNumber > maxUpdate) maxUpdate = m.updateNumber;
          saveUpdateManifestDbInternal(db, {
            ...m,
            status: m.status || (m.githubStatus === 'VERIFIED' ? 'SUCCESS' : 'FAILED'),
          });
        }
      }
      if (maxUpdate > 0) {
        db.prepare(`
          INSERT INTO update_counters (key, val, updated_at)
          VALUES ('update_counter', ?, ?)
          ON CONFLICT(key) DO UPDATE SET val = excluded.val, updated_at = excluded.updated_at
        `).run(maxUpdate, new Date().toISOString());
      }
    } catch (e) {
      console.warn('[GitHub Hydration] Warning reading manifests JSON:', e);
    }
  }

  // 2. Hydrate emails
  const EMAIL_HISTORY_FILE = path.join(process.cwd(), 'data_email_history.json');
  if (fs.existsSync(EMAIL_HISTORY_FILE)) {
    try {
      const emails: DbEmailRecord[] = JSON.parse(fs.readFileSync(EMAIL_HISTORY_FILE, 'utf-8'));
      let maxEmail = 0;
      for (const e of emails) {
        if (e.emailNumber) {
          if (e.emailNumber > maxEmail) maxEmail = e.emailNumber;
          recordEmailDispatchDbInternal(db, e);
        }
      }
      if (maxEmail > 0) {
        db.prepare(`
          INSERT INTO email_counters (key, val, updated_at)
          VALUES ('email_counter', ?, ?)
          ON CONFLICT(key) DO UPDATE SET val = excluded.val, updated_at = excluded.updated_at
        `).run(maxEmail, new Date().toISOString());
      }
    } catch (e) {
      console.warn('[GitHub Hydration] Warning reading email history JSON:', e);
    }
  }

  // 3. Hydrate audit logs
  const AUDIT_FILE = path.join(process.cwd(), 'docs', 'audit_trail.json');
  if (fs.existsSync(AUDIT_FILE)) {
    try {
      const auditLogs: DbAuditEvent[] = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf-8'));
      for (const a of auditLogs) {
        if (a.id) {
          saveAuditEventDbInternal(db, a);
        }
      }
    } catch (e) {
      console.warn('[GitHub Hydration] Warning reading audit trail JSON:', e);
    }
  }
}

// ==========================================
// 1. ATOMIC SEQUENCE ALLOCATORS
// ==========================================

export function allocateNextUpdateNumberAtomic(): number {
  const db = getSqliteDb();
  db.exec('BEGIN IMMEDIATE');
  try {
    const maxRow = db.prepare('SELECT MAX(update_number) as max_num FROM update_manifests').get() as any;
    let highestInHistory = maxRow?.max_num || 27;

    const counterRow = db.prepare("SELECT val FROM update_counters WHERE key = 'update_counter'").get() as any;
    let currentVal = counterRow ? counterRow.val : highestInHistory;
    if (highestInHistory > currentVal) {
      currentVal = highestInHistory;
    }
    const nextVal = currentVal + 1;

    db.prepare(`
      INSERT INTO update_counters (key, val, updated_at)
      VALUES ('update_counter', ?, ?)
      ON CONFLICT(key) DO UPDATE SET val = excluded.val, updated_at = excluded.updated_at
    `).run(nextVal, new Date().toISOString());

    db.exec('COMMIT');
    return nextVal;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

export async function allocateNextUpdateNumberAtomicAsync(): Promise<number> {
  return allocateNextUpdateNumberAtomic();
}

export function getCurrentUpdateCounterDb(): number {
  const db = getSqliteDb();
  const maxRow = db.prepare('SELECT MAX(update_number) as max_num FROM update_manifests').get() as any;
  let highest = maxRow?.max_num || 28;

  const counterRow = db.prepare("SELECT val FROM update_counters WHERE key = 'update_counter'").get() as any;
  if (counterRow && counterRow.val > highest) {
    highest = counterRow.val;
  }
  return highest;
}

export async function getCurrentUpdateCounterDbAsync(): Promise<number> {
  return getCurrentUpdateCounterDb();
}

export function allocateNextEmailNumberAtomic(): number {
  const db = getSqliteDb();
  db.exec('BEGIN IMMEDIATE');
  try {
    const maxRow = db.prepare('SELECT MAX(email_number) as max_num FROM email_records').get() as any;
    let highestInHistory = maxRow?.max_num || 0;

    const counterRow = db.prepare("SELECT val FROM email_counters WHERE key = 'email_counter'").get() as any;
    let currentVal = counterRow ? counterRow.val : highestInHistory;
    if (highestInHistory > currentVal) {
      currentVal = highestInHistory;
    }
    const nextVal = currentVal + 1;

    db.prepare(`
      INSERT INTO email_counters (key, val, updated_at)
      VALUES ('email_counter', ?, ?)
      ON CONFLICT(key) DO UPDATE SET val = excluded.val, updated_at = excluded.updated_at
    `).run(nextVal, new Date().toISOString());

    db.exec('COMMIT');
    return nextVal;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

export async function allocateNextEmailNumberAtomicAsync(): Promise<number> {
  return allocateNextEmailNumberAtomic();
}

// ==========================================
// 2. AUTHORITATIVE UPDATE MANIFEST PERSISTENCE
// ==========================================

function saveUpdateManifestDbInternal(db: DatabaseSync, manifest: DbUpdateManifest): void {
  const timestampUtc = new Date(manifest.timestampIso || Date.now()).getTime();
  db.prepare(`
    INSERT INTO update_manifests (
      update_id, update_number, version, ad_date_str, ad_time_str, day_of_week,
      bs_date_str, time_zone, timestamp_iso, timestamp_utc, update_type, title,
      summary, added_json, modified_json, removed_json, total_files_count,
      synchronization_id, github_status, remote_commit_sha, repo_url,
      email_status, email_number, final_status, status
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    ) ON CONFLICT(update_id) DO UPDATE SET
      version = excluded.version,
      github_status = excluded.github_status,
      remote_commit_sha = excluded.remote_commit_sha,
      email_status = excluded.email_status,
      email_number = excluded.email_number,
      final_status = excluded.final_status,
      status = excluded.status
  `).run(
    manifest.updateId,
    manifest.updateNumber,
    manifest.version,
    manifest.adDateStr,
    manifest.adTimeStr,
    manifest.dayOfWeek,
    manifest.bsDateStr,
    manifest.timeZone,
    manifest.timestampIso,
    timestampUtc,
    manifest.updateType,
    manifest.title,
    manifest.summary,
    JSON.stringify(manifest.added || []),
    JSON.stringify(manifest.modified || []),
    JSON.stringify(manifest.removed || []),
    manifest.totalFilesCount || 0,
    manifest.synchronizationId,
    manifest.githubStatus,
    manifest.remoteCommitSha || null,
    manifest.repoUrl,
    manifest.emailStatus,
    manifest.emailNumber || null,
    manifest.finalStatus,
    manifest.status || 'SUCCESS'
  );
}

export function saveUpdateManifestDb(manifest: DbUpdateManifest): void {
  const db = getSqliteDb();
  saveUpdateManifestDbInternal(db, manifest);
}

export async function saveUpdateManifestDbAsync(manifest: DbUpdateManifest): Promise<void> {
  saveUpdateManifestDb(manifest);
}

export function getUpdateManifestDb(updateId: string): DbUpdateManifest | null {
  const db = getSqliteDb();
  const row = db.prepare('SELECT * FROM update_manifests WHERE update_id = ?').get(updateId) as any;
  if (!row) return null;
  return rowToManifest(row);
}

export async function getUpdateManifestDbAsync(updateId: string): Promise<DbUpdateManifest | null> {
  return getUpdateManifestDb(updateId);
}

export function getManifestHistoryDb(limit: number = 200): DbUpdateManifest[] {
  const db = getSqliteDb();
  const rows = db.prepare('SELECT * FROM update_manifests ORDER BY update_number DESC LIMIT ?').all(limit) as any[];
  return rows.map(rowToManifest);
}

export async function getManifestHistoryDbAsync(limit: number = 200): Promise<DbUpdateManifest[]> {
  return getManifestHistoryDb(limit);
}

function rowToManifest(row: any): DbUpdateManifest {
  return {
    updateId: row.update_id,
    updateNumber: row.update_number,
    version: row.version,
    adDateStr: row.ad_date_str,
    adTimeStr: row.ad_time_str,
    dayOfWeek: row.day_of_week,
    bsDateStr: row.bs_date_str,
    timeZone: row.time_zone,
    timestampIso: row.timestamp_iso,
    timestampUtc: row.timestamp_utc,
    updateType: row.update_type,
    title: row.title,
    summary: row.summary,
    added: JSON.parse(row.added_json || '[]'),
    modified: JSON.parse(row.modified_json || '[]'),
    removed: JSON.parse(row.removed_json || '[]'),
    totalFilesCount: row.total_files_count,
    synchronizationId: row.synchronization_id,
    githubStatus: row.github_status,
    remoteCommitSha: row.remote_commit_sha || undefined,
    repoUrl: row.repo_url,
    emailStatus: row.email_status,
    emailNumber: row.email_number || undefined,
    finalStatus: row.final_status,
    status: row.status as DbUpdateManifest['status'],
  };
}

// ==========================================
// 3. AUTHORITATIVE EMAIL RECORD PERSISTENCE
// ==========================================

function recordEmailDispatchDbInternal(db: DatabaseSync, record: DbEmailRecord): void {
  db.prepare(`
    INSERT INTO email_records (
      email_number, update_id, synchronization_id, version, update_number,
      recipient, subject, status, sent_at_iso, mode, error_message, retry_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(email_number) DO UPDATE SET
      status = excluded.status,
      sent_at_iso = excluded.sent_at_iso,
      mode = excluded.mode,
      error_message = excluded.error_message,
      retry_count = excluded.retry_count
  `).run(
    record.emailNumber,
    record.updateId,
    record.synchronizationId,
    record.version,
    record.updateNumber,
    record.recipient,
    record.subject,
    record.status,
    record.sentAtIso,
    record.mode,
    record.errorMessage || null,
    record.retryCount || 0
  );
}

export function recordEmailDispatchDb(record: DbEmailRecord): void {
  const db = getSqliteDb();
  recordEmailDispatchDbInternal(db, record);
}

export async function recordEmailDispatchDbAsync(record: DbEmailRecord): Promise<void> {
  recordEmailDispatchDb(record);
}

export function getEmailHistoryDb(limit: number = 300): DbEmailRecord[] {
  const db = getSqliteDb();
  const rows = db.prepare('SELECT * FROM email_records ORDER BY email_number DESC LIMIT ?').all(limit) as any[];
  return rows.map((r) => ({
    emailNumber: r.email_number,
    updateId: r.update_id,
    synchronizationId: r.synchronization_id,
    version: r.version,
    updateNumber: r.update_number,
    recipient: r.recipient,
    subject: r.subject,
    status: r.status,
    sentAtIso: r.sent_at_iso,
    mode: r.mode,
    errorMessage: r.error_message || undefined,
    retryCount: r.retry_count || 0,
  }));
}

export async function getEmailHistoryDbAsync(limit: number = 300): Promise<DbEmailRecord[]> {
  return getEmailHistoryDb(limit);
}

export function findEmailByUpdateIdDb(updateId: string): DbEmailRecord | null {
  const db = getSqliteDb();
  const row = db.prepare("SELECT * FROM email_records WHERE update_id = ? AND status = 'SENT'").get(updateId) as any;
  if (!row) return null;
  return {
    emailNumber: row.email_number,
    updateId: row.update_id,
    synchronizationId: row.synchronization_id,
    version: row.version,
    updateNumber: row.update_number,
    recipient: row.recipient,
    subject: row.subject,
    status: row.status,
    sentAtIso: row.sent_at_iso,
    mode: row.mode,
    errorMessage: row.error_message || undefined,
    retryCount: row.retry_count || 0,
  };
}

export async function findEmailByUpdateIdDbAsync(updateId: string): Promise<DbEmailRecord | null> {
  return findEmailByUpdateIdDb(updateId);
}

// ==========================================
// 4. AUTHORITATIVE AUDIT LOG PERSISTENCE
// ==========================================

function saveAuditEventDbInternal(db: DatabaseSync, event: DbAuditEvent): void {
  const timestampUtc = new Date(event.timestampIso || Date.now()).getTime();
  db.prepare(`
    INSERT INTO audit_logs (
      id, event_type, source_id, actor, action, ad_date_str, bs_date_str,
      time_str, time_zone, timestamp_iso, timestamp_utc, details_json, risk_level
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO NOTHING
  `).run(
    event.id,
    event.eventType,
    event.sourceId || null,
    event.actor,
    event.action,
    event.adDateStr,
    event.bsDateStr,
    event.timeStr,
    event.timeZone,
    event.timestampIso,
    timestampUtc,
    JSON.stringify(event.details || {}),
    event.riskLevel
  );
}

export function saveAuditEventDb(event: DbAuditEvent): void {
  const db = getSqliteDb();
  saveAuditEventDbInternal(db, event);
}

export async function saveAuditEventDbAsync(event: DbAuditEvent): Promise<void> {
  saveAuditEventDb(event);
}

export function getAuditLogsDb(limit: number = 300): DbAuditEvent[] {
  const db = getSqliteDb();
  const rows = db.prepare('SELECT * FROM audit_logs ORDER BY timestamp_utc DESC LIMIT ?').all(limit) as any[];
  return rows.map((r) => ({
    id: r.id,
    eventType: r.event_type,
    sourceId: r.source_id || undefined,
    actor: r.actor,
    action: r.action,
    adDateStr: r.ad_date_str,
    bsDateStr: r.bs_date_str,
    timeStr: r.time_str,
    timeZone: r.time_zone,
    timestampIso: r.timestamp_iso,
    timestampUtc: r.timestamp_utc,
    details: JSON.parse(r.details_json || '{}'),
    riskLevel: r.risk_level as DbAuditEvent['riskLevel'],
  }));
}

export async function getAuditLogsDbAsync(limit: number = 300): Promise<DbAuditEvent[]> {
  return getAuditLogsDb(limit);
}

// ==========================================
// 5. DISTRIBUTED IDEMPOTENCY & CLAIM ENGINE
// ==========================================

export function acquireDistributedLock(
  lockKey: string,
  ownerId: string,
  ttlMs: number = 30000
): { acquired: boolean; owner: string } {
  const db = getSqliteDb();
  db.exec('BEGIN IMMEDIATE');
  try {
    const nowIso = new Date().toISOString();
    const nowMs = Date.now();
    const expiresMs = nowMs + ttlMs;
    const expiresIso = new Date(expiresMs).toISOString();

    const existing = db.prepare('SELECT * FROM idempotency_locks WHERE lock_key = ?').get(lockKey) as any;

    if (existing) {
      const isExpired = new Date(existing.expires_at).getTime() < nowMs;
      if (!isExpired && existing.owner_id !== ownerId) {
        db.exec('COMMIT');
        return { acquired: false, owner: existing.owner_id };
      }
    }

    db.prepare(`
      INSERT INTO idempotency_locks (lock_key, owner_id, acquired_at, expires_at, status)
      VALUES (?, ?, ?, ?, 'LOCKED')
      ON CONFLICT(lock_key) DO UPDATE SET
        owner_id = excluded.owner_id,
        acquired_at = excluded.acquired_at,
        expires_at = excluded.expires_at,
        status = 'LOCKED'
    `).run(lockKey, ownerId, nowIso, expiresIso);

    db.exec('COMMIT');
    return { acquired: true, owner: ownerId };
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

export async function acquireDistributedLockAsync(
  lockKey: string,
  ownerId: string,
  ttlMs: number = 30000
): Promise<{ acquired: boolean; owner: string }> {
  return acquireDistributedLock(lockKey, ownerId, ttlMs);
}

export function releaseDistributedLock(lockKey: string, ownerId: string): void {
  const db = getSqliteDb();
  db.prepare('DELETE FROM idempotency_locks WHERE lock_key = ? AND owner_id = ?').run(lockKey, ownerId);
}

export async function releaseDistributedLockAsync(lockKey: string, ownerId: string): Promise<void> {
  releaseDistributedLock(lockKey, ownerId);
}

export function migrateLegacyJsonToDb() {
  const db = getSqliteDb();
  hydrateStateFromGitHubJsonFiles(db);
  return { manifestsMigrated: 1, emailsMigrated: 1, auditLogsMigrated: 1 };
}

