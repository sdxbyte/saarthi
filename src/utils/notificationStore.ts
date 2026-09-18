import {
  NotificationLogItem,
  NotificationConfig,
  NotificationEventType,
  NotificationDetails,
} from '../types/notification';
import { formatDualDate } from './bsAdConverter';

const STORAGE_KEY_NOTIF_HISTORY = 'saarthi_notification_history_v1';
const STORAGE_KEY_NOTIF_CONFIG = 'saarthi_notification_config_v1';

export const DEFAULT_NOTIF_CONFIG: NotificationConfig = {
  enabled: true,
  recipientEmail: 'sudipadhikari8107@gmail.com',
  toggles: {
    supportEnquiries: true,
    ticketReplies: true,
    donationUpdates: true,
    adminSettings: true,
    securityAlerts: true,
    systemErrors: true,
  },
  lastSentAt: new Date().toISOString(),
};

// Initial notification history is empty
const SEED_NOTIFICATION_LOGS: NotificationLogItem[] = [];

export function getNotificationHistory(): NotificationLogItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIF_HISTORY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_NOTIF_HISTORY, JSON.stringify(SEED_NOTIFICATION_LOGS));
      return SEED_NOTIFICATION_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_NOTIFICATION_LOGS;
  }
}

export function saveNotificationHistory(items: NotificationLogItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_NOTIF_HISTORY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save notification history:', err);
  }
}

export function getNotificationConfig(): NotificationConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIF_CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_NOTIF_CONFIG, JSON.stringify(DEFAULT_NOTIF_CONFIG));
      return DEFAULT_NOTIF_CONFIG;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_NOTIF_CONFIG;
  }
}

export function saveNotificationConfig(config: NotificationConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_NOTIF_CONFIG, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save notification config:', err);
  }
}

