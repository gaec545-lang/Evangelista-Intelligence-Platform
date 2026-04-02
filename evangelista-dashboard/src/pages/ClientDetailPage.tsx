import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, FileText, Building2, MapPin, Target, Zap, Clock } from 'lucide-react'
import { clientsDB } from '../lib/supabase'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Counter from '../components/ui/Counter'
import { HistoryList } from '../components/HistoryList'
import { AnalysisPanel } from '../components/AnalysisPanel'
import { useHistory } from '../hooks/useHistory'
import { Spinner } from '../components/ui/Spinner'
import type { Client } from '../lib/types'

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [client, setClient] = useState<Client | null>(null)
  const { analyses, loading: loadingHistory, saveAnalysis } = useHistory(id)

  useEffect(() => {
    if (id) {
      clientsDB.get(id).then(setClient).catch(() => navigate('/clients'))
    }
  }, [id, navigate])

  const handleComplete = async (r: { task: string; response: string; confidence: number }) => {
    if (!id) return
    await saveAnalysis({
      client_id: id,
      task: r.task,
      final_response: r.response,
      confidence: r.confidence,
      status: 'completed',
    })
  }

  if (!client) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-xs text-content-tertiary">Cargando archivo…</p>
      </div>
    )
  }

  const kpis = [
    { label: 'Puntos de operación', value: client.sucursales, icon: Building2 },
    { label: 'Factor Γ', value: client.factor_gamma ?? 0, isFloat: true },
    { label: 'Análisis', value: analyses.length, icon: Zap },
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div className="space-y-4">
          <button
            onClick={() => navigate('/clients')}
            className="flex items-center gap-2 text-sm text-content-tertiary hover:text-primary-600 transition-colors"
          >
            <ArrowLeft size={16} />
            Clientes
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-xl font-semibold">
              {client.name.charAt(0)}
            </div>
            <div>
              <h1 className="!text-2xl">{client.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 text-xs text-content-tertiary">
                  <MapPin size={12} /> {client.city}
                </span>
                <span className="w-1 h-1 rounded-full bg-surface-border" />
                <Badge variant={client.status === 'active' ? 'success' : 'warning'} size="sm">
                  {client.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(`/proposals?client=${id}`)} icon={<FileText size={14} />}>
          Generar propuesta
        </Button>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-3 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className="card-glass rounded-card border border-surface-border p-5">
            <div className="flex items-center justify-between mb-3">
              {kpi.icon && <kpi.icon size={18} className="text-content-tertiary" />}
            </div>
            <p className="text-2xl font-semibold tracking-tight mt-2">
              {kpi.isFloat
                ? (kpi.value as number).toFixed(2)
                : <Counter target={kpi.value as number} />}
            </p>
            <p className="text-xs text-content-tertiary mt-1">{kpi.label}</p>
          </div>
        ))}
      </section>

      {/* Analysis + History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* RAG */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 px-1">
            <Zap size={18} className="text-accent-gold" />
            <h2>Orquestador</h2>
          </div>
          <div className="rounded-card border border-surface-border p-6" style={{ background: 'var(--surface-raised, rgba(255,255,255,0.04))' }}>
            <AnalysisPanel clientId={id} onComplete={handleComplete} />
          </div>
        </div>

        {/* History */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-content-tertiary" />
              <h2>Historial</h2>
            </div>
            {analyses.length > 0 && <p className="text-xs text-content-tertiary">{analyses.length}</p>}
          </div>
          <div className="card-glass rounded-card border border-surface-border">
            {loadingHistory ? (
              <div className="p-12 flex items-center justify-center">
                <Spinner size="md" />
              </div>
            ) : (
              <HistoryList analyses={analyses} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
