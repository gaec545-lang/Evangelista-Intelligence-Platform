import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import type { AgentInfo } from '../lib/types'

export function useAgents() {
  const [agents, setAgents] = useState<AgentInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.listAgents()
      .then(d => setAgents(d.agents))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { agents, loading, error }
}
