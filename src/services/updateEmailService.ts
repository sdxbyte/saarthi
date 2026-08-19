import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { loadSmtpConfig } from './smtpConfigService';
import {
  allocateNextEmailNumberAtomic,
  allocateNextEmailNumberAtomicAsync,
  recordEmailDispatchDb,
  recordEmailDispatchDbAsync,
  getEmailHistoryDb,
  getEmailHistoryDbAsync,
  findEmailByUpdateIdDb,
  findEmailByUpdateIdDbAsync,
  DbEmailRecord,
} from '../db/persistentStore';

export interface EmailDispatchRecord {
  emailNumber: number;
  updateId: string;
  synchronizationId: string;
  version: string;
  updateNumber: number;
  recipient: string;
  subject: string;
  status: 'SENT' | 'FAILED' | 'SKIPPED_DUPLICATE';
  sentAtIso: string;
  mode: string;
  errorMessage?: string;
}

const EMAIL_HISTORY_FILE = path.join(process.cwd(), 'data_email_history.json');

async function getNextEmailNumberAsync(): Promise<number> {
  return await allocateNextEmailNumberAtomicAsync();
}

function getNextEmailNumber(): number {
  try {
    return allocateNextEmailNumberAtomic();
  } catch (e) {
    return 1;
  }
}

