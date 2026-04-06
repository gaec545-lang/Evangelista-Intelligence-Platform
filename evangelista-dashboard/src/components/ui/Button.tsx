import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  type?: 'button' | 'submit';
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon,
  type = 'button'
}: ButtonProps) {
  const variants = {
    primary: 'bg-[#95B877] text-white hover:bg-[#85AB67] border border-[#85AB67]/50',
    secondary: 'bg-[#1C1C1E] text-[#F5F5F7] hover:bg-white/[0.08] border border-white/[0.06]',
    outline: 'bg-transparent border border-white/[0.08] text-[#F5F5F7] hover:bg-white/[0.05]',
    ghost: 'bg-transparent hover:bg-white/[0.06] text-[#A1A1A6] hover:text-[#F5F5F7]',
    danger: 'text-[#FF453A] bg-[#FF453A]/10 border border-[#FF453A]/20 hover:bg-[#FF453A]/18',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[11px]',
    md: 'px-4 py-2 text-[13px]',
    lg: 'px-6 py-2.5 text-[14px]',
  };

  return (
    <motion.button
      type={type}
      whileTap={!disabled && !isLoading ? { scale: 0.985 } : {}}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-1.5 rounded-button font-medium
        transition-all duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed grayscale-[0.5]' : 'cursor-pointer'}
        ${className}
      `}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="w-4 h-4 animate-spin" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
