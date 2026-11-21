import React from 'react';
import { motion } from 'motion/react';
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
    { id: 'services', labelEn: 'Civic Directory', labelNp: 'सेवा निर्देशिका' },
    { id: 'sitehub', labelEn: 'All Sites Directory', labelNp: 'अल साइट हब' },
    { id: 'sajilo', labelEn: 'Sajilo Daily', labelNp: 'सजिलो' },
    { id: 'nepse', labelEn: 'NEPSE & Markets', labelNp: 'सेयर तथा वित्त' },
    { id: 'loksewa', labelEn: 'Lok Sewa', labelNp: 'लोक सेवा' },
    { id: 'calendar', labelEn: 'Patro Calendar', labelNp: 'पात्रो' },
    { id: 'support', labelEn: 'Help & FAQ', labelNp: 'सहायता' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full header-bar border-b border-slate-800/90 bg-[#0B0F17]/95 backdrop-blur-xl transition-colors">
      {/* Top Live Ticker / Date & Time Bar */}
      <div className="border-b border-slate-800/80 px-3 sm:px-6 py-1.5 text-[11px] text-slate-400 flex items-center justify-between font-mono bg-slate-950/70">
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
          <div className="flex items-center gap-1.5 text-emerald-400 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="font-bold uppercase tracking-wider text-[10px]">LIVE SAARTHI</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1 text-slate-200 truncate font-medium">
            <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{currentLang === 'ne' ? timeState.bsFormattedNp : timeState.bsFormattedEn}</span>
            <span className="text-slate-400 text-[10px] hidden sm:inline font-mono">({timeState.adDateFormatted})</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-white">{timeState.time12h}</span>
            <span className="text-slate-500 text-[10px]">({timeState.tzAbbrev})</span>
          </div>
          <span className="hidden md:inline text-slate-700">|</span>
          <div className="flex items-center gap-1 text-slate-400">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <select
              value={selectedTimeZone}
              onChange={(e) => setSelectedTimeZone(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-[11px] rounded-lg px-2 py-0.5 focus:outline-none focus:border-emerald-500/50 cursor-pointer font-mono font-medium"
            >
              {SUPPORTED_TIMEZONES.map((tz) => (
                <option key={tz.iana} value={tz.iana} className="bg-slate-900 text-slate-200">
                  {tz.flag} {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Menu Toggle + Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
            title="Toggle Menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <button onClick={() => setActiveTab('dashboard')} className="flex items-center gap-2.5 text-left group cursor-pointer">
            <SaarthiLogo variant="compact" size={32} />
            <div>
              <div className="font-bold text-sm sm:text-base tracking-tight text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                SAARTHI
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold">
                  v1.9.1
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Center: ai2.design Style Frosted Glass Spring Glider Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md shadow-inner">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="relative px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                {isActive && (
                  <motion.div
                    layoutId="headerNavGlider"
                    className="absolute inset-0 bg-slate-800/90 border border-slate-700/80 rounded-xl shadow-md"
                    transition={{ type: 'spring', bounce: 0.18, duration: 0.35 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors ${
                    isActive
                      ? 'text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {currentLang === 'ne' ? item.labelNp : item.labelEn}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-mono transition-all cursor-pointer shadow-sm"
            title="Search Platform (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="ml-1 hidden md:inline-flex px-1.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Sajilo Quick Tray Trigger */}
          {onOpenSajiloTray && (
            <button
              onClick={onOpenSajiloTray}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all cursor-pointer shadow-sm"
              title="Sajilo Quick Tray (Bazar, Radio, Keeper, Weather) [Alt+S]"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Tray</span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-mono text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
            title="Toggle Language"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentLang === 'ne' ? 'NE' : 'EN'}</span>
          </button>

          {/* Citizen Auth CTA */}
          {userProfile?.isLoggedIn ? (
            <button
              onClick={onOpenAuthModal}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-all hover:bg-slate-800 hover:border-slate-700 cursor-pointer shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[60px] sm:max-w-[80px]">
                {userProfile.name ? userProfile.name.split(' ')[0] : 'Citizen'}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
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
