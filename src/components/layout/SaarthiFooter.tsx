import React from 'react';
import { useGlobalTime } from '../../context/GlobalTimeContext';

interface SaarthiFooterProps {
  onNavigateTab: (tab: string) => void;
  onOpenAdminModal?: () => void;
  currentLang: 'en' | 'ne';
}

export const SaarthiFooter: React.FC<SaarthiFooterProps> = ({
  onNavigateTab,
  onOpenAdminModal,
  currentLang,
}) => {
  const { timeState } = useGlobalTime();

  return (
    <footer className="mt-20 border-t border-zinc-800/80 bg-[#07080B] text-zinc-400 text-xs font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Top Minimal Info Row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 max-w-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-white">SAARTHI</span>
              <span className="text-zinc-400">·</span>
              <span className="text-[11px] text-zinc-400 font-mono">Private Project</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-xs">
              Useful digital tools, official financial data, and public utilities for Nepal. Independent, privacy-focused, and ad-free.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono block">
                Platform
              </span>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => onNavigateTab('home')} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateTab('explore')} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    Explore Index
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateTab('finance')} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    Finance Hub
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateTab('tools')} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    Tools & Utilities
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono block">
                About & Legal
              </span>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => onNavigateTab('about')} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    About Project
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateTab('privacy')} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateTab('terms')} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    Terms of Use
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateTab('account-deletion')} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    Account Deletion
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono block">
                Community
              </span>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => onNavigateTab('support')} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    Support Desk
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateTab('contact')} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    Contact Us
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigateTab('donate')} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                    Support Project
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Dual Dates and System Status */}
        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-zinc-400 font-mono">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>BS: {timeState.bsFormattedEn}</span>
            <span aria-hidden="true" className="text-zinc-800">·</span>
            <span>AD: {timeState.adDateFormatted}</span>
            <span aria-hidden="true" className="text-zinc-800">·</span>
            <span>Kathmandu (+05:45)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdminModal}
              className="text-zinc-400 hover:text-zinc-400 transition-colors cursor-pointer"
              title="Version build info"
            >
              v2.9.0
            </button>
            <span aria-hidden="true" className="text-zinc-800">·</span>
            <span>© {new Date().getFullYear()} SAARTHI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
