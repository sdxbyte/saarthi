import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Languages, Sun, Moon, Menu, User, ShieldCheck, RefreshCw, CloudCheck, CheckCircle2, Zap, Palette, Command, Database, ChevronDown, Download, Loader2, Clock, Calendar, Globe, MapPin } from 'lucide-react';
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
  theme,
  onToggleTheme,
  onOpenThemeModal,
  onToggleSidebar,
  userProfile,
  onOpenAuthModal,
  onOpenAdminModal,
  isSyncingData = false,
  syncStatusText = 'Syncing Tax & Gov Data...',
  lastSyncedAt = 'Just now',
  onTriggerSync,
}) => {
  const { timeState, selectedTimeZone, setSelectedTimeZone } = useGlobalTime();

  const navItems = [
    { id: 'dashboard', labelEn: 'Home', labelNp: 'गृह पृष्ठ' },
    { id: 'services', labelEn: 'Services', labelNp: 'नागरिक सेवा' },
    { id: 'nepse', labelEn: 'Finance', labelNp: 'वित्त तथा सेयर' },
    { id: 'vault', labelEn: 'Documents', labelNp: 'कागजात भल्ट' },
    { id: 'loksewa', labelEn: 'Civic & Jobs', labelNp: 'सरकारी तथा रोजगार' },
    { id: 'calendar', labelEn: 'Tools & Calendar', labelNp: 'पात्रो र औजार' },
    { id: 'support', labelEn: 'Account & Support', labelNp: 'खाता र सहायता' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0b0d] border-b border-[#262a31]">
      {/* Top Live Ticker / Date & Time Bar */}
      <div className="bg-[#14161b] border-b border-[#262a31] px-4 py-1.5 text-xs text-[#8b909b] flex items-center justify-between font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#00e599]">
            <span className="strix-live-dot" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">LIVE SAARTHI STATE</span>
          </div>
          <span className="text-[#262a31]">|</span>
          <div className="flex items-center gap-1 text-[#edeef0]">
            <Calendar className="w-3.5 h-3.5 text-[#00e599]" />
            <span>{currentLang === 'ne' ? timeState.bsFormattedNp : timeState.bsFormattedEn}</span>
            <span className="text-[#8b909b] text-[10px]">({timeState.adDateFormatted})</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[#edeef0]">
            <Clock className="w-3.5 h-3.5 text-[#00e599]" />
            <span className="font-bold">{timeState.time12h}</span>
            <span className="text-[#8b909b] text-[10px]">({timeState.tzAbbrev})</span>
          </div>
          <span className="hidden sm:inline text-[#262a31]">|</span>
          <div className="flex items-center gap-1 text-[#8b909b]">
            <MapPin className="w-3 h-3 text-[#00e599]" />
            <select
              value={selectedTimeZone}
              onChange={(e) => setSelectedTimeZone(e.target.value)}
              className="bg-transparent text-[#edeef0] text-[11px] focus:outline-none cursor-pointer font-mono"
            >
              {SUPPORTED_TIMEZONES.map((tz) => (
                <option key={tz.iana} value={tz.iana} className="bg-[#14161b] text-[#edeef0]">
                  {tz.flag} {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle + Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg bg-[#14161b] border border-[#262a31] text-[#8b909b] hover:text-[#edeef0] hover:border-[#8b909b]"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button onClick={() => setActiveTab('dashboard')} className="flex items-center gap-2.5 text-left group">
            <div className="w-8 h-8 rounded-lg bg-[#00e599]/10 border border-[#00e599]/30 flex items-center justify-center group-hover:border-[#00e599] transition-all">
              <Zap className="w-4 h-4 text-[#00e599]" />
            </div>
            <div>
              <div className="font-display font-extrabold text-base tracking-tight text-[#edeef0] group-hover:text-[#00e599] transition-colors flex items-center gap-1">
                SAARTHI <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#00e599]/10 text-[#00e599] border border-[#00e599]/20 rounded">v1.4.7</span>
              </div>
              <p className="text-[10px] text-[#8b909b] font-mono leading-none hidden sm:block">Civic Data Infrastructure</p>
            </div>
          </button>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#14161b] p-1 rounded-lg border border-[#262a31]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1b1e24] text-[#00e599] border border-[#262a31] shadow-sm font-mono'
                    : 'text-[#8b909b] hover:text-[#edeef0] hover:bg-[#1b1e24]/50'
                }`}
              >
                {currentLang === 'ne' ? item.labelNp : item.labelEn}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions (Search, Language, Ghost + Solid CTAs) */}
        <div className="flex items-center gap-2">
          {/* Quick Command / Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#14161b] border border-[#262a31] text-[#8b909b] hover:text-[#edeef0] hover:border-[#8b909b] text-xs font-mono transition-all"
            title="Search Platform"
          >
            <Search className="w-3.5 h-3.5 text-[#00e599]" />
            <span>Search...</span>
            <kbd className="raycast-kbd ml-1">⌘K</kbd>
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="px-2.5 py-1.5 rounded-lg bg-[#14161b] border border-[#262a31] text-[#8b909b] hover:text-[#edeef0] font-mono text-xs font-bold transition-all flex items-center gap-1"
            title="Toggle Language"
          >
            <Languages className="w-3.5 h-3.5 text-[#00e599]" />
            <span>{currentLang === 'ne' ? 'NE' : 'EN'}</span>
          </button>

          {/* Auth / Account Solid CTA */}
          {userProfile?.isLoggedIn ? (
            <button
              onClick={onOpenAuthModal}
              className="strix-btn-ghost border-[#00e599]/30 text-[#00e599] flex items-center gap-2"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#00e599]" />
              <span className="truncate max-w-[80px]">
                {userProfile.name ? userProfile.name.split(' ')[0] : 'User'}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="strix-btn-primary flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
});

