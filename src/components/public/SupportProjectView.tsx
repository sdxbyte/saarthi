import React, { useState, useEffect } from 'react';
import {
  Heart,
  Building2,
  Check,
  Copy,
  Sparkles,
  Smartphone,
  CreditCard,
  ShieldCheck,
  Info,
  Globe
} from 'lucide-react';
import {
  getDonationConfig,
  SupportDonationConfig,
  STORAGE_KEY_DONATION_CONFIG
} from '../../types/donation';

interface SupportProjectViewProps {
  currentLang: 'en' | 'ne';
  theme: 'dark' | 'light';
  onNavigateTab: (tab: string) => void;
}

export const SupportProjectView: React.FC<SupportProjectViewProps> = ({ currentLang, theme, onNavigateTab }) => {
  const isDark = theme === 'dark';
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
    <div className="max-w-5xl mx-auto space-y-8 py-6 px-4 font-sans text-slate-100">
      {/* Top Banner Header */}
      <div className={`p-8 sm:p-10 rounded-3xl border shadow-2xl relative overflow-hidden ${
        isDark
          ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/20 text-white'
          : 'bg-gradient-to-br from-amber-500/10 via-white to-slate-50 border-amber-500/30 text-slate-900'
      }`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-500/20" />
            <span>{currentLang === 'ne' ? 'परियोजना सहयोग तथा सञ्चालन' : 'Support SAARTHI Development'}</span>
          </div>

          <h1 className={`text-3xl sm:text-4xl font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {currentLang === 'ne' ? 'सारथी नागरिक मञ्चलाई सहयोग गर्नुहोस्' : 'Support the SAARTHI Civic Platform'}
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {currentLang === 'ne'
              ? 'सारथी सम्पूर्ण नागरिकहरूका लागि नि:शुल्क, पारदर्शी र आधुनिक प्रविधिमा आधारित नागरिक सेवा उपलब्ध गराउन समर्पित छ।'
              : 'SAARTHI is a citizen-first digital initiative. Voluntary contributions support server hosting, real-time government API feeds, and continuous expansion.'}
          </p>

          {config.generalNote && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{config.generalNote}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {!hasAnyPublishedDetails ? (
        /* Empty State: Pending Verification by Administration */
        <div className={`p-8 sm:p-12 rounded-3xl border shadow-xl text-center space-y-6 ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Building2 className="w-8 h-8" />
            </div>

            <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Payment details have not yet been configured.
            </h2>

            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {currentLang === 'ne'
                ? 'सारथी प्रशासनबाट आधिकारिक बैंक खाता तथा भुक्तानी विवरण अद्यावधिक भएपछि सार्वजनिक गरिनेछ।'
                : 'Please provide the required payment details (Bank & Wallet IDs, Account Numbers) to publish them for public access across tabs.'}
            </p>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => onNavigateTab('contact')}
                className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md"
              >
                {currentLang === 'ne' ? 'प्रशासनसँग सम्पर्क गर्नुहोस्' : 'Contact Administration'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Published Payment Channels */
        <div className="space-y-6">
          {/* Channel Selection Buttons */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            {hasBankData && (
              <button
                onClick={() => setActiveChannel('bank')}
                className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  activeChannel === 'bank'
                    ? 'bg-amber-500 text-slate-950 shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>{currentLang === 'ne' ? 'बैंक ट्रान्सफर' : 'Bank Transfer'}</span>
              </button>
            )}

            {hasSmartQrData && (
              <button
                onClick={() => setActiveChannel('smartQr')}
                className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  activeChannel === 'smartQr'
                    ? 'bg-amber-500 text-slate-950 shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Smart Pay Merchant</span>
              </button>
            )}

            {hasConnectIpsData && (
              <button
                onClick={() => setActiveChannel('connectIps')}
                className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  activeChannel === 'connectIps'
                    ? 'bg-amber-500 text-slate-950 shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>ConnectIPS</span>
              </button>
            )}

            {hasWalletData && (
              <button
                onClick={() => setActiveChannel('wallets')}
                className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  activeChannel === 'wallets'
                    ? 'bg-amber-500 text-slate-950 shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>{currentLang === 'ne' ? 'डिजिटल वालेटहरू' : 'Digital Wallets'}</span>
              </button>
            )}
          </div>

          {/* Active Channel Details Display */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* 1. BANK DONATION PANEL */}
            {activeChannel === 'bank' && hasBankData && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-amber-400 font-mono text-xs uppercase tracking-wider font-bold">
                    Official Bank Transfer Details
                  </span>
                  <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {config.bank.bankName || 'Bank Account Details'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {config.bank.instructions || 'Copy account details to support SAARTHI via Mobile Banking / NCHL / IPS.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {config.bank.bankName && (
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Bank Name</span>
                        <span className="font-bold text-sm text-white">{config.bank.bankName}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(config.bank.bankName, 'bankName')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
                      >
                        {copiedKey === 'bankName' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{copiedKey === 'bankName' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  {config.bank.accountHolderName && (
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Account Holder Name</span>
                        <span className="font-bold text-sm text-white">{config.bank.accountHolderName}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(config.bank.accountHolderName, 'accountHolderName')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
                      >
                        {copiedKey === 'accountHolderName' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{copiedKey === 'accountHolderName' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  {config.bank.accountNumber && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 md:col-span-2">
                      <div>
                        <span className="text-[10px] text-amber-400 font-mono uppercase font-bold block">Account Number</span>
                        <span className="font-mono font-black text-xl text-amber-300 tracking-wider">{config.bank.accountNumber}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(config.bank.accountNumber, 'accountNumber')}
                        className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                      >
                        {copiedKey === 'accountNumber' ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
                        <span>{copiedKey === 'accountNumber' ? 'Copied Number' : 'Copy Account Number'}</span>
                      </button>
                    </div>
                  )}

                  {config.bank.branchName && (
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 md:col-span-2">
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Branch Office</span>
                        <span className="font-bold text-xs text-slate-200">{config.bank.branchName}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(config.bank.branchName, 'branchName')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
                      >
                        {copiedKey === 'branchName' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{copiedKey === 'branchName' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. NEPAL SMART PAY PANEL */}
            {activeChannel === 'smartQr' && hasSmartQrData && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-amber-400 font-mono text-xs uppercase tracking-wider font-bold">
                    Smart Pay Merchant Details
                  </span>
                  <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {config.smartQr.merchantName || 'Smart Pay Merchant'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {config.smartQr.instructions || 'Copy merchant details or payment ID to send funds via Mobile Banking.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {config.smartQr.merchantName && (
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Merchant / Payee Name</span>
                        <span className="font-bold text-sm text-white">{config.smartQr.merchantName}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(config.smartQr.merchantName, 'smartMerchant')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
                      >
                        {copiedKey === 'smartMerchant' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{copiedKey === 'smartMerchant' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  {config.smartQr.merchantId && (
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Merchant Code / ID</span>
                        <span className="font-mono font-bold text-sm text-amber-300">{config.smartQr.merchantId}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(config.smartQr.merchantId || '', 'smartId')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
                      >
                        {copiedKey === 'smartId' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{copiedKey === 'smartId' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. CONNECTIPS PANEL */}
            {activeChannel === 'connectIps' && hasConnectIpsData && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-amber-400 font-mono text-xs uppercase tracking-wider font-bold">
                    ConnectIPS Interbank Channel
                  </span>
                  <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    ConnectIPS Transfer Details
                  </h2>
                  <p className="text-xs text-slate-400">
                    {config.connectIps.instructions || 'Copy details to transfer directly using ConnectIPS or your mobile banking app.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {config.connectIps.registeredName && (
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Registered Entity / Channel</span>
                        <span className="font-bold text-sm text-white">{config.connectIps.registeredName}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(config.connectIps.registeredName, 'ipsName')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
                      >
                        {copiedKey === 'ipsName' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{copiedKey === 'ipsName' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  {config.connectIps.userOrMemberId && (
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono uppercase block">Channel Details / Reference</span>
                        <span className="font-mono font-bold text-sm text-amber-300">{config.connectIps.userOrMemberId}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(config.connectIps.userOrMemberId, 'ipsId')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
                      >
                        {copiedKey === 'ipsId' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{copiedKey === 'ipsId' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Payment Instructions */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-amber-400" />
                    <span>Important Payment Instructions:</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-300 space-y-1.5 text-[11px] leading-relaxed">
                    <li>Transfer directly using ConnectIPS or Mobile Banking apps (Global IME, Nabil, NIC Asia, Everest, etc.).</li>
                    <li>100% of voluntary funds go toward server infrastructure maintenance, real-time government service integration APIs, and citizen tools.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 4. DIGITAL WALLETS PANEL */}
            {activeChannel === 'wallets' && hasWalletData && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-amber-400 font-mono text-xs uppercase tracking-wider font-bold">
                    Digital Wallet Donations
                  </span>
                  <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    eSewa, Khalti & MoRu Mobile Wallets
                  </h2>
                  <p className="text-xs text-slate-400">
                    {config.wallets.instructions || 'Send donation directly to verified registered mobile numbers.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* eSewa */}
                  {config.wallets.esewaNumber && (
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs border border-emerald-500/30">
                            eSewa
                          </span>
                          <Smartphone className="w-4 h-4 text-emerald-400" />
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-500 font-mono uppercase block">Registered ID / Number</span>
                          <span className="font-mono font-black text-base text-white">{config.wallets.esewaNumber}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(config.wallets.esewaNumber, 'esewa')}
                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                      >
                        {copiedKey === 'esewa' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'esewa' ? 'Copied Number' : 'Copy eSewa Number'}</span>
                      </button>
                    </div>
                  )}

                  {/* Khalti */}
                  {config.wallets.khaltiNumber && (
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg bg-violet-500/20 text-violet-400 font-black text-xs border border-violet-500/30">
                            Khalti
                          </span>
                          <Smartphone className="w-4 h-4 text-violet-400" />
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-500 font-mono uppercase block">Registered ID / Number</span>
                          <span className="font-mono font-black text-base text-white">{config.wallets.khaltiNumber}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(config.wallets.khaltiNumber, 'khalti')}
                        className="w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                      >
                        {copiedKey === 'khalti' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'khalti' ? 'Copied Number' : 'Copy Khalti Number'}</span>
                      </button>
                    </div>
                  )}

                  {/* MoRu */}
                  {config.wallets.moruNumber && (
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 font-black text-xs border border-amber-500/30">
                            MoRu
                          </span>
                          <Smartphone className="w-4 h-4 text-amber-400" />
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-500 font-mono uppercase block">Registered ID / Number</span>
                          <span className="font-mono font-black text-base text-white">{config.wallets.moruNumber}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(config.wallets.moruNumber, 'moru')}
                        className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                      >
                        {copiedKey === 'moru' ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5 text-slate-950" />}
                        <span>{copiedKey === 'moru' ? 'Copied Number' : 'Copy MoRu Number'}</span>
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
