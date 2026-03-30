import { useState } from 'react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { api } from '../lib/api'
import type { AgentInfo } from '../lib/types'

export function AgentCard({ agent }: { agent: AgentInfo }) {
  const [task, setTask] = useState('')
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<Record<string, unknown> | null>(null)

  const run = async () => {
    if (!task.trim()) return
    setRunning(true)
    try {
      setResult(await api.executeAgent(agent.name, task))
    } catch (e) { console.error(e) }
    finally { setRunning(false) }
  }

  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-serif font-semibold text-eva-charcoal capitalize">{agent.name}</h3>
        <Badge variant="olive">activo</Badge>
      </div>
      <div className="flex flex-wrap gap-1 mb-4">
        {agent.domains.map(d => <Badge key={d} variant="gray">{d}</Badge>)}
      </div>
      <div className="space-y-2">
        <textarea value={task} onChange={e => setTask(e.target.value)} placeholder="Tarea para este agente..." rows={2}
          className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--eva-border)] resize-none focus:outline-none focus:ring-2 focus:ring-eva-olive/30" />
        <Button size="sm" onClick={run} loading={running} disabled={!task.trim()}>Ejecutar</Button>
      </div>
      {result && (
        <div className="mt-3 p-3 bg-eva-cream rounded-lg text-xs text-eva-charcoal">
          <p className="font-medium mb-1">Confianza: {Math.round((result.confidence as number) * 100)}%</p>
          <p className="leading-relaxed">{String(result.analysis ?? '').slice(0, 300)}...</p>
        </div>
      )}
    </Card>
  )
}
