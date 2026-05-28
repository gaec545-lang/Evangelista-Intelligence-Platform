import React, { useState } from 'react';

export const PropuestaTab: React.FC = () => {
  return (
    <div className="h-full flex flex-col space-y-6">
      <h2 className="text-2xl font-bold text-[var(--eva-primary)]">Fase 2: Propuesta</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Selector de Intervención */}
          <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-5 shadow-sm">
            <h3 className="font-semibold mb-4 border-b border-[var(--eva-border)] pb-2">Selector de Intervención</h3>
            <select className="w-full p-2 bg-[var(--eva-background)] border border-[var(--eva-border)] rounded text-[var(--eva-text)] focus:ring-1 focus:ring-[var(--eva-primary)]">
              <option>Transformación Digital Core</option>
              <option>Optimización de Procesos (Lean)</option>
              <option>Estrategia de Go-To-Market</option>
            </select>
          </div>

          {/* KPIs */}
          <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-5 shadow-sm">
            <h3 className="font-semibold mb-4 border-b border-[var(--eva-border)] pb-2">KPIs Objetivo</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between p-2 bg-[var(--eva-background)] rounded">
                <span>Reducción de Costos</span>
                <span className="font-bold text-green-600">15%</span>
              </li>
              <li className="flex justify-between p-2 bg-[var(--eva-background)] rounded">
                <span>Aumento de Revenue</span>
                <span className="font-bold text-green-600">8%</span>
              </li>
            </ul>
          </div>

          {/* Calculadora Fee */}
          <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-5 shadow-sm">
            <h3 className="font-semibold mb-4 border-b border-[var(--eva-border)] pb-2">Calculadora Fee</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm">Fee Estimado:</span>
              <span className="text-2xl font-bold text-[var(--eva-primary)]">$125,000 USD</span>
            </div>
          </div>
        </div>

        {/* Validación PyMuPDF 4 slots */}
        <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-5 shadow-sm flex flex-col">
          <h3 className="font-semibold mb-4 border-b border-[var(--eva-border)] pb-2">Validación PyMuPDF (Slots)</h3>
          <div className="flex-1 grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(slot => (
              <div key={slot} className="border-2 border-dashed border-[var(--eva-border)] rounded-lg flex flex-col items-center justify-center p-4 bg-[var(--eva-background)] hover:bg-[var(--eva-surface-hover)] transition-colors cursor-pointer">
                <svg className="w-8 h-8 text-[var(--eva-text-muted)] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                <span className="text-xs text-[var(--eva-text-muted)]">Slot {slot}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
