import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Clock, ChevronRight, FileText, Filter, MoreVertical, Database } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import { supabase } from '../lib/supabase';
import Badge from './ui/Badge';
import Card from './ui/Card';
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

  const filtered = analyses.filter(a => a.task.toLowerCase().includes(search.toLowerCase()));

  const getConfidenceVariant = (c: number) => {
    if (c >= 0.8) return 'success';
    if (c >= 0.5) return 'warning';
    return 'danger';
  };

  return (
    <div className="flex bg-surface-card rounded-3xl border border-surface-border overflow-hidden h-[calc(100vh-140px)] shadow-xl shadow-black/5 animate-in fade-in duration-500">
      {/* Sidebar List */}
      <div className="w-96 flex flex-col border-r border-surface-border bg-surface/30">
        <div className="p-6 space-y-4 border-b border-surface-divider bg-white/50 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-content-primary">Historial</h2>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
              <Filter size={16} className="text-content-tertiary" />
            </Button>
          </div>
          <div className="relative group">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar en el historial..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-[13px] font-medium bg-white rounded-xl border border-surface-border focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
          {loading ? (
            <div className="p-12 flex flex-col items-center gap-4 text-center">
              <div className="w-10 h-10 border-3 border-primary-100 border-t-primary-500 rounded-full animate-spin" />
              <p className="text-xs font-semibold text-content-tertiary uppercase tracking-wider">Cargando bitácora</p>
            </div>
          ) : (
            <div className="px-3 space-y-1">
              {filtered.map((a, i) => (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  key={a.id}
                  onClick={() => setSelected(a)}
                  className={`w-full text-left p-4 rounded-2xl transition-all duration-200 group relative
                    ${selected?.id === a.id 
                      ? 'bg-white shadow-md border border-surface-border ring-1 ring-black/[0.02]' 
                      : 'hover:bg-surface-hover border border-transparent'}
                  `}
                >
                  {selected?.id === a.id && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute left-0 top-4 bottom-4 w-1 bg-primary-500 rounded-r-full"
                    />
                  )}
                  <div className="space-y-2">
                    <p className={`text-[13px] font-semibold leading-relaxed line-clamp-2 transition-colors
                      ${selected?.id === a.id ? 'text-primary-700' : 'text-content-primary group-hover:text-primary-600'}
                    `}>
                      {a.task}
                    </p>
                    <div className="flex items-center justify-between pointer-events-none">
                      <div className="flex items-center gap-3">
                        <Badge variant={getConfidenceVariant(a.confidence)} dot={false} className="opacity-90">
                          {(a.confidence * 100).toFixed(0)}%
                        </Badge>
                        <span className="text-[10px] font-bold text-content-tertiary flex items-center gap-1 uppercase tracking-tighter">
                          <Calendar size={10} />
                          {new Date(a.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                      <ChevronRight size={14} className={`transition-all ${selected?.id === a.id ? 'text-primary-400 translate-x-0' : 'text-surface-divider -translate-x-2'}`} />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Content */}
      <div className="flex-1 overflow-y-auto bg-surface/50 scrollbar-hide relative">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div 
              key={selected.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="p-8 lg:p-12 max-w-5xl mx-auto"
            >
              {/* Detail Header */}
              <div className="mb-10 space-y-6">
                <div className="flex items-center justify-between">
                  <Badge variant="primary" dot={true} size="lg">Consulta de Inteligencia</Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" icon={<Database size={14} />}>Exportar JSON</Button>
                    <Button variant="ghost" size="sm" icon={<MoreVertical size={16} />} />
                  </div>
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-semibold text-content-primary leading-[1.1] tracking-tight">
                  {selected.task}
                </h1>
                
                <div className="flex flex-wrap gap-6 pt-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-content-tertiary uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-primary-500" /> Confianza
                    </span>
                    <p className="text-lg font-bold text-content-primary">{(selected.confidence * 100).toFixed(0)}% <span className="text-sm font-medium text-content-tertiary">Precision</span></p>
                  </div>
                  <div className="w-px h-10 bg-surface-divider hidden sm:block" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-content-tertiary uppercase tracking-widest flex items-center gap-1.5">
                      <Clock size={12} className="text-primary-500" /> Latencia
                    </span>
                    <p className="text-lg font-bold text-content-primary">{(selected.execution_time_ms / 1000).toFixed(1)}s <span className="text-sm font-medium text-content-tertiary">Total</span></p>
                  </div>
                  <div className="w-px h-10 bg-surface-divider hidden sm:block" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-content-tertiary uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar size={12} className="text-primary-500" /> Fecha
                    </span>
                    <p className="text-lg font-bold text-content-primary">
                      {new Date(selected.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Response Card */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <FileText size={18} className="text-primary-600" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-content-secondary">Respuesta Generada</h3>
                </div>
                <Card className="p-8 lg:p-12 border-surface-border bg-white shadow-lg overflow-hidden relative group">
                  <MarkdownRenderer content={selected.final_response} />
                  {/* Subtle "Paper" effect */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-surface/50 [clip-path:polygon(100%_0,0_0,100%_100%)] pointer-events-none" />
                </Card>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 rounded-3xl bg-surface border-2 border-dashed border-surface-divider flex items-center justify-center mb-6">
                <FileText size={32} className="text-surface-divider" />
              </div>
              <h3 className="text-xl font-semibold text-content-primary mb-2">Historial de Operaciones</h3>
              <p className="text-sm text-content-tertiary max-w-xs leading-relaxed">
                Selecciona cualquier operación del listado lateral para inspeccionar los resultados detallados y trazas de ejecución.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ShieldCheck({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
