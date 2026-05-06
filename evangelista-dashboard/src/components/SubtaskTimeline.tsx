import { CheckCircle, Clock, AlertCircle, Loader } from 'lucide-react'

interface Subtask { id: string; agent: string; status: string; confidence: number; description?: string }

const agentColors: Record<string, string> = {
  financial: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  process: 'bg-[#95B877]/10 text-[#95B877] border-[#95B877]/20',
  data_engineer: 'bg-[#534ab7]/10 text-[#534ab7] border-[#534ab7]/20',
  analyst: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  risk: 'bg-red-500/10 text-red-500 border-red-500/20',
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'completed') return <CheckCircle size={16} className="text-[#95B877]" />
  if (status === 'failed') return <AlertCircle size={16} className="text-red-500" />
  if (status === 'executing') return <Loader size={16} className="text-[#95B877] animate-spin" />
  return <Clock size={16} className="text-[#A1A1A6]" />
}

export function SubtaskTimeline({ subtasks }: { subtasks: Subtask[] }) {
  return (
    <div className="space-y-3">
      {subtasks.map((st, i) => (
        <div key={st.id} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <StatusIcon status={st.status} />
            {i < subtasks.length - 1 && <div className="w-px h-6 bg-[rgba(255,255,255,0.08)] mt-1" />}
          </div>
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-medium px-2 py-0.5 rounded border ${agentColors[st.agent] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                {st.agent}
              </span>
              <span className="text-xs text-[#A1A1A6] capitalize">{st.status}</span>
              {st.status === 'completed' && <span className="text-xs text-[#A1A1A6]">{Math.round(st.confidence * 100)}%</span>}
            </div>
            {st.description && <p className="text-sm text-[#F5F5F7] mt-0.5 leading-snug">{st.description}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
