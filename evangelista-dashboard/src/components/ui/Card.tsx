import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
  onClick?: () => void;
  index?: number; // For staggered animations
}

export default function Card({ children, className = '', hover = true, padding = true, onClick, index = 0 }: CardProps) {
  const isClickable = !!onClick;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: index * 0.05 
      }}
      onClick={onClick}
      className={`
        bg-surface-card rounded-card border border-surface-border shadow-card
        ${padding ? 'p-6' : ''}
        ${hover ? 'hover:shadow-card-hover hover:border-primary-200' : ''}
        ${isClickable ? 'cursor-pointer active:scale-[0.99]' : ''}
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
