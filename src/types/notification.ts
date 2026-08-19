export type NotificationEventType =
  | 'SUPPORT_INQUIRY'
  | 'TICKET_REPLY'
  | 'DONATION_UPDATE'
  | 'ADMIN_SETTING_CHANGE'
  | 'SECURITY_ALERT'
  | 'SYSTEM_ERROR'
  | 'TEST_DISPATCH';

export type EmailDeliveryStatus = 'SUCCESS' | 'FAILED' | 'PENDING';

export interface NotificationDetails {
  ticketId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  message?: string;
  whatChanged?: string;
  whoChangedIt?: string;
  previousValue?: string;
  newValue?: string;
  ipAddress?: string;
  category?: string;
}

export interface NotificationLogItem {
  id: string;
  eventType: NotificationEventType;
  recipient: string;
  subject: string;
  messageSummary: string;
  details?: NotificationDetails;
  status: EmailDeliveryStatus;
  failureReason?: string;
  retryCount: number;
  createdAtIso: string;
  bsDateStr: string;
  adDateStr: string;
  timeStr: string;
  triggeredBy: string;
}

export interface CategoryNotificationToggle {
  supportEnquiries: boolean;
  ticketReplies: boolean;
  donationUpdates: boolean;
  adminSettings: boolean;
  securityAlerts: boolean;
  systemErrors: boolean;
}

export interface NotificationConfig {
  enabled: boolean;
  recipientEmail: string;
  toggles: CategoryNotificationToggle;
  lastSentAt?: string;
}
