import React from 'react';
import { ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { useGlobalTime } from '../../context/GlobalTimeContext';

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

  return (
    <article className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb / Back Link */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
        <button
          onClick={() => onNavigateTab(backTab)}
          className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>{backLabel}</span>
        </button>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-zinc-300' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        )}
      </div>

      {/* Editorial Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <span className="text-zinc-300 font-medium">{category}</span>
          {sourceName && (
            <>
              <span>·</span>
              <span>
                Source:{' '}
                {sourceUrl ? (
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-200 hover:underline inline-flex items-center gap-1"
                  >
                    {sourceName}
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ) : (
                  <span className="text-zinc-200">{sourceName}</span>
                )}
              </span>
            </>
          )}
          <span>·</span>
          <span>Verified Official</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
          {title}
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
          {subtitle}
        </p>

        {/* Timestamps and status (Rule 2 & Rule 16) */}
        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-500 border-t border-white/[0.04]">
          <span>Sync: {lastUpdated}</span>
          <span>·</span>
          <span>BS: {timeState.bsFormattedEn}</span>
          <span>·</span>
          <span>AD: {timeState.adDateFormatted}</span>
        </div>
      </header>

      {/* Main Interactive Working Tool Component */}
      <section className="pt-2">
        {children}
      </section>

      {/* Related Sections */}
      {relatedLinks.length > 0 && (
        <footer className="pt-12 mt-16 border-t border-white/[0.06] space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Related in SAARTHI
          </h2>
          <div className="flex flex-wrap gap-3">
            {relatedLinks.map((link) => (
              <button
                key={link.tab}
                onClick={() => onNavigateTab(link.tab)}
                className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer bg-white/[0.02]"
              >
                {link.label} →
              </button>
            ))}
          </div>
        </footer>
      )}
    </article>
  );
};
