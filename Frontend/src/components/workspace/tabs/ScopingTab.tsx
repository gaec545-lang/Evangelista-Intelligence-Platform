import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Target, 
  Plus, 
  RefreshCw, 
  Sparkles, 
  LayoutGrid, 
  GitMerge,
  Search,
  Filter,
  AlertCircle,
  X,
  FileDown,
  MessageSquare,
  Send
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Project, InterviewNote, Hypothesis, HypothesisStatus } from '../../../lib/types';
import { interviewNotesDB, hypothesesDB, projectActivityLogDB } from '../../../lib/supabase';
import { useAuthStore } from '../../../stores/authStore';
import { api } from '../../../lib/api';
import Button from '../../ui/Button';
import { Spinner } from '../../ui/Spinner';
import InterviewNoteCard from '../InterviewNoteCard';
import { NewInterviewNoteModal } from '../NewInterviewNoteModal';
import HypothesisCard from '../HypothesisCard';
import { NewHypothesisModal } from '../NewHypothesisModal';
import IssueTreeView from '../IssueTreeView';

interface ScopingTabProps {
  project: Project;
}

export default function ScopingTab({ project }: ScopingTabProps) {
  const [notes, setNotes] = useState<InterviewNote[]>([]);
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid');
  const [suggesting, setSuggesting] = useState(false);
  const [backendError, setBackendError] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [feedbackInput, setFeedbackInput] = useState('');
  
  // Modals
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showHypothesisModal, setShowHypothesisModal] = useState(false);
  const [editingHypothesis, setEditingHypothesis] = useState<Partial<Hypothesis> | null>(null);
  
  const { user } = useAuthStore();

  const loadData = async () => {
    setLoading(true);
    try {
      const [notesRes, hypoRes] = await Promise.all([
        interviewNotesDB.getByProject(project.id),
        hypothesesDB.getByProject(project.id)
      ]);
      setNotes(notesRes.data || []);
      setHypotheses(hypoRes.data || []);
    } catch (error) {
      console.error('Error loading scoping data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [project.id]);

  const handleStatusChange = async (id: string, status: HypothesisStatus) => {
    try {
      await hypothesesDB.update(id, { status });
      await loadData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteHypothesis = async (id: string) => {
    if (!window.confirm('¿Eliminar esta hipótesis?')) return;
    try {
      await hypothesesDB.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error deleting hypothesis:', error);
    }
  };

  const handleSuggestHypothesis = async (feedback?: string) => {
    setSuggesting(true);
    setBackendError(false);
    try {
      const promptFooter = `\n\n:::register
{
  "title": "...",
  "type": "problema" | "causa_raiz" | "oportunidad" | "riesgo",
  "description": "..."
}
:::
IMPORTANTE: Al final de tu respuesta, DEBES incluir OBLIGATORIAMENTE el bloque :::register con el JSON de la hipótesis principal (un solo objeto). No uses bloques de código markdown dentro de :::register, solo el JSON puro.`;

      let prompt = `Analiza las notas de entrevista para el proyecto "${project.name}" (Area: ${project.area}) y sugiere 3 hipótesis estratégicas de alto impacto.${promptFooter}`;
      
      if (feedback && aiSuggestion) {
        prompt = `El usuario ha solicitado los siguientes ajustes a las hipótesis sugeridas anteriormente: "${feedback}". Por favor, ajusta las hipótesis según estas instrucciones y vuelve a presentar las sugerencias finales.${promptFooter}`;
      }

      const res = await api.analyze({ 
        task: prompt,
        context: { 
          project_id: project.id, 
          notes: notes.map(n => n.content).join('\n\n'),
          chat_history: aiSuggestion ? `IA Sugerencia Anterior: ${aiSuggestion}` : undefined
        }
      });
      
      if (res.response) {
        setAiSuggestion(res.response);
        setFeedbackInput('');
      }
    } catch (err) {
      console.error('Error suggesting hypothesis:', err);
      setBackendError(true);
    } finally {
      setSuggesting(false);
    }
  };

  const handleRegisterAISuggestion = () => {
    if (!aiSuggestion) return;
    
    let extractedData = {
      title: "Hipótesis sugerida por IA",
      type: "oportunidad" as any,
      description: aiSuggestion.replace(/:::register[\s\S]*?:::/, '').trim()
    };

    try {
      // Intentar encontrar el bloque JSON de varias formas
      let jsonString = '';
      
      // 1. Buscar bloque :::register
      const registerMatch = aiSuggestion.match(/:::register([\s\S]*?):::/);
      if (registerMatch) {
        jsonString = registerMatch[1].replace(/```[a-z]*|```/g, '').trim();
      } else {
        // 2. Fallback: buscar cualquier bloque que parezca JSON { ... }
        const anyJsonMatch = aiSuggestion.match(/\{[\s\S]*\}/);
        if (anyJsonMatch) {
          jsonString = anyJsonMatch[0].replace(/```[a-z]*|```/g, '').trim();
        }
      }

      if (jsonString) {
        // Limpiar posibles caracteres extraños antes o después del JSON
        const start = jsonString.indexOf('{');
        const end = jsonString.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
          jsonString = jsonString.substring(start, end + 1);
          const parsed = JSON.parse(jsonString);
          
          extractedData = {
            title: parsed.title || extractedData.title,
            type: (parsed.type || extractedData.type).toLowerCase().trim(),
            description: parsed.description || extractedData.description
          };

          // Mapear tipos comunes si la IA se equivoca
          const typeMapping: Record<string, HypothesisStatus | any> = {
            'problema': 'problema',
            'causa_raiz': 'causa_raiz',
            'causa raíz': 'causa_raiz',
            'oportunidad': 'oportunidad',
            'riesgo': 'riesgo',
            'hipotesis': 'problema'
          };
          
          extractedData.type = typeMapping[extractedData.type] || 'oportunidad';
        }
      }
    } catch (e) {
      console.error("Error crítico parseando sugerencia de IA:", e);
    }

    setEditingHypothesis({
      statement: extractedData.title, // Map AI title to statement
      evidence: extractedData.description,
      hypothesis_type: extractedData.type,
      status: 'planteada',
      project_id: project.id
    });
    
    setShowHypothesisModal(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL IZQUIERDO: NOTAS DE ENTREVISTA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-eva-olive/5 flex items-center justify-center border border-eva-olive/10 shadow-sm">
                <FileText className="w-4 h-4 text-eva-olive" />
              </div>
              <h3 className="text-xl font-serif text-eva-black">Entrevistas</h3>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowNoteModal(true)}
              className="h-8 border-eva-border bg-white text-[10px] uppercase tracking-widest font-bold shadow-sm"
            >
              <Plus className="w-3 h-3 mr-2" />
              Nueva Nota
            </Button>
          </div>

          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-eva-border scrollbar-track-transparent">
            {loading ? (
              <div className="py-20 flex justify-center"><Spinner size="sm" /></div>
            ) : notes.length === 0 ? (
              <div className="py-12 text-center bg-white/50 rounded-xl border border-dashed border-eva-border">
                <p className="text-xs text-eva-txt-faint italic font-medium">No hay notas registradas.</p>
              </div>
            ) : (
              notes.map(note => (
                <InterviewNoteCard key={note.id} note={note} />
              ))
            )}
          </div>
        </div>

        {/* PANEL DERECHO: HIPÓTESIS */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-eva-gold/10 flex items-center justify-center border border-eva-gold/20 shadow-sm">
                <Target className="w-4 h-4 text-eva-gold" />
              </div>
              <h3 className="text-xl font-serif text-eva-black">Hipótesis Estratégicas</h3>
            </div>
            <div className="flex gap-2">
              <div className="bg-white rounded-lg p-1 flex border border-eva-border shadow-sm">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-eva-olive/10 text-eva-olive' : 'text-eva-txt-faint hover:text-eva-txt-muted'}`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setViewMode('tree')}
                  className={`p-1.5 rounded transition-colors ${viewMode === 'tree' ? 'bg-eva-olive/10 text-eva-olive' : 'text-eva-txt-faint hover:text-eva-txt-muted'}`}
                >
                  <GitMerge className="w-3.5 h-3.5" />
                </button>
              </div>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => { setEditingHypothesis(null); setShowHypothesisModal(true); }}
                className="h-9 bg-eva-olive hover:bg-eva-olive-2 text-white text-[10px] uppercase tracking-widest font-bold shadow-md"
              >
                <Plus className="w-3 h-3 mr-2" />
                Nueva Hipótesis
              </Button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div 
                key="grid"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {loading ? (
                  <div className="py-20 flex justify-center"><Spinner size="sm" /></div>
                ) : hypotheses.length === 0 ? (
                  <div className="py-20 text-center bg-white/50 rounded-2xl border border-dashed border-eva-border">
                    <Target className="w-12 h-12 text-eva-txt-faint mx-auto mb-4" />
                    <p className="text-sm text-eva-txt-muted mb-4 font-medium">Plantea las primeras hipótesis del proyecto.</p>
                    <Button variant="ghost" onClick={() => setShowHypothesisModal(true)} className="text-eva-olive font-bold">
                       Registrar Hipótesis →
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hypotheses.filter(h => !h.parent_hypothesis_id).map(h => (
                      <React.Fragment key={h.id}>
                        <HypothesisCard 
                          hypothesis={h} 
                          onStatusChange={handleStatusChange}
                          onEdit={(h) => { setEditingHypothesis(h); setShowHypothesisModal(true); }}
                          onDelete={handleDeleteHypothesis}
                        />
                        {/* Render children inline in grid for now, or just focus on roots */}
                        {hypotheses.filter(child => child.parent_hypothesis_id === h.id).map(child => (
                           <HypothesisCard 
                             key={child.id}
                             hypothesis={child} 
                             onStatusChange={handleStatusChange}
                             onEdit={(h) => { setEditingHypothesis(h); setShowHypothesisModal(true); }}
                             onDelete={handleDeleteHypothesis}
                             isDerived
                           />
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                )}
                
                <AnimatePresence>
                  {aiSuggestion && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="mb-8 p-8 rounded-3xl bg-white border border-eva-olive/20 shadow-xl relative overflow-hidden group"
                    >
                      {/* Decorative Background */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-eva-olive/5 rounded-bl-full -z-10" />
                      
                      <button 
                        onClick={() => setAiSuggestion(null)}
                        className="absolute top-6 right-6 p-2 rounded-xl hover:bg-eva-olive/10 text-eva-txt-faint hover:text-eva-olive transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-eva-olive/10 flex items-center justify-center border border-eva-olive/20">
                          <Sparkles className="w-5 h-5 text-eva-olive" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-eva-olive block">Intelligence Suggestion</span>
                          <h4 className="text-sm font-serif text-eva-black">Propuestas Estratégicas de Hipótesis</h4>
                        </div>
                      </div>

                      <div className="prose prose-sm max-w-none 
                        prose-p:leading-relaxed prose-p:mb-4 last:prose-p:mb-0
                        prose-headings:text-eva-black prose-headings:font-bold prose-headings:mb-3
                        prose-strong:text-eva-black prose-strong:font-bold
                        prose-ul:list-disc prose-ul:pl-4 prose-ol:list-decimal prose-ol:pl-4
                        prose-li:mb-1
                        text-eva-txt-mid">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {aiSuggestion?.replace(/:::register[\s\S]*?:::/, '').trim()}
                        </ReactMarkdown>
                      </div>

                      <div className="mt-8 pt-6 border-t border-eva-border flex flex-col gap-6">
                        {/* Feedback Input */}
                        <div className="relative group">
                          <input 
                            type="text"
                            value={feedbackInput}
                            onChange={e => setFeedbackInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && feedbackInput.trim()) {
                                handleSuggestHypothesis(feedbackInput);
                              }
                            }}
                            placeholder="Solicitar ajustes a esta sugerencia (ej: 'enfócate más en costos')..."
                            className="w-full bg-eva-beige-2/30 border border-eva-border rounded-xl px-4 py-3 pr-24 text-xs text-eva-black outline-none focus:border-eva-olive/40 transition-all"
                          />
                          <div className="absolute right-2 top-1.5 flex gap-2">
                             <Button 
                               variant="primary" 
                               size="sm"
                               disabled={!feedbackInput.trim() || suggesting}
                               onClick={() => handleSuggestHypothesis(feedbackInput)}
                               className="h-8 bg-eva-gold text-eva-black px-3"
                             >
                               {suggesting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                             </Button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <button 
                            onClick={handleRegisterAISuggestion}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-eva-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-eva-gold hover:text-eva-black transition-all shadow-md active:scale-95"
                          >
                            <Target className="w-3.5 h-3.5" />
                            Registrar en el Proyecto
                          </button>

                          <button 
                            onClick={() => {
                              const blob = new Blob([aiSuggestion], { type: 'text/markdown' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `sugerencias-hipotesis-${project.id}.md`;
                              a.click();
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-eva-beige-2 text-[10px] font-bold uppercase tracking-widest text-eva-txt-mid transition-all border border-transparent hover:border-eva-border"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                            Descargar .md
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button 
                  variant="ghost" 
                  onClick={handleSuggestHypothesis}
                  disabled={suggesting}
                  className={`w-full py-6 border-2 border-dashed transition-all font-bold uppercase tracking-widest text-[10px] ${
                    backendError 
                      ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100' 
                      : 'border-eva-border bg-white/30 text-eva-gold hover:bg-white/50 hover:border-eva-gold/30'
                  }`}
                >
                  {suggesting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Procesando con IA...
                    </>
                  ) : backendError ? (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                      IA Saturada (Groq) - Reintentar en 15s
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Sugerir Hipótesis con IA (Contextual)
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                key="tree"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <IssueTreeView hypotheses={hypotheses} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <NewInterviewNoteModal 
        open={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        projectId={project.id}
        onSave={loadData}
      />
      
      <NewHypothesisModal 
        open={showHypothesisModal}
        onClose={() => setShowHypothesisModal(false)}
        projectId={project.id}
        projectArea={project.area}
        onSave={loadData}
        initialData={editingHypothesis}
        parentOptions={hypotheses}
      />
    </div>
  );
}
