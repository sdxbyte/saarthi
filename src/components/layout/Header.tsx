import React from 'react';
import { Search, Sparkles, Languages, Menu, User, ShieldCheck, Clock, Calendar, MapPin } from 'lucide-react';
import { UserProfile } from '../../types';
import { useGlobalTime } from '../../context/GlobalTimeContext';
import { SUPPORTED_TIMEZONES } from '../../utils/timeCalendarEngine';
import { SaarthiLogo } from '../brand/SaarthiLogo';

interface HeaderProps {
  currentLang: 'en' | 'ne';
  onToggleLang: () => void;
  onOpenSearch: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenThemeModal?: () => void;
  onToggleSidebar: () => void;
  userProfile?: UserProfile;
  onOpenAuthModal?: () => void;
  onOpenAdminModal?: () => void;
  onOpenSajiloTray?: () => void;

  // Global Background Sync Props
  isSyncingData?: boolean;
  syncStatusText?: string;
  lastSyncedAt?: string;
  onTriggerSync?: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(({
  currentLang,
  onToggleLang,
  onOpenSearch,
  activeTab,
  setActiveTab,
  onToggleSidebar,
  userProfile,
  onOpenAuthModal,
  onOpenSajiloTray,
}) => {
  const { timeState, selectedTimeZone, setSelectedTimeZone } = useGlobalTime();

  const navItems = [
    { id: 'dashboard', labelEn: 'Overview', labelNp: 'गृह' },
    { id: 'sajilo', labelEn: 'Sajilo Hub', labelNp: 'दैनिक' },
    { id: 'services', labelEn: 'Services', labelNp: 'सेवाहरू' },
    { id: 'nepse', labelEn: 'Finance & NEPSE', labelNp: 'सेयर तथा वित्त' },
    { id: 'vault', labelEn: 'Documents', labelNp: 'कागजात' },
    { id: 'loksewa', labelEn: 'Civic & Jobs', labelNp: 'रोजगार' },
    { id: 'calendar', labelEn: 'Patro & Tools', labelNp: 'पात्रो' },
    { id: 'support', labelEn: 'Support', labelNp: 'सहायता' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full header-bar border-b border-[var(--color-divider)] bg-[var(--color-chrome)] transition-colors">
      {/* Top Live Ticker / Date & Time Bar */}
      <div className="border-b border-[var(--color-divider)] px-3 sm:px-6 py-1 text-[11px] text-[var(--color-text-secondary)] flex items-center justify-between font-mono bg-[var(--color-chrome)]">
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
          <div className="flex items-center gap-1.5 text-[var(--color-accent-mark)] shrink-0">
            <span className="live-status-dot" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">LIVE SAARTHI</span>
          </div>
          <span className="text-[var(--color-border)]">|</span>
          <div className="flex items-center gap-1 text-[var(--color-text)] truncate font-medium">
            <Calendar className="w-3.5 h-3.5 text-[var(--color-accent-mark)] shrink-0" />
            <span className="truncate">{currentLang === 'ne' ? timeState.bsFormattedNp : timeState.bsFormattedEn}</span>
            <span className="text-[var(--color-text-muted)] text-[10px] hidden sm:inline">({timeState.adDateFormatted})</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 text-[var(--color-text)]">
            <Clock className="w-3.5 h-3.5 text-[var(--color-accent-mark)]" />
            <span className="font-semibold">{timeState.time12h}</span>
            <span className="text-[var(--color-text-muted)] text-[10px]">({timeState.tzAbbrev})</span>
          </div>
          <span className="hidden md:inline text-[var(--color-border)]">|</span>
          <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
            <MapPin className="w-3 h-3 text-[var(--color-accent-mark)]" />
            <select
              value={selectedTimeZone}
              onChange={(e) => setSelectedTimeZone(e.target.value)}
              className="bg-transparent text-[var(--color-text)] text-[11px] focus:outline-none cursor-pointer font-mono font-medium"
            >
              {SUPPORTED_TIMEZONES.map((tz) => (
                <option key={tz.iana} value={tz.iana} className="bg-[var(--color-surface)] text-[var(--color-text)]">
                  {tz.flag} {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-13 sm:h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Menu Toggle + Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-[6px] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-all cursor-pointer"
            title="Toggle Menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <button onClick={() => setActiveTab('dashboard')} className="flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer">
            <SaarthiLogo variant="compact" size={30} />
            <div>
              <div className="font-semibold text-sm sm:text-base tracking-tight text-[var(--color-text)] group-hover:text-[var(--color-accent-mark)] transition-colors flex items-center gap-1.5">
                SAARTHI
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[var(--color-accent-muted)] text-[var(--color-accent-mark)] border border-[var(--color-accent-mark)]/25 rounded-[4px] font-medium">
                  v1.7.0
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Center: macOS Segmented Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-0.5 bg-[var(--color-surface)] p-1 rounded-[8px] border border-[var(--color-border)]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--color-surface-hover)] text-[var(--color-accent-mark)] border border-[var(--color-border)] shadow-xs font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]/60'
                }`}
              >
                {currentLang === 'ne' ? item.labelNp : item.labelEn}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] text-xs font-mono transition-all cursor-pointer"
            title="Search Platform (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-[var(--color-accent-mark)]" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="ml-1 hidden md:inline-flex px-1.5 py-0.5 rounded-[4px] bg-[var(--color-control-bg)] border border-[var(--color-control-border)] text-[10px] text-[var(--color-text-muted)] font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Sajilo Quick Tray Trigger */}
          {onOpenSajiloTray && (
            <button
              onClick={onOpenSajiloTray}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-[6px] bg-[var(--color-accent-muted)] hover:bg-[var(--color-accent-muted)]/80 border border-[var(--color-accent-mark)]/30 text-[var(--color-accent-mark)] text-xs font-medium transition-all cursor-pointer"
              title="Sajilo Quick Tray (Bazar, Radio, Keeper, Weather) [Alt+S]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent-mark)]" />
              <span className="hidden sm:inline">Tray</span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="px-2 sm:px-2.5 py-1.5 rounded-[6px] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] font-mono text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
            title="Toggle Language"
          >
            <Languages className="w-3.5 h-3.5 text-[var(--color-accent-mark)]" />
            <span>{currentLang === 'ne' ? 'NE' : 'EN'}</span>
          </button>

          {/* Citizen Auth CTA */}
          {userProfile?.isLoggedIn ? (
            <button
              onClick={onOpenAuthModal}
              className="px-2.5 sm:px-3 py-1.5 rounded-[6px] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-accent-mark)] text-xs font-medium flex items-center gap-1.5 transition-all hover:bg-[var(--color-surface-hover)] cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-positive)]" />
              <span className="truncate max-w-[60px] sm:max-w-[80px]">
                {userProfile.name ? userProfile.name.split(' ')[0] : 'Citizen'}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-2.5 sm:px-3 py-1.5 rounded-[6px] bg-[var(--color-accent-fill)] text-[var(--color-accent-ink)] hover:opacity-90 text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
});
