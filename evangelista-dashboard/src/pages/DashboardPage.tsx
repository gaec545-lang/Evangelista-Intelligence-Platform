import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Users, CheckCircle, TrendingUp, Plus, ArrowRight, Shield, Building2, Activity } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Counter from '../components/ui/Counter'
import { HistoryList } from '../components/HistoryList'
import { useHistory } from '../hooks/useHistory'
import { useClients } from '../hooks/useClients'
import { api } from '../lib/api'
import { foundationDB, architectureDB, sentinelDB, activityDB } from '../lib/supabase'

const STAT_CARD_COLORS = [
  { bg: 'bg-[#95B877]/10', text: 'text-[#95B877]', icon: 'text-[#95B877]' },
  { bg: 'bg-amber-500/10',   text: 'text-amber-500',   icon: 'text-amber-500' },
  { bg: 'bg-emerald-500/10',   text: 'text-emerald-500',   icon: 'text-emerald-500' },
  { bg: 'bg-blue-500/10',      text: 'text-blue-500',      icon: 'text-blue-500' },
]

const STAGE_LABELS: Record<string, string> = {
  scoping: 'Scoping',
  cita_1_scheduled: 'Cita 1',
  cita_1_done: 'Cita 1 feita',
  immersion: 'Inmersión',
  cita_2_done: 'Cita 2 feita',
  dictamen_review: 'Dictamen',
  cita_3_scheduled: 'Cita 3',
  cita_3_done: 'Cita 3 feita',
  vetting_gate: 'Vetting',
  cita_4_scheduled: 'Cita 4',
  cita_4_done: 'Cita 4 feita',
  closed_go: 'Go',
  closed_nogo: 'No-Go',
  closed_lost: 'Perdido',
}

