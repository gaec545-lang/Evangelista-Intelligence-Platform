import React from 'react';

export type ServiceType = 'foundation' | 'architecture' | 'sentinel' | 'gold';

interface ServiceTagProps {
  service: ServiceType;
  label: string;
}

const serviceStyles = {
  foundation:   { bg: '#fff0ec', text: '#c05538', border: '#fdd8ce' },
  architecture: { bg: '#f0eeff', text: '#534ab7', border: '#d8d4f8' },
  sentinel:     { bg: '#e8f8f2', text: '#0f6e56', border: '#c0e8d8' },
  gold:         { bg: '#fdf6e3', text: '#8a6a10', border: '#f0dfa0' },
};

const ServiceTag = ({ service, label }: ServiceTagProps) => {
  const style = serviceStyles[service];
  
  return (
    <span 
      className="inline-flex items-center px-2 py-0.5 rounded-full border font-mono text-[9px] font-semibold uppercase tracking-[0.06em]"
      style={{ 
        backgroundColor: style.bg, 
        color: style.text, 
        borderColor: style.border 
      }}
    >
      {label}
    </span>
  );
};

export default ServiceTag;
