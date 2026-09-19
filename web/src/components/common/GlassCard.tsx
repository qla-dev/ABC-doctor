import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'sunken' | 'accent' | 'subtle';
  className?: string;
  onClick?: () => void;
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick,
  id,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white/75 dark:bg-neutral-900/65 border-neutral-200/70 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]',
    elevated: 'bg-white/85 dark:bg-neutral-900/80 border-neutral-200/80 dark:border-white/15 shadow-[0_12px_36px_rgb(0,0,0,0.08)] dark:shadow-[0_16px_40px_rgb(0,0,0,0.45)]',
    sunken: 'bg-neutral-100/60 dark:bg-neutral-950/50 border-neutral-200/40 dark:border-white/5',
    accent: 'bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-indigo-500/10 dark:from-cyan-500/20 dark:via-blue-500/10 dark:to-indigo-500/20 border-cyan-500/30 dark:border-cyan-400/20 shadow-cyan-500/5',
    subtle: 'bg-white/40 dark:bg-neutral-900/40 border-neutral-200/40 dark:border-white/5'
  };

  return (
    <motion.div
      id={id}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      onClick={onClick}
      className={`relative backdrop-blur-2xl rounded-3xl border transition-colors duration-200 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
