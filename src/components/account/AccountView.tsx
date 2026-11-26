import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  CloudUpload,
  Compass,
  Download,
  FileText,
  Globe,
  Heart,
  HelpCircle,
  Info,
  Laptop,
  Lock,
  LogOut,
  MailCheck,
  MessageSquare,
  Palette,
  RefreshCw,
  RotateCcw,
  Shield,
  ShieldCheck,
  Smartphone,
  Trash2,
  User,
} from 'lucide-react';
import { useSyncAuth } from '../../context/SyncAuthContext';
import { useOptionalLanguage } from '../../context/LanguageContext';
import { SupportedLanguage } from '../../i18n/translations';
import { SyncStatusBadge } from '../common/SyncStatusBadge';
import { ThemeModeSelector } from '../common/ThemeModeSelector';
import { openAppSyncModal } from '../common/AppUpdateChecker';
import {
  DASHBOARD_LAYOUT_SYNC_ID,
  DEFAULT_WIDGET_ORDER,
  saveLocalDashboardPreferences,
  encodeDashboardPrefsForSync,
} from '../../services/dashboardPrefsService';
import { Button, SectionHeader } from '../ui';
import { triggerHaptic } from '../../utils/appFeedback';

interface AccountViewProps {
  currentLang: SupportedLanguage;
  onToggleLang: () => void;
  devanagariNumerals: boolean;
  onToggleDevanagariNumerals: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenAuthModal: () => void;
  onOpenConflicts: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  currentLang,
  onToggleLang,
  devanagariNumerals,
  onToggleDevanagariNumerals,
  onNavigateTab,
  onOpenAuthModal,
  onOpenConflicts,
}) => {
  const { t } = useOptionalLanguage(currentLang);
  const isNe = currentLang === 'ne';

  const {
    firebaseUser,
    isOnline,
    isCloudSyncVerified,
    userProfile,
    setLocalUserProfile,
    signOutAll,
    syncStatus,
    pendingCount,
    conflicts,
    lastSyncedAtIso,
    syncError,
    vaultDocs,
    keeperItems,
    savedItems,
    linkedDevices,
    hasPendingLegacyMigration,
    toggleSavedItem,
    upsertSavedItemRecord,
    triggerManualSync,
    runLegacyMigration,
    downloadPreMigrationBackup,
    exportAllUserDataJson,
    revokeLinkedDevice,
    resendVerificationEmail,
    refreshVerificationStatus,
  } = useSyncAuth();

  const [editPhone, setEditPhone] = useState(userProfile.phone || '');
  const [editNagarikId, setEditNagarikId] = useState(userProfile.nagarikId || '');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  useEffect(() => {
    setEditPhone(userProfile.phone || '');
    setEditNagarikId(userProfile.nagarikId || '');
  }, [userProfile.phone, userProfile.nagarikId]);

  const visibleShortcuts = savedItems.filter((item) => item.id !== DASHBOARD_LAYOUT_SYNC_ID);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('light');
    setLocalUserProfile({
      ...userProfile,
      phone: editPhone.trim() || undefined,
      nagarikId: editNagarikId.trim() || undefined,
    });
    setActionError(null);
    setStatusMessage(
      isNe
        ? 'प्रोफाइल विवरण सुरक्षित र सिङ्क गरियो।'
        : 'Profile details saved and synced across Website & Android.'
    );
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleExportJson = () => {
    triggerHaptic('light');
    const json = exportAllUserDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saarthi-account-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResendVerification = async () => {
    setBusyAction('verify');
    setActionError(null);
    try {
      await resendVerificationEmail();
      setStatusMessage(
        isNe
          ? 'प्रमाणीकरण इमेल पुनः पठाइएको छ। कृपया इनबक्स जाँच गर्नुहोस्।'
          : 'Verification email sent. Check your inbox and tap Refresh Status after confirming.'
      );
    } catch (err: any) {
      setActionError(err?.message || 'Unable to resend verification email right now.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleRefreshVerification = async () => {
    setBusyAction('refresh-verify');
    setActionError(null);
    try {
      const verified = await refreshVerificationStatus();
      if (verified) {
        setStatusMessage(isNe ? 'इमेल प्रमाणित भयो र सिङ्क सुरु भयो।' : 'Email verified. Cross-device sync is now active.');
      } else {
        setActionError(
          isNe
            ? 'इमेल अझै प्रमाणित भएको छैन। कृपया इमेल लिङ्क क्लिक गरेर फेरि जाँच गर्नुहोस्।'
            : 'Email is not verified yet. Open the verification link in your inbox, then check again.'
        );
      }
    } catch (err: any) {
      setActionError(err?.message || 'Could not refresh verification state.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleMigrateLegacy = async () => {
    setBusyAction('migrate');
    setActionError(null);
    try {
      const res = await runLegacyMigration();
      setStatusMessage(
        isNe
          ? `${res.vaultMigrated} कागजात र ${res.keeperMigrated} रिमाइन्डर सुरक्षित रूपमा सिङ्क गरियो।`
          : `Imported ${res.vaultMigrated} vault document(s) and ${res.keeperMigrated} reminder(s) safely.`
      );
    } catch (err: any) {
      setActionError(err?.message || 'Migration failed. Your original local data remains intact.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleResetDashboardLayout = async () => {
    triggerHaptic('light');
    const resetPrefs = saveLocalDashboardPreferences({
      widgetOrder: [...DEFAULT_WIDGET_ORDER],
      hiddenWidgets: [],
      updatedAtIso: new Date().toISOString(),
    });
    const encoded = encodeDashboardPrefsForSync(resetPrefs);
    await upsertSavedItemRecord({
      id: DASHBOARD_LAYOUT_SYNC_ID,
      kind: 'note',
      targetId: 'dashboard-layout',
      title: 'SAARTHI Dashboard Layout Preferences',
      subtitle: encoded.subtitle,
      tags: encoded.tags,
      pinned: false,
    });
    setStatusMessage(isNe ? 'ड्यासबोर्ड लेआउट पूर्वनिर्धारित अवस्थामा फर्कियो।' : 'Dashboard layout reset to default.');
  };

  const accountModeLabel = firebaseUser
    ? isCloudSyncVerified
      ? t.account.cloudVerified
      : t.account.verificationPending
    : userProfile.isLoggedIn
    ? t.account.localOnly
    : t.account.signedOut;

  const secondaryRoutes = [
    { id: 'vault', label: t.nav.vault, icon: FileText, tone: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { id: 'about', label: t.footer.about, icon: Info, tone: 'bg-slate-500/10 text-slate-700 dark:text-slate-300' },
    { id: 'roadmap', label: isNe ? 'रोडम्याप' : 'Roadmap', icon: Compass, tone: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    { id: 'contact', label: isNe ? 'सम्पर्क' : 'Contact', icon: MessageSquare, tone: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
    { id: 'support', label: t.footer.support, icon: HelpCircle, tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    { id: 'privacy', label: t.footer.privacy, icon: Shield, tone: 'bg-slate-500/10 text-slate-700 dark:text-slate-300' },
    { id: 'terms', label: t.footer.terms, icon: FileText, tone: 'bg-slate-500/10 text-slate-700 dark:text-slate-300' },
    { id: 'donate', label: t.footer.donate, icon: Heart, tone: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-8 space-y-6 pb-24 app-screen-transition">
      <SectionHeader title={t.account.title} subtitle={t.account.subtitle} />

      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {(actionError || syncError) && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{actionError || syncError}</span>
        </div>
      )}

      {/* Flutter Material 3 Expressive Identity Hero Card */}
      <section className="rounded-[28px] overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm">
        <div className="bg-gradient-to-br from-[#0B1F3A] via-[#102A4C] to-[#163663] text-white p-6 sm:p-7">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4 min-w-0">
              {userProfile.isLoggedIn && userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name || 'User avatar'}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-cover shrink-0 border-2 border-white/20 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-white/14 border border-white/20 text-white font-bold text-2xl flex items-center justify-center shrink-0">
                  {userProfile.isLoggedIn && userProfile.name
                    ? userProfile.name.charAt(0).toUpperCase()
                    : <User className="w-7 h-7 text-blue-100" />}
                </div>
              )}

              <div className="min-w-0 space-y-1">
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight truncate">
                  {userProfile.isLoggedIn ? userProfile.name : t.account.signedOutTitle}
                </h2>
                <p className="text-xs text-blue-100/90 truncate">
                  {accountModeLabel}
                  <span aria-hidden="true"> · </span>
                  {userProfile.isLoggedIn ? userProfile.email : t.account.signedOutDesc}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <SyncStatusBadge
                status={syncStatus}
                pendingCount={pendingCount}
                conflictCount={conflicts.length}
                onClick={() => (conflicts.length > 0 ? onOpenConflicts() : void triggerManualSync())}
              />

              {userProfile.isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('medium');
                    void signOutAll();
                  }}
                  className="min-h-[42px] px-4 py-2 rounded-2xl bg-white/12 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold inline-flex items-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.account.signOutBtn}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    onOpenAuthModal();
                  }}
                  className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-white text-[#0B1F3A] hover:bg-blue-50 text-xs font-semibold inline-flex items-center gap-2 shadow-sm active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>{t.account.signInBtn}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Unified Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800 bg-white dark:bg-[#0F172A]">
          <div className="px-5 py-4">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              {isNe ? 'डिजिटल भल्ट' : 'Vault Docs'}
            </span>
            <span className="text-xl font-bold font-mono tabular-nums text-[#0B1F3A] dark:text-white mt-0.5 block">
              {vaultDocs.length}
            </span>
          </div>
          <div className="px-5 py-4">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              {isNe ? 'रिमाइन्डरहरू' : 'Reminders'}
            </span>
            <span className="text-xl font-bold font-mono tabular-nums text-[#0B1F3A] dark:text-white mt-0.5 block">
              {keeperItems.length}
            </span>
          </div>
          <div className="px-5 py-4">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              {isNe ? 'सर्टकटहरू' : 'Pinned Shortcuts'}
            </span>
            <span className="text-xl font-bold font-mono tabular-nums text-[#0B1F3A] dark:text-white mt-0.5 block">
              {visibleShortcuts.length}
            </span>
          </div>
          <div className="px-5 py-4">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              {isNe ? 'अन्तिम सिङ्क' : 'Last Synced'}
            </span>
            <span className="text-sm font-mono tabular-nums font-semibold text-[#0B1F3A] dark:text-white mt-1.5 block truncate">
              {lastSyncedAtIso
                ? new Date(lastSyncedAtIso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : isOnline
                ? isNe
                  ? 'तयार'
                  : 'Ready'
                : isNe
                ? 'अफलाइन'
                : 'Offline'}
            </span>
          </div>
        </div>

        {/* Inline Cloud Sync Status & Quick Actions Bar */}
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50/80 dark:bg-[#0B1220] border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => void triggerManualSync()}>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.account.syncNow}</span>
            </Button>

            {conflicts.length > 0 && (
              <Button variant="danger" size="sm" onClick={onOpenConflicts}>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>
                  {t.account.resolveConflicts} ({conflicts.length})
                </span>
              </Button>
            )}

            {!firebaseUser && (
              <Button variant="primary" size="sm" onClick={onOpenAuthModal}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {userProfile.isLoggedIn
                    ? isNe
                      ? 'क्लाउड खाता जोड्नुहोस्'
                      : 'Connect Cloud Sync'
                    : t.account.signInBtn}
                </span>
              </Button>
            )}
          </div>

          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {isNe
              ? 'वेबसाइट र एन्ड्रोइड एपको डेटा एउटै खातामा सिङ्क हुन्छ'
              : 'Website and Android App data stay synced in one place'}
          </span>
        </div>
      </section>

      {/* Email Verification Notice */}
      {firebaseUser && !isCloudSyncVerified && (
        <div className="p-5 rounded-3xl border border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/30 space-y-3 text-xs">
          <p className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <MailCheck className="w-4 h-4" />
            <span>{t.account.verificationPending}</span>
          </p>
          <p className="text-amber-800 dark:text-amber-300">
            {isNe
              ? 'तपाईँको लोकल डेटा सुरक्षित छ। क्लाउड सिङ्क र अन्य डिभाइससँग जोड्न कृपया इमेल प्रमाणीकरण पूरा गर्नुहोस्।'
              : 'Your edits are safely queued locally. Verify your email address to activate multi-device sync across Website and Android.'}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void handleResendVerification()}
              disabled={busyAction === 'verify'}
            >
              {busyAction === 'verify' ? 'Sending...' : 'Resend Verification Email'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => void handleRefreshVerification()}
              disabled={busyAction === 'refresh-verify'}
            >
              {busyAction === 'refresh-verify' ? 'Checking...' : 'I Verified — Refresh Status'}
            </Button>
          </div>
        </div>
      )}

      {/* Legacy Migration Callout */}
      {hasPendingLegacyMigration && (
        <div className="p-5 rounded-3xl border border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/25 space-y-3 text-xs">
          <p className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <CloudUpload className="w-4 h-4" />
            <span>{isNe ? 'पुरानो ब्राउजर डेटा फेला पर्यो' : 'Legacy Local Storage Data Detected'}</span>
          </p>
          <p className="text-amber-800 dark:text-amber-300">
            {isNe
              ? 'ब्याकअप सुरक्षित राखी पुराना कागजात र रिमाइन्डरहरू क्लाउड सिङ्कमा सार्नुहोस्।'
              : 'Import existing browser storage records into your synced account with automatic JSON backup protection.'}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={downloadPreMigrationBackup}>
              <Download className="w-3.5 h-3.5" />
              <span>{isNe ? 'पहिले ब्याकअप डाउनलोड गर्नुहोस्' : 'Download Backup JSON First'}</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => void handleMigrateLegacy()}
              disabled={busyAction === 'migrate'}
            >
              <span>{busyAction === 'migrate' ? 'Importing...' : isNe ? 'सुरक्षित सार्नुहोस्' : 'Import & Sync Safely'}</span>
            </Button>
          </div>
        </div>
      )}

      {/* 2-Column Flutter Settings & Identity Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile + App Preferences + Shortcuts */}
        <div className="lg:col-span-7 space-y-6">
          {/* Citizen Profile Details */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-[#0B1F3A] dark:text-white">
                  {isNe ? 'नागरिक प्रोफाइल विवरण' : 'Citizen Profile Details'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isNe ? 'वेब र एन्ड्रोइडमा साझा गरिएको विवरण' : 'Shared identity details across Web & Android'}
                </p>
              </div>
            </div>

            {userProfile.isLoggedIn ? (
              <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1.5">
                      {isNe ? 'मोबाइल नम्बर' : 'Mobile Number'}
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      className="w-full h-11 rounded-2xl px-3.5 bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 font-mono text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1.5">
                      {isNe ? 'नागरिक आईडी (वैकल्पिक)' : 'Nagarik ID (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={editNagarikId}
                      onChange={(e) => setEditNagarikId(e.target.value)}
                      placeholder="Optional ID"
                      className="w-full h-11 rounded-2xl px-3.5 bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-700 font-mono text-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="min-h-[42px] px-5 py-2 rounded-2xl bg-[#0B1F3A] hover:bg-[#132f57] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs active:scale-[0.98] transition-all cursor-pointer"
                  >
                    {t.actions.save}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <p>
                  {isNe
                    ? 'प्रोफाइल विवरण सुरक्षित गर्न र सबै डिभाइसमा सिङ्क गर्न साइन इन गर्नुहोस्।'
                    : 'Sign in to save personal details and keep your Digital Vault synced between Web and Android.'}
                </p>
                <Button variant="secondary" size="sm" onClick={onOpenAuthModal}>
                  {t.account.signInBtn}
                </Button>
              </div>
            )}
          </div>

          {/* Flutter ListTile Group: Preferences & App Updates */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="text-sm font-semibold text-[#0B1F3A] dark:text-white">
                {t.account.preferences}
              </h3>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {/* Theme Row */}
              <div className="px-5 sm:px-6 py-3.5 min-h-[60px] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Palette className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-medium text-[#0B1F3A] dark:text-white block">{t.theme.label}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isNe ? 'उज्यालो वा गाढा दृश्य' : 'Light, dark, or system appearance'}
                    </span>
                  </div>
                </div>
                <ThemeModeSelector />
              </div>

              {/* Language Row */}
              <div className="px-5 sm:px-6 py-3.5 min-h-[60px] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-medium text-[#0B1F3A] dark:text-white block">
                      {isNe ? 'प्रदर्शन भाषा' : 'Display Language'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {currentLang === 'en' ? 'English active' : 'नेपाली सक्रिय'}
                    </span>
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={onToggleLang}>
                  <span>{currentLang === 'en' ? 'English → नेपाली' : 'नेपाली → English'}</span>
                </Button>
              </div>

              {/* Devanagari Numerals Material-3 Switch Row */}
              <div className="px-5 sm:px-6 py-3.5 min-h-[60px] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">
                    ०९
                  </span>
                  <div>
                    <span className="font-medium text-[#0B1F3A] dark:text-white block">
                      {t.account.devanagariDigits}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isNe ? 'मिति र अङ्कहरू देवनागरीमा देखाउनुहोस्' : 'Display numerals in Devanagari script'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={devanagariNumerals}
                  onClick={() => {
                    triggerHaptic('light');
                    onToggleDevanagariNumerals();
                  }}
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                    devanagariNumerals ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                      devanagariNumerals ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* App Updates Row */}
              <div className="px-5 sm:px-6 py-3.5 min-h-[60px] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-medium text-[#0B1F3A] dark:text-white block">
                      {t.account.apkSyncSettings}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isNe ? 'स्वचालित एप अपडेट जाँच' : 'Automatic background app updates'}
                    </span>
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => openAppSyncModal()}>
                  <span>{isNe ? 'अपडेट जाँच गर्नुहोस्' : 'Check for Update'}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Saved Shortcuts */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-semibold text-[#0B1F3A] dark:text-white">
                  {t.account.savedShortcuts}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => void handleResetDashboardLayout()}
                className="min-h-[36px] px-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-[#0B1F3A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isNe ? 'लेआउट रिसेट' : 'Reset Home Layout'}</span>
              </button>
            </div>

            {visibleShortcuts.length > 0 ? (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {visibleShortcuts.map((item) => (
                  <li key={item.id} className="px-5 sm:px-6 py-3 min-h-[52px] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigateTab(item.targetId)}
                      className="font-medium text-[#0B1F3A] dark:text-white hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1.5 cursor-pointer text-left"
                    >
                      <span>{item.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void toggleSavedItem(item)}
                      className="text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 text-[11px] font-medium cursor-pointer px-2 py-1"
                    >
                      {isNe ? 'हटाउनुहोस्' : 'Remove'}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 sm:px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                {isNe
                  ? 'गृहपृष्ठबाट कुनै पनि सेवा बुकमार्क गर्नुहोस् र यहाँ तथा अन्य डिभाइसमा छिटो पहुँच पाउनुहोस्।'
                  : 'Bookmark any service card from Home to synchronize your shortcuts across Web and Android.'}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Linked Devices + Data, Privacy & Support ListTiles */}
        <div className="lg:col-span-5 space-y-6">
          {/* Linked Devices */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-2.5">
              <Laptop className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-semibold text-[#0B1F3A] dark:text-white">
                {t.account.linkedDevices} ({linkedDevices.length})
              </h3>
            </div>

            {linkedDevices.length > 0 ? (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                {linkedDevices.map((dev) => (
                  <li key={dev.id} className="px-5 sm:px-6 py-3.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                        {dev.platform === 'android-apk' ? (
                          <Smartphone className="w-4 h-4" />
                        ) : (
                          <Laptop className="w-4 h-4" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-[#0B1F3A] dark:text-white truncate">
                          {dev.deviceLabel} · {dev.platform}
                        </p>
                        <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          v{dev.appVersion} · {dev.revoked ? 'Revoked' : dev.lastSyncState}
                        </p>
                      </div>
                    </div>
                    {!dev.revoked && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => void revokeLinkedDevice(dev.id)}
                      >
                        {t.account.revokeDevice}
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 sm:px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                {isCloudSyncVerified
                  ? isNe
                    ? 'सिङ्क पूरा भएपछि सक्रिय डिभाइसहरू यहाँ देखिनेछन्।'
                    : 'Active sessions appear here after verification syncs.'
                  : isNe
                  ? 'वेबसाइट र एन्ड्रोइड एप डिभाइसहरू हेर्न साइन इन गर्नुहोस्।'
                  : 'Sign in with your account to view linked Web and Android sessions.'}
              </p>
            )}
          </div>

          {/* Data Backup, Privacy & Support ListTile Menu */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-semibold text-[#0B1F3A] dark:text-white">
                {t.account.dataPortability}
              </h3>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              <button
                type="button"
                onClick={handleExportJson}
                className="w-full px-5 sm:px-6 py-3 min-h-[52px] flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Download className="w-4 h-4" />
                  </span>
                  <span className="font-medium text-[#0B1F3A] dark:text-white">{t.account.exportJson}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {secondaryRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <button
                    key={route.id}
                    type="button"
                    onClick={() => onNavigateTab(route.id)}
                    className="w-full px-5 sm:px-6 py-3 min-h-[52px] flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${route.tone}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="font-medium text-[#0B1F3A] dark:text-white">{route.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => onNavigateTab('account-deletion')}
                className="w-full px-5 sm:px-6 py-3 min-h-[52px] flex items-center justify-between gap-3 hover:bg-rose-50/70 dark:hover:bg-rose-950/25 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </span>
                  <span className="font-medium text-rose-600 dark:text-rose-400">
                    {t.footer.accountDeletion}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-400 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
