import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
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
import { triggerHaptic } from '../../utils/appFeedback';

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
    case 'auth/webview-google-blocked':
      return 'Google popup is restricted inside the Android app shell. Sign in below with the same Email & Password used on the website to sync everything seamlessly.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in window was closed before completing authentication.';
    case 'auth/popup-blocked':
      return 'Popup blocked by browser. Allow popups or use Email & Password below.';
    case 'auth/unauthorized-domain':
      return 'Use your Email & Password below to sign in and sync seamlessly across Website and Android.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not yet enabled in Firebase Console. Use "Continue with Google" or offline device mode.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email address or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Switch to Sign In or reset your password.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes and try again.';
    case 'auth/network-request-failed':
      return 'Network unavailable. Check your internet connection or use offline device mode.';
    default:
      return err?.message || 'Unable to complete authentication right now.';
  }
}

const GoogleMark: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
    />
  </svg>
);

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
  const [showLocalFallback, setShowLocalFallback] = useState(false);
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

  useEffect(() => {
    setEditPhone(userProfile.phone || '');
    setEditNagarikId(userProfile.nagarikId || '');
  }, [userProfile.phone, userProfile.nagarikId]);

  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const isNe = currentLang === 'ne';

  const handleGoogleSignIn = async () => {
    triggerHaptic('light');
    setAuthError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);
    try {
      await signInGoogle();
      setSuccessMsg('Signed in with Google. Website and Android data now sync together.');
      setTimeout(() => onClose(), 700);
    } catch (err: any) {
      setAuthError(mapFirebaseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloudEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('light');
    setAuthError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);
    try {
      await signInEmail(loginEmail, loginPassword);
      setSuccessMsg('Signed in to your SAARTHI account.');
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
    triggerHaptic('light');
    setAuthError(null);
    setSuccessMsg(null);
    if (!regFullName.trim() || !regEmail.includes('@') || regPassword.length < 6 || regPassword !== regConfirmPassword || !agreeTerms) {
      setAuthError('Enter your full name, valid email, matching 6+ character password, and accept Terms.');
      return;
    }
    setIsSubmitting(true);
    try {
      await signUpEmail(regEmail, regPassword, regFullName);
      setSuccessMsg('Account created. Verify your email link to start syncing across Website and Android.');
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
      setAuthError('Enter your account email first to receive a password reset link.');
      return;
    }
    setAuthError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);
    try {
      await sendPasswordReset(loginEmail);
      setSuccessMsg(`Password reset email sent to ${loginEmail.trim()}.`);
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
        setSuccessMsg('Email verified. Cross-device sync is now active.');
      } else {
        setAuthError('Email is still unverified. Open the link in your inbox, then tap again.');
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
    triggerHaptic('light');
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
    triggerHaptic('medium');
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-lg max-h-[92dvh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] border shadow-2xl app-screen-transition ${
          isDark
            ? 'bg-[#0F172A] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="saarthi-account-modal-title"
      >
        {/* Material 3 Expressive Tonal Hero Header */}
        <div className="sticky top-0 z-10 px-6 pt-3 pb-5 bg-gradient-to-br from-[#0B1F3A] via-[#102A4C] to-[#163663] text-white rounded-b-[24px] shadow-md">
          <div className="w-10 h-1 rounded-full bg-white/30 mx-auto mb-3 sm:hidden" aria-hidden="true" />
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-white/12 border border-white/15 flex items-center justify-center shrink-0">
                <SaarthiLogo variant="compact" theme="dark" size={30} />
              </div>
              <div className="min-w-0">
                <h2 id="saarthi-account-modal-title" className="font-semibold text-base tracking-tight truncate">
                  {userProfile.isLoggedIn
                    ? isNe
                      ? 'सारथी खाता र सिङ्क'
                      : 'SAARTHI Account'
                    : isNe
                      ? 'सारथीमा स्वागत छ'
                      : 'Welcome to SAARTHI'}
                </h2>
                <p className="text-xs text-blue-100/85 truncate mt-0.5">
                  {firebaseUser
                    ? isCloudSyncVerified
                      ? 'Website & Android · Synced in one place'
                      : 'Verify email to activate multi-device sync'
                    : 'One account · Synced across Website & Android'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] rounded-2xl text-blue-100 hover:text-white hover:bg-white/12 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Close account modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {authError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5">
              <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {userProfile.isLoggedIn ? (
            <div className="space-y-4">
              {/* Flutter Identity Surface */}
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    {userProfile.avatarUrl ? (
                      <img
                        src={userProfile.avatarUrl}
                        alt={userProfile.name || 'SAARTHI User'}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-[#0B1F3A] dark:bg-blue-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
                        {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[#0B1F3A] dark:text-white truncate">
                        {userProfile.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {userProfile.email}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {firebaseUser
                          ? isCloudSyncVerified
                            ? 'Cloud Verified · Web & Android'
                            : 'Verification Pending'
                          : 'Local Device Only'}
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

                {/* Clean 3-column Tonal Metrics Strip */}
                <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/70 dark:border-slate-800 py-2.5 text-center">
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Vault Docs</span>
                    <span className="text-sm font-bold font-mono tabular-nums text-[#0B1F3A] dark:text-white">
                      {vaultDocs.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Reminders</span>
                    <span className="text-sm font-bold font-mono tabular-nums text-[#0B1F3A] dark:text-white">
                      {keeperItems.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Devices</span>
                    <span className="text-sm font-bold font-mono tabular-nums text-[#0B1F3A] dark:text-white">
                      {linkedDevices.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Email Verification Callout */}
              {firebaseUser && !isCloudSyncVerified && (
                <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 space-y-2.5 text-xs">
                  <p className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <MailCheck className="w-4 h-4" />
                    Verify Email to Activate Sync
                  </p>
                  <p className="text-amber-800 dark:text-amber-300">
                    Confirm the verification link sent to{' '}
                    <span className="font-mono font-semibold">{firebaseUser.email}</span> so Website and Android share your data.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => void handleResendVerification()}
                      className="min-h-[40px] px-3.5 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                    >
                      Resend Verification
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => void handleCheckVerification()}
                      className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#0B1F3A] dark:bg-blue-600 text-white font-semibold cursor-pointer"
                    >
                      I Verified — Refresh
                    </button>
                  </div>
                </div>
              )}

              {/* Cloud Upgrade Callout if local only */}
              {!firebaseUser && isFirebaseConfigured() && (
                <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/70 dark:bg-blue-950/30 space-y-2.5 text-xs">
                  <p className="font-semibold text-[#0B1F3A] dark:text-blue-200">
                    Connect Cloud Account for Web &amp; Android Sync
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    This profile is stored only on this device. Connect Google to share data with the Website and Android App.
                  </p>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => void handleGoogleSignIn()}
                    className="min-h-[44px] px-4 py-2 rounded-2xl bg-[#0B1F3A] hover:bg-[#132f57] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold cursor-pointer inline-flex items-center gap-2"
                  >
                    <GoogleMark />
                    <span>Connect Google Account</span>
                  </button>
                </div>
              )}

              {/* Legacy Local Migration Banner */}
              {hasPendingLegacyMigration && (
                <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 space-y-2.5 text-xs">
                  <p className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <CloudUpload className="w-4 h-4" />
                    Local Records Ready to Import
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={downloadPreMigrationBackup}
                      className="min-h-[40px] px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
                    >
                      Backup JSON First
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleMigrateLegacy()}
                      className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#0B1F3A] dark:bg-blue-600 text-white font-semibold cursor-pointer"
                    >
                      Import &amp; Sync
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Profile Details */}
              <form
                onSubmit={handleSaveProfile}
                className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200/80 dark:border-slate-800 space-y-3 text-xs"
              >
                <h3 className="font-semibold text-sm text-[#0B1F3A] dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
                      className="w-full h-11 rounded-2xl px-3.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 font-mono text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 mb-1">Nagarik ID (Optional)</label>
                    <input
                      type="text"
                      value={editNagarikId}
                      onChange={(e) => setEditNagarikId(e.target.value)}
                      placeholder="Optional ID"
                      className="w-full h-11 rounded-2xl px-3.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 font-mono text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className={editSuccess ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-500 dark:text-slate-400'}>
                    {editSuccess ? 'Saved & synced' : 'Synced across Web & Android'}
                  </span>
                  <button
                    type="submit"
                    className="min-h-[40px] px-4 py-2 rounded-2xl bg-[#0B1F3A] dark:bg-blue-600 text-white font-semibold active:scale-[0.98] transition-transform cursor-pointer"
                  >
                    Save Profile
                  </button>
                </div>
              </form>

              {/* Linked Devices */}
              {linkedDevices.length > 0 && (
                <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs">
                  <h3 className="font-semibold text-sm text-[#0B1F3A] dark:text-white flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Linked Devices ({linkedDevices.length})
                  </h3>
                  <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                    {linkedDevices.map((dev) => (
                      <li key={dev.id} className="py-2.5 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium truncate text-[#0B1F3A] dark:text-white">
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
                            className="min-h-[36px] px-3 py-1 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-[11px] font-medium cursor-pointer shrink-0"
                          >
                            Revoke
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions Bar */}
              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <button
                  type="button"
                  onClick={() => void triggerManualSync()}
                  className="min-h-[44px] py-2.5 px-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1220] hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportAllJson}
                  className="min-h-[44px] py-2.5 px-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B1220] hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
                <button
                  type="button"
                  onClick={() => void handleLogoutAll()}
                  className="min-h-[44px] py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

              {onOpenAccountDeletion && (
                <button
                  type="button"
                  onClick={onOpenAccountDeletion}
                  className="w-full min-h-[40px] py-2 rounded-2xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium cursor-pointer"
                >
                  Request Account &amp; Data Deletion
                </button>
              )}
            </div>
          ) : (
            /* SIGNED OUT VIEW: Flutter Expressive Unified Auth Sheet */
            <div className="space-y-4">
              {/* 1-Tap Google Sign-In Tile */}
              <button
                type="button"
                disabled={isSubmitting || !isFirebaseConfigured()}
                onClick={() => void handleGoogleSignIn()}
                className="w-full h-12 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1220] hover:bg-slate-50 dark:hover:bg-slate-800 text-[#0B1F3A] dark:text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
              >
                <GoogleMark />
                <span>{isSubmitting ? 'Connecting...' : 'Continue with Google'}</span>
              </button>

              <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                <span>or use your email</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>

              {/* Flutter Segmented Tab Bar */}
              <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 dark:bg-[#0B1220] p-1 border border-slate-200/80 dark:border-slate-800 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setAuthError(null);
                    setSuccessMsg(null);
                    setAuthMode('cloud_signin');
                  }}
                  className={`min-h-[40px] rounded-xl cursor-pointer transition-all ${
                    authMode === 'cloud_signin'
                      ? 'bg-white dark:bg-slate-800 text-[#0B1F3A] dark:text-white shadow-sm font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setAuthError(null);
                    setSuccessMsg(null);
                    setAuthMode('cloud_signup');
                  }}
                  className={`min-h-[40px] rounded-xl cursor-pointer transition-all ${
                    authMode === 'cloud_signup'
                      ? 'bg-white dark:bg-slate-800 text-[#0B1F3A] dark:text-white shadow-sm font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {authMode === 'cloud_signin' && (
                <form onSubmit={(e) => void handleCloudEmailSignIn(e)} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full h-12 rounded-2xl pl-10 pr-4 bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-medium text-slate-600 dark:text-slate-300">Password</label>
                      <button
                        type="button"
                        onClick={() => void handlePasswordReset()}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-12 rounded-2xl pl-10 pr-12 bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFirebaseConfigured()}
                    className="w-full h-12 rounded-2xl bg-[#0B1F3A] hover:bg-[#132f57] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
                  >
                    <span>{isSubmitting ? 'Signing In...' : 'Sign In & Sync'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {authMode === 'cloud_signup' && (
                <form onSubmit={(e) => void handleCloudEmailSignUp(e)} className="space-y-3 text-xs">
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full h-12 rounded-2xl pl-10 pr-4 bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full h-12 rounded-2xl pl-10 pr-4 bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Password (6+)"
                      className="w-full h-12 rounded-2xl px-3.5 bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Confirm"
                      className="w-full h-12 rounded-2xl px-3.5 bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <label className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer py-1">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span>I agree to the Terms of Service and Privacy Policy</span>
                  </label>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFirebaseConfigured()}
                    className="w-full h-12 rounded-2xl bg-[#0B1F3A] hover:bg-[#132f57] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
                  >
                    <span>{isSubmitting ? 'Creating Account...' : 'Create Account & Sync'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {(authMode === 'local_signin' || authMode === 'local_signup') && (
                <div className="pt-2 space-y-3">
                  <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 dark:bg-[#0B1220] p-1 border border-slate-200/80 dark:border-slate-800 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setAuthMode('local_signin')}
                      className={`min-h-[38px] rounded-xl cursor-pointer ${
                        authMode === 'local_signin'
                          ? 'bg-white dark:bg-slate-800 text-[#0B1F3A] dark:text-white shadow-sm font-semibold'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      Offline Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('local_signup')}
                      className={`min-h-[38px] rounded-xl cursor-pointer ${
                        authMode === 'local_signup'
                          ? 'bg-white dark:bg-slate-800 text-[#0B1F3A] dark:text-white shadow-sm font-semibold'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      New Offline Profile
                    </button>
                  </div>

                  {authMode === 'local_signin' ? (
                    <form onSubmit={handleLocalSignIn} className="space-y-3 text-xs">
                      <p className="text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>Offline profiles stay on this device only and do not sync between Website and Android.</span>
                      </p>
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full h-11 rounded-2xl px-3.5 bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 text-xs"
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full h-11 rounded-2xl px-3.5 bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 font-mono text-xs"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Sign In Offline</span>
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleLocalSignUp} className="space-y-3 text-xs">
                      <input
                        type="text"
                        required
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full h-11 rounded-2xl px-3.5 bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 text-xs"
                      />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full h-11 rounded-2xl px-3.5 bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 text-xs"
                      />
                      <div className="relative">
                        <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={regMobile}
                          onChange={(e) => setRegMobile(e.target.value)}
                          placeholder="Mobile Number (optional)"
                          className="w-full h-11 rounded-2xl pl-10 pr-3.5 bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 font-mono text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Password (6+)"
                          className="w-full h-11 rounded-2xl px-3.5 bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 font-mono text-xs"
                        />
                        <input
                          type="password"
                          required
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Confirm"
                          className="w-full h-11 rounded-2xl px-3.5 bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 font-mono text-xs"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                        />
                        <span>I agree to Terms &amp; Privacy</span>
                      </label>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
                      >
                        Create Offline Profile
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Discreet Offline Fallback Toggle */}
              <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setAuthError(null);
                    setSuccessMsg(null);
                    if (showLocalFallback) {
                      setShowLocalFallback(false);
                      setAuthMode('cloud_signin');
                    } else {
                      setShowLocalFallback(true);
                      setAuthMode('local_signin');
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-[#0B1F3A] dark:hover:text-white py-1.5 px-3 rounded-xl cursor-pointer"
                >
                  <span>{showLocalFallback ? 'Back to Cloud Account' : 'Use offline on this device only'}</span>
                  {showLocalFallback ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
