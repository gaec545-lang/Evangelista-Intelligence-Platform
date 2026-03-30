import { useState } from 'react'
import { api } from '../lib/api'
import type { AnalyzeResponse } from '../lib/api'

export function useAnalysis() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyze = async (task: string, context?: Record<string, unknown>) => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await api.analyze({ task, context })
      setResult(res)
      return res
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error desconocido'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }

  return { analyze, loading, result, error, reset: () => { setResult(null); setError(null) } }
}
