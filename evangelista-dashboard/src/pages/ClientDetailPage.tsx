import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, FileText } from 'lucide-react'
import { clientsDB } from '../lib/supabase'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { HistoryList } from '../components/HistoryList'
import { AnalysisPanel } from '../components/AnalysisPanel'
import { useHistory } from '../hooks/useHistory'
import type { Client } from '../lib/types'

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [client, setClient] = useState<Client | null>(null)
  const { analyses, saveAnalysis } = useHistory(id)

  useEffect(() => {
    if (id) clientsDB.get(id).then(setClient).catch(console.error)
  }, [id])

  const handleComplete = async (r: { task: string; response: string; confidence: number }) => {
    if (!id) return
    await saveAnalysis({ client_id: id, task: r.task, final_response: r.response, confidence: r.confidence, status: 'completed' })
  }

  if (!client) return <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-eva-olive border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/clients')}><ArrowLeft size={16} /> Volver</Button>
        <div className="flex-1">
          <h1 className="font-serif text-3xl font-bold text-eva-charcoal">{client.name}</h1>
          <p className="text-eva-warm-gray capitalize">{client.sector} · {client.city}</p>
        </div>
        <Button onClick={() => navigate(`/proposals?client=${id}`)}><FileText size={16} /> Generar propuesta</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Sucursales', value: client.sucursales },
          { label: 'Sistemas ERP', value: client.sistemas_erp },
          { label: 'Factor Γ', value: client.factor_gamma?.toFixed(2) ?? '—' },
        ].map(item => (
          <Card key={item.label} className="text-center">
            <p className="text-2xl font-bold text-eva-charcoal">{item.value}</p>
            <p className="text-xs text-eva-warm-gray mt-1">{item.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-serif font-semibold text-eva-charcoal mb-4">Nuevo análisis</h2>
          <AnalysisPanel clientId={id} onComplete={handleComplete} />
        </Card>
        <Card>
          <h2 className="font-serif font-semibold text-eva-charcoal mb-4">Historial ({analyses.length})</h2>
          <HistoryList analyses={analyses} />
        </Card>
      </div>
    </div>
  )
}
