import React from 'react';
import { motion } from 'motion/react';
import { soundHaptics } from '../../services/SoundHaptics';

interface GlassButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'glass' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'glass',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  id,
  icon,
  fullWidth = false,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    soundHaptics.tap();
    if (onClick) onClick(e);
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-semibold rounded-full gap-1.5',
    md: 'px-4 py-2.5 text-sm font-semibold rounded-2xl gap-2',
    lg: 'px-6 py-3.5 text-base font-bold rounded-2xl gap-2.5',
    icon: 'p-2.5 rounded-full aspect-square'
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30 hover:from-cyan-400 hover:to-blue-500',
    glass: 'bg-white/80 dark:bg-neutral-800/80 text-neutral-900 dark:text-white backdrop-blur-xl border border-neutral-200/80 dark:border-white/10 shadow-sm hover:bg-white dark:hover:bg-neutral-800 active:bg-neutral-100 dark:active:bg-neutral-700',
    secondary: 'bg-neutral-100/90 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 border border-neutral-200/50 dark:border-white/5 hover:bg-neutral-200 dark:hover:bg-neutral-700',
    danger: 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500/25',
    success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25',
    ghost: 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/60 dark:hover:bg-white/5 border border-transparent'
  };

  return (
    <motion.button
      id={id}
      whileTap={!disabled ? { scale: 0.96 } : undefined}
      whileHover={!disabled ? { scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center select-none font-medium transition-colors whitespace-nowrap cursor-pointer disabled:opacity-45 disabled:pointer-events-none ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
};
