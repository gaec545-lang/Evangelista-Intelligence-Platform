import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Users, CheckCircle, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Counter from '../components/ui/Counter'
import { HistoryList } from '../components/HistoryList'
import { useHistory } from '../hooks/useHistory'
import { useClients } from '../hooks/useClients'
import { api } from '../lib/api'

const STAT_CARD_COLORS = [
  { bg: 'bg-primary-50',   text: 'text-primary-600',   iconColor: 'text-primary-600' },
  { bg: 'bg-amber-50',     text: 'text-amber-700',     iconColor: 'text-amber-600' },
  { bg: 'bg-emerald-50',   text: 'text-emerald-700',   iconColor: 'text-emerald-600' },
  { bg: 'bg-sky-50',       text: 'text-sky-700',       iconColor: 'text-sky-600' },
]

export function DashboardPage() {
  const { analyses } = useHistory()
  const { clients } = useClients()
  const [health, setHealth] = useState<{ ready: boolean; checks: Record<string, { status: string; count?: number }> } | null>(null)

  useEffect(() => { api.health().then(setHealth).catch(() => null) }, [])

  const avgConf = analyses.filter(a => a.confidence != null).reduce((s, a) => s + (a.confidence ?? 0), 0) / (analyses.filter(a => a.confidence != null).length || 1)
  const agentCount = health?.checks?.agents?.count ?? 0

  const stats = [
    { label: 'Clientes', value: clients.length, icon: Users },
    { label: 'Análisis', value: analyses.length, icon: Brain },
    { label: 'Agentes', value: agentCount, icon: CheckCircle },
    { label: 'Confianza media', value: Math.round(avgConf * 100), icon: TrendingUp, suffix: '%' },
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1>Overview</h1>
            {health && (
              <Badge variant={health.ready ? 'success' : 'danger'} size="sm">
                {health.ready ? 'Sistema operativo' : 'Backend offline'}
              </Badge>
            )}
          </div>
          <p className="max-w-md">
            Consola de <span className="text-content-primary">Evangelista &amp; Co.</span> — inteligencia y arquitectura de datos.
          </p>
        </div>
        <Link to="/analyze">
          <button className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium text-white bg-primary-600 rounded-button hover:bg-primary-700 transition-colors">
            <Plus size={16} />
            Nuevo análisis
          </button>
        </Link>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const colors = STAT_CARD_COLORS[i]
          return (
            <div
              key={stat.label}
              className="bg-white rounded-card border border-surface-border p-5 hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon size={18} className={colors.iconColor} />
                <Badge variant={stat.variant as any} size="sm" />
              </div>
              <p className="text-2xl font-semibold tracking-tight mt-2">
                <Counter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs text-content-tertiary mt-1">{stat.label}</p>
            </div>
          )
        })}
      </section>

      {/* Activity + Quick Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2>Actividad reciente</h2>
            <Link to="/history" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 group">
              Ver todo
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <Card padding={false}>
            <div className="divide-y divide-surface-border">
              <HistoryList analyses={analyses} limit={6} />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h2>Accesos rápidos</h2>
          <Card padding={false}>
            {[
              { to: '/analyze',   icon: Brain,   label: 'Nuevo análisis',    sub: 'Orquestador RAG' },
              { to: '/clients',   icon: Users,   label: 'Clientes',           sub: `${clients.length} registros` },
              { to: '/proposals', icon: CheckCircle, label: 'Propuestas',     sub: 'Foundation & Architecture' },
              { to: '/graph',     icon: TrendingUp, label: 'Arquitectura',    sub: 'Grafo LangGraph' },
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-center gap-3 px-5 py-3 hover:bg-surface-hover transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-surface border border-surface-border flex items-center justify-center text-content-tertiary group-hover:text-primary-600 group-hover:border-primary-200 transition-all">
                  <item.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-content-primary">{item.label}</p>
                  <p className="text-xs text-content-tertiary truncate">{item.sub}</p>
                </div>
                <ArrowRight size={14} className="text-surface-border group-hover:text-primary-500 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
              </Link>
            ))}
          </Card>
        </div>
      </section>
    </div>
  )
}
