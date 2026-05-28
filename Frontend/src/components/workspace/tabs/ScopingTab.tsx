import React, { useState } from 'react';

export const ScopingTab: React.FC = () => {
  const [notes, setNotes] = useState('');
  
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[var(--eva-primary)]">Fase 1: Scoping</h2>
        <button className="bg-[var(--eva-primary)] hover:bg-[var(--eva-primary-dark)] text-white px-4 py-2 rounded shadow transition-colors">
          Generar Dictamen
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        {/* Notas */}
        <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-4 flex flex-col shadow-sm">
          <h3 className="font-semibold mb-3 border-b border-[var(--eva-border)] pb-2">Notas Rápidas</h3>
          <textarea 
            className="flex-1 w-full p-2 bg-[var(--eva-background)] border border-[var(--eva-border)] rounded resize-none focus:outline-none focus:ring-1 focus:ring-[var(--eva-primary)]"
            placeholder="Escribe notas aquí..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        {/* Issue Tree MECE */}
        <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-4 flex flex-col shadow-sm">
          <h3 className="font-semibold mb-3 border-b border-[var(--eva-border)] pb-2">Issue Tree (MECE)</h3>
          <div className="flex-1 bg-[var(--eva-background)] border border-[var(--eva-border)] border-dashed rounded flex items-center justify-center text-[var(--eva-text-muted)] text-sm">
            [Visualizador de Issue Tree MECE]
          </div>
        </div>

        {/* COI Calculator */}
        <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-4 flex flex-col shadow-sm">
          <h3 className="font-semibold mb-3 border-b border-[var(--eva-border)] pb-2">COI Calculator (3D)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[var(--eva-text-muted)] mb-1">Impacto (X)</label>
              <input type="range" className="w-full" />
            </div>
            <div>
              <label className="block text-xs text-[var(--eva-text-muted)] mb-1">Esfuerzo (Y)</label>
              <input type="range" className="w-full" />
            </div>
            <div>
              <label className="block text-xs text-[var(--eva-text-muted)] mb-1">Riesgo (Z)</label>
              <input type="range" className="w-full" />
            </div>
            <div className="mt-4 p-3 bg-[var(--eva-primary-light)] text-[var(--eva-primary-dark)] rounded text-center font-bold">
              Score COI: 85/100
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
