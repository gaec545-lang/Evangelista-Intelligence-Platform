import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { WorkstreamTask } from '../../../lib/types';
import { tasksDB } from '../../../lib/supabase';
import Button from '../../ui/Button';

interface NewTaskModalProps {
  projectId: string;
  workstreamId: string;
  tasks: WorkstreamTask[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewTaskModal({ projectId, workstreamId, tasks, onClose, onSuccess }: NewTaskModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    task_type: 'tarea' as any,
    priority: 'media' as any,
    description: '',
    responsible_name: '',
    planned_start: '',
    planned_end: '',
    depends_on: [] as string[],
    estimated_cost: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await tasksDB.create({
        project_id: projectId,
        workstream_id: workstreamId,
        name: formData.name,
        task_type: formData.task_type,
        priority: formData.priority,
        description: formData.description || undefined,
        responsible_name: formData.responsible_name || undefined,
        responsible_type: 'interno',
        planned_start: formData.planned_start || undefined,
        planned_end: formData.planned_end || undefined,
        depends_on: formData.depends_on.length > 0 ? formData.depends_on : undefined,
        estimated_cost: formData.estimated_cost || undefined,
        progress_pct: 0,
        status: 'pendiente',
        display_order: 0,
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error al crear la tarea.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-eva-black/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-white rounded-2xl shadow-modal w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="px-6 py-4 border-b border-eva-border flex justify-between items-center bg-eva-beige/30">
            <h2 className="text-xl font-brand text-eva-black">Nueva Tarea</h2>
            <button onClick={onClose} className="p-2 text-eva-txt-muted hover:text-eva-black hover:bg-eva-beige-2 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            <form id="new-task-form" onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-sm font-medium text-eva-txt-mid mb-1">Nombre de la tarea *</label>
                <input 
                  required autoFocus
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg border border-eva-border focus:border-eva-olive outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-eva-txt-mid mb-1">Tipo</label>
                  <select 
                    value={formData.task_type}
                    onChange={e => setFormData({...formData, task_type: e.target.value as any})}
                    className="w-full px-4 py-2.5 rounded-lg border border-eva-border focus:border-eva-olive outline-none bg-white"
                  >
                    <option value="tarea">Tarea general</option>
                    <option value="entregable">Entregable</option>
                    <option value="hito">Hito / Milestone</option>
                    <option value="reunion">Reunión</option>
                    <option value="revision">Revisión QA</option>
                    <option value="instalacion">Instalación Física</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-eva-txt-mid mb-1">Prioridad</label>
                  <select 
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value as any})}
                    className="w-full px-4 py-2.5 rounded-lg border border-eva-border focus:border-eva-olive outline-none bg-white"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica 🔴</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-eva-txt-mid mb-1">Descripción</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg border border-eva-border focus:border-eva-olive outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-eva-txt-mid mb-1">Responsable</label>
                <input 
                  type="text" 
                  value={formData.responsible_name}
                  onChange={e => setFormData({...formData, responsible_name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg border border-eva-border focus:border-eva-olive outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-eva-txt-mid mb-1">Inicio planificado</label>
                  <input 
                    type="date" 
                    value={formData.planned_start}
                    onChange={e => setFormData({...formData, planned_start: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-eva-border focus:border-eva-olive outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-eva-txt-mid mb-1">Fin planificado</label>
                  <input 
                    type="date" 
                    value={formData.planned_end}
                    onChange={e => setFormData({...formData, planned_end: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-eva-border focus:border-eva-olive outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-eva-txt-mid mb-1">Costo estimado (MXN)</label>
                <input 
                  type="number" 
                  value={formData.estimated_cost}
                  onChange={e => setFormData({...formData, estimated_cost: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2.5 rounded-lg border border-eva-border focus:border-eva-olive outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-eva-txt-mid mb-1">Depende de (opcional)</label>
                <select 
                  multiple
                  value={formData.depends_on}
                  onChange={e => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData({...formData, depends_on: values});
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border border-eva-border focus:border-eva-olive outline-none bg-white min-h-[100px]"
                >
                  {tasks.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <p className="text-xs text-eva-txt-faint mt-1">Mantén presionado Cmd/Ctrl para seleccionar múltiples.</p>
              </div>

            </form>
          </div>

          <div className="px-6 py-4 border-t border-eva-border bg-eva-beige/30 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" form="new-task-form" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Tarea'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
