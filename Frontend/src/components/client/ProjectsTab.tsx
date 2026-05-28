import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Briefcase, ChevronRight, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { useProjects } from '../../hooks/useProjects';
import { NewProjectModal } from './NewProjectModal';
import { Project } from '../../lib/types';

interface ProjectsTabProps {
  clientId: string;
  clientName: string;
}

const AREA_COLORS: Record<string, string> = {
  supply_chain: '#4a5c3a', // Olive
  finanzas: '#c05538',     // Foundation
  operaciones: '#534ab7',   // Architecture
  ventas: '#0f6e56',       // Sentinel
  logistica: '#7a6c4a',
  rrhh: '#6a4a7a',
  tecnologia: '#2a5c7a',
  multi: 'linear-gradient(135deg, #c05538 0%, #534ab7 100%)',
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  scoping: { label: 'Scoping', color: 'bg-[var(--eva-surface-2)] border border-[var(--eva-border)] text-[var(--eva-txt-muted)]' },
  propuesta_enviada: { label: 'Propuesta', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  en_ejecucion: { label: 'En Ejecución', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
  entrega: { label: 'Entrega', color: 'bg-orange-500/10 text-orange-400 border border-orange-500/20' },
  completado: { label: 'Completado', color: 'bg-green-500/10 text-green-400 border border-green-500/20' },
  pausado: { label: 'Pausado', color: 'bg-[var(--eva-surface-2)] text-[var(--eva-txt-muted)] border border-[var(--eva-border)]' },
  cancelado: { label: 'Cancelado', color: 'bg-red-500/10 text-red-400 border border-red-500/20' },
};

const ProjectCard: React.FC<{ project: Project; onClick: () => void }> = ({ project, onClick }) => {
  const status = STATUS_LABELS[project.status] || STATUS_LABELS.scoping;
  const areaColor = AREA_COLORS[project.area] || AREA_COLORS.multi;
  
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <Card className="p-5 bg-[var(--eva-surface)] border border-[var(--eva-border)] hover:border-[var(--eva-olive)]/50 transition-all h-full flex flex-col shadow-card">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-2">
            <div 
              className="px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold text-white w-fit"
              style={{ background: areaColor, opacity: 0.8 }}
            >
              {project.area.replace('_', ' ')}
            </div>
            <h4 className="text-lg font-serif text-[var(--eva-txt-primary)] leading-tight group-hover:text-[var(--eva-olive)] transition-colors">
              {project.name}
            </h4>
          </div>
          <div className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-bold flex items-center ${status.color}`}>
            {status.label}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-tighter text-eva-txt-muted">Fase Actual</p>
              <p className="text-xs text-[var(--eva-txt-primary)] font-medium">{project.current_phase}</p>
            </div>
            {project.total_price && (
                <div className="text-right">
                   <p className="text-[10px] uppercase tracking-tighter text-eva-txt-muted">Precio Final</p>
                   <p className="text-xs text-[var(--eva-olive)] font-mono">${project.total_price.toLocaleString()} MXN</p>
                </div>
            )}
          </div>
          
          <div className="w-full h-1 bg-[var(--eva-surface-2)] rounded-full overflow-hidden border border-[var(--eva-border)]">
             {/* Dynamic progress bar based on status placeholder */}
             <div 
               className="h-full bg-[var(--eva-olive)] transition-all duration-1000" 
               style={{ width: project.status === 'completado' ? '100%' : project.status === 'en_ejecucion' ? '40%' : '10%' }}
             />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--eva-border)] flex justify-between items-center">
          <span className="text-[10px] text-[var(--eva-txt-muted)] font-mono">
            ID: {project.id.slice(0, 8).toUpperCase()}
          </span>
          <div className="flex items-center gap-2 text-xs text-[var(--eva-olive)] opacity-85 group-hover:opacity-100 transition-colors font-medium">
            Gestionar <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const ProjectsTab: React.FC<ProjectsTabProps> = ({ clientId, clientName }) => {
  const navigate = useNavigate();
  const { projects, loading, error } = useProjects(clientId);
  const [showModal, setShowModal] = useState(false);

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center gap-4">
      <Spinner size="md" />
      <p className="text-xs text-[var(--eva-txt-muted)] uppercase tracking-widest">Cargando portafolio...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-serif text-[var(--eva-txt-primary)]">Proyectos del Cliente</h3>
          <p className="text-sm text-[var(--eva-txt-secondary)]">Gestiona los diagnósticos y la arquitectura activa de esta cuenta.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowModal(true)}
          className="bg-[var(--eva-olive)] hover:bg-[var(--eva-olive)]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Proyecto
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="py-20 border-2 border-dashed border-[var(--eva-border)] bg-[var(--eva-surface)] rounded-2xl flex flex-col items-center justify-center text-center">
           <Briefcase className="w-12 h-12 text-eva-txt-faint mb-4" />
           <h4 className="text-lg font-serif text-[var(--eva-txt-primary)] mb-2">No hay proyectos activos</h4>
           <p className="text-xs text-[var(--eva-txt-muted)] max-w-xs mb-8">
             Inicia el primer proyecto de consultoría estratégica para transformar este cliente.
           </p>
           <Button variant="outline" onClick={() => setShowModal(true)} className="border-[var(--eva-border)] text-[var(--eva-txt-muted)] hover:text-[var(--eva-txt-primary)]">
             Crear Primer Proyecto
           </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => navigate(`/dashboard/proyectos/${project.id}`)} 
            />
          ))}
          {/* Add Project Card Placeholder */}
          <button 
            onClick={() => setShowModal(true)}
            className="group rounded-2xl border-2 border-dashed border-[var(--eva-border)] bg-[var(--eva-surface)] hover:bg-[var(--eva-surface-hover)] hover:border-[var(--eva-olive)]/30 transition-all p-8 flex flex-col items-center justify-center text-center opacity-70 hover:opacity-100"
          >
            <Plus className="w-8 h-8 mb-2 text-[var(--eva-txt-muted)] group-hover:text-[var(--eva-olive)] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-serif uppercase tracking-widest text-[var(--eva-txt-muted)] group-hover:text-[var(--eva-olive)] font-medium">Añadir Proyecto</span>
          </button>
        </div>
      )}

      <NewProjectModal 
        open={showModal} 
        onClose={() => setShowModal(false)} 
        clientId={clientId} 
        clientName={clientName} 
      />
    </div>
  );
};

export default ProjectsTab;
