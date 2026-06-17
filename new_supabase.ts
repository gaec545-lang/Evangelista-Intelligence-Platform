import { apiClient } from './apiClient';
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { 
  Client, Analysis, Proposal, TeamMember, FoundationEngagement, ArchitectureProject, SentinelSubscription,
  Project, ProjectPhase, DataSource, Hypothesis, InterviewNote, Finding, Deliverable, ProjectActivityLog,
  ProjectWorkstream, WorkstreamTask, ProjectReport,
  ProjectPayment, PhaseTransition, ProjectClosure
} from './types'

export const supabase = null;

export const clientsDB = {
  async list(): Promise<Client[]> {
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  },
  async get(id: string): Promise<Client | null> {
    const { data, error } = await supabase.from('clients').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },
  async create(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
    const { data, error } = await supabase.from('clients').insert(client).select().single()
    if (error) throw error
    return data
  },
  async update(id: string, updates: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase.from('clients').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (error) throw error
  },
}

export const analysesDB = {
  async list(clientId?: string): Promise<Analysis[]> {
    let query = supabase.from('analyses').select('*, client:clients(name)').order('created_at', { ascending: false })
    if (clientId) query = query.eq('client_id', clientId)
    const { data, error } = await query
    if (error) throw error
    return (data as any) ?? []
  },
  async create(analysis: Omit<Analysis, 'id' | 'created_at'>): Promise<Analysis> {
    const { data, error } = await supabase.from('analyses').insert(analysis).select().single()
    if (error) throw error
    return data
  },
}

export const proposalsDB = {
  async list(clientId: string): Promise<Proposal[]> {
    const { data, error } = await supabase.from('proposals').select('*').eq('client_id', clientId).order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  },
  async create(proposal: Omit<Proposal, 'id' | 'created_at' | 'updated_at'>): Promise<Proposal> {
    const { data, error } = await supabase.from('proposals').insert(proposal).select().single()
    if (error) throw error
    return data
  },
}

// === TEAM MEMBERS ===
export const teamDB = {
  async list() {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('role')
    if (error) throw error
    return data as TeamMember[]
  },
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('user_id', userId)
      .single()
    if (error) return null
    return data as TeamMember
  },
  async create(member: Partial<TeamMember>) {
    const { data, error } = await supabase
      .from('team_members')
      .insert(member)
      .select()
      .single()
    if (error) throw error
    return data as TeamMember
  },
  async update(id: string, updates: Partial<TeamMember>) {
    const { data, error } = await supabase
      .from('team_members')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as TeamMember
  },
  async deactivate(id: string) {
    return this.update(id, { is_active: false })
  }
}

