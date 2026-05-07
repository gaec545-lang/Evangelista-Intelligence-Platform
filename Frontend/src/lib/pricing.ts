import { ProjectArea } from './types';

export const BASE_PRICES: Record<ProjectArea, number> = {
  supply_chain:  42000,
  finanzas:      38000,
  operaciones:   42000,
  ventas:        35000,
  logistica:     38000,
  rrhh:          32000,
  tecnologia:    40000,
  multi:         55000,
};

export interface PriceBreakdown {
  base: number;
  alpha_amount: number;
  beta_amount: number;
  gamma: number;
  gamma_amount: number;
  subtotal: number;
  travel_expenses: number;
  total_before_tax: number;
  iva: number;
  total_with_tax: number;
}

/**
 * P = BaseÁrea × (1 + α + β) × Γ + Viáticos
 *
 * α (Alcance):     0.00 – 0.30  proporcional a departamentos involucrados
 * β (Complejidad): suma de criterios activos × 0.10 (máx 6 criterios = 60%)
 * Γ (Fuentes):     1.0 + (0.15 × fuentes adicionales sobre la primera)
 * Viáticos:        $8,000 fijos si cliente fuera de Puebla
 */
export const calculateProjectPrice = (params: {
  area: ProjectArea;
  alpha: number;        // 0.00 – 0.30
  beta: number;         // 0.00 – 0.60
  extraSources: number; // número de fuentes adicionales
  hasTravelExpenses: boolean;
}): PriceBreakdown => {
  const base = BASE_PRICES[params.area] || 40000;
  const gamma = 1.0 + (0.15 * params.extraSources);
  const subtotal = base * (1 + params.alpha + params.beta) * gamma;
  const travel = params.hasTravelExpenses ? 8000 : 0;
  const totalBeforeTax = subtotal + travel;
  const iva = totalBeforeTax * 0.16;

  return {
    base,
    alpha_amount: base * params.alpha,
    beta_amount: base * params.beta,
    gamma,
    gamma_amount: (base * (1 + params.alpha + params.beta)) * (gamma - 1),
    subtotal,
    travel_expenses: travel,
    total_before_tax: totalBeforeTax,
    iva,
    total_with_tax: totalBeforeTax + iva,
  };
};

export const ALPHA_LEVELS = [
  { value: 0.00, label: '0%',  description: '1 departamento' },
  { value: 0.10, label: '10%', description: '2 departamentos' },
  { value: 0.20, label: '20%', description: '3 departamentos' },
  { value: 0.30, label: '30%', description: '4+ departamentos' },
];

export const BETA_CRITERIA = [
  { id: 0, label: 'Captura manual > 40% del proceso' },
  { id: 1, label: 'Múltiples fuentes para el mismo nodo' },
  { id: 2, label: 'Sin catálogo maestro estandarizado' },
  { id: 3, label: 'Diferencia sistema vs realidad física' },
  { id: 4, label: 'Sin logs de cambios en datos críticos' },
  { id: 5, label: 'Datos en múltiples versiones de Excel' },
];
