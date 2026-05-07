import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, User, FileText, ArrowRight, AlertTriangle } from 'lucide-react';
import { Project, ReportType } from '../../../lib/types';
import Button from '../../ui/Button';
import { workstreamsDB, tasksDB } from '../../../lib/supabase';

// Helper function to auto-compile data
const compileReportData = async (projectId: string, periodStart: string, periodEnd: string) => {
  const [{ data: workstreams }, { data: allTasks }] = await Promise.all([
    workstreamsDB.getByProject(projectId),
    tasksDB.getByProject(projectId),
  ]);

  const ws = workstreams ?? [];
  const tasks = allTasks ?? [];

  const completedThisPeriod = tasks.filter(t => 
    t.status === 'completada' && t.actual_end && t.actual_end >= periodStart && t.actual_end <= periodEnd
  );
  
  const blocked = tasks.filter(t => t.status === 'bloqueada');
  const criticalPending = tasks.filter(t => t.priority === 'critica' && !['completada', 'cancelada'].includes(t.status));
  
  const totalBudget = ws.reduce((sum, w) => sum + (w.budget_allocated ?? 0), 0);
  const totalSpent = ws.reduce((sum, w) => sum + (w.budget_spent ?? 0), 0);

  let weightedProgress = 0;
  if (totalBudget > 0) {
    for (const w of ws) {
      const wTasks = tasks.filter(t => t.workstream_id === w.id);
      if (wTasks.length === 0) continue;
      const wsProgress = wTasks.reduce((sum, t) => sum + t.progress_pct, 0) / wTasks.length;
      const weight = (w.budget_allocated ?? 0) / totalBudget;
      weightedProgress += wsProgress * weight;
    }
  } else if (tasks.length > 0) {
    weightedProgress = tasks.reduce((sum, t) => sum + t.progress_pct, 0) / tasks.length;
  }

  const budgetStatus = totalBudget === 0 ? 'en_presupuesto' : 
                       (totalSpent / totalBudget > 1.05) ? 'sobrepasado' :
                       (totalSpent / totalBudget > 0.90) ? 'riesgo' : 'en_presupuesto';

  return {
    globalProgress: Math.round(weightedProgress),
    completedThisPeriod: completedThisPeriod.map(t => t.name),
    blocked: blocked.map(t => ({ name: t.name, reason: t.blocker_description })),
    criticalPending: criticalPending.map(t => t.name),
    totalBudget,
    totalSpent,
    budgetStatus,
    budgetPct: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0,
  };
};

interface GenerateReportModalProps {
  project: Project;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GenerateReportModal({ project, onClose, onSuccess }: GenerateReportModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [reportType, setReportType] = useState<ReportType | null>(null);
  const [clientFacing, setClientFacing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form Data
  const [periodStart, setPeriodStart] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().split('T')[0];
  });
  const [periodEnd, setPeriodEnd] = useState(() => new Date().toISOString().split('T')[0]);
  
  const [compiledData, setCompiledData] = useState<any>(null);
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [reportedProgress, setReportedProgress] = useState(0);
  const [reportedStatus, setReportedStatus] = useState('Según plan');

  const handleSelectType = (type: ReportType, isClient: boolean) => {
    setReportType(type);
    setClientFacing(isClient);
    loadCompiledData(periodStart, periodEnd);
    setStep(2);
  };

  const loadCompiledData = async (start: string, end: string) => {
    const data = await compileReportData(project.id, start, end);
    setCompiledData(data);
    setReportedProgress(data.globalProgress); // Default
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const payload = {
        project_id: project.id,
        report_type: reportType,
        client_facing: clientFacing,
        variables: {
          title: `Reporte - ${reportType?.replace(/_/g, ' ')}`,
          executive_summary: executiveSummary,
          period_start: periodStart,
          period_end: periodEnd,
          overall_progress_pct: reportedProgress,
          status: reportedStatus,
          completed_items: compiledData?.completedThisPeriod || [],
          // Solo si es interno enviamos info de bloqueos o presupuestos sensibles
          ...(clientFacing ? {} : {
            blocked_items: compiledData?.blocked || [],
            critical_pending: compiledData?.criticalPending || [],
            budget_spent: compiledData?.totalSpent || 0,
            budget_allocated: compiledData?.totalBudget || 0,
          })
        }
      };

      // Call python backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/documents/generate-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Fallo en la generación del reporte desde el backend python');
      }

