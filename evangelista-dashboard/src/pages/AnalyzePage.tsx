import { useState } from 'react'
import { Card } from '../components/ui/Card'
import { AnalysisPanel } from '../components/AnalysisPanel'
import { useClients } from '../hooks/useClients'
import { useHistory } from '../hooks/useHistory'

export function AnalyzePage() {
  const { clients } = useClients()
  const { saveAnalysis } = useHistory()
  const [selectedClient, setSelectedClient] = useState('')

  const handleComplete = async (result: { task: string; response: string; confidence: number }) => {
    try {
      await saveAnalysis({ client_id: selectedClient || undefined, task: result.task, final_response: result.response, confidence: result.confidence, status: 'completed' })
    } catch (e) { console.error('Error guardando análisis:', e) }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-eva-charcoal">Análisis</h1>
        <p className="text-eva-warm-gray mt-1">Ejecuta el orquestador multi-agente</p>
      </div>
      <Card>
        <div className="mb-4">
          <label className="text-sm font-medium text-eva-charcoal block mb-1">Cliente (opcional)</label>
          <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-[var(--eva-border)] bg-white focus:outline-none focus:ring-2 focus:ring-eva-olive/30 w-full max-w-xs">
            <option value="">Sin cliente específico</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <AnalysisPanel clientId={selectedClient || undefined} onComplete={handleComplete} />
      </Card>
    </div>
  )
}
