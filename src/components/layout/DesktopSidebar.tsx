import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Compass,
  FolderLock,
  Globe,
  Home,
  Info,
  Smartphone,
  TrendingUp,
  User,
  Wrench,
} from 'lucide-react';
import { SupportedLanguage } from '../../i18n/translations';
import { useOptionalLanguage } from '../../context/LanguageContext';
import { ThemeModeSelector } from '../common/ThemeModeSelector';
import { isNativeAndroidShell } from '../../utils/apiClient';
import { openAppSyncModal } from '../common/AppUpdateChecker';

export interface DesktopSidebarProps {
  activeTab: string;
  currentLang: SupportedLanguage;
  onToggleLang: () => void;
  onSelectTab: (tab: string) => void;
  onOpenAccount: () => void;
  isLoggedIn?: boolean;
  userName?: string;
}

const SIDEBAR_STORAGE_KEY = 'saarthi_sidebar_collapsed_v2';

function readInitialCollapsed(): boolean {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
    }
  } catch {
    // ignore storage errors
  }
  return false;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeTab,
  currentLang,
  onToggleLang,
  onSelectTab,
  onOpenAccount,
  isLoggedIn = false,
  userName,
}) => {
  const { t } = useOptionalLanguage(currentLang);
  const [collapsed, setCollapsed] = useState<boolean>(readInitialCollapsed);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
        }
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const isPrimaryActive = (id: string) => {
    if (id === 'home') return activeTab === 'home' || activeTab === 'dashboard';
    if (id === 'services') {
      return ['services', 'loksewa', 'devtrack', 'explore', 'modules'].includes(activeTab);
    }
    if (id === 'finance') {
      return ['finance', 'nepse', 'forex', 'gold', 'fuel', 'tax', 'ird', 'emi', 'receipt'].includes(activeTab);
    }
    if (id === 'calendar') {
      return ['calendar', 'rashifal'].includes(activeTab);
    }
    if (id === 'account') {
      return activeTab === 'account';
    }
    return false;
  };

  const primaryItems = [
    {
      id: 'home',
      label: t.nav.home,
      icon: Home,
      action: () => onSelectTab('home'),
    },
    {
      id: 'services',
      label: t.nav.services,
      icon: Building2,
      action: () => onSelectTab('services'),
    },
    {
      id: 'finance',
      label: t.nav.finance,
      icon: TrendingUp,
      action: () => onSelectTab('finance'),
    },
    {
      id: 'calendar',
      label: t.nav.calendar,
      icon: Calendar,
      action: () => onSelectTab('calendar'),
    },
    {
      id: 'account',
      label: isLoggedIn && userName ? userName.split(' ')[0] : t.nav.account,
      icon: User,
      action: onOpenAccount,
    },
  ];

  const secondaryItems = [
    {
      id: 'tools',
      label: t.nav.tools,
      icon: Wrench,
      active: ['tools', 'bluebook', 'links', 'sitehub', 'public-apis', 'osint4all'].includes(activeTab),
    },
    {
      id: 'vault',
      label: t.nav.vault,
      icon: FolderLock,
      active: activeTab === 'vault',
    },
    {
      id: 'sajilo',
      label: t.nav.sajilo,
      icon: Compass,
      active: activeTab === 'sajilo',
    },
    {
      id: 'about',
      label: t.nav.about,
      icon: Info,
      active: ['about', 'vision', 'roadmap', 'terms', 'privacy', 'contact', 'support', 'donate', 'account-deletion'].includes(activeTab),
    },
  ];

  return (
    <aside
      aria-label="Desktop Navigation Sidebar"
      data-collapsed={collapsed ? 'true' : 'false'}
      className={`hidden md:flex flex-col shrink-0 sticky top-0 h-[100dvh] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1628] transition-[width] duration-200 select-none z-30 ${
        collapsed ? 'w-[74px]' : 'w-[248px]'
      }`}
    >
      {/* Sidebar Brand & Collapse Toggle */}
      <div className="h-16 px-3.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className={`flex items-center gap-2.5 min-w-0 cursor-pointer text-left ${
            collapsed ? 'justify-center w-full' : ''
          }`}
          title="SAARTHI"
        >
          <span className="w-9 h-9 rounded-xl bg-[#0B1F3A] dark:bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
            S
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <span className="block text-base font-bold tracking-tight text-[#0B1F3A] dark:text-white leading-none">
                {t.brand}
              </span>
              <span className="block text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate mt-1">
                {t.tagline}
              </span>
            </div>
          )}
        </button>

        {!collapsed && (
          <button
            type="button"
            onClick={toggleCollapsed}
            className="min-h-[36px] min-w-[36px] rounded-lg text-slate-500 hover:text-[#0B1F3A] dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label={t.nav.collapseSidebar}
            title={t.nav.collapseSidebar}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <div className="px-2 pt-2.5 flex justify-center">
          <button
            type="button"
            onClick={toggleCollapsed}
            className="min-h-[36px] w-full rounded-lg text-slate-500 hover:text-[#0B1F3A] dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label={t.nav.expandSidebar}
            title={t.nav.expandSidebar}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary 5 Unified Destinations */}
      <nav aria-label="Primary Sidebar Navigation" className="flex-1 overflow-y-auto px-2.5 py-4 space-y-5">
        <div className="space-y-1">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const active = isPrimaryActive(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                title={item.label}
                aria-current={active ? 'page' : undefined}
                className={`w-full min-h-[42px] px-3 rounded-xl flex items-center gap-3 text-sm transition-colors cursor-pointer whitespace-nowrap ${
                  collapsed ? 'justify-center px-0' : ''
                } ${
                  active
                    ? 'bg-[#0B1F3A] text-white dark:bg-blue-600/20 dark:text-blue-300 dark:border dark:border-blue-500/30 font-semibold shadow-xs dark:shadow-none'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-[#0B1F3A] dark:hover:text-white font-medium'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Utilities & Vault Quick Access */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
          {!collapsed && (
            <span className="px-3 pb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t.nav.quickAccess}
            </span>
          )}
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                title={item.label}
                aria-current={item.active ? 'page' : undefined}
                className={`w-full min-h-[38px] px-3 rounded-lg flex items-center gap-3 text-xs transition-colors cursor-pointer whitespace-nowrap ${
                  collapsed ? 'justify-center px-0' : ''
                } ${
                  item.active
                    ? 'bg-slate-100 dark:bg-slate-800 text-[#0B1F3A] dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-[#0B1F3A] dark:hover:text-white font-medium'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Controls: Theme Mode (Light/Dark/System), Language & App Sync */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5 bg-slate-50/70 dark:bg-[#080F1D]">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <ThemeModeSelector compact />
            <button
              type="button"
              onClick={onToggleLang}
              className="min-h-[38px] min-w-[40px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
              title={t.header.languageToggle}
              aria-label={`Switch language to ${t.header.languageToggle}`}
            >
              {currentLang === 'en' ? 'ने' : 'EN'}
            </button>
          </div>
        ) : (
          <>
            <ThemeModeSelector />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleLang}
                className="flex-1 min-h-[36px] px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{t.header.languageToggle}</span>
              </button>
              <button
                type="button"
                onClick={() => openAppSyncModal()}
                className="min-h-[36px] min-w-[36px] px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center justify-center transition-colors cursor-pointer"
                title={isNativeAndroidShell() ? t.footer.apkSelfUpdate : t.footer.apkUpdate}
                aria-label={isNativeAndroidShell() ? t.footer.apkSelfUpdate : t.footer.apkUpdate}
              >
                <Smartphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
