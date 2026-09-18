import React from 'react';

export type BadgeVariant = 'accent' | 'neutral' | 'positive' | 'negative';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  dot = false,
  className = '',
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    accent: 'bg-[var(--color-accent-muted)] text-[var(--color-accent-mark)] border-[var(--color-accent-mark)]/30',
    neutral: 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] border-[var(--color-border)]',
    positive: 'bg-[var(--color-positive)]/10 text-[var(--color-positive)] border-[var(--color-positive)]/25',
    negative: 'bg-[var(--color-negative)]/10 text-[var(--color-negative)] border-[var(--color-negative)]/25',
  };

  const dotColors: Record<BadgeVariant, string> = {
    accent: 'bg-[var(--color-accent-mark)]',
    neutral: 'bg-[var(--color-text-muted)]',
    positive: 'bg-[var(--color-positive)]',
    negative: 'bg-[var(--color-negative)]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border leading-normal select-none ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      <span>{children}</span>
    </span>
  );
};
