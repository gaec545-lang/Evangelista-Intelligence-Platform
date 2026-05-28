import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { Spinner } from '../components/ui/Spinner';
import { Briefcase } from 'lucide-react';

export const ProjectsListPage: React.FC = () => {
  const { projects, loading, error } = useProjects();
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase()) || 
    (p.clients?.name || '').toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in bg-[var(--eva-black)] min-h-screen text-[var(--eva-txt-primary)]">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase size={14} className="text-[var(--eva-olive)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--eva-txt-muted)]">
              Consulting engagements
            </span>
          </div>
          <h1 className="font-brand text-3xl font-medium text-[var(--eva-txt-primary)] leading-tight">
            Engagements Activos
          </h1>
          <p className="font-ui text-sm text-[var(--eva-txt-muted)] mt-1">
            Gestión y seguimiento de proyectos de diagnóstico y arquitectura.
          </p>
        </div>
      </section>
      
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Buscar proyectos..." 
          className="p-3 w-full max-w-md rounded-xl border border-[var(--eva-border)] bg-[var(--eva-surface-2)] text-[var(--eva-txt-primary)] focus:outline-none focus:border-[var(--eva-olive)] transition-all placeholder-[var(--eva-txt-muted)]"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="font-ui text-xs text-[var(--eva-txt-muted)]">Sincronizando portafolio…</p>
        </div>
      ) : error ? (
        <div className="py-12 text-center text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
          Error al cargar proyectos: {error}
        </div>
      ) : (
        <div className="bg-[var(--eva-surface)] rounded-xl shadow overflow-hidden border border-[var(--eva-border)]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--eva-border)] text-left">
              <thead className="bg-[var(--eva-surface-2)] border-b border-[var(--eva-border)] text-[var(--eva-txt-secondary)] text-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Nombre</th>
                  <th className="px-6 py-3 font-medium">Cliente</th>
                  <th className="px-6 py-3 font-medium">Fase Actual</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                  <th className="px-6 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--eva-border)]">
                {filteredProjects.map(project => (
                  <tr key={project.id} className="hover:bg-[var(--eva-surface-2)]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[var(--eva-txt-primary)]">{project.name}</td>
                    <td className="px-6 py-4 text-[var(--eva-txt-secondary)]">{project.clients?.name || 'Cliente'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[#4a5c3a20] text-[var(--eva-olive)] border border-[var(--eva-olive)]/20">
                        {project.current_phase}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${project.status === 'en_ejecucion' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                        ${project.status === 'propuesta_enviada' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                        ${project.status === 'completado' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                        ${project.status === 'pausado' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' : ''}
                        ${project.status === 'cancelado' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                        ${project.status === 'scoping' ? 'bg-[var(--eva-surface-2)] text-[var(--eva-txt-muted)] border border-[var(--eva-border)]' : ''}
                      `}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <button 
                        onClick={() => navigate(`/dashboard/proyectos/${project.id}`)}
                        className="text-[var(--eva-olive)] hover:text-white transition-colors"
                      >
                        Ver Workspace
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--eva-txt-muted)] font-ui text-sm">
                      No se encontraron engagements activos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
