import { useState, useEffect, useCallback } from 'react'
import { clientsDB } from '../lib/supabase'
import type { Client } from '../lib/types'

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setClients(await clientsDB.list())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error cargando clientes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const createClient = async (data: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    const c = await clientsDB.create(data)
    setClients(prev => [c, ...prev])
    return c
  }

  const updateClient = async (id: string, updates: Partial<Client>) => {
    const c = await clientsDB.update(id, updates)
    setClients(prev => prev.map(x => x.id === id ? c : x))
    return c
  }

  const deleteClient = async (id: string) => {
    await clientsDB.delete(id)
    setClients(prev => prev.filter(x => x.id !== id))
  }

  return { clients, loading, error, reload: load, createClient, updateClient, deleteClient }
}
