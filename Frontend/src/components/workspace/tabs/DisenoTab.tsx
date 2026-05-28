import React from 'react';

export const DisenoTab: React.FC = () => {
  return (
    <div className="h-full flex flex-col space-y-6">
      <h2 className="text-2xl font-bold text-[var(--eva-primary)]">Fase 4: Diseño</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Snapshot D0 */}
        <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-5 shadow-sm">
          <h3 className="font-semibold mb-4 border-b border-[var(--eva-border)] pb-2 flex items-center justify-between">
            Snapshot D0
            <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-1 rounded font-mono">MD5: a3f8...9b2c</span>
          </h3>
          <div className="aspect-video bg-[var(--eva-background)] border border-[var(--eva-border)] rounded flex items-center justify-center text-[var(--eva-text-muted)] flex-col gap-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span className="text-sm">Estado Base Capturado</span>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">Captura inmutable del estado inicial.</p>
        </div>

        {/* Plano de Intervención */}
        <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-5 shadow-sm">
          <h3 className="font-semibold mb-4 border-b border-[var(--eva-border)] pb-2">Plano de Intervención</h3>
          <div className="space-y-4">
            <div className="p-3 border border-[var(--eva-primary-light)] bg-[var(--eva-primary-light)]/20 rounded">
              <h4 className="text-sm font-bold text-[var(--eva-primary)]">Módulo 1: Core Systems</h4>
              <p className="text-xs mt-1">Migración a cloud híbrida y refactor de legacy.</p>
            </div>
            <div className="p-3 border border-purple-200 bg-purple-50 rounded">
              <h4 className="text-sm font-bold text-purple-700">Módulo 2: Analytics</h4>
              <p className="text-xs mt-1">Implementación de Data Lake DAMA-compliant.</p>
            </div>
          </div>
        </div>

        {/* Stakeholder Map */}
        <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-5 shadow-sm">
          <h3 className="font-semibold mb-4 border-b border-[var(--eva-border)] pb-2">Stakeholder Map</h3>
          <div className="aspect-square relative bg-[var(--eva-background)] border border-[var(--eva-border)] rounded p-2">
             {/* Mock visual map */}
             <div className="absolute top-4 right-4 w-12 h-12 bg-red-100 border border-red-400 rounded-full flex items-center justify-center text-xs font-bold text-red-700 shadow-sm" title="High Power, Low Interest">CEO</div>
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-green-100 border border-green-400 rounded-full flex items-center justify-center text-xs font-bold text-green-700 shadow-sm" title="High Power, High Interest">CTO</div>
             <div className="absolute bottom-4 left-4 w-10 h-10 bg-blue-100 border border-blue-400 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-700 shadow-sm" title="Low Power, Low Interest">Ops</div>
             
             {/* Axes */}
             <div className="absolute bottom-0 left-0 w-full h-px bg-gray-300"></div>
             <div className="absolute bottom-0 left-0 w-px h-full bg-gray-300"></div>
             <span className="absolute bottom-1 right-2 text-[10px] text-gray-500">Interés</span>
             <span className="absolute top-2 left-2 text-[10px] text-gray-500 transform -rotate-90 origin-top-left">Poder</span>
          </div>
        </div>
      </div>
    </div>
  );
};
