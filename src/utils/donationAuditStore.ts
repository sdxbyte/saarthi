// Admin Audit Log Store for Donation Section
import { formatDualDate } from './bsAdConverter';

export interface DonationAuditEntry {
  id: string;
  actionType: 'PUBLISHED' | 'ACTIVATED' | 'DEACTIVATED' | 'QR_UPDATED' | 'BANK_INFO_UPDATED' | 'DETAILS_MODIFIED' | 'CONFIG_CHANGED';
  title: string; // e.g. "Bank QR updated", "Donation section published"
  adminName: string; // Admin identity e.g. "Sudip Adhikari (Super Admin)"
  adminId: string;
  timestampIso: string; // ISO string
  previousValue?: string;
  updatedValue?: string;
  notes?: string;
}

const STORAGE_KEY_DONATION_AUDIT = 'saarthi_donation_audit_logs_v1';

const INITIAL_DONATION_AUDIT_LOGS: DonationAuditEntry[] = [];

export function getDonationAuditLogs(): DonationAuditEntry[] {
  const saved = localStorage.getItem(STORAGE_KEY_DONATION_AUDIT);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEY_DONATION_AUDIT, JSON.stringify(INITIAL_DONATION_AUDIT_LOGS));
  return INITIAL_DONATION_AUDIT_LOGS;
}

export function addDonationAuditLog(entry: Omit<DonationAuditEntry, 'id' | 'timestampIso'>): DonationAuditEntry {
  const logs = getDonationAuditLogs();
  const randomNum = Math.floor(100 + Math.random() * 900);
  const newLog: DonationAuditEntry = {
    ...entry,
    id: `DON-AUD-${randomNum}`,
    timestampIso: new Date().toISOString(),
  };

  const updated = [newLog, ...logs];
  localStorage.setItem(STORAGE_KEY_DONATION_AUDIT, JSON.stringify(updated));
  return newLog;
}
