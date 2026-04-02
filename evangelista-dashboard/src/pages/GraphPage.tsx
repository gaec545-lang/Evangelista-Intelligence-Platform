import { useState, useEffect } from 'react'
import { Zap, ShieldCheck, Database } from 'lucide-react'
import GraphVisualizer from '../components/GraphVisualizer'
import { api } from '../lib/api'

export default function GraphPage() {
  const [staticGraph, setStaticGraph] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getGraphMermaid().then(data => {
      setStaticGraph(data.mermaid)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="space-y-1">
        <h1>Arquitectura RAG</h1>
        <p className="max-w-xl">
          Grafo cíclico con CRAG, Self-RAG y orquestación agéntica.
        </p>
      </section>

      {/* Graph */}
      <div className="glass-strong rounded-card border border-white/[0.10] p-8">
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="w-10 h-10 border-[3px] border-white/[0.08] border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="min-h-[500px]">
            <GraphVisualizer mermaid={staticGraph} />
          </div>
        )}
      </div>

      {/* Explainer cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ExplainerCard
          icon={<Zap size={18} />}
          title="CRAG"
          description="Corrective RAG — si la relevancia es baja, el sistema busca fuentes web para complementar."
        />
        <ExplainerCard
          icon={<ShieldCheck size={18} />}
          title="Self-RAG"
          description="Verifica alucinaciones en tiempo real para garantizar respuestas basadas en hechos."
        />
        <ExplainerCard
          icon={<Database size={18} />}
          title="Agentic RAG"
          description="Orquestación dinámica de herramientas según la intención del análisis."
        />
      </div>
    </div>
  )
}

function ExplainerCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="card-glass p-5">
      <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center text-content-tertiary mb-3">
        {icon}
      </div>
      <p className="text-sm text-content-primary">{title}</p>
      <p className="text-xs text-content-tertiary mt-1 leading-relaxed">{description}</p>
    </div>
  )
}
