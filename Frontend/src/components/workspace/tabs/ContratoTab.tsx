import React from 'react';

export const ContratoTab: React.FC = () => {
  return (
    <div className="h-full flex flex-col space-y-6">
      <h2 className="text-2xl font-bold text-[var(--eva-primary)]">Fase 3: Contrato</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5 Slots de Docs */}
        <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-5 shadow-sm">
          <h3 className="font-semibold mb-4 border-b border-[var(--eva-border)] pb-2">Documentos Legales (5 Slots)</h3>
          <div className="space-y-3">
            {['NDA', 'MSA (Master Service Agreement)', 'SOW (Statement of Work)', 'Anexo de Precios', 'Políticas de Compliance'].map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[var(--eva-background)] border border-[var(--eva-border)] rounded hover:border-[var(--eva-primary)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    ✓
                  </div>
                  <span className="text-sm font-medium">{doc}</span>
                </div>
                <button className="text-xs text-[var(--eva-primary)] hover:underline">Ver</button>
              </div>
            ))}
          </div>
        </div>

        {/* Tracker de Pago */}
        <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-5 shadow-sm">
          <h3 className="font-semibold mb-4 border-b border-[var(--eva-border)] pb-2">Tracker de Pagos</h3>
          
          <div className="space-y-6">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                    Completado
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-green-600">
                    30%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                <div style={{ width: "30%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm p-3 bg-[var(--eva-background)] rounded border border-green-200 border-l-4 border-l-green-500">
                <div>
                  <p className="font-bold">Anticipo (30%)</p>
                  <p className="text-xs text-gray-500">Pagado el 12/05/2026</p>
                </div>
                <span className="font-bold">$37,500</span>
              </div>
              
              <div className="flex justify-between text-sm p-3 bg-[var(--eva-background)] rounded border border-[var(--eva-border)]">
                <div>
                  <p className="font-bold">Hito 1: Diseño (30%)</p>
                  <p className="text-xs text-gray-500">Pendiente</p>
                </div>
                <span className="font-bold text-gray-500">$37,500</span>
              </div>

              <div className="flex justify-between text-sm p-3 bg-[var(--eva-background)] rounded border border-[var(--eva-border)]">
                <div>
                  <p className="font-bold">Cierre (40%)</p>
                  <p className="text-xs text-gray-500">Pendiente</p>
                </div>
                <span className="font-bold text-gray-500">$50,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
