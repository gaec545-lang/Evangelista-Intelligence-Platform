import { createClient } from '@supabase/supabase-js'
import type { Client, Analysis, Proposal, TeamMember, FoundationEngagement, ArchitectureProject, SentinelSubscription } from './types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Si las credenciales faltan, usamos un placeholder que no lanza errors
const SUPABASE_CONFIGURED = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder_key_not_real',
)

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
  }
}

// === ACTIVITY LOG ===
export const activityDB = {
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
