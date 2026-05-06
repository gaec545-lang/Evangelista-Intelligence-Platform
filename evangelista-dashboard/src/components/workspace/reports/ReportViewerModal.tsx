import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, User, Lock, Send } from 'lucide-react';
import { ProjectReport } from '../../../lib/types';
import { reportsDB } from '../../../lib/supabase';
import Button from '../../ui/Button';

interface ReportViewerModalProps {
  report: ProjectReport;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ReportViewerModal({ report, onClose, onUpdate }: ReportViewerModalProps) {
  const [loading, setLoading] = useState(false);
  const isInternal = !report.client_facing;

  const handleMarkAsSent = async () => {
    setLoading(true);
    try {
      await reportsDB.update(report.id, {
        status: 'enviado_cliente',
        sent_at: new Date().toISOString()
      });
      onUpdate();
      onClose();
    } catch (e) {
      console.error(e);
      alert('Error al actualizar el estado del reporte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-eva-black/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Top Bar */}
          <div className="px-6 py-4 border-b border-eva-border flex justify-between items-center bg-eva-black text-white">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-brand">{report.title}</h2>
              {isInternal ? (
                <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
                  <Lock size={12} /> Interno
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold bg-green-500/20 text-green-300 px-2 py-1 rounded">
                  <User size={12} /> Cliente
                </span>
              )}
            </div>
            <button onClick={onClose} className="p-2 text-eva-txt-faint hover:text-white rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Document Preview Area (Mock) */}
          <div className="flex-1 bg-eva-beige overflow-y-auto p-4 md:p-8 flex justify-center">
            {/* Render a mock visual of the document */}
            <div className="bg-white w-full max-w-[816px] min-h-[1056px] shadow-sm p-12 md:p-20 font-serif relative">
              {/* This is a visual representation, not the actual Word doc */}
              <div className="border-b-2 border-eva-olive pb-8 mb-8 flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-brand text-eva-black mb-2">{report.title}</h1>
                  <p className="text-eva-txt-mid">Evangelista & Co. Intelligence Platform</p>
                </div>
                <div className="text-right text-sm text-eva-txt-mid">
                  <p>Fecha: {new Date(report.generated_at).toLocaleDateString()}</p>
                  {report.period_start && <p>Período: {new Date(report.period_start).toLocaleDateString()} - {report.period_end ? new Date(report.period_end).toLocaleDateString() : ''}</p>}
                </div>
              </div>

              <div className="space-y-8">
                {report.executive_summary && (
                  <section>
                    <h2 className="text-xl font-brand text-eva-black mb-3">Resumen Ejecutivo</h2>
                    <p className="text-eva-txt-mid leading-relaxed whitespace-pre-wrap">{report.executive_summary}</p>
                  </section>
                )}

                {report.overall_progress_pct !== undefined && (
                  <section className="bg-eva-beige-2/50 p-6 rounded-lg">
                    <h2 className="text-sm uppercase tracking-widest font-bold text-eva-txt-mid mb-4">Métricas de Progreso</h2>
                    <div className="flex items-center gap-4">
                      <div className="w-full h-3 bg-eva-border rounded-full overflow-hidden">
                        <div className="h-full bg-eva-olive" style={{ width: `${report.overall_progress_pct}%` }} />
                      </div>
                      <span className="font-mono font-bold text-lg">{report.overall_progress_pct}%</span>
                    </div>
                  </section>
                )}

                {/* If the doc has compiled array content (like completed items) we'd render them here. 
                    Since it's in a JSONB, we just show a placeholder if we don't parse it specifically. */}
                <section>
                  <h2 className="text-xl font-brand text-eva-black mb-3">Detalle del Reporte</h2>
                  <div className="p-4 border border-dashed border-eva-border text-center text-eva-txt-muted text-sm">
                    Para ver el documento completo con tablas y formato oficial, por favor descarga el archivo DOCX/PDF.
                  </div>
                </section>
              </div>

            </div>
          </div>

          {/* Action Bar */}
          <div className="px-6 py-4 border-t border-eva-border bg-white flex justify-between items-center">
            <div className="text-sm text-eva-txt-muted">
              Estado actual: <span className="font-bold text-eva-black capitalize">{report.status.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex gap-3">
              {report.file_url ? (
                <Button variant="outline" onClick={() => window.open(report.file_url, '_blank')}>
                  <Download size={16} className="mr-2" /> Descargar DOCX
                </Button>
              ) : (
                <div className="text-sm text-red-500 py-2">Documento no disponible</div>
              )}
              
              {!isInternal && report.status !== 'enviado_cliente' && (
                <Button variant="primary" onClick={handleMarkAsSent} disabled={loading}>
                  {loading ? 'Marcando...' : <><Send size={16} className="mr-2" /> Marcar como Enviado</>}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
