import { useState } from 'react'
import { AnalysisPanel } from '../components/AnalysisPanel'
import { useClients } from '../hooks/useClients'
import { useHistory } from '../hooks/useHistory'
import { Brain } from 'lucide-react'
import Badge from '../components/ui/Badge'

export function AnalyzePage() {
  const { clients } = useClients()
  const { saveAnalysis } = useHistory()
  const [selectedClient, setSelectedClient] = useState('')

  const handleComplete = async (result: { task: string; response: string; confidence: number }) => {
    try {
      await saveAnalysis({
        client_id: selectedClient || undefined,
        task: result.task,
        final_response: result.response,
        confidence: result.confidence,
        status: 'completed',
      })
    } catch (e) { console.error('Error guardando análisis:', e) }
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-1">
          <h1>Orquestador de Inteligencia</h1>
          <p className="max-w-md">
            Análisis avanzado con agentes especialistas. Inferencia semántica sobre el vault.
          </p>
        </div>
        <Badge variant="info" size="sm">Motor LLM activo</Badge>
      </section>

      {/* Client Selector */}
      <section className="flex items-center gap-4">
        <span className="text-sm text-content-tertiary whitespace-nowrap">Contexto:</span>
        <select
          value={selectedClient}
          onChange={e => setSelectedClient(e.target.value)}
          className="h-9 px-3 pr-10 text-sm rounded-button border border-surface-border bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 transition-colors appearance-none cursor-pointer"
        >
          <option value="">Análisis genérico</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </section>

      {/* Analysis Panel */}
      <AnalysisPanel clientId={selectedClient || undefined} onComplete={handleComplete} />
    </div>
  )
}
