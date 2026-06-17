import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Minus,
  Briefcase,
  ExternalLink,
  Save,
  Send,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Project, Client } from '../../../lib/types';
import { projectsDB, deliverablesDB, projectActivityLogDB, clientsDB } from '../../../lib/supabase';
import { api } from '../../../lib/api';
import { useAuthStore } from '../../../stores/authStore';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import { Spinner } from '../../ui/Spinner';
import { 
  calculateProjectPrice, 
  ALPHA_LEVELS, 
  BETA_CRITERIA,
  PriceBreakdown 
} from '../../../lib/pricing';
import { DocumentGeneratorButton } from '../../documents/DocumentGeneratorButton';

interface ProposalTabProps {
  project: Project;
}

export default function ProposalTab({ project }: ProposalTabProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  
  // Pricing State
  const [alpha, setAlpha] = useState(project.complexity_alpha || 0);
  const [betaIndices, setBetaIndices] = useState<number[]>([]); // Índices de criterios activos
  const [extraSources, setExtraSources] = useState(0);
  const [hasTravelExpenses, setHasTravelExpenses] = useState(project.travel_expenses > 0);
  
  const { user } = useAuthStore();

  useEffect(() => {
    // Inicializar beta si ya existe en el proyecto
    if (project.complexity_beta) {
      const count = Math.round(project.complexity_beta / 0.1);
      setBetaIndices(Array.from({ length: count }, (_, i) => i));
    }
    
    // Cargar cliente
    const loadClient = async () => {
      const data = await clientsDB.get(project.client_id);
      if (data) setClient(data);
    };
    loadClient();
  }, [project]);

  const beta = betaIndices.length * 0.10;
  const breakdown = calculateProjectPrice({
    area: project.area,
    alpha,
    beta,
    extraSources,
    hasTravelExpenses
  });

  const handleSavePrice = async () => {
    setLoading(true);
    try {
      await projectsDB.update(project.id, {
        complexity_alpha: alpha,
        complexity_beta: beta,
        gamma_sources: 1.0 + (0.15 * extraSources),
        travel_expenses: hasTravelExpenses ? 8000 : 0,
        total_price: breakdown.total_before_tax,
      });
      
      await projectActivityLogDB.log({
        project_id: project.id,
        action_type: 'price_calculated',
        description: `Inversión total actualizada: ${formatCurrency(breakdown.total_before_tax)}`,
        performed_by_name: user?.username?.split('@')[0] || 'Consultor',
      });
      
      // Feedback visual
      alert('Inversión guardada correctamente.');
    } catch (error) {
      console.error('Error saving price:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateProposal = async (format: 'docx' | 'pdf') => {
    // This is now handled by DocumentGeneratorButton
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
      
      {/* PANEL IZQUIERDO: CALCULADORA */}
      <div className="lg:col-span-8 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-eva-olive/10 flex items-center justify-center border border-eva-olive/20 shadow-sm">
            <Calculator className="w-5 h-5 text-eva-olive" />
          </div>
          <div>
            <h3 className="text-xl font-serif text-eva-black">Motor de Inversión</h3>
            <p className="text-xs text-eva-txt-muted font-medium">Cálculo algorítmico basado en Alcance (α), Complejidad (β) y Fuentes (Γ).</p>
          </div>
        </div>

        {/* Factor Alpha */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-[11px] uppercase tracking-widest font-bold text-eva-txt-faint">Factor α — Alcance</label>
            <span className="text-eva-olive font-mono text-lg font-bold">{(alpha * 100).toFixed(0)}%</span>
          </div>
          <div className="relative h-2 bg-eva-beige-2 rounded-full overflow-hidden border border-eva-border">
            <input 
              type="range" 
              min="0" 
              max="0.3" 
              step="0.1" 
              value={alpha}
              onChange={e => setAlpha(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div 
              className="h-full bg-gradient-to-r from-eva-olive/40 to-eva-olive transition-all duration-300" 
              style={{ width: `${(alpha / 0.3) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {ALPHA_LEVELS.map(level => (
              <div key={level.value} className={`text-center space-y-1 ${alpha === level.value ? 'opacity-100' : 'opacity-20'}`}>
                <p className="text-[10px] font-bold text-eva-black">{level.label}</p>
                <p className="text-[8px] text-eva-txt-muted font-bold leading-tight uppercase tracking-tighter">{level.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Factor Beta */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-[11px] uppercase tracking-widest font-bold text-eva-txt-faint">Factor β — Complejidad</label>
            <span className="text-eva-olive font-mono text-lg font-bold">{(beta * 100).toFixed(0)}%</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BETA_CRITERIA.map(criterion => (
              <button
                key={criterion.id}
                onClick={() => {
                  setBetaIndices(prev => 
                    prev.includes(criterion.id) 
                      ? prev.filter(i => i !== criterion.id) 
                      : [...prev, criterion.id]
                  );
                }}
                className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 shadow-sm ${
                  betaIndices.includes(criterion.id)
                    ? 'bg-eva-olive/5 border-eva-olive/30 text-eva-black shadow-md'
                    : 'bg-white border-eva-border text-eva-txt-muted hover:border-eva-olive/30'
                }`}
              >
                <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center transition-colors ${
                  betaIndices.includes(criterion.id) ? 'bg-eva-olive border-eva-olive' : 'border-eva-border'
                }`}>
                  {betaIndices.includes(criterion.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <span className="text-xs leading-snug font-medium">{criterion.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Factor Gamma */}
        <div className="flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl bg-white border border-eva-border gap-6 shadow-sm">
          <div className="space-y-1">
             <label className="text-[11px] uppercase tracking-widest font-bold text-eva-txt-faint">Factor Γ — Fuentes Adicionales</label>
             <p className="text-xs text-eva-txt-muted font-medium">La primera fuente está incluida. Cada adicional suma +15%.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setExtraSources(Math.max(0, extraSources - 1))}
              className="w-10 h-10 rounded-full border border-eva-border flex items-center justify-center hover:bg-eva-beige-2 transition-colors shadow-sm"
            >
              <Minus className="w-4 h-4 text-eva-txt-muted" />
            </button>
            <div className="text-center min-w-[60px]">
               <span className="text-2xl font-serif text-eva-black">{extraSources}</span>
               <p className="text-[10px] text-eva-olive font-mono font-bold uppercase">x{breakdown.gamma.toFixed(2)}</p>
            </div>
            <button 
              onClick={() => setExtraSources(extraSources + 1)}
              className="w-10 h-10 rounded-full border border-eva-border flex items-center justify-center hover:bg-eva-beige-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 text-eva-txt-muted" />
            </button>
          </div>
        </div>
      </div>

      {/* PANEL DERECHO: RESUMEN */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="p-8 bg-white border-eva-border shadow-xl sticky top-8">
           <h4 className="text-[11px] uppercase tracking-[0.3em] font-bold text-eva-txt-faint mb-8 border-b border-eva-border pb-4">
             Resumen de Inversión
           </h4>

           <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-eva-txt-muted italic font-medium">Base {project.area.replace('_', ' ')}</span>
                <span className="text-eva-black font-bold">{formatCurrency(breakdown.base)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-eva-txt-muted italic font-medium">Factor α ({(alpha * 100).toFixed(0)}%)</span>
                <span className="text-eva-olive font-bold">+{formatCurrency(breakdown.alpha_amount)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-eva-txt-muted italic font-medium">Factor β ({(beta * 100).toFixed(0)}%)</span>
                <span className="text-eva-olive font-bold">+{formatCurrency(breakdown.beta_amount)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-eva-txt-muted italic font-medium">Factor Γ ({breakdown.gamma.toFixed(2)})</span>
                <span className="text-eva-olive font-bold">x {breakdown.gamma.toFixed(2)}</span>
              </div>
              
              <div className="h-px bg-eva-border my-4" />
              
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest text-eva-txt-faint font-bold">Subtotal</span>
                <span className="text-lg text-eva-black font-serif">{formatCurrency(breakdown.subtotal)}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-eva-beige-2/50 border border-eva-border mt-4">
                 <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={hasTravelExpenses}
                      onChange={e => setHasTravelExpenses(e.target.checked)}
                      className="w-4 h-4 rounded border-eva-border bg-white text-eva-olive focus:ring-eva-olive"
                    />
                    <span className="text-[10px] uppercase tracking-widest text-eva-txt-muted font-bold">Viáticos Foráneos</span>
                 </div>
                 <span className={`text-xs font-mono font-bold ${hasTravelExpenses ? 'text-eva-olive' : 'text-eva-txt-faint'}`}>
                    {formatCurrency(hasTravelExpenses ? 8000 : 0)}
                 </span>
              </div>
           </div>

           <div className="space-y-2 mb-8 bg-eva-olive/[0.03] p-8 rounded-[2rem] border border-eva-olive/10 shadow-inner text-center">
              <span className="text-[10px] uppercase tracking-[0.4em] text-eva-txt-faint font-black mb-2 block">Inversión Final</span>
              <div className="flex flex-col items-center">
                 <span className="text-5xl font-serif text-eva-black font-medium leading-none mb-2">
                    {formatCurrency(breakdown.total_before_tax).split('.')[0]}
                    <span className="text-xl opacity-30">.{formatCurrency(breakdown.total_before_tax).split('.')[1]}</span>
                 </span>
                 <span className="text-[10px] text-eva-txt-faint uppercase tracking-widest font-bold italic">IVA no incluido · Protocolo T-1</span>
              </div>
           </div>

           <div className="space-y-3">
              <Button 
                variant="primary" 
                onClick={handleSavePrice}
                isLoading={loading}
                className="w-full h-12 bg-eva-black text-white font-bold uppercase tracking-widest hover:bg-eva-black-2 shadow-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                Confirmar e Iniciar
              </Button>
              
              {client && (
                <div className="flex gap-2 w-full">
                  <div className="flex-1">
                    <DocumentGeneratorButton
                      docType="propuesta"
                      project={project}
                      client={client}
                      outputFormat="docx"
                      label="DOCX"
                      variables={{
                        base_price: breakdown.base,
                        total_before_tax: breakdown.total_before_tax,
                        total_with_tax: breakdown.total_before_tax * 1.16,
                        alpha_pct: `${(alpha * 100).toFixed(0)}%`,
                        beta_pct: `${(beta * 100).toFixed(0)}%`,
                        gamma: breakdown.gamma.toFixed(2),
                        subtotal: breakdown.subtotal,
                        travel_expenses: hasTravelExpenses ? 8000 : 0,
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <DocumentGeneratorButton
                      docType="propuesta"
                      project={project}
                      client={client}
                      outputFormat="pdf"
                      label="PDF"
                      variables={{
                        base_price: breakdown.base,
                        total_before_tax: breakdown.total_before_tax,
                        total_with_tax: breakdown.total_before_tax * 1.16,
                        alpha_pct: `${(alpha * 100).toFixed(0)}%`,
                        beta_pct: `${(beta * 100).toFixed(0)}%`,
                        gamma: breakdown.gamma.toFixed(2),
                        subtotal: breakdown.subtotal,
                        travel_expenses: hasTravelExpenses ? 8000 : 0,
                      }}
                    />
                  </div>
                </div>
              )}
           </div>

           <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-eva-gold/5 border border-eva-gold/10">
              <AlertCircle className="w-4 h-4 text-eva-gold shrink-0 mt-0.5" />
              <p className="text-[10px] text-eva-txt-muted leading-relaxed italic font-medium">
                El precio calculado se basa en los parámetros de scoping actuales. Cualquier cambio en los factores α o β requiere una re-validación de la inversión.
              </p>
           </div>
        </Card>
      </div>
    </div>
  );
}
