import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading SAARTHI module...',
}) => {
  return (
    <div
      role="status"
      aria-label={label}
      className="min-h-[320px] w-full flex flex-col items-center justify-center p-8 space-y-3 animate-in fade-in duration-150"
    >
      <div className="relative flex items-center justify-center">
        <div className="w-11 h-11 rounded-full border-[3px] border-slate-200 dark:border-slate-800 border-t-[#0B1F3A] dark:border-t-blue-500 animate-spin" />
        <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 absolute" />
      </div>
      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 font-mono tracking-wide text-center">
        {label}
      </p>
    </div>
  );
};
