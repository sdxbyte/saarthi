import React, { useState } from 'react';
import {
  ArrowLeft,
  Compass,
  FolderLock,
  Globe,
  Menu,
  Moon,
  Search,
  Smartphone,
  Sun,
  User,
  Wrench,
  X,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { useGlobalTime } from '../../context/GlobalTimeContext';
import { useTheme } from '../../context/ThemeContext';
import { useSyncAuth } from '../../context/SyncAuthContext';
import { useOptionalLanguage } from '../../context/LanguageContext';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { SyncStatusBadge } from '../common/SyncStatusBadge';
import { ThemeModeSelector } from '../common/ThemeModeSelector';
import { isNativeAndroidShell } from '../../utils/apiClient';
import { openAppSyncModal } from '../common/AppUpdateChecker';
import { getTabScreenMeta, triggerHaptic } from '../../utils/appFeedback';

interface EditorialHeaderProps {
  currentLang: 'en' | 'ne';
  onToggleLang: () => void;
  onOpenSearch: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile?: UserProfile;
  onOpenAuthModal?: () => void;
  onOpenSajiloTray?: () => void;
  onOpenConflicts?: () => void;
}

export const EditorialHeader: React.FC<EditorialHeaderProps> = ({
  currentLang,
  onToggleLang,
  onOpenSearch,
  activeTab,
  setActiveTab,
  userProfile,
  onOpenAuthModal,
  onOpenConflicts,
}) => {
  const { timeState } = useGlobalTime();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { syncStatus, pendingCount, conflicts, triggerManualSync } = useSyncAuth();
  const { t } = useOptionalLanguage(currentLang);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const isNativeApk = isNativeAndroidShell();
  const isHomeTab = activeTab === 'home' || activeTab === 'dashboard';
  const screenMeta = getTabScreenMeta(activeTab);
  const screenTitle = currentLang === 'ne' ? screenMeta.titleNe : screenMeta.titleEn;

  const secondaryRoutes = [
    { id: 'tools', label: t.nav.tools, icon: Wrench },
    { id: 'vault', label: t.nav.vault, icon: FolderLock },
    { id: 'sajilo', label: t.nav.sajilo, icon: Compass },
  ];

  const handleSyncClick = () => {
    triggerHaptic('light');
    if (conflicts.length > 0 && onOpenConflicts) {
      onOpenConflicts();
      return;
    }
    void triggerManualSync();
  };

  const handleNativeBack = () => {
    triggerHaptic('light');
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
      return;
    }
    setActiveTab(screenMeta.parentTab || 'home');
  };

  return (
    <>
      {/* Web Dual BS/AD Date Bar — Hidden inside Native Android APK so it feels like a genuine mobile app */}
      {!isNativeApk && (
        <div className="w-full bg-[#0B1F3A] text-slate-200 px-4 sm:px-6 lg:px-8 py-1.5 text-[11px] font-mono flex items-center justify-between gap-3 border-b border-[#102A4C]">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="font-semibold text-white whitespace-nowrap">
              {currentLang === 'ne' ? timeState.bsFormattedNp : timeState.bsFormattedEn}
            </span>
            <span aria-hidden="true" className="text-slate-400 hidden sm:inline">
              ·
            </span>
            <span className="text-slate-300 hidden sm:inline whitespace-nowrap">
              {timeState.adDateFormatted} AD
            </span>
            <span aria-hidden="true" className="text-slate-400 hidden lg:inline">
              ·
            </span>
            <span className="text-slate-300 hidden lg:inline whitespace-nowrap">
              {t.header.kathmanduTz}
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="tabular-nums text-white whitespace-nowrap">
              {timeState.time12h}
            </span>
            <span aria-hidden="true" className="text-slate-500">
              |
            </span>
            <button
              type="button"
              onClick={onToggleLang}
              className="text-blue-200 hover:text-white transition-colors cursor-pointer text-[11px] font-semibold whitespace-nowrap shrink-0"
              title="Switch Language"
            >
              {t.header.languageToggle}
            </button>
          </div>
        </div>
      )}

      {/* Streamlined Sticky Top AppBar */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#0B1628]/95 backdrop-blur-md pt-[env(safe-area-inset-top)]">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between gap-2.5">
          {/* Left: Native Back + Screen Title on APK sub-views, or App Mark on Home */}
          {isNativeApk && !isHomeTab ? (
            <div className="md:hidden flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={handleNativeBack}
                className="min-h-[42px] min-w-[42px] rounded-xl text-[#0B1F3A] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shrink-0"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <span className="block text-sm font-bold tracking-tight text-[#0B1F3A] dark:text-white truncate">
                  {screenTitle}
                </span>
                <span className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate tabular-nums">
                  {currentLang === 'ne' ? timeState.bsFormattedNp : timeState.bsFormattedEn}
                </span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setActiveTab('home');
              }}
              className="md:hidden flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0 min-w-0"
            >
              <span className="w-8 h-8 rounded-xl bg-[#0B1F3A] dark:bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-xs shrink-0">
                S
              </span>
              <div className="text-left min-w-0">
                <span className="block text-sm font-bold tracking-tight text-[#0B1F3A] dark:text-white leading-tight">
                  {t.brand}
                </span>
                {isNativeApk && (
                  <span className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate leading-tight tabular-nums">
                    {currentLang === 'ne' ? timeState.bsFormattedNp : timeState.bsFormattedEn}
                  </span>
                )}
              </div>
            </button>
          )}

          {/* Desktop Global Search Input Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden md:flex items-center justify-between gap-3 w-full max-w-md min-h-[40px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] text-slate-500 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-600 hover:text-slate-700 dark:hover:text-slate-200 transition-colors text-xs cursor-pointer"
            aria-label="Open Global Search"
          >
            <span className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{t.header.searchPlaceholder}</span>
            </span>
            <kbd className="font-mono text-[10px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shrink-0">
              ⌘K
            </kbd>
          </button>

          {/* Right Utility Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
            <SyncStatusBadge
              status={syncStatus}
              pendingCount={pendingCount}
              conflictCount={conflicts.length}
              compact
              onClick={handleSyncClick}
            />

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onOpenSearch();
              }}
              className="md:hidden min-h-[40px] min-w-[40px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shrink-0"
              aria-label="Open Global Search"
              title="Search (Cmd+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                toggleTheme();
              }}
              className="md:hidden min-h-[40px] min-w-[40px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shrink-0"
              aria-label={resolvedTheme === 'dark' ? t.theme.switchToLight : t.theme.switchToDark}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#0B1F3A]" />
              )}
            </button>

            {!isNativeApk && <PWAInstallButton />}

            {!isNativeApk && (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="min-h-[40px] flex items-center gap-1.5 px-3 rounded-lg text-xs font-semibold bg-[#0B1F3A] hover:bg-[#102A4C] dark:bg-blue-600 dark:hover:bg-blue-500 text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
                title={userProfile?.isLoggedIn ? `Account (${userProfile.name})` : t.header.signIn}
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">
                  {userProfile?.isLoggedIn ? userProfile.name.split(' ')[0] : t.header.account}
                </span>
              </button>
            )}

            {isNativeApk && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onOpenAuthModal?.();
                }}
                className="hidden sm:flex min-h-[40px] items-center gap-1.5 px-3 rounded-xl text-xs font-semibold bg-[#0B1F3A] hover:bg-[#102A4C] dark:bg-blue-600 dark:hover:bg-blue-500 text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
                title={userProfile?.isLoggedIn ? `Account (${userProfile.name})` : t.header.signIn}
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>{userProfile?.isLoggedIn ? userProfile.name.split(' ')[0] : t.header.account}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                setMobileDrawerOpen((prev) => !prev);
              }}
              className="md:hidden min-h-[40px] min-w-[40px] rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shrink-0"
              aria-label="Open utilities and appearance drawer"
            >
              {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Quick Sheet Drawer */}
        {mobileDrawerOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1628] px-4 py-4 space-y-4 max-h-[calc(100dvh-7.5rem)] overflow-y-auto">
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                {t.nav.quickAccess}
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {secondaryRoutes.map((route) => {
                  const Icon = route.icon;
                  const active = activeTab === route.id;
                  return (
                    <button
                      key={route.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setActiveTab(route.id);
                        setMobileDrawerOpen(false);
                      }}
                      className={`min-h-[44px] px-3 rounded-xl flex items-center gap-3 text-sm text-left transition-colors cursor-pointer ${
                        active
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0B1F3A] dark:text-white font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>{route.label}</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    onToggleLang();
                    setMobileDrawerOpen(false);
                  }}
                  className="min-h-[44px] px-3 rounded-xl flex items-center justify-between gap-3 text-sm text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{currentLang === 'en' ? 'Switch to नेपाली' : 'Switch to English'}</span>
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {t.header.languageToggle}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setMobileDrawerOpen(false);
                    openAppSyncModal();
                  }}
                  className="min-h-[44px] px-3 rounded-xl flex items-center gap-3 text-sm text-left text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-200 dark:border-blue-900 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 shrink-0" />
                  <span>{isNativeApk ? t.footer.apkSelfUpdate : t.footer.apkUpdate}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                {t.theme.label}
              </span>
              <ThemeModeSelector />
            </div>
          </div>
        )}
      </header>
    </>
  );
};
