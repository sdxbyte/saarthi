import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Bookmark,
  CheckCircle2,
  CloudUpload,
  Download,
  FileText,
  Globe,
  Laptop,
  Lock,
  LogOut,
  MailCheck,
  RefreshCw,
  RotateCcw,
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
import { Button, Card, SectionHeader } from '../ui';

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

  const visibleShortcuts = savedItems.filter((item) => item.id !== DASHBOARD_LAYOUT_SYNC_ID);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalUserProfile({
      ...userProfile,
      phone: editPhone.trim() || undefined,
      nagarikId: editNagarikId.trim() || undefined,
    });
    setActionError(null);
    setStatusMessage(isNe ? 'प्रोफाइल विवरण सुरक्षित गरियो।' : 'Profile details saved to your account.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleExportJson = () => {
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
          ? 'प्रमाणीकरण इमेल पुनः पठाइएको छ। कृपया इनबक्स वा स्प्याम जाँच गर्नुहोस्।'
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
        setStatusMessage(isNe ? 'इमेल प्रमाणित भयो र क्लाउड सिङ्क सुरु भयो।' : 'Email verified. Cloud sync is now active.');
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
      setActionError(err?.message || 'Migration failed. Your original browser data remains intact.');
    } finally {
      setBusyAction(null);
    }
  };

  const handleResetDashboardLayout = async () => {
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

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 sm:py-8 space-y-6 pb-24">
      <SectionHeader title={t.account.title} subtitle={t.account.subtitle} />

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {(actionError || syncError) && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{actionError || syncError}</span>
        </div>
      )}

      {/* Primary Identity & Sync Card */}
      <Card className="p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[#0B1F3A] dark:bg-blue-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
              {userProfile.isLoggedIn && userProfile.name
                ? userProfile.name.charAt(0).toUpperCase()
                : <User className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-semibold text-[#0B1F3A] dark:text-white truncate">
                  {userProfile.isLoggedIn ? userProfile.name : t.account.signedOutTitle}
                </h2>
                <span className="px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">
                  {accountModeLabel}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {userProfile.isLoggedIn ? userProfile.email : t.account.signedOutDesc}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <SyncStatusBadge
              status={syncStatus}
              pendingCount={pendingCount}
              conflictCount={conflicts.length}
              onClick={() => (conflicts.length > 0 ? onOpenConflicts() : void triggerManualSync())}
            />
            {userProfile.isLoggedIn ? (
              <Button variant="secondary" size="sm" onClick={() => void signOutAll()}>
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.account.signOutBtn}</span>
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={onOpenAuthModal}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.account.signInBtn}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Metrics Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block">{isNe ? 'डिजिटल भल्ट' : 'Vault Docs'}</span>
            <span className="text-base font-bold font-mono tabular-nums text-[#0B1F3A] dark:text-white mt-0.5 block">
              {vaultDocs.length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block">{isNe ? 'रिमाइन्डरहरू' : 'Reminders'}</span>
            <span className="text-base font-bold font-mono tabular-nums text-[#0B1F3A] dark:text-white mt-0.5 block">
              {keeperItems.length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block">{isNe ? 'सर्टकटहरू' : 'Pinned Shortcuts'}</span>
            <span className="text-base font-bold font-mono tabular-nums text-[#0B1F3A] dark:text-white mt-0.5 block">
              {visibleShortcuts.length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1220] border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block">{isNe ? 'अन्तिम सिङ्क' : 'Last Synced'}</span>
            <span className="text-xs font-mono tabular-nums font-semibold text-[#0B1F3A] dark:text-white mt-1 block truncate">
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

        {/* Verification Required Callout */}
        {firebaseUser && !isCloudSyncVerified && (
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/30 space-y-2.5 text-xs">
            <p className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <MailCheck className="w-4 h-4" />
              <span>{t.account.verificationPending}</span>
            </p>
            <p className="text-amber-800 dark:text-amber-300">
              {isNe
                ? 'तपाईँको लोकल डेटा सुरक्षित छ। क्लाउड सिङ्क र अन्य डिभाइससँग जोड्न कृपया इमेल प्रमाणीकरण पूरा गर्नुहोस्।'
                : 'Your edits are safely queued in offline storage. Verify your email address to activate multi-device Firestore sync.'}
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

        {/* Sync Actions Row */}
        <div className="flex flex-wrap items-center gap-2.5">
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
      </Card>

      {/* Legacy Migration Callout */}
      {hasPendingLegacyMigration && (
        <Card className="p-5 border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/25 space-y-3 text-xs">
          <p className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <CloudUpload className="w-4 h-4" />
            <span>{isNe ? 'पुरानो ब्राउजर डेटा फेला पर्यो' : 'Legacy Local Storage Data Detected'}</span>
          </p>
          <p className="text-amber-800 dark:text-amber-300">
            {isNe
              ? 'ब्याकअप सुरक्षित राखी पुराना कागजात र रिमाइन्डरहरू IndexedDB र क्लाउड सिङ्कमा सार्नुहोस्।'
              : 'Import existing local storage records into IndexedDB and Cloud Sync with automatic JSON backup protection.'}
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
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Details */}
        <Card className="p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[#0B1F3A] dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{isNe ? 'नागरिक प्रोफाइल विवरण' : 'Citizen Profile Details'}</span>
          </h3>

          {userProfile.isLoggedIn ? (
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    {isNe ? 'मोबाइल नम्बर' : 'Mobile Number'}
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full control-field font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    {isNe ? 'नागरिक आईडी (वैकल्पिक)' : 'Nagarik ID (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={editNagarikId}
                    onChange={(e) => setEditNagarikId(e.target.value)}
                    placeholder="Optional ID"
                    className="w-full control-field font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <Button type="submit" variant="primary" size="sm">
                  {t.actions.save}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-3">
              <p>
                {isNe
                  ? 'प्रोफाइल विवरण सुरक्षित गर्न र सबै डिभाइसमा सिङ्क गर्न साइन इन गर्नुहोस्।'
                  : 'Sign in to save personal contact metadata and synchronize your Digital Vault across Web and Android.'}
              </p>
              <Button variant="secondary" size="sm" onClick={onOpenAuthModal}>
                {t.account.signInBtn}
              </Button>
            </div>
          )}
        </Card>

        {/* Appearance, Language & APK Sync */}
        <Card className="p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[#0B1F3A] dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{t.account.preferences}</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium text-slate-700 dark:text-slate-300">{t.theme.label}</span>
              <ThemeModeSelector />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {isNe ? 'प्रदर्शन भाषा' : 'Display Language'}
              </span>
              <Button variant="secondary" size="sm" onClick={onToggleLang}>
                <Globe className="w-3.5 h-3.5" />
                <span>{currentLang === 'en' ? 'English → नेपाली' : 'नेपाली → English'}</span>
              </Button>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {t.account.devanagariDigits}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={devanagariNumerals}
                onClick={onToggleDevanagariNumerals}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                  devanagariNumerals ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    devanagariNumerals ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {t.account.apkSyncSettings}
              </span>
              <Button variant="secondary" size="sm" onClick={() => openAppSyncModal()}>
                <Smartphone className="w-3.5 h-3.5" />
                <span>{isNe ? 'अपडेट जाँच गर्नुहोस्' : 'Check for Update'}</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Shortcuts & Layout */}
        <Card className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-[#0B1F3A] dark:text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{t.account.savedShortcuts}</span>
            </h3>
            <button
              type="button"
              onClick={() => void handleResetDashboardLayout()}
              className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-[#0B1F3A] dark:hover:text-white inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isNe ? 'लेआउट रिसेट' : 'Reset Home Layout'}</span>
            </button>
          </div>

          {visibleShortcuts.length > 0 ? (
            <ul className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              {visibleShortcuts.map((item) => (
                <li key={item.id} className="py-2.5 flex items-center justify-between gap-2">
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
                    className="text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 text-[11px] font-medium cursor-pointer"
                  >
                    {isNe ? 'हटाउनुहोस्' : 'Remove'}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isNe
                ? 'गृहपृष्ठबाट कुनै पनि सेवा बुकमार्क गर्नुहोस् र यहाँ तथा अन्य डिभाइसमा छिटो पहुँच पाउनुहोस्।'
                : 'Bookmark any service card from Home to synchronize your personal shortcuts across devices.'}
            </p>
          )}
        </Card>

        {/* Linked Devices */}
        <Card className="p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-semibold text-[#0B1F3A] dark:text-white flex items-center gap-2">
            <Laptop className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>
              {t.account.linkedDevices} ({linkedDevices.length})
            </span>
          </h3>

          {linkedDevices.length > 0 ? (
            <ul className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              {linkedDevices.map((dev) => (
                <li key={dev.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-[#0B1F3A] dark:text-white truncate">
                      {dev.deviceLabel} · {dev.platform}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      v{dev.appVersion} · {dev.revoked ? 'Revoked' : dev.lastSyncState}
                    </p>
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
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isCloudSyncVerified
                ? isNe
                  ? 'सिङ्क पूरा भएपछि सक्रिय डिभाइसहरू यहाँ देखिनेछन्।'
                  : 'Active sessions appear here after cloud verification syncs.'
                : isNe
                ? 'डिभाइस सूची र सेसन नियन्त्रणका लागि प्रमाणित क्लाउड खाताबाट साइन इन गर्नुहोस्।'
                : 'Sign in with a verified cloud account to view linked Web, PWA, and Android APK sessions.'}
            </p>
          )}
        </Card>
      </div>

      {/* Data Portability, Legal & Account Deletion */}
      <Card className="p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[#0B1F3A] dark:text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{t.account.dataPortability}</span>
        </h3>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Button variant="secondary" size="sm" onClick={handleExportJson}>
            <Download className="w-3.5 h-3.5" />
            <span>{t.account.exportJson}</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onNavigateTab('vault')}>
            <FileText className="w-3.5 h-3.5" />
            <span>{t.nav.vault}</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onNavigateTab('about')}>
            <span>{t.footer.about}</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onNavigateTab('roadmap')}>
            <span>{isNe ? 'रोडम्याप' : 'Roadmap'}</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onNavigateTab('contact')}>
            <span>{isNe ? 'सम्पर्क' : 'Contact'}</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onNavigateTab('privacy')}>
            <span>{t.footer.privacy}</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onNavigateTab('terms')}>
            <span>{t.footer.terms}</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onNavigateTab('support')}>
            <span>{t.footer.support}</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onNavigateTab('donate')}>
            <span>{t.footer.donate}</span>
          </Button>
          <Button variant="danger" size="sm" onClick={() => onNavigateTab('account-deletion')}>
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.footer.accountDeletion}</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};
