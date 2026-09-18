import React, { useState } from 'react';
import {
  Building2,
  Smartphone,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Eye,
  History,
  Trash2,
  Globe,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import {
  getDonationConfig,
  saveDonationConfig,
  SupportDonationConfig
} from '../../types/donation';
import { AdminUser } from '../../types/admin';
import { triggerAutomaticNotification } from '../../utils/notificationStore';

interface SupportQrManagerViewProps {
  currentAdmin?: AdminUser;
}

export const SupportQrManagerView: React.FC<SupportQrManagerViewProps> = ({ currentAdmin }) => {
  const [config, setConfig] = useState<SupportDonationConfig>(getDonationConfig());
  const [activeTab, setActiveTab] = useState<'bank' | 'smartQr' | 'connectIps' | 'wallets' | 'history'>('bank');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handlePublishConfig = (e: React.FormEvent) => {
    e.preventDefault();

    const adminName = currentAdmin?.name || 'Authorized Administrator';
    const nowStr = new Date().toLocaleString();

    const newLog = {
      id: `log_${Date.now()}`,
      timestamp: nowStr,
      adminName: adminName,
      actionSummary: `Published updated payment details (Bank: ${config.bank.enabled ? 'Enabled' : 'Disabled'}, Smart Pay: ${config.smartQr.enabled ? 'Enabled' : 'Disabled'}, ConnectIPS: ${config.connectIps.enabled ? 'Enabled' : 'Disabled'}, Wallets: ${config.wallets.enabled ? 'Enabled' : 'Disabled'})`,
    };

    const updatedConfig: SupportDonationConfig = {
      ...config,
      isPublished: true,
      lastPublishedAt: nowStr,
      auditLogs: [newLog, ...(config.auditLogs || [])].slice(0, 20),
    };

    setConfig(updatedConfig);
    saveDonationConfig(updatedConfig);

    // Trigger automatic email alert to admin
    triggerAutomaticNotification('DONATION_UPDATE', {
      whatChanged: `Payment & Bank Details Published (${config.bank.bankName || 'Bank'} / ${config.smartQr.merchantName || 'Merchant'})`,
      whoChangedIt: adminName,
      previousValue: config.lastPublishedAt || 'Unpublished',
      newValue: nowStr,
    }, 'SupportQrManagerView');

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleUnpublish = () => {
    if (confirm('Unpublish all donation details from the public website? Users will see a "pending verification" message.')) {
      const updatedConfig: SupportDonationConfig = {
        ...config,
        isPublished: false,
      };
      setConfig(updatedConfig);
      saveDonationConfig(updatedConfig);
    }
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Header Bar */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-wider font-bold">
              Admin Governance Portal
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
              config.isPublished
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}>
              {config.isPublished ? 'LIVE ON WEBSITE' : 'UNPUBLISHED DRAFT'}
            </span>
          </div>

          <h1 className="text-2xl font-black text-white">Donation & Payment Channel Manager</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure verified bank account details, ConnectIPS, and digital wallet accounts for public donation support.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Preview Public View</span>
          </button>

          {config.isPublished ? (
            <button
              onClick={handleUnpublish}
              className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-bold flex items-center gap-1.5 border border-rose-800 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Unpublish</span>
            </button>
          ) : null}

          <button
            onClick={handlePublishConfig}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-950/50 transition-all cursor-pointer animate-pulse"
          >
            <RefreshCw className="w-4 h-4" />
            <span>SAVE & SYNC TO LIVE</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Donation payment details updated and published live to the SAARTHI public application!</span>
        </div>
      )}

      {/* General Note Input */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <label className="block text-xs font-bold text-amber-400">Public Voluntary Support Message</label>
        <input
          type="text"
          value={config.generalNote || ''}
          onChange={(e) => setConfig({ ...config, generalNote: e.target.value })}
          placeholder="e.g. Voluntary support helps maintain high-speed servers and real-time civic API feeds."
          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('bank')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'bank'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>1. Bank Account Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('smartQr')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'smartQr'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>2. Smart Pay Merchant</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('connectIps')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'connectIps'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>3. ConnectIPS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wallets')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'wallets'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>4. Digital Wallets</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ml-auto ${
            activeTab === 'history'
              ? 'bg-slate-800 text-amber-300 border border-amber-500/40'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <History className="w-4 h-4 text-amber-400" />
          <span>Update Audit History ({config.auditLogs?.length || 0})</span>
        </button>
      </div>

      {/* Editor Body */}
      <form onSubmit={handlePublishConfig} className="space-y-6">
        {/* TAB 1: BANK DETAILS */}
        {activeTab === 'bank' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-lg font-extrabold text-white">Bank Account Transfer Details</h3>
                  <p className="text-xs text-slate-400">Enable and fill official bank details for wire or mobile banking transfers.</p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={config.bank.enabled}
                  onChange={(e) => setConfig({ ...config, bank: { ...config.bank, enabled: e.target.checked } })}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-xs font-bold text-amber-300">Enable Bank Channel</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Bank Name / Financial Institution</label>
                <input
                  type="text"
                  value={config.bank.bankName}
                  onChange={(e) => setConfig({ ...config, bank: { ...config.bank, bankName: e.target.value } })}
                  placeholder="e.g. Nabil Bank Limited"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Account Holder Name</label>
                <input
                  type="text"
                  value={config.bank.accountHolderName}
                  onChange={(e) => setConfig({ ...config, bank: { ...config.bank, accountHolderName: e.target.value } })}
                  placeholder="e.g. ACCOUNT HOLDER NAME"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-400 mb-1">Account Number</label>
                <input
                  type="text"
                  value={config.bank.accountNumber}
                  onChange={(e) => setConfig({ ...config, bank: { ...config.bank, accountNumber: e.target.value } })}
                  placeholder="e.g. 012345678901234"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Branch Office Details</label>
                <input
                  type="text"
                  value={config.bank.branchName}
                  onChange={(e) => setConfig({ ...config, bank: { ...config.bank, branchName: e.target.value } })}
                  placeholder="e.g. New Road Branch, Kathmandu"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">Payment Instructions</label>
                <input
                  type="text"
                  value={config.bank.instructions || ''}
                  onChange={(e) => setConfig({ ...config, bank: { ...config.bank, instructions: e.target.value } })}
                  placeholder="e.g. Copy account details to transfer via Mobile Banking / NCHL / IPS."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NEPAL SMART PAY */}
        {activeTab === 'smartQr' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-lg font-extrabold text-white">Smart Pay Merchant Details</h3>
                  <p className="text-xs text-slate-400">Configure Smart Pay merchant details and account codes.</p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={config.smartQr.enabled}
                  onChange={(e) => setConfig({ ...config, smartQr: { ...config.smartQr, enabled: e.target.checked } })}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-xs font-bold text-amber-300">Enable Smart Pay Channel</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Merchant / Payee Name</label>
                <input
                  type="text"
                  value={config.smartQr.merchantName}
                  onChange={(e) => setConfig({ ...config, smartQr: { ...config.smartQr, merchantName: e.target.value } })}
                  placeholder="e.g. SMART PAY MERCHANT"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Merchant ID / Terminal Code</label>
                <input
                  type="text"
                  value={config.smartQr.merchantId || ''}
                  onChange={(e) => setConfig({ ...config, smartQr: { ...config.smartQr, merchantId: e.target.value } })}
                  placeholder="e.g. SQR-982314"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">Instructions</label>
                <input
                  type="text"
                  value={config.smartQr.instructions || ''}
                  onChange={(e) => setConfig({ ...config, smartQr: { ...config.smartQr, instructions: e.target.value } })}
                  placeholder="e.g. Copy merchant details or payment ID to send funds via Mobile Banking app."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONNECTIPS */}
        {activeTab === 'connectIps' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-lg font-extrabold text-white">ConnectIPS Payment Details</h3>
                  <p className="text-xs text-slate-400">Configure ConnectIPS registered interbank details.</p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={config.connectIps.enabled}
                  onChange={(e) => setConfig({ ...config, connectIps: { ...config.connectIps, enabled: e.target.checked } })}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-xs font-bold text-amber-300">Enable ConnectIPS</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">ConnectIPS Registered Name</label>
                <input
                  type="text"
                  value={config.connectIps.registeredName}
                  onChange={(e) => setConfig({ ...config, connectIps: { ...config.connectIps, registeredName: e.target.value } })}
                  placeholder="e.g. REGISTERED ACCOUNT NAME"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Member / Username ID / Reference</label>
                <input
                  type="text"
                  value={config.connectIps.userOrMemberId}
                  onChange={(e) => setConfig({ ...config, connectIps: { ...config.connectIps, userOrMemberId: e.target.value } })}
                  placeholder="e.g. 9842438107"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1">Transfer Instructions</label>
                <input
                  type="text"
                  value={config.connectIps.instructions || ''}
                  onChange={(e) => setConfig({ ...config, connectIps: { ...config.connectIps, instructions: e.target.value } })}
                  placeholder="e.g. Copy details or use ConnectIPS for instant interbank fund transfer."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DIGITAL WALLETS */}
        {activeTab === 'wallets' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-lg font-extrabold text-white">Digital Wallets (eSewa, Khalti, MoRu)</h3>
                  <p className="text-xs text-slate-400">Configure registered mobile numbers for wallet transfers.</p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={config.wallets.enabled}
                  onChange={(e) => setConfig({ ...config, wallets: { ...config.wallets, enabled: e.target.checked } })}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-xs font-bold text-amber-300">Enable Digital Wallets</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* eSewa */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
                    eSewa Wallet
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Registered eSewa Number</label>
                  <input
                    type="text"
                    value={config.wallets.esewaNumber}
                    onChange={(e) => setConfig({ ...config, wallets: { ...config.wallets, esewaNumber: e.target.value } })}
                    placeholder="e.g. 98XXXXXXXX"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Khalti */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-violet-500/20 text-violet-400 font-bold text-xs border border-violet-500/30">
                    Khalti Wallet
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Registered Khalti Number</label>
                  <input
                    type="text"
                    value={config.wallets.khaltiNumber}
                    onChange={(e) => setConfig({ ...config, wallets: { ...config.wallets, khaltiNumber: e.target.value } })}
                    placeholder="e.g. 98XXXXXXXX"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* MoRu */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/30">
                    MoRu Wallet
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Registered MoRu Number</label>
                  <input
                    type="text"
                    value={config.wallets.moruNumber}
                    onChange={(e) => setConfig({ ...config, wallets: { ...config.wallets, moruNumber: e.target.value } })}
                    placeholder="e.g. 98XXXXXXXX"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Wallet Payment Instructions</label>
              <input
                type="text"
                value={config.wallets.instructions || ''}
                onChange={(e) => setConfig({ ...config, wallets: { ...config.wallets, instructions: e.target.value } })}
                placeholder="e.g. Send donation via eSewa, Khalti, ConnectIPS, or MoRu to ID 9842438107."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOG HISTORY */}
        {activeTab === 'history' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <History className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-white">Donation Update Audit History</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Internal Restricted Administrative Log</span>
            </div>

            {config.auditLogs && config.auditLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Admin User</th>
                      <th className="py-2.5 px-3">Action Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {config.auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-950/50">
                        <td className="py-3 px-3 font-mono text-amber-300 shrink-0">{log.timestamp}</td>
                        <td className="py-3 px-3 font-bold text-white">{log.adminName}</td>
                        <td className="py-3 px-3 text-slate-300">{log.actionSummary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 font-mono">
                No update audit logs recorded yet.
              </div>
            )}
          </div>
        )}

        {/* Global Save & Sync Action Bar */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${config.isPublished ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <div>
              <span className="text-xs font-bold text-white block">
                {config.isPublished ? 'Live Website Integration Active' : 'Unpublished Payment Configuration'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Last Sync: {config.lastPublishedAt || 'Never Published'}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-950/50 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>SAVE & SYNC TO LIVE</span>
          </button>
        </div>
      </form>

      {/* Live Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 relative space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-400" />
                <span className="font-extrabold text-white text-base">Public Live Preview Simulation</span>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
              ⚡ This preview simulates exactly what public citizens will see when visiting the "Support Project (Donate)" page.
            </div>

            <div className="max-h-[65vh] overflow-y-auto custom-scrollbar p-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
                <div className="font-bold text-white text-sm">Published Channels Summary:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono">
                  <div className={`p-2.5 rounded-xl border ${config.bank.enabled && config.bank.bankName ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    Bank: {config.bank.enabled && config.bank.bankName ? config.bank.bankName : 'Disabled'}
                  </div>
                  <div className={`p-2.5 rounded-xl border ${config.smartQr.enabled && config.smartQr.merchantName ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    Smart Pay: {config.smartQr.enabled && config.smartQr.merchantName ? config.smartQr.merchantName : 'Disabled'}
                  </div>
                  <div className={`p-2.5 rounded-xl border ${config.connectIps.enabled && config.connectIps.registeredName ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    ConnectIPS: {config.connectIps.enabled && config.connectIps.registeredName ? config.connectIps.registeredName : 'Disabled'}
                  </div>
                  <div className={`p-2.5 rounded-xl border ${config.wallets.enabled && (config.wallets.esewaNumber || config.wallets.khaltiNumber) ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    Wallets: {config.wallets.enabled ? 'Active' : 'Disabled'}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
