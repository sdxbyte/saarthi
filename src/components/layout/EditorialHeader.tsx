import React, { useState } from 'react';
import { Search, User, Menu, X } from 'lucide-react';
import { UserProfile } from '../../types';
import { useGlobalTime } from '../../context/GlobalTimeContext';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface EditorialHeaderProps {
  currentLang: 'en' | 'ne';
  onToggleLang: () => void;
  onOpenSearch: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile?: UserProfile;
  onOpenAuthModal?: () => void;
  onOpenSajiloTray?: () => void;
}

export const EditorialHeader: React.FC<EditorialHeaderProps> = ({
  currentLang,
  onToggleLang,
  onOpenSearch,
  activeTab,
  setActiveTab,
  userProfile,
  onOpenAuthModal,
}) => {
  const { timeState } = useGlobalTime();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', labelEn: 'Home', labelNp: 'गृह' },
    { id: 'explore', labelEn: 'Explore', labelNp: 'अन्वेषण' },
    { id: 'finance', labelEn: 'Finance', labelNp: 'वित्त' },
    { id: 'tools', labelEn: 'Tools', labelNp: 'औजार' },
    { id: 'about', labelEn: 'About', labelNp: 'बारेमा' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  // Determine active state for parent sections
  const isLinkActive = (id: string) => {
    if (id === 'home') return activeTab === 'home' || activeTab === 'dashboard';
    if (id === 'explore') return activeTab === 'explore' || activeTab === 'modules';
    if (id === 'finance') {
      return ['finance', 'nepse', 'forex', 'gold', 'fuel', 'tax', 'ird', 'emi', 'receipt'].includes(activeTab);
    }
    if (id === 'tools') {
      return ['tools', 'calendar', 'bluebook', 'vault', 'sajilo', 'links', 'sitehub', 'public-apis', 'osint4all'].includes(activeTab);
    }
    if (id === 'about') {
      return ['about', 'vision', 'roadmap', 'terms', 'privacy', 'contact', 'support', 'donate', 'account-deletion'].includes(activeTab);
    }
    return activeTab === id;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090A0F]/90 backdrop-blur-md pt-[env(safe-area-inset-top)]">
      {/* Quiet Dual Date Meta Line (Master System Rule 2) */}
      <div className="border-b border-white/[0.04] px-4 sm:px-8 py-1 text-[11px] text-zinc-400 font-mono flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shrink-0" />
          <span className="text-zinc-200">
            {currentLang === 'ne' ? timeState.bsFormattedNp : timeState.bsFormattedEn}
          </span>
          <span className="text-zinc-500">·</span>
          <span className="text-zinc-400 hidden sm:inline">
            {timeState.adDateFormatted} AD
          </span>
          <span className="text-zinc-500 hidden sm:inline">·</span>
          <span className="text-zinc-400 hidden md:inline">
            Kathmandu (UTC +05:45)
          </span>
        </div>

        <div className="flex items-center gap-3 text-zinc-400 shrink-0">
          <span className="tabular-nums text-zinc-200">{timeState.time12h}</span>
          <span className="text-zinc-600">|</span>
          <button
            onClick={onToggleLang}
            className="text-zinc-300 hover:text-white transition-colors cursor-pointer text-[10px] uppercase font-bold tracking-wider"
            title="Switch Language"
          >
            {currentLang === 'en' ? 'नेपाली' : 'English'}
          </button>
        </div>
      </div>

      {/* Primary 3-Zone Navigation Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNavClick('home')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-zinc-200 transition-colors">
              SAARTHI
            </span>
          </button>
        </div>

        {/* Zone 2: Clean 5 text navigation links (No pills) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((link) => {
            const active = isLinkActive(link.id);
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`relative py-1 transition-colors cursor-pointer text-sm ${
                  active ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {currentLang === 'ne' ? link.labelNp : link.labelEn}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions (Search, Account & Mobile toggle) */}
        <div className="flex items-center gap-3">
          {/* Quick Search Trigger (Cmd+K) */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-zinc-300 hover:text-white hover:border-white/20 transition-all text-xs cursor-pointer"
            title="Quick Search (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline text-zinc-400">Search</span>
            <kbd className="hidden sm:inline-block font-mono text-[10px] text-zinc-500 bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
              ⌘K
            </kbd>
          </button>

          {/* PWA Install Trigger (Only visible when installable and not standalone) */}
          <PWAInstallButton />

          {/* User Account / Login Action */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 hover:border-white/20 bg-transparent text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title={userProfile?.isLoggedIn ? `Account (${userProfile.name})` : 'Sign In'}
          >
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">
              {userProfile?.isLoggedIn ? userProfile.name.split(' ')[0] : 'Account'}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#090A0F] px-4 py-4 space-y-3 max-h-[calc(100dvh-5.5rem)] overflow-y-auto animate-in fade-in duration-150">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const active = isLinkActive(link.id);
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer text-left ${
                    active ? 'bg-white/10 text-white font-semibold' : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span>{currentLang === 'ne' ? link.labelNp : link.labelEn}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
