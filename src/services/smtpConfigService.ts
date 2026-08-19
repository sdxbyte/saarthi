import fs from 'fs';
import path from 'path';

export interface SmtpConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpSecure: boolean;
  fromAddress: string;
  fromName: string;
  adminEmail: string;
  updatedAt?: string;
}

const SMTP_CONFIG_FILE = path.join(process.cwd(), 'docs', 'smtp-credentials.json');

export function loadSmtpConfig(): SmtpConfig {
  // Precedence 1: Cloud Run / Environment variables (Primary authoritative source)
  const envPass = process.env.SMTP_PASS;
  const envUser = process.env.SMTP_USER;
  if (envPass && envPass.trim().length >= 8 && envUser && envUser.trim().length > 3) {
    return {
      smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
      smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
      smtpUser: envUser.trim(),
      smtpPass: envPass.replace(/\s+/g, ''),
      smtpSecure: process.env.SMTP_SECURE === 'true',
      fromAddress: process.env.EMAIL_FROM_ADDRESS || envUser.trim(),
      fromName: process.env.EMAIL_FROM_NAME || 'SAARTHI Citizen Portal',
      adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'sudipadhikari8107@gmail.com',
      updatedAt: 'ENVIRONMENT_VARIABLE',
    };
  }

  // Precedence 2: Server-side JSON persistent file (Local/Docker fallback)
  try {
    if (fs.existsSync(SMTP_CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(SMTP_CONFIG_FILE, 'utf-8'));
      if (data && data.smtpUser && data.smtpPass && String(data.smtpPass).trim().length >= 8) {
        return {
          smtpHost: data.smtpHost || process.env.SMTP_HOST || 'smtp.gmail.com',
          smtpPort: Number(data.smtpPort) || Number(process.env.SMTP_PORT) || 587,
          smtpUser: String(data.smtpUser).trim(),
          smtpPass: String(data.smtpPass).replace(/\s+/g, ''),
          smtpSecure: data.smtpSecure ?? (process.env.SMTP_SECURE === 'true'),
          fromAddress: data.fromAddress || process.env.EMAIL_FROM_ADDRESS || data.smtpUser,
          fromName: data.fromName || process.env.EMAIL_FROM_NAME || 'SAARTHI Citizen Portal',
          adminEmail: data.adminEmail || process.env.ADMIN_NOTIFICATION_EMAIL || 'sudipadhikari8107@gmail.com',
          updatedAt: data.updatedAt,
        };
      }
    }
  } catch (e) {
    console.warn('[SMTP Config] Failed to load custom SMTP config file:', e);
  }

  // Precedence 3: Environment variable fallback (No hardcoded credentials)
  const envPassFallback = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
  return {
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
    smtpUser: process.env.SMTP_USER || 'ratobiralo4@gmail.com',
    smtpPass: envPassFallback,
    smtpSecure: process.env.SMTP_SECURE === 'true',
    fromAddress: process.env.EMAIL_FROM_ADDRESS || 'ratobiralo4@gmail.com',
    fromName: process.env.EMAIL_FROM_NAME || 'SAARTHI Citizen Portal',
    adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'sudipadhikari8107@gmail.com',
  };
}

export function saveSmtpConfig(config: Partial<SmtpConfig>): SmtpConfig {
  const current = loadSmtpConfig();
  const updated: SmtpConfig = {
    ...current,
    ...config,
    smtpUser: (config.smtpUser || current.smtpUser).trim(),
    smtpPass: (config.smtpPass || current.smtpPass).replace(/\s+/g, ''),
    updatedAt: new Date().toISOString(),
  };

  try {
    const docsDir = path.dirname(SMTP_CONFIG_FILE);
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    fs.writeFileSync(SMTP_CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (e) {
    console.error('[SMTP Config] Failed to save SMTP config file:', e);
  }

  return updated;
}

export function getMaskedSmtpConfig() {
  const config = loadSmtpConfig();
  return {
    smtpHost: config.smtpHost,
    smtpPort: config.smtpPort,
    smtpUser: config.smtpUser ? `${config.smtpUser.slice(0, 3)}***@${config.smtpUser.split('@')[1] || 'gmail.com'}` : '',
    smtpPassMasked: config.smtpPass ? '••••••••••••••••' : '',
    hasPassword: !!(config.smtpPass && config.smtpPass.length >= 8),
    adminEmail: config.adminEmail,
    fromName: config.fromName,
    updatedAt: config.updatedAt,
  };
}
