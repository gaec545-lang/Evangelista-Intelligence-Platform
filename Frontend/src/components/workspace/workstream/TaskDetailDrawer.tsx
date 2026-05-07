import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, User, DollarSign, Calendar, AlertTriangle, CheckCircle, Lock } from 'lucide-react';
import { WorkstreamTask } from '../../../lib/types';
import { tasksDB } from '../../../lib/supabase';
import Button from '../../ui/Button';

interface TaskDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: WorkstreamTask;
  color: string;
  onUpdate: () => void;
}

export default function TaskDetailDrawer({ isOpen, onClose, task, color, onUpdate }: TaskDetailDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(task.progress_pct);
  const [status, setStatus] = useState(task.status);

  const handleSave = async () => {
    setLoading(true);
    try {
      await tasksDB.update(task.id, {
        progress_pct: progress,
        status: status,
      });
      onUpdate();
    } catch (e) {
      console.error('Error updating task:', e);
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async () => {
    setLoading(true);
    try {
      await tasksDB.update(task.id, {
        status: 'completada',
        progress_pct: 100,
        actual_end: new Date().toISOString().split('T')[0],
      });
      onUpdate();
    } catch (e) {
      console.error('Error completing task:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 border-l border-eva-border flex flex-col"
          >
            {/* Header */}
            <div 
              className="p-6 border-b border-eva-border relative"
              style={{ borderTop: `6px solid ${color}` }}
            >
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-eva-txt-muted hover:text-eva-black hover:bg-eva-beige-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex gap-2 items-center mb-3">
                <span className="text-[10px] text-eva-txt-mid uppercase tracking-widest font-bold bg-eva-beige-2 px-2 py-1 rounded">
                  {task.task_type}
                </span>
                {task.priority === 'critica' && (
                  <span className="text-[10px] text-red-700 uppercase tracking-widest font-bold bg-red-100 px-2 py-1 rounded">
                    Crítica
                  </span>
                )}
              </div>
              
              <h2 className="text-2xl font-brand text-eva-black leading-tight pr-8">
                {task.name}
              </h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              <div className="space-y-4">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-sm font-medium text-eva-txt-mid">Progreso</span>
                  <span className="text-lg font-mono text-eva-black">{progress}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                  className="w-full accent-eva-olive h-2 bg-eva-beige-2 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-widest text-eva-txt-muted font-bold">Detalles</h3>
                
                <div className="bg-eva-beige/30 border border-eva-border rounded-lg p-4 space-y-3">
                  <div className="flex gap-3 text-sm">
                    <User size={16} className="text-eva-txt-muted mt-0.5" />
                    <div>
                      <p className="text-eva-txt-faint text-xs">Responsable</p>
                      <p className="text-eva-black">{task.responsible_name || 'No asignado'}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 text-sm">
                    <Calendar size={16} className="text-eva-txt-muted mt-0.5" />
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <div>
                        <p className="text-eva-txt-faint text-xs">Planificado</p>
                        <p className="text-eva-black">{task.planned_start ? new Date(task.planned_start).toLocaleDateString() : '—'} a {task.planned_end ? new Date(task.planned_end).toLocaleDateString() : '—'}</p>
                      </div>
                    </div>
                  </div>

                  {(task.estimated_cost || task.actual_cost) && (
                    <div className="flex gap-3 text-sm">
                      <DollarSign size={16} className="text-eva-txt-muted mt-0.5" />
                      <div className="grid grid-cols-2 gap-4 w-full">
                        <div>
                          <p className="text-eva-txt-faint text-xs">Costo Estimado</p>
                          <p className="text-eva-black font-mono">${task.estimated_cost?.toLocaleString() || 0}</p>
                        </div>
                        <div>
                          <p className="text-eva-txt-faint text-xs">Costo Real</p>
                          <p className="text-eva-black font-mono">${task.actual_cost?.toLocaleString() || 0}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {task.description && (
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-widest text-eva-txt-muted font-bold">Descripción</h3>
                  <p className="text-sm text-eva-txt-mid leading-relaxed whitespace-pre-wrap bg-eva-beige/20 p-4 rounded-lg border border-eva-border/50">
                    {task.description}
                  </p>
                </div>
              )}

              {task.status === 'bloqueada' && task.blocker_description && (
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-widest text-red-500 font-bold flex items-center gap-2">
                    <Lock size={14} /> Bloqueo Activo
                  </h3>
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-sm text-red-700">{task.blocker_description}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-widest text-eva-txt-muted font-bold">Estado</h3>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-eva-border bg-white text-sm outline-none focus:border-eva-olive transition-colors"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="en_revision">En Revisión</option>
                  <option value="bloqueada">Bloqueada</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-eva-border bg-eva-beige/30 flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleSave}
                disabled={loading}
              >
                Guardar Cambios
              </Button>
              {status !== 'completada' && (
                <Button 
                  variant="primary" 
                  className="flex-1 bg-green-600 hover:bg-green-700 border-green-700"
                  onClick={markCompleted}
                  disabled={loading}
                >
                  <CheckCircle size={16} className="mr-2" /> Completar
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
