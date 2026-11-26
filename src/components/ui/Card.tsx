import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padded?: boolean;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  padded = true,
  elevated = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 transition-colors ${
        elevated ? 'shadow-sm dark:shadow-none' : 'shadow-xs'
      } ${
        hoverable
          ? 'hover:border-blue-400 dark:hover:border-blue-600 hover:bg-slate-50/70 dark:hover:bg-[#162033]'
          : ''
      } ${padded ? 'p-4 sm:p-5' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, icon, className = '' }) => {
  return (
    <div
      className={`flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800 ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && (
          <span className="text-blue-600 dark:text-blue-400 shrink-0 inline-flex items-center">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-[#0B1F3A] dark:text-white tracking-tight truncate leading-snug">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`pt-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div
    className={`pt-3 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 ${className}`}
    {...props}
  >
    {children}
  </div>
);
