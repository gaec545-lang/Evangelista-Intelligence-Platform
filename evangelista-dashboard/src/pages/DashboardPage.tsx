import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Users, CheckCircle, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Counter from '../components/ui/Counter'
import { HistoryList } from '../components/HistoryList'
import { useHistory } from '../hooks/useHistory'
import { useClients } from '../hooks/useClients'
import { api } from '../lib/api'

const STAT_CARD_COLORS = [
  { bg: 'bg-primary-500/10', text: 'text-primary-600', icon: 'text-primary-500' },
  { bg: 'bg-warning/10',   text: 'text-warning',   icon: 'text-warning' },
  { bg: 'bg-success/10',   text: 'text-success',   icon: 'text-success' },
  { bg: 'bg-info/10',      text: 'text-info',      icon: 'text-info' },
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
          <button className="btn-primary h-9 px-4 text-sm font-medium">
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
              className="card-glass p-5 hover:shadow-card-hover transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center ${colors.icon} transition-all`}
                >
                  <stat.icon size={18} />
                </div>
                <Badge variant={stat.variant as any} size="sm" />
              </div>
              <p className="text-2xl font-semibold tracking-tight text-content-primary mt-2">
                <Counter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs text-content-tertiary mt-1">{stat.label}</p>
            </div>
          )
        })}
      </section>

      {/* Activity + Quick Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2>Actividad reciente</h2>
            <Link to="/history" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 group">
              Ver todo
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="card-glass p-0 overflow-hidden">
            <div className="divide-y divide-white/[0.06]">
              <HistoryList analyses={analyses} limit={6} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2>Accesos rápidos</h2>
          <div className="card-glass p-0 overflow-hidden">
            {[
              { to: '/analyze',   icon: Brain,         label: 'Nuevo análisis', sub: 'Orquestador RAG' },
              { to: '/clients',   icon: Users,          label: 'Clientes',       sub: `${clients.length} registros` },
              { to: '/proposals', icon: CheckCircle,    label: 'Propuestas',     sub: 'Foundation & Architecture' },
              { to: '/graph',     icon: TrendingUp,     label: 'Arquitectura',   sub: 'Grafo LangGraph' },
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-center gap-3 px-5 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-content-tertiary group-hover:text-primary-500 group-hover:border-primary-500/30 transition-all">
                  <item.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-content-primary">{item.label}</p>
                  <p className="text-xs text-content-tertiary truncate">{item.sub}</p>
                </div>
                <ArrowRight size={14} className="text-white/[0.06] group-hover:text-primary-500 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
