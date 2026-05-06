import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import { Shield, Clock } from 'lucide-react';
import { interviewNotesDB, projectActivityLogDB } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';

interface NewInterviewNoteModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  onSave: () => void;
}

export function NewInterviewNoteModal({ open, onClose, projectId, onSave }: NewInterviewNoteModalProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const [form, setForm] = useState({
    session_title: '',
    interview_type: 'scoping',
    interviewer: '',
    interviewee: '',
    location: '',
    content: ''
  });

  const handleSave = async () => {
    if (!form.session_title || !form.content) return;
    setLoading(true);
    try {
      // Generate ALCOA+ Hash
      const encoder = new TextEncoder();
      const data = encoder.encode(form.content);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const alcoa_hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      await interviewNotesDB.create({
        project_id: projectId,
        session_title: form.session_title,
        interview_type: form.interview_type as any,
        interviewer: form.interviewer,
        interviewee: form.interviewee,
        location: form.location,
        content: form.content,
        captured_at: new Date().toISOString(),
        alcoa_hash
      });

      await projectActivityLogDB.log({
        project_id: projectId,
        action_type: 'interview_note_created',
        entity_type: 'interview_notes',
        description: `Nota de entrevista "${form.session_title}" registrada (Protocolo ALCOA+)`,
        performed_by_name: user?.email?.split('@')[0] || 'Consultor'
      });

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving interview note:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Nueva Nota de Entrevista" maxWidth="max-w-2xl">
      <div className="space-y-6 py-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Título de la Sesión *</label>
            <input 
              type="text"
              value={form.session_title}
              onChange={e => setForm({...form, session_title: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-architecture/50 outline-none transition-all"
              placeholder="Cita 1 — Scoping"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Tipo de Sesión</label>
            <select 
              value={form.interview_type}
              onChange={e => setForm({...form, interview_type: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-architecture/50 outline-none cursor-pointer select-dark"
            >
              <option value="scoping">Scoping</option>
              <option value="inmersion">Inmersión</option>
              <option value="validacion">Validación</option>
              <option value="seguimiento">Seguimiento</option>
              <option value="cierre">Cierre</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Entrevistador *</label>
            <input 
              type="text"
              value={form.interviewer}
              onChange={e => setForm({...form, interviewer: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-architecture/50 outline-none"
              placeholder="Adriel Evangelista"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Entrevistado</label>
            <input 
              type="text"
              value={form.interviewee}
              onChange={e => setForm({...form, interviewee: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-architecture/50 outline-none"
              placeholder="Nombre del Stakeholder"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Lugar / Modalidad</label>
            <input 
              type="text"
              value={form.location}
              onChange={e => setForm({...form, location: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-architecture/50 outline-none"
              placeholder="Zoom / Planta Principal"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Contenido (Markdown soportado) *</label>
          <textarea 
            value={form.content}
            onChange={e => setForm({...form, content: e.target.value})}
            rows={8}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-cream focus:border-architecture/50 outline-none resize-none font-sans"
            placeholder="Escribe las notas de la sesión aquí..."
          />
        </div>

        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
             <Shield className="w-4 h-4 text-amber-500" />
          </div>
          <div className="space-y-1">
             <p className="text-[11px] font-bold text-amber-500 uppercase tracking-widest">Aviso de Inmutabilidad</p>
             <p className="text-[10px] text-white/40 leading-relaxed">
               Bajo el protocolo **ALCOA+**, esta nota no podrá ser editada ni eliminada una vez guardada para garantizar la trazabilidad de la evidencia.
             </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/5">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button 
            variant="primary" 
            onClick={handleSave} 
            isLoading={loading}
            disabled={!form.session_title || !form.content}
            className="flex-1 bg-architecture/20 hover:bg-architecture/30 border-architecture/50 text-cream"
          >
            Guardar Nota →
          </Button>
        </div>
      </div>
    </Modal>
  );
}
