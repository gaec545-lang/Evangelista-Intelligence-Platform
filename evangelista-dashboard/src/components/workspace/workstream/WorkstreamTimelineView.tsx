import React from 'react';
import { ProjectWorkstream, WorkstreamTask } from '../../../lib/types';
import { ChevronRight } from 'lucide-react';

interface WorkstreamTimelineViewProps {
  workstreams: ProjectWorkstream[];
  tasks: WorkstreamTask[];
}

export default function WorkstreamTimelineView({ workstreams, tasks }: WorkstreamTimelineViewProps) {
  // Simplification for the timeline view:
  // Instead of an actual date grid which is extremely complex without libraries,
  // we render a simplified horizontal representation grouped by workstream.

  if (workstreams.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-eva-border rounded-xl">
        <p className="text-eva-txt-muted mb-4">No hay workstreams configurados en este proyecto.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-eva-border overflow-hidden">
      <div className="p-4 border-b border-eva-border bg-eva-beige/30">
        <h3 className="font-brand text-lg text-eva-black">Timeline de Ejecución</h3>
        <p className="text-sm text-eva-txt-muted">Secuencia de tareas por equipo</p>
      </div>
      
      <div className="divide-y divide-eva-border">
        {workstreams.map(ws => {
          const wsTasks = tasks.filter(t => t.workstream_id === ws.id)
            .sort((a, b) => new Date(a.planned_start || '').getTime() - new Date(b.planned_start || '').getTime());

          return (
            <div key={ws.id} className="p-4 flex flex-col md:flex-row gap-6 hover:bg-eva-beige/10 transition-colors">
              
              {/* Workstream Info */}
              <div className="w-full md:w-48 shrink-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: ws.color }} />
                  <h4 className="font-bold text-eva-black text-sm">{ws.name}</h4>
                </div>
                <p className="text-xs text-eva-txt-muted ml-5">{ws.contractor_name || ws.team_type}</p>
              </div>

              {/* Tasks Flow */}
              <div className="flex-1 overflow-x-auto pb-2">
                <div className="flex items-center gap-2 min-w-max">
                  {wsTasks.length === 0 ? (
                    <span className="text-sm text-eva-txt-faint italic">Sin tareas asignadas</span>
                  ) : (
                    wsTasks.map((task, idx) => {
                      const isBlocked = task.status === 'bloqueada';
                      const isCompleted = task.status === 'completada';
                      const isProgress = task.status === 'en_progreso';
                      
                      const bgColor = isBlocked ? 'bg-red-50 border-red-200' :
                                      isCompleted ? 'bg-green-50 border-green-200 opacity-60' :
                                      isProgress ? 'bg-blue-50 border-blue-200' :
                                      'bg-white border-eva-border';

                      return (
                        <React.Fragment key={task.id}>
                          <div 
                            className={`px-3 py-2 border rounded-lg flex flex-col w-48 shrink-0 ${bgColor}`}
                            style={isProgress ? { borderTopWidth: 3, borderTopColor: ws.color } : undefined}
                          >
                            <span className="text-[10px] uppercase text-eva-txt-muted mb-1 truncate">
                              {task.planned_start ? new Date(task.planned_start).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : 'Sin fecha'}
                            </span>
                            <span className="text-sm font-medium text-eva-black truncate" title={task.name}>
                              {task.name}
                            </span>
                          </div>
                          
                          {idx < wsTasks.length - 1 && (
                            <ChevronRight size={16} className="text-eva-txt-faint shrink-0" />
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
