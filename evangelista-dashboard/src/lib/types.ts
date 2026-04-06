export interface Client {
  id: string
  name: string
  sector: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  city: string
  sucursales: number
  sistemas_erp: number
  erp_type?: string
  factor_gamma?: number
  factor_alpha?: number
  factor_beta?: number
  vetting_status: 'pending' | 'go' | 'no_go'
  status: 'prospect' | 'active' | 'completed' | 'archived'
  notes?: string
  created_at: string
  updated_at: string
}

export interface Analysis {
  id: string
  client_id?: string
  client?: { name: string } // Joined from clients table
  task: string
  execution_plan?: string
  final_response?: string
  confidence?: number
  subtasks?: SubtaskSummary[]
  sources_used?: string[]
  errors?: string[]
  execution_time_ms?: number
  status: 'running' | 'completed' | 'failed'
  created_at: string
}

export interface SubtaskSummary {
  id: string
  agent: string
  status: string
  confidence: number
  description?: string
}

export interface Proposal {
  id: string
  client_id: string
  type: 'foundation' | 'architecture'
  content: string
  pricing?: ProposalPricing
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

export interface ProposalPricing {
  foundation_fee?: number
  setup_fee?: number
  success_fee?: number
  gamma?: number
  alpha?: number
  beta?: number
}

export interface AgentInfo {
  name: string
  domains: string[]
  tools: string[]
}

// === TEAM ===
export interface TeamMember {
  id: string
  user_id: string
  full_name: string
  role: 'ceo' | 'cto' | 'cfo_cqa' | 'consultant' | 'viewer'
  email: string
  is_active: boolean
  permissions: {
    operations: boolean
    architecture_rag: boolean
    erp_connections: boolean
    team_management: boolean
  }
  created_at: string
}

// === FOUNDATION ===
export type FoundationStatus =
  | 'scoping' | 'cita_1_scheduled' | 'cita_1_done'
  | 'immersion' | 'cita_2_done' | 'dictamen_review'
  | 'cita_3_scheduled' | 'cita_3_done' | 'vetting_gate'
  | 'cita_4_scheduled' | 'cita_4_done'
  | 'closed_go' | 'closed_nogo' | 'closed_lost'

export interface Hallazgo {
  id: string
  nombre: string
  costo_anual: number
  criticidad: 'critico' | 'alto' | 'medio' | 'bajo'
  metodo_deteccion: 'benford' | 'integridad_referencial' | 'duplicados' | 'observacion' | 'otro'
  descripcion: string
  atendible_architecture: boolean
}

export interface FoundationEngagement {
  id: string
  client_id: string
  status: FoundationStatus
  factor_alpha: number | null
  factor_beta: number | null
  factor_gamma: number | null
  foundation_fee: number | null
  nodo_critico: string | null
  registros_estimados: number | null
  fuentes_datos: number
  requiere_viaticos: boolean
  sucursales: number
  erps: number
  fuentes_extra: number
  vetting_beta_ok: boolean | null
  vetting_alpha_ok: boolean | null
  vetting_gamma_viable: boolean | null
  vetting_sponsor_ok: boolean | null
  vetting_decision: 'go' | 'no_go' | 'pending' | null
  hallazgos: Hallazgo[]
  dictamen_total_impacto: number | null
  cita_1_date: string | null
  cita_2_date: string | null
  cita_3_date: string | null
  cita_4_date: string | null
  notas_internas: string | null
  assigned_to: string | null
  created_at: string
  updated_at: string
  clients?: Client
  team_members?: { full_name: string }
}

// === ARCHITECTURE ===
export type ArchitectureStatus = 'setup' | 'fase_1' | 'fase_2' | 'fase_3' | 'delivery' | 'completed' | 'on_hold'

export interface SprintTask {
  nombre: string
  done: boolean
}

export interface Sprint {
  sprint_num: number
  titulo: string
  status: 'pending' | 'active' | 'completed'
  fecha_inicio: string | null
  fecha_fin: string | null
  tareas: SprintTask[]
}

export interface ArchitectureProject {
  id: string
  client_id: string
  foundation_id: string | null
  status: ArchitectureStatus
  setup_fee: number | null
  tramo_a: number | null
  tramo_b: number | null
  success_fee_estimado: number | null
  tramo_a_pagado: boolean
  tramo_b_pagado: boolean
  escenario_infra: 'A' | 'B' | null
  sprints: Sprint[]
  assigned_to: string | null
  created_at: string
  clients?: Client
}

// === SENTINEL ===
export interface SentinelKPI {
  nombre: string
  formula: string
  meta: number
  actual: number
  tendencia: 'up' | 'down' | 'stable'
  alerta: boolean
}

export interface SentinelSubscription {
  id: string
  client_id: string
  status: 'active' | 'paused' | 'cancelled'
  tier: 'silver' | 'gold' | 'platinum'
  monthly_fee: number
  kpis: SentinelKPI[]
  proxima_junta: string | null
  juntas_realizadas: number
  alertas_activas: number
  assigned_to: string | null
  created_at: string
  clients?: Client
}

// === ACTIVITY ===
export interface ActivityEntry {
  id: string
  action: string
  entity_type: string
  entity_id: string | null
  details: Record<string, unknown>
  created_at: string
  team_members?: { full_name: string }
  clients?: { name: string }
}
