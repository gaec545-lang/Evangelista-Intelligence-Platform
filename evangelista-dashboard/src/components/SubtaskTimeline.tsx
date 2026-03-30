import { CheckCircle, Clock, AlertCircle, Loader } from 'lucide-react'

interface Subtask { id: string; agent: string; status: string; confidence: number; description?: string }

const agentColors: Record<string, string> = {
  financial: 'bg-eva-gold/10 text-eva-gold border-eva-gold/20',
  process: 'bg-eva-olive/10 text-eva-olive border-eva-olive/20',
  data_engineer: 'bg-blue-50 text-blue-700 border-blue-200',
  analyst: 'bg-purple-50 text-purple-700 border-purple-200',
  risk: 'bg-eva-red/10 text-eva-red border-eva-red/20',
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'completed') return <CheckCircle size={16} className="text-green-600" />
  if (status === 'failed') return <AlertCircle size={16} className="text-eva-red" />
  if (status === 'executing') return <Loader size={16} className="text-eva-olive animate-spin" />
  return <Clock size={16} className="text-eva-warm-gray" />
}

export function SubtaskTimeline({ subtasks }: { subtasks: Subtask[] }) {
  return (
    <div className="space-y-3">
      {subtasks.map((st, i) => (
        <div key={st.id} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <StatusIcon status={st.status} />
            {i < subtasks.length - 1 && <div className="w-px h-6 bg-[var(--eva-border)] mt-1" />}
          </div>
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-medium px-2 py-0.5 rounded border ${agentColors[st.agent] ?? 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                {st.agent}
              </span>
              <span className="text-xs text-eva-warm-gray capitalize">{st.status}</span>
              {st.status === 'completed' && <span className="text-xs text-eva-warm-gray">{Math.round(st.confidence * 100)}%</span>}
            </div>
            {st.description && <p className="text-sm text-eva-charcoal mt-0.5 leading-snug">{st.description}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
