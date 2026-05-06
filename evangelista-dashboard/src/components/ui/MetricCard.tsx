import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  serviceColor?: string;
}

const MetricCard = ({ label, value, subtitle, serviceColor = '#4a5c3a' }: MetricCardProps) => {
  return (
    <div className="bg-white border border-eva-border rounded-xl p-4 relative overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-200">
      <div 
        className="absolute top-0 left-0 right-0 h-[3px]" 
        style={{ backgroundColor: serviceColor }} 
      />
      <p className="font-mono text-[10px] tracking-[0.10em] uppercase text-eva-txt-muted mb-2">
        {label}
      </p>
      <p className="font-brand text-[40px] leading-none tracking-tight font-bold text-eva-black mb-1">
        {value}
      </p>
      {subtitle && (
        <p className="font-ui text-xs text-eva-txt-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default MetricCard;
