import React from 'react';

export const DatosTab: React.FC = () => {
  return (
    <div className="h-full flex flex-col space-y-6">
      <h2 className="text-2xl font-bold text-[var(--eva-primary)]">Fase 6: Datos</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Carga de Datos y Anomalías */}
        <div className="flex flex-col gap-6">
          <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-5 shadow-sm">
            <h3 className="font-semibold mb-4 border-b border-[var(--eva-border)] pb-2">Carga de CSVs / Integración</h3>
            <div className="border-2 border-dashed border-[var(--eva-border)] rounded-lg p-8 flex flex-col items-center justify-center bg-[var(--eva-background)] hover:bg-[var(--eva-surface-hover)] transition-colors cursor-pointer">
              <svg className="w-12 h-12 text-[var(--eva-primary)] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <p className="font-medium">Arrastra tus archivos aquí o haz clic para subir</p>
              <p className="text-xs text-[var(--eva-text-muted)] mt-1">Soporta .csv, .xlsx, .json</p>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between p-2 bg-[var(--eva-background)] border border-[var(--eva-border)] rounded text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>ventas_q1_2026.csv</span>
                </div>
                <span className="text-xs text-gray-500">2.4 MB</span>
              </div>
            </div>
          </div>

          <div className="bg-[var(--eva-surface)] border border-yellow-500/20 rounded-lg p-5 shadow-sm flex-1">
            <h3 className="font-semibold mb-4 border-b border-yellow-500/20 pb-2 flex items-center gap-2">
              <span className="text-yellow-500">⚠️</span> Anomalías Estadísticas Detectadas
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded text-sm">
                <span className="font-bold">Columna 'Revenue':</span> 5% de valores atípicos encontrados (&gt;3 desviaciones estándar).
              </div>
              <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-sm">
                <span className="font-bold">Valores Nulos:</span> La columna 'CustomerID' tiene 12% de valores vacíos.
              </div>
            </div>
          </div>
        </div>

        {/* Perfil DAMA-DMBOK */}
        <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-5 shadow-sm flex flex-col">
          <h3 className="font-semibold mb-4 border-b border-[var(--eva-border)] pb-2">Perfil DAMA-DMBOK</h3>
          
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Data Governance</span>
                  <span className="font-bold">Nivel 2 (Reactivo)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: "40%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Data Quality</span>
                  <span className="font-bold">Nivel 3 (Proactivo)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Data Security</span>
                  <span className="font-bold">Nivel 4 (Gestionado)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>
            </div>

            <div className="mt-auto p-4 bg-[var(--eva-background)] border border-[var(--eva-border)] border-dashed rounded text-center text-sm text-[var(--eva-text-muted)]">
              [Visualización Radar Chart DAMA]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
