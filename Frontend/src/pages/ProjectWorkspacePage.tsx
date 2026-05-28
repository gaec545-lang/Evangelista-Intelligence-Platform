import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../hooks/useProjects';
import { Spinner } from '../components/ui/Spinner';
import { ArrowLeft, Lock } from 'lucide-react';

import { ScopingTab } from '../components/workspace/tabs/ScopingTab';
import { PropuestaTab } from '../components/workspace/tabs/PropuestaTab';
import { ContratoTab } from '../components/workspace/tabs/ContratoTab';
import { DisenoTab } from '../components/workspace/tabs/DisenoTab';
import { WorkstreamsTab } from '../components/workspace/tabs/WorkstreamsTab';
import { DatosTab } from '../components/workspace/tabs/DatosTab';
import { AnalisisTab } from '../components/workspace/tabs/AnalisisTab';
import { VerificacionTab } from '../components/workspace/tabs/VerificacionTab';
import { CierreTab } from '../components/workspace/tabs/CierreTab';

const PHASES = [
  'Scoping', 'Propuesta', 'Contrato', 'Diseño', 
  'Workstreams', 'Datos', 'Análisis', 'Verificación', 'Cierre'
];

export const ProjectWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, phases, loading, error } = useProject(id);
  const [activeTab, setActiveTab] = useState(0);

  // Default unlocked phases logic (Scoping, Propuesta, Contrato are unlocked by default)
  // Design and beyond can unlock dynamically or we allow active progression
  const [unlockedPhases, setUnlockedPhases] = useState(8); // Fully unlocked for staff browse as per brief

  useEffect(() => {
    if (project?.name) {
      document.title = `${project.name} | Workspace EIP`;
    }
  }, [project]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[var(--eva-black)]">
        <Spinner size="lg" />
        <p className="text-xs text-[var(--eva-txt-muted)] uppercase tracking-widest">Sincronizando Workspace...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--eva-black)] text-[var(--eva-txt-primary)]">
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center max-w-md">
          <h3 className="font-brand text-lg font-bold mb-2">Error de Workspace</h3>
          <p className="text-sm opacity-80">{error || 'No se pudo cargar el espacio de trabajo de este proyecto.'}</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/proyectos')} 
          className="px-4 py-2 border border-[var(--eva-border)] text-sm rounded-lg hover:bg-[var(--eva-surface-2)] transition-all"
        >
          Volver a Proyectos
        </button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: return <ScopingTab />;
      case 1: return <PropuestaTab />;
      case 2: return <ContratoTab />;
      case 3: return <DisenoTab />;
      case 4: return <WorkstreamsTab />;
      case 5: return <DatosTab />;
      case 6: return <AnalisisTab />;
      case 7: return <VerificacionTab />;
      case 8: return <CierreTab />;
      default: return <ScopingTab />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--eva-black)] text-[var(--eva-txt-primary)] animate-fade-in">
      {/* Breadcrumb Header */}
      <div className="p-4 border-b border-[var(--eva-border)] bg-[var(--eva-surface)] text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/dashboard/proyectos')}
            className="p-1 hover:bg-[var(--eva-surface-2)] rounded transition-all text-[var(--eva-txt-muted)] hover:text-white"
          >
            <ArrowLeft size={14} />
          </button>
          <span 
            className="text-[var(--eva-txt-muted)] cursor-pointer hover:text-[var(--eva-olive)]"
            onClick={() => navigate('/dashboard/clientes')}
          >
            Clientes
          </span>
          <span className="text-[var(--eva-txt-muted)]">/</span>
          <span className="text-[var(--eva-txt-secondary)]">{project.clients?.name || 'Cliente'}</span>
          <span className="text-[var(--eva-txt-muted)]">/</span>
          <span className="font-semibold text-white">{project.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[var(--eva-txt-muted)] uppercase">Status:</span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {project.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* 9-Phase Status Bar */}
      <div className="flex bg-[var(--eva-surface)] p-3 overflow-x-auto border-b border-[var(--eva-border)] gap-2 select-none scrollbar-hide">
        {PHASES.map((phase, index) => {
          const isUnlocked = index <= unlockedPhases;
          const isActive = index === activeTab;
          return (
            <button
              key={phase}
              disabled={!isUnlocked}
              onClick={() => setActiveTab(index)}
              className={`
                flex-1 min-w-[120px] px-4 py-2.5 rounded-xl transition-all text-xs font-semibold flex items-center justify-center gap-2 border
                ${isActive 
                  ? 'bg-[var(--eva-olive)] text-white border-transparent shadow-lg shadow-[var(--eva-olive)]/15 scale-[1.02]' 
                  : isUnlocked 
                    ? 'bg-[var(--eva-surface-2)] hover:bg-[var(--eva-surface)] border-[var(--eva-border)] text-[var(--eva-txt-secondary)] hover:text-white' 
                    : 'bg-transparent border-dashed border-[var(--eva-border)] text-[var(--eva-txt-muted)] cursor-not-allowed opacity-40'}
              `}
            >
              {!isUnlocked && <Lock size={12} className="opacity-60" />}
              {phase}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {renderTabContent()}
      </div>
    </div>
  );
};
