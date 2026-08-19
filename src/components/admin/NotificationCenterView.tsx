import React, { useState, useEffect } from 'react';
import {
  Bell,
  Mail,
  Send,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  ShieldAlert,
  QrCode,
  LifeBuoy,
  Settings,
  Database,
  Check
} from 'lucide-react';
import {
  NotificationLogItem,
  NotificationConfig,
  NotificationEventType,
  EmailDeliveryStatus
} from '../../types/notification';
import {
  getNotificationHistory,
  getNotificationConfig,
  saveNotificationConfig,
  retryNotificationDispatch,
  triggerAutomaticNotification
} from '../../utils/notificationStore';
import { formatDualDate } from '../../utils/bsAdConverter';

export const NotificationCenterView: React.FC = () => {
  const [history, setHistory] = useState<NotificationLogItem[]>([]);
  const [config, setConfig] = useState<NotificationConfig>(getNotificationConfig());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isRetryingId, setIsRetryingId] = useState<string | null>(null);
  const [testSending, setTestSending] = useState<boolean>(false);
  const [smtpTesting, setSmtpTesting] = useState<boolean>(false);
  const [smtpStatusMsg, setSmtpStatusMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setHistory(getNotificationHistory());
    setConfig(getNotificationConfig());
  }, []);

  const refreshLogs = () => {
    setHistory(getNotificationHistory());
  };

  const handleTestSmtpConnection = async () => {
    setSmtpTesting(true);
    setSmtpStatusMsg(null);
    try {
      const res = await fetch('/api/email/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientEmail: config.recipientEmail }),
      });
      let data: any = {};
      try {
        const rawText = await res.text();
        data = JSON.parse(rawText);
      } catch {
        data = { error: `Server returned non-JSON response (HTTP status ${res.status})` };
      }
      if (res.ok && data.success) {
        setSmtpStatusMsg({
          text: `SMTP Connection Verified & Test Email Dispatched to ${data.recipient} (Message ID: ${data.messageId})`,
          success: true,
        });
        showToast(`SMTP Connection Verified! Test email delivered to ${data.recipient}`, 'success');
      } else {
        setSmtpStatusMsg({
          text: `SMTP Test Failed: ${data.details || data.error || 'Connection error'}`,
          success: false,
        });
        showToast(`SMTP Error: ${data.details || data.error}`, 'error');
      }
      refreshLogs();
    } catch (err: any) {
      setSmtpStatusMsg({
        text: `Network Error testing SMTP: ${err.message}`,
        success: false,
      });
      showToast(`Network Error: ${err.message}`, 'error');
    } finally {
      setSmtpTesting(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveNotificationConfig(config);
    showToast('Notification settings & email category preferences saved successfully!', 'success');
  };

  const handleToggleCategory = (key: keyof NotificationConfig['toggles']) => {
    const updated = {
      ...config,
      toggles: {
        ...config.toggles,
        [key]: !config.toggles[key],
      },
    };
    setConfig(updated);
    saveNotificationConfig(updated);
    showToast('Updated category notification toggle', 'success');
  };

  const handleRetryDispatch = async (id: string) => {
    setIsRetryingId(id);
    const success = await retryNotificationDispatch(id);
    setIsRetryingId(null);
    refreshLogs();
    if (success) {
      showToast(`Notification #${id} email re-dispatched successfully!`, 'success');
    } else {
      showToast(`Retry failed for Notification #${id}. Check SMTP logs.`, 'error');
    }
  };

  const handleSendTestEmail = async () => {
    setTestSending(true);
    try {
      const result = await triggerAutomaticNotification(
        'TEST_DISPATCH',
        {
          message: 'This is an automatic test notification verifying the Gmail / SMTP email engine.',
          userName: 'SAARTHI System Admin',
        },
        'Notification Center Test Panel'
      );
      refreshLogs();
      if (result.status === 'SUCCESS') {
        showToast(`Test email confirmation sent to ${config.recipientEmail}`, 'success');
      } else {
        showToast(`Test dispatch logged, but status: ${result.status} (${result.failureReason || 'Check SMTP config'})`, 'error');
      }
    } catch (err: any) {
      showToast(`Test dispatch error: ${err.message}`, 'error');
    } finally {
      setTestSending(false);
    }
  };

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Filtered History
  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.messageSummary.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || item.status === statusFilter;

    const matchesCategory =
      categoryFilter === 'ALL' || item.eventType === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalDelivered = history.filter((h) => h.status === 'SUCCESS').length;
  const totalFailed = history.filter((h) => h.status === 'FAILED').length;
  const totalCount = history.length;

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold border shadow-xl flex items-center justify-between transition-all ${
            toastMsg.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/90 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400" />
            )}
            <span>{toastMsg.text}</span>
          </div>
        </div>
      )}

      {/* Header & Overview Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
              <Bell className="w-3 h-3 text-amber-400" /> Automated Email Service
            </span>
            <span className="text-slate-400 text-xs">| Free Gmail SMTP Engine</span>
          </div>
          <h1 className="text-2xl font-black text-white">SAARTHI Notification Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time automatic email dispatch log, support triggers, system audit alerts & delivery stats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshLogs}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Refresh Logs</span>
          </button>

          <button
            onClick={handleTestSmtpConnection}
            disabled={smtpTesting}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-950/50 disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 ${smtpTesting ? 'animate-spin' : ''}`} />
            <span>{smtpTesting ? 'Verifying SMTP...' : 'Test SMTP Connection'}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Total Email Events</span>
            <h3 className="text-2xl font-black text-white mt-1">{totalCount}</h3>
            <span className="text-[11px] text-slate-400 block mt-1">Stored in Notification Database</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Mail className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Successfully Delivered</span>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{totalDelivered}</h3>
            <span className="text-[11px] text-emerald-500 font-semibold block mt-1">
              {totalCount > 0 ? Math.round((totalDelivered / totalCount) * 100) : 100}% Delivery Rate
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Failed Dispatches</span>
            <h3 className="text-2xl font-black text-rose-400 mt-1">{totalFailed}</h3>
            <span className="text-[11px] text-slate-400 block mt-1">Retry option available in list</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <XCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Target Admin Email</span>
            <h3 className="text-xs font-black text-amber-300 mt-1 truncate max-w-[140px]" title={config.recipientEmail}>
              {config.recipientEmail}
            </h3>
            <span className="text-[10px] text-slate-400 block mt-1">Configured in Admin Settings</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Settings className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Admin Email Settings & Category Toggles */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-400" />
              <span>Email Notification Routing & Event Toggles</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure automatic email dispatch categories. Admin email credentials exist only in secure backend environment variables.
            </p>
          </div>

          <button
            onClick={handleSaveConfig}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-md"
          >
            <Check className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>

        <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Email Recipient Input */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Admin Notification Recipient Email
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={config.recipientEmail}
                  onChange={(e) => setConfig({ ...config, recipientEmail: e.target.value })}
                  placeholder="admin@saarthi.np"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleTestSmtpConnection}
                disabled={smtpTesting}
                className="px-3.5 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold text-xs border border-blue-500/30 flex items-center justify-center gap-1.5 transition-all whitespace-nowrap"
              >
                <Send className={`w-3.5 h-3.5 text-blue-400 ${smtpTesting ? 'animate-spin' : ''}`} />
                <span>{smtpTesting ? 'Testing...' : 'Test SMTP Connection'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              All automatic alerts (support enquiries, payment QR updates, security events) will be dispatched to this email address.
            </p>

            {smtpStatusMsg && (
              <div
                className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                  smtpStatusMsg.success
                    ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                }`}
              >
                {smtpStatusMsg.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                )}
                <span>{smtpStatusMsg.text}</span>
              </div>
            )}
          </div>

          {/* Category Notification Toggles */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Automatic Notification Category Triggers
            </label>
            
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                <span className="text-slate-300 font-medium">Support Form Enquiries</span>
                <input
                  type="checkbox"
                  checked={config.toggles.supportEnquiries}
                  onChange={() => handleToggleCategory('supportEnquiries')}
                  className="rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                <span className="text-slate-300 font-medium">Ticket Replies</span>
                <input
                  type="checkbox"
                  checked={config.toggles.ticketReplies}
                  onChange={() => handleToggleCategory('ticketReplies')}
                  className="rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                <span className="text-slate-300 font-medium">Donation/QR Updates</span>
                <input
                  type="checkbox"
                  checked={config.toggles.donationUpdates}
                  onChange={() => handleToggleCategory('donationUpdates')}
                  className="rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
                <span className="text-slate-300 font-medium">Security & Auth Alerts</span>
                <input
                  type="checkbox"
                  checked={config.toggles.securityAlerts}
                  onChange={() => handleToggleCategory('securityAlerts')}
                  className="rounded text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700 w-4 h-4"
                />
              </label>
            </div>
          </div>
        </form>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notifications by Ref ID, Subject, Recipient, User..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-bold px-2">Status:</span>
            {['ALL', 'SUCCESS', 'FAILED', 'PENDING'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all ${
                  statusFilter === st
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Categories</option>
            <option value="SUPPORT_INQUIRY">Support Form Enquiries</option>
            <option value="TICKET_REPLY">Ticket Replies</option>
            <option value="DONATION_UPDATE">Donation & QR Updates</option>
            <option value="ADMIN_SETTING_CHANGE">Admin Setting Changes</option>
            <option value="SECURITY_ALERT">Security Alerts</option>
            <option value="SYSTEM_ERROR">System Errors</option>
            <option value="TEST_DISPATCH">Test Dispatches</option>
          </select>
        </div>
      </div>

      {/* Notification Logs List / Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            <span>Notification History Log ({filteredHistory.length} events)</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            Includes B.S. & A.D. dual timestamp formatting
          </span>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Mail className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-400">No Notification Events Match Filter</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query or selecting a different category filter above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80 overflow-x-auto">
            {filteredHistory.map((item) => {
              const isFailed = item.status === 'FAILED';
              const isSuccess = item.status === 'SUCCESS';

              return (
                <div key={item.id} className="p-4 hover:bg-slate-800/40 transition-colors space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 font-mono text-[11px] font-bold">
                        {item.id}
                      </span>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 border border-slate-700 text-slate-300">
                        {item.eventType.replace(/_/g, ' ')}
                      </span>

                      {/* Delivery Status Badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 border ${
                          isSuccess
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : isFailed
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        }`}
                      >
                        {isSuccess && <CheckCircle2 className="w-3 h-3" />}
                        {isFailed && <XCircle className="w-3 h-3" />}
                        {!isSuccess && !isFailed && <Clock className="w-3 h-3 animate-spin" />}
                        <span>{item.status}</span>
                      </span>
                    </div>

                    {/* Dual Date Display (B.S. & A.D.) */}
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        {item.bsDateStr} | {item.adDateStr} ({item.timeStr})
                      </span>
                    </div>
                  </div>

                  {/* Subject & Summary */}
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.subject}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">{item.messageSummary}</p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Recipient Email:</span>
                      <span className="text-slate-300 font-mono font-medium truncate block">{item.recipient}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Trigger Source:</span>
                      <span className="text-amber-400 font-medium">{item.triggeredBy}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-bold">Dual Date Format (B.S. / A.D.):</span>
                      <span className="text-emerald-400 font-mono">{item.bsDateStr} / {item.adDateStr}</span>
                    </div>

                    {item.details?.userName && (
                      <div>
                        <span className="text-slate-500 block">User Name:</span>
                        <span className="text-slate-200 font-semibold">{item.details.userName} ({item.details.userEmail || 'N/A'})</span>
                      </div>
                    )}

                    {item.details?.userPhone && (
                      <div>
                        <span className="text-slate-500 block">Phone Number:</span>
                        <span className="text-slate-200 font-mono">{item.details.userPhone}</span>
                      </div>
                    )}

                    {item.details?.whatChanged && (
                      <div className="col-span-full">
                        <span className="text-slate-500 block">Audit Details:</span>
                        <span className="text-slate-300">
                          {item.details.whatChanged} | Previous: <code className="text-rose-400">{item.details.previousValue || 'N/A'}</code> | New: <code className="text-emerald-400">{item.details.newValue || 'Updated'}</code>
                        </span>
                      </div>
                    )}

                    {isFailed && item.failureReason && (
                      <div className="col-span-full text-rose-400 font-mono text-[10px]">
                        Failure Reason: {item.failureReason}
                      </div>
                    )}
                  </div>

                  {/* Action Controls */}
                  {isFailed && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleRetryDispatch(item.id)}
                        disabled={isRetryingId === item.id}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRetryingId === item.id ? 'animate-spin' : ''}`} />
                        <span>{isRetryingId === item.id ? 'Retrying Dispatch...' : 'Retry Email Dispatch'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