      onSuccess();
    } catch (e) {
      console.error(e);
      alert('Error al generar el reporte. ¿Está corriendo el backend python en el puerto 8001?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-eva-black/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-white rounded-2xl shadow-modal w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {step === 1 && (
            <>
              <div className="px-6 py-4 border-b border-eva-border flex justify-between items-center bg-eva-beige/30">
                <h2 className="text-xl font-brand text-eva-black">Generar Reporte</h2>
                <button onClick={onClose} className="p-2 text-eva-txt-muted hover:text-eva-black hover:bg-eva-beige-2 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto space-y-8">
                
                {/* Internos */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-eva-txt-muted font-bold mb-4 flex items-center gap-2">
                    <Lock size={14} className="text-yellow-600" /> Reportes Internos (No visibles para el cliente)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={() => handleSelectType('sincronizacion_interna', false)} className="p-4 border border-eva-border rounded-xl text-left hover:border-yellow-500 hover:bg-yellow-50/20 transition-all group">
                      <Lock size={16} className="text-yellow-600 mb-2" />
                      <h4 className="font-bold text-eva-black text-sm mb-1 group-hover:text-yellow-700">Sync Semanal Interna</h4>
                      <p className="text-xs text-eva-txt-muted">Progreso crudo, bloqueos y presupuesto.</p>
                    </button>
                    <button onClick={() => handleSelectType('reporte_financiero', false)} className="p-4 border border-eva-border rounded-xl text-left hover:border-yellow-500 hover:bg-yellow-50/20 transition-all group">
                      <Lock size={16} className="text-yellow-600 mb-2" />
                      <h4 className="font-bold text-eva-black text-sm mb-1 group-hover:text-yellow-700">Reporte Financiero</h4>
                      <p className="text-xs text-eva-txt-muted">Márgenes y costos de subcontratistas.</p>
                    </button>
                    <button onClick={() => handleSelectType('risk_log', false)} className="p-4 border border-eva-border rounded-xl text-left hover:border-yellow-500 hover:bg-yellow-50/20 transition-all group">
                      <Lock size={16} className="text-yellow-600 mb-2" />
                      <h4 className="font-bold text-eva-black text-sm mb-1 group-hover:text-yellow-700">Risk Log</h4>
                      <p className="text-xs text-eva-txt-muted">Registro de riesgos no presentados al cliente.</p>
                    </button>
                  </div>
                </div>

                {/* Cliente */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-eva-txt-muted font-bold mb-4 flex items-center gap-2">
                    <User size={14} className="text-green-600" /> Reportes para el Cliente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={() => handleSelectType('avance_ejecutivo', true)} className="p-4 border border-eva-border rounded-xl text-left hover:border-green-500 hover:bg-green-50/20 transition-all group">
                      <User size={16} className="text-green-600 mb-2" />
                      <h4 className="font-bold text-eva-black text-sm mb-1 group-hover:text-green-700">Avance Ejecutivo</h4>
                      <p className="text-xs text-eva-txt-muted">Curado para dirección. Omite bloqueos técnicos menores.</p>
                    </button>
                    <button onClick={() => handleSelectType('entregable_parcial', true)} className="p-4 border border-eva-border rounded-xl text-left hover:border-green-500 hover:bg-green-50/20 transition-all group">
                      <FileText size={16} className="text-green-600 mb-2" />
                      <h4 className="font-bold text-eva-black text-sm mb-1 group-hover:text-green-700">Entregable Parcial</h4>
                      <p className="text-xs text-eva-txt-muted">Conclusión de una fase o sprint.</p>
                    </button>
                    <button onClick={() => handleSelectType('reporte_final', true)} className="p-4 border border-eva-border rounded-xl text-left hover:border-green-500 hover:bg-green-50/20 transition-all group">
                      <FileText size={16} className="text-green-600 mb-2" />
                      <h4 className="font-bold text-eva-black text-sm mb-1 group-hover:text-green-700">Reporte Final</h4>
                      <p className="text-xs text-eva-txt-muted">Cierre del proyecto y resultados.</p>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="px-6 py-4 border-b border-eva-border flex justify-between items-center bg-eva-beige/30">
                <div>
                  <h2 className="text-xl font-brand text-eva-black mb-1">
                    {reportType?.replace(/_/g, ' ')}
                  </h2>
                  <div className="flex items-center gap-2 text-xs">
                    {clientFacing ? (
                      <span className="text-green-700 font-bold uppercase">👤 Visible para el cliente</span>
                    ) : (
                      <span className="text-yellow-700 font-bold uppercase">🔒 Reporte interno</span>
                    )}
                  </div>
                </div>
                <button onClick={() => setStep(1)} className="p-2 text-eva-txt-muted hover:text-eva-black hover:bg-eva-beige-2 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-eva-txt-mid mb-1">Período Del</label>
                    <input 
                      type="date" 
                      value={periodStart} 
                      onChange={e => { setPeriodStart(e.target.value); loadCompiledData(e.target.value, periodEnd); }}
                      className="w-full px-3 py-2 rounded-md border border-eva-border outline-none text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-eva-txt-mid mb-1">Al</label>
                    <input 
                      type="date" 
                      value={periodEnd} 
                      onChange={e => { setPeriodEnd(e.target.value); loadCompiledData(periodStart, e.target.value); }}
                      className="w-full px-3 py-2 rounded-md border border-eva-border outline-none text-sm"
                    />
                  </div>
                </div>

                {!compiledData ? (
                  <div className="py-10 text-center"><span className="text-eva-txt-muted text-sm">Compilando datos del proyecto...</span></div>
                ) : (
                  <>
                    <div className="bg-eva-beige/20 border border-eva-border rounded-lg p-4 space-y-4">
                      <h3 className="text-sm font-bold text-eva-black mb-2">Datos Auto-calculados</h3>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="block text-xs font-medium text-eva-txt-mid mb-1">Progreso reportado (%)</label>
                          <input 
                            type="number" 
                            value={reportedProgress}
                            onChange={e => setReportedProgress(Number(e.target.value))}
                            className="w-24 px-3 py-1.5 rounded-md border border-eva-border outline-none font-mono"
                          />
                          {clientFacing && (
                            <p className="text-[10px] text-eva-txt-muted mt-1 italic">
                              * El progreso interno crudo es {compiledData.globalProgress}%. Ajusta si es necesario.
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-eva-txt-mid mb-1">Estado</label>
                          <select 
                            value={reportedStatus}
                            onChange={e => setReportedStatus(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-md border border-eva-border outline-none bg-white"
                          >
                            <option>Según plan</option>
                            <option>Con retraso menor</option>
                            <option>En riesgo</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs font-medium text-eva-txt-mid">Completado este período ({compiledData.completedThisPeriod.length})</span>
                        <ul className="list-disc pl-4 text-xs text-eva-black">
                          {compiledData.completedThisPeriod.length > 0 
                            ? compiledData.completedThisPeriod.map((t: string, i: number) => <li key={i}>{t}</li>)
                            : <li className="text-eva-txt-faint italic">Ninguna tarea finalizada</li>}
                        </ul>
                      </div>

                      {!clientFacing && (
                        <div className="space-y-3 pt-3 border-t border-eva-border">
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                              <AlertTriangle size={12} /> Tareas bloqueadas ({compiledData.blocked.length})
                            </span>
                            <ul className="list-disc pl-4 text-xs text-red-700">
                              {compiledData.blocked.map((t: any, i: number) => (
                                <li key={i}>{t.name} <span className="opacity-70">— {t.reason}</span></li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="flex gap-4 text-xs font-mono">
                            <div>
                              <span className="block text-eva-txt-faint mb-0.5">Gastado</span>
                              ${compiledData.totalSpent.toLocaleString()}
                            </div>
                            <div>
                              <span className="block text-eva-txt-faint mb-0.5">Presupuesto</span>
                              ${compiledData.totalBudget.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-eva-txt-mid mb-2">
                        {clientFacing ? 'Mensaje del Director / Resumen Ejecutivo' : 'Notas internas y contexto'}
                      </label>
                      <textarea 
                        rows={4}
                        value={executiveSummary}
                        onChange={e => setExecutiveSummary(e.target.value)}
                        placeholder="Escribe el resumen ejecutivo aquí..."
                        className="w-full px-4 py-3 rounded-lg border border-eva-border outline-none focus:border-eva-olive resize-none text-sm"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="px-6 py-4 border-t border-eva-border bg-eva-beige/30 flex justify-between items-center">
                <Button variant="outline" onClick={() => setStep(1)} disabled={loading}>
                  Volver
                </Button>
                <Button variant="primary" onClick={handleGenerate} disabled={loading || !compiledData}>
                  {loading ? 'Generando DOCX...' : 'Generar Reporte'} <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
