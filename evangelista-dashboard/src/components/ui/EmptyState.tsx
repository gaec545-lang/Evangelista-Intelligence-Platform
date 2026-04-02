import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`flex flex-col items-center justify-center py-16 px-6 text-center rounded-card ${className}`}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px dashed rgba(255,255,255,0.06)',
      }}
    >
      {icon && (
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-5 text-primary-500"
          style={{
            background: 'rgba(149,184,119,0.08)',
            border: '1px solid rgba(149,184,119,0.15)',
          }}
        >
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-content-primary mb-1.5 tracking-tight">{title}</h3>
      {description && (
        <p className="text-sm text-content-tertiary/70 mb-6 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.2 }}
      >
        {action}
      </motion.div>
    </motion.div>
  );
}
