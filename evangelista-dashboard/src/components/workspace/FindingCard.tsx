import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  ChevronRight, 
  ChevronDown, 
  Database, 
  Terminal, 
  ShieldCheck, 
  TrendingUp,
  FileText,
  Edit2,
  Trash2
} from 'lucide-react';
import { Finding } from '../../lib/types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface FindingCardProps {
  finding: Finding;
  onStatusChange: (id: string, status: Finding['status']) => void;
  onEdit: (f: Finding) => void;
  onDelete: (id: string) => void;
}

const severityConfig: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
  critico:     { label: 'CRÍTICO',     color: 'text-red-700',    bgColor: 'bg-red-50',         icon: '🔴' },
  alto:        { label: 'ALTO',        color: 'text-orange-700', bgColor: 'bg-orange-50',      icon: '🟠' },
  medio:       { label: 'MEDIO',       color: 'text-amber-700',  bgColor: 'bg-amber-50',       icon: '🟡' },
  bajo:        { label: 'BAJO',        color: 'text-blue-700',   bgColor: 'bg-blue-50',        icon: '🔵' },
  oportunidad: { label: 'OPORTUNIDAD', color: 'text-service-sentinel', bgColor: 'bg-service-sentinel/10', icon: '🟢' },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  identificado: { label: 'Identificado', color: 'text-eva-txt-faint' },
  validado:     { label: 'Validado ✓',    color: 'text-service-sentinel' },
  presentado:   { label: 'Presentado',   color: 'text-blue-600' },
  cerrado:      { label: 'Cerrado',      color: 'text-eva-txt-faint' },
};

export default function FindingCard({ finding, onStatusChange, onEdit, onDelete }: FindingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const severity = severityConfig[finding.severity] || severityConfig.medio;
  const status = statusConfig[finding.status] || statusConfig.identificado;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);

  return (
    <motion.div layout className="group">
      <Card className="bg-white border-eva-border hover:border-eva-olive hover:shadow-md transition-all overflow-hidden shadow-sm">
        <div className="p-5">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-mono text-eva-txt-faint font-bold uppercase tracking-widest">{finding.folio}</span>
                  <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest shadow-sm ${severity.bgColor} ${severity.color}`}>
                     {severity.label}
                  </div>
                  <span className="text-eva-txt-faint text-[10px]">•</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${status.color}`}>
                     {status.label}
                  </span>
               </div>
               <h4 className="text-eva-black font-serif text-lg leading-snug group-hover:text-eva-olive transition-colors font-bold">
                  {finding.title}
               </h4>
            </div>
            <div className="text-right">
               <p className="text-[9px] uppercase tracking-widest text-eva-txt-faint font-bold mb-1">Impacto Estimado</p>
               <p className="text-xl font-serif text-eva-olive font-bold">
                  {finding.economic_impact ? formatCurrency(finding.economic_impact) : '—'}
               </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
             <div className="flex items-center gap-4 text-[10px] text-eva-txt-muted uppercase tracking-widest font-bold font-mono">
                <span className="flex items-center gap-1.5"><Database className="w-3 h-3" /> {finding.area || 'General'}</span>
                <span className="flex items-center gap-1.5 text-service-sentinel"><ShieldCheck className="w-3 h-3" /> ALCOA+ Verified</span>
             </div>
             <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-full bg-eva-beige-2 hover:bg-eva-beige-3 text-eva-txt-muted transition-all shadow-sm"
             >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
             </button>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-6 space-y-6">
                  <div className="h-px bg-eva-border" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <h5 className="text-[10px] font-bold text-eva-txt-faint uppercase tracking-widest">Descripción Ejecutiva</h5>
                          <p className="text-sm text-eva-txt-mid leading-relaxed font-medium">{finding.description}</p>
                       </div>
                       <div className="space-y-2">
                          <h5 className="text-[10px] font-bold text-eva-txt-faint uppercase tracking-widest">Evidencia Cuantificada</h5>
                          <div className="p-3 rounded-lg bg-eva-beige-2 border border-eva-border space-y-2">
                             {finding.evidence ? (
                               <p className="text-xs text-eva-txt-mid italic leading-relaxed font-medium">{finding.evidence}</p>
                             ) : (
                               <p className="text-xs text-eva-txt-faint italic font-medium">Sin evidencia registrada.</p>
                             )}
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="space-y-2">
                          <h5 className="text-[10px] font-bold text-eva-txt-faint uppercase tracking-widest flex items-center gap-2">
                             <Terminal className="w-3 h-3" /> Descripción Técnica (CTO)
                          </h5>
                          <div className="p-4 rounded-lg bg-eva-black border border-eva-border font-mono text-[11px] text-eva-olive-2 leading-relaxed overflow-x-auto shadow-inner">
                             {finding.technical_description || '// Sin detalles técnicos registrados.'}
                          </div>
                       </div>
                       <div className="space-y-2">
                          <h5 className="text-[10px] font-bold text-eva-txt-faint uppercase tracking-widest flex items-center gap-2">
                             <ShieldCheck className="w-3 h-3" /> Trazabilidad ALCOA+
                          </h5>
                          <div className="text-[10px] space-y-1 font-mono text-eva-txt-muted font-bold">
                             <p><span className="text-eva-txt-faint">MD5:</span> {finding.hash_md5 || '—'}</p>
                             <p><span className="text-eva-txt-faint">GIT:</span> {finding.git_commit || '—'}</p>
                             <p><span className="text-eva-txt-faint">UTC:</span> {finding.captured_at ? new Date(finding.captured_at).toISOString() : '—'}</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-eva-olive/5 border border-eva-olive/10 flex items-center justify-between shadow-sm">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-eva-olive/10 flex items-center justify-center border border-eva-olive/20">
                           <TrendingUp className="w-4 h-4 text-eva-olive" />
                        </div>
                        <div>
                           <p className="text-[9px] font-bold text-eva-olive uppercase tracking-widest">Acción Recomendada</p>
                           <p className="text-xs text-eva-txt-muted font-bold">{finding.recommended_action || 'Pendiente por definir.'}</p>
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                     <div className="flex gap-2">
                        {['identificado', 'validado', 'presentado', 'cerrado'].map(s => (
                           <button
                             key={s}
                             onClick={() => onStatusChange(finding.id, s as any)}
                             className={`px-2.5 py-1 rounded text-[8px] font-bold uppercase tracking-widest border transition-all shadow-sm ${
                               finding.status === s 
                                 ? 'bg-eva-olive text-white border-eva-olive' 
                                 : 'bg-white border-eva-border text-eva-txt-faint hover:text-eva-txt-muted'
                             }`}
                           >
                              {s}
                           </button>
                        ))}
                     </div>
                     <div className="flex gap-1">
                        <button 
                          onClick={() => onEdit(finding)}
                          className="p-2 text-eva-txt-faint hover:text-eva-olive transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => onDelete(finding.id)}
                          className="p-2 text-eva-txt-faint hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                     </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}
