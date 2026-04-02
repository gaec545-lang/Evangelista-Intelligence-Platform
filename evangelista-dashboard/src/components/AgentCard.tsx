import { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { api } from '../lib/api';
import { Terminal, Activity, Send } from 'lucide-react';
import type { AgentInfo } from '../lib/types';
import { motion, AnimatePresence } from 'framer-motion';

export function AgentCard({ agent, index = 0 }: { agent: AgentInfo, index?: number }) {
  const [task, setTask] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const run = async () => {
    if (!task.trim()) return;
    setRunning(true);
    try {
      setResult(await api.executeAgent(agent.name, task));
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  return (
    <Card index={index} className="group flex flex-col h-full" hover>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
            style={{
              background: 'rgba(149,184,119,0.10)',
            }}
          >
            <Terminal size={18} className="text-primary-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-content-primary capitalize tracking-tight">{agent.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success/80 animate-pulse-soft" />
              <span className="text-[9px] font-semibold text-content-tertiary/60 uppercase tracking-widest">Activo</span>
            </div>
          </div>
        </div>
        <Badge variant="neutral" size="sm">v1.2</Badge>
      </div>

      {/* Domain tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {agent.domains.map(d => (
          <span
            key={d}
            className="px-2 py-0.5 rounded-badge text-[10px] font-medium"
            style={{
              background: 'rgba(100,210,255,0.08)',
              color: '#64D2FF',
              border: '1px solid rgba(100,210,255,0.15)',
            }}
          >
            {d}
          </span>
        ))}
      </div>

      {/* Task input */}
      <div className="flex-1 space-y-3">
        <div className="relative">
          <textarea
            value={task}
            onChange={e => setTask(e.target.value)}
            placeholder="Comando para el agente..."
            rows={2}
            className="input-glass w-full px-4 py-3 text-sm rounded-button resize-none pr-12"
          />
          <button
            onClick={run}
            disabled={running || !task.trim()}
            className="absolute right-2 bottom-2 p-2 rounded-button transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: task.trim() ? 'rgba(149,184,119,0.20)' : 'rgba(255,255,255,0.03)',
              color: task.trim() ? '#A8CC8D' : '#636366',
            }}
          >
            {running ? <Activity size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-semibold text-content-tertiary/60 uppercase tracking-widest">Ejecución OK</span>
              <span className="text-[9px] font-semibold text-primary-600 tabular-nums">
                {Math.round((result.confidence as number) * 100)}% CONFIDENCE
              </span>
            </div>
            <div
              className="p-3 rounded-button"
              style={{ background: 'rgba(149,184,119,0.04)', border: '1px solid rgba(149,184,119,0.10)' }}
            >
              <p className="text-[11px] leading-relaxed text-content-secondary/80 font-mono">
                {String(result.analysis ?? '').slice(0, 200)}...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
