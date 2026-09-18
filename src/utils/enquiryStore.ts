// Contact Enquiry and Email Notification Store
import { triggerAutomaticNotification } from './notificationStore';

export interface ContactEnquiry {
  id: string; // e.g. "SRT-83921"
  fullName: string;
  email: string;
  phone: string;
  category: string;
  message: string;
  submittedAtIso: string; // e.g. "2026-08-04T08:30:00.000Z"
  status: 'New' | 'Reviewing' | 'In Progress' | 'Resolved' | 'Closed' | 'Archived';
  internalNotes?: string[];
  adminReply?: string;
  isRead?: boolean;
}

export interface EmailNotificationConfig {
  enabled: boolean;
  recipientEmail: string; // Admin notification email
  notifyOnNewEnquiry: boolean;
  notifyOnCriticalGrievance: boolean;
  smtpServerConfigured: boolean;
  lastSentAt?: string;
}

const STORAGE_KEY_ENQUIRIES = 'saarthi_contact_enquiries_v1';
const STORAGE_KEY_EMAIL_CONFIG = 'saarthi_email_notif_config_v1';

const INITIAL_ENQUIRIES: ContactEnquiry[] = [];

const DEFAULT_EMAIL_CONFIG: EmailNotificationConfig = {
  enabled: true,
  recipientEmail: 'sudipadhikari8107@gmail.com',
  notifyOnNewEnquiry: true,
  notifyOnCriticalGrievance: true,
  smtpServerConfigured: true,
  lastSentAt: new Date().toISOString(),
};

export function getContactEnquiries(): ContactEnquiry[] {
  const saved = localStorage.getItem(STORAGE_KEY_ENQUIRIES);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEY_ENQUIRIES, JSON.stringify(INITIAL_ENQUIRIES));
  return INITIAL_ENQUIRIES;
}

export function saveContactEnquiries(enquiries: ContactEnquiry[]): void {
  localStorage.setItem(STORAGE_KEY_ENQUIRIES, JSON.stringify(enquiries));
}

export function addContactEnquiry(data: {
  fullName: string;
  email: string;
  phone: string;
  category: string;
  message: string;
}): ContactEnquiry {
  const enquiries = getContactEnquiries();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const newEnquiry: ContactEnquiry = {
    id: `SRT-${randomNum}`,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone || 'N/A',
    category: data.category || 'General Inquiry',
    message: data.message,
    submittedAtIso: new Date().toISOString(),
    status: 'New',
    isRead: false,
    internalNotes: [],
  };

  const updated = [newEnquiry, ...enquiries];
  saveContactEnquiries(updated);

  // Trigger automatic email dispatch to admin via Notification Engine
  triggerAutomaticNotification('SUPPORT_INQUIRY', {
    ticketId: newEnquiry.id,
    userName: newEnquiry.fullName,
    userEmail: newEnquiry.email,
    userPhone: newEnquiry.phone,
    category: newEnquiry.category,
    message: newEnquiry.message,
  }, 'Contact SAARTHI Public Form');

  dispatchEmailNotification(newEnquiry);

  return newEnquiry;
}

export function updateEnquiryStatus(
  id: string,
  status: 'New' | 'Reviewing' | 'In Progress' | 'Resolved' | 'Closed' | 'Archived',
  adminReply?: string,
  addedNote?: string
): ContactEnquiry[] {
  const enquiries = getContactEnquiries();
  const targetEnquiry = enquiries.find((e) => e.id === id);

  const updated = enquiries.map((item) => {
    if (item.id === id) {
      const notes = item.internalNotes || [];
      if (addedNote && addedNote.trim()) {
        notes.push(`[${new Date().toLocaleTimeString()}] ${addedNote.trim()}`);
      }
      return {
        ...item,
        status,
        adminReply: adminReply !== undefined ? adminReply : item.adminReply,
        internalNotes: notes,
        isRead: true,
      };
    }
    return item;
  });

  saveContactEnquiries(updated);

  if (adminReply && adminReply.trim() && targetEnquiry) {
    triggerAutomaticNotification('TICKET_REPLY', {
      ticketId: id,
      userName: targetEnquiry.fullName,
      userEmail: targetEnquiry.email,
      message: adminReply,
    }, 'Admin Contact Inbox Reply');
  }

  return updated;
}

export function getEmailConfig(): EmailNotificationConfig {
  const saved = localStorage.getItem(STORAGE_KEY_EMAIL_CONFIG);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEY_EMAIL_CONFIG, JSON.stringify(DEFAULT_EMAIL_CONFIG));
  return DEFAULT_EMAIL_CONFIG;
}

export function saveEmailConfig(config: EmailNotificationConfig): void {
  localStorage.setItem(STORAGE_KEY_EMAIL_CONFIG, JSON.stringify(config));
}

export function dispatchEmailNotification(enquiry: ContactEnquiry): void {
  const config = getEmailConfig();
  if (!config.enabled || !config.notifyOnNewEnquiry) return;

  const payload = {
    to: config.recipientEmail || 'sudipadhikari8107@gmail.com',
    enquiryId: enquiry.id,
    senderName: enquiry.fullName,
    senderEmail: enquiry.email,
    senderPhone: enquiry.phone,
    category: enquiry.category,
    message: enquiry.message,
  };

  fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(async (res) => {
      try {
        const text = await res.text();
        return JSON.parse(text);
      } catch {
        return { error: `HTTP ${res.status} non-JSON response` };
      }
    })
    .then((data) => {
      console.log('[SAARTHI EMAIL API RESP]', data);
    })
    .catch((err) => {
      console.warn('[SAARTHI EMAIL API WARN]', err);
    });

  config.lastSentAt = new Date().toISOString();
  saveEmailConfig(config);
}

export function sendTestEmailConfirmation(recipientOverride?: string): { success: boolean; recipient: string; timestampIso: string } {
  const config = getEmailConfig();
  const recipient = recipientOverride || config.recipientEmail || 'sudipadhikari8107@gmail.com';
  const timestampIso = new Date().toISOString();

  fetch('/api/email/test-smtp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipientEmail: recipient }),
  })
    .then(async (res) => {
      try {
        const text = await res.text();
        return JSON.parse(text);
      } catch {
        return { error: `HTTP ${res.status} non-JSON response` };
      }
    })
    .then((data) => {
      console.log('[SAARTHI SMTP TEST RESP]', data);
    })
    .catch((err) => {
      console.warn('[SAARTHI SMTP TEST WARN]', err);
    });

  config.lastSentAt = timestampIso;
  saveEmailConfig(config);

  return {
    success: true,
    recipient,
    timestampIso,
  };
}
