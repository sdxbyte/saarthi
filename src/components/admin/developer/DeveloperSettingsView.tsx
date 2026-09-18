import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Clock,
  Github,
  HardDrive,
  Key,
  Bell,
  ShieldCheck,
  CheckCircle2,
  Lock,
  UserCheck,
  KeyRound,
  Mail,
  Send,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';
import { getSuperAdminCreds, updateSuperAdminPassword } from '../../../utils/superAdminAuth';

interface DeveloperSettingsViewProps {
  refreshIntervalMins: number;
  onChangeInterval: (mins: number) => void;
  onAddAuditLog: (action: string, category: 'AUTH' | 'BACKUP' | 'GITHUB' | 'VERSION' | 'FEATURE' | 'SETTINGS', severity: 'INFO' | 'WARN' | 'CRITICAL', details: string) => void;
}

export const DeveloperSettingsView: React.FC<DeveloperSettingsViewProps> = ({
  refreshIntervalMins,
  onChangeInterval,
  onAddAuditLog,
}) => {
  const [githubRepoUrl, setGithubRepoUrl] = useState<string>('https://github.com/sdxbyte/saarthi');
  const [githubBranch, setGithubBranch] = useState<string>('main');
  const [storageLocation, setStorageLocation] = useState<string>('Google Cloud Storage Bucket (GCS)');
  const [developerPin, setDeveloperPin] = useState<string>('');
  const [requirePinForExports, setRequirePinForExports] = useState<boolean>(true);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState<boolean>(true);
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);

  // SMTP Settings State
  const [smtpHost, setSmtpHost] = useState<string>('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState<number>(465);
  const [smtpUser, setSmtpUser] = useState<string>('sudipadhikari8107@gmail.com');
  const [smtpPass, setSmtpPass] = useState<string>('');
  const [showSmtpPass, setShowSmtpPass] = useState<boolean>(false);
  const [fromName, setFromName] = useState<string>('SAARTHI System Updates');
  const [adminEmail, setAdminEmail] = useState<string>('sudipadhikari8107@gmail.com');
  const [smtpStatusMessage, setSmtpStatusMessage] = useState<string>('');
  const [smtpStatusType, setSmtpStatusType] = useState<'success' | 'error' | 'info' | ''>('');
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [isSendingSummary, setIsSendingSummary] = useState<boolean>(false);
  const [isSmtpConfigured, setIsSmtpConfigured] = useState<boolean>(false);

  // Super Admin Account Password state
  const [superAdminCreds, setSuperAdminCreds] = useState(getSuperAdminCreds());
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  useEffect(() => {
    setSuperAdminCreds(getSuperAdminCreds());
    // Load existing SMTP config
    fetchSmtpConfig();
  }, []);

  const fetchSmtpConfig = async () => {
    try {
      const res = await fetch('/api/smtp/config');
      if (res.ok) {
        const json = await res.json();
        if (json.config) {
          setSmtpHost(json.config.smtpHost || 'smtp.gmail.com');
          setSmtpPort(json.config.smtpPort || 465);
          setSmtpUser(json.config.smtpUser || 'sudipadhikari8107@gmail.com');
          setFromName(json.config.fromName || 'SAARTHI System Updates');
          setAdminEmail(json.config.adminEmail || 'sudipadhikari8107@gmail.com');
          setIsSmtpConfigured(json.config.configured || false);
        }
      }
    } catch (err) {
      console.warn('Could not fetch SMTP config:', err);
    }
  };

  const handleSaveSmtpSettings = async () => {
    setSmtpStatusMessage('');
    setSmtpStatusType('');
    try {
      const res = await fetch('/api/smtp/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          smtpHost,
          smtpPort,
          smtpUser,
          smtpPass: smtpPass || undefined,
          fromName,
          adminEmail,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSmtpStatusType('success');
        setSmtpStatusMessage('SMTP configuration & email notifications successfully saved!');
        setIsSmtpConfigured(true);
        setSmtpPass(''); // clear input for security
        onAddAuditLog('SMTP Settings Saved', 'SETTINGS', 'INFO', `Configured SMTP host ${smtpHost} with recipient ${adminEmail}`);
      } else {
        setSmtpStatusType('error');
        setSmtpStatusMessage(data.message || data.error || 'Failed to save SMTP settings');
      }
    } catch (err: any) {
      setSmtpStatusType('error');
      setSmtpStatusMessage(`Save error: ${err.message}`);
    }
  };

  const handleSendTestEmail = async () => {
    setIsSendingTest(true);
    setSmtpStatusMessage('');
    setSmtpStatusType('info');
    try {
      const res = await fetch('/api/smtp/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: adminEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSmtpStatusType('success');
        setSmtpStatusMessage(data.message || `Test verification email delivered to ${adminEmail}!`);
        onAddAuditLog('Test Email Dispatched', 'SETTINGS', 'INFO', `Test email dispatched to ${adminEmail}`);
      } else {
        setSmtpStatusType('error');
        setSmtpStatusMessage(data.details || data.message || 'Failed to dispatch test email.');
      }
    } catch (err: any) {
      setSmtpStatusType('error');
      setSmtpStatusMessage(`Test email error: ${err.message}`);
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleTriggerSummaryEmail = async () => {
    setIsSendingSummary(true);
    setSmtpStatusMessage('');
    setSmtpStatusType('info');
    try {
      const res = await fetch('/api/email/trigger-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSmtpStatusType('success');
        setSmtpStatusMessage(`Release update summary email successfully delivered to ${adminEmail}!`);
        onAddAuditLog('Release Summary Email Triggered', 'SETTINGS', 'INFO', `Automated update summary dispatched to ${adminEmail}`);
      } else {
        setSmtpStatusType('error');
        setSmtpStatusMessage(data.details || data.message || 'Failed to trigger summary email.');
      }
    } catch (err: any) {
      setSmtpStatusType('error');
      setSmtpStatusMessage(`Summary email error: ${err.message}`);
    } finally {
      setIsSendingSummary(false);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrorMsg('');
    setPasswordSuccessMsg('');

    if (!newPassword || newPassword.length < 6) {
      setPasswordErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('New password and confirm password do not match.');
      return;
    }

    updateSuperAdminPassword(newPassword);
    setSuperAdminCreds(getSuperAdminCreds());
    setNewPassword('');
    setConfirmPassword('');
    setPasswordSuccessMsg('Super Admin password successfully updated and persisted!');
    onAddAuditLog('Super Admin Password Changed', 'AUTH', 'WARN', 'Owner changed Super Admin password credentials.');
    setTimeout(() => setPasswordSuccessMsg(''), 4000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveSmtpSettings();
    setShowSavedToast(true);
    onAddAuditLog('Developer Settings Saved', 'SETTINGS', 'INFO', 'Updated GitHub repo, auto-refresh frequency, and security PIN rules.');
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <span>Developer Platform Settings</span>
          </h2>
          <p className="text-xs text-slate-400">
            Configure auto-refresh frequency, GitHub connections, automated email dispatch, and developer security credentials.
          </p>
        </div>

        {showSavedToast && (
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40 flex items-center gap-1.5 animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Settings Saved
          </span>
        )}
      </div>

      {/* Automated Email Notifications & SMTP Gateway Section */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-amber-400" />
              <span>Automated Update Emails & SMTP Configuration</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Receives instant professional release summaries with dual AD/BS dates, commit logs, and changelogs after every update.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border flex items-center gap-1.5 ${
              isSmtpConfigured
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isSmtpConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {isSmtpConfigured ? 'SMTP LIVE CONFIGURED' : 'PENDING CREDENTIALS'}
            </span>
          </div>
        </div>

        {/* Status Message / Notification Banner */}
        {smtpStatusMessage && (
          <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 transition-all ${
            smtpStatusType === 'success'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              : smtpStatusType === 'error'
              ? 'bg-rose-950/60 border-rose-800 text-rose-300'
              : 'bg-sky-950/60 border-sky-800 text-sky-300'
          }`}>
            {smtpStatusType === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : smtpStatusType === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <span className="font-semibold">{smtpStatusMessage}</span>
            </div>
          </div>
        )}

        {/* Instructions / Google App Password Tip */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Gmail SMTP Requirements (Google 2-Step Verification)</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            To enable Gmail to send automated update emails to <code>sudipadhikari8107@gmail.com</code>, enter your 16-character <strong>Google App Password</strong> below (generated under <em>Google Account &rarr; Security &rarr; 2-Step Verification &rarr; App Passwords</em>). Standard Gmail passwords are restricted by Google Modern Auth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="block text-slate-300 font-bold mb-1">SMTP Host</label>
            <input
              type="text"
              value={smtpHost}
              onChange={(e) => setSmtpHost(e.target.value)}
              placeholder="smtp.gmail.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">SMTP Port & Protocol</label>
            <input
              type="number"
              value={smtpPort}
              onChange={(e) => setSmtpPort(parseInt(e.target.value, 10) || 465)}
              placeholder="465 (SSL) or 587 (TLS)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">SMTP User / Sending Account</label>
            <input
              type="email"
              value={smtpUser}
              onChange={(e) => setSmtpUser(e.target.value)}
              placeholder="sudipadhikari8107@gmail.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">
              SMTP App Password (16 characters)
            </label>
            <div className="relative">
              <input
                type={showSmtpPass ? 'text' : 'password'}
                value={smtpPass}
                onChange={(e) => setSmtpPass(e.target.value)}
                placeholder="Enter 16-character Google App Password"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowSmtpPass(!showSmtpPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showSmtpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Sender Display Name</label>
            <input
              type="text"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              placeholder="SAARTHI System Updates"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Platform Owner Recipient Email</label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="sudipadhikari8107@gmail.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Email Control Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleSaveSmtpSettings}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save SMTP Credentials</span>
          </button>

          <button
            type="button"
            onClick={handleSendTestEmail}
            disabled={isSendingTest}
            className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 font-bold text-xs transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSendingTest ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>{isSendingTest ? 'Sending Test...' : 'Send Test Verification Email'}</span>
          </button>

          <button
            type="button"
            onClick={handleTriggerSummaryEmail}
            disabled={isSendingSummary}
            className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-sky-500/40 text-sky-400 hover:text-sky-300 font-bold text-xs transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSendingSummary ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
            <span>{isSendingSummary ? 'Dispatching Summary...' : 'Send Latest Release Summary Email'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Refresh & Telemetry Settings */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Dashboard Auto Refresh Interval</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {[10, 15, 30, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => onChangeInterval(mins)}
                className={`p-3.5 rounded-2xl border font-mono font-bold transition-all ${
                  refreshIntervalMins === mins
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {mins} Minutes {mins === 30 && '(Default)'}
              </button>
            ))}
          </div>
        </div>

        {/* GitHub & Storage Settings */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Github className="w-4 h-4 text-amber-400" />
            <span>GitHub & Repository Storage</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-300 font-bold mb-1">GitHub Repository URL</label>
              <input
                type="text"
                value={githubRepoUrl}
                onChange={(e) => setGithubRepoUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">GitHub Target Branch</label>
              <input
                type="text"
                value={githubBranch}
                onChange={(e) => setGithubBranch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 font-bold mb-1">Primary Backup Storage Provider</label>
              <input
                type="text"
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Security Credentials & Notifications */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Key className="w-4 h-4 text-amber-400" />
            <span>Security PIN & Notification Rules</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Super Admin Security PIN Code</label>
              <input
                type="password"
                value={developerPin}
                onChange={(e) => setDeveloperPin(e.target.value)}
                className="w-full max-w-xs bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="reqPin"
                checked={requirePinForExports}
                onChange={(e) => setRequirePinForExports(e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-amber-500 focus:ring-0"
              />
              <label htmlFor="reqPin" className="text-slate-300 font-medium">
                Require PIN verification before executing GitHub pushes or critical platform updates.
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="emailAlerts"
                checked={emailAlertsEnabled}
                onChange={(e) => setEmailAlertsEnabled(e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-amber-500 focus:ring-0"
              />
              <label htmlFor="emailAlerts" className="text-slate-300 font-medium">
                Send instant email alert to <code>sudipadhikari8107@gmail.com</code> on backup failure or unauthorized access attempt.
              </label>
            </div>
          </div>
        </div>

        {/* Super Admin Owner Credentials & Password Change */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>Super Admin Account & Password Management</span>
            </h3>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono font-bold text-amber-400 uppercase">
              Full Access Owner
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Username Identifier</span>
              <span className="text-white font-bold text-sm">{superAdminCreds.username}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase">Primary Super Admin Email</span>
              <span className="text-white font-bold text-sm">{superAdminCreds.email}</span>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3 pt-2">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Change Super Admin Password</span>
            </div>

            {passwordErrorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                {passwordErrorMsg}
              </div>
            )}

            {passwordSuccessMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{passwordSuccessMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-[11px] font-semibold mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-semibold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-amber-500/40 text-amber-400 hover:text-amber-300 font-bold text-xs transition-all flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Update Super Admin Password</span>
            </button>
          </form>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Developer Configuration</span>
        </button>
      </form>
    </div>
  );
};
