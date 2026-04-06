import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Terminal, Activity, Send, Settings, Clock, AlertCircle, BookOpen, Wrench } from 'lucide-react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { Spinner } from '../components/ui/Spinner'
import { api } from '../lib/api'
import type { AgentInfo } from '../lib/types'

interface ExecutionResult {
  agent: string
  analysis: string
  confidence: number
  recommendations: string[]
  sources: string[]
  escalation: boolean
  escalation_reason?: string
  timestamp: string
  task: string
}

export function AgentDetailPage() {
  const { name } = useParams<{ name: string }>()
  const navigate = useNavigate()
  const [agent, setAgent] = useState<AgentInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState('')
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<ExecutionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<ExecutionResult[]>([])

  useEffect(() => {
    if (!name) return
    api.listAgents().then(res => {
      const found = res.agents.find(a => a.name === name)
      if (found) setAgent(found)
      else navigate('/agents')
    }).catch(() => navigate('/agents')).finally(() => setLoading(false))
  }, [name, navigate])

  const handleExecute = async () => {
    if (!task.trim() || !name || running) return
    setRunning(true)
    setError(null)
    setResult(null)
    try {
      const res = await api.executeAgent(name, task)
      const execution: ExecutionResult = {
        agent: res.agent as string,
        analysis: res.analysis as string,
        confidence: res.confidence as number,
        recommendations: (res.recommendations as string[]) || [],
        sources: (res.sources as string[]) || [],
        escalation: res.escalation as boolean,
        escalation_reason: res.escalation_reason as string | undefined,
        timestamp: new Date().toISOString(),
        task,
      }
      setResult(execution)
      setHistory(prev => [execution, ...prev])
      setTask('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error ejecutando el agente')
    } finally {
      setRunning(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-xs text-content-secondary">Cargando agente…</p>
      </div>
    )
  }

  if (!agent) return null

  return (
    <div className="space-y-10">
      {/* Header */}
      <section>
        <button
          onClick={() => navigate('/agents')}
          className="flex items-center gap-2 text-sm text-content-secondary hover:text-primary-600 transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Agentes
        </button>
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(149,184,119,0.12)' }}
          >
            <Terminal size={24} className="text-primary-400" />
          </div>
          <div>
            <h1 className="!text-2xl capitalize">{agent.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-content-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-soft" /> Activo
              </span>
              <span className="w-1 h-1 rounded-full bg-surface-border" />
              <span className="text-xs text-content-secondary">{agent.tools.length} herramientas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Config grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Domains */}
        <div className="card-glass rounded-card border border-surface-border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-info" />
            <h3 className="text-sm font-semibold">Dominios</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {agent.domains.map(d => (
              <Badge key={d} variant="olive" size="sm">{d}</Badge>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="card-glass rounded-card border border-surface-border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Wrench size={16} className="text-accent-gold" />
            <h3 className="text-sm font-semibold">Herramientas</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {agent.tools.map(t => (
              <Badge key={t} variant="neutral" size="sm">{t}</Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Execute panel */}
      <div className="card-glass rounded-card border border-surface-border p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-primary-400" />
          <h3 className="text-sm font-semibold">Ejecutar tarea</h3>
          {running && <span className="text-xs text-content-secondary ml-auto">Procesando…</span>}
        </div>

        <div className="relative">
          <textarea
            value={task}
            onChange={e => setTask(e.target.value)}
            placeholder={`Comando para el agente ${agent.name}...`}
            rows={3}
            className="w-full px-4 py-3 text-sm rounded-button resize-none pr-12"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#F5F5F7',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'rgba(149,184,119,0.40)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(149,184,119,0.08)'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
          <button
            onClick={handleExecute}
            disabled={running || !task.trim()}
            className="absolute right-2 bottom-2 p-2 rounded-button transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: task.trim() && !running ? 'rgba(149,184,119,0.20)' : 'rgba(255,255,255,0.03)',
              color: task.trim() && !running ? '#A8CC8D' : '#636366',
            }}
          >
            {running ? <Activity size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-card" style={{ background: 'rgba(255,69,58,0.08)', border: '1px solid rgba(255,69,58,0.15)' }}>
            <AlertCircle size={16} className="text-danger mt-0.5 flex-shrink-0" />
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 pt-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            {/* Header line */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span className="text-xs font-semibold text-content-secondary uppercase tracking-widest">Ejecución OK</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="olive" size="xs">{Math.round(result.confidence * 100)}% confianza</Badge>
                <span className="text-[10px] text-content-secondary">{new Date(result.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="p-4 rounded-card" style={{ background: 'rgba(149,184,119,0.04)', border: '1px solid rgba(149,184,119,0.10)' }}>
              <p className="text-sm leading-relaxed text-content-secondary/80 whitespace-pre-wrap">{result.analysis}</p>
            </div>

            {result.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-content-secondary uppercase tracking-widest">Recomendaciones</h4>
                <ul className="space-y-1">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="text-sm text-content-secondary flex items-start gap-2">
                      <span className="text-primary-400 mt-0.5">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.escalation && (
              <div className="flex items-center gap-2 text-xs text-warning" style={{ background: 'rgba(255,214,43,0.06)', padding: '8px 12px', borderRadius: 'var(--radius-card)', border: '1px solid rgba(255,214,43,0.15)' }}>
                <AlertCircle size={14} />
                Escalación necesaria: {result.escalation_reason}
              </div>
            )}

            {result.sources.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {result.sources.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded-badge text-[10px] font-medium" style={{ background: 'rgba(100,210,255,0.06)', color: '#64D2FF', border: '1px solid rgba(100,210,255,0.12)' }}>
                    {s}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-content-secondary" />
            <h3 className="text-sm font-semibold">Historial de ejecuciones</h3>
            <span className="text-xs text-content-secondary ml-auto">{history.length}</span>
          </div>
          <div className="space-y-2">
            {history.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="card-glass rounded-card border border-surface-border p-4 cursor-pointer"
                onClick={() => setResult(h)}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{h.task}</p>
                    <p className="text-xs text-content-secondary">{new Date(h.timestamp).toLocaleTimeString()}</p>
                  </div>
                  <Badge variant="olive" size="xs">{Math.round(h.confidence * 100)}%</Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
