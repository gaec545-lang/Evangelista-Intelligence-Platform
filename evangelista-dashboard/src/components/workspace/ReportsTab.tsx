import React, { useState, useEffect } from 'react';
import { Project, ProjectReport } from '../../lib/types';
import { reportsDB } from '../../lib/supabase';
import { FileText, Plus, Lock, User } from 'lucide-react';
import Button from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import ReportCard from './reports/ReportCard';
import GenerateReportModal from './reports/GenerateReportModal';
import ReportViewerModal from './reports/ReportViewerModal';

interface ReportsTabProps {
  project: Project;
}

export default function ReportsTab({ project }: ReportsTabProps) {
  const [reports, setReports] = useState<ProjectReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'internal' | 'client'>('all');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [viewingReport, setViewingReport] = useState<ProjectReport | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data } = await reportsDB.getByProject(project.id);
      setReports(data || []);
    } catch (e) {
      console.error('Error loading reports:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [project.id]);

  const internalReports = reports.filter(r => !r.client_facing);
  const clientReports = reports.filter(r => r.client_facing);

  const renderList = (list: ProjectReport[]) => {
    if (list.length === 0) {
      return (
        <div className="py-10 border border-dashed border-eva-border rounded-lg text-center text-eva-txt-muted text-sm">
          No hay reportes en esta categoría.
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map(report => (
          <ReportCard 
            key={report.id} 
            report={report} 
            onView={() => setViewingReport(report)}
            onDownload={() => window.open(report.file_url, '_blank')}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="p-20 flex justify-center"><Spinner /></div>;
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-brand text-2xl text-eva-black">Reportes</h2>
          <p className="text-eva-txt-mid">Control interno y avances para el cliente</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-eva-beige-2 p-1 rounded-lg">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeFilter === 'all' ? 'bg-white text-eva-black shadow-sm' : 'text-eva-txt-muted'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveFilter('internal')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${activeFilter === 'internal' ? 'bg-white text-eva-black shadow-sm' : 'text-eva-txt-muted'}`}
            >
              <Lock size={14} /> Internos
            </button>
            <button
              onClick={() => setActiveFilter('client')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${activeFilter === 'client' ? 'bg-white text-eva-black shadow-sm' : 'text-eva-txt-muted'}`}
            >
              <User size={14} /> Cliente
            </button>
          </div>
          <Button variant="primary" onClick={() => setShowGenerateModal(true)}>
            <Plus size={16} className="mr-2" /> Generar Reporte
          </Button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="space-y-10">
        {(activeFilter === 'all' || activeFilter === 'internal') && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-eva-border pb-2">
              <Lock size={16} className="text-yellow-600" />
              <h3 className="font-brand text-lg text-eva-black">Reportes Internos</h3>
              <span className="text-xs text-eva-txt-faint ml-2">(Solo equipo Evangelista)</span>
            </div>
            {renderList(internalReports)}
          </section>
        )}

        {(activeFilter === 'all' || activeFilter === 'client') && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-eva-border pb-2">
              <User size={16} className="text-green-600" />
              <h3 className="font-brand text-lg text-eva-black">Reportes para el Cliente</h3>
              <span className="text-xs text-eva-txt-faint ml-2">(Visibles en portal de cliente si están enviados)</span>
            </div>
            {renderList(clientReports)}
          </section>
        )}
      </div>

      {showGenerateModal && (
        <GenerateReportModal 
          project={project}
          onClose={() => setShowGenerateModal(false)}
          onSuccess={() => {
            setShowGenerateModal(false);
            loadData();
          }}
        />
      )}

      {viewingReport && (
        <ReportViewerModal 
          report={viewingReport}
          onClose={() => setViewingReport(null)}
          onUpdate={loadData}
        />
      )}
    </div>
  );
}
