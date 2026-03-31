import { createClient } from '@supabase/supabase-js'
import type { Client, Analysis, Proposal } from './types'

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
    let query = supabase.from('analyses').select('*').order('created_at', { ascending: false })
    if (clientId) query = query.eq('client_id', clientId)
    const { data, error } = await query
    if (error) throw error
    return data ?? []
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
