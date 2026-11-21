import React from 'react';
import { useGlobalTime } from '../../context/GlobalTimeContext';

interface EditorialFooterProps {
  currentLang: 'en' | 'ne';
  onNavigateTab: (tab: string) => void;
  onOpenAdminModal?: () => void;
}

export const EditorialFooter: React.FC<EditorialFooterProps> = ({
  currentLang,
  onNavigateTab,
  onOpenAdminModal,
}) => {
  const { timeState } = useGlobalTime();

  return (
    <footer className="mt-24 border-t border-white/[0.08] bg-[#090A0F] text-zinc-400 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Identity & Mission */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-base font-semibold text-white tracking-tight">SAARTHI</h4>
            <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
              Useful digital tools and verified information for Nepal. Ad-free, private, and powered by authentic public data.
            </p>
            <div className="pt-2 text-xs text-zinc-500 font-mono">
              <span>{timeState.bsFormattedEn} BS</span>
              <span className="mx-2">·</span>
              <span>{timeState.adDateFormatted} AD</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-2.5 text-xs">
            <span className="text-zinc-200 font-medium block">Sections</span>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onNavigateTab('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {currentLang === 'ne' ? 'गृह' : 'Home'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('explore')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {currentLang === 'ne' ? 'अन्वेषण' : 'Explore'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('finance')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {currentLang === 'ne' ? 'वित्त तथा सेयर' : 'Finance'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('tools')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {currentLang === 'ne' ? 'औजारहरू' : 'Tools'}
                </button>
              </li>
            </ul>
          </div>

          {/* Project & Legal */}
          <div className="space-y-2.5 text-xs">
            <span className="text-zinc-200 font-medium block">Project</span>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onNavigateTab('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About SAARTHI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('support')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Support & FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('donate')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Donation Details
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <a
                  href="https://github.com/sdxbyte/saarthi/releases/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Download Android APK
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('account-deletion')}
                  className="hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Account &amp; Data Deletion
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} SAARTHI. Private Digital Project.</p>

          <div className="flex items-center gap-4">
            <span>Verified Public Feeds</span>
            <span>·</span>
            {/* Discreet admin portal access trigger */}
            <button
              onClick={onOpenAdminModal}
              className="text-zinc-600 hover:text-zinc-400 transition-colors font-mono cursor-pointer"
              title="System Management"
            >
              v1.9.1
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