// Generate automatic email & record event in Notification History
export async function triggerAutomaticNotification(
  eventType: NotificationEventType,
  details: NotificationDetails,
  triggeredByModule: string = 'SAARTHI Core'
): Promise<NotificationLogItem> {
  const config = getNotificationConfig();

  // Check category toggle
  let isCategoryEnabled = config.enabled;
  if (isCategoryEnabled && config.toggles) {
    if (eventType === 'SUPPORT_INQUIRY' && !config.toggles.supportEnquiries) isCategoryEnabled = false;
    if (eventType === 'TICKET_REPLY' && !config.toggles.ticketReplies) isCategoryEnabled = false;
    if (eventType === 'DONATION_UPDATE' && !config.toggles.donationUpdates) isCategoryEnabled = false;
    if (eventType === 'ADMIN_SETTING_CHANGE' && !config.toggles.adminSettings) isCategoryEnabled = false;
    if (eventType === 'SECURITY_ALERT' && !config.toggles.securityAlerts) isCategoryEnabled = false;
    if (eventType === 'SYSTEM_ERROR' && !config.toggles.systemErrors) isCategoryEnabled = false;
  }

  const dualDate = formatDualDate(new Date());
  const notifId = `NTF-${Math.floor(1000 + Math.random() * 9000)}`;
  const recipient = config.recipientEmail || 'sudipadhikari8107@gmail.com';

  // Build subject and summary based on eventType
  let subject = `[SAARTHI NOTIFICATION] ${eventType.replace(/_/g, ' ')}`;
  let messageSummary = 'System notification triggered';

  if (eventType === 'SUPPORT_INQUIRY') {
    subject = `[SAARTHI SUPPORT ALERT] New Enquiry #${details.ticketId || 'SRT-NEW'} from ${details.userName || 'Citizen'}`;
    messageSummary = `Support ticket submitted by ${details.userName || 'User'} (${details.userEmail || 'N/A'}). Category: ${details.category || 'General'}`;
  } else if (eventType === 'TICKET_REPLY') {
    subject = `[SAARTHI TICKET UPDATE] Official Reply Dispatched #${details.ticketId || 'SRT'}`;
    messageSummary = `Admin reply sent to ${details.userName || 'Citizen'} (${details.userEmail || 'N/A'}).`;
  } else if (eventType === 'DONATION_UPDATE') {
    subject = `[SAARTHI SYSTEM UPDATE] Support QR / Payment Details Updated`;
    messageSummary = `Payment QR details modified by ${details.whoChangedIt || 'Admin'}. What changed: ${details.whatChanged || 'Payment QR'}`;
  } else if (eventType === 'ADMIN_SETTING_CHANGE') {
    subject = `[SAARTHI ADMIN ALERT] System Settings or User Privileges Changed`;
    messageSummary = `Admin settings changed by ${details.whoChangedIt || 'Admin'}. Item: ${details.whatChanged || 'Configuration'}`;
  } else if (eventType === 'SECURITY_ALERT') {
    subject = `[SAARTHI SECURITY ALERT] Critical Security / Access Event Detected`;
    messageSummary = `Security alert triggered: ${details.whatChanged || 'Privilege Change'} by ${details.whoChangedIt || 'System'}`;
  } else if (eventType === 'SYSTEM_ERROR') {
    subject = `[SAARTHI SYSTEM ERROR] Technical Error Logged`;
    messageSummary = `System error: ${details.message || 'Error occurred'}`;
  } else if (eventType === 'TEST_DISPATCH') {
    subject = `[SAARTHI CONFIRMATION] Test Email Notification System Verification`;
    messageSummary = `Automatic test email verification sent to ${recipient}.`;
  }

  const logItem: NotificationLogItem = {
    id: notifId,
    eventType,
    recipient,
    subject,
    messageSummary,
    details,
    status: isCategoryEnabled ? 'PENDING' : 'FAILED',
    failureReason: isCategoryEnabled ? undefined : 'Category notification disabled in Admin Settings',
    retryCount: 0,
    createdAtIso: new Date().toISOString(),
    bsDateStr: dualDate.bsDateStr,
    adDateStr: dualDate.adDateStr,
    timeStr: dualDate.timeStr || new Date().toLocaleTimeString(),
    triggeredBy: triggeredByModule,
  };

  // Add item to history
  const history = getNotificationHistory();
  const updatedHistory = [logItem, ...history];
  saveNotificationHistory(updatedHistory);

  if (!isCategoryEnabled) {
    return logItem;
  }

  // Call Backend Nodemailer API
  try {
    const res = await fetch('/api/notifications/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notificationId: notifId,
        eventType,
        recipient,
        subject,
        details,
        dualDate,
        triggeredBy: triggeredByModule,
      }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      logItem.status = 'SUCCESS';
    } else {
      logItem.status = 'FAILED';
      logItem.failureReason = data.details || data.error || 'Server dispatch error';
    }
  } catch (err: any) {
    console.warn('[AUTOMATIC NOTIFICATION DISPATCH ERROR]', err);
    logItem.status = 'FAILED';
    logItem.failureReason = err.message || 'Network dispatch failure';
  }

  // Update in history
  const currentHistory = getNotificationHistory();
  const idx = currentHistory.findIndex((h) => h.id === notifId);
  if (idx !== -1) {
    currentHistory[idx] = logItem;
    saveNotificationHistory(currentHistory);
  }

  return logItem;
}

// Manual Retry function for failed emails
export async function retryNotificationDispatch(notifId: string): Promise<boolean> {
  const history = getNotificationHistory();
  const item = history.find((h) => h.id === notifId);
  if (!item) return false;

  item.retryCount = (item.retryCount || 0) + 1;
  item.status = 'PENDING';

  saveNotificationHistory([...history]);

  const dualDate = formatDualDate(new Date());

  try {
    const res = await fetch('/api/notifications/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notificationId: item.id,
        eventType: item.eventType,
        recipient: item.recipient,
        subject: item.subject,
        details: item.details,
        dualDate,
        triggeredBy: `${item.triggeredBy} (Manual Retry #${item.retryCount})`,
      }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      item.status = 'SUCCESS';
      item.failureReason = undefined;
      saveNotificationHistory([...getNotificationHistory()]);
      return true;
    } else {
      item.status = 'FAILED';
      item.failureReason = data.details || data.error || 'Retry dispatch failed';
      saveNotificationHistory([...getNotificationHistory()]);
      return false;
    }
  } catch (err: any) {
    item.status = 'FAILED';
    item.failureReason = err.message || 'Retry dispatch failed';
    saveNotificationHistory([...getNotificationHistory()]);
    return false;
  }
}
