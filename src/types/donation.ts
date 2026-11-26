export interface BankDonationMethod {
  enabled: boolean;
  qrImageDataUrl: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  branchName: string;
  swiftCode?: string;
  instructions?: string;
}

export interface SmartQrMethod {
  enabled: boolean;
  qrImageDataUrl: string;
  merchantName: string;
  merchantId?: string;
  instructions?: string;
}

export interface ConnectIpsMethod {
  enabled: boolean;
  qrImageDataUrl: string;
  registeredName: string;
  userOrMemberId: string;
  bankName?: string;
  accountNumber?: string;
  instructions?: string;
}

export interface DigitalWalletMethod {
  enabled: boolean;
  esewaNumber: string;
  esewaQrDataUrl?: string;
  khaltiNumber: string;
  khaltiQrDataUrl?: string;
  moruNumber: string;
  moruQrDataUrl?: string;
  instructions?: string;
}

export interface DonationAuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  actionSummary: string;
}

export interface SupportDonationConfig {
  isPublished: boolean;
  lastPublishedAt: string;
  generalNote?: string;
  bank: BankDonationMethod;
  smartQr: SmartQrMethod;
  connectIps: ConnectIpsMethod;
  wallets: DigitalWalletMethod;
  auditLogs: DonationAuditLog[];
}

export const INITIAL_EMPTY_DONATION_CONFIG: SupportDonationConfig = {
  isPublished: true,
  lastPublishedAt: new Date().toISOString(),
  generalNote: 'Your voluntary support helps maintain platform operations and public availability for citizens across Nepal.',
  bank: {
    enabled: true,
    qrImageDataUrl: '',
    bankName: 'Nabil Bank',
    accountHolderName: 'SUDIP ADHIKARI',
    accountNumber: '09810017569896',
    branchName: 'nBank',
    swiftCode: '',
    instructions: 'Copy account details to transfer via Mobile Banking / NCHL / IPS.',
  },
  smartQr: {
    enabled: false,
    qrImageDataUrl: '',
    merchantName: '',
    merchantId: '',
    instructions: 'Copy merchant details or payment ID to send funds via Mobile Banking app.',
  },
  connectIps: {
    enabled: true,
    qrImageDataUrl: '',
    registeredName: 'SUDIP ADHIKARI',
    userOrMemberId: '9842438107',
    bankName: 'Nabil Bank',
    accountNumber: '09810017569896',
    instructions: 'Copy details or use ConnectIPS for instant interbank fund transfer.',
  },
  wallets: {
    enabled: true,
    esewaNumber: '9842438107',
    esewaQrDataUrl: '',
    khaltiNumber: '9842438107',
    khaltiQrDataUrl: '',
    moruNumber: '9842438107',
    moruQrDataUrl: '',
    instructions: 'Send donation via eSewa, Khalti, ConnectIPS, or MoRu to ID 9842438107.',
  },
  auditLogs: [
    {
      id: 'log-official-details-1',
      timestamp: new Date().toISOString(),
      adminName: 'SAARTHI Super Admin',
      actionSummary: 'Published official verified Nabil Bank, ConnectIPS, and digital wallet payment details for public support.'
    }
  ],
};

export const STORAGE_KEY_DONATION_CONFIG = 'saarthi_donation_config_v2';

export function getDonationConfig(): SupportDonationConfig {
  if (typeof window === 'undefined') return INITIAL_EMPTY_DONATION_CONFIG;
  const saved = localStorage.getItem(STORAGE_KEY_DONATION_CONFIG);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        const bankObj: BankDonationMethod = {
          ...INITIAL_EMPTY_DONATION_CONFIG.bank,
          ...(parsed.bank || {}),
        };
        if (bankObj.enabled === undefined) bankObj.enabled = true;

        const connectIpsObj: ConnectIpsMethod = {
          ...INITIAL_EMPTY_DONATION_CONFIG.connectIps,
          ...(parsed.connectIps || {}),
        };
        if (connectIpsObj.qrImageDataUrl === '/connectips_qr.png') {
          connectIpsObj.qrImageDataUrl = '';
        }
        if (connectIpsObj.enabled === undefined) connectIpsObj.enabled = true;

        const walletsObj: DigitalWalletMethod = {
          ...INITIAL_EMPTY_DONATION_CONFIG.wallets,
          ...(parsed.wallets || {}),
        };
        if (walletsObj.enabled === undefined) walletsObj.enabled = true;

        return {
          ...INITIAL_EMPTY_DONATION_CONFIG,
          ...parsed,
          isPublished:
            typeof parsed.isPublished === 'boolean'
              ? parsed.isPublished
              : INITIAL_EMPTY_DONATION_CONFIG.isPublished,
          bank: bankObj,
          smartQr: { ...INITIAL_EMPTY_DONATION_CONFIG.smartQr, ...(parsed.smartQr || {}) },
          connectIps: connectIpsObj,
          wallets: walletsObj,
          auditLogs: Array.isArray(parsed.auditLogs)
            ? parsed.auditLogs
            : INITIAL_EMPTY_DONATION_CONFIG.auditLogs,
        };
      }
    } catch (e) {
      console.error('Error parsing donation config:', e);
    }
  }
  return INITIAL_EMPTY_DONATION_CONFIG;
}

export function saveDonationConfig(config: SupportDonationConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_DONATION_CONFIG, JSON.stringify(config));
  window.dispatchEvent(new CustomEvent('saarthi_donation_updated', { detail: config }));
}
