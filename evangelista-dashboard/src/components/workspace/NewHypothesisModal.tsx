import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import { Target, GitCommit } from 'lucide-react';
import { hypothesesDB, projectActivityLogDB } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { Hypothesis, HypothesisStatus, ProjectArea } from '../../lib/types';

interface NewHypothesisModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  projectArea: ProjectArea;
  onSave: () => void;
  initialData?: Partial<Hypothesis> | null;
  parentOptions: Hypothesis[];
}

const FRAMEWORKS = [
  'MECE', 'Issue Tree', 'Hypothesis-Driven', 'COI', 'Pyramid Principle',
  'ALCOA+', 'COSO / ERM', 'Unit Economics', 'GQM', 'Six Sigma (DMAIC)',
  'Lean / VSM', 'Kimball', 'Data Contracts', 'Vigilancia Predictiva', 'Otro'
];

export function NewHypothesisModal({ open, onClose, projectId, projectArea, onSave, initialData, parentOptions }: NewHypothesisModalProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const [form, setForm] = useState({
    statement: '',
    hypothesis_type: 'problema',
    framework_used: 'MECE',
    area: projectArea as string,
    priority: 'media',
    impact_score: '',
    evidence: '',
    parent_hypothesis_id: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        statement: initialData.statement,
        hypothesis_type: initialData.hypothesis_type || 'problema',
        framework_used: initialData.framework_used || 'MECE',
        area: initialData.area || projectArea,
        priority: initialData.priority?.toString() || 'media',
        impact_score: initialData.impact_score?.toString() || '',
        evidence: initialData.evidence || '',
        parent_hypothesis_id: initialData.parent_hypothesis_id || ''
      });
    } else {
      setForm({
        statement: '',
        hypothesis_type: 'problema',
        framework_used: 'MECE',
        area: projectArea,
        priority: 'media',
        impact_score: '',
        evidence: '',
        parent_hypothesis_id: ''
      });
    }
  }, [initialData, open, projectArea]);

  const handleSave = async () => {
    if (!form.statement) return;
    setLoading(true);
    try {
      const data = {
        project_id: projectId,
        statement: form.statement,
        hypothesis_type: form.hypothesis_type as any,
        status: (initialData?.status || 'planteada') as HypothesisStatus,
        framework_used: form.framework_used,
        area: form.area,
        priority: form.priority,
        impact_score: form.impact_score ? parseFloat(form.impact_score) : undefined,
        evidence: form.evidence,
        parent_hypothesis_id: form.parent_hypothesis_id || undefined
      };

      if (initialData?.id) {
        await hypothesesDB.update(initialData.id, data);
      } else {
        await hypothesesDB.create(data);
        await projectActivityLogDB.log({
          project_id: projectId,
          action_type: 'hypothesis_created',
          entity_type: 'hypotheses',
          description: `Nueva hipótesis registrada: "${form.statement.slice(0, 40)}..."`,
          performed_by_name: user?.email?.split('@')[0] || 'Consultor'
        });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving hypothesis:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initialData ? "Editar Hipótesis" : "Nueva Hipótesis"} maxWidth="max-w-2xl">
      <div className="space-y-6 py-2">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Hipótesis *</label>
          <textarea 
            value={form.statement}
            onChange={e => setForm({...form, statement: e.target.value})}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-cream focus:border-architecture/50 outline-none resize-none"
            placeholder="Ej: Los traslados inter-planta no tienen confirmación de recepción en SAP..."
          />
          <p className="text-[10px] text-white/20 mt-2 italic ml-1">Formula la hipótesis en lenguaje de negocio, no técnico.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Tipo</label>
            <select 
              value={form.hypothesis_type}
              onChange={e => setForm({...form, hypothesis_type: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-architecture/50 outline-none cursor-pointer select-dark"
            >
              <option value="problema">Problema</option>
              <option value="causa_raiz">Causa Raíz</option>
              <option value="solucion">Solución</option>
              <option value="riesgo">Riesgo</option>
            </select>
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Framework</label>
            <select 
              value={form.framework_used}
              onChange={e => setForm({...form, framework_used: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-architecture/50 outline-none cursor-pointer select-dark"
            >
              {FRAMEWORKS.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Prioridad</label>
            <select 
              value={form.priority}
              onChange={e => setForm({...form, priority: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-architecture/50 outline-none cursor-pointer select-dark"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Impacto Estimado (MXN)</label>
            <input 
              type="number"
              value={form.impact_score}
              onChange={e => setForm({...form, impact_score: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-architecture/50 outline-none font-mono"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">¿Deriva de otra hipótesis? (Issue Tree)</label>
          <select 
            value={form.parent_hypothesis_id}
            onChange={e => setForm({...form, parent_hypothesis_id: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-architecture/50 outline-none cursor-pointer select-dark"
          >
            <option value="">Ninguna (Raíz)</option>
            {parentOptions.filter(h => h.id !== initialData?.id).map(h => (
              <option key={h.id} value={h.id}>{h.statement.slice(0, 60)}...</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Evidencia Inicial</label>
          <textarea 
            value={form.evidence}
            onChange={e => setForm({...form, evidence: e.target.value})}
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-cream focus:border-architecture/50 outline-none resize-none"
            placeholder="Observaciones de campo, data preliminar..."
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/5">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button 
            variant="primary" 
            onClick={handleSave} 
            isLoading={loading}
            disabled={!form.statement}
            className="flex-1 bg-architecture/20 hover:bg-architecture/30 border-architecture/50 text-cream"
          >
            {initialData ? 'Guardar Cambios' : 'Registrar Hipótesis →'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
