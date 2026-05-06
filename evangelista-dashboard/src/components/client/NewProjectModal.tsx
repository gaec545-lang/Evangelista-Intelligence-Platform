import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import { projectsDB, projectActivityLogDB } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { ProjectArea } from '../../lib/types';

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
}

const AREAS: { value: ProjectArea; label: string }[] = [
  { value: 'supply_chain', label: 'Supply Chain' },
  { value: 'finanzas', label: 'Finanzas y Contabilidad' },
  { value: 'operaciones', label: 'Operaciones y Producción' },
  { value: 'ventas', label: 'Ventas y Comercial' },
  { value: 'logistica', label: 'Logística' },
  { value: 'rrhh', label: 'Recursos Humanos' },
  { value: 'tecnologia', label: 'Tecnología e IT' },
  { value: 'multi', label: 'Multi-área' },
];

const DEFAULT_PHASES: Record<ProjectArea, string[]> = {
  supply_chain: ['Scoping', 'Diagnóstico de Datos', 'Análisis', 'Entregables', 'Presentación'],
  finanzas: ['Scoping', 'Auditoría Forense', 'Análisis', 'Dictamen', 'Presentación'],
  operaciones: ['Scoping', 'Mapeo de Procesos AS-IS', 'Análisis', 'Diseño TO-BE', 'Entregables'],
  ventas: ['Scoping', 'Diagnóstico Comercial', 'Análisis', 'Entregables', 'Presentación'],
  logistica: ['Scoping', 'Diagnóstico de Flujos', 'Análisis', 'Entregables', 'Presentación'],
  rrhh: ['Scoping', 'Diagnóstico Organizacional', 'Análisis', 'Entregables', 'Presentación'],
  tecnologia: ['Scoping', 'Auditoría Técnica', 'Análisis', 'Entregables', 'Presentación'],
  multi: ['Scoping', 'Diagnóstico Multi-área', 'Análisis', 'Entregables', 'Presentación'],
};

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ open, onClose, clientId, clientName }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    area: 'supply_chain' as ProjectArea,
    description: '',
  });

  const handleCreate = async () => {
    if (!form.name.trim() || !form.area) return;
    
    setLoading(true);
    console.log('🚀 Iniciando creación de proyecto:', form.name);
    
    try {
      const project = await projectsDB.create({
        client_id: clientId,
        name: form.name.trim(),
        area: form.area,
        description: form.description.trim() || undefined,
        status: 'scoping',
        current_phase: 'scoping',
        complexity_alpha: 0,
        complexity_beta: 0,
        gamma_sources: 1.0,
        travel_expenses: 0,
        created_by: user?.id,
      });
      
      if (!project) {
        throw new Error('No se recibió confirmación del proyecto creado. Verifica los permisos de la base de datos.');
      }

      console.log('✅ Proyecto creado con éxito:', project.id);

      // Log activity
      try {
        await projectActivityLogDB.log({
          project_id: project.id,
          action_type: 'project_created',
          entity_type: 'projects',
          entity_id: project.id,
          description: `Proyecto "${project.name}" creado`,
          performed_by_name: user?.email?.split('@')[0] || 'Consultor',
        });
      } catch (logErr) {
        console.warn('⚠️ No se pudo registrar el log de actividad, pero el proyecto fue creado.', logErr);
      }

      // Create default phases
      const phaseNames = DEFAULT_PHASES[form.area];
      console.log('⏳ Creando fases predeterminadas:', phaseNames);
      
      for (let i = 0; i < phaseNames.length; i++) {
          await projectsDB.createPhase({
              project_id: project.id,
              phase_name: phaseNames[i],
              phase_order: i + 1,
              status: i === 0 ? 'en_curso' : 'pendiente'
          });
      }

      console.log('🏁 Proceso completado. Navegando al workspace...');
      navigate(`/dashboard/projects/${project.id}`);
      onClose();
    } catch (err: any) {
      console.error('💥 Error crítico en handleCreate:', err);
      alert('Error al crear proyecto: ' + (err.message || 'Error desconocido de conexión.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Nuevo Proyecto">
      <div className="space-y-6">
        <p className="text-sm text-white/40">Iniciando nuevo engagement para <span className="text-cream font-medium">{clientName}</span></p>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-widest text-white/40 font-bold ml-1">Nombre del Proyecto *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Ej: Análisis de Inventarios Q2"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream focus:ring-1 focus:ring-architecture/50 focus:border-architecture/50 transition-all outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-widest text-white/40 font-bold ml-1">Área de Negocio *</label>
            <select
              value={form.area}
              onChange={e => setForm({ ...form, area: e.target.value as ProjectArea })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream focus:ring-1 focus:ring-architecture/50 focus:border-architecture/50 transition-all outline-none appearance-none"
            >
              {AREAS.map(area => (
                <option key={area.value} value={area.value} className="bg-black text-cream">
                  {area.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-widest text-white/40 font-bold ml-1">Descripción (Opcional)</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Contexto inicial, objetivos o alcances preliminares..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream focus:ring-1 focus:ring-architecture/50 focus:border-architecture/50 transition-all outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button 
            variant="primary" 
            onClick={handleCreate} 
            isLoading={loading}
            disabled={!form.name.trim()}
            className="flex-1 bg-architecture/20 hover:bg-architecture/30 border border-architecture/50 text-cream"
          >
            Crear Proyecto →
          </Button>
        </div>
      </div>
    </Modal>
  );
};
