import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconRight,
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  type = 'button',
  ...props
}) => {
  const sizeClasses: Record<ButtonSize, string> = {
    xs: 'min-h-[32px] px-2.5 text-xs gap-1.5 rounded-md',
    sm: 'min-h-[36px] px-3 text-xs gap-1.5 rounded-lg',
    md: 'min-h-[40px] px-4 text-sm gap-2 rounded-lg font-medium',
    lg: 'min-h-[44px] px-5 text-sm gap-2 rounded-xl font-semibold',
    icon: 'min-h-[40px] min-w-[40px] w-10 h-10 p-0 rounded-lg justify-center',
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-[#0B1F3A] hover:bg-[#102A4C] dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-sm border border-transparent active:scale-[0.99]',
    secondary:
      'bg-white dark:bg-[#0F172A] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-xs active:scale-[0.99]',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:text-[#0B1F3A] dark:hover:text-white border border-transparent',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white border border-transparent shadow-xs active:scale-[0.99]',
    accent:
      'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center whitespace-nowrap shrink-0 transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${
        fullWidth ? 'w-full' : ''
      } ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span
          aria-hidden="true"
          className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"
        />
      ) : (
        icon && <span className="shrink-0 inline-flex items-center">{icon}</span>
      )}
      {children && <span>{children}</span>}
      {!isLoading && iconRight && <span className="shrink-0 inline-flex items-center">{iconRight}</span>}
    </button>
  );
};
