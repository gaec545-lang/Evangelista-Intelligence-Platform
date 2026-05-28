import React, { useState } from 'react';

export const WorkstreamsTab: React.FC = () => {
  const [view, setView] = useState<'pm' | 'kanban' | 'gantt'>('kanban');

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[var(--eva-primary)]">Fase 5: Workstreams</h2>
        <div className="flex bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-md overflow-hidden">
          <button 
            className={`px-4 py-2 text-sm ${view === 'pm' ? 'bg-[var(--eva-primary)] text-white' : 'hover:bg-[var(--eva-surface-hover)]'}`}
            onClick={() => setView('pm')}
          >
            PM Design
          </button>
          <button 
            className={`px-4 py-2 text-sm border-l border-r border-[var(--eva-border)] ${view === 'kanban' ? 'bg-[var(--eva-primary)] text-white' : 'hover:bg-[var(--eva-surface-hover)]'}`}
            onClick={() => setView('kanban')}
          >
            Kanban
          </button>
          <button 
            className={`px-4 py-2 text-sm ${view === 'gantt' ? 'bg-[var(--eva-primary)] text-white' : 'hover:bg-[var(--eva-surface-hover)]'}`}
            onClick={() => setView('gantt')}
          >
            Timeline Gantt
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-lg p-5 shadow-sm overflow-hidden">
        {view === 'pm' && (
          <div className="h-full flex flex-col">
            <h3 className="font-semibold mb-4 border-b border-[var(--eva-border)] pb-2">PM Design (WBS, Sprints, RACI)</h3>
            <div className="flex-1 grid grid-cols-3 gap-4">
              <div className="border border-[var(--eva-border)] p-4 rounded bg-[var(--eva-background)]">
                <h4 className="font-bold text-sm mb-2 text-[var(--eva-primary)]">Work Breakdown Structure</h4>
                <ul className="text-xs space-y-1 ml-4 list-disc text-gray-600">
                  <li>1.0 Planeación</li>
                  <li>2.0 Ejecución</li>
                  <li>3.0 Monitoreo</li>
                </ul>
              </div>
              <div className="border border-[var(--eva-border)] p-4 rounded bg-[var(--eva-background)]">
                <h4 className="font-bold text-sm mb-2 text-[var(--eva-primary)]">Sprints</h4>
                <div className="text-xs space-y-2">
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded">Sprint 1 (Activo)</div>
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded text-gray-500">Sprint 2</div>
                </div>
              </div>
              <div className="border border-[var(--eva-border)] p-4 rounded bg-[var(--eva-background)]">
                <h4 className="font-bold text-sm mb-2 text-[var(--eva-primary)]">Matriz RACI</h4>
                <table className="w-full text-xs text-left">
                  <thead><tr className="border-b"><th className="pb-1">Tarea</th><th className="pb-1">PM</th><th className="pb-1">Dev</th></tr></thead>
                  <tbody>
                    <tr><td className="py-1">Setup</td><td>A</td><td>R</td></tr>
                    <tr><td className="py-1">Deploy</td><td>C</td><td>R</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {view === 'kanban' && (
          <div className="h-full flex flex-col">
            <h3 className="font-semibold mb-4 border-b border-[var(--eva-border)] pb-2">Kanban Board</h3>
            <div className="flex-1 flex gap-4 overflow-x-auto pb-2">
              {/* To Do */}
              <div className="w-72 bg-[var(--eva-background)] border border-[var(--eva-border)] rounded-lg flex flex-col flex-shrink-0">
                <div className="p-3 border-b border-[var(--eva-border)] font-bold text-sm">To Do <span className="bg-gray-200 text-gray-700 py-0.5 px-2 rounded-full text-xs ml-2">3</span></div>
                <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                  <div className="bg-[var(--eva-surface)] p-3 border border-[var(--eva-border)] shadow-sm rounded cursor-move hover:border-[var(--eva-primary)] transition-colors">
                    <p className="text-sm font-medium">Definir esquema BD</p>
                    <div className="mt-2 flex justify-between items-center text-xs text-gray-500"><span>Sprint 1</span><span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">JD</span></div>
                  </div>
                  <div className="bg-[var(--eva-surface)] p-3 border border-[var(--eva-border)] shadow-sm rounded cursor-move hover:border-[var(--eva-primary)] transition-colors">
                    <p className="text-sm font-medium">Configurar CI/CD</p>
                  </div>
                </div>
              </div>
              
              {/* In Progress */}
              <div className="w-72 bg-[var(--eva-background)] border border-[var(--eva-border)] rounded-lg flex flex-col flex-shrink-0">
                <div className="p-3 border-b border-[var(--eva-border)] font-bold text-sm">In Progress <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs ml-2">1</span></div>
                <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                  <div className="bg-[var(--eva-surface)] p-3 border border-blue-300 shadow-sm rounded cursor-move">
                    <p className="text-sm font-medium">Implementar Auth</p>
                  </div>
                </div>
              </div>

              {/* Done */}
              <div className="w-72 bg-[var(--eva-background)] border border-[var(--eva-border)] rounded-lg flex flex-col flex-shrink-0">
                <div className="p-3 border-b border-[var(--eva-border)] font-bold text-sm">Done <span className="bg-green-100 text-green-700 py-0.5 px-2 rounded-full text-xs ml-2">5</span></div>
                <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                  <div className="bg-[var(--eva-surface)] p-3 border border-[var(--eva-border)] shadow-sm rounded opacity-60">
                    <p className="text-sm font-medium line-through">Setup Repositorio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'gantt' && (
          <div className="h-full flex flex-col">
            <h3 className="font-semibold mb-4 border-b border-[var(--eva-border)] pb-2">Timeline Gantt</h3>
            <div className="flex-1 bg-[var(--eva-background)] border border-[var(--eva-border)] border-dashed rounded flex items-center justify-center text-[var(--eva-text-muted)] text-sm">
              [Visualizador de Diagrama Gantt interactivo]
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
