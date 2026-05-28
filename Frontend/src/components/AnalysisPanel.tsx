import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, AlertCircle, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';

interface AnalysisPanelProps {
  clientId?: string;
  onComplete?: (r: { task: string; response: string; confidence: number }) => void;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ clientId, onComplete }) => {
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    response: string;
    confidence: number;
    executionTime: number;
    sources: string[];
  } | null>(null);

  const QUICK_PROMPTS = [
    'Evaluar factor de riesgo operacional',
    'Analizar viabilidad de integración ERP',
    'Auditoría de cumplimiento ALCOA+'
  ];

  const handleAnalyze = async (selectedTask?: string) => {
    const finalTask = selectedTask || task;
    if (!finalTask.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.analyze({
        task: finalTask,
        context: { client_id: clientId }
      });

      const processedResult = {
        response: res.response || 'Análisis completado sin respuesta explícita.',
        confidence: res.confidence ?? 0.85,
        executionTime: res.execution_time_ms ?? 1200,
        sources: res.sources || []
      };

      setResult(processedResult);

      if (onComplete) {
        onComplete({
          task: finalTask,
          response: processedResult.response,
          confidence: processedResult.confidence
        });
      }
    } catch (err: any) {
      setError(err.message || 'Error durante la ejecución del análisis de inteligencia.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input section with custom focus glow effects */}
      <div className="space-y-3">
        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--eva-txt-muted)]">
          Consulta de Inteligencia
        </label>
        <div className="relative group">
          {/* Olive glow on focus */}
          <div
            className="absolute -inset-1 rounded-[12px] opacity-0 blur-md transition-opacity duration-500 group-focus-within:opacity-100 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(149,184,119,0.15), transparent 70%)'
            }}
          />
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Describa el análisis o la pregunta de negocio que desea realizar a la red de agentes..."
            className="relative w-full h-24 bg-[var(--eva-surface-2)] border border-[var(--eva-border)] rounded-xl p-4 text-sm text-[var(--eva-txt-primary)] focus:outline-none focus:border-[var(--eva-olive)] transition-all resize-none placeholder-[var(--eva-txt-muted)]"
          />
        </div>
      </div>

      {/* Action triggers */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => handleAnalyze()}
          disabled={loading || !task.trim()}
          className="flex-1 bg-[var(--eva-olive)] text-white font-ui font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--eva-olive-2)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            >
              <Cpu size={14} />
            </motion.div>
          ) : (
            <Play size={12} fill="currentColor" />
          )}
          {loading ? 'Ejecutando Orquestador...' : 'Iniciar Análisis Forense'}
        </button>
      </div>

      {/* Quick prompts */}
      {!loading && !result && (
        <div className="space-y-2">
          <p className="text-[10px] font-mono text-[var(--eva-txt-muted)] uppercase tracking-wider">
            Consultas Sugeridas
          </p>
          <div className="flex flex-col gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setTask(prompt);
                  handleAnalyze(prompt);
                }}
                className="text-left text-xs bg-[var(--eva-surface-2)] hover:bg-[var(--eva-surface)] border border-[var(--eva-border)] text-[var(--eva-txt-secondary)] hover:text-[var(--eva-olive)] p-3 rounded-xl transition-all flex items-center gap-2"
              >
                <Sparkles size={12} className="opacity-75" />
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Dynamic results rendering */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border border-[var(--eva-border)] bg-[var(--eva-surface-2)] rounded-2xl p-6 text-center space-y-4"
          >
            <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[var(--eva-olive)]/20"
                style={{ borderTopColor: 'var(--eva-olive)' }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              />
              <Cpu size={18} className="text-[var(--eva-olive)] animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-[var(--eva-txt-primary)]">
                Procesando con Agentes
              </h4>
              <p className="text-[10px] text-[var(--eva-txt-muted)] font-mono">
                Extrayendo evidencia técnica y evaluando riesgos en base de conocimiento...
              </p>
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-[var(--eva-border)] bg-[var(--eva-surface-2)] rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[var(--eva-border)] pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-[var(--eva-olive)]" />
                <span className="text-[10px] font-mono font-bold text-[var(--eva-olive)] uppercase tracking-wider">
                  Análisis Generado
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-full px-2.5 py-0.5">
                <span className="text-[9px] font-mono font-bold text-[var(--eva-gold)]">
                  Confianza: {(result.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="text-xs text-[var(--eva-txt-secondary)] leading-relaxed whitespace-pre-line font-ui">
              {result.response}
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between text-[9px] font-mono text-[var(--eva-txt-muted)]">
              <span>Tiempo de ejecución: {result.executionTime}ms</span>
              {result.sources.length > 0 && (
                <span>Fuentes consultadas: {result.sources.length}</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