export async function getEmailHistoryAsync(): Promise<EmailDispatchRecord[]> {
  try {
    const dbLogs = await getEmailHistoryDbAsync(300);
    if (dbLogs.length > 0) {
      return dbLogs.map((d) => ({
        emailNumber: d.emailNumber,
        updateId: d.updateId,
        synchronizationId: d.synchronizationId,
        version: d.version,
        updateNumber: d.updateNumber,
        recipient: d.recipient,
        subject: d.subject,
        status: d.status as EmailDispatchRecord['status'],
        sentAtIso: d.sentAtIso,
        mode: d.mode,
        errorMessage: d.errorMessage,
      }));
    }
  } catch (e) {}

  try {
    if (fs.existsSync(EMAIL_HISTORY_FILE)) {
      return JSON.parse(fs.readFileSync(EMAIL_HISTORY_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [];
}

export function getEmailHistory(): EmailDispatchRecord[] {
  try {
    const dbLogs = getEmailHistoryDb(300);
    if (dbLogs.length > 0) {
      return dbLogs.map((d) => ({
        emailNumber: d.emailNumber,
        updateId: d.updateId,
        synchronizationId: d.synchronizationId,
        version: d.version,
        updateNumber: d.updateNumber,
        recipient: d.recipient,
        subject: d.subject,
        status: d.status as EmailDispatchRecord['status'],
        sentAtIso: d.sentAtIso,
        mode: d.mode,
        errorMessage: d.errorMessage,
      }));
    }
  } catch (e) {}

  try {
    if (fs.existsSync(EMAIL_HISTORY_FILE)) {
      return JSON.parse(fs.readFileSync(EMAIL_HISTORY_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [];
}

export async function recordEmailDispatchAsync(record: EmailDispatchRecord): Promise<void> {
  try {
    await recordEmailDispatchDbAsync({
      emailNumber: record.emailNumber,
      updateId: record.updateId,
      synchronizationId: record.synchronizationId,
      version: record.version,
      updateNumber: record.updateNumber,
      recipient: record.recipient,
      subject: record.subject,
      status: record.status as DbEmailRecord['status'],
      sentAtIso: record.sentAtIso,
      mode: record.mode,
      errorMessage: record.errorMessage,
      retryCount: 0,
    });
  } catch (e) {
    console.warn('[Update Email Service] Store write warning:', e);
  }

  // Backup write to JSON for local export
  try {
    const history = await getEmailHistoryAsync();
    const existingIdx = history.findIndex((h) => h.emailNumber === record.emailNumber);
    if (existingIdx >= 0) {
      history[existingIdx] = record;
    } else {
      history.unshift(record);
    }
    if (history.length > 300) history.pop();
    fs.writeFileSync(EMAIL_HISTORY_FILE, JSON.stringify(history, null, 2), 'utf-8');
  } catch (e) {
    console.warn('[Update Email Service] JSON backup write warning:', e);
  }
}

function recordEmailDispatch(record: EmailDispatchRecord): void {
  recordEmailDispatchAsync(record).catch((err) => {
    console.warn('[Update Email Service] Async record email dispatch error:', err);
  });
}

export interface SendUpdateEmailParams {
  updateId: string;
  synchronizationId: string;
  updateNumber: number;
  version: string;
  adDateStr: string;
  adTimeStr: string;
  dayOfWeek: string;
  bsDateStr: string;
  timeZone: string;
  updateType: string;
  summary: string;
  added?: string[];
  modified?: string[];
  removed?: string[];
  githubVerified: boolean;
  commitSha?: string;
  repoUrl?: string;
  filesChangedCount?: number;
  failureReason?: string;
}

export async function dispatchUpdateEmail(
  params: SendUpdateEmailParams
): Promise<{ success: boolean; emailNumber?: number; mode: string; message: string }> {
  // Idempotency check: Don't send duplicate emails for same updateId
  const existing = await findEmailByUpdateIdDbAsync(params.updateId);
  if (existing) {
    return {
      success: true,
      emailNumber: existing.emailNumber,
      mode: 'idempotent_skip',
      message: `Email already sent for Update ID ${params.updateId} (Email #${existing.emailNumber}). Duplicate dispatch skipped.`,
    };
  }

  const recipient = process.env.ADMIN_NOTIFICATION_EMAIL || 'sudipadhikari8107@gmail.com';
  const emailNumber = await getNextEmailNumberAsync();

  const isSuccess = params.githubVerified;
  const subject = isSuccess
    ? `SAARTHI Update #${params.updateNumber} — v${params.version} — GitHub Backup VERIFIED`
    : `SAARTHI Update #${params.updateNumber} — v${params.version} — GitHub Backup FAILED`;

  const addedHtml = params.added?.length
    ? params.added.map((a) => `<li>${a}</li>`).join('')
    : '<li>General platform update & optimizations</li>';
  const modifiedHtml = params.modified?.length
    ? params.modified.map((m) => `<li>${m}</li>`).join('')
    : '<li>Codebase synchronization & core maintenance</li>';
  const removedHtml = params.removed?.length
    ? params.removed.map((r) => `<li>${r}</li>`).join('')
    : '<li>None</li>';

  const statusBadge = isSuccess
    ? `<span style="background-color: #059669; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 13px;">FULL SAARTHI SYNC VERIFIED</span>`
    : `<span style="background-color: #dc2626; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 13px;">GITHUB BACKUP FAILED</span>`;

  const commitLink = params.commitSha
    ? `<a href="${params.repoUrl || 'https://github.com/sdxbyte/saarthi'}/commit/${params.commitSha}" style="color: #38bdf8; font-family: monospace;">${params.commitSha.slice(0, 8)}</a>`
    : 'N/A';

  const emailHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 680px; margin: 0 auto; border: 1px solid #1e293b; border-radius: 16px; padding: 28px; background-color: #0f172a; color: #f8fafc; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
      <div style="border-bottom: 2px solid ${isSuccess ? '#10b981' : '#f43f5e'}; padding-bottom: 16px; margin-bottom: 20px;">
        <h2 style="color: ${isSuccess ? '#10b981' : '#f43f5e'}; margin: 0; font-size: 22px; font-weight: bold;">SAARTHI UPDATE NOTIFICATION</h2>
        <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px;">Official System Synchronization & Automated Email Report #${emailNumber}</p>
      </div>

      <div style="margin-bottom: 20px;">
        ${statusBadge}
      </div>

      <table style="width: 100%; text-align: left; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; width: 160px; font-weight: bold; border-bottom: 1px solid #1e293b;">Update Number:</td>
          <td style="padding: 8px 0; color: #f59e0b; font-weight: bold; border-bottom: 1px solid #1e293b;">Update #${params.updateNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; font-weight: bold; border-bottom: 1px solid #1e293b;">Version:</td>
          <td style="padding: 8px 0; color: #38bdf8; font-weight: bold; border-bottom: 1px solid #1e293b;">SAARTHI v${params.version}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; font-weight: bold; border-bottom: 1px solid #1e293b;">Update ID:</td>
          <td style="padding: 8px 0; color: #cbd5e1; font-family: monospace; border-bottom: 1px solid #1e293b;">${params.updateId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; font-weight: bold; border-bottom: 1px solid #1e293b;">Synchronization ID:</td>
          <td style="padding: 8px 0; color: #cbd5e1; font-family: monospace; border-bottom: 1px solid #1e293b;">${params.synchronizationId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; font-weight: bold; border-bottom: 1px solid #1e293b;">AD Date & Time:</td>
          <td style="padding: 8px 0; color: #ffffff; border-bottom: 1px solid #1e293b;">${params.adDateStr} ${params.adTimeStr} (${params.dayOfWeek})</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; font-weight: bold; border-bottom: 1px solid #1e293b;">BS Date:</td>
          <td style="padding: 8px 0; color: #f59e0b; font-weight: bold; border-bottom: 1px solid #1e293b;">${params.bsDateStr} B.S.</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; font-weight: bold; border-bottom: 1px solid #1e293b;">Time Zone:</td>
          <td style="padding: 8px 0; color: #94a3b8; border-bottom: 1px solid #1e293b;">${params.timeZone}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; font-weight: bold; border-bottom: 1px solid #1e293b;">Update Type:</td>
          <td style="padding: 8px 0; color: #e2e8f0; border-bottom: 1px solid #1e293b;">${params.updateType}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; font-weight: bold; border-bottom: 1px solid #1e293b;">Verified Commit:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #1e293b;">${commitLink}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; font-weight: bold; border-bottom: 1px solid #1e293b;">Backup Status:</td>
          <td style="padding: 8px 0; color: ${isSuccess ? '#10b981' : '#f43f5e'}; font-weight: bold; border-bottom: 1px solid #1e293b;">${isSuccess ? 'VERIFIED' : 'FAILED'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #94a3b8; font-weight: bold; border-bottom: 1px solid #1e293b;">Final Status:</td>
          <td style="padding: 8px 0; color: ${isSuccess ? '#10b981' : '#f43f5e'}; font-weight: bold; border-bottom: 1px solid #1e293b;">${isSuccess ? 'SUCCESSFULLY UPDATED & BACKED UP' : 'UPDATE COMPLETED / GITHUB BACKUP FAILED'}</td>
        </tr>
      </table>

      ${
        !isSuccess && params.failureReason
          ? `<div style="background-color: #381318; border: 1px solid #9f1239; padding: 14px; border-radius: 10px; margin-bottom: 20px;">
              <p style="color: #fecdd3; margin: 0; font-size: 13px;"><strong>Backup Failure Reason:</strong> ${params.failureReason}</p>
             </div>`
          : ''
      }

      <div style="background-color: #1e293b; padding: 18px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #334155;">
        <h3 style="color: #38bdf8; margin-top: 0; font-size: 15px; font-weight: bold;">📝 Change Summary:</h3>
        <p style="color: #e2e8f0; font-size: 13px; line-height: 1.6; margin: 0 0 12px 0;">${params.summary}</p>

        <h4 style="color: #10b981; margin: 12px 0 6px 0; font-size: 13px;">Added:</h4>
        <ul style="color: #cbd5e1; margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.5;">${addedHtml}</ul>

        <h4 style="color: #f59e0b; margin: 12px 0 6px 0; font-size: 13px;">Modified:</h4>
        <ul style="color: #cbd5e1; margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.5;">${modifiedHtml}</ul>

        <h4 style="color: #f43f5e; margin: 12px 0 6px 0; font-size: 13px;">Removed:</h4>
        <ul style="color: #cbd5e1; margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.5;">${removedHtml}</ul>
      </div>

      <div style="border-top: 1px solid #334155; padding-top: 16px; text-align: center; color: #64748b; font-size: 12px;">
        Sent automatically by SAARTHI Master Email Engine to <strong>${recipient}</strong> • Ref: SRT-EML-${emailNumber}
      </div>
    </div>
  `;

  const smtpConfig = loadSmtpConfig();
  const user = smtpConfig.smtpUser;
  const pass = smtpConfig.smtpPass;
  const host = smtpConfig.smtpHost;

  let primarySuccess = false;
  let primaryError = '';

  // Try Port 465 (SSL) first if Gmail
  const portsToTry = host.includes('gmail')
    ? [
        { port: 465, secure: true },
        { port: 587, secure: false, requireTLS: true },
      ]
    : [{ port: smtpConfig.smtpPort, secure: smtpConfig.smtpSecure }];

  for (const p of portsToTry) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: p.port,
        secure: p.secure,
        requireTLS: (p as any).requireTLS,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 10000,
      });

      await transporter.sendMail({
        from: `"${smtpConfig.fromName}" <${user}>`,
        to: recipient,
        subject,
        html: emailHtml,
      });

      primarySuccess = true;
      break;
    } catch (err: any) {
      primaryError = err.message || String(err);
      console.warn(`[Update Email Service] SMTP attempt on port ${p.port} failed: ${primaryError}`);
    }
  }

  if (primarySuccess) {
    recordEmailDispatch({
      emailNumber,
      updateId: params.updateId,
      synchronizationId: params.synchronizationId,
      version: params.version,
      updateNumber: params.updateNumber,
      recipient,
      subject,
      status: 'SENT',
      sentAtIso: new Date().toISOString(),
      mode: 'smtp',
    });

    return {
      success: true,
      emailNumber,
      mode: 'smtp',
      message: `Email #${emailNumber} dispatched successfully to ${recipient} via SMTP`,
    };
  }

  console.warn('[Update Email Service] Primary SMTP failed for all ports:', primaryError);

    try {
      const testAccount = await nodemailer.createTestAccount();
      const ethTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });

      const info = await ethTransporter.sendMail({
        from: `"SAARTHI Platform" <no-reply@saarthi.np>`,
        to: recipient,
        subject,
        html: emailHtml,
      });

      const testUrl = nodemailer.getTestMessageUrl(info) || undefined;

      recordEmailDispatch({
        emailNumber,
        updateId: params.updateId,
        synchronizationId: params.synchronizationId,
        version: params.version,
        updateNumber: params.updateNumber,
        recipient,
        subject,
        status: 'SENT',
        sentAtIso: new Date().toISOString(),
        mode: 'ethereal_fallback',
      });

      return {
        success: true,
        emailNumber,
        mode: 'ethereal_fallback',
        message: `Email #${emailNumber} dispatched via fallback test transport. Preview: ${testUrl}`,
      };
    } catch (ethErr: any) {
      recordEmailDispatch({
        emailNumber,
        updateId: params.updateId,
        synchronizationId: params.synchronizationId,
        version: params.version,
        updateNumber: params.updateNumber,
        recipient,
        subject,
        status: 'FAILED',
        sentAtIso: new Date().toISOString(),
        mode: 'failed',
        errorMessage: ethErr.message,
      });

      return {
        success: false,
        emailNumber,
        mode: 'failed',
        message: `Email delivery failed: ${ethErr.message}`,
      };
    }
  }
