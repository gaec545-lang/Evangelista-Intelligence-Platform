import { useState, useEffect } from 'react';
import GraphVisualizer from '../components/GraphVisualizer';
import { api } from '../lib/api';

export default function GraphPage() {
  const [staticGraph, setStaticGraph] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGraphMermaid().then(data => {
      setStaticGraph(data.mermaid);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      <div className="animate-in fade-in duration-700">
        <h1 className="text-2xl font-serif font-medium text-[var(--eva-charcoal)]">
          Arquitectura del grafo
        </h1>
        <p className="text-sm text-[var(--eva-warm-gray)] mt-1">
          Advanced RAG con evaluación correctiva (CRAG) y verificación de alucinaciones (Self-RAG)
        </p>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center bg-white/50 rounded-xl border border-dashed border-[var(--eva-border)]">
          <div className="w-8 h-8 border-2 border-[var(--eva-olive)] border-t-transparent rounded-full animate-spin mb-4" />
          <span className="text-sm text-[var(--eva-warm-gray)]">Generando diagrama de arquitectura...</span>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GraphVisualizer 
                mermaid={staticGraph} 
                title="Máquina de estados — Evangelista Intelligence Platform" 
            />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <ExplainerCard
          title="CRAG"
          subtitle="Corrective RAG"
          description="Evalúa la relevancia de cada documento. Si ninguno es útil, activa automáticamente la búsqueda web."
          color="teal"
        />
        <ExplainerCard
          title="Self-RAG"
          subtitle="Self-reflective"
          description="Verifica que la respuesta no tenga alucinaciones y que realmente responda la inquietud del usuario."
          color="purple"
        />
        <ExplainerCard
          title="Agentic"
          subtitle="Tool use"
          description="Usa herramientas dinámicas para cálculos de Factor Γ, ROI y análisis de complejidad de datos (Factor α)."
          color="coral"
        />
      </div>
    </div>
  );
}

function ExplainerCard({ title, subtitle, description, color }: { title: string; subtitle: string; description: string; color: string }) {
  const colorMap: Record<string, string> = {
    teal: 'border-l-teal-500 bg-teal-50/50',
    purple: 'border-l-purple-500 bg-purple-50/50',
    coral: 'border-l-orange-500 bg-orange-50/50',
  };
  return (
    <div className={`rounded-xl border border-[var(--eva-border)] border-l-4 ${colorMap[color]} p-4 shadow-sm`}>
      <h3 className="text-sm font-medium text-[var(--eva-charcoal)]">{title}</h3>
      <p className="text-xs text-[var(--eva-warm-gray)] mb-2">{subtitle}</p>
      <p className="text-sm text-[var(--eva-charcoal)] leading-snug">{description}</p>
    </div>
  );
}
