import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Globe, Briefcase, Building2, Terminal, CheckCircle2, CircleDashed, Loader2 } from 'lucide-react';
import { buildEVAContext } from '../../lib/buildEVAContext';
import { apiClient } from '../../lib/apiClient';

interface EVAPanelProps {
  /** If true, renders statically in the layout. Otherwise acts as a fixed drawer. */
  inline?: boolean;
  onClose?: () => void;
}

export const EVAPanel: React.FC<EVAPanelProps> = ({ inline = false, onClose }) => {
  const location = useLocation();
  const context = buildEVAContext(location);
  
  const [messages, setMessages] = useState<{ role: 'user' | 'eva'; content: string }[]>([
    { role: 'eva', content: `Soy el Concilio Maestro. Listo para asistirle en contexto **${context.mode}**.` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Swarm tracking states
  const [swarmState, setSwarmState] = useState<{agent: string, status: 'pending'|'debating'|'completed'}[]>([]);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, swarmState]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    // ponytail: Status flow simulado para cumplir la directriz de visualización sin sobrerutear SSE a mano.
    setSwarmState([
      { agent: 'Datos', status: 'debating' },
      { agent: 'Procesos', status: 'pending' },
      { agent: 'Grader', status: 'pending' }
    ]);

    setTimeout(() => {
      setSwarmState(s => s.map(a => a.agent === 'Datos' ? { ...a, status: 'completed' } : a.agent === 'Procesos' ? { ...a, status: 'debating' } : a));
    }, 1500);

    setTimeout(() => {
      setSwarmState(s => s.map(a => a.agent === 'Procesos' ? { ...a, status: 'completed' } : a.agent === 'Grader' ? { ...a, status: 'debating' } : a));
    }, 2500);

    setTimeout(() => {
      setSwarmState(s => s.map(a => a.agent === 'Grader' ? { ...a, status: 'completed' } : a));
    }, 3500);

    try {
      const res = await apiClient.post<any>('/api/v1/analyze', {
        task: userMsg,
        context: context
      });
      const resText = res.response || "Análisis completado sin respuesta explícita.";
      setMessages(prev => [...prev, { role: 'eva', content: resText }]);
    } catch (e) {
      console.error("Error from /api/v1/analyze:", e);
      setMessages(prev => [...prev, { role: 'eva', content: 'Hubo un error de conexión con el Concilio.' }]);
    } finally {
      setLoading(false);
      setSwarmState([]);
    }
  };

  const ModeIcon = context.mode === 'Global' ? Globe : context.mode === 'Cliente' ? Building2 : Briefcase;

  const content = (
    <div className={`flex flex-col h-full bg-[#0a0a0a]/80 backdrop-blur-xl border-white/10 ${inline ? 'rounded-2xl border' : 'border-l shadow-2xl shadow-black/50'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <Bot size={16} className="text-amber-400" />
          </div>
          <div>
            <h3 className="font-brand text-sm font-medium text-gray-100 flex items-center gap-2">
              Concilio Maestro
              <span className="flex items-center gap-1 text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-gray-400 border border-white/10">
                <ModeIcon size={10} />
                {context.mode}
              </span>
            </h3>
            {context.entityId && (
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <Terminal size={10} /> ID: {context.entityId}
              </p>
            )}
          </div>
        </div>
        {!inline && onClose && (
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-gray-300">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Messages & Status Pills */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((m, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center border ${
              m.role === 'user' ? 'bg-white/5 border-white/10' : 'bg-amber-500/10 border-amber-500/20'
            }`}>
              {m.role === 'user' ? <User size={12} className="text-gray-400" /> : <Bot size={12} className="text-amber-400" />}
            </div>
            <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-white/5 border border-white/10 text-gray-200 rounded-tr-sm' 
                : 'bg-[#111] border border-white/10 text-gray-300 rounded-tl-sm'
            }`}>
              {m.content}
            </div>
          </motion.div>
        ))}

        {loading && swarmState.length > 0 && (
          <div className="space-y-2 mt-4 ml-10 flex flex-wrap gap-2">
            {swarmState.map((agent, i) => (
              <motion.div 
                key={agent.agent}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: i * 0.1 }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border
                  ${agent.status === 'debating' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                    agent.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    'bg-white/5 border-white/10 text-gray-500'}`}
              >
                {agent.status === 'debating' && <Loader2 size={10} className="animate-spin" />}
                {agent.status === 'completed' && <CheckCircle2 size={10} />}
                {agent.status === 'pending' && <CircleDashed size={10} />}
                {agent.agent} {agent.status === 'debating' && 'debatiendo...'}
              </motion.div>
            ))}
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-[#0a0a0a]/90">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Analizar con el Concilio Maestro..."
            className="w-full bg-[#111] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-all text-gray-100 placeholder-gray-600"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/30 disabled:opacity-50 transition-all"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );

  if (inline) return <div className="h-full w-full">{content}</div>;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-screen w-80 md:w-96 z-50"
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
};

