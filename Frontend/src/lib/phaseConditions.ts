import { Project, ProjectPhase, ProjectPayment, Hypothesis, Deliverable } from './types';

export interface PhaseCondition {
  label: string;
  met: boolean;
  critical: boolean; // Si es falso, solo es un warning
}

export const getPhaseExitConditions = (
  phaseName: string,
  context: {
    project: Project;
    payments: ProjectPayment[];
    hypotheses: Hypothesis[];
    deliverables: Deliverable[];
  }
): PhaseCondition[] => {
  const { project, payments, hypotheses, deliverables } = context;
  const conditions: PhaseCondition[] = [];

  switch (phaseName.toLowerCase()) {
    case 'scoping':
      conditions.push({
        label: 'Propuesta comercial aceptada',
        met: project.status !== 'scoping',
        critical: true
      });
      conditions.push({
        label: 'Al menos 3 hipótesis planteadas',
        met: hypotheses.length >= 3,
        critical: true
      });
      break;

    case 'immersion':
      const setupFeePaid = payments.some(p => p.payment_type === 'anticipo' && p.received);
      conditions.push({
        label: 'Anticipo (Setup Fee) recibido',
        met: setupFeePaid,
        critical: true
      });
      conditions.push({
        label: 'NDA firmado y cargado',
        met: deliverables.some(d => d.deliverable_type === 'nda' && d.status === 'entregado_cliente'),
        critical: true
      });
      break;

    case 'analysis':
      conditions.push({
        label: 'Validación de todas las hipótesis',
        met: hypotheses.every(h => h.status !== 'planteada' && h.status !== 'en_validacion'),
        critical: true
      });
      conditions.push({
        label: 'Dictamen Forense aprobado',
        met: deliverables.some(d => d.deliverable_type === 'dictamen_forense' && d.status === 'aprobado'),
        critical: true
      });
      break;

    case 'delivery':
      conditions.push({
        label: 'Pago de finiquito recibido',
        met: payments.some(p => p.payment_type === 'finiquito' && p.received),
        critical: true
      });
      conditions.push({
        label: 'Acta de entrega firmada',
        met: deliverables.some(d => d.deliverable_type === 'acta_entrega' && d.status === 'entregado_cliente'),
        critical: true
      });
      break;
  }

  return conditions;
};
