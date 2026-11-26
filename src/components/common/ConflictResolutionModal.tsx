import React from 'react';
import { AlertTriangle, Check, Cloud, Laptop, CopyPlus, X } from 'lucide-react';
import { SyncConflictRecord } from '../../services/offlineDb';

interface ConflictResolutionModalProps {
  conflicts: SyncConflictRecord[];
  onResolve: (
    conflictId: string,
    strategy: 'keep_local' | 'keep_remote' | 'merge_both'
  ) => Promise<void>;
  onClose: () => void;
}

export const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({
  conflicts,
  onResolve,
  onClose,
}) => {
  if (!conflicts || conflicts.length === 0) return null;

  const active = conflicts[0];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="saarthi-conflict-title"
    >
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <h2 id="saarthi-conflict-title" className="text-base font-semibold">
                Sync Conflict Detected ({conflicts.length} remaining)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This {active.collection} item was updated on another device while offline. Choose which version to keep.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Close conflict dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Local Device Version */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-blue-600 dark:text-blue-400">
                <span className="inline-flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5" />
                  This Device
                </span>
                <span className="font-mono tabular-nums">v{active.localVersion}</span>
              </div>
              <p className="text-sm font-semibold truncate">
                {active.localPayload.title || active.entityId}
              </p>
              <pre className="text-[11px] font-mono text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
                {JSON.stringify(active.localPayload, null, 2)}
              </pre>
            </div>

            {/* Cloud Version */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="inline-flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5" />
                  Cloud Version
                </span>
                <span className="font-mono tabular-nums">v{active.remoteVersion}</span>
              </div>
              <p className="text-sm font-semibold truncate">
                {active.remotePayload.title || active.entityId}
              </p>
              <pre className="text-[11px] font-mono text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
                {JSON.stringify(active.remotePayload, null, 2)}
              </pre>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => void onResolve(active.conflictId, 'keep_local')}
              className="py-2.5 px-4 rounded-xl bg-[#0B1F3A] hover:bg-[#132f57] dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Keep This Device
            </button>
            <button
              type="button"
              onClick={() => void onResolve(active.conflictId, 'keep_remote')}
              className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Cloud className="w-3.5 h-3.5" />
              Keep Cloud Copy
            </button>
            <button
              type="button"
              onClick={() => void onResolve(active.conflictId, 'merge_both')}
              className="py-2.5 px-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CopyPlus className="w-3.5 h-3.5" />
              Keep Both Copies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
