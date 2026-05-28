import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown, ChevronUp, ArrowRight, ShieldCheck, AlertCircle, Clock } from 'lucide-react';
import { Project, ProjectPhase, Deliverable, Hypothesis, ProjectWorkstream, ProjectPayment } from '../../lib/types';
import { useAuthStore } from '../../stores/authStore';
import Button from '../ui/Button';
import { getPhaseExitConditions, PhaseCondition } from '../../lib/phaseConditions';
import { 
  deliverablesDB, 
  hypothesesDB, 
  workstreamsDB, 
  projectsDB, 
  projectActivityLogDB, 
  paymentsDB,
  phaseTransitionsDB,
  supabase 
} from '../../lib/supabase';

const PHASE_ORDER = ['scoping', 'immersion', 'analysis', 'delivery', 'closure', 'completed'];

interface WorkspaceStatusBarProps {
  project: Project;
  phases: ProjectPhase[];
  onUpdate?: () => void;
}

export default function WorkspaceStatusBar({ project, phases, onUpdate }: WorkspaceStatusBarProps) {
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<{
    deliverables: Deliverable[];
    hypotheses: Hypothesis[];
    workstreams: ProjectWorkstream[];
    payments: ProjectPayment[];
  }>({
    deliverables: [],
    hypotheses: [],
    workstreams: [],
    payments: []
  });
  const [loadingData, setLoadingData] = useState(false);
  const [confirmingPhase, setConfirmingPhase] = useState<ProjectPhase | null>(null);
  const [advancing, setAdvancing] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    async function fetchData() {
      setLoadingData(true);
      try {
        const [
          { data: deliverables },
          { data: hypotheses },
          { data: workstreams },
          { data: payments }
        ] = await Promise.all([
          deliverablesDB.getByProject(project.id),
          hypothesesDB.getByProject(project.id),
          workstreamsDB.getByProject(project.id),
          paymentsDB.getByProject(project.id)
        ]);

        setProjectData({
          deliverables: deliverables || [],
          hypotheses: hypotheses || [],
          workstreams: workstreams || [],
          payments: payments || []
        });
      } catch (error) {
        console.error('Error fetching data for phase conditions:', error);
      } finally {
        setLoadingData(false);
      }
    }

    fetchData();
  }, [project.id]);

  const getPhaseConditions = (phaseName: string): PhaseCondition[] => {
    return getPhaseExitConditions(phaseName, {
      project,
      payments: projectData.payments,
      hypotheses: projectData.hypotheses,
      deliverables: projectData.deliverables
    });
  };

  const handleAdvance = async (phase: ProjectPhase) => {
    setAdvancing(true);
    try {
      const currentIdx = PHASE_ORDER.indexOf(project.status);
      const nextStatus = PHASE_ORDER[currentIdx + 1];

      if (!nextStatus) return;

      const conditions = getPhaseConditions(phase.phase_name);

      // Registrar transición formal inmutable
      await phaseTransitionsDB.create({
        project_id: project.id,
        from_phase: project.status,
        to_phase: nextStatus,
        confirmed_by: user?.id,
        confirmed_by_name: user?.user_metadata?.full_name || user?.email || 'Consultor',
        justification: 'Avance de fase validado por sistema',
        conditions_met: conditions.map(c => ({ label: c.label, met: c.met }))
      } as any);

      await projectActivityLogDB.log({
        project_id: project.id,
        action_type: 'phase_transition',
        description: `Proyecto avanzado de la fase ${project.status} a ${nextStatus}`,
        performed_by_name: user?.user_metadata?.full_name || user?.email || 'Consultor',
        metadata: { from: project.status, to: nextStatus, phase_id: phase.id }
      });

      await projectsDB.update(project.id, { 
        status: nextStatus as any,
        current_phase: nextStatus
      });

      await supabase
        .from('project_phases')
        .update({ status: 'completada', completed_at: new Date().toISOString() })
        .eq('id', phase.id);
      
      const nextPhase = phases.find(p => p.phase_name.toLowerCase() === nextStatus.toLowerCase());
      if (nextPhase) {
        await supabase
          .from('project_phases')
          .update({ status: 'en_curso', started_at: new Date().toISOString() })
          .eq('id', nextPhase.id);
      }

      setConfirmingPhase(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error advancing phase:', error);
    } finally {
      setAdvancing(false);
    }
  };
  return (
    <div className="px-6 py-12 bg-eva-beige-2/50 border-b border-eva-border relative z-30">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Connector Line */}
          <div className="absolute top-[11px] left-0 right-0 h-0.5 bg-eva-border -z-10" />
          
          {phases.map((phase, idx) => {
            const isCompleted = phase.status === 'completada';
            const isActive = phase.status === 'en_curso';
            const isExpanded = expandedPhaseId === phase.id;
            const conditions = getPhaseConditions(phase.phase_name);
            const allMet = conditions.length > 0 && conditions.every(c => c.met || !c.critical);

            return (
              <div key={phase.id} className="flex flex-col items-center gap-3 relative">
                {/* Circle Indicator */}
                <button 
                  onClick={() => setExpandedPhaseId(isExpanded ? null : phase.id)}
                  className="flex flex-col items-center gap-3 group focus:outline-none"
                >
                  {isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-service-sentinel border-2 border-service-sentinel flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div 
                      className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-[10px] border-2 transition-all duration-500 font-bold group-hover:scale-110
                        ${isActive ? 'bg-eva-olive border-eva-olive text-white shadow-md' : 
                          'bg-white border-eva-border text-eva-txt-faint'}
                      `}
                    >
                      {idx + 1}
                      {isActive && (
                        <motion.div 
                          className="absolute inset-0 rounded-full bg-eva-olive/30"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                  )}

                  {/* Label */}
                  <div className="text-center space-y-0.5">
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${
                      isCompleted ? 'text-service-sentinel' :
                      isActive ? 'text-eva-gold' : 'text-eva-txt-faint'
                    }`}>
                      {phase.name || phase.phase_name}
                    </p>
                    <p className="text-[9px] text-eva-txt-muted font-bold uppercase tracking-tighter opacity-60 flex items-center justify-center gap-1">
                      {isCompleted ? 'Completado' : isActive ? 'En curso' : 'Pendiente'}
                      {isExpanded ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                    </p>
                  </div>
                </button>

                {/* Expandable Panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full mt-6 left-1/2 -translate-x-1/2 w-[320px] bg-white border border-eva-border rounded-2xl shadow-xl z-20 p-6 overflow-hidden"
                    >
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-eva-border pb-4">
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-eva-txt-mid">Condiciones de Salida</h5>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-eva-gold/10 text-eva-gold' : 'bg-eva-beige-3 text-eva-txt-faint'}`}>
                            {phase.phase_name.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {conditions.length > 0 ? conditions.map((c, i) => {
                            const met = c.met;
                            return (
                              <div key={i} className="flex items-start gap-3">
                                <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${met ? 'bg-green-100 text-green-600' : 'bg-eva-beige-3 text-eva-txt-faint'}`}>
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                </div>
                                <span className={`text-[11px] leading-snug ${met ? 'text-eva-txt-mid font-medium' : 'text-eva-txt-faint'}`}>
                                  {c.label} {c.critical && !met && <span className="text-[8px] text-service-foundation font-bold">(CRÍTICO)</span>}
                                </span>
                              </div>
                            );
                          }) : (
                            <div className="flex items-center gap-2 text-eva-txt-faint italic py-2">
                               <AlertCircle className="w-3 h-3" />
                               <span className="text-[10px]">Sin condiciones definidas</span>
                            </div>
                          )}
                        </div>

                        {isActive && (
                          <div className="pt-4 border-t border-eva-border">
                            <Button 
                              variant="primary"
                              disabled={!allMet}
                              onClick={() => setConfirmingPhase(phase)}
                              className={`w-full h-10 text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 ${allMet ? 'bg-eva-olive' : 'bg-eva-beige-3 text-eva-txt-faint cursor-not-allowed'}`}
                            >
                              Avanzar a {PHASE_ORDER[idx + 1]?.replace('_', ' ').toUpperCase()} <ArrowRight className="w-3 h-3" />
                            </Button>
                            {!allMet && (
                              <p className="text-[9px] text-center text-eva-txt-faint mt-3 italic">
                                Se requiere cumplir todas las condiciones para avanzar.
                              </p>
                            )}
                          </div>
                        )}

                        {isCompleted && (
                          <div className="flex items-center gap-2 justify-center p-3 rounded-xl bg-green-50 text-green-700">
                             <ShieldCheck className="w-3.5 h-3.5" />
                             <span className="text-[10px] font-bold uppercase tracking-widest">Fase Validada</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmingPhase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmingPhase(null)}
              className="absolute inset-0 bg-eva-black/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-eva-border"
            >
              <div className="p-8 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-eva-gold/10 flex items-center justify-center mx-auto">
                   <Clock className="w-8 h-8 text-eva-gold" />
                </div>
                
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-serif text-eva-black">¿Confirmas el avance de fase?</h3>
                  <p className="text-sm text-eva-txt-muted leading-relaxed">
                    El proyecto avanzará a la fase <span className="font-bold text-eva-black">{PHASE_ORDER[PHASE_ORDER.indexOf(project.status) + 1]?.replace('_', ' ').toUpperCase()}</span>. Esta acción quedará registrada en el activity log con tu usuario y fecha actual.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    variant="primary" 
                    onClick={() => handleAdvance(confirmingPhase)}
                    isLoading={advancing}
                    className="w-full h-12 bg-eva-olive text-white font-bold uppercase tracking-widest shadow-lg shadow-eva-olive/20"
                  >
                    Confirmar Registro y Avanzar
                  </Button>
                  <button 
                    onClick={() => setConfirmingPhase(null)}
                    disabled={advancing}
                    className="w-full h-12 text-[11px] uppercase tracking-widest font-bold text-eva-txt-faint hover:text-eva-black transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
