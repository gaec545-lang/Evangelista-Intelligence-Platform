import { useAgents } from '../hooks/useAgents'
import { AgentCard } from '../components/AgentCard'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState } from '../components/ui/EmptyState'
import { Brain } from 'lucide-react'

export function AgentsPage() {
  const { agents, loading, error } = useAgents()

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="space-y-1">
        <h1>Ecosistema de Agentes</h1>
        <p className="max-w-xl">
          Unidades de inteligencia especializadas. Cada agente procesa un dominio cognitivo único dentro del vault.
        </p>
      </section>

      {loading && (
        <div className="py-24 flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs text-content-secondary">Sincronizando con el orquestador…</p>
        </div>
      )}

      {error && (
        <div className="card-glass p-6 bg-danger/10 border-danger/30">
          <p className="text-sm text-danger">Error de conectividad</p>
          <p className="text-xs mt-1 text-danger/80">{error}</p>
        </div>
      )}

      {!loading && !agents.length && !error && (
        <EmptyState
          icon={<Brain size={32} />}
          title="Inteligencia no inicializada"
          description="El orquestador no ha reportado agentes activos. Verifica el backend en localhost:8001."
        />
      )}

      {!loading && agents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((a, i) => (
            <AgentCard key={a.name} agent={a} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
