import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, ChevronRight, FileText, Database, Shield } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import { supabase } from '../lib/supabase';
import Badge from './ui/Badge';
import Button from './ui/Button';

interface AnalysisRecord {
  id: string;
  task: string;
  final_response: string;
  confidence: number;
  status: string;
  created_at: string;
  execution_time_ms: number;
}

export default function AnalysisHistory() {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [selected, setSelected] = useState<AnalysisRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (data) {
        setAnalyses(data);
        if (data.length > 0 && !selected) setSelected(data[0]);
      }
    } catch (err) {
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(
    () => analyses.filter(a => a.task.toLowerCase().includes(search.toLowerCase())),
    [analyses, search],
  );

  const getConfidenceVariant = (c: number): 'success' | 'warning' | 'danger' => {
    if (c >= 0.8) return 'success';
    if (c >= 0.5) return 'warning';
    return 'danger';
  };

  return (
    <div className="rounded-card overflow-hidden animate-glass-enter"
      style={{ height: 'calc(100vh - 160px)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex h-full">
        {/* ─── Sidebar ─── */}
        <div
          className="w-80 flex-shrink-0 flex flex-col border-r"
          style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          {/* Search header */}
          <div className="p-4 pb-3 space-y-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-content-primary">Historial</h2>
              <p className="text-[10px] text-content-tertiary tabular-nums">{filtered.length} registros</p>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary/50 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar análisis..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-glass w-full pl-9 pr-3 py-2 text-sm rounded-button"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto scrollbar-hide py-2 px-2 space-y-0.5">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-8 h-8 border-[2px] border-white/[0.06] border-t-primary-500 rounded-full animate-spin" />
                <p className="text-[10px] text-content-tertiary uppercase tracking-widest">Cargando</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <FileText size={24} className="text-content-tertiary/40" />
                <p className="text-xs text-content-tertiary">Sin resultados</p>
              </div>
            ) : (
              filtered.map((a, i) => (
                <motion.button
                  key={a.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  onClick={() => setSelected(a)}
                  className="w-full text-left rounded-button transition-all duration-150 group"
                  style={{
                    padding: '10px 12px',
                    background: selected?.id === a.id ? 'rgba(149,184,119,0.08)' : 'transparent',
                    border: selected?.id === a.id ? '1px solid rgba(149,184,119,0.15)' : '1px solid transparent',
                  }}
                >
                  <div className="space-y-2">
                    <p
                      className="text-sm leading-snug line-clamp-2 transition-colors"
                      style={{ color: selected?.id === a.id ? '#A8CC8D' : '#F5F5F7' }}
                    >
                      {a.task}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={getConfidenceVariant(a.confidence)} size="sm">
                          {(a.confidence * 100).toFixed(0)}%
                        </Badge>
                        <span className="text-[9px] text-content-tertiary tabular-nums">
                          {new Date(a.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                      <ChevronRight
                        size={14}
                        style={{
                          color: selected?.id === a.id ? '#A8CC8D' : 'rgba(255,255,255,0.12)',
                          transform: selected?.id === a.id ? 'translateX(0)' : 'translateX(-4px)',
                          transition: 'all 150ms',
                        }}
                      />
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* ─── Detail panel ─── */}
        <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ background: 'rgba(0,0,0,0.15)' }}>
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="p-8 max-w-3xl mx-auto space-y-8"
              >
                {/* Header */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <Badge variant="olive" size="md">Consulta de Inteligencia</Badge>
                    <Button variant="ghost" size="sm" icon={<Database size={14} />}>
                      Export JSON
                    </Button>
                  </div>

                  <h1 className="text-2xl font-semibold text-content-primary leading-tight">
                    {selected.task}
                  </h1>

                  {/* Stats row */}
                  <div className="flex flex-wrap items-center gap-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                    <StatItem icon={Shield} label="Confianza" value={`${(selected.confidence * 100).toFixed(0)}%`} sub="precision" accent="primary" />
                    <div style={{ width: '1px', height: '2rem', background: 'rgba(255,255,255,0.06)' }} />
                    <StatItem icon={Clock} label="Latencia" value={`${(selected.execution_time_ms / 1000).toFixed(1)}s`} sub="total" accent="default" />
                    <div style={{ width: '1px', height: '2rem', background: 'rgba(255,255,255,0.06)' }} />
                    <StatItem icon={Database} label="Fecha" value={
                      new Date(selected.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
                    } sub="" accent="default" />
                  </div>
                </div>

                {/* Response */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <FileText size={16} className="text-primary-500" />
                    <h3 className="text-xs font-semibold text-content-tertiary uppercase tracking-widest">
                      Respuesta Generada
                    </h3>
                  </div>
                  <div
                    className="rounded-card p-8"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="prose prose-invert prose-sm max-w-none prose-headings:font-semibold [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_p]:text-content-secondary [&_code]:text-primary-600 [&_pre]:!bg-canvas-elevated [&_pre]:!border [&_pre]:!border-white/[0.06] [&_pre]:!rounded-card">
                      <MarkdownRenderer content={selected.final_response} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center gap-3 p-12 text-center"
              >
                <div
                  className="w-16 h-16 rounded-card flex items-center justify-center mb-2"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.06)' }}
                >
                  <FileText size={28} className="text-content-tertiary/40" />
                </div>
                <h3 className="text-base font-semibold text-content-secondary">Historial de Operaciones</h3>
                <p className="text-sm text-content-tertiary/70 max-w-xs leading-relaxed">
                  Selecciona una operación del panel lateral para ver los resultados detallados.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat Item ─── */

function StatItem({
  icon: Icon, label, value, sub, accent = 'default',
}: {
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: string;
  value: string;
  sub?: string;
  accent?: 'primary' | 'default';
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-semibold text-content-tertiary/60 uppercase tracking-widest flex items-center gap-1.5">
        <Icon size={11} className={accent === 'primary' ? 'text-primary-500' : 'text-content-tertiary/50'} />
        {label}
      </span>
      <p className="text-lg font-semibold text-content-primary tabular-nums">
        {value}{sub && <span className="text-sm font-normal text-content-tertiary/60 ml-0.5">{sub}</span>}
      </p>
    </div>
  );
}
