import React, { useState, useEffect } from 'react';
import { Kanban, List, Plus } from 'lucide-react';
import { Project, ProjectWorkstream, WorkstreamTask } from '../../lib/types';
import { workstreamsDB, tasksDB } from '../../lib/supabase';
import Button from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import WorkstreamKanbanView from './workstream/WorkstreamKanbanView';
import WorkstreamTimelineView from './workstream/WorkstreamTimelineView';
import NewWorkstreamModal from './workstream/NewWorkstreamModal';

interface WorkstreamTabProps {
  project: Project;
}

export default function WorkstreamTab({ project }: WorkstreamTabProps) {
  const [view, setView] = useState<'kanban' | 'timeline'>('kanban');
  const [workstreams, setWorkstreams] = useState<ProjectWorkstream[]>([]);
  const [tasks, setTasks] = useState<WorkstreamTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewWorkstreamModal, setShowNewWorkstreamModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [project.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: wsData }, { data: tData }] = await Promise.all([
        workstreamsDB.getByProject(project.id),
        tasksDB.getByProject(project.id)
      ]);
      setWorkstreams(wsData || []);
      setTasks(tData || []);
    } catch (e) {
      console.error('Error loading workstreams:', e);
    } finally {
      setLoading(false);
    }
  };

  const calculateGlobalProgress = () => {
    if (tasks.length === 0) return 0;
    const totalBudget = workstreams.reduce((sum, ws) => sum + (ws.budget_allocated ?? 0), 0);
    
    if (totalBudget === 0) {
      return Math.round(tasks.reduce((sum, t) => sum + t.progress_pct, 0) / tasks.length);
    }
    
    let weightedProgress = 0;
    for (const ws of workstreams) {
      const wsTasks = tasks.filter(t => t.workstream_id === ws.id);
      if (wsTasks.length === 0) continue;
      const wsProgress = wsTasks.reduce((sum, t) => sum + t.progress_pct, 0) / wsTasks.length;
      const weight = (ws.budget_allocated ?? 0) / totalBudget;
      weightedProgress += wsProgress * weight;
    }
    return Math.round(weightedProgress);
  };

  const totalBudgetAllocated = workstreams.reduce((s, ws) => s + (ws.budget_allocated ?? 0), 0);
  const totalBudgetSpent = workstreams.reduce((s, ws) => s + (ws.budget_spent ?? 0), 0);
  const globalProgress = calculateGlobalProgress();
  const delayedTasks = tasks.filter(t => t.planned_end && new Date(t.planned_end) < new Date() && t.status !== 'completada');

  if (loading) {
    return <div className="p-20 flex justify-center"><Spinner /></div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER & SUMMARY */}
      <div className="bg-white border border-eva-border rounded-xl p-6 shadow-card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-brand text-2xl text-eva-black">Workstreams & Cronograma</h2>
            <p className="text-eva-txt-mid">Coordinación multi-equipo y seguimiento de tareas</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-eva-beige-2 p-1 rounded-lg">
              <button
                onClick={() => setView('kanban')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  view === 'kanban' ? 'bg-white text-eva-black shadow-sm' : 'text-eva-txt-muted hover:text-eva-black'
                }`}
              >
                <Kanban size={16} /> Kanban
              </button>
              <button
                onClick={() => setView('timeline')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  view === 'timeline' ? 'bg-white text-eva-black shadow-sm' : 'text-eva-txt-muted hover:text-eva-black'
                }`}
              >
                <List size={16} /> Timeline
              </button>
            </div>
            <Button variant="primary" onClick={() => setShowNewWorkstreamModal(true)}>
              <Plus size={16} className="mr-2" /> Workstream
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-eva-txt-mid">Progreso Global</span>
              <span className="font-mono text-eva-black">{globalProgress}%</span>
            </div>
            <div className="w-full h-2 bg-eva-beige-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-eva-olive transition-all duration-1000"
                style={{ width: `${globalProgress}%` }}
              />
            </div>
            <div className="mt-4 flex gap-6 text-sm">
              <div>
                <span className="block text-eva-txt-faint uppercase tracking-wider text-xs">Presupuesto Asignado</span>
                <span className="font-mono text-eva-black font-medium">${totalBudgetAllocated.toLocaleString()} MXN</span>
              </div>
              <div>
                <span className="block text-eva-txt-faint uppercase tracking-wider text-xs">Gasto Actual</span>
                <span className="font-mono text-eva-black font-medium">${totalBudgetSpent.toLocaleString()} MXN</span>
              </div>
            </div>
          </div>
          
          <div className="bg-eva-beige/50 rounded-lg p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              <span className="text-sm font-medium text-eva-black">Estado del Proyecto</span>
            </div>
            <p className="text-sm text-eva-txt-mid">
              {delayedTasks.length > 0 
                ? <span className="text-red-500 font-medium">{delayedTasks.length} tareas retrasadas</span>
                : <span className="text-green-600 font-medium">En tiempo</span>
              }
              {' · '}
              {tasks.filter(t => t.status === 'bloqueada').length} bloqueadas
            </p>
          </div>
        </div>
      </div>

      {/* VIEW CONTENT */}
      {view === 'kanban' ? (
        <WorkstreamKanbanView 
          project={project} 
          workstreams={workstreams} 
          tasks={tasks}
          onTaskUpdate={loadData}
        />
      ) : (
        <WorkstreamTimelineView 
          workstreams={workstreams} 
          tasks={tasks} 
        />
      )}

      {showNewWorkstreamModal && (
        <NewWorkstreamModal
          projectId={project.id}
          onClose={() => setShowNewWorkstreamModal(false)}
          onSuccess={() => {
            setShowNewWorkstreamModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}
