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
