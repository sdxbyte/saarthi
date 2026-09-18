import fs from 'fs';
import path from 'path';
import { formatDualDate } from '../utils/bsAdConverter';
import { executeFullSaarthiGitHubSync, runSecretScan } from './githubSyncService';
import { dispatchUpdateEmail } from './updateEmailService';
import { recordAuditEvent } from './audit';
import {
  allocateNextUpdateNumberAtomic,
  allocateNextUpdateNumberAtomicAsync,
  getCurrentUpdateCounterDb,
  getCurrentUpdateCounterDbAsync,
  saveUpdateManifestDb,
  saveUpdateManifestDbAsync,
  getManifestHistoryDb,
  getManifestHistoryDbAsync,
  getUpdateManifestDb,
  getUpdateManifestDbAsync,
  DbUpdateManifest,
} from '../db/persistentStore';

export interface UpdateManifest {
  updateId: string;
  updateNumber: number;
  version: string;
  adDateStr: string;
  adTimeStr: string;
  dayOfWeek: string;
  bsDateStr: string;
  timeZone: string;
  timestampIso: string;
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
  finalStatus: 'SUCCESSFULLY UPDATED & BACKED UP' | 'UPDATE COMPLETED / GITHUB BACKUP FAILED' | 'FAILED';
}

const VERSION_STATE_FILE = path.join(process.cwd(), 'data_version_state.json');
const MANIFESTS_FILE = path.join(process.cwd(), 'data_update_manifests.json');

// Get/Increment persistent update counter with $0-Cost GitHub Persistence Architecture
export async function getNextUpdateNumberAsync(): Promise<number> {
  return await allocateNextUpdateNumberAtomicAsync();
}

export function getNextUpdateNumber(): number {
  try {
    return allocateNextUpdateNumberAtomic();
  } catch (e) {
    return 28;
  }
}

export async function getCurrentUpdateCounterAsync(): Promise<number> {
  return await getCurrentUpdateCounterDbAsync();
}

export function getCurrentUpdateCounter(): number {
  try {
    return getCurrentUpdateCounterDb();
  } catch (e) {
    return 28;
  }
}

// Single source of truth for Platform Version
export function getCurrentVersion(): string {
  try {
    if (fs.existsSync(VERSION_STATE_FILE)) {
      const data = JSON.parse(fs.readFileSync(VERSION_STATE_FILE, 'utf-8'));
      if (data && data.version) return data.version;
    }
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'));
    return pkg.version || '1.5.0';
  } catch (e) {
    return '1.5.0';
  }
}

export function setVersionState(version: string): void {
  try {
    fs.writeFileSync(VERSION_STATE_FILE, JSON.stringify({ version, updatedAt: new Date().toISOString() }, null, 2), 'utf-8');
    const pkgPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      pkg.version = version;
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');
    }
  } catch (e) {
    console.warn('[Update Pipeline] Failed to persist version state:', e);
  }
}

