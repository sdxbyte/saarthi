import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  CloudUpload,
  Download,
  Eye,
  EyeOff,
  KeyRound,
  Laptop,
  Lock,
  LogOut,
  Mail,
  MailCheck,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  User,
  X,
  XCircle,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { authenticateCitizen, registerCitizenAccount, logoutCitizen } from '../../utils/citizenAuthStore';
import { SaarthiLogo } from '../brand/SaarthiLogo';
import { useSyncAuth } from '../../context/SyncAuthContext';
import { SyncStatusBadge } from '../common/SyncStatusBadge';
import { isFirebaseConfigured } from '../../lib/firebase';

interface AuthLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onLogin: (profile: UserProfile) => void;
  onLogout: () => void;
  onUpdateProfile?: (profile: UserProfile) => void;
  onOpenAccountDeletion?: () => void;
  currentLang: 'en' | 'ne';
  theme: 'dark' | 'light';
  vaultDocCount?: number;
}

type AuthTabMode = 'cloud_signin' | 'cloud_signup' | 'local_signin' | 'local_signup';

function mapFirebaseAuthError(err: any): string {
  const code = err?.code || '';
  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'Google sign-in window was closed before completing authentication.';
    case 'auth/popup-blocked':
      return 'Popup blocked by browser. Allow popups or use Email/Password sign-in below.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not yet enabled in Firebase Console. Use "Continue with Google" or Offline Local Profile mode.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email address or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Switch to Cloud Sign In or reset your password.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes and try again.';
    case 'auth/network-request-failed':
      return 'Network unavailable. Check your internet connection or use Offline Local Profile.';
    default:
      return err?.message || 'Unable to complete authentication right now.';
  }
}

