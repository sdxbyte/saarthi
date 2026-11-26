import React from 'react';
import { ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { useGlobalTime } from '../../context/GlobalTimeContext';
import { useOptionalLanguage } from '../../context/LanguageContext';
import { isNativeAndroidShell } from '../../utils/apiClient';
import { triggerHaptic } from '../../utils/appFeedback';

interface RelatedLink {
  label: string;
  tab: string;
}

interface DetailViewWrapperProps {
  title: string;
  subtitle: string;
  category: string;
  sourceName?: string;
  sourceUrl?: string;
  lastUpdated?: string;
  backTab?: string;
  backLabel?: string;
  onNavigateTab: (tab: string) => void;
  relatedLinks?: RelatedLink[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
  children: React.ReactNode;
}

export const DetailViewWrapper: React.FC<DetailViewWrapperProps> = ({
  title,
  subtitle,
  category,
  sourceName,
  sourceUrl,
  lastUpdated = 'Live Daily',
  backTab = 'explore',
  backLabel = 'Back to Index',
  onNavigateTab,
  relatedLinks = [],
  onRefresh,
  isRefreshing = false,
  children,
}) => {
  const { timeState } = useGlobalTime();
  const { t } = useOptionalLanguage();
  const isNativeApk = isNativeAndroidShell();

  return (
    <article className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-8 app-screen-transition">
      {/* Desktop / Browser Breadcrumb Bar (In APK mobile, native TopAppBar already provides Back navigation) */}
      <div
        className={`${
          isNativeApk ? 'hidden md:flex' : 'flex'
        } items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3.5`}
      >
        <button
          type="button"
          onClick={() => onNavigateTab(backTab)}
          className="min-h-[40px] inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-[#0B1F3A] dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer group whitespace-nowrap"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>{backLabel}</span>
        </button>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="min-h-[40px] inline-flex items-center gap-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600 dark:text-blue-400' : ''}`} />
            <span className="hidden sm:inline">{t.actions.refreshData}</span>
          </button>
        )}
      </div>

      {/* Screen Header */}
      <header className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{category}</span>
            {sourceName && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  Source:{' '}
                  {sourceUrl ? (
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      {sourceName}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{sourceName}</span>
                  )}
                </span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>Verified Official</span>
          </div>

          {isNativeApk && onRefresh && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light');
                onRefresh();
              }}
              disabled={isRefreshing}
              className="md:hidden min-h-[36px] inline-flex items-center gap-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-xs font-medium text-slate-700 dark:text-slate-200 active:scale-95 transition-transform cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600 dark:text-blue-400' : ''}`} />
              <span>{t.actions.refreshData}</span>
            </button>
          )}
        </div>

        <h1
          className={`${
            isNativeApk ? 'hidden md:block' : 'block'
          } text-2xl sm:text-3xl font-semibold tracking-tight text-[#0B1F3A] dark:text-white leading-tight [text-wrap:balance]`}
        >
          {title}
        </h1>

        <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {subtitle}
        </p>

        {/* Dual Date & Sync Metadata (Rule 2 & Rule 16) */}
        <div className="pt-2.5 flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800/80 tabular-nums">
          <span>Sync: {lastUpdated}</span>
          <span aria-hidden="true">·</span>
          <span>BS: {timeState.bsFormattedEn}</span>
          <span aria-hidden="true">·</span>
          <span>AD: {timeState.adDateFormatted}</span>
        </div>
      </header>

      {/* Main Interactive Tool Area */}
      <section className="pt-1">{children}</section>

      {/* Related Quick Jumps */}
      {relatedLinks.length > 0 && (
        <section className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Related in SAARTHI
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedLinks.map((link) => (
              <button
                key={link.tab}
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  onNavigateTab(link.tab);
                }}
                className="min-h-[38px] text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F172A] hover:border-blue-400 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-[#0B1F3A] dark:hover:text-white transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
              >
                {link.label} →
              </button>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
