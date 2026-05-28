import React from 'react';
import { ProjectReport } from '../../../lib/types';
import { Lock, User, Download, Eye, FileText, CheckCircle } from 'lucide-react';
import Button from '../../ui/Button';

interface ReportCardProps {
  report: ProjectReport;
  onView: () => void;
  onDownload: () => void;
}

export default function ReportCard({ report, onView, onDownload }: ReportCardProps) {
  const isInternal = !report.client_facing;

  return (
    <div className={`bg-[var(--eva-surface)] rounded-xl p-5 shadow-sm border-l-4 transition-shadow hover:shadow-md ${
      isInternal ? 'border-yellow-500 border-t border-r border-b border-y-eva-border border-r-eva-border bg-yellow-500/10' : 
                   'border-green-500 border-t border-r border-b border-y-eva-border border-r-eva-border'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {isInternal ? (
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded">
              <Lock size={10} /> Interno
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded">
              <User size={10} /> Cliente
            </span>
          )}
          <span className="text-xs text-eva-txt-muted flex items-center gap-1">
            <FileText size={12} /> {report.report_type.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <h4 className="font-brand text-lg text-[var(--eva-txt-primary)] mb-1 leading-tight">{report.title}</h4>
      
      <p className="text-xs text-eva-txt-mid mb-4">
        {new Date(report.created_at).toLocaleDateString()}
        {report.period_start && report.period_end && ` · Período: ${new Date(report.period_start).toLocaleDateString()} al ${new Date(report.period_end).toLocaleDateString()}`}
      </p>

      <div className="space-y-1 mb-4">
        {report.overall_progress_pct !== undefined && (
          <div className="flex items-center gap-2 text-xs text-eva-txt-mid">
            <span className="w-16">Progreso:</span>
            <div className="flex-1 h-1.5 bg-eva-beige-2 rounded-full overflow-hidden">
              <div 
                className={`h-full ${isInternal ? 'bg-yellow-500' : 'bg-green-500'}`} 
                style={{ width: `${report.overall_progress_pct}%` }} 
              />
            </div>
            <span className="font-mono">{report.overall_progress_pct}%</span>
          </div>
        )}
        
        {report.budget_status && isInternal && (
          <div className="flex items-center gap-2 text-xs text-eva-txt-mid">
            <span className="w-16">Budget:</span>
            <span className={
              report.budget_status === 'en_presupuesto' ? 'text-green-600' :
              report.budget_status === 'riesgo' ? 'text-yellow-600' : 'text-red-600'
            }>
              {report.budget_status === 'en_presupuesto' ? '✅ En presupuesto' : 
               report.budget_status === 'riesgo' ? '⚠️ En riesgo' : '❌ Sobrepasado'}
            </span>
          </div>
        )}
        
        {report.status === 'enviado_cliente' && !isInternal && (
          <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
            <CheckCircle size={12} /> Enviado al cliente
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-3 border-t border-eva-border/50">
        <Button variant="outline" size="sm" onClick={onView} className="text-xs py-1 px-3">
          <Eye size={14} className="mr-1.5" /> Ver
        </Button>
        {report.file_url && (
          <Button variant="outline" size="sm" onClick={onDownload} className="text-xs py-1 px-3 text-eva-olive hover:border-eva-olive">
            <Download size={14} className="mr-1.5" /> PDF
          </Button>
        )}
      </div>
    </div>
  );
}
