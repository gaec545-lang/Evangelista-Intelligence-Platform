import { ConfidenceBadge } from './ConfidenceBadge'
import { Badge } from './ui/Badge'
import type { Analysis } from '../lib/types'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'hace un momento'
  if (m < 60) return `hace ${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `hace ${h}h`
  return `hace ${Math.floor(h / 24)}d`
}

export function HistoryList({ analyses, limit }: { analyses: Analysis[]; limit?: number }) {
  const items = limit ? analyses.slice(0, limit) : analyses
  if (!items.length) return <p className="text-sm text-eva-warm-gray py-4 text-center">Sin análisis registrados</p>
  return (
    <div className="space-y-2">
      {items.map(a => (
        <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-eva-cream/50 transition-colors">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-eva-charcoal truncate">{a.task}</p>
            <p className="text-xs text-eva-warm-gray mt-0.5">{timeAgo(a.created_at)}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {a.confidence != null && <ConfidenceBadge value={a.confidence} />}
            <Badge variant={a.status === 'completed' ? 'olive' : a.status === 'failed' ? 'red' : 'gray'}>{a.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
