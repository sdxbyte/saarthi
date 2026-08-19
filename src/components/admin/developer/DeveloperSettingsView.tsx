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
  KeyRound
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

  // Super Admin Account Password state
  const [superAdminCreds, setSuperAdminCreds] = useState(getSuperAdminCreds());
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  useEffect(() => {
    setSuperAdminCreds(getSuperAdminCreds());
  }, []);

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
            Configure auto-refresh frequency, GitHub connections, storage locations, and developer security credentials.
          </p>
        </div>

        {showSavedToast && (
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40 flex items-center gap-1.5 animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Settings Saved
          </span>
        )}
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
