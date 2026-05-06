import React from 'react';
import ServiceTag, { ServiceType } from './ServiceTag';

interface PanelProps {
  title: string;
  service?: ServiceType;
  serviceLabel?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

const Panel = ({ title, service, serviceLabel, children, headerAction }: PanelProps) => {
  return (
    <div className="bg-white border border-eva-border rounded-xl overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-eva-border flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <h3 className="font-ui text-sm font-semibold text-eva-black">{title}</h3>
          {service && serviceLabel && (
            <ServiceTag service={service} label={serviceLabel} />
          )}
        </div>
        {headerAction && (
          <div className="flex items-center">
            {headerAction}
          </div>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default Panel;
