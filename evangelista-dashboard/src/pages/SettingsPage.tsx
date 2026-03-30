import { useEffect, useState } from 'react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { api } from '../lib/api'

export function SettingsPage() {
  const [health, setHealth] = useState<{ ready: boolean; checks: Record<string, { status: string }> } | null>(null)
  const [checking, setChecking] = useState(false)

  const check = async () => {
    setChecking(true)
    try { setHealth(await api.health()) }
    catch { setHealth({ ready: false, checks: { backend: { status: 'not_ready' } } }) }
    finally { setChecking(false) }
  }

  useEffect(() => { check() }, [])

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-serif text-3xl font-bold text-eva-charcoal">Configuración</h1>
        <p className="text-eva-warm-gray mt-1">Estado del sistema</p>
      </div>
      <Card>
        <h2 className="font-serif font-semibold text-eva-charcoal mb-4">Estado del backend</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-eva-charcoal">API URL</span>
            <code className="text-xs bg-eva-cream px-2 py-1 rounded">{import.meta.env.VITE_API_URL || 'http://localhost:8000'}</code>
          </div>
          {health && Object.entries(health.checks).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between py-1">
              <span className="text-sm capitalize text-eva-charcoal">{key}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${val.status === 'ready' ? 'bg-green-50 text-green-700' : 'bg-eva-red/10 text-eva-red'}`}>
                {val.status}
              </span>
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={check} loading={checking}>Verificar conectividad</Button>
        </div>
      </Card>
      <Card>
        <h2 className="font-serif font-semibold text-eva-charcoal mb-4">Supabase</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-eva-charcoal">URL</span>
            <code className="text-xs bg-eva-cream px-2 py-1 rounded truncate max-w-xs">{import.meta.env.VITE_SUPABASE_URL || 'No configurado'}</code>
          </div>
          <p className="text-xs text-eva-warm-gray">Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env</p>
        </div>
      </Card>
    </div>
  )
}
