// Immutable Audit & System Logging Engine for SAARTHI
// Rule 1, 13, & 23: Permanent Audit Trail with Dual AD/BS Date Signatures

import { formatDualDate } from '../utils/bsAdConverter';
import {
  saveAuditEventDb,
  saveAuditEventDbAsync,
  getAuditLogsDb,
  getAuditLogsDbAsync,
} from '../db/persistentStore';

export interface SystemAuditEvent {
  id: string;
  eventType:
    | 'DATA_SOURCE_FETCH'
    | 'DATA_VALIDATION_PASSED'
    | 'DATA_VALIDATION_FAILED'
    | 'MANUAL_ADMIN_OVERRIDE'
    | 'SYSTEM_INITIALIZATION'
    | 'USER_ACTION'
    | 'ADMIN_ACTION'
    | 'SYSTEM_EVENT';
  sourceId?: string;
  actor: string; // 'SYSTEM_ENGINE' or User ID
  action: string;
  adDateStr: string;
  bsDateStr: string;
  timeStr: string;
  timeZone: string;
  timestampIso: string;
  details: Record<string, any>;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

const AUDIT_STORAGE_KEY = 'saarthi_immutable_audit_trail_v2';

export async function recordAuditEventAsync(
  eventType: SystemAuditEvent['eventType'],
  action: string,
  details: Record<string, any> = {},
  actor: string = 'SYSTEM_ENGINE',
  sourceId?: string,
  riskLevel: SystemAuditEvent['riskLevel'] = 'LOW'
): Promise<SystemAuditEvent> {
  const now = new Date();
  const dual = formatDualDate(now);

  const event: SystemAuditEvent = {
    id: `audit-${now.getTime()}-${Math.floor(Math.random() * 10000)}`,
    eventType,
    sourceId,
    actor,
    action,
    adDateStr: dual.adDateStr,
    bsDateStr: dual.bsDateStr,
    timeStr: dual.timeStr || now.toLocaleTimeString(),
    timeZone: 'Asia/Kathmandu',
    timestampIso: now.toISOString(),
    details,
    riskLevel,
  };

  if (typeof window === 'undefined') {
    try {
      await saveAuditEventDbAsync({
        ...event,
        timestampUtc: now.getTime(),
      });
    } catch (e) {
      console.warn('[SAARTHI Audit Engine] Server Store warning:', e);
    }
  }

  return event;
}

export function recordAuditEvent(
  eventType: SystemAuditEvent['eventType'],
  action: string,
  details: Record<string, any> = {},
  actor: string = 'SYSTEM_ENGINE',
  sourceId?: string,
  riskLevel: SystemAuditEvent['riskLevel'] = 'LOW'
): SystemAuditEvent {
  recordAuditEventAsync(eventType, action, details, actor, sourceId, riskLevel).catch((err) => {
    console.warn('[SAARTHI Audit Engine] Async record audit event error:', err);
  });

  const now = new Date();
  const dual = formatDualDate(now);
  return {
    id: `audit-${now.getTime()}-${Math.floor(Math.random() * 10000)}`,
    eventType,
    sourceId,
    actor,
    action,
    adDateStr: dual.adDateStr,
    bsDateStr: dual.bsDateStr,
    timeStr: dual.timeStr || now.toLocaleTimeString(),
    timeZone: 'Asia/Kathmandu',
    timestampIso: now.toISOString(),
    details,
    riskLevel,
  };
}

export async function getAuditLogsAsync(): Promise<SystemAuditEvent[]> {
  if (typeof window === 'undefined') {
    try {
      const dbLogs = await getAuditLogsDbAsync(200);
      return dbLogs.map((l) => ({
        id: l.id,
        eventType: l.eventType as SystemAuditEvent['eventType'],
        sourceId: l.sourceId,
        actor: l.actor,
        action: l.action,
        adDateStr: l.adDateStr,
        bsDateStr: l.bsDateStr,
        timeStr: l.timeStr,
        timeZone: l.timeZone,
        timestampIso: l.timestampIso,
        details: l.details,
        riskLevel: l.riskLevel as SystemAuditEvent['riskLevel'],
      }));
    } catch (e) {
      return [];
    }
  }
  return getAuditLogs();
}

export function getAuditLogs(): SystemAuditEvent[] {
  if (typeof window === 'undefined') {
    try {
      const dbLogs = getAuditLogsDb(200);
      return dbLogs.map((l) => ({
        id: l.id,
        eventType: l.eventType as SystemAuditEvent['eventType'],
        sourceId: l.sourceId,
        actor: l.actor,
        action: l.action,
        adDateStr: l.adDateStr,
        bsDateStr: l.bsDateStr,
        timeStr: l.timeStr,
        timeZone: l.timeZone,
        timestampIso: l.timestampIso,
        details: l.details,
        riskLevel: l.riskLevel as SystemAuditEvent['riskLevel'],
      }));
    } catch (e) {
      return [];
    }
  } else {
    try {
      const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
}
