import { useEffect, useState } from 'react'
import { Settings, Globe, Database, Activity, RefreshCw, CheckCircle2 } from 'lucide-react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { api } from '../lib/api'

export function SettingsPage() {
  const [health, setHealth] = useState<{ ready: boolean; checks: Record<string, { status: string }> } | null>(null)
  const [checking, setChecking] = useState(false)

  const check = async () => {
    setChecking(true)
    try {
      const data = await api.health()
      setHealth(data)
    } catch {
      setHealth({ ready: false, checks: { backend: { status: 'error' } } })
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    check()
  }, [])

  return (
    <div className="max-w-4xl space-y-10">
      {/* Header */}
      <section className="space-y-1">
        <div className="flex items-center gap-3">
          <Settings size={20} className="text-content-tertiary" />
          <h1>Configuración</h1>
        </div>
        <p className="max-w-md">Infraestructura y salud del ecosistema Evangelista.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* API Health */}
        <div className="bg-white rounded-card border border-surface-border p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-content-tertiary" />
              <p className="text-sm text-content-primary">Cloud Core API</p>
            </div>
            <Badge variant={health?.ready ? 'success' : 'danger'} size="sm">
              {health?.ready ? 'Operativo' : 'Interrupción'}
            </Badge>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-content-tertiary">Endpoint</p>
            <code className="block text-xs bg-surface rounded-button px-3 py-2 text-content-secondary">
              {import.meta.env.VITE_API_URL || 'http://localhost:8001'}
            </code>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-content-tertiary flex items-center gap-1.5">
              <Activity size={12} /> Diagnóstico de nodos
            </p>
            {health &&
              Object.entries(health.checks).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between px-4 py-2.5 rounded-button bg-surface/50">
                  <span className="text-sm capitalize text-content-secondary">{key}</span>
                  <Badge variant={val.status === 'ready' ? 'success' : 'danger'} size="sm">
                    {val.status}
                  </Badge>
                </div>
              ))}
          </div>

          <Button variant="outline" className="w-full" onClick={check} isLoading={checking} icon={<RefreshCw size={16} className={checking ? 'animate-spin' : ''} />}>
            Re-verificar
          </Button>
        </div>

        {/* Database */}
        <div className="space-y-8">
          <div className="bg-white rounded-card border border-surface-border p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Database size={18} className="text-content-tertiary" />
              <p className="text-sm text-content-primary">Almacenamiento</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-content-tertiary">Supabase Engine</p>
              <code className="block text-xs bg-surface rounded-button px-3 py-2 text-content-secondary break-all">
                {import.meta.env.VITE_SUPABASE_URL || 'Cluster no configurado'}
              </code>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 text-xs">
              <CheckCircle2 size={12} /> Conectado
            </div>
          </div>

          {/* Quick config */}
          <div className="bg-white rounded-card border border-surface-border p-6 space-y-3">
            <p className="text-sm text-content-primary">Variables de entorno</p>
            <p className="text-xs text-content-tertiary">
              Configura <code className="bg-surface rounded px-1 py-0.5">VITE_API_URL</code>, <code className="bg-surface rounded px-1 py-0.5">VITE_SUPABASE_URL</code> y <code className="bg-surface rounded px-1 py-0.5">VITE_SUPABASE_ANON_KEY</code> en <code className="bg-surface rounded px-1 py-0.5">.env</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