export function DashboardPage() {
  const { analyses } = useHistory()
  const { clients } = useClients()
  const [health, setHealth] = useState<{ ready: boolean; checks: Record<string, { status: string; count?: number }> } | null>(null)

  const [foundations, setFoundations] = useState<any[]>([])
  const [architectures, setArchitectures] = useState<any[]>([])
  const [sentinels, setSentinels] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.health().then(setHealth).catch(() => null) }, [])

  useEffect(() => {
    Promise.allSettled([
      foundationDB.list(),
      architectureDB.list(),
      sentinelDB.list(),
      activityDB.list(10),
    ]).then(([f, a, s, act]) => {
      if (f.status === 'fulfilled') setFoundations(f.value)
      if (a.status === 'fulfilled') setArchitectures(a.value)
      if (s.status === 'fulfilled') setSentinels(s.value)
      if (act.status === 'fulfilled') setActivities(act.value)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const activeFoundations = foundations.filter((f) => !f.status.startsWith('closed_'))
  const activeArchitectures = architectures.filter((a) => a.status !== 'completed' && a.status !== 'on_hold')
  const activeSentinels = sentinels.filter((s) => s.status === 'active')

  // Pipeline Foundation stage counts
  const stageCounts: Record<string, number> = {}
  for (const f of foundations) {
    const stage = STAGE_LABELS[f.status] || f.status
    stageCounts[stage] = (stageCounts[stage] || 0) + 1
  }

  // Revenue snapshot
  const sentinelMRR = activeSentinels.reduce((sum: number, s: any) => sum + (s.monthly_fee || 0), 0)
  const architecturePipeline = activeArchitectures.reduce((sum: number, a: any) => sum + (a.setup_fee || 0), 0)

  const avgConf = analyses.filter(a => a.confidence != null).reduce((s, a) => s + (a.confidence ?? 0), 0) / (analyses.filter(a => a.confidence != null).length || 1)
  const agentCount = health?.checks?.agents?.count ?? 0

  const stats = [
    { label: 'Clientes activos', value: clients.length, icon: Users },
    { label: 'Foundation en pipeline', value: activeFoundations.length, icon: Shield },
    { label: 'Architecture en curso', value: activeArchitectures.length, icon: Building2 },
    { label: 'Sentinel activos', value: activeSentinels.length, icon: Activity },
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-serif text-[#F5F5F7] tracking-tight">Intelligence War Room</h1>
            {health && (
              <Badge variant={health.ready ? 'success' : 'danger'} size="sm">
                {health.ready ? 'Sistema operativo' : 'Backend offline'}
              </Badge>
            )}
          </div>
          <p className="max-w-md text-sm text-[#A1A1A6]">
            Consola central de <span className="text-[#F5F5F7]">Evangelista &amp; Co.</span> — intelligence pipeline y control de riesgo operativo.
          </p>
        </div>
        <Link to="/analyze">
          <button className="btn-primary h-9 px-4 text-sm font-medium">
            <Plus size={16} />
            Nuevo análisis
          </button>
        </Link>
      </section>

      {/* Stats Row 1 */}
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
              </div>
              <p className="text-2xl font-semibold tracking-tight text-content-primary mt-2">
                <Counter target={stat.value} />
              </p>
              <p className="text-xs text-content-tertiary mt-1">{stat.label}</p>
            </div>
          )
        })}
      </section>

      {/* Row 2: Foundation Pipeline */}
      {!loading && foundations.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs font-semibold text-[#A1A1A6] tracking-wider uppercase">Pipeline Foundation</h2>
          <div className="bg-[#1C1C1E] border border-[rgba(255,255,255,0.08)] rounded-xl p-5 space-y-3">
            {Object.entries(stageCounts).map(([stage, count]) => (
              <div key={stage} className="flex items-center gap-4">
                <span className="text-xs text-content-tertiary w-24 text-right truncate">{stage}</span>
                <div className="flex-1 bg-[#0D0D0F]/50 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-primary-500/30 rounded-full flex items-center px-2 transition-all"
                    style={{ width: `${Math.max((count / foundations.length) * 100, 8)}%` }}
                  >
                    <span className="text-xs font-medium text-content-primary">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Row 3: Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-serif text-[#F5F5F7]">Actividad reciente</h2>
            <Link to="/history" className="text-sm text-[#95B877] hover:text-[#95B877]/80 flex items-center gap-1 group">
              Ver todo
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          {activities.length > 0 ? (
            <div className="bg-[#1C1C1E] border border-[rgba(255,255,255,0.08)] rounded-xl p-0 overflow-hidden divide-y divide-[rgba(255,255,255,0.04)]">
              {activities.slice(0, 10).map((act: any) => (
                <div key={act.id} className="px-5 py-3 hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-content-primary">{act.action}</p>
                      <p className="text-xs text-content-tertiary">
                        {act.team_members?.full_name || '—'}
                        {act.clients?.name ? ` · ${act.clients.name}` : ''}
                      </p>
                    </div>
                    <span className="text-xs text-content-tertiary">
                      {new Date(act.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-glass p-8 text-center text-content-tertiary text-sm">
              Sin actividad registrada. Usa el sistema para generar entradas.
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-serif text-[#F5F5F7] px-1">Accesos rápidos</h2>
          <div className="bg-[#1C1C1E] border border-[rgba(255,255,255,0.08)] rounded-xl p-0 overflow-hidden divide-y divide-[rgba(255,255,255,0.04)]">
            {[
              { to: '/analyze',   icon: Brain,         label: 'Nuevo análisis', sub: 'Orquestador RAG' },
              { to: '/clients',   icon: Users,          label: 'Clientes',       sub: `${clients.length} registros` },
              { to: '/foundation', icon: Shield,         label: 'Foundation',   sub: `${activeFoundations.length} en pipeline` },
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

      {/* Row 4: Revenue Snapshot */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-[#A1A1A6] tracking-wider uppercase">Revenue Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1C1C1E] border border-[rgba(255,255,255,0.08)] rounded-xl p-5 hover:border-[rgba(255,255,255,0.15)] transition-all">
            <p className="text-xs text-content-tertiary mb-1">MRR Sentinel</p>
            <p className="text-xl font-semibold text-content-primary">
              ${sentinelMRR.toLocaleString('es-MX')}
            </p>
            <p className="text-xs text-content-tertiary">mensual recurrente</p>
          </div>
          <div className="bg-[#1C1C1E] border border-[rgba(255,255,255,0.08)] rounded-xl p-5 hover:border-[rgba(255,255,255,0.15)] transition-all">
            <p className="text-xs text-[#A1A1A6] mb-1">Pipeline Architecture</p>
            <p className="text-xl font-bold text-[#F5F5F7]">
              ${architecturePipeline.toLocaleString('es-MX')}
            </p>
            <p className="text-[10px] text-[#A1A1A6]">{activeArchitectures.length} proyectos activos</p>
          </div>
          <div className="bg-[#1C1C1E] border border-[rgba(255,255,255,0.08)] rounded-xl p-5 hover:border-[rgba(255,255,255,0.15)] transition-all">
            <p className="text-xs text-[#A1A1A6] mb-1">Foundation Fees</p>
            <p className="text-xl font-bold text-[#F5F5F7]">
              {foundations.length} engagements
            </p>
            <p className="text-xs text-content-tertiary">{activeFoundations.length} en curso</p>
          </div>
        </div>
      </section>
    </div>
  )
}