export async function getManifestHistoryAsync(): Promise<UpdateManifest[]> {
  try {
    const dbHistory = await getManifestHistoryDbAsync(200);
    if (dbHistory.length > 0) {
      return dbHistory.map((m) => ({
        updateId: m.updateId,
        updateNumber: m.updateNumber,
        version: m.version,
        adDateStr: m.adDateStr,
        adTimeStr: m.adTimeStr,
        dayOfWeek: m.dayOfWeek,
        bsDateStr: m.bsDateStr,
        timeZone: m.timeZone,
        timestampIso: m.timestampIso,
        updateType: m.updateType,
        title: m.title,
        summary: m.summary,
        added: m.added,
        modified: m.modified,
        removed: m.removed,
        totalFilesCount: m.totalFilesCount,
        synchronizationId: m.synchronizationId,
        githubStatus: m.githubStatus,
        remoteCommitSha: m.remoteCommitSha,
        repoUrl: m.repoUrl,
        emailStatus: m.emailStatus,
        emailNumber: m.emailNumber,
        finalStatus: m.finalStatus as UpdateManifest['finalStatus'],
      }));
    }
  } catch (e) {}

  try {
    if (fs.existsSync(MANIFESTS_FILE)) {
      return JSON.parse(fs.readFileSync(MANIFESTS_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [];
}

export function getManifestHistory(): UpdateManifest[] {
  try {
    const dbHistory = getManifestHistoryDb(200);
    if (dbHistory.length > 0) {
      return dbHistory.map((m) => ({
        updateId: m.updateId,
        updateNumber: m.updateNumber,
        version: m.version,
        adDateStr: m.adDateStr,
        adTimeStr: m.adTimeStr,
        dayOfWeek: m.dayOfWeek,
        bsDateStr: m.bsDateStr,
        timeZone: m.timeZone,
        timestampIso: m.timestampIso,
        updateType: m.updateType,
        title: m.title,
        summary: m.summary,
        added: m.added,
        modified: m.modified,
        removed: m.removed,
        totalFilesCount: m.totalFilesCount,
        synchronizationId: m.synchronizationId,
        githubStatus: m.githubStatus,
        remoteCommitSha: m.remoteCommitSha,
        repoUrl: m.repoUrl,
        emailStatus: m.emailStatus,
        emailNumber: m.emailNumber,
        finalStatus: m.finalStatus as UpdateManifest['finalStatus'],
      }));
    }
  } catch (e) {}

  try {
    if (fs.existsSync(MANIFESTS_FILE)) {
      return JSON.parse(fs.readFileSync(MANIFESTS_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [];
}

export async function saveManifestRecordAsync(manifest: UpdateManifest): Promise<void> {
  try {
    await saveUpdateManifestDbAsync({
      ...manifest,
      timestampUtc: new Date(manifest.timestampIso || Date.now()).getTime(),
      status: manifest.githubStatus === 'VERIFIED' ? 'SUCCESS' : 'FAILED',
    });
  } catch (e) {
    console.warn('[Update Pipeline] Failed to save manifest to Store:', e);
  }

  try {
    const history = await getManifestHistoryAsync();
    const existingIdx = history.findIndex((h) => h.updateId === manifest.updateId);
    if (existingIdx >= 0) {
      history[existingIdx] = manifest;
    } else {
      history.unshift(manifest);
    }
    if (history.length > 200) history.pop();
    fs.writeFileSync(MANIFESTS_FILE, JSON.stringify(history, null, 2), 'utf-8');
  } catch (e) {
    console.warn('[Update Pipeline] Backup JSON write warning:', e);
  }
}

export function saveManifestRecord(manifest: UpdateManifest): void {
  saveManifestRecordAsync(manifest).catch((err) => {
    console.warn('[Update Pipeline] Async save manifest record error:', err);
  });
}

export interface ExecuteUpdatePipelineParams {
  title: string;
  summary: string;
  updateType?: UpdateManifest['updateType'];
  bumpVersion?: boolean;
  targetVersion?: string;
  added?: string[];
  modified?: string[];
  removed?: string[];
  actor?: string;
}

export async function executeMasterUpdatePipeline(
  params: ExecuteUpdatePipelineParams
): Promise<UpdateManifest> {
  const now = new Date();
  const dual = formatDualDate(now);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = days[now.getDay()];

  // 1. Get persistent update number
  const updateNumber = await getNextUpdateNumberAsync();

  // 2. Handle Version
  let currentVer = getCurrentVersion();
  if (params.targetVersion) {
    currentVer = params.targetVersion;
    setVersionState(currentVer);
  } else if (params.bumpVersion) {
    const parts = currentVer.split('.').map(Number);
    if (parts.length === 3 && !isNaN(parts[2])) {
      parts[2] += 1;
      currentVer = parts.join('.');
      setVersionState(currentVer);
    }
  }

  const updateId = `SRT-UPD-${updateNumber}-${now.getTime()}`;

  // 3. Security Scan
  const secretCheck = runSecretScan();
  if (!secretCheck.passed) {
    const errorReason = `Security Scan Blocked Update: Found ${secretCheck.detectedSecrets.map((s) => s.path).join(', ')}`;
    recordAuditEvent('SYSTEM_INITIALIZATION', 'UPDATE_BLOCKED_SECURITY', { updateId, errorReason }, params.actor || 'SUPER_ADMIN', undefined, 'HIGH');

    const failedManifest: UpdateManifest = {
      updateId,
      updateNumber,
      version: currentVer,
      adDateStr: dual.adDateStr || now.toISOString().slice(0, 10),
      adTimeStr: dual.timeStr || now.toLocaleTimeString(),
      dayOfWeek,
      bsDateStr: dual.bsDateStr || '२०८३',
      timeZone: 'Asia/Kathmandu',
      timestampIso: now.toISOString(),
      updateType: params.updateType || 'Maintenance',
      title: params.title,
      summary: `SECURITY SCAN FAILED: ${errorReason}`,
      added: params.added || [],
      modified: params.modified || [],
      removed: params.removed || [],
      totalFilesCount: 0,
      synchronizationId: 'NONE',
      githubStatus: 'FAILED',
      repoUrl: 'https://github.com/sdxbyte/saarthi',
      emailStatus: 'FAILED',
      finalStatus: 'FAILED',
    };

    saveManifestRecord(failedManifest);
    return failedManifest;
  }

  // 4. Execute Full SAARTHI GitHub Synchronization
  console.log(`[MASTER UPDATE PIPELINE] Executing Update #${updateNumber} (v${currentVer})...`);

  const syncResult = await executeFullSaarthiGitHubSync(params.title, params.summary, currentVer);

  const githubStatus = syncResult.success ? 'VERIFIED' : 'FAILED';
  const syncId = syncResult.syncId;
  const commitSha = syncResult.commitSha;
  const repoUrl = syncResult.repoUrl || 'https://github.com/sdxbyte/saarthi';

  // 5. Append Immutable Audit Log
  recordAuditEvent(
    'USER_ACTION',
    `PLATFORM_UPDATE_EXECUTED`,
    {
      updateId,
      updateNumber,
      version: currentVer,
      githubStatus,
      commitSha,
      summary: params.summary,
    },
    params.actor || 'SUPER_ADMIN',
    'MASTER_PIPELINE',
    githubStatus === 'VERIFIED' ? 'LOW' : 'MEDIUM'
  );

  // 6. Dispatch Exactly ONE Email Notification
  const emailRes = await dispatchUpdateEmail({
    updateId,
    synchronizationId: syncId,
    updateNumber,
    version: currentVer,
    adDateStr: dual.adDateStr || now.toISOString().slice(0, 10),
    adTimeStr: dual.timeStr || now.toLocaleTimeString(),
    dayOfWeek,
    bsDateStr: dual.bsDateStr || '२०८३ श्रावण २५ गते',
    timeZone: 'Asia/Kathmandu',
    updateType: params.updateType || 'Feature',
    summary: params.summary,
    added: params.added,
    modified: params.modified,
    removed: params.removed,
    githubVerified: syncResult.success,
    commitSha,
    repoUrl,
    failureReason: syncResult.success ? undefined : syncResult.message,
  });

  const emailStatus = emailRes.success ? 'SENT' : 'FAILED';

  // 7. Construct Change Manifest
  const finalStatus = syncResult.success
    ? 'SUCCESSFULLY UPDATED & BACKED UP'
    : 'UPDATE COMPLETED / GITHUB BACKUP FAILED';

  const manifest: UpdateManifest = {
    updateId,
    updateNumber,
    version: currentVer,
    adDateStr: dual.adDateStr || now.toISOString().slice(0, 10),
    adTimeStr: dual.timeStr || now.toLocaleTimeString(),
    dayOfWeek,
    bsDateStr: dual.bsDateStr || '२०८३ श्रावण २५ गते',
    timeZone: 'Asia/Kathmandu',
    timestampIso: now.toISOString(),
    updateType: params.updateType || 'Feature',
    title: params.title,
    summary: params.summary,
    added: params.added || [],
    modified: params.modified || [],
    removed: params.removed || [],
    totalFilesCount: 0,
    synchronizationId: syncId,
    githubStatus,
    remoteCommitSha: commitSha,
    repoUrl,
    emailStatus,
    emailNumber: emailRes.emailNumber,
    finalStatus,
  };

  saveManifestRecord(manifest);

  console.log(`[MASTER UPDATE PIPELINE] Update #${updateNumber} Complete. Final Status: ${finalStatus}`);
  return manifest;
}
