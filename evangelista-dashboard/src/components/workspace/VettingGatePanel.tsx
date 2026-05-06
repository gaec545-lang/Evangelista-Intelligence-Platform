import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Project, Finding } from '../../lib/types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { projectActivityLogDB, projectsDB } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';

interface VettingGatePanelProps {
  project: Project;
  findings: Finding[];
  onComplete: () => void;
}

const VETTING_CRITERIA = [
  { id: 'volume', label: 'Volumen de datos suficiente para modelado', weight: 0.20, hint: 'Registros históricos suficientes para construir modelos útiles.' },
  { id: 'impact', label: 'Impacto económico justificado (> $200k/año)', weight: 0.25, hint: 'El retorno de inversión justifica la siguiente fase.', autoEvaluate: (findings: Finding[]) => findings.some(f => (f.economic_impact ?? 0) > 200000) },
  { id: 'access', label: 'Acceso técnico viable a fuentes críticas', weight: 0.20, hint: 'Se pueden establecer conexiones de datos estables.' },
  { id: 'sponsor', label: 'Sponsor con autoridad de decisión real', weight: 0.15, hint: 'El proyecto tiene respaldo al nivel de toma de decisiones.' },
  { id: 'legal', label: 'Sin impedimentos legales o contractuales', weight: 0.10, hint: 'NDA y acuerdos de confidencialidad en orden.' },
  { id: 'financial', label: 'Capacidad financiera para implementación', weight: 0.10, hint: 'El cliente puede absorber el costo de la solución.' },
];

