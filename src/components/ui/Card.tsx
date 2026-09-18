import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padded?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = true,
  padded = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-[var(--shadow-card)] transition-colors ${
        hoverable ? 'hover:bg-[var(--color-surface-hover)]' : ''
      } ${padded ? 'p-3.5 sm:p-4' : ''} ${className}`}
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
    <div className={`flex items-start justify-between gap-3 pb-3 border-b border-[var(--color-divider)] ${className}`}>
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && <span className="text-[var(--color-accent-mark)] shrink-0">{icon}</span>}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[var(--color-text)] tracking-tight truncate leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-[var(--color-text-secondary)] truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
