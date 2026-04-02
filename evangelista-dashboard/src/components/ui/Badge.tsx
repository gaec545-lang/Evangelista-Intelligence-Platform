import { ReactNode } from 'react';

type BadgeVariant = 'success' | 'info' | 'warning' | 'danger' | 'neutral' | 'primary' | 'custom';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  dot?: boolean;
}

// Maps semantic variants to CSS class names defined in index.css
const cssClassMap: Record<Exclude<BadgeVariant, 'custom'>, string> = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  info: 'badge-info',
  neutral: 'badge-neutral',
  primary: 'badge-olive',
};

// Dot color tokens per variant — use utility bg colors with opacity-80
const dotColorMap: Record<Exclude<BadgeVariant, 'custom'>, string> = {
  success: 'bg-green-400',
  warning: 'bg-yellow-400',
  danger: 'bg-red-400',
  info: 'bg-sky-400',
  neutral: 'bg-[#A1A1A6]',
  primary: 'bg-[#95B877]',
};

const sizeMap: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-[6px] text-[9px]',
  md: 'px-2 py-[8px] text-[11px]',
  lg: 'px-3 py-[12px] text-[12px]',
};

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  dot = true
}: BadgeProps) {
  const baseCss = variant === 'custom' ? '' : cssClassMap[variant];
  const dotColor = variant === 'custom' ? 'bg-green-400' : dotColorMap[variant];

  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-badge font-medium tracking-wide uppercase
      transition-all duration-200
      ${baseCss}
      ${sizeMap[size]}
      ${className}
    `}>
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColor} opacity-80`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
