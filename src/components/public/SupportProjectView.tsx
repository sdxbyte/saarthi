import React, { useState, useEffect } from 'react';
import {
  Heart,
  Building2,
  Check,
  Copy,
  Smartphone,
  CreditCard,
  Info,
  Globe,
} from 'lucide-react';
import {
  getDonationConfig,
  SupportDonationConfig,
  STORAGE_KEY_DONATION_CONFIG,
} from '../../types/donation';

interface SupportProjectViewProps {
  currentLang: 'en' | 'ne';
  theme: 'dark' | 'light';
  onNavigateTab: (tab: string) => void;
}

export const SupportProjectView: React.FC<SupportProjectViewProps> = ({ currentLang, onNavigateTab }) => {
  const [config, setConfig] = useState<SupportDonationConfig>(getDonationConfig());
  const [activeChannel, setActiveChannel] = useState<'bank' | 'smartQr' | 'connectIps' | 'wallets'>('bank');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync live updates from Admin Panel
  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getDonationConfig());
    };

    window.addEventListener('saarthi_donation_updated', handleUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY_DONATION_CONFIG) {
        handleUpdate();
      }
    });

    return () => {
      window.removeEventListener('saarthi_donation_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Check which channels have real, published data
  const hasBankData = Boolean(
    config.isPublished &&
    config.bank.enabled &&
    (config.bank.bankName || config.bank.accountNumber)
  );

  const hasSmartQrData = Boolean(
    config.isPublished &&
    config.smartQr.enabled &&
    (config.smartQr.merchantName || config.smartQr.merchantId)
  );

  const hasConnectIpsData = Boolean(
    config.isPublished &&
    config.connectIps.enabled &&
    (config.connectIps.registeredName || config.connectIps.userOrMemberId)
  );

  const hasWalletData = Boolean(
    config.isPublished &&
    config.wallets.enabled &&
    (config.wallets.esewaNumber || config.wallets.khaltiNumber || config.wallets.moruNumber)
  );

  const hasAnyPublishedDetails = hasBankData || hasSmartQrData || hasConnectIpsData || hasWalletData;

  // Auto-switch to first available tab if current is empty
  useEffect(() => {
    if (!hasBankData) {
      if (hasSmartQrData) setActiveChannel('smartQr');
      else if (hasConnectIpsData) setActiveChannel('connectIps');
      else if (hasWalletData) setActiveChannel('wallets');
    }
  }, [hasBankData, hasSmartQrData, hasConnectIpsData, hasWalletData]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 px-3 sm:px-4 font-sans text-[var(--color-text)]">
      {/* Top Banner Header */}
      <div className="surface-card p-6 sm:p-8 rounded-[12px] space-y-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[var(--color-accent-muted)] border border-[var(--color-accent-mark)]/30 text-[var(--color-accent-mark)] text-[11px] font-semibold uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5 text-[var(--color-negative)]" />
          <span>{currentLang === 'ne' ? 'परियोजना सहयोग तथा सञ्चालन' : 'Support SAARTHI Development'}</span>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text)]">
            {currentLang === 'ne' ? 'सारथी नागरिक मञ्चलाई सहयोग गर्नुहोस्' : 'Support the SAARTHI Civic Platform'}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
            {currentLang === 'ne'
              ? 'सारथी सम्पूर्ण नागरिकहरूका लागि नि:शुल्क, पारदर्शी र आधुनिक प्रविधिमा आधारित नागरिक सेवा उपलब्ध गराउन समर्पित छ।'
              : 'SAARTHI is an independent technology project. Voluntary contributions help maintain servers, real-time government service integration APIs, and citizen tools.'}
          </p>
        </div>

        {config.generalNote && (
          <div className="p-3 rounded-[8px] bg-[var(--color-canvas)] border border-[var(--color-border)] text-[var(--color-accent-mark)] text-xs font-medium flex items-center gap-2.5">
            <Info className="w-4 h-4 shrink-0" />
            <span>{config.generalNote}</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {!hasAnyPublishedDetails ? (
        /* Empty State: Strict Rule #8 "Payment details have not yet been configured." */
        <div className="surface-card p-8 sm:p-12 rounded-[12px] text-center space-y-5">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 mx-auto rounded-[8px] bg-[var(--color-canvas)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent-mark)]">
              <Building2 className="w-6 h-6" />
            </div>

            <h2 className="text-lg font-bold text-[var(--color-text)]">
              Payment details have not yet been configured.
            </h2>

            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              {currentLang === 'ne'
                ? 'सारथी प्रशासनबाट आधिकारिक बैंक खाता तथा भुक्तानी विवरण अद्यावधिक भएपछि सार्वजनिक गरिनेछ।'
                : 'Payment details have not yet been published by the system administrator. Once configured in the admin panel, details will appear here.'}
            </p>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => onNavigateTab('contact')}
                className="px-4 py-2 rounded-[6px] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text)] font-medium text-xs transition-all shadow-xs cursor-pointer"
              >
                {currentLang === 'ne' ? 'प्रशासनसँग सम्पर्क गर्नुहोस्' : 'Contact Administration'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Published Payment Channels */
        <div className="space-y-4">
          {/* Segmented Channel Selection Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-[8px] bg-[var(--color-surface)] border border-[var(--color-border)]">
            {hasBankData && (
              <button
                onClick={() => setActiveChannel('bank')}
                className={`flex-1 min-w-[120px] px-3 py-2 rounded-[6px] font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeChannel === 'bank'
                    ? 'bg-[var(--color-surface-hover)] text-[var(--color-accent-mark)] border border-[var(--color-border)] shadow-xs font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{currentLang === 'ne' ? 'बैंक ट्रान्सफर' : 'Bank Transfer'}</span>
              </button>
            )}

            {hasSmartQrData && (
              <button
                onClick={() => setActiveChannel('smartQr')}
                className={`flex-1 min-w-[120px] px-3 py-2 rounded-[6px] font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeChannel === 'smartQr'
                    ? 'bg-[var(--color-surface-hover)] text-[var(--color-accent-mark)] border border-[var(--color-border)] shadow-xs font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Smart Pay Merchant</span>
              </button>
            )}

            {hasConnectIpsData && (
              <button
                onClick={() => setActiveChannel('connectIps')}
                className={`flex-1 min-w-[120px] px-3 py-2 rounded-[6px] font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeChannel === 'connectIps'
                    ? 'bg-[var(--color-surface-hover)] text-[var(--color-accent-mark)] border border-[var(--color-border)] shadow-xs font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>ConnectIPS</span>
              </button>
            )}

            {hasWalletData && (
              <button
                onClick={() => setActiveChannel('wallets')}
                className={`flex-1 min-w-[120px] px-3 py-2 rounded-[6px] font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeChannel === 'wallets'
                    ? 'bg-[var(--color-surface-hover)] text-[var(--color-accent-mark)] border border-[var(--color-border)] shadow-xs font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{currentLang === 'ne' ? 'डिजिटल वालेटहरू' : 'Digital Wallets'}</span>
              </button>
            )}
          </div>

          {/* Active Channel Details Display */}
          <div className="surface-card p-5 sm:p-6 rounded-[12px] space-y-5">
            {/* 1. BANK DONATION PANEL */}
            {activeChannel === 'bank' && hasBankData && (
              <div className="space-y-4">
                <div className="space-y-0.5">
                  <span className="text-[var(--color-accent-mark)] font-mono text-[11px] uppercase tracking-wider font-semibold">
                    Official Bank Transfer Details
                  </span>
                  <h2 className="text-lg font-bold text-[var(--color-text)]">
                    {config.bank.bankName || 'Bank Account Details'}
                  </h2>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {config.bank.instructions || 'Copy account details to support SAARTHI via Mobile Banking / NCHL / IPS.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {config.bank.bankName && (
                    <div className="p-3 rounded-[8px] bg-[var(--color-canvas)] border border-[var(--color-border)] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-[var(--color-text-muted)] font-mono uppercase block">Bank Name</span>
                        <span className="font-semibold text-xs text-[var(--color-text)]">{config.bank.bankName}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(config.bank.bankName, 'bankName')}
                        className="px-2.5 py-1 rounded-[6px] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] font-medium flex items-center gap-1 border border-[var(--color-border)] transition-all cursor-pointer"
                      >
                        {copiedKey === 'bankName' ? <Check className="w-3.5 h-3.5 text-[var(--color-positive)]" /> : <Copy className="w-3.5 h-3.5 text-[var(--color-accent-mark)]" />}
                        <span>{copiedKey === 'bankName' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  {config.bank.accountNumber && (
                    <div className="p-3 rounded-[8px] bg-[var(--color-canvas)] border border-[var(--color-border)] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-[var(--color-text-muted)] font-mono uppercase block">Account Number</span>
                        <span className="font-mono font-semibold text-xs text-[var(--color-accent-mark)]">{config.bank.accountNumber}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(config.bank.accountNumber, 'accNum')}
                        className="px-2.5 py-1 rounded-[6px] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] font-medium flex items-center gap-1 border border-[var(--color-border)] transition-all cursor-pointer"
                      >
                        {copiedKey === 'accNum' ? <Check className="w-3.5 h-3.5 text-[var(--color-positive)]" /> : <Copy className="w-3.5 h-3.5 text-[var(--color-accent-mark)]" />}
                        <span>{copiedKey === 'accNum' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  {config.bank.accountHolderName && (
                    <div className="p-3 rounded-[8px] bg-[var(--color-canvas)] border border-[var(--color-border)] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-[var(--color-text-muted)] font-mono uppercase block">Account Name</span>
                        <span className="font-semibold text-xs text-[var(--color-text)]">{config.bank.accountHolderName}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(config.bank.accountHolderName, 'accName')}
                        className="px-2.5 py-1 rounded-[6px] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] font-medium flex items-center gap-1 border border-[var(--color-border)] transition-all cursor-pointer"
                      >
                        {copiedKey === 'accName' ? <Check className="w-3.5 h-3.5 text-[var(--color-positive)]" /> : <Copy className="w-3.5 h-3.5 text-[var(--color-accent-mark)]" />}
                        <span>{copiedKey === 'accName' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  {config.bank.branchName && (
                    <div className="p-3 rounded-[8px] bg-[var(--color-canvas)] border border-[var(--color-border)] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-[var(--color-text-muted)] font-mono uppercase block">Branch</span>
                        <span className="font-semibold text-xs text-[var(--color-text)]">{config.bank.branchName}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(config.bank.branchName, 'branchName')}
                        className="px-2.5 py-1 rounded-[6px] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] font-medium flex items-center gap-1 border border-[var(--color-border)] transition-all cursor-pointer"
                      >
                        {copiedKey === 'branchName' ? <Check className="w-3.5 h-3.5 text-[var(--color-positive)]" /> : <Copy className="w-3.5 h-3.5 text-[var(--color-accent-mark)]" />}
                        <span>{copiedKey === 'branchName' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. NEPAL SMART PAY PANEL */}
            {activeChannel === 'smartQr' && hasSmartQrData && (
              <div className="space-y-4">
                <div className="space-y-0.5">
                  <span className="text-[var(--color-accent-mark)] font-mono text-[11px] uppercase tracking-wider font-semibold">
                    Smart Pay Merchant Details
                  </span>
                  <h2 className="text-lg font-bold text-[var(--color-text)]">
                    {config.smartQr.merchantName || 'Smart Pay Merchant'}
                  </h2>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {config.smartQr.instructions || 'Copy merchant details or payment ID to send funds via Mobile Banking.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {config.smartQr.merchantName && (
                    <div className="p-3 rounded-[8px] bg-[var(--color-canvas)] border border-[var(--color-border)] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-[var(--color-text-muted)] font-mono uppercase block">Merchant / Payee Name</span>
                        <span className="font-semibold text-xs text-[var(--color-text)]">{config.smartQr.merchantName}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(config.smartQr.merchantName, 'smartMerchant')}
                        className="px-2.5 py-1 rounded-[6px] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] font-medium flex items-center gap-1 border border-[var(--color-border)] transition-all cursor-pointer"
                      >
                        {copiedKey === 'smartMerchant' ? <Check className="w-3.5 h-3.5 text-[var(--color-positive)]" /> : <Copy className="w-3.5 h-3.5 text-[var(--color-accent-mark)]" />}
                        <span>{copiedKey === 'smartMerchant' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  {config.smartQr.merchantId && (
                    <div className="p-3 rounded-[8px] bg-[var(--color-canvas)] border border-[var(--color-border)] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-[var(--color-text-muted)] font-mono uppercase block">Merchant Code / ID</span>
                        <span className="font-mono font-semibold text-xs text-[var(--color-accent-mark)]">{config.smartQr.merchantId}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(config.smartQr.merchantId || '', 'smartId')}
                        className="px-2.5 py-1 rounded-[6px] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] font-medium flex items-center gap-1 border border-[var(--color-border)] transition-all cursor-pointer"
                      >
                        {copiedKey === 'smartId' ? <Check className="w-3.5 h-3.5 text-[var(--color-positive)]" /> : <Copy className="w-3.5 h-3.5 text-[var(--color-accent-mark)]" />}
                        <span>{copiedKey === 'smartId' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. CONNECTIPS PANEL */}
            {activeChannel === 'connectIps' && hasConnectIpsData && (
              <div className="space-y-4">
                <div className="space-y-0.5">
                  <span className="text-[var(--color-accent-mark)] font-mono text-[11px] uppercase tracking-wider font-semibold">
                    ConnectIPS Interbank Channel
                  </span>
                  <h2 className="text-lg font-bold text-[var(--color-text)]">
                    ConnectIPS Transfer Details
                  </h2>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {config.connectIps.instructions || 'Copy details to transfer directly using ConnectIPS or your mobile banking app.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {config.connectIps.registeredName && (
                    <div className="p-3 rounded-[8px] bg-[var(--color-canvas)] border border-[var(--color-border)] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-[var(--color-text-muted)] font-mono uppercase block">Registered Entity</span>
                        <span className="font-semibold text-xs text-[var(--color-text)]">{config.connectIps.registeredName}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(config.connectIps.registeredName, 'ipsName')}
                        className="px-2.5 py-1 rounded-[6px] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] font-medium flex items-center gap-1 border border-[var(--color-border)] transition-all cursor-pointer"
                      >
                        {copiedKey === 'ipsName' ? <Check className="w-3.5 h-3.5 text-[var(--color-positive)]" /> : <Copy className="w-3.5 h-3.5 text-[var(--color-accent-mark)]" />}
                        <span>{copiedKey === 'ipsName' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  {config.connectIps.userOrMemberId && (
                    <div className="p-3 rounded-[8px] bg-[var(--color-canvas)] border border-[var(--color-border)] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-[var(--color-text-muted)] font-mono uppercase block">Reference ID</span>
                        <span className="font-mono font-semibold text-xs text-[var(--color-accent-mark)]">{config.connectIps.userOrMemberId}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(config.connectIps.userOrMemberId, 'ipsId')}
                        className="px-2.5 py-1 rounded-[6px] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] font-medium flex items-center gap-1 border border-[var(--color-border)] transition-all cursor-pointer"
                      >
                        {copiedKey === 'ipsId' ? <Check className="w-3.5 h-3.5 text-[var(--color-positive)]" /> : <Copy className="w-3.5 h-3.5 text-[var(--color-accent-mark)]" />}
                        <span>{copiedKey === 'ipsId' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. DIGITAL WALLETS PANEL */}
            {activeChannel === 'wallets' && hasWalletData && (
              <div className="space-y-4">
                <div className="space-y-0.5">
                  <span className="text-[var(--color-accent-mark)] font-mono text-[11px] uppercase tracking-wider font-semibold">
                    Digital Wallet Donations
                  </span>
                  <h2 className="text-lg font-bold text-[var(--color-text)]">
                    eSewa, Khalti & MoRu Mobile Wallets
                  </h2>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {config.wallets.instructions || 'Send donation directly to verified registered mobile numbers.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* eSewa */}
                  {config.wallets.esewaNumber && (
                    <div className="p-3.5 rounded-[8px] bg-[var(--color-canvas)] border border-[var(--color-border)] flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-[4px] bg-[var(--color-positive)]/10 text-[var(--color-positive)] font-semibold text-[11px] border border-[var(--color-positive)]/25">
                            eSewa
                          </span>
                          <Smartphone className="w-3.5 h-3.5 text-[var(--color-positive)]" />
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--color-text-muted)] font-mono uppercase block">Registered ID</span>
                          <span className="font-mono font-semibold text-xs text-[var(--color-text)]">{config.wallets.esewaNumber}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(config.wallets.esewaNumber, 'esewa')}
                        className="w-full py-1.5 rounded-[6px] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-xs text-[var(--color-text)] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        {copiedKey === 'esewa' ? <Check className="w-3.5 h-3.5 text-[var(--color-positive)]" /> : <Copy className="w-3.5 h-3.5 text-[var(--color-accent-mark)]" />}
                        <span>{copiedKey === 'esewa' ? 'Copied' : 'Copy eSewa'}</span>
                      </button>
                    </div>
                  )}

                  {/* Khalti */}
                  {config.wallets.khaltiNumber && (
                    <div className="p-3.5 rounded-[8px] bg-[var(--color-canvas)] border border-[var(--color-border)] flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-[4px] bg-[var(--color-accent-muted)] text-[var(--color-accent-mark)] font-semibold text-[11px] border border-[var(--color-accent-mark)]/30">
                            Khalti
                          </span>
                          <Smartphone className="w-3.5 h-3.5 text-[var(--color-accent-mark)]" />
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--color-text-muted)] font-mono uppercase block">Registered ID</span>
                          <span className="font-mono font-semibold text-xs text-[var(--color-text)]">{config.wallets.khaltiNumber}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(config.wallets.khaltiNumber, 'khalti')}
                        className="w-full py-1.5 rounded-[6px] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-xs text-[var(--color-text)] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        {copiedKey === 'khalti' ? <Check className="w-3.5 h-3.5 text-[var(--color-positive)]" /> : <Copy className="w-3.5 h-3.5 text-[var(--color-accent-mark)]" />}
                        <span>{copiedKey === 'khalti' ? 'Copied' : 'Copy Khalti'}</span>
                      </button>
                    </div>
                  )}

                  {/* MoRu */}
                  {config.wallets.moruNumber && (
                    <div className="p-3.5 rounded-[8px] bg-[var(--color-canvas)] border border-[var(--color-border)] flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-[4px] bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] font-semibold text-[11px] border border-[var(--color-border)]">
                            MoRu
                          </span>
                          <Smartphone className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
                        </div>
                        <div>
                          <span className="text-[10px] text-[var(--color-text-muted)] font-mono uppercase block">Registered ID</span>
                          <span className="font-mono font-semibold text-xs text-[var(--color-text)]">{config.wallets.moruNumber}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(config.wallets.moruNumber, 'moru')}
                        className="w-full py-1.5 rounded-[6px] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-xs text-[var(--color-text)] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        {copiedKey === 'moru' ? <Check className="w-3.5 h-3.5 text-[var(--color-positive)]" /> : <Copy className="w-3.5 h-3.5 text-[var(--color-accent-mark)]" />}
                        <span>{copiedKey === 'moru' ? 'Copied' : 'Copy MoRu'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