// === FOUNDATION ENGAGEMENTS ===
export const foundationDB = {
  async list(filters?: { status?: string; assigned_to?: string }) {
    let query = supabase
      .from('foundation_engagements')
      .select('*, clients(name, sector, city), team_members!assigned_to(full_name)')
      .order('updated_at', { ascending: false })
    if (filters?.status) query = query.eq('status', filters.status)
    if (filters?.assigned_to) query = query.eq('assigned_to', filters.assigned_to)
    const { data, error } = await query
    if (error) throw error
    return data as any[]
  },
  async get(id: string) {
    const { data, error } = await supabase
      .from('foundation_engagements')
      .select('*, clients(*), team_members!assigned_to(full_name, role)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as any
  },
  async getByClient(clientId: string) {
    const { data, error } = await supabase
      .from('foundation_engagements')
      .select('*, team_members!assigned_to(full_name)')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as any[]
  },
  async create(engagement: Partial<FoundationEngagement>) {
    const { data, error } = await supabase
      .from('foundation_engagements')
      .insert(engagement)
      .select()
      .single()
    if (error) throw error
    return data as any
  },
  async update(id: string, updates: Partial<FoundationEngagement>) {
    const { data, error } = await supabase
      .from('foundation_engagements')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as any
  },
  async advanceStatus(id: string, newStatus: string) {
    return this.update(id, { status: newStatus as any })
  },
  async addHallazgo(id: string, hallazgo: object) {
    const current = await this.get(id)
    const hallazgos = [...(current.hallazgos || []), hallazgo]
    const total = hallazgos.reduce((sum: number, h: any) => sum + (h.costo_anual || 0), 0)
    return this.update(id, { hallazgos, dictamen_total_impacto: total })
  }
}

// === ARCHITECTURE PROJECTS ===
export const architectureDB = {
  async list(filters?: { status?: string }) {
    let query = supabase
      .from('architecture_projects')
      .select('*, clients(name, sector), team_members!assigned_to(full_name)')
      .order('updated_at', { ascending: false })
    if (filters?.status) query = query.eq('status', filters.status)
    const { data, error } = await query
    if (error) throw error
    return data as any[]
  },
  async get(id: string) {
    const { data, error } = await supabase
      .from('architecture_projects')
      .select('*, clients(*), foundation_engagements(*), team_members!assigned_to(full_name)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as any
  },
  async create(project: Partial<ArchitectureProject>) {
    const { data, error } = await supabase
      .from('architecture_projects')
      .insert(project)
      .select()
      .single()
    if (error) throw error
    return data as any
  },
  async update(id: string, updates: Partial<ArchitectureProject>) {
    const { data, error } = await supabase
      .from('architecture_projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as any
  },
  async getByClient(clientId: string) {
    const { data, error } = await supabase
      .from('architecture_projects')
      .select('*, clients(name, sector), team_members!assigned_to(full_name)')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as any[]
  }
}

// === SENTINEL SUBSCRIPTIONS ===
export const sentinelDB = {
  async list(filters?: { status?: string }) {
    let query = supabase
      .from('sentinel_subscriptions')
      .select('*, clients(name, sector), team_members!assigned_to(full_name)')
      .order('updated_at', { ascending: false })
    if (filters?.status) query = query.eq('status', filters.status)
    const { data, error } = await query
    if (error) throw error
    return data as any[]
  },
  async get(id: string) {
    const { data, error } = await supabase
      .from('sentinel_subscriptions')
      .select('*, clients(*), architecture_projects(*), team_members!assigned_to(full_name)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as any
  },
  async create(sub: Partial<SentinelSubscription>) {
    const { data, error } = await supabase
      .from('sentinel_subscriptions')
      .insert(sub)
      .select()
      .single()
    if (error) throw error
    return data as any
  },
  async update(id: string, updates: Partial<SentinelSubscription>) {
    const { data, error } = await supabase
      .from('sentinel_subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as any
  },
  async getByClient(clientId: string) {
    const { data, error } = await supabase
      .from('sentinel_subscriptions')
      .select('*, clients(name, sector), team_members!assigned_to(full_name)')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as any[]
  }
}

// === ACTIVITY LOG ===
export const activityLogDB = {
  async log(entry: { team_member_id?: string; client_id?: string; action: string; entity_type: string; entity_id?: string; details?: object }) {
    const { error } = await supabase.from('activity_log').insert(entry)
    if (error) console.error('Activity log failed:', error)
  },
  async list(limit = 30, clientId?: string) {
    let query = supabase
      .from('activity_log')
      .select('*, team_members(full_name), clients(name)')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (clientId) query = query.eq('client_id', clientId)
    const { data, error } = await query
    if (error) throw error
    return data as any[]
  }
}

// === REDESIGN: PROJECT-CENTRIC HELPERS (Spec 01) ===

export const projectsDB = {
  async list() {
    const { data, error } = await supabase.from('projects').select('*, clients(name)').order('created_at', { ascending: false })
    if (error) throw error
    return data as any[]
  },

  async getByClient(clientId: string) {
    const { data, error } = await supabase.from('projects').select('*').eq('client_id', clientId).order('created_at', { ascending: false })
    if (error) throw error
    return data as any[]
  },

  async getById(id: string) {
    const { data, error } = await supabase.from('projects').select('*, clients(name)').eq('id', id).single()
    if (error) throw error
    return data as Project
  },

  async create(data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const { data: result, error } = await supabase.from('projects').insert(data).select().single()
    if (error) throw error
    return result as Project
  },

  async update(id: string, data: Partial<Project>) {
    const { data: result, error } = await supabase.from('projects').update(data).eq('id', id).select().single()
    if (error) throw error
    return result as Project
  },

  async delete(id: string) {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
  },

  async getPhases(projectId: string) {
    const { data, error } = await supabase.from('project_phases').select('*').eq('project_id', projectId).order('phase_order')
    if (error) throw error
    return data as ProjectPhase[]
  },

  async createPhase(data: Omit<ProjectPhase, 'id' | 'created_at' | 'updated_at'>) {
    const { data: result, error } = await supabase.from('project_phases').insert(data).select().single()
    if (error) throw error
    return result as ProjectPhase
  },
};

export const dataSourcesDB = {
  getByProject: (projectId: string) =>
    supabase.from('data_sources').select('*').eq('project_id', projectId),

  getByClient: (clientId: string) =>
    supabase.from('data_sources').select('*').eq('client_id', clientId),

  create: (data: Omit<DataSource, 'id' | 'created_at'>) =>
    supabase.from('data_sources').insert(data).select().single(),

  update: (id: string, data: Partial<DataSource>) =>
    supabase.from('data_sources').update(data).eq('id', id).select().single(),

  delete: (id: string) =>
    supabase.from('data_sources').delete().eq('id', id),
};


export const deliverablesDB = {
  getByProject: (projectId: string) =>
    supabase.from('deliverables').select('*').eq('project_id', projectId),

  create: (data: Omit<Deliverable, 'id' | 'created_at' | 'updated_at'>) =>
    supabase.from('deliverables').insert(data).select().single(),

  update: (id: string, data: Partial<Deliverable>) =>
    supabase.from('deliverables').update(data).eq('id', id).select().single(),
};

export const projectActivityLogDB = {
  getByProject: (projectId: string, limit = 50) =>
    supabase.from('project_activity_log').select('*')
      .eq('project_id', projectId)
      .order('performed_at', { ascending: false })
      .limit(limit),

  log: (entry: Omit<ProjectActivityLog, 'id' | 'performed_at'>) =>
    supabase.from('project_activity_log').insert(entry),
};

export const interviewNotesDB = {
  getByProject: (projectId: string) =>
    supabase.from('interview_notes').select('*').eq('project_id', projectId).order('captured_at', { ascending: false }),

  create: (data: Omit<InterviewNote, 'id' | 'created_at'>) =>
    supabase.from('interview_notes').insert(data).select().single(),
};

export const hypothesesDB = {
  getByProject: (projectId: string) =>
    supabase.from('hypotheses').select('*').eq('project_id', projectId).order('created_at', { ascending: true }),

  create: (data: Omit<Hypothesis, 'id' | 'created_at' | 'updated_at'>) =>
    supabase.from('hypotheses').insert(data).select().single(),

  update: (id: string, data: Partial<Hypothesis>) =>
    supabase.from('hypotheses').update(data).eq('id', id).select().single(),

  delete: (id: string) =>
    supabase.from('hypotheses').delete().eq('id', id),
};

export const findingsDB = {
  getByProject: (projectId: string) =>
    supabase.from('findings').select('*').eq('project_id', projectId).order('folio', { ascending: true }),

  create: (data: Omit<Finding, 'id' | 'created_at' | 'updated_at' | 'captured_at'>) =>
    supabase.from('findings').insert(data).select().single(),

  update: (id: string, data: Partial<Finding>) =>
    supabase.from('findings').update(data).eq('id', id).select().single(),

  delete: (id: string) =>
    supabase.from('findings').delete().eq('id', id),
};

// ─── WORKSTREAMS (Spec 09) ─────────────────────────────────────────────
export const workstreamsDB = {
  getByProject: (projectId: string) =>
    supabase.from('project_workstreams').select(`
      *,
      workstream_members(*),
      workstream_tasks(*)
    `).eq('project_id', projectId).order('display_order'),

  create: (data: Omit<ProjectWorkstream, 'id' | 'created_at' | 'updated_at'>) =>
    supabase.from('project_workstreams').insert(data).select().single(),

  update: (id: string, data: Partial<ProjectWorkstream>) =>
    supabase.from('project_workstreams').update(data).eq('id', id).select().single(),

  delete: (id: string) =>
    supabase.from('project_workstreams').delete().eq('id', id),
};

// ─── TASKS (Spec 10) ───────────────────────────────────────────────────
export const tasksDB = {
  getByWorkstream: (workstreamId: string) =>
    supabase.from('workstream_tasks').select('*')
      .eq('workstream_id', workstreamId)
      .order('display_order'),

  getByProject: (projectId: string) =>
    supabase.from('workstream_tasks').select('*')
      .eq('project_id', projectId)
      .order('planned_start', { ascending: true }),

  create: (data: Omit<WorkstreamTask, 'id' | 'created_at' | 'updated_at'>) =>
    supabase.from('workstream_tasks').insert(data).select().single(),

  update: (id: string, data: Partial<WorkstreamTask>) =>
    supabase.from('workstream_tasks').update(data).eq('id', id).select().single(),

  updateProgress: (id: string, pct: number) =>
    supabase.from('workstream_tasks').update({ progress_pct: pct })
      .eq('id', id),

  delete: (id: string) =>
    supabase.from('workstream_tasks').delete().eq('id', id),
};

// ─── REPORTS (Spec 11) ─────────────────────────────────────────────────
export const reportsDB = {
  getByProject: (projectId: string, clientFacingOnly = false) => {
    let query = supabase.from('project_reports').select('*')
      .eq('project_id', projectId);
    if (clientFacingOnly) query = query.eq('client_facing', true);
    return query.order('created_at', { ascending: false });
  },

  create: (data: Omit<ProjectReport, 'id' | 'created_at' | 'updated_at'>) =>
    supabase.from('project_reports').insert(data).select().single(),

  update: (id: string, data: Partial<ProjectReport>) =>
    supabase.from('project_reports').update(data).eq('id', id).select().single(),
};

// ─── CONTRACT & CLOSURE (Spec 13) ──────────────────────────────────────

export const paymentsDB = {
  getByProject: (projectId: string) =>
    supabase.from('project_payments').select('*')
      .eq('project_id', projectId)
      .order('created_at'),

  create: (data: Omit<ProjectPayment, 'id' | 'created_at' | 'updated_at'>) =>
    supabase.from('project_payments').insert(data).select().single(),

  markReceived: (id: string, method: string, reference?: string) =>
    supabase.from('project_payments').update({
      received: true,
      received_at: new Date().toISOString(),
      payment_method: method,
      reference,
    }).eq('id', id).select().single(),
};

export const phaseTransitionsDB = {
  getByProject: (projectId: string) =>
    supabase.from('project_phase_transitions').select('*')
      .eq('project_id', projectId)
      .order('transitioned_at'),

  create: (data: Omit<PhaseTransition, 'id' | 'transitioned_at'>) =>
    supabase.from('project_phase_transitions').insert(data).select().single(),
};

export const closureDB = {
  getByProject: (projectId: string) =>
    supabase.from('project_closure').select('*')
      .eq('project_id', projectId).single(),

  create: (projectId: string) =>
    supabase.from('project_closure').insert({ project_id: projectId }).select().single(),

  update: (projectId: string, data: Partial<ProjectClosure>) =>
    supabase.from('project_closure').update(data)
      .eq('project_id', projectId).select().single(),
};

// ─── TIME TRACKER (H1-A: Plan de Innovación) ───────────────────────────
import type { TimeEntry } from './types'

export const timeTrackerDB = {
  // List entries with optional filters
  async list(filters?: {
    team_member_id?: string;
    project_id?: string;
    foundation_id?: string;
    from?: string;  // ISO date
    to?: string;    // ISO date
  }) {
    let query = supabase
      .from('time_entries')
      .select('*, team_members(full_name)')
      .order('date', { ascending: false });
    if (filters?.team_member_id) query = query.eq('team_member_id', filters.team_member_id);
    if (filters?.project_id) query = query.eq('project_id', filters.project_id);
    if (filters?.foundation_id) query = query.eq('foundation_id', filters.foundation_id);
    if (filters?.from) query = query.gte('date', filters.from);
    if (filters?.to) query = query.lte('date', filters.to);
    const { data, error } = await query;
    if (error) throw error;
    return data as TimeEntry[];
  },

  async create(entry: Omit<TimeEntry, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('time_entries').insert(entry).select().single();
    if (error) throw error;
    return data as TimeEntry;
  },

  async update(id: string, updates: Partial<TimeEntry>) {
    const { data, error } = await supabase
      .from('time_entries').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as TimeEntry;
  },

  async delete(id: string) {
    const { error } = await supabase.from('time_entries').delete().eq('id', id);
    if (error) throw error;
  },

  // Aggregate: total hours + billable hours + estimated revenue per project
  async summaryByProject(projectId: string): Promise<{
    total_hours: number;
    billable_hours: number;
    non_billable_hours: number;
    estimated_revenue: number;
  }> {
    const entries = await this.list({ project_id: projectId });
    const total_hours = entries.reduce((s, e) => s + e.hours, 0);
    const billable = entries.filter(e => e.billable === 'facturable');
    const billable_hours = billable.reduce((s, e) => s + e.hours, 0);
    const estimated_revenue = billable.reduce((s, e) => s + e.hours * (e.hourly_rate ?? 0), 0);
    return {
      total_hours,
      billable_hours,
      non_billable_hours: total_hours - billable_hours,
      estimated_revenue,
    };
  },

  // Weekly summary for a team member (current week by default)
  async weeklyByMember(teamMemberId: string, weekStart?: string) {
    const start = weekStart ?? new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0];
    const end = new Date().toISOString().split('T')[0];
    return this.list({ team_member_id: teamMemberId, from: start, to: end });
  },
};
