import { useState } from 'react';
import GraphVisualizer from './GraphVisualizer';

interface AnalysisData {
  response: string;
  confidence: number;
  route: string;
  node_history: string[];
  sources: string[];
  mermaid_trace: string;
  execution_time_ms: number;
  retry_count: number;
  errors: string[];
}

export default function AnalysisResultV2({ data }: { data: AnalysisData }) {
  const [showGraph, setShowGraph] = useState(false);

  const confidenceColor = data.confidence >= 0.8 ? 'text-green-700 bg-green-50 border-green-200'
    : data.confidence >= 0.5 ? 'text-amber-700 bg-amber-50 border-amber-200'
    : 'text-red-700 bg-red-50 border-red-200';

  const routeLabel: Record<string, string> = {
    rag: 'Knowledge Base',
    tools: 'Cálculo directo',
    web: 'Búsqueda web',
    multi: 'Multi-fuente',
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header con métricas */}
      <div className="flex flex-wrap gap-3">
        <div className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${confidenceColor}`}>
          Confianza: {(data.confidence * 100).toFixed(0)}%
        </div>
        <div className="px-3 py-1.5 rounded-lg border border-[var(--eva-border)] text-sm text-[var(--eva-charcoal)] bg-white">
          Ruta: {routeLabel[data.route] || data.route}
        </div>
        <div className="px-3 py-1.5 rounded-lg border border-[var(--eva-border)] text-sm text-[var(--eva-warm-gray)] bg-white">
          {(data.execution_time_ms / 1000).toFixed(1)}s · {data.node_history.length} nodos
          {data.retry_count > 0 && ` · ${data.retry_count} correcciones`}
        </div>
      </div>

      {/* Respuesta principal */}
      <div className="bg-white rounded-xl border border-[var(--eva-border)] p-6 shadow-sm">
        <div className="prose prose-sm max-w-none text-[var(--eva-charcoal)] leading-relaxed"
             dangerouslySetInnerHTML={{ __html: formatMarkdown(data.response) }} />
      </div>

      {/* Fuentes */}
      {data.sources && data.sources.length > 0 && (
        <div className="bg-[var(--eva-cream)]/60 rounded-xl border border-[var(--eva-border)] p-4">
          <h4 className="text-xs font-medium text-[var(--eva-warm-gray)] uppercase tracking-wider mb-2">
            Fuentes consultadas
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.sources.map((s, i) => (
              <span key={i} className="px-2.5 py-1 text-xs rounded-lg bg-white border border-[var(--eva-border)] text-[var(--eva-charcoal)]">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Toggle del grafo */}
      <button
        onClick={() => setShowGraph(!showGraph)}
        className="flex items-center gap-2 text-sm text-[var(--eva-olive)] hover:text-[var(--eva-olive-light)] transition-colors px-1"
      >
        <svg className={`w-4 h-4 transition-transform ${showGraph ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {showGraph ? 'Ocultar' : 'Ver'} recorrido del grafo
      </button>

      {showGraph && data.mermaid_trace && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <GraphVisualizer
            mermaid={data.mermaid_trace}
            title="Recorrido del análisis"
            nodeHistory={data.node_history}
          />
        </div>
      )}

      {/* Errores/advertencias */}
      {data.errors && data.errors.length > 0 && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <h4 className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-2">Advertencias</h4>
          {data.errors.map((e, i) => (
            <p key={i} className="text-sm text-amber-800">{e}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function formatMarkdown(text: string): string {
  // Conversión básica de Markdown a HTML para el MVP
  if (!text) return '';
  
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n- /g, '</p><li>')
    .replace(/\n(\d+)\. /g, '</p><li>')
    .replace(/\n---\n/g, '<hr class="my-4 border-[var(--eva-border)]">')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}
