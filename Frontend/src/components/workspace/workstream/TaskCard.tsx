import React, { useState } from 'react';
import { WorkstreamTask } from '../../../lib/types';
import { Check, Clock, AlertTriangle, User, MoreVertical } from 'lucide-react';
import TaskDetailDrawer from './TaskDetailDrawer';

interface TaskCardProps {
  task: WorkstreamTask;
  color: string;
  onUpdate: () => void;
}

export default function TaskCard({ task, color, onUpdate }: TaskCardProps) {
  const [showDrawer, setShowDrawer] = useState(false);

  // Calculate days remaining
  const getDaysRemaining = (end?: string) => {
    if (!end) return null;
    const diffTime = new Date(end).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: `${Math.abs(diffDays)}d retraso`, color: 'text-red-400 bg-red-500/10 border border-red-500/20' };
    if (diffDays === 0) return { label: 'Hoy', color: 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20' };
    if (diffDays <= 3) return { label: `${diffDays}d restantes`, color: 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20' };
    return { label: `${diffDays}d restantes`, color: 'text-[var(--eva-txt-muted)] bg-[var(--eva-surface-2)] border border-[var(--eva-border)]' };
  };

  const days = getDaysRemaining(task.planned_end);
  const isBlocked = task.status === 'bloqueada';
  const isCompleted = task.status === 'completada';

  return (
    <>
      <div 
        onClick={() => setShowDrawer(true)}
        className={`bg-[var(--eva-surface)] border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group overflow-hidden ${
          isBlocked ? 'border-red-500/30 bg-red-500/10' : 
          isCompleted ? 'border-green-500/20 bg-green-500/10 opacity-70' : 
          'border-[var(--eva-border)]'
        }`}
      >
        {/* Left Color Accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 opacity-80" style={{ backgroundColor: color }} />

        <div className="flex justify-between items-start mb-2 pl-1">
          <div className="flex gap-2 items-center">
            {task.priority === 'critica' && (
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                Crítica
              </span>
            )}
            <span className="text-[10px] text-[var(--eva-txt-muted)] uppercase tracking-wider font-medium">
              {task.task_type || 'Tarea'}
            </span>
          </div>
          <button className="text-eva-txt-faint hover:text-[var(--eva-txt-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical size={14} />
          </button>
        </div>

        <h4 className={`text-sm font-medium mb-3 pl-1 leading-tight ${isCompleted ? 'line-through text-eva-txt-mid' : 'text-[var(--eva-txt-primary)]'}`}>
          {task.name}
        </h4>

        {isBlocked && task.blocker_description && (
          <div className="mb-3 pl-1 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded flex items-start gap-1.5">
            <AlertTriangle size={12} className="mt-0.5 shrink-0" />
            <span className="line-clamp-2">{task.blocker_description}</span>
          </div>
        )}

        <div className="mb-3 pl-1">
          <div className="flex justify-between text-[10px] text-eva-txt-muted mb-1">
            <span>Progreso</span>
            <span>{task.progress_pct}%</span>
          </div>
          <div className="w-full h-1.5 bg-eva-beige-2 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : isBlocked ? 'bg-red-400' : 'bg-blue-500'}`}
              style={{ width: `${task.progress_pct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pl-1">
          <div className="flex items-center gap-1.5 text-eva-txt-mid">
            <User size={12} />
            <span className="truncate max-w-[100px]">{task.responsible_name || 'Sin asignar'}</span>
          </div>
          
          {days && !isCompleted && (
            <div className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${days.color}`}>
              <Clock size={10} />
              {days.label}
            </div>
          )}
          {isCompleted && (
            <div className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded text-green-400 bg-green-500/10 border border-green-500/20">
              <Check size={10} /> Completada
            </div>
          )}
        </div>
      </div>

      <TaskDetailDrawer 
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        task={task}
        color={color}
        onUpdate={() => {
          onUpdate();
          setShowDrawer(false);
        }}
      />
    </>
  );
}
