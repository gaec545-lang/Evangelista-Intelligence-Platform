import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, FolderX, Zap, ArrowRight, FileCheck, ShieldCheck } from 'lucide-react';
import { useProject } from '../hooks/useProjects';
import { clientsDB } from '../lib/supabase';
import WorkspaceHeader from '../components/workspace/WorkspaceHeader';
import WorkspaceTabNav, { WorkspaceTab } from '../components/workspace/WorkspaceTabNav';
import WorkspaceStatusBar from '../components/workspace/WorkspaceStatusBar';
import { Spinner } from '../components/ui/Spinner';
import Button from '../components/ui/Button';

// Tabs
import ProposalTab from '../components/workspace/tabs/ProposalTab';
import ScopingTab from '../components/workspace/tabs/ScopingTab';
import WorkstreamTab from '../components/workspace/WorkstreamTab';
import DataTab from '../components/workspace/tabs/DataTab';
import AnalysisTab from '../components/workspace/tabs/AnalysisTab';
import DeliverablesTab from '../components/workspace/tabs/DeliverablesTab';
import ReportsTab from '../components/workspace/ReportsTab';
import AITab from '../components/workspace/tabs/AITab';
import ContractTab from '../components/workspace/tabs/ContractTab';
import ClosureTab from '../components/workspace/tabs/ClosureTab';

const ProjectWorkspacePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { project, phases, loading, reload } = useProject(projectId);
  const [client, setClient] = useState<any>(null);

  const activeTab = (searchParams.get('tab') as WorkspaceTab) || 'scoping';

  useEffect(() => {
    async function fetchClient() {
      if (project) {
        const data = await clientsDB.get(project.client_id);
        if (data) setClient(data);
      }
    }
    fetchClient();
  }, [project]);

  useEffect(() => {
    if (project?.name) {
      document.title = `${project.name} | EIP`;
    }
  }, [project?.name]);

  if (loading) return (
    <div className="min-h-screen bg-eva-beige flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-eva-beige flex flex-col items-center justify-center p-6 text-center">
      <FolderX className="w-16 h-16 text-eva-txt-faint mb-6" />
      <h2 className="text-2xl font-serif text-eva-black mb-2">Proyecto no encontrado</h2>
      <p className="text-eva-txt-muted max-w-sm mb-8">El proyecto que buscas no existe o no tienes los permisos necesarios para acceder.</p>
      <Button variant="outline" onClick={() => navigate('/dashboard/projects')}>Volver a Proyectos</Button>
    </div>
  );

  const handleTabChange = (tab: WorkspaceTab) => {
    setSearchParams({ tab });
  };

  const tabContent: Record<WorkspaceTab, React.ReactNode> = {
    propuesta: <ProposalTab project={project} />,
    scoping: <ScopingTab project={project} />,
    workstreams: <WorkstreamTab project={project} />,
    datos: <DataTab project={project} />,
    analisis: <AnalysisTab project={project} />,
    reportes: <ReportsTab project={project} />,
    entregables: <DeliverablesTab project={project} />,
    ia: <AITab project={project} />,
    contrato: <ContractTab project={project} />,
    cierre: <ClosureTab project={project} />,
  };

  return (
    <div className="min-h-screen bg-eva-beige text-eva-txt-dark pb-20">
      {/* Breadcrumb */}
      <div className="px-6 py-4 flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold text-eva-txt-faint border-b border-eva-border bg-white/50 backdrop-blur-sm">
        <button onClick={() => navigate('/dashboard/clients')} className="hover:text-eva-olive transition-colors">Clientes</button>
        <ChevronRight className="w-3 h-3" />
        <button onClick={() => navigate(`/dashboard/clients/${project.client_id}`)} className="hover:text-eva-olive transition-colors truncate max-w-[200px]">{client?.name || '...'}</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-eva-txt-muted truncate max-w-[200px]">{project.name}</span>
      </div>

      {/* Header */}
      <WorkspaceHeader project={project} onProjectUpdate={reload} />

      {/* Status Bar */}
      <WorkspaceStatusBar project={project} phases={phases} onUpdate={reload} />

      {/* Navigation */}
      <WorkspaceTabNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Content */}
      <main className="max-w-[1600px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 md:p-10"
          >
            {tabContent[activeTab]}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ALCOA+ Persistent Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 h-12 bg-white/80 backdrop-blur-xl border-t border-eva-border z-30 flex items-center px-6 justify-between text-[10px] text-eva-txt-muted uppercase tracking-[0.2em] font-bold shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-service-sentinel">
             <div className="w-1.5 h-1.5 rounded-full bg-service-sentinel shadow-[0_0_8px_rgba(13,97,77,0.3)] animate-pulse" />
             ALCOA+ Integrity: Verified
          </div>
          <div className="w-px h-3 bg-eva-border" />
          <div className="font-mono opacity-60">UUID: {project.id.toUpperCase()}</div>
        </div>
        <div className="hidden md:flex items-center gap-4">
           <span className="opacity-60">Vault Sync: Active</span>
           <div className="w-2 h-2 rounded-full bg-eva-olive/40" />
        </div>
      </footer>
    </div>
  );
};

export default ProjectWorkspacePage;
