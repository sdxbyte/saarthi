import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  WifiOff,
  XCircle,
} from 'lucide-react';
import { SixStateSyncStatus } from '../../services/offlineDb';

interface SyncStatusBadgeProps {
  status: SixStateSyncStatus;
  pendingCount?: number;
  conflictCount?: number;
  compact?: boolean;
  onClick?: () => void;
}

const STATUS_META: Record<
  SixStateSyncStatus,
  {
    label: string;
    textClass: string;
    icon: React.FC<{ className?: string }>;
    animate?: boolean;
  }
> = {
  synced: {
    label: 'Synced',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    icon: CheckCircle2,
  },
  syncing: {
    label: 'Syncing',
    textClass: 'text-blue-600 dark:text-blue-400',
    icon: RefreshCw,
    animate: true,
  },
  offline: {
    label: 'Offline',
    textClass: 'text-amber-600 dark:text-amber-400',
    icon: WifiOff,
  },
  pending: {
    label: 'Pending changes',
    textClass: 'text-blue-600 dark:text-blue-400',
    icon: Clock,
  },
  failed: {
    label: 'Sync failed',
    textClass: 'text-rose-600 dark:text-rose-400',
    icon: XCircle,
  },
  conflict: {
    label: 'Conflict detected',
    textClass: 'text-amber-600 dark:text-amber-400',
    icon: AlertTriangle,
  },
};

export const SyncStatusBadge: React.FC<SyncStatusBadgeProps> = ({
  status,
  pendingCount = 0,
  conflictCount = 0,
  compact = false,
  onClick,
}) => {
  const meta = STATUS_META[status] || STATUS_META.synced;
  const Icon = meta.icon;

  const detail =
    status === 'conflict' && conflictCount > 0
      ? `${meta.label} (${conflictCount})`
      : status === 'pending' && pendingCount > 0
        ? `${meta.label} (${pendingCount})`
        : meta.label;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${meta.textClass}`}
      title={`Cloud sync status: ${detail}`}
      aria-label={`Sync status: ${detail}`}
    >
      <Icon className={`w-3.5 h-3.5 shrink-0 ${meta.animate ? 'animate-spin' : ''}`} />
      <span className={compact ? 'hidden sm:inline' : 'inline'}>{detail}</span>
    </button>
  );
};
