import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'blue' | 'purple' | 'red' | 'orange' | 'green' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'sm',
  className = '',
  icon
}) => {
  const variantStyles = {
    cyan: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/25',
    blue: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/25',
    purple: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/25',
    red: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/25',
    orange: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25',
    green: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
    neutral: 'bg-neutral-200/60 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border-neutral-300/40 dark:border-white/10'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] font-semibold rounded-full gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold rounded-full gap-1.5'
  };

  return (
    <span className={`inline-flex items-center backdrop-blur-md border whitespace-nowrap leading-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
