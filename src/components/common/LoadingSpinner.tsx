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
      className="min-h-[350px] w-full flex flex-col items-center justify-center p-8 space-y-3 animate-in fade-in duration-150"
    >
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-red-600 animate-spin" />
        <Loader2 className="w-5 h-5 text-red-500 absolute animate-pulse" />
      </div>
      <p className="text-xs font-medium text-slate-400 font-mono tracking-wide">{label}</p>
    </div>
  );
};
