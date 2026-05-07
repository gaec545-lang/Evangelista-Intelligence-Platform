import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Clock, GitBranch, ShieldCheck, Database, AlertCircle } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import Badge from './ui/Badge';
import Card from './ui/Card';
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

  const getConfidenceVariant = (val: number): 'success' | 'warning' | 'danger' => {
    if (val >= 0.8) return 'success';
    if (val >= 0.5) return 'warning';
    return 'danger';
  };

  const routeLabel: Record<string, string> = {
    rag: 'Knowledge Base',
    tools: 'Calculated',
    web: 'Web Search',
    multi: 'Hybrid RAG',
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="flex flex-wrap gap-3">
        <Badge
          variant={getConfidenceVariant(data.confidence)}
          size="lg"
        >
          {(data.confidence * 100).toFixed(0)}%
        </Badge>

        <div
          className="flex items-center gap-2 px-3 py-1 rounded-button text-[11px] font-medium"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#A1A1A6' }}
        >
          <Database size={13} className="text-primary-500" />
          {routeLabel[data.route] || data.route}
        </div>

        <div
          className="flex items-center gap-2 px-3 py-1 rounded-button text-[11px] font-medium"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#A1A1A6' }}
        >
          <Clock size={13} className="text-primary-500" />
          {(data.execution_time_ms / 1000).toFixed(1)}s
        </div>

        {data.retry_count > 0 && (
          <Badge variant="warning" size="sm">
            {data.retry_count} auto-corrección
          </Badge>
        )}
      </div>

      {/* Main Response */}
      <Card className="p-0" hover={false}>
        <div
          className="rounded-card p-8 lg:p-10 max-h-[70vh] overflow-y-auto scrollbar-hide"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}
        >
          <MarkdownRenderer content={data.response} />
        </div>
      </Card>

      {/* Sources & Errors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sources */}
        <AnimatePresence>
          {data.sources && data.sources.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="h-full" hover={false}>
                <h4 className="text-[9px] font-semibold text-content-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
                  <ShieldCheck size={13} />
                  Fuentes
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {data.sources.map((s, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-badge text-[10px] font-medium"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        color: '#A1A1A6',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Errors */}
        {data.errors && data.errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="h-full" hover={false}>
              <h4 className="text-[9px] font-semibold text-warning uppercase tracking-widest mb-3 flex items-center gap-2">
                <AlertCircle size={13} />
                Technical Insights
              </h4>
              <div className="space-y-1.5">
                {data.errors.map((e, i) => (
                  <p key={i} className="text-xs text-content-secondary/80 leading-relaxed flex gap-2 items-start">
                    <span className="text-warning mt-0.5 shrink-0">•</span> {e}
                  </p>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Graph Toggle */}
      <div className="pt-4">
        <button
          onClick={() => setShowGraph(!showGraph)}
          className="group flex items-center gap-3 px-4 py-2 rounded-button transition-all duration-200 text-sm font-medium text-content-secondary hover:text-content-primary"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className={`p-1.5 rounded-button transition-colors ${showGraph ? 'bg-primary-500 text-white' : ''}`}
               style={!showGraph ? { background: 'rgba(149,184,119,0.08)' } : {}}
          >
            <GitBranch size={15} />
          </div>
          <span className={showGraph ? 'text-primary-600' : ''}>
            {showGraph ? 'Ocultar' : 'Inspeccionar'} Traza
          </span>
          <ChevronRight size={15} className={`text-content-secondary/50 transition-transform ${showGraph ? 'rotate-90' : ''}`} />
        </button>

        <AnimatePresence>
          {showGraph && data.mermaid_trace && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mt-4"
            >
              <Card className="p-0" hover={false}>
                <div
                  className="p-3 flex items-center justify-between"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span className="text-[9px] font-semibold text-content-secondary uppercase tracking-widest">
                    Grafo de Decisión
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-success/80" />
                    <span className="text-[9px] text-content-secondary/60">Completado</span>
                  </div>
                </div>
                <div className="p-6">
                  <GraphVisualizer
                    mermaid={data.mermaid_trace}
                    nodeHistory={data.node_history}
                  />
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
