import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Trash2, 
  Terminal, 
  ShieldCheck, 
  Briefcase,
  Zap,
  Command,
  ChevronRight,
  Database
} from 'lucide-react';
import { Project, Hypothesis, Finding, InterviewNote } from '../../../lib/types';
import { hypothesesDB, findingsDB, interviewNotesDB, clientsDB } from '../../../lib/supabase';
import { buildSystemPrompt, buildWelcomeMessage } from '../../../lib/buildProjectContext';
import { api } from '../../../lib/api';
import { useAuthStore } from '../../../stores/authStore';
import Button from '../../ui/Button';
import { Spinner } from '../../ui/Spinner';

interface AITabProps {
  project: Project;
}

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  sources?: string[];
}

const QUICK_PROMPTS: Record<string, string[]> = {
  supply_chain: [
    'Estructurar árbol de problemas (MECE)',
    'Calcular COI de hallazgos actuales',
    'Narrativa ejecutiva (Pyramid Principle)',
    'Hipótesis de causa raíz adicionales',
    'Dimensiones Kimball para este flujo'
  ],
  finanzas: [
    'Análisis de variaciones vs presupuesto',
    'Checklist ALCOA+ para auditoría',
    'Unit Economics del cliente',
    'Puntos ciegos en conciliación'
  ],
  logistica: [
    'Optimización de rutas (Heurística)',
    'Análisis de fill-rate y merma',
    'Matriz de riesgos logísticos'
  ]
};

