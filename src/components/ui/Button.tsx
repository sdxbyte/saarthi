import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconRight,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses: Record<ButtonSize, string> = {
    xs: 'h-6 px-2 text-[11px] gap-1 rounded-[5px]',
    sm: 'h-7 px-2.5 text-xs gap-1.5 rounded-[6px]',
    md: 'h-8 px-3 text-xs gap-2 rounded-[6px] font-medium',
    lg: 'h-9 px-4 text-sm gap-2 rounded-[8px] font-medium',
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-[var(--color-accent-fill)] text-[var(--color-accent-ink)] hover:opacity-90 active:scale-[0.99] font-medium shadow-sm border border-transparent',
    secondary:
      'bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text)] border border-[var(--color-border)] shadow-[var(--shadow-card)] active:scale-[0.99]',
    ghost:
      'bg-transparent hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] border border-transparent',
    danger:
      'bg-[var(--color-negative)] text-white hover:opacity-90 border border-transparent active:scale-[0.99]',
    accent:
      'bg-[var(--color-accent-muted)] text-[var(--color-accent-mark)] border border-[var(--color-accent-mark)]/30 hover:bg-[var(--color-accent-muted)]/80',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children && <span>{children}</span>}
      {!isLoading && iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
};