export const AuthLoginModal: React.FC<AuthLoginModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onLogin,
  onLogout,
  onUpdateProfile,
  onOpenAccountDeletion,
  currentLang,
  theme,
}) => {
  const {
    firebaseUser,
    isCloudSyncVerified,
    signInGoogle,
    signInEmail,
    signUpEmail,
    sendPasswordReset,
    resendVerificationEmail,
    refreshVerificationStatus,
    signOutAll,
    syncStatus,
    pendingCount,
    conflicts,
    vaultDocs,
    keeperItems,
    linkedDevices,
    hasPendingLegacyMigration,
    triggerManualSync,
    runLegacyMigration,
    downloadPreMigrationBackup,
    exportAllUserDataJson,
    revokeLinkedDevice,
  } = useSyncAuth();

  const [authMode, setAuthMode] = useState<AuthTabMode>('cloud_signin');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editPhone, setEditPhone] = useState(userProfile.phone || '');
  const [editNagarikId, setEditNagarikId] = useState(userProfile.nagarikId || '');
  const [editSuccess, setEditSuccess] = useState(false);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);
    try {
      await signInGoogle();
      setSuccessMsg('Signed in with Google. Your SAARTHI cloud sync is active across devices.');
      setTimeout(() => onClose(), 700);
    } catch (err: any) {
      setAuthError(mapFirebaseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloudEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);
    try {
      await signInEmail(loginEmail, loginPassword);
      setSuccessMsg('Signed in to SAARTHI cloud account.');
      setLoginPassword('');
      setTimeout(() => onClose(), 700);
    } catch (err: any) {
      setAuthError(mapFirebaseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloudEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSuccessMsg(null);
    if (!regFullName.trim() || !regEmail.includes('@') || regPassword.length < 6 || regPassword !== regConfirmPassword || !agreeTerms) {
      setAuthError('Enter your full name, valid email, matching 6+ character password, and accept Terms.');
      return;
    }
    setIsSubmitting(true);
    try {
      await signUpEmail(regEmail, regPassword, regFullName);
      setSuccessMsg('Account created. A verification link was sent to your email address to enable cloud sync.');
      setRegPassword('');
      setRegConfirmPassword('');
    } catch (err: any) {
      setAuthError(mapFirebaseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setAuthError('Enter your account email above first to receive a password reset link.');
      return;
    }
    setAuthError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);
    try {
      await sendPasswordReset(loginEmail);
      setSuccessMsg(`Password reset email sent to ${loginEmail.trim()}. Check your inbox.`);
    } catch (err: any) {
      setAuthError(mapFirebaseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    setAuthError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);
    try {
      await resendVerificationEmail();
      setSuccessMsg('Verification link resent to your email address.');
    } catch (err: any) {
      setAuthError(mapFirebaseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckVerification = async () => {
    setAuthError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);
    try {
      const ok = await refreshVerificationStatus();
      if (ok) {
        setSuccessMsg('Email verified! Multi-device cloud sync is now active.');
      } else {
        setAuthError('Email is still unverified. Click the link in your inbox, then check again.');
      }
    } catch (err: any) {
      setAuthError(mapFirebaseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocalSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    const res = authenticateCitizen(loginEmail, loginPassword);
    setIsSubmitting(false);
    if (res.success && res.profile) {
      onLogin(res.profile);
      setLoginEmail('');
      setLoginPassword('');
      onClose();
    } else {
      setAuthError(res.message || 'Invalid email address or password.');
    }
  };

  const handleLocalSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!regFullName.trim() || !regEmail.includes('@') || regPassword.length < 6 || regPassword !== regConfirmPassword || !agreeTerms) {
      setAuthError('Please fill all required fields, match passwords (6+ chars), and accept Terms.');
      return;
    }
    setIsSubmitting(true);
    const res = registerCitizenAccount({
      fullName: regFullName,
      email: regEmail,
      mobileNumber: regMobile || '0000000000',
      password: regPassword,
    });
    setIsSubmitting(false);
    if (res.success && res.profile) {
      onLogin(res.profile);
      onClose();
    } else {
      setAuthError(res.message || 'Failed to create local profile.');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...userProfile,
      phone: editPhone.trim() || undefined,
      nagarikId: editNagarikId.trim() || undefined,
    };
    if (onUpdateProfile) onUpdateProfile(updated);
    setEditSuccess(true);
    setTimeout(() => setEditSuccess(false), 2500);
  };

  const handleLogoutAll = async () => {
    logoutCitizen();
    await signOutAll();
    onLogout();
    onClose();
  };

  const handleExportAllJson = () => {
    const json = exportAllUserDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saarthi-account-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleMigrateLegacy = async () => {
    const res = await runLegacyMigration();
    setSuccessMsg(`Imported ${res.vaultMigrated} vault document(s) and ${res.keeperMigrated} reminder(s) safely.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-xl max-h-[90dvh] overflow-y-auto rounded-2xl border shadow-2xl ${
          isDark
            ? 'bg-[#0F172A] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="saarthi-account-modal-title"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-[#0B1F3A] text-white">
          <div className="flex items-center gap-3">
            <SaarthiLogo variant="compact" theme="dark" size={36} />
            <div>
              <h2 id="saarthi-account-modal-title" className="font-semibold text-base">
                {userProfile.isLoggedIn
                  ? currentLang === 'ne'
                    ? 'एकीकृत खाता र क्लाउड सिङ्क'
                    : 'Unified SAARTHI Account & Sync'
                  : currentLang === 'ne'
                    ? 'सारथी खाता साइन इन'
                    : 'Sign In to SAARTHI'}
              </h2>
              <p className="text-[11px] text-blue-200">
                {firebaseUser
                  ? isCloudSyncVerified
                    ? 'Synced across Website, PWA & Android APK'
                    : 'Verify email address to activate multi-device sync'
                  : 'Sign in with Google or Email to sync Vault & Preferences'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Close account modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {userProfile.isLoggedIn ? (
            <div className="space-y-4">
              {/* Account Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1220] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#0B1F3A] dark:bg-blue-600 text-white font-bold text-base flex items-center justify-center shrink-0">
                      {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{userProfile.name}</p>
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                        {userProfile.email}
                      </p>
                    </div>
                  </div>
                  <SyncStatusBadge
                    status={syncStatus}
                    pendingCount={pendingCount}
                    conflictCount={conflicts.length}
                    onClick={() => void triggerManualSync()}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Account Mode</span>
                    <span className="font-medium">
                      {firebaseUser
                        ? isCloudSyncVerified
                          ? 'Cloud Verified'
                          : 'Verification Pending'
                        : 'Local Only'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Vault Docs</span>
                    <span className="font-mono font-semibold tabular-nums">{vaultDocs.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Reminders</span>
                    <span className="font-mono font-semibold tabular-nums">{keeperItems.length}</span>
                  </div>
                </div>
              </div>

              {/* Email Verification Required Banner */}
              {firebaseUser && !isCloudSyncVerified && (
                <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 space-y-2.5 text-xs">
                  <p className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <MailCheck className="w-4 h-4" />
                    Email Verification Required for Cloud Sync
                  </p>
                  <p className="text-amber-800 dark:text-amber-300">
                    Your edits are safely queued locally in IndexedDB. Confirm the verification link sent to{' '}
                    <span className="font-mono font-semibold">{firebaseUser.email}</span> to enable cross-device sync.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => void handleResendVerification()}
                      className="px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                    >
                      Resend Verification Email
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => void handleCheckVerification()}
                      className="px-3 py-1.5 rounded-lg bg-[#0B1F3A] dark:bg-blue-600 text-white font-semibold cursor-pointer"
                    >
                      I Verified — Refresh Status
                    </button>
                  </div>
                </div>
              )}

              {/* Cloud Upgrade Callout if signed in only locally */}
              {!firebaseUser && isFirebaseConfigured() && (
                <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/30 space-y-2.5 text-xs">
                  <p className="font-semibold text-[#0B1F3A] dark:text-blue-200">
                    Link Google Account for Cross-Device Sync
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    This session is local to this device. Connect Google to sync your documents and reminders with the Android APK and other browsers.
                  </p>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => void handleGoogleSignIn()}
                    className="px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#132f57] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold cursor-pointer"
                  >
                    Connect Google Account
                  </button>
                </div>
              )}

              {/* Legacy Local Migration Banner */}
              {hasPendingLegacyMigration && (
                <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 space-y-2.5 text-xs">
                  <p className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <CloudUpload className="w-4 h-4" />
                    Legacy Local Data Detected
                  </p>
                  <p className="text-amber-800 dark:text-amber-300">
                    Import your existing browser storage items safely into IndexedDB and Cloud Sync. A JSON recovery backup is preserved automatically.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={downloadPreMigrationBackup}
                      className="px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                    >
                      Download Backup JSON
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleMigrateLegacy()}
                      className="px-3 py-1.5 rounded-lg bg-[#0B1F3A] dark:bg-blue-600 text-white font-semibold cursor-pointer"
                    >
                      Import &amp; Sync Safely
                    </button>
                  </div>
                </div>
              )}

              {/* Profile Update Form */}
              <form
                onSubmit={handleSaveProfile}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1220] space-y-3 text-xs"
              >
                <h3 className="font-semibold text-sm flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Profile Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 mb-1">Mobile Number</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      className="w-full control-field font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 mb-1">Nagarik ID (Optional)</label>
                    <input
                      type="text"
                      value={editNagarikId}
                      onChange={(e) => setEditNagarikId(e.target.value)}
                      placeholder="Optional ID"
                      className="w-full control-field font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  {editSuccess ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Saved</span>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400">Synced with your account</span>
                  )}
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-[#0B1F3A] dark:bg-blue-600 text-white font-semibold cursor-pointer"
                  >
                    Save Profile
                  </button>
                </div>
              </form>

              {/* Linked Devices & Revocation */}
              {linkedDevices.length > 0 && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1220] space-y-2.5 text-xs">
                  <h3 className="font-semibold text-sm flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Linked Devices ({linkedDevices.length})
                  </h3>
                  <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                    {linkedDevices.map((dev) => (
                      <li key={dev.id} className="py-2 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {dev.deviceLabel} · {dev.platform}
                          </p>
                          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                            v{dev.appVersion} · {dev.revoked ? 'Revoked' : dev.lastSyncState}
                          </p>
                        </div>
                        {!dev.revoked && (
                          <button
                            type="button"
                            onClick={() => void revokeLinkedDevice(dev.id)}
                            className="px-2.5 py-1 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-[11px] font-medium cursor-pointer shrink-0"
                          >
                            Revoke
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions Footer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <button
                  type="button"
                  onClick={() => void triggerManualSync()}
                  className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Sync Now
                </button>
                <button
                  type="button"
                  onClick={handleExportAllJson}
                  className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export JSON
                </button>
                <button
                  type="button"
                  onClick={() => void handleLogoutAll()}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>

              {onOpenAccountDeletion && (
                <button
                  type="button"
                  onClick={onOpenAccountDeletion}
                  className="w-full py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium cursor-pointer"
                >
                  Request Account &amp; Data Deletion →
                </button>
              )}
            </div>
          ) : (
            /* SIGNED OUT VIEW */
            <div className="space-y-4">
              {/* Primary Unified Cloud Sign-In */}
              <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/30 space-y-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-[#0B1F3A] dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Unified Cloud Account (Web, PWA &amp; Android)
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Sign in once to share your Document Vault, Expiry Reminders, Shortcuts, and Theme seamlessly across devices.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isSubmitting || !isFirebaseConfigured()}
                  onClick={() => void handleGoogleSignIn()}
                  className="w-full py-3 px-4 rounded-xl bg-[#0B1F3A] hover:bg-[#132f57] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Connecting...' : 'Continue with Google'}</span>
                </button>
              </div>

              {/* Cloud Email/Password OR Local Offline Mode Switcher */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 rounded-xl bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800 text-[11px] font-medium">
                  {(
                    [
                      { id: 'cloud_signin', label: 'Cloud Email' },
                      { id: 'cloud_signup', label: 'Create Cloud' },
                      { id: 'local_signin', label: 'Local Sign In' },
                      { id: 'local_signup', label: 'Local Profile' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setAuthError(null);
                        setSuccessMsg(null);
                        setAuthMode(tab.id);
                      }}
                      className={`py-2 px-1.5 rounded-lg cursor-pointer transition-colors ${
                        authMode === tab.id
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {authMode === 'cloud_signin' && (
                  <form onSubmit={(e) => void handleCloudEmailSignIn(e)} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-medium mb-1">Email</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full control-field pl-9"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-medium">Password</label>
                        <button
                          type="button"
                          onClick={() => void handlePasswordReset()}
                          className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full control-field pl-9 pr-9 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || !isFirebaseConfigured()}
                      className="w-full py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#132f57] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Signing In...' : 'Sign In with Email (Cloud Sync)'}</span>
                    </button>
                  </form>
                )}

                {authMode === 'cloud_signup' && (
                  <form onSubmit={(e) => void handleCloudEmailSignUp(e)} className="space-y-3 text-xs">
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full control-field"
                    />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full control-field"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Password (6+)"
                        className="w-full control-field font-mono"
                      />
                      <input
                        type="password"
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Confirm"
                        className="w-full control-field font-mono"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      <span>I agree to the Terms of Service and Privacy Policy</span>
                    </label>
                    <button
                      type="submit"
                      disabled={isSubmitting || !isFirebaseConfigured()}
                      className="w-full py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#132f57] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? 'Creating Account...' : 'Create Cloud Account & Send Verification'}
                    </button>
                  </form>
                )}

                {authMode === 'local_signin' && (
                  <form onSubmit={handleLocalSignIn} className="space-y-3 text-xs">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                      <span>Local profiles stay only on this device unless linked to a Cloud Account.</span>
                    </p>
                    <div>
                      <label className="block font-medium mb-1">Email</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full control-field pl-9"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full control-field pl-9 pr-9 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      Sign In Locally (Offline Mode)
                    </button>
                  </form>
                )}

                {authMode === 'local_signup' && (
                  <form onSubmit={handleLocalSignUp} className="space-y-3 text-xs">
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full control-field"
                    />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full control-field"
                    />
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value)}
                        placeholder="Mobile Number (optional)"
                        className="w-full control-field pl-9 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Password (6+)"
                        className="w-full control-field font-mono"
                      />
                      <input
                        type="password"
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Confirm"
                        className="w-full control-field font-mono"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                      <span>I agree to the Terms of Service and Privacy Policy</span>
                    </label>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
                    >
                      Create Local Profile
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
