import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Globe, Briefcase, Building2, Terminal } from 'lucide-react';
import { buildEVAContext } from '../../lib/buildEVAContext';
import { api } from '../../lib/api';

interface EVAPanelProps {
  /** If true, renders statically in the layout. Otherwise acts as a fixed drawer. */
  inline?: boolean;
  onClose?: () => void;
}

export const EVAPanel: React.FC<EVAPanelProps> = ({ inline = false, onClose }) => {
  const location = useLocation();
  const context = buildEVAContext(location);
  
  const [messages, setMessages] = useState<{ role: 'user' | 'eva'; content: string }[]>([
    { role: 'eva', content: `Soy EVA. Estoy lista para asistirle en contexto **${context.mode}**.` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      // Usamos el searchKnowledge para simular la IA. 
      // O si hay una API de chat, la usamos.
      const res = await api.searchKnowledge(userMsg, 'eva');
      let responseText = "No encontré resultados específicos.";
      if (res && res.results && res.results.length > 0) {
        const firstResult = res.results[0] as any;
        responseText = `Basado en mis datos: ${firstResult.content?.substring(0, 150)}...`;
      }
      
      setMessages(prev => [...prev, { role: 'eva', content: responseText }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'eva', content: 'Hubo un error de conexión.' }]);
    } finally {
      setLoading(false);
    }
  };

  const ModeIcon = context.mode === 'Global' ? Globe : context.mode === 'Cliente' ? Building2 : Briefcase;

  const content = (
    <div className={`flex flex-col h-full bg-eva-surface-2 border-eva-border ${inline ? 'rounded-2xl border ring-4 ring-eva-beige-2/5' : 'border-l shadow-2xl'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-eva-border bg-eva-surface/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-eva-olive/20 flex items-center justify-center border border-eva-olive/30">
            <Bot size={16} className="text-eva-olive" />
          </div>
          <div>
            <h3 className="font-brand text-sm font-medium text-eva-txt-primary flex items-center gap-2">
              EVA Assistant
              <span className="flex items-center gap-1 text-[10px] bg-eva-surface px-2 py-0.5 rounded-full text-eva-txt-muted border border-eva-border">
                <ModeIcon size={10} />
                {context.mode}
              </span>
            </h3>
            {context.entityId && (
              <p className="text-xs text-eva-txt-muted flex items-center gap-1 mt-0.5">
                <Terminal size={10} /> ID: {context.entityId}
              </p>
            )}
          </div>
        </div>
        {!inline && onClose && (
          <button onClick={onClose} className="p-2 hover:bg-eva-surface rounded-lg transition-colors text-eva-txt-muted hover:text-eva-txt-primary">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((m, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center border ${
              m.role === 'user' ? 'bg-eva-surface border-eva-border' : 'bg-eva-olive/20 border-eva-olive/30'
            }`}>
              {m.role === 'user' ? <User size={12} className="text-eva-txt-muted" /> : <Bot size={12} className="text-eva-olive" />}
            </div>
            <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-eva-surface border border-eva-border text-eva-txt-primary rounded-tr-sm' 
                : 'bg-eva-olive/10 border border-eva-olive/20 text-eva-txt-primary rounded-tl-sm'
            }`}>
              {m.content}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-6 h-6 rounded-full bg-eva-olive/20 border border-eva-olive/30 flex items-center justify-center">
              <Bot size={12} className="text-eva-olive" />
            </div>
            <div className="p-3 rounded-2xl bg-eva-olive/10 border border-eva-olive/20 rounded-tl-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-eva-olive/50 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-eva-olive/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-eva-olive/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-eva-border bg-eva-surface/50">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Consultar EVA en modo ${context.mode}...`}
            className="w-full bg-eva-surface border border-eva-border rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-eva-olive focus:ring-1 focus:ring-eva-olive transition-all text-eva-txt-primary placeholder-eva-txt-muted"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 bg-eva-olive text-white rounded-lg hover:bg-eva-olive-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );

  if (inline) {
    return <div className="h-full w-full">{content}</div>;
  }

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
