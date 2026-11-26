import React from 'react';
import { useGlobalTime } from '../../context/GlobalTimeContext';
import { useOptionalLanguage } from '../../context/LanguageContext';
import { isNativeAndroidShell } from '../../utils/apiClient';
import { openAppSyncModal } from '../common/AppUpdateChecker';
import { CURRENT_VERSION_INFO } from '../../utils/versionEngine';

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
  const { t } = useOptionalLanguage(currentLang);

  return (
    <footer className="mt-12 pb-24 md:pb-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1628] text-slate-600 dark:text-slate-400 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Identity & Mission */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-base font-bold text-[#0B1F3A] dark:text-white tracking-tight">
              {t.brand}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              {t.footer.mission}
            </p>
            <div className="pt-1 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              <span>{timeState.bsFormattedEn} BS</span>
              <span className="mx-2" aria-hidden="true">
                ·
              </span>
              <span>{timeState.adDateFormatted} AD</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-2.5 text-xs">
            <span className="text-slate-900 dark:text-slate-200 font-semibold block">
              {t.footer.sections}
            </span>
            <ul className="space-y-1.5">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('home')}
                  className="hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('services')}
                  className="hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.services}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('finance')}
                  className="hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.finance}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('calendar')}
                  className="hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.calendar}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('tools')}
                  className="hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.tools}
                </button>
              </li>
            </ul>
          </div>

          {/* Project & Legal */}
          <div className="space-y-2.5 text-xs">
            <span className="text-slate-900 dark:text-slate-200 font-semibold block">
              {t.footer.project}
            </span>
            <ul className="space-y-1.5">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('about')}
                  className="hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t.footer.about}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('support')}
                  className="hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t.footer.support}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('donate')}
                  className="hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t.footer.donate}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('privacy')}
                  className="hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t.footer.privacy}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('terms')}
                  className="hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {t.footer.terms}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openAppSyncModal()}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  {isNativeAndroidShell() ? t.footer.apkSelfUpdate : t.footer.apkUpdate}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateTab('account-deletion')}
                  className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                >
                  {t.footer.accountDeletion}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} {t.footer.copyright}</p>

          <div className="flex items-center gap-4">
            <span>{t.footer.verifiedSources}</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onOpenAdminModal}
              className="text-slate-500 hover:text-[#0B1F3A] dark:hover:text-slate-200 transition-colors font-mono cursor-pointer"
              title="System Management"
            >
              {CURRENT_VERSION_INFO.version}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
