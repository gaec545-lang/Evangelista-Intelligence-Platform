// === EXPERIMENTAL STAR SCHEMA: DIMENSIONS ===
// Do not attach yet to legacy components to avoid TS crashes
export interface DimClient {
  id: string
  name: string
  sector?: string
  factor_gamma?: number
  status: 'prospect' | 'active' | 'completed' | 'archived'
  created_at: string
  updated_at: string
}

export interface DimQuery {
  id: string
  client_id: string
  query_type: string
  parameters?: Record<string, any>
  created_at: string
}

export interface DimAgent {
  id: string
  name: string
  version?: string
  created_at: string
}

export interface FactAnalysisResult {
  id: string
  client_id: string
  query_id: string
  agent_id?: string
  confidence_score?: number
  output_text?: string
  latency_ms?: number
  created_at: string
}

// === LEGACY TYPES (Mapped) ===
// Maintained strict required parameters for component viability
export interface Client {
  id: string
  name: string
  company_name?: string
  rfc?: string
  sector: string
  contact_name?: string
  contact_role?: string
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

// === REDESIGN: PROJECT-CENTRIC MODEL (Spec 01) ===

export type ProjectArea =
  | 'supply_chain' | 'finanzas' | 'operaciones'
  | 'ventas' | 'logistica' | 'rrhh' | 'tecnologia' | 'multi';

export type ProjectStatus =
  | 'scoping' | 'propuesta_enviada' | 'en_ejecucion'
  | 'entrega' | 'completado' | 'pausado' | 'cancelado';

export interface Project {
  id: string;
  client_id: string;
  name: string;
  area: ProjectArea;
  description?: string;
  status: ProjectStatus;
  current_phase: string;
  complexity_alpha: number;
  complexity_beta: number;
  gamma_sources: number;
  base_price?: number;
  total_price?: number;
  travel_expenses: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  clients?: { name: string };
}

export type PhaseStatus = 'pendiente' | 'en_curso' | 'completada' | 'bloqueada';

export interface ProjectPhase {
  id: string;
  project_id: string;
  phase_name: string;
  name?: string; // Alias for UI consistency
  phase_order: number;
  status: PhaseStatus;
  responsible?: string;
  assigned_to_role?: string; // Alias for UI consistency
  notes?: string;
  started_at?: string;
  completed_at?: string;
  created_at?: string;
}

export type DataSourceType =
  | 'sql_server' | 'mysql' | 'postgresql' | 'oracle'
  | 'contpaqi' | 'aspel' | 'sap_b1'
  | 'excel' | 'csv' | 'api_rest' | 'otro';

export interface DataSource {
  id: string;
  project_id?: string;
  client_id: string;
  name: string;
  source_type: DataSourceType;
  connection_config: Record<string, unknown>;
  access_mode: 'read_only' | 'read_write';
  status: 'pendiente' | 'conectado' | 'error' | 'sin_probar';
  last_tested_at?: string;
  last_test_result?: string;
  authorized_tables?: string[];
  notes?: string;
  created_at: string;
}

export type HypothesisStatus = 'planteada' | 'en_validacion' | 'validada' | 'refutada' | 'derivada';

export interface Hypothesis {
  id: string;
  project_id: string;
  statement: string;
  framework_used?: string;
  area?: string;
  hypothesis_type?: 'problema' | 'causa_raiz' | 'oportunidad' | 'riesgo';
  status: HypothesisStatus;
  evidence?: string;
  economic_impact?: number;
  impact_score?: number; // Used in some parts of the UI
  parent_hypothesis_id?: string;
  priority: number | string;
  created_at: string;
  updated_at: string;
}

export interface InterviewNote {
  id: string;
  project_id: string;
  session_title: string;
  content: string;
  interviewer: string;
  interviewee?: string;
  interview_type?: 'scoping' | 'inmersion' | 'validacion' | 'seguimiento' | 'cierre' | 'otro';
  captured_at: string;
  location?: string;
  alcoa_hash?: string;
  created_by?: string;
}

export type FindingSeverity = 'critico' | 'alto' | 'medio' | 'bajo' | 'oportunidad';

export interface Finding {
  id: string;
  project_id: string;
  data_source_id?: string;
  folio: string;
  title: string;
  description: string;
  technical_description?: string;
  severity: FindingSeverity;
  area?: string;
  economic_impact?: number;
  economic_impact_basis?: string;
  recommended_action?: string;
  evidence: string; // Simplified to string for ALCOA+ compliance
  hash_md5?: string;
  git_commit?: string;
  captured_at: string;
  status: 'identificado' | 'validado' | 'presentado' | 'cerrado';
}

export interface Deliverable {
  id: string;
  project_id: string;
  deliverable_type: 'propuesta' | 'cronograma' | 'dictamen_forense' |
    'certificado_alcoa' | 'reporte_analisis' | 'tablero_powerbi' | 'nda' | 'acta_entrega' | 'otro';
  title: string;
  status: 'borrador' | 'revision_interna' | 'aprobado' | 'entregado_cliente';
  file_url?: string;
  file_name?: string;
  version: number;
  notes?: string;
  generated_at?: string;
  delivered_at?: string;
}

export interface ProjectActivityLog {
  id: string;
  project_id: string;
  action_type: string;
  entity_type?: string;
  entity_id?: string;
  description: string;
  metadata?: Record<string, unknown>;
  performed_by_name?: string;
  performed_at: string;
}

// === EXTENSION: MULTI-TEAM (Spec 09/10/11) ===

export type WorkstreamType =
  | 'consultoria' | 'desarrollo' | 'ingenieria'
  | 'diseno' | 'qa' | 'externo_otro';

export type TeamType = 'interno' | 'subcontratado' | 'cliente';

export interface ProjectWorkstream {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  workstream_type: WorkstreamType;
  team_type: TeamType;
  contractor_name?: string;
  contractor_contact?: string;
  contractor_rate?: number;
  contractor_rate_type?: 'hora' | 'dia' | 'sprint' | 'fijo' | 'por_entregable';
  color: string;
  display_order: number;
  status: 'activo' | 'pausado' | 'completado' | 'cancelado';
  budget_allocated?: number;
  budget_spent: number;
  created_at: string;
  updated_at: string;
}

export type TaskStatus =
  | 'pendiente' | 'en_progreso' | 'bloqueada'
  | 'en_revision' | 'completada' | 'cancelada';

export interface WorkstreamTask {
  id: string;
  workstream_id: string;
  project_id: string;
  name: string;
  description?: string;
  task_type?: 'entregable' | 'hito' | 'reunion' | 'revision' | 'instalacion' | 'tarea';
  status: TaskStatus;
  priority: 'critica' | 'alta' | 'media' | 'baja';
  responsible_name?: string;
  responsible_type?: 'interno' | 'externo';
  planned_start?: string;
  planned_end?: string;
  actual_start?: string;
  actual_end?: string;
  depends_on?: string[];
  progress_pct: number;
  estimated_cost?: number;
  actual_cost?: number;
  blocker_description?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface WorkstreamMember {
  id: string;
  workstream_id: string;
  project_id: string;
  team_member_id?: string;
  external_name?: string;
  external_role?: string;
  external_email?: string;
  external_phone?: string;
  external_company?: string;
  member_type: 'interno' | 'externo';
  role_in_project: string;
  has_eip_access: boolean;
  access_level?: 'viewer' | 'contributor' | 'lead';
  hours_per_week?: number;
  start_date?: string;
  end_date?: string;
  active: boolean;
}

export type ReportType =
  | 'avance_ejecutivo' | 'entregable_parcial' | 'reporte_final'
  | 'presentacion_hallazgos' | 'sincronizacion_interna'
  | 'reporte_subcontratista' | 'reporte_financiero' | 'risk_log';

export interface ProjectReport {
  id: string;
  project_id: string;
  report_type: ReportType;
  title: string;
  period_start?: string;
  period_end?: string;
  client_facing: boolean;
  executive_summary?: string;
  content: Record<string, unknown>;
  overall_progress_pct?: number;
  on_schedule?: boolean;
  budget_status?: 'en_presupuesto' | 'riesgo' | 'sobrepasado';
  file_url?: string;
  file_name?: string;
  status: 'borrador' | 'revision_interna' | 'aprobado' | 'enviado_cliente';
  generated_at: string;
  sent_at?: string;
  created_at: string;
}

// === EXTENSION: CONTRACT & CLOSURE (Spec 13) ===

export interface ProjectPayment {
  id: string;
  project_id: string;
  payment_type: 'anticipo' | 'parcial' | 'finiquito' | 'subcontratista';
  direction: 'entrante' | 'saliente';
  description: string;
  amount: number;
  currency: string;
  due_date?: string;
  received_at?: string;
  received: boolean;
  payment_method?: 'transferencia' | 'cheque' | 'efectivo' | 'otro';
  reference?: string;
  notes?: string;
  workstream_id?: string;
  created_at: string;
}

export interface PhaseTransition {
  id: string;
  project_id: string;
  from_phase: string;
  to_phase: string;
  confirmed_by_name: string;
  justification?: string;
  conditions_met: Array<{ label: string; met: boolean }>;
  transitioned_at: string;
}

export interface ProjectClosure {
  id: string;
  project_id: string;
  deliverables_accepted: boolean;
  credentials_revoked: boolean;
  final_payment_received: boolean;
  acta_signed: boolean;
  lessons_documented: boolean;
  client_signer_name?: string;
  client_signer_role?: string;
  close_date?: string;
  client_satisfaction?: 'excelente' | 'bueno' | 'regular' | 'malo';
  client_comments?: string;
  team_rating?: number;
  what_worked?: string;
  what_failed?: string;
  next_time?: string;


// === INNOVATION H1-A: TIME TRACKER (Plan de Innovación v1.0) ===

export type TimeEntryBillable = 'facturable' | 'no_facturable' | 'interno';

export interface TimeEntry {
  id: string;
  project_id?: string;
  foundation_id?: string;
  sentinel_id?: string;
  architecture_id?: string;
  team_member_id: string;
  category: 'scoping' | 'analisis' | 'presentacion' | 'documentacion' | 'reunion_cliente' | 'administracion' | 'otro';
  description: string;
  date: string;                  // ISO date YYYY-MM-DD
  hours: number;                 // decimal, e.g. 1.5 = 1h30m
  billable: TimeEntryBillable;
  hourly_rate?: number;           // USD/hr snapshot at time of entry
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined
  team_members?: { full_name: string };
}
