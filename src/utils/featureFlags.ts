export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  category: 'authentication' | 'civic_services' | 'ai_tools' | 'system';
  enabled: boolean;
  lastModified: string;
  modifiedBy: string;
  reason: string;
}

export const DEFAULT_FEATURE_FLAGS: Record<string, FeatureFlag> = {
  google_auth: {
    id: 'google_auth',
    name: 'Google Sign-In',
    description: 'Allow public citizens to authenticate securely using Google OAuth.',
    category: 'authentication',
    enabled: true,
    lastModified: '2026-08-01 10:00:00',
    modifiedBy: 'Super Admin',
    reason: 'Initial production system baseline',
  },
  email_registration: {
    id: 'email_registration',
    name: 'Email Account Registration',
    description: 'Enable public user registration with verified email and password.',
    category: 'authentication',
    enabled: true,
    lastModified: '2026-08-01 10:00:00',
    modifiedBy: 'Super Admin',
    reason: 'Initial production system baseline',
  },
  complaint_submission: {
    id: 'complaint_submission',
    name: 'Grievance / Complaint Submission',
    description: 'Enable public submission of civic grievances and infrastructure complaints.',
    category: 'civic_services',
    enabled: true,
    lastModified: '2026-08-01 10:00:00',
    modifiedBy: 'Super Admin',
    reason: 'Initial production system baseline',
  },
  complaint_tracking: {
    id: 'complaint_tracking',
    name: 'Grievance / Complaint Tracking',
    description: 'Allow citizens to track status and progress of submitted grievances.',
    category: 'civic_services',
    enabled: true,
    lastModified: '2026-08-01 10:00:00',
    modifiedBy: 'Super Admin',
    reason: 'Initial production system baseline',
  },
  ai_assistant: {
    id: 'ai_assistant',
    name: 'Saarthi Digital Navigator',
    description: 'Provide grounded digital guidance for civic queries and service navigation.',
    category: 'civic_services',
    enabled: true,
    lastModified: '2026-08-01 10:00:00',
    modifiedBy: 'Super Admin',
    reason: 'Initial production system baseline',
  },
  announcements: {
    id: 'announcements',
    name: 'Public Notices & Announcements',
    description: 'Display official public circulars, press releases, and notice feeds from external sources.',
    category: 'civic_services',
    enabled: true,
    lastModified: '2026-08-01 10:00:00',
    modifiedBy: 'Super Admin',
    reason: 'Initial production system baseline',
  },
  emergency_contacts: {
    id: 'emergency_contacts',
    name: 'Emergency SOS Contacts',
    description: 'Display quick dial numbers for police, ambulance, fire brigade, and disaster response.',
    category: 'civic_services',
    enabled: true,
    lastModified: '2026-08-01 10:00:00',
    modifiedBy: 'Super Admin',
    reason: 'Initial production system baseline',
  },
  contact_form: {
    id: 'contact_form',
    name: 'Public Contact & Feedback Form',
    description: 'Allow public visitors to submit inquiries directly to administrative support.',
    category: 'civic_services',
    enabled: true,
    lastModified: '2026-08-01 10:00:00',
    modifiedBy: 'Super Admin',
    reason: 'Initial production system baseline',
  },
  maintenance_mode: {
    id: 'maintenance_mode',
    name: 'Platform Maintenance Mode',
    description: 'Restrict public access during scheduled platform upgrades or emergency fixes.',
    category: 'system',
    enabled: false,
    lastModified: '2026-08-01 10:00:00',
    modifiedBy: 'Super Admin',
    reason: 'Initial production system baseline',
  },
};

const FEATURE_FLAGS_STORAGE_KEY = 'saarthi_feature_flags_v1';

export const getFeatureFlags = (): Record<string, FeatureFlag> => {
  try {
    const stored = localStorage.getItem(FEATURE_FLAGS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_FEATURE_FLAGS, ...parsed };
    }
  } catch (err) {
    console.error('Failed to parse stored feature flags', err);
  }
  return DEFAULT_FEATURE_FLAGS;
};

export const saveFeatureFlags = (flags: Record<string, FeatureFlag>): void => {
  try {
    localStorage.setItem(FEATURE_FLAGS_STORAGE_KEY, JSON.stringify(flags));
  } catch (err) {
    console.error('Failed to save feature flags', err);
  }
};

export const isFeatureEnabled = (flagId: string): boolean => {
  const flags = getFeatureFlags();
  return flags[flagId] ? flags[flagId].enabled : true;
};
