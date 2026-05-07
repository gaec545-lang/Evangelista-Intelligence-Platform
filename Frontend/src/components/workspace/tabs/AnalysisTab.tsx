import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Plus, 
  FileText, 
  TrendingUp, 
  Search,
  Filter,
  Download,
  AlertCircle
} from 'lucide-react';
import { Project, Finding } from '../../../lib/types';
import { findingsDB, projectActivityLogDB } from '../../../lib/supabase';
import { api } from '../../../lib/api';
import { useAuthStore } from '../../../stores/authStore';
import Button from '../../ui/Button';
import { Spinner } from '../../ui/Spinner';
import Card from '../../ui/Card';
import FindingCard from '../FindingCard';
import { NewFindingModal } from '../NewFindingModal';
import VettingGatePanel from '../VettingGatePanel';

interface AnalysisTabProps {
  project: Project;
}

export default function AnalysisTab({ project }: AnalysisTabProps) {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingFinding, setEditingFinding] = useState<Finding | null>(null);
  
  const { user } = useAuthStore();

  const loadFindings = async () => {
    setLoading(true);
    try {
      const { data } = await findingsDB.getByProject(project.id);
      setFindings(data || []);
    } catch (error) {
      console.error('Error loading findings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFindings();
  }, [project.id]);

  const handleStatusChange = async (id: string, status: Finding['status']) => {
    try {
      await findingsDB.update(id, { status });
      await loadFindings();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteFinding = async (id: string) => {
    if (!window.confirm('¿Eliminar este hallazgo?')) return;
    try {
      await findingsDB.delete(id);
      await loadFindings();
    } catch (error) {
      console.error('Error deleting finding:', error);
    }
  };

  const totalImpact = findings.reduce((sum, f) => sum + (f.economic_impact ?? 0), 0);
  const quantifiedCount = findings.filter(f => (f.economic_impact ?? 0) > 0).length;

  const handleGenerateDictamen = async () => {
    setGenerating(true);
    try {
      // Usar el endpoint existente con template de dictamen
      const payload = {
        template: 'dictamen_forense',
        project_id: project.id,
        variables: {
          project_name: project.name,
          findings_count: findings.length,
          total_impact: totalImpact,
          date: new Date().toLocaleDateString('es-MX'),
          consultant: user?.email?.split('@')[0] || 'Adriel E.'
        }
      };

      await api.downloadDocument(payload.template, payload.variables);
      
      await projectActivityLogDB.log({
        project_id: project.id,
        action_type: 'document_generated',
        description: `Dictamen forense generado (${findings.length} hallazgos)`,
        performed_by_name: user?.email?.split('@')[0] || 'Consultor',
      });
    } catch (error) {
      console.error('Error generating dictamen:', error);
      alert('Error generando dictamen.');
    } finally {
      setGenerating(false);
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* HEADER Y ACCIONES */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-eva-olive/10 flex items-center justify-center border border-eva-olive/20 shadow-sm">
            <ShieldCheck className="w-6 h-6 text-eva-olive" />
          </div>
          <div>
            <h3 className="text-2xl font-serif text-eva-black">Análisis Forense</h3>
            <p className="text-sm text-eva-txt-muted font-medium">Evidencia técnica cuantificada y trazabilidad ALCOA+.</p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button 
            variant="outline" 
            onClick={handleGenerateDictamen}
            isLoading={generating}
            disabled={findings.length === 0}
            className="flex-1 md:flex-none border-eva-border bg-white text-eva-txt-mid text-[10px] uppercase tracking-widest font-bold shadow-sm"
          >
            <Download className="w-3.5 h-3.5 mr-2" />
            Generar Dictamen .docx
          </Button>
          <Button 
            variant="primary" 
            onClick={() => { setEditingFinding(null); setShowNewModal(true); }}
            className="flex-1 md:flex-none bg-eva-black text-white text-[10px] uppercase tracking-widest font-bold shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Registrar Hallazgo
          </Button>
        </div>
      </div>

      {/* LISTA DE HALLAZGOS */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 flex justify-center"><Spinner /></div>
        ) : findings.length === 0 ? (
          <Card className="py-24 text-center border-dashed border-eva-border bg-white/50 shadow-inner">
             <AlertCircle className="w-12 h-12 text-eva-txt-faint mx-auto mb-4" />
             <p className="text-sm text-eva-txt-muted mb-6 italic font-medium">No hay hallazgos registrados aún.</p>
             <Button variant="ghost" onClick={() => setShowNewModal(true)} className="text-eva-olive font-bold">
                Comenzar Análisis Forense →
             </Button>
          </Card>
        ) : (
          <div className="space-y-8">
             {findings.map(finding => (
               <FindingCard 
                 key={finding.id} 
                 finding={finding} 
                 onStatusChange={handleStatusChange}
                 onEdit={(f) => { setEditingFinding(f); setShowNewModal(true); }}
                 onDelete={handleDeleteFinding}
               />
             ))}

             {/* TOTALIZADOR */}
             <div className="mt-10 p-10 rounded-2xl bg-white border border-eva-border shadow-md flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                   <p className="text-eva-txt-muted font-medium text-sm mb-1">
                      <span className="font-bold text-eva-black">{quantifiedCount} de {findings.length}</span> hallazgos cuantificados
                   </p>
                   <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-eva-olive font-bold">
                      <TrendingUp className="w-3 h-3" /> Trazabilidad ALCOA+ Completa
                   </div>
                </div>
                <div className="text-center md:text-right">
                   <p className="text-[10px] uppercase tracking-widest text-eva-txt-faint font-bold mb-1">Impacto Total Estimado</p>
                   <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-serif text-eva-black font-bold">{formatCurrency(totalImpact)}</span>
                      <span className="text-sm text-eva-txt-faint font-bold font-mono">/ año</span>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* VETTING GATE */}
      {findings.length >= 1 && (
        <VettingGatePanel 
          project={project} 
          findings={findings} 
          onComplete={loadFindings}
        />
      )}

      {/* MODALS */}
      <NewFindingModal 
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        projectId={project.id}
        onSave={loadFindings}
        initialData={editingFinding}
        existingCount={findings.length}
      />
    </div>
  );
}
