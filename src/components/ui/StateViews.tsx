import React from 'react';
import { AlertTriangle, Inbox, Loader2, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface LoadingStateProps {
  title?: string;
  description?: string;
  variant?: 'spinner' | 'skeleton';
  rows?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Loading SAARTHI',
  description = 'Preparing verified records and workspace...',
  variant = 'skeleton',
  rows = 3,
}) => {
  if (variant === 'spinner') {
    return (
      <div
        role="status"
        aria-label={title}
        className="min-h-[240px] w-full flex flex-col items-center justify-center p-6 text-center space-y-3"
      >
        <div className="w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] flex items-center justify-center shadow-xs">
          <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[#0B1F3A] dark:text-white">{title}</p>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label={title}
      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] p-5 space-y-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800 opacity-80" />
          <div className="h-3 w-64 max-w-full rounded bg-slate-100 dark:bg-slate-800/70 opacity-75" />
        </div>
        <div className="h-8 w-20 rounded-lg bg-slate-100 dark:bg-slate-800 opacity-80 shrink-0" />
      </div>
      <div className="space-y-2.5 pt-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-11 w-full rounded-lg bg-slate-100 dark:bg-slate-800/60 opacity-75"
          />
        ))}
      </div>
    </div>
  );
};

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No entries available',
  description = 'Records added or synced to your account will appear here.',
  icon,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="w-full rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-[#0F172A]/60 p-8 text-center flex flex-col items-center justify-center space-y-3">
      <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-xs">
        {icon || <Inbox className="w-5 h-5" />}
      </div>
      <div className="space-y-1 max-w-md">
        <h3 className="text-sm font-semibold text-[#0B1F3A] dark:text-white">{title}</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <div className="pt-1">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  description?: string;
  details?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load section',
  description = 'An unexpected error occurred while displaying this view. Local data remains intact.',
  details,
  onRetry,
  retryLabel = 'Try Again',
}) => {
  return (
    <div
      role="alert"
      className="w-full rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
          {details && (
            <p className="text-[11px] font-mono text-rose-700 dark:text-rose-300 break-words pt-1">
              {details}
            </p>
          )}
        </div>
      </div>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          icon={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={onRetry}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
};
