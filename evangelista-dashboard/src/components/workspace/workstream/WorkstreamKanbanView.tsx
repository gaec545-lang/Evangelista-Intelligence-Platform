import React, { useState } from 'react';
import { Project, ProjectWorkstream, WorkstreamTask } from '../../../lib/types';
import TaskCard from './TaskCard';
import NewTaskModal from './NewTaskModal';

interface WorkstreamKanbanViewProps {
  project: Project;
  workstreams: ProjectWorkstream[];
  tasks: WorkstreamTask[];
  onTaskUpdate: () => void;
}

export default function WorkstreamKanbanView({ project, workstreams, tasks, onTaskUpdate }: WorkstreamKanbanViewProps) {
  const [showNewTaskModal, setShowNewTaskModal] = useState<string | null>(null);

  if (workstreams.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-eva-border rounded-xl">
        <p className="text-eva-txt-muted mb-4">No hay workstreams configurados en este proyecto.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 snap-x">
      {workstreams.map(ws => {
        const wsTasks = tasks.filter(t => t.workstream_id === ws.id);
        const inProgress = wsTasks.filter(t => t.status === 'en_progreso');
        const blocked = wsTasks.filter(t => t.status === 'bloqueada');
        const pending = wsTasks.filter(t => t.status === 'pendiente');
        const completed = wsTasks.filter(t => t.status === 'completada');

        return (
          <div key={ws.id} className="min-w-[320px] w-[320px] shrink-0 snap-start bg-white rounded-xl border border-eva-border shadow-sm flex flex-col h-[700px]">
            {/* Header */}
            <div 
              className="p-4 border-b border-eva-border relative overflow-hidden"
              style={{ borderTop: `4px solid ${ws.color}` }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-brand text-lg text-eva-black leading-tight">{ws.name}</h3>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                  ws.team_type === 'interno' ? 'bg-eva-olive/10 text-eva-olive' : 'bg-blue-500/10 text-blue-600'
                }`}>
                  {ws.team_type}
                </span>
              </div>
              
              {ws.contractor_name && (
                <p className="text-xs text-eva-txt-muted mb-3">{ws.contractor_name}</p>
              )}
              
              <div className="flex justify-between items-center text-xs mt-3">
                <div className="font-mono text-eva-txt-mid">
                  ${ws.budget_spent?.toLocaleString() || 0} / ${ws.budget_allocated?.toLocaleString() || 0}
                </div>
                <button 
                  onClick={() => setShowNewTaskModal(ws.id)}
                  className="text-eva-olive hover:text-eva-olive-3 font-medium transition-colors"
                >
                  + Tarea
                </button>
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-eva-beige/20">
              {/* En Progreso */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-eva-txt-mid tracking-wider uppercase">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  En Progreso ({inProgress.length})
                </div>
                {inProgress.map(t => <TaskCard key={t.id} task={t} color={ws.color} onUpdate={onTaskUpdate} />)}
              </div>

              {/* Bloqueadas */}
              {blocked.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-500 tracking-wider uppercase">
                    <span>⚠️</span> Bloqueadas ({blocked.length})
                  </div>
                  {blocked.map(t => <TaskCard key={t.id} task={t} color={ws.color} onUpdate={onTaskUpdate} />)}
                </div>
              )}

              {/* Pendientes */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-eva-txt-muted tracking-wider uppercase">
                  <span className="w-2 h-2 rounded-full border-2 border-eva-border"></span>
                  Pendientes ({pending.length})
                </div>
                {pending.map(t => <TaskCard key={t.id} task={t} color={ws.color} onUpdate={onTaskUpdate} />)}
              </div>
              
              {/* Completadas */}
              {completed.length > 0 && (
                <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2 text-xs font-bold text-green-600 tracking-wider uppercase">
                    <span>✓</span> Completadas ({completed.length})
                  </div>
                  {completed.map(t => <TaskCard key={t.id} task={t} color={ws.color} onUpdate={onTaskUpdate} />)}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {showNewTaskModal && (
        <NewTaskModal 
          projectId={project.id}
          workstreamId={showNewTaskModal}
          tasks={tasks}
          onClose={() => setShowNewTaskModal(null)}
          onSuccess={() => {
            setShowNewTaskModal(null);
            onTaskUpdate();
          }}
        />
      )}
    </div>
  );
}
