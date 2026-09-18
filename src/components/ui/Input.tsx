import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-[var(--color-text-secondary)]"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-2.5 text-[var(--color-text-muted)] pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full control-field ${leftIcon ? 'pl-8' : 'pl-3'} ${rightIcon ? 'pr-8' : 'pr-3'} ${
            error ? '!border-[var(--color-negative)] focus:!border-[var(--color-negative)]' : ''
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-2.5 text-[var(--color-text-muted)] flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-[11px] text-[var(--color-negative)] font-medium mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};
