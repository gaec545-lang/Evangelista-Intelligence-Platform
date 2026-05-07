import { useState } from 'react';
import { useAnalysis } from '../hooks/useAnalysis';
import AnalysisResultV2 from './AnalysisResultV2';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { Sparkles, Send, Cpu, Search, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  clientId?: string;
  onComplete?: (result: { task: string; response: string; confidence: number }) => void;
}

export function AnalysisPanel({ clientId, onComplete }: Props) {
  const [task, setTask] = useState('');
  const { analyze, loading, result, error, reset } = useAnalysis();

  const handleAnalyze = async () => {
    if (!task.trim()) return;
    const ctx = clientId ? { client_id: clientId } : {};
    const res = await analyze(task, ctx).catch(() => null);
    if (res && onComplete) onComplete({ task, response: res.response, confidence: res.confidence || 0 });
  };

  return (
    <div className="space-y-8">
      {/* Input */}
      <div className="space-y-4">
        <div className="relative group">
          {/* Olive glow on focus */}
          <div
            className="absolute -inset-1 rounded-[20px] opacity-0 blur-xl transition-opacity duration-500 group-focus-within:opacity-100 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(149,184,119,0.10) 0%, transparent 70%)' }}
          />
          <textarea
            value={task}
            onChange={e => setTask(e.target.value)}
            placeholder={"Describe la tarea para el orquestador...\nEj: 'Realiza el análisis de gap financiero para el cliente X'"}
            rows={5}
            className="relative w-full px-6 py-5 text-base rounded-[20px] resize-none transition-all duration-200 placeholder:text-content-secondary/40 leading-relaxed outline-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#F5F5F7',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'rgba(149,184,119,0.40)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(149,184,119,0.08)';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <div className="absolute right-5 bottom-5 flex items-center gap-3">
            <AnimatePresence>
              {task.trim() && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setTask('')}
                  className="h-10 w-10 rounded-button flex items-center justify-center text-content-secondary/60 hover:text-accent-red transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <Sparkles size={16} />
                </motion.button>
              )}
            </AnimatePresence>
            <Button
              onClick={handleAnalyze}
              isLoading={loading}
              disabled={!task.trim()}
              size="lg"
              className="rounded-button"
              icon={<Send size={16} />}
            >
              {loading ? 'Orquestando...' : 'Lanzar Análisis'}
            </Button>
          </div>
        </div>

        {/* Suggestion chips */}
        {!loading && !result && (
          <div className="flex flex-wrap gap-2 px-1">
            <span className="text-[9px] font-semibold text-content-secondary uppercase tracking-widest mr-1 py-1">
              Sugerencias:
            </span>
            {['Análisis financiero', 'Optimización operativa', 'Cálculo Factor Γ'].map(s => (
              <button
                key={s}
                onClick={() => setTask(s)}
                className="text-[11px] font-medium text-primary-600 px-3 py-1 rounded-badge transition-colors"
                style={{
                  background: 'rgba(149,184,119,0.08)',
                  border: '1px solid rgba(149,184,119,0.15)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(149,184,119,0.14)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(149,184,119,0.08)';
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="py-16 md:py-20"
          >
            <div
              className="max-w-lg mx-auto rounded-card p-8 text-center space-y-6 relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Progress bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="w-1/2 h-full"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(149,184,119,0.6), transparent)' }}
                />
              </div>

              {/* Agent icons */}
              <div className="flex items-center justify-center gap-1.5 pt-2">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(149,184,119,0.10)' }}>
                  <Cpu size={22} className="text-primary-500" />
                </div>
                <div className="w-3 h-[2px] rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(100,210,255,0.08)' }}>
                  <Search size={22} className="text-info/70 animate-pulse" />
                </div>
                <div className="w-3 h-[2px] rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,168,67,0.08)' }}>
                  <Zap size={22} className="text-accent-gold/80" />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-content-primary tracking-tight">
                  Ejecutando Grafo de Agentes
                </h3>
                <p className="text-sm text-content-secondary/80 max-w-sm mx-auto leading-relaxed">
                  El orquestador consulta Vault y delega tareas a especialistas.
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Badge variant="olive" size="sm">CRAG Active</Badge>
                  <Badge variant="info" size="sm">{clientId ? 'Client' : 'Global'}</Badge>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-card p-6 flex items-start gap-4"
            style={{
              background: 'rgba(255,69,58,0.08)',
              border: '1px solid rgba(255,69,58,0.15)',
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,69,58,0.12)' }}
            >
              <span className="text-danger font-semibold text-sm">!</span>
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-danger">Error de Orquestación</p>
              <p className="text-sm text-danger/70 leading-relaxed">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Result */}
        {result && !loading && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div
              className="flex items-center justify-between py-3 px-2"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(48,209,88,0.10)' }}
                >
                  <Zap size={16} className="text-success" />
                </div>
                <h3 className="text-sm font-semibold text-content-primary">Resultado del Análisis</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={reset}>Nuevo Análisis</Button>
            </div>
            <AnalysisResultV2 data={result as any} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
