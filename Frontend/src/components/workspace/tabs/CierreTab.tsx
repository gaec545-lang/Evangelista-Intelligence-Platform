import React from 'react';

export const CierreTab: React.FC = () => {
  return (
    <div className="h-full flex flex-col space-y-6">
      <h2 className="text-2xl font-bold text-[var(--eva-primary)]">Fase 9: Cierre</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Métricas Finales */}
        <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-5 shadow-sm md:col-span-2">
          <h3 className="font-semibold mb-4 border-b border-[var(--eva-border)] pb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--eva-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            Métricas Finales del Proyecto
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="p-4 bg-[var(--eva-background)] border border-[var(--eva-border)] rounded-lg text-center">
                <p className="text-xs text-gray-500 uppercase">Duración</p>
                <p className="text-2xl font-bold text-[var(--eva-text)] mt-1">14 Sem</p>
             </div>
             <div className="p-4 bg-[var(--eva-background)] border border-[var(--eva-border)] rounded-lg text-center">
                <p className="text-xs text-gray-500 uppercase">ROI</p>
                <p className="text-2xl font-bold text-green-600 mt-1">450%</p>
             </div>
             <div className="p-4 bg-[var(--eva-background)] border border-[var(--eva-border)] rounded-lg text-center">
                <p className="text-xs text-gray-500 uppercase">NPS Cliente</p>
                <p className="text-2xl font-bold text-[var(--eva-text)] mt-1">9.2</p>
             </div>
             <div className="p-4 bg-[var(--eva-background)] border border-[var(--eva-border)] rounded-lg text-center">
                <p className="text-xs text-gray-500 uppercase">Entregables</p>
                <p className="text-2xl font-bold text-[var(--eva-text)] mt-1">24/24</p>
             </div>
          </div>
        </div>

        {/* Retainer Propuesto */}
        <div className="bg-gradient-to-b from-[var(--eva-surface)] to-[var(--eva-primary-light)] border border-[var(--eva-primary)] rounded-lg p-5 shadow-md flex flex-col">
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--eva-primary-dark)] mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Propuesta Retainer
            </h3>
            <p className="text-xs text-gray-600 mb-4">Soporte continuo y monitoreo de ahorros para el año fiscal siguiente.</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-[var(--eva-primary-dark)]">
                <span className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center text-white text-[10px]">✓</span>
                Auditoría Trimestral
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--eva-primary-dark)]">
                <span className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center text-white text-[10px]">✓</span>
                Licencia Platform X
              </div>
            </div>
          </div>
          
          <button className="w-full py-3 bg-[var(--eva-primary)] hover:bg-[var(--eva-primary-dark)] text-white rounded-lg font-bold shadow transition-colors">
            Generar SOW Retainer
          </button>
        </div>

        {/* Lecciones Aprendidas */}
        <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-5 shadow-sm md:col-span-3">
          <h3 className="font-semibold mb-4 border-b border-[var(--eva-border)] pb-2">Lecciones Aprendidas (Knowledge Base)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="border border-green-200 bg-green-50 p-4 rounded flex gap-3">
               <div className="text-green-600 text-xl">👍</div>
               <div>
                 <h4 className="font-bold text-sm text-green-900">Adopción temprana de Stakeholders</h4>
                 <p className="text-xs text-green-800 mt-1">Involucrar a Operaciones desde la fase 2 redujo la fricción en el despliegue.</p>
               </div>
             </div>
             
             <div className="border border-orange-200 bg-orange-50 p-4 rounded flex gap-3">
               <div className="text-orange-600 text-xl">💡</div>
               <div>
                 <h4 className="font-bold text-sm text-orange-900">Limpieza de Datos</h4>
                 <p className="text-xs text-orange-800 mt-1">El proceso tomó 2 semanas extra. En futuros proyectos similares, presupuestar más tiempo para Data Quality.</p>
               </div>
             </div>
          </div>

          <div className="mt-4 flex justify-end">
             <button className="text-[var(--eva-primary)] text-sm font-semibold hover:underline">Guardar en Base de Conocimiento Global →</button>
          </div>
        </div>

      </div>
    </div>
  );
};
