import { useState } from 'react'
import { useAnalysis } from '../hooks/useAnalysis'
import { SubtaskTimeline } from './SubtaskTimeline'
import { AnalysisResult } from './AnalysisResult'
import { Button } from './ui/Button'
import { Spinner } from './ui/Spinner'

interface Props {
  clientId?: string
  onComplete?: (result: { task: string; response: string; confidence: number }) => void
}

export function AnalysisPanel({ clientId, onComplete }: Props) {
  const [task, setTask] = useState('')
  const { analyze, loading, result, error, reset } = useAnalysis()

  const handleAnalyze = async () => {
    if (!task.trim()) return
    const ctx = clientId ? { client_id: clientId } : {}
    const res = await analyze(task, ctx).catch(() => null)
    if (res && onComplete) onComplete({ task, response: res.response, confidence: res.confidence })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <textarea
          value={task}
          onChange={e => setTask(e.target.value)}
          placeholder={"Describe la tarea para el orquestador...\nEj: 'Calcula el Setup Fee para una empresa textilera con 2 plantas y 1 SAP'"}
          rows={4}
          className="w-full px-4 py-3 text-sm rounded-xl border border-[var(--eva-border)] resize-none focus:outline-none focus:ring-2 focus:ring-eva-olive/30 bg-white"
        />
        <div className="flex gap-2 justify-end">
          {result && <Button variant="ghost" size="sm" onClick={reset}>Limpiar</Button>}
          <Button onClick={handleAnalyze} loading={loading} disabled={!task.trim()}>
            {loading ? 'Analizando...' : 'Analizar'}
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-3 py-8">
          <Spinner size="lg" />
          <p className="text-sm text-eva-warm-gray">El orquestador está procesando tu solicitud...</p>
        </div>
      )}

      {error && <div className="rounded-lg bg-eva-red/5 border border-eva-red/20 p-4"><p className="text-sm text-eva-red">{error}</p></div>}

      {result && !loading && (
        <div className="space-y-4">
          {result.subtasks && result.subtasks.length > 0 && (
            <div>
              <p className="text-xs font-medium text-eva-warm-gray mb-3 uppercase tracking-wide">Subtareas ejecutadas</p>
              <SubtaskTimeline subtasks={result.subtasks} />
            </div>
          )}
          <AnalysisResult
            response={result.response}
            confidence={result.confidence}
            sources={result.sources}
            errors={result.errors}
            executionTimeMs={result.execution_time_ms}
          />
        </div>
      )}
    </div>
  )
}
