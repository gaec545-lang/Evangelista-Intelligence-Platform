import React, { useState, useEffect } from 'react';
import { MoreVertical, Edit2, ChevronDown } from 'lucide-react';
import { Project } from '../../lib/types';
import { clientsDB } from '../../lib/supabase';
import Button from '../ui/Button';

interface WorkspaceHeaderProps {
  project: Project;
  onProjectUpdate?: (updated: Project) => void;
}

const AREA_COLORS: Record<string, string> = {
  supply_chain: '#4a5c3a',
  finanzas: '#c05538',
  operaciones: '#534ab7',
  ventas: '#0f6e56',
  logistica: '#7a6c4a',
  rrhh: '#6a4a7a',
  tecnologia: '#2a5c7a',
  multi: 'linear-gradient(135deg, #c05538 0%, #534ab7 100%)',
};

export default function WorkspaceHeader({ project, onProjectUpdate }: WorkspaceHeaderProps) {
  const [clientName, setClientName] = useState('...');
  const areaColor = AREA_COLORS[project.area] || AREA_COLORS.multi;

  useEffect(() => {
    clientsDB.get(project.client_id).then(data => { if (data) setClientName(data.name); });
  }, [project.client_id]);

  return (
    <div className="px-6 pt-8 pb-6 bg-white border-b border-eva-border">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          {/* Area pill + label */}
          <div className="flex items-center gap-3">
            <div
              className="px-2.5 py-0.5 rounded text-[9px] uppercase tracking-[0.18em] font-black text-white"
              style={{ background: areaColor }}
            >
              {project.area.replace('_', ' ')}
            </div>
            <span className="text-[10px] font-mono text-eva-txt-faint uppercase tracking-widest">
              Project Workspace
            </span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-4xl font-brand font-medium text-eva-black leading-tight tracking-tight">
              {project.name}
            </h1>
            <p className="text-base font-ui text-eva-txt-muted mt-1">{clientName}</p>
          </div>

          {/* Metadata bar */}
          <div className="flex items-center gap-5 pt-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-eva-txt-faint">Inversión</span>
              <span className="text-[13px] font-mono font-bold text-eva-txt-dark">
                {project.total_price ? `$${project.total_price.toLocaleString()} MXN` : '—'}
              </span>
            </div>
            <div className="w-px h-8 bg-eva-border" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-eva-txt-faint">Estado</span>
              <button className="flex items-center gap-1.5 text-[13px] font-mono font-bold text-eva-olive hover:text-eva-olive-3 transition-colors capitalize">
                {project.status.replace('_', ' ')}
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <div className="w-px h-8 bg-eva-border" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-eva-txt-faint">Última actividad</span>
              <span className="text-[13px] font-mono font-bold text-eva-txt-dark">
                {project.updated_at ? new Date(project.updated_at).toLocaleDateString('es-MX') : 'Hoy'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 flex-shrink-0">
          <Button variant="outline" className="border-eva-border text-eva-txt-mid hover:text-eva-black hover:bg-eva-beige shadow-sm">
            <Edit2 className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" className="border-eva-border px-3 text-eva-txt-mid hover:bg-eva-beige shadow-sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
