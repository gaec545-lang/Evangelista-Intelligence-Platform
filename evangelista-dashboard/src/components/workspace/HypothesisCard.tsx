import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertTriangle, Edit2, Trash2, ChevronRight, GitCommit } from 'lucide-react';
import { Hypothesis, HypothesisStatus } from '../../lib/types';
import Card from '../ui/Card';

interface HypothesisCardProps {
  hypothesis: Hypothesis;
  onStatusChange: (id: string, status: HypothesisStatus) => void;
  onEdit: (h: Hypothesis) => void;
  onDelete: (id: string) => void;
  isDerived?: boolean;
}

const statusConfig: Record<HypothesisStatus, { label: string; color: string; bgColor: string }> = {
  planteada:      { label: 'Planteada',      color: 'text-eva-txt-muted',   bgColor: 'bg-eva-beige-2' },
  en_validacion:  { label: 'Validación',     color: 'text-eva-gold',        bgColor: 'bg-eva-gold/10' },
  validada:       { label: 'Validada',       color: 'text-service-sentinel', bgColor: 'bg-service-sentinel/10' },
  refutada:       { label: 'Refutada',       color: 'text-red-600',         bgColor: 'bg-red-50' },
  derivada:       { label: 'Derivada',       color: 'text-blue-600',        bgColor: 'bg-blue-50' },
};

const typeIcon: Record<string, any> = {
  problema:   Target,
  causa_raiz: TrendingUp,
  solucion:   TrendingUp,
  riesgo:     AlertTriangle,
  oportunidad: Target,
};

export default function HypothesisCard({ hypothesis, onStatusChange, onEdit, onDelete, isDerived }: HypothesisCardProps) {
  const status = statusConfig[hypothesis.status] || statusConfig.planteada;
  const Icon = typeIcon[hypothesis.hypothesis_type || 'problema'] || Target;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: isDerived ? 20 : 0 }}
      animate={{ opacity: 1, x: 0 }}
      className={`relative ${isDerived ? 'ml-8' : ''}`}
    >
      {isDerived && (
        <div className="absolute -left-6 top-0 bottom-0 w-px bg-eva-border">
           <div className="absolute top-8 left-0 w-6 h-px bg-eva-border" />
        </div>
      )}

      <Card className="p-5 bg-white border-eva-border hover:border-eva-olive hover:shadow-md transition-all shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
             <div className="px-2 py-1 rounded bg-eva-beige-2 text-[10px] font-mono font-bold text-eva-txt-faint uppercase">
                H-{hypothesis.id.slice(0,2).toUpperCase()}
             </div>
             <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-eva-olive/10 text-eva-olive text-[9px] font-bold uppercase tracking-widest shadow-sm">
                <Icon className="w-3 h-3" />
                {hypothesis.hypothesis_type?.replace('_', ' ') || 'General'}
             </div>
          </div>
          
          <div className="relative group">
            <button 
              className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm transition-all hover:brightness-95 ${status.bgColor} ${status.color}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_4px_currentColor]`} />
              {status.label}
            </button>
            
            <div className="absolute right-0 top-full mt-1 bg-white border border-eva-border rounded-lg shadow-xl py-1 z-10 hidden group-hover:block w-32 animate-in fade-in slide-in-from-top-1">
               {(['planteada', 'en_validacion', 'validada', 'refutada'] as HypothesisStatus[]).map(s => (
                 <button
                   key={s}
                   onClick={() => onStatusChange(hypothesis.id, s)}
                   className="w-full px-3 py-1.5 text-left text-[10px] font-bold uppercase tracking-widest text-eva-txt-muted hover:bg-eva-beige-2 hover:text-eva-black transition-colors"
                 >
                   {s.replace('_', ' ')}
                 </button>
               ))}
            </div>
          </div>
        </div>

        <h4 className="text-eva-black text-sm font-medium leading-relaxed mb-4 font-serif">
          {hypothesis.statement}
        </h4>

        <div className="space-y-3 pt-4 border-t border-eva-border">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[9px] font-bold uppercase tracking-widest text-eva-txt-faint">Impacto Estimado</p>
              <p className="text-xs text-eva-olive font-mono font-bold">
                {hypothesis.impact_score ? `$${hypothesis.impact_score.toLocaleString()} MXN` : '—'}
              </p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[9px] font-bold uppercase tracking-widest text-eva-txt-faint">Framework</p>
              <p className="text-[10px] text-eva-txt-muted font-bold font-mono">{hypothesis.framework_used || 'MECE'}</p>
            </div>
          </div>

          {hypothesis.evidence && (
             <div className="p-2.5 rounded bg-eva-beige-2/50 border border-eva-border">
                <p className="text-[9px] font-bold uppercase tracking-widest text-eva-txt-faint mb-1">Evidencia / Respaldo</p>
                <p className="text-[11px] text-eva-txt-muted italic line-clamp-2 leading-snug">{hypothesis.evidence}</p>
             </div>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(hypothesis)}
            className="p-1.5 text-eva-txt-faint hover:text-eva-olive transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => onDelete(hypothesis.id)}
            className="p-1.5 text-eva-txt-faint hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
