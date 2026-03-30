import { useAgents } from '../hooks/useAgents'
import { AgentCard } from '../components/AgentCard'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { Brain } from 'lucide-react'

export function AgentsPage() {
  const { agents, loading, error } = useAgents()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-eva-charcoal">Agentes</h1>
        <p className="text-eva-warm-gray mt-1">{agents.length} agentes especializados disponibles</p>
      </div>
      {loading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}
      {error && <p className="text-eva-red text-sm">{error}</p>}
      {!loading && !agents.length && (
        <EmptyState icon={<Brain size={40} />} title="Sin agentes disponibles" description="Asegúrate que el backend está corriendo en localhost:8000" />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(a => <AgentCard key={a.name} agent={a} />)}
      </div>
    </div>
  )
}
