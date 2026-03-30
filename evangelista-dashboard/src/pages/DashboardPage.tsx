import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Users, CheckCircle, TrendingUp, Plus } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { HistoryList } from '../components/HistoryList'
import { useHistory } from '../hooks/useHistory'
import { useClients } from '../hooks/useClients'
import { api } from '../lib/api'

export function DashboardPage() {
  const { analyses } = useHistory()
  const { clients } = useClients()
  const [health, setHealth] = useState<{ ready: boolean; checks: Record<string, { status: string; count?: number }> } | null>(null)

  useEffect(() => { api.health().then(setHealth).catch(() => null) }, [])

  const avgConf = analyses.filter(a => a.confidence != null).reduce((s, a) => s + (a.confidence ?? 0), 0) / (analyses.filter(a => a.confidence != null).length || 1)
  const agentCount = health?.checks?.agents?.count ?? 0

  const stats = [
    { label: 'Clientes', value: clients.length, icon: Users, color: 'text-eva-olive' },
    { label: 'Análisis ejecutados', value: analyses.length, icon: Brain, color: 'text-eva-gold' },
    { label: 'Agentes activos', value: agentCount, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Confianza promedio', value: `${Math.round(avgConf * 100)}%`, icon: TrendingUp, color: 'text-blue-600' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-eva-charcoal">Dashboard</h1>
          <p className="text-eva-warm-gray mt-1">Plataforma de inteligencia de Evangelista & Co.</p>
        </div>
        <div className="flex items-center gap-3">
          {health && (
            <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${health.ready ? 'bg-green-50 text-green-700' : 'bg-eva-red/10 text-eva-red'}`}>
              <span className={`w-2 h-2 rounded-full ${health.ready ? 'bg-green-500' : 'bg-eva-red'}`} />
              {health.ready ? 'Sistema operativo' : 'Sin conexión al backend'}
            </span>
          )}
          <Link to="/analyze"><Button><Plus size={16} /> Nuevo análisis</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Card key={stat.label}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-black/5`}><stat.icon size={18} className={stat.color} /></div>
              <div>
                <p className="text-2xl font-bold text-eva-charcoal">{stat.value}</p>
                <p className="text-xs text-eva-warm-gray">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-semibold text-eva-charcoal">Últimos análisis</h2>
            <Link to="/analyze" className="text-xs text-eva-olive hover:underline">Ver todos</Link>
          </div>
          <HistoryList analyses={analyses} limit={5} />
        </Card>
        <Card>
          <h2 className="font-serif font-semibold text-eva-charcoal mb-4">Accesos rápidos</h2>
          <div className="space-y-2">
            {[
              { to: '/analyze', icon: Brain, color: 'text-eva-olive', label: 'Nuevo análisis', sub: 'Ejecutar el orquestador' },
              { to: '/clients', icon: Users, color: 'text-eva-gold', label: 'Gestionar clientes', sub: `${clients.length} clientes registrados` },
              { to: '/proposals', icon: CheckCircle, color: 'text-green-600', label: 'Generar propuesta', sub: 'Foundation o Architecture' },
            ].map(item => (
              <Link key={item.to} to={item.to} className="flex items-center gap-3 p-3 rounded-lg hover:bg-eva-cream transition-colors">
                <item.icon size={18} className={item.color} />
                <div>
                  <p className="text-sm font-medium text-eva-charcoal">{item.label}</p>
                  <p className="text-xs text-eva-warm-gray">{item.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
