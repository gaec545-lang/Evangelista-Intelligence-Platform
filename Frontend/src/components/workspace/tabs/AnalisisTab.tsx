import React, { useState } from 'react';

export const AnalisisTab: React.FC = () => {
  const [message, setMessage] = useState('');
  
  return (
    <div className="h-full flex flex-col space-y-4">
      <h2 className="text-2xl font-bold text-[var(--eva-primary)]">Fase 7: Análisis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Hipótesis */}
        <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-4 shadow-sm flex flex-col">
          <h3 className="font-semibold mb-3 border-b border-[var(--eva-border)] pb-2 text-[var(--eva-primary)]">Hipótesis de Trabajo</h3>
          <ul className="space-y-3 flex-1 overflow-y-auto pr-2">
            <li className="p-3 bg-[var(--eva-background)] border border-[var(--eva-border)] rounded text-sm">
              <p className="font-medium mb-1">H1: Cuello de botella en logística</p>
              <p className="text-xs text-gray-500">El tiempo de entrega ha aumentado un 20% afectando retención.</p>
              <div className="mt-2 flex gap-2">
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs rounded">En testing</span>
              </div>
            </li>
            <li className="p-3 bg-[var(--eva-background)] border border-green-500/20 rounded text-sm">
              <p className="font-medium mb-1">H2: Sobreprecio en proveedores</p>
              <p className="text-xs text-gray-500">Concentración de compras en Top 3 proveedores genera markup.</p>
              <div className="mt-2 flex gap-2">
                <span className="px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 text-xs rounded">Validada</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Hallazgos GO/NO-GO */}
        <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-4 shadow-sm flex flex-col">
          <h3 className="font-semibold mb-3 border-b border-[var(--eva-border)] pb-2 text-[var(--eva-primary)]">Hallazgos & GO/NO-GO</h3>
          
          <div className="flex-1 space-y-4 overflow-y-auto">
            <div className="p-4 bg-green-500/10 border border-green-500/20 border-l-4 border-l-green-500 rounded shadow-sm">
              <h4 className="font-bold text-green-400">Oportunidad de Ahorro: $2.5M</h4>
              <p className="text-sm mt-1 text-green-400/90">Consolidación de contratos SaaS en múltiples departamentos.</p>
              <div className="mt-3 flex justify-end gap-2">
                <button className="bg-green-600 text-white px-3 py-1 text-xs rounded font-bold">GO</button>
                <button className="bg-slate-700 text-slate-200 hover:bg-slate-600 px-3 py-1 text-xs rounded">NO-GO</button>
              </div>
            </div>
            
            <div className="p-4 bg-red-500/10 border border-red-500/20 border-l-4 border-l-red-500 rounded shadow-sm">
              <h4 className="font-bold text-red-400">Expansión Mercado APAC</h4>
              <p className="text-sm mt-1 text-red-400/90">Riesgo regulatorio alto. CAC excede LTV proyectado.</p>
              <div className="mt-3 flex justify-end gap-2">
                <button className="bg-slate-700 text-slate-200 hover:bg-slate-600 px-3 py-1 text-xs rounded">GO</button>
                <button className="bg-red-600 text-white px-3 py-1 text-xs rounded font-bold">NO-GO</button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Agentes (Chat Simulado) */}
        <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg flex flex-col shadow-sm overflow-hidden">
          <div className="p-3 bg-[var(--eva-primary)] text-white font-semibold flex items-center justify-between">
            <span>Evangelista AI Agents</span>
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
          </div>
          
          <div className="flex-1 p-4 bg-[var(--eva-background)] overflow-y-auto flex flex-col gap-3">
            <div className="self-start bg-[var(--eva-surface)] border border-[var(--eva-border)] p-3 rounded-lg rounded-tl-none max-w-[85%] text-sm">
              He procesado el dataset de ventas. Confirmado: la caída de revenue en Q3 correlaciona con la escasez del componente X.
              <span className="block mt-1 text-[10px] text-gray-400">Agente Analista • 10:42 AM</span>
            </div>
            
            <div className="self-end bg-[var(--eva-primary-light)] text-[var(--eva-primary-dark)] p-3 rounded-lg rounded-tr-none max-w-[85%] text-sm">
              ¿Puedes proyectar el impacto si cambiamos al proveedor Y?
              <span className="block mt-1 text-[10px] opacity-70">Tú • 10:45 AM</span>
            </div>
          </div>
          
          <div className="p-3 border-t border-[var(--eva-border)] bg-[var(--eva-surface)] flex gap-2">
            <input 
              type="text" 
              className="flex-1 border border-[var(--eva-border)] rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--eva-primary)] bg-[var(--eva-background)]"
              placeholder="Pregunta a los agentes..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <button className="bg-[var(--eva-primary)] text-white px-4 py-2 rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
