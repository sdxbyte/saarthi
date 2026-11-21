import React, { useState } from 'react';
import { Search, User, Menu, X, Globe, Radio } from 'lucide-react';
import { UserProfile } from '../../types';
import { useGlobalTime } from '../../context/GlobalTimeContext';

interface SaarthiHeaderProps {
  currentLang: 'en' | 'ne';
  onToggleLang: () => void;
  onOpenSearch: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile?: UserProfile;
  onOpenAuthModal?: () => void;
  onOpenSajiloTray?: () => void;
}

export const SaarthiHeader: React.FC<SaarthiHeaderProps> = ({
  currentLang,
  onToggleLang,
  onOpenSearch,
  activeTab,
  setActiveTab,
  userProfile,
  onOpenAuthModal,
  onOpenSajiloTray,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { timeState } = useGlobalTime();

  const navLinks = [
    { id: 'home', labelEn: 'Home', labelNp: 'गृह' },
    { id: 'explore', labelEn: 'Explore', labelNp: 'अन्वेषण' },
    { id: 'finance', labelEn: 'Finance', labelNp: 'वित्त' },
    { id: 'tools', labelEn: 'Tools', labelNp: 'औजार' },
    { id: 'about', labelEn: 'About', labelNp: 'बारेमा' },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const isCurrentActive = (id: string) => {
    if (id === 'home' && (activeTab === 'home' || activeTab === 'dashboard')) return true;
    if (id === 'explore' && (activeTab === 'explore' || activeTab === 'modules' || activeTab === 'services')) return true;
    if (id === 'finance' && ['finance', 'nepse', 'forex', 'gold', 'fuel', 'tax', 'ird', 'emi', 'receipt'].includes(activeTab)) return true;
    if (id === 'tools' && ['tools', 'calendar', 'bluebook', 'vault', 'sajilo', 'sitehub', 'links', 'public-apis'].includes(activeTab)) return true;
    if (id === 'about' && ['about', 'vision', 'roadmap', 'contact', 'terms', 'privacy', 'support', 'donate', 'account-deletion'].includes(activeTab)) return true;
    return activeTab === id;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090A0F]/90 backdrop-blur-md border-b border-zinc-800/80 transition-colors">
      {/* 3-Zone Clean Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('home')}
            className="text-left group cursor-pointer flex items-center gap-2"
          >
            <span className="font-semibold text-lg sm:text-xl tracking-tight text-white group-hover:text-zinc-300 transition-colors font-sans">
              SAARTHI
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="System Operational" />
          </button>
        </div>

        {/* Zone 2: 5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-zinc-400">
          {navLinks.map((item) => {
            const active = isCurrentActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors whitespace-nowrap cursor-pointer relative py-1 ${
                  active ? 'text-white font-semibold' : 'hover:text-zinc-200'
                }`}
              >
                <span>{currentLang === 'ne' ? item.labelNp : item.labelEn}</span>
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions (Search, Lang, Account) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
            title="Search SAARTHI (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden lg:inline text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Radio / Sajilo Tray Quick Toggle */}
          {onOpenSajiloTray && (
            <button
              onClick={onOpenSajiloTray}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:border-zinc-700 transition-colors cursor-pointer hidden sm:flex items-center justify-center"
              title="Sajilo Tray & Live Radio (Alt+S)"
            >
              <Radio className="w-4 h-4" />
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="px-2 py-1 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer font-mono"
            title="Toggle Language"
          >
            {currentLang === 'en' ? 'ने' : 'EN'}
          </button>

          {/* Citizen Account Trigger */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
            title={userProfile?.isLoggedIn ? 'Citizen Account' : 'Sign In'}
          >
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline font-medium">
              {userProfile?.isLoggedIn ? (userProfile.name ? userProfile.name.split(' ')[0] : 'Account') : 'Account'}
            </span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-[#090A0F] px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((item) => {
              const active = isCurrentActive(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    active ? 'bg-zinc-800/80 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {currentLang === 'ne' ? item.labelNp : item.labelEn}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>{timeState.bsFormattedEn}</span>
            <span>{timeState.time12h}</span>
          </div>
        </div>
      )}
    </header>
  );
};
