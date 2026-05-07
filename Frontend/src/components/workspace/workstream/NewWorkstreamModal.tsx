import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building } from 'lucide-react';
import { workstreamsDB } from '../../../lib/supabase';
import Button from '../../ui/Button';

interface NewWorkstreamModalProps {
  projectId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewWorkstreamModal({ projectId, onClose, onSuccess }: NewWorkstreamModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    workstream_type: 'consultoria' as any,
    team_type: 'interno' as any,
    contractor_name: '',
    contractor_contact: '',
    contractor_rate: 0,
    contractor_rate_type: 'por_entregable' as any,
    budget_allocated: 0,
    color: '#3e4d32' // eva-olive
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: dbError } = await workstreamsDB.create({
        project_id: projectId,
        name: formData.name,
        workstream_type: formData.workstream_type,
        team_type: formData.team_type,
        contractor_name: formData.contractor_name || undefined,
        contractor_contact: formData.contractor_contact || undefined,
        contractor_rate: formData.contractor_rate || undefined,
        contractor_rate_type: formData.contractor_rate_type || undefined,
        budget_allocated: formData.budget_allocated || undefined,
        budget_spent: 0,
        color: formData.color,
        display_order: 0,
        status: 'activo',
      });

      if (dbError) {
        setError(dbError.message);
        setLoading(false);
        return;
      }
      onSuccess();
    } catch (err: any) {
      console.error('Error creating workstream:', err);
      setError(err.message || 'Error inesperado al crear el workstream.');
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
            <h2 className="text-xl font-brand text-eva-black">Agregar Workstream</h2>
            <button onClick={onClose} className="p-2 text-eva-txt-muted hover:text-eva-black hover:bg-eva-beige-2 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            <form id="new-workstream-form" onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-eva-txt-mid mb-1">Nombre del workstream *</label>
                  <input 
                    required autoFocus
                    type="text" 
                    placeholder="Ej. Dev Team, Ingeniería Civil, Analistas..."
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-eva-border focus:border-eva-olive focus:ring-1 focus:ring-eva-olive outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-eva-txt-mid mb-1">Tipo de trabajo *</label>
                    <select 
                      value={formData.workstream_type}
                      onChange={e => setFormData({...formData, workstream_type: e.target.value as any})}
                      className="w-full px-4 py-2.5 rounded-lg border border-eva-border focus:border-eva-olive outline-none bg-white"
                    >
                      <option value="consultoria">Consultoría</option>
                      <option value="desarrollo">Desarrollo de Software</option>
                      <option value="ingenieria">Ingeniería Física/Civil</option>
                      <option value="diseno">Diseño UX/UI</option>
                      <option value="qa">QA y Testing</option>
                      <option value="externo_otro">Otro Externo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-eva-txt-mid mb-1">Color (Timeline)</label>
                    <div className="flex gap-2 items-center h-[42px] px-2 rounded-lg border border-eva-border">
                      <input 
                        type="color" 
                        value={formData.color}
                        onChange={e => setFormData({...formData, color: e.target.value})}
                        className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                      />
                      <span className="text-xs font-mono text-eva-txt-muted uppercase">{formData.color}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-eva-txt-mid mb-2">Tipo de equipo *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['interno', 'subcontratado', 'cliente'].map(type => (
                      <button
                        key={type} type="button"
                        onClick={() => setFormData({...formData, team_type: type as any})}
                        className={`py-2 px-3 text-sm rounded-lg border transition-colors capitalize ${
                          formData.team_type === type 
                            ? 'bg-eva-olive/10 border-eva-olive text-eva-olive font-medium' 
                            : 'border-eva-border text-eva-txt-muted hover:border-eva-olive/50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {formData.team_type === 'subcontratado' && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                    <Building size={16} /> Datos del Subcontratista
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-blue-800 mb-1">Empresa / Nombre *</label>
                      <input 
                        required={formData.team_type === 'subcontratado'}
                        type="text" 
                        value={formData.contractor_name}
                        onChange={e => setFormData({...formData, contractor_name: e.target.value})}
                        className="w-full px-3 py-2 rounded-md border border-blue-200 outline-none focus:border-blue-500 text-sm"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-blue-800 mb-1">Contacto Principal</label>
                      <input 
                        type="text" 
                        value={formData.contractor_contact}
                        onChange={e => setFormData({...formData, contractor_contact: e.target.value})}
                        className="w-full px-3 py-2 rounded-md border border-blue-200 outline-none focus:border-blue-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-blue-800 mb-1">Tarifa Acordada (MXN)</label>
                      <input 
                        type="number" 
                        value={formData.contractor_rate}
                        onChange={e => setFormData({...formData, contractor_rate: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 rounded-md border border-blue-200 outline-none focus:border-blue-500 text-sm font-mono"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-blue-800 mb-1">Modalidad de Tarifa</label>
                      <select 
                        value={formData.contractor_rate_type}
                        onChange={e => setFormData({...formData, contractor_rate_type: e.target.value as any})}
                        className="w-full px-3 py-2 rounded-md border border-blue-200 outline-none focus:border-blue-500 text-sm bg-white"
                      >
                        <option value="hora">Por Hora</option>
                        <option value="dia">Por Día</option>
                        <option value="sprint">Por Sprint</option>
                        <option value="fijo">Fijo (Proyecto completo)</option>
                        <option value="por_entregable">Por Entregable</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <label className="block text-sm font-medium text-eva-txt-mid mb-1">Presupuesto total asignado (MXN)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-eva-txt-muted">$</span>
                  <input 
                    type="number" 
                    value={formData.budget_allocated}
                    onChange={e => setFormData({...formData, budget_allocated: parseFloat(e.target.value)})}
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-eva-border focus:border-eva-olive outline-none font-mono text-lg"
                  />
                </div>
                <p className="text-xs text-eva-txt-faint mt-1">Este presupuesto sumará al peso de este workstream en el progreso global.</p>
              </div>

            </form>
          </div>

          <div className="px-6 py-4 border-t border-eva-border bg-eva-beige/30 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" form="new-workstream-form" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Workstream'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