export default function AITab({ project }: AITabProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [contextLoading, setContextLoading] = useState(true);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [summary, setSummary] = useState({
    hypothesesCount: 0,
    findingsCount: 0,
    totalImpact: 0,
    clientName: ''
  });
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  const loadContext = async () => {
    setContextLoading(true);
    try {
      const [{ data: hypotheses }, { data: findings }, { data: notes }] = await Promise.all([
        hypothesesDB.getByProject(project.id),
        findingsDB.getByProject(project.id),
        interviewNotesDB.getByProject(project.id),
      ]);

      const client = await clientsDB.get(project.client_id);

      const ctx = {
        project,
        client: { name: client?.company_name || 'Cliente', sector: client?.sector || '' },
        hypotheses: hypotheses || [],
        findings: findings || [],
        recentNotes: (notes || []).slice(0, 3),
      };

      setSystemPrompt(buildSystemPrompt(ctx));
      setSummary({
        hypothesesCount: ctx.hypotheses.length,
        findingsCount: ctx.findings.length,
        totalImpact: ctx.findings.reduce((sum, f) => sum + (f.economic_impact ?? 0), 0),
        clientName: ctx.client.name
      });

      if (messages.length === 0) {
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: buildWelcomeMessage(ctx),
          timestamp: new Date().toISOString(),
        }]);
      }
    } catch (error) {
      console.error('Error loading AI context:', error);
    } finally {
      setContextLoading(false);
    }
  };

  useEffect(() => {
    loadContext();
  }, [project.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const chatHistory = [...messages, userMsg].filter(m => m.id !== 'welcome')
        .map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');

      const response = await api.analyze({
        task: text,
        context: {
          project_id: project.id,
          system_prompt: systemPrompt,
          chat_history: chatHistory,
          use_rag: true
        }
      });

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
        sources: response.sources
      }]);
    } catch (error) {
      console.error('Error in AI chat:', error);
      setMessages(prev => [...prev, {
        id: 'error',
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor intenta de nuevo.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    loadContext();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 h-[calc(100vh-280px)] -mx-4 -mb-4 bg-white rounded-b-3xl overflow-hidden border border-eva-border animate-in fade-in duration-700 shadow-sm">
      
      {/* PANEL IZQUIERDO: CONTEXTO */}
      <div className="lg:col-span-3 border-r border-eva-border bg-eva-beige/30 p-6 flex flex-col gap-8">
        <div className="space-y-1">
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-eva-txt-faint">Contexto Activo</h4>
          <p className="text-xs text-eva-olive font-mono uppercase tracking-widest font-bold">Diagnostic Engine v1.0</p>
        </div>

        <div className="space-y-6">
           <ContextItem label="Cliente" value={summary.clientName} icon={Briefcase} />
           <ContextItem label="Área" value={project.area.replace('_', ' ').toUpperCase()} icon={Database} />
           
           <div className="space-y-3">
              <div className="flex justify-between items-center">
                 <span className="text-[10px] uppercase tracking-widest text-eva-txt-muted font-bold">Hipótesis</span>
                 <span className="text-[10px] text-eva-txt-mid font-mono font-bold">{summary.hypothesesCount}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-[10px] uppercase tracking-widest text-eva-txt-muted font-bold">Hallazgos</span>
                 <span className="text-[10px] text-eva-txt-mid font-mono font-bold">{summary.findingsCount}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-[10px] uppercase tracking-widest text-eva-txt-muted font-bold">Impacto Total</span>
                 <span className="text-[10px] text-eva-olive font-mono font-bold">${(summary.totalImpact / 1000000).toFixed(1)}M</span>
              </div>
           </div>
        </div>

        <div className="mt-auto space-y-4">
           <div className="p-4 rounded-xl bg-eva-olive/5 border border-eva-olive/10">
              <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck className="w-3 h-3 text-eva-olive" />
                 <span className="text-[9px] font-bold text-eva-olive uppercase tracking-widest">ALCOA+ Verified</span>
              </div>
              <p className="text-[9px] text-eva-txt-muted leading-relaxed italic font-medium">El agente utiliza solo datos verificados y trazables del proyecto actual.</p>
           </div>
           <button 
             onClick={clearChat}
             className="w-full py-2 text-[10px] uppercase tracking-widest text-eva-txt-faint hover:text-red-500 font-bold transition-colors flex items-center justify-center gap-2"
           >
              <Trash2 className="w-3 h-3" /> Limpiar Conversación
           </button>
        </div>
      </div>

      {/* PANEL DERECHO: CHAT */}
      <div className="lg:col-span-9 flex flex-col relative bg-eva-beige/10 h-full min-h-0 overflow-hidden">
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-eva-border scrollbar-track-transparent">
           {messages.map((msg, i) => (
             <motion.div
               key={msg.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
             >
               <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border shadow-sm ${
                 msg.role === 'assistant' 
                  ? 'bg-eva-olive/10 border-eva-olive/20 text-eva-olive' 
                  : 'bg-white border-eva-border text-eva-txt-muted'
               }`}>
                 {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
               </div>
               
               <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm border ${
                    msg.role === 'assistant' 
                     ? 'bg-white border-eva-border text-eva-txt-mid' 
                     : 'bg-eva-olive text-white border-eva-olive font-bold'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none 
                        prose-p:leading-relaxed prose-p:mb-4 last:prose-p:mb-0
                        prose-headings:text-eva-black prose-headings:font-bold prose-headings:mb-3
                        prose-strong:text-eva-black prose-strong:font-bold
                        prose-ul:list-disc prose-ul:pl-4 prose-ol:list-decimal prose-ol:pl-4
                        prose-li:mb-1
                        text-eva-txt-mid">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                 <p className="text-[9px] text-eva-txt-faint font-mono font-bold">
                   {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </p>
               </div>
             </motion.div>
           ))}
           
           {loading && (
             <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-eva-olive/10 border border-eva-olive/20 text-eva-olive flex items-center justify-center animate-pulse shadow-sm">
                   <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-eva-border flex items-center gap-2 shadow-sm">
                   <div className="w-1.5 h-1.5 rounded-full bg-eva-olive animate-bounce [animation-delay:-0.3s]" />
                   <div className="w-1.5 h-1.5 rounded-full bg-eva-olive animate-bounce [animation-delay:-0.15s]" />
                   <div className="w-1.5 h-1.5 rounded-full bg-eva-olive animate-bounce" />
                </div>
             </div>
           )}
           <div ref={chatEndRef} />
        </div>

        {/* Input & Quick Prompts */}
        <div className="p-8 pt-0 space-y-4">
           <div className="flex flex-wrap gap-2">
              {(QUICK_PROMPTS[project.area] || QUICK_PROMPTS.supply_chain).map(p => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-eva-border text-[10px] text-eva-txt-muted font-bold hover:bg-eva-beige hover:border-eva-olive/30 transition-all flex items-center gap-2 shadow-sm"
                >
                  <Zap className="w-3 h-3 text-eva-olive" />
                  {p}
                </button>
              ))}
           </div>

           <div className="relative group">
              <textarea 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={1}
                placeholder="Pregunta al agente sobre el proyecto..."
                className="w-full bg-white border border-eva-border rounded-2xl px-6 py-4 pr-24 text-sm text-eva-black focus:border-eva-olive/50 outline-none resize-none transition-all shadow-md placeholder:text-eva-txt-faint"
              />
              <div className="absolute right-3 top-3 flex items-center gap-2">
                 <div className="p-1.5 rounded-lg bg-eva-beige-2 text-eva-txt-faint border border-eva-border group-focus-within:border-eva-olive/30 transition-all">
                    <Command className="w-3.5 h-3.5" />
                 </div>
                 <button 
                   onClick={() => handleSend()}
                   disabled={!input.trim() || loading}
                   className="p-2 rounded-xl bg-eva-black text-white hover:bg-eva-olive active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all shadow-xl shadow-eva-black/20"
                 >
                    <Send className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function ContextItem({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="flex items-center gap-3">
       <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-eva-border shadow-sm">
          <Icon className="w-4 h-4 text-eva-txt-muted" />
       </div>
       <div className="min-w-0">
          <p className="text-[9px] uppercase tracking-widest text-eva-txt-faint font-bold mb-0.5">{label}</p>
          <p className="text-xs text-eva-black truncate font-bold">{value}</p>
       </div>
    </div>
  );
}
