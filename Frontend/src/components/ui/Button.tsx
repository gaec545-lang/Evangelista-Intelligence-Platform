import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'olive';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  type?: 'button' | 'submit';
  form?: string;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon,
  type = 'button',
  form
}: ButtonProps) {
  const variants = {
    // Primary: Negro con texto beige. Hover: verde olivo.
    primary: 'bg-eva-black text-eva-beige hover:bg-eva-olive border border-eva-black-3 shadow-sm',
    secondary: 'bg-eva-beige-2 text-eva-txt-dark hover:bg-eva-beige-3 border border-eva-border-2',
    outline: 'bg-transparent border border-eva-border text-eva-txt-mid hover:bg-eva-beige-2',
    ghost: 'bg-transparent hover:bg-eva-olive-light text-eva-txt-muted hover:text-eva-olive',
    danger: 'text-white bg-service-foundation hover:bg-service-foundation/90 border border-service-foundation',
    olive: 'bg-eva-olive text-eva-beige hover:bg-eva-olive-2 border border-eva-olive/20',
  };

  const sizes = {
    xs: 'px-2 py-1 text-[10px]',
    sm: 'px-3 py-1.5 text-[11px]',
    md: 'px-4 py-2.5 text-[13px]',
    lg: 'px-6 py-3 text-[14px]',
  };

  return (
    <motion.button
      type={type}
      form={form}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-full font-ui font-semibold
        transition-all duration-200 tracking-wide
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
            className="flex items-center gap-2"
          >
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default Button;
