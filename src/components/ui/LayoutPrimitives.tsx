import React from 'react';

export const PageContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 ${className}`}>
    {children}
  </div>
);

export const SectionHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  eyebrow?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, eyebrow, action, className = '' }) => (
  <div
    className={`flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 ${className}`}
  >
    <div className="space-y-1 min-w-0">
      {eyebrow && (
        <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
          {eyebrow}
        </span>
      )}
      <h2 className="text-lg sm:text-xl font-semibold text-[#0B1F3A] dark:text-white tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const ResponsiveGrid: React.FC<{
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}> = ({ children, cols = 3, className = '' }) => {
  const colsMap: Record<1 | 2 | 3 | 4, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };
  return <div className={`grid ${colsMap[cols]} gap-4 ${className}`}>{children}</div>;
};
