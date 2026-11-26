import React from 'react';
import { Building2, Calendar, Home, TrendingUp, User } from 'lucide-react';
import { SupportedLanguage } from '../../i18n/translations';
import { useOptionalLanguage } from '../../context/LanguageContext';
import { triggerHaptic } from '../../utils/appFeedback';

interface MobileBottomNavProps {
  activeTab: string;
  currentLang: SupportedLanguage;
  isLoggedIn: boolean;
  onSelectTab: (tab: string) => void;
  onOpenAccount: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  currentLang,
  isLoggedIn,
  onSelectTab,
  onOpenAccount,
}) => {
  const { t } = useOptionalLanguage(currentLang);

  const isSectionActive = (id: string) => {
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
      return [
        'account',
        'about',
        'vision',
        'roadmap',
        'contact',
        'terms',
        'privacy',
        'support',
        'donate',
        'account-deletion',
      ].includes(activeTab);
    }
    return false;
  };

  const items = [
    {
      id: 'home',
      label: currentLang === 'ne' ? 'गृह' : t.nav.home,
      icon: Home,
      action: () => onSelectTab('home'),
    },
    {
      id: 'services',
      label: currentLang === 'ne' ? 'सेवा' : t.nav.services,
      icon: Building2,
      action: () => onSelectTab('services'),
    },
    {
      id: 'finance',
      label: currentLang === 'ne' ? 'वित्त' : t.nav.finance,
      icon: TrendingUp,
      action: () => onSelectTab('finance'),
    },
    {
      id: 'calendar',
      label: currentLang === 'ne' ? 'पात्रो' : t.nav.calendar,
      icon: Calendar,
      action: () => onSelectTab('calendar'),
    },
    {
      id: 'account',
      label: isLoggedIn
        ? t.nav.account
        : currentLang === 'ne'
          ? 'खाता'
          : t.nav.account,
      icon: User,
      action: onOpenAccount,
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0B1628]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_rgba(11,31,58,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.35)]"
    >
      <div className="grid grid-cols-5 h-16">
        {items.map((item) => {
          const active = isSectionActive(item.id);
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                triggerHaptic('light');
                item.action();
              }}
              className={`relative min-h-[48px] flex flex-col items-center justify-center gap-1 px-1 transition-all duration-150 active:scale-95 cursor-pointer ${
                active
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-[#0B1F3A] dark:hover:text-slate-200'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 w-8 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400"
                />
              )}
              <Icon className={`w-5 h-5 shrink-0 transition-transform ${active ? 'scale-105' : ''}`} />
              <span className="text-[11px] leading-none truncate max-w-full whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