export default function VettingGatePanel({ project, findings, onComplete }: VettingGatePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [criteria, setCriteria] = useState<Record<string, boolean>>({});
  const [justification, setJustification] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    // Auto-evaluar criterios
    const newCriteria = { ...criteria };
    VETTING_CRITERIA.forEach(c => {
      if (c.autoEvaluate) {
        newCriteria[c.id] = c.autoEvaluate(findings);
      }
    });
    setCriteria(newCriteria);
  }, [findings]);

  const calculateScore = () => {
    let score = 0;
    VETTING_CRITERIA.forEach(c => {
      if (criteria[c.id]) score += c.weight * 100;
    });
    return Math.round(score);
  };

  const score = calculateScore();
  const result = score >= 80 ? 'GO' : score >= 60 ? 'GO_CONDITIONAL' : 'NO_GO';

  const resultStyles = {
    GO: { label: 'RESULTADO: GO', icon: CheckCircle2, color: 'text-green-400', bgColor: 'bg-green-400/10', borderColor: 'border-green-400/20' },
    GO_CONDITIONAL: { label: 'RESULTADO: CONDICIONAL', icon: AlertTriangle, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', borderColor: 'border-yellow-400/20' },
    NO_GO: { label: 'RESULTADO: NO-GO', icon: XCircle, color: 'text-red-400', bgColor: 'bg-red-400/10', borderColor: 'border-red-400/20' },
  };

  const style = resultStyles[result];

  const handleSave = async () => {
    if (!justification) return;
    setLoading(true);
    try {
      // 1. Log activity
      await projectActivityLogDB.log({
        project_id: project.id,
        action_type: 'vetting_gate_evaluated',
        entity_type: 'projects',
        description: `Evaluación Vetting Gate completada: ${result} (Score: ${score}/100)`,
        performed_by_name: user?.email?.split('@')[0] || 'Consultor',
        metadata: { score, result, criteria, justification }
      });

      // 2. Update project status
      const nextStatus = result === 'NO_GO' ? 'pausado' : 'en_ejecucion';
      await projectsDB.update(project.id, { status: nextStatus });

      onComplete();
      alert(`Proyecto actualizado a: ${nextStatus.toUpperCase()}`);
    } catch (error) {
      console.error('Error saving vetting gate:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-6 rounded-2xl border flex items-center justify-between transition-all ${
          isOpen ? 'bg-white/5 border-white/20 rounded-b-none' : 'bg-black/40 border-white/5 hover:border-white/10'
        }`}
      >
        <div className="flex items-center gap-4">
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.bgColor}`}>
              <ShieldCheck className={`w-5 h-5 ${style.color}`} />
           </div>
           <div className="text-left">
              <h4 className="text-lg font-serif text-cream">Vetting Gate — Validación de Viabilidad</h4>
              <p className="text-xs text-white/40">Evaluación de criterios para proceder a la fase de ejecución.</p>
           </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-1">Score Ponderado</p>
              <p className={`text-xl font-serif ${style.color}`}>{score}/100</p>
           </div>
           {isOpen ? <ChevronUp className="w-5 h-5 text-white/20" /> : <ChevronDown className="w-5 h-5 text-white/20" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white/5 border-x border-b border-white/20 rounded-b-2xl"
          >
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h5 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Matriz de Evaluación</h5>
                  {VETTING_CRITERIA.map(c => (
                    <div key={c.id} className="flex items-start gap-4 p-4 rounded-xl bg-black/20 border border-white/5 group hover:border-white/10 transition-colors">
                       <button
                         onClick={() => !c.autoEvaluate && setCriteria({...criteria, [c.id]: !criteria[c.id]})}
                         className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-all ${
                           criteria[c.id] ? 'bg-architecture border-architecture' : 'border-white/20'
                         } ${c.autoEvaluate ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                       >
                         {criteria[c.id] && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                       </button>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium ${criteria[c.id] ? 'text-cream' : 'text-white/40'}`}>{c.label}</span>
                            <span className="text-[9px] text-white/20 font-mono">({(c.weight * 100).toFixed(0)}%)</span>
                            {c.autoEvaluate && <Lock className="w-3 h-3 text-white/10" />}
                          </div>
                          <p className="text-[10px] text-white/20 leading-relaxed italic">{c.hint}</p>
                       </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-8">
                   <div className={`p-8 rounded-2xl border ${style.bgColor} ${style.borderColor} space-y-4`}>
                      <div className="flex items-center gap-3">
                         <style.icon className={`w-6 h-6 ${style.color}`} />
                         <h5 className={`text-xl font-serif ${style.color}`}>{style.label}</h5>
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed">
                        {score >= 80 
                          ? 'Los hallazgos y el contexto del proyecto demuestran una viabilidad técnica y económica sólida. Se recomienda proceder a la Fase de Ejecución inmediatamente.'
                          : score >= 60
                          ? 'El proyecto es viable pero presenta riesgos u omisiones menores en los criterios de acceso o respaldo. Se recomienda un "Go" condicionado a resolver puntos específicos.'
                          : 'El proyecto no cumple con el umbral mínimo de viabilidad. No se recomienda avanzar a la siguiente fase sin una re-evaluación del alcance o el sponsor.'}
                      </p>
                   </div>

                   <div className="space-y-4">
                      <label className="block text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Justificación del Equipo *</label>
                      <textarea 
                        value={justification}
                        onChange={e => setJustification(e.target.value)}
                        rows={6}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-cream focus:border-architecture/50 outline-none resize-none"
                        placeholder="Describe los motivos de esta decisión..."
                      />
                      <div className="flex gap-4">
                        <div className="flex-1 p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                           <p className="text-[9px] uppercase text-white/20 mb-1">Firma CEO</p>
                           <p className="text-xs text-green-400 font-bold uppercase tracking-widest">✓ {user?.email?.split('@')[0] || 'Adriel E.'}</p>
                        </div>
                        <div className="flex-1 p-3 rounded-lg bg-white/5 border border-white/5 text-center">
                           <p className="text-[9px] uppercase text-white/20 mb-1">Firma CTO</p>
                           <p className="text-xs text-white/20 uppercase tracking-widest italic">Pendiente</p>
                        </div>
                      </div>
                   </div>

                   <Button 
                     variant="primary" 
                     onClick={handleSave}
                     isLoading={loading}
                     disabled={!justification || findings.length < 2}
                     className="w-full h-12 bg-architecture text-black font-bold uppercase tracking-widest"
                   >
                     Guardar Evaluación y Avanzar Fase <ArrowRight className="w-4 h-4 ml-2" />
                   </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
