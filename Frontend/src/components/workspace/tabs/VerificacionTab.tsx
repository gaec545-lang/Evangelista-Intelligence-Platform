import React from 'react';

export const VerificacionTab: React.FC = () => {
  return (
    <div className="h-full flex flex-col space-y-6">
      <h2 className="text-2xl font-bold text-[var(--eva-primary)]">Fase 8: Verificación</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Snapshot D90 */}
        <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-5 shadow-sm">
          <h3 className="font-semibold mb-4 border-b border-[var(--eva-border)] pb-2 flex items-center justify-between">
            Snapshot D90
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-mono border border-green-200">MD5: f7a2...4c9e</span>
          </h3>
          <div className="aspect-video bg-[var(--eva-background)] border-2 border-green-400 border-dashed rounded flex items-center justify-center text-green-600 flex-col gap-2">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="text-sm font-bold">Estado Post-Intervención Capturado</span>
          </div>
          
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 justify-center">
             <span>Snapshot D0 (a3f8)</span>
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
             <span className="font-bold text-green-600">Snapshot D90 (f7a2)</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Delta de Ahorro */}
          <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-5 shadow-sm">
            <h3 className="font-semibold mb-4 border-b border-[var(--eva-border)] pb-2">Delta de Ahorro Validado</h3>
            
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Ahorro Realizado</p>
                <p className="text-3xl font-bold text-green-600">$2,450,000</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Target Original</p>
                <p className="text-lg font-bold text-gray-400 line-through">$2,000,000</p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
              <div className="bg-green-500 h-3 rounded-full relative" style={{ width: "100%" }}>
                <div className="absolute top-0 right-0 w-1 h-full bg-black"></div>
              </div>
            </div>
            <p className="text-xs mt-2 text-right text-green-600 font-bold">122% del objetivo logrado</p>
          </div>

          {/* Success Fee */}
          <div className="bg-gradient-to-br from-[var(--eva-primary)] to-[var(--eva-primary-dark)] rounded-lg p-6 text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-20">
               <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
             
             <h3 className="font-bold text-lg mb-1 opacity-90 relative z-10">Cálculo de Success Fee</h3>
             <p className="text-sm opacity-75 mb-6 relative z-10">Basado en el excedente de ahorro generado</p>
             
             <div className="flex justify-between items-end relative z-10">
                <div>
                  <p className="text-xs opacity-80 mb-1">Fee Variable (15% del delta excedente)</p>
                  <p className="text-4xl font-bold">$67,500</p>
                </div>
                <button className="bg-white text-[var(--eva-primary-dark)] px-4 py-2 rounded font-bold text-sm hover:bg-gray-100 transition-colors shadow">
                  Generar Factura
                </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};
