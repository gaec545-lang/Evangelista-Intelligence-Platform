import { useState, useEffect, useCallback } from 'react'
import { analysesDB } from '../lib/supabase'
import type { Analysis } from '../lib/types'

export function useHistory(clientId?: string) {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setAnalyses(await analysesDB.list(clientId))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setLoading(false)
    }
  }, [clientId])

  useEffect(() => { load() }, [load])

  const saveAnalysis = async (a: Omit<Analysis, 'id' | 'created_at'>) => {
    const saved = await analysesDB.create(a)
    setAnalyses(prev => [saved, ...prev])
    return saved
  }

  return { analyses, loading, error, reload: load, saveAnalysis }
}
