import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import { Shield, Database, Plus, Trash2 } from 'lucide-react';
import { findingsDB, dataSourcesDB, projectActivityLogDB } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { Finding, DataSource } from '../../lib/types';

interface NewFindingModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  onSave: () => void;
  initialData?: Finding | null;
  existingCount: number;
}

export function NewFindingModal({ open, onClose, projectId, onSave, initialData, existingCount }: NewFindingModalProps) {
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<DataSource[]>([]);
  const { user } = useAuthStore();
  
  const [form, setForm] = useState({
    title: '',
    severity: 'medio',
    area: '',
    data_source_id: '',
    description: '',
    technical_description: '',
    evidence: '',
    economic_impact: '',
    economic_impact_basis: '',
    recommended_action: '',
    hash_md5: '',
    git_commit: ''
  });

  useEffect(() => {
    const loadSources = async () => {
      const { data } = await dataSourcesDB.getByProject(projectId);
      if (data) setSources(data);
    };
    if (open) loadSources();
  }, [projectId, open]);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        severity: initialData.severity,
        area: initialData.area || '',
        data_source_id: initialData.data_source_id || '',
        description: initialData.description,
        technical_description: initialData.technical_description || '',
        evidence: initialData.evidence || '',
        economic_impact: initialData.economic_impact?.toString() || '',
        economic_impact_basis: initialData.economic_impact_basis || '',
        recommended_action: initialData.recommended_action || '',
        hash_md5: initialData.hash_md5 || '',
        git_commit: initialData.git_commit || ''
      });
    } else {
      setForm({
        title: '',
        severity: 'medio',
        area: '',
        data_source_id: '',
        description: '',
        technical_description: '',
        evidence: '',
        economic_impact: '',
        economic_impact_basis: '',
        recommended_action: '',
        hash_md5: '',
        git_commit: ''
      });
    }
  }, [initialData, open]);

  const handleSave = async () => {
    if (!form.title || !form.description) return;
    setLoading(true);
    try {
      const folio = initialData ? initialData.folio : `H-${String(existingCount + 1).padStart(2, '0')}`;
      
      const data = {
        project_id: projectId,
        data_source_id: form.data_source_id || undefined,
        folio,
        title: form.title,
        description: form.description,
        technical_description: form.technical_description,
        severity: form.severity as any,
        area: form.area,
        economic_impact: form.economic_impact ? parseFloat(form.economic_impact) : undefined,
        economic_impact_basis: form.economic_impact_basis,
        recommended_action: form.recommended_action,
        evidence: form.evidence,
        hash_md5: form.hash_md5,
        git_commit: form.git_commit,
        status: (initialData?.status || 'identificado') as any
      };

      if (initialData) {
        await findingsDB.update(initialData.id, data);
      } else {
        await findingsDB.create(data);
        await projectActivityLogDB.log({
          project_id: projectId,
          action_type: 'finding_created',
          entity_type: 'findings',
          description: `Hallazgo ${folio} registrado: "${form.title}"`,
          performed_by_name: user?.username?.split('@')[0] || 'Consultor'
        });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving finding:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initialData ? "Editar Hallazgo" : "Registrar Hallazgo Forense"} maxWidth="max-w-4xl">
      <div className="space-y-6 py-2">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Título del Hallazgo *</label>
            <input 
              type="text"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-cream focus:border-architecture/50 outline-none"
              placeholder="Ej: Traslados inter-planta sin confirmación"
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Severidad *</label>
            <select 
              value={form.severity}
              onChange={e => setForm({...form, severity: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-cream focus:border-architecture/50 outline-none select-dark"
            >
              <option value="critico">Crítico</option>
              <option value="alto">Alto</option>
              <option value="medio">Medio</option>
              <option value="bajo">Bajo</option>
              <option value="oportunidad">Oportunidad</option>
            </select>
          </div>

          <div className="col-span-12 md:col-span-6">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Área / Nodo Crítico</label>
            <input 
              type="text"
              value={form.area}
              onChange={e => setForm({...form, area: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-cream focus:border-architecture/50 outline-none"
              placeholder="Ej: Almacén / Inventarios"
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Fuente de Datos</label>
            <select 
              value={form.data_source_id}
              onChange={e => setForm({...form, data_source_id: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-cream focus:border-architecture/50 outline-none select-dark"
            >
              <option value="">Seleccionar fuente...</option>
              {sources.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.source_type})</option>
              ))}
            </select>
          </div>

          <div className="col-span-12 md:col-span-6 space-y-6">
             <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Descripción Ejecutiva *</label>
                <textarea 
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-cream focus:border-architecture/50 outline-none resize-none"
                  placeholder="Lenguaje de negocio para el cliente..."
                />
             </div>
             <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Evidencia / Datos</label>
                <textarea 
                  value={form.evidence}
                  onChange={e => setForm({...form, evidence: e.target.value})}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-cream focus:border-architecture/50 outline-none resize-none"
                  placeholder="Resumen de datos que respaldan el hallazgo..."
                />
             </div>
          </div>

          <div className="col-span-12 md:col-span-6 space-y-6">
             <div className="space-y-1.5">
                <label className="block text-[10px] uppercase tracking-widest text-architecture/40 mb-1.5 ml-1">Descripción Técnica (CTO)</label>
                <textarea 
                  value={form.technical_description}
                  onChange={e => setForm({...form, technical_description: e.target.value})}
                  rows={6}
                  className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-3 text-xs text-architecture/80 font-mono focus:border-architecture/50 outline-none resize-none"
                  placeholder="Queries, tablas, lógica forense..."
                />
             </div>
             <div className="space-y-4 p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                   <Shield className="w-3 h-3 text-white/20" />
                   <span className="text-[10px] uppercase tracking-widest font-bold text-white/20">Trazabilidad ALCOA+</span>
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-tighter text-white/20 mb-1">Hash MD5 del Dataset</label>
                  <input 
                    type="text"
                    value={form.hash_md5}
                    onChange={e => setForm({...form, hash_md5: e.target.value})}
                    className="w-full bg-black/20 border border-white/5 rounded px-2 py-1.5 text-[10px] text-white/40 font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-tighter text-white/20 mb-1">Commit Git Referencia</label>
                  <input 
                    type="text"
                    value={form.git_commit}
                    onChange={e => setForm({...form, git_commit: e.target.value})}
                    className="w-full bg-black/20 border border-white/5 rounded px-2 py-1.5 text-[10px] text-white/40 font-mono outline-none"
                  />
                </div>
             </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Impacto Económico (MXN/año)</label>
            <input 
              type="number"
              value={form.economic_impact}
              onChange={e => setForm({...form, economic_impact: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-cream focus:border-architecture/50 outline-none font-mono"
              placeholder="0.00"
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Base del Cálculo</label>
            <input 
              type="text"
              value={form.economic_impact_basis}
              onChange={e => setForm({...form, economic_impact_basis: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-cream focus:border-architecture/50 outline-none"
              placeholder="Ej: Costo de merma × registros faltantes"
            />
          </div>
          <div className="col-span-12">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Acción Recomendada</label>
            <input 
              type="text"
              value={form.recommended_action}
              onChange={e => setForm({...form, recommended_action: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-cream focus:border-architecture/50 outline-none"
              placeholder="Ej: Implementar ETL automatizado con trazabilidad"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/5">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button 
            variant="primary" 
            onClick={handleSave} 
            isLoading={loading}
            disabled={!form.title || !form.description}
            className="flex-1 bg-architecture/20 hover:bg-architecture/30 border-architecture/50 text-cream"
          >
            {initialData ? 'Guardar Cambios' : 'Registrar Hallazgo →'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
