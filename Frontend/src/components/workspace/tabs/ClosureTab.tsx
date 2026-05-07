import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  CheckSquare, 
  FileCheck, 
  MessageSquare, 
  Star,
  RefreshCcw,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Project, ProjectClosure } from '../../../lib/types';
import { closureDB, projectsDB, deliverablesDB } from '../../../lib/supabase';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { DocumentGeneratorButton } from '../../documents/DocumentGeneratorButton';
import { Spinner } from '../../ui/Spinner';

interface ClosureTabProps {
  project: Project;
}

export default function ClosureTab({ project }: ClosureTabProps) {
  const [loading, setLoading] = useState(false);
  const [closure, setClosure] = useState<ProjectClosure | null>(null);
  const [deliverables, setDeliverables] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [project.id]);

  async function loadData() {
    setLoading(true);
    try {
      const [closureData, deliverablesData] = await Promise.all([
        closureDB.getByProject(project.id),
        deliverablesDB.getByProject(project.id)
      ]);
      
      if (!closureData.data) {
        // Inicializar si no existe
        const { data } = await closureDB.create(project.id);
        setClosure(data);
      } else {
        setClosure(closureData.data);
      }
      
      setDeliverables(deliverablesData.data || []);
    } catch (error) {
      console.error('Error loading closure data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleToggle = async (field: keyof ProjectClosure) => {
    if (!closure) return;
    const val = !closure[field];
    try {
      const { data } = await closureDB.update(project.id, { [field]: val });
      setClosure(data);
    } catch (error) {
      alert('Error al actualizar checklist');
    }
  };

  const handleSaveLessons = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updates = {
      what_worked: formData.get('what_worked') as string,
      what_failed: formData.get('what_failed') as string,
      next_time: formData.get('next_time') as string,
    };
    try {
      await closureDB.update(project.id, updates);
      alert('Lecciones guardadas');
    } catch (error) {
      alert('Error al guardar');
    }
  };

  if (loading && !closure) return <div className="p-20 flex justify-center"><Spinner /></div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-service-sentinel/10 flex items-center justify-center border border-service-sentinel/20 shadow-sm">
          <Trophy className="w-6 h-6 text-service-sentinel" />
        </div>
        <div>
          <h3 className="text-2xl font-serif text-eva-black">Cierre de Proyecto</h3>
          <p className="text-sm text-eva-txt-muted">Formalización de entrega, evaluación de resultados y lecciones aprendidas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CHECKLIST DE CIERRE */}
        <div className="lg:col-span-5 space-y-6">
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-eva-txt-faint flex items-center gap-2">
            <CheckSquare className="w-3 h-3" />
            Checklist Formal de Cierre
          </h4>

          <Card className="p-6 bg-white border-eva-border space-y-2 shadow-sm">
            {[
              { id: 'deliverables_accepted', label: 'Entregables aceptados por el cliente' },
              { id: 'credentials_revoked', label: 'Revocación de accesos / Credenciales' },
              { id: 'final_payment_received', label: 'Confirmación de pago de finiquito' },
              { id: 'acta_signed', label: 'Acta de Entrega firmada' },
              { id: 'lessons_documented', label: 'Lecciones aprendidas documentadas' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleToggle(item.id as keyof ProjectClosure)}
                className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-eva-beige-2/30 transition-all group border border-transparent hover:border-eva-border"
              >
                <span className={`text-sm font-medium ${closure?.[item.id as keyof ProjectClosure] ? 'text-eva-black' : 'text-eva-txt-muted'}`}>
                  {item.label}
                </span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  closure?.[item.id as keyof ProjectClosure] 
                    ? 'bg-service-sentinel border-service-sentinel scale-110 shadow-lg shadow-service-sentinel/20' 
                    : 'border-eva-border group-hover:border-eva-txt-muted'
                }`}>
                  {closure?.[item.id as keyof ProjectClosure] && <CheckSquare className="w-3 h-3 text-white" />}
                </div>
              </button>
            ))}
          </Card>

          <div className="p-6 rounded-2xl bg-eva-black text-white space-y-4 shadow-xl">
             <div className="flex items-center gap-3">
               <FileCheck className="w-5 h-5 text-service-sentinel" />
               <span className="text-sm font-bold tracking-tight uppercase">Formalización Legal</span>
             </div>
             <p className="text-xs text-white/60 leading-relaxed font-medium">
               Una vez completado el checklist, genera el Acta de Entrega para recabar las firmas finales. 
               Este documento es el respaldo legal del cumplimiento del contrato.
             </p>
             <DocumentGeneratorButton 
               docType="acta_entrega" 
               project={project} 
               client={{ name: '...', id: project.client_id } as any} // Simplificado o cargar completo
               variables={{
                 deliverables: deliverables.map(d => ({ title: d.title, type: d.deliverable_type }))
               }}
               label="Generar Acta de Entrega"
               className="w-full h-10 bg-service-sentinel hover:bg-service-sentinel/80 border-none"
             />
          </div>
        </div>

        {/* LECCIONES APRENDIDAS */}
        <div className="lg:col-span-7 space-y-6">
          <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-eva-txt-faint flex items-center gap-2">
            <MessageSquare className="w-3 h-3" />
            Lecciones Aprendidas y Evaluación
          </h4>

          <Card className="p-8 bg-white border-eva-border shadow-sm">
            <form onSubmit={handleSaveLessons} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-eva-txt-faint">¿Qué funcionó bien?</label>
                <textarea 
                  name="what_worked"
                  defaultValue={closure?.what_worked || ''}
                  className="w-full h-24 p-4 text-sm bg-eva-beige-2 border border-eva-border rounded-xl focus:ring-2 focus:ring-service-sentinel/20 focus:border-service-sentinel outline-none transition-all"
                  placeholder="Factores críticos de éxito..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-eva-txt-faint">¿Qué falló o se puede mejorar?</label>
                <textarea 
                  name="what_failed"
                  defaultValue={closure?.what_failed || ''}
                  className="w-full h-24 p-4 text-sm bg-eva-beige-2 border border-eva-border rounded-xl focus:ring-2 focus:ring-service-foundation/20 focus:border-service-foundation outline-none transition-all"
                  placeholder="Fricciones, bloqueos o retrasos..."
                />
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" variant="primary" className="bg-eva-olive">
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Actualizar Memoria Técnica
                </Button>
              </div>
            </form>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 bg-eva-gold/5 border-eva-gold/20 flex items-center gap-4">
              <Star className="w-8 h-8 text-eva-gold" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-eva-txt-faint">Client Satisfaction</p>
                <p className="text-xl font-bold text-eva-black">Pendiente</p>
              </div>
            </Card>
            <Card className="p-6 bg-service-architecture/5 border-service-architecture/20 flex items-center gap-4">
              <ShieldAlert className="w-8 h-8 text-service-architecture" />
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-eva-txt-faint">Project Health</p>
                <p className="text-xl font-bold text-eva-black">88/100</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
