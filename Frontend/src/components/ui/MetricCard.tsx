import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  serviceColor?: string;
  className?: string;
}

const MetricCard = ({ label, value, subtitle, serviceColor = '#4a5c3a', className }: MetricCardProps) => {
  return (
    <div className={`relative overflow-hidden rounded-xl border p-4 shadow-sm hover:shadow-card-hover transition-all duration-200 ${className || 'bg-white border-eva-border text-eva-black'}`}>
      <div 
        className="absolute top-0 left-0 right-0 h-[3px]" 
        style={{ backgroundColor: serviceColor }} 
      />
      <p className="font-mono text-[10px] tracking-[0.10em] uppercase text-[var(--eva-txt-muted)] mb-2">
        {label}
      </p>
      <p className="font-brand text-[40px] leading-none tracking-tight font-bold mb-1">
        {value}
      </p>
      {subtitle && (
        <p className="font-ui text-xs text-[var(--eva-txt-muted)]">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default MetricCard;
