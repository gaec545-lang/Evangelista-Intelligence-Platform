import { Card } from './ui/Card'

interface SearchResult {
  chunk_id?: string
  document_title?: string
  section_header?: string
  content?: string
  score?: number
  metadata?: Record<string, unknown>
}

export function SearchResults({ results }: { results: SearchResult[] }) {
  if (!results.length) return null
  return (
    <div className="space-y-3">
      {results.map((r, i) => (
        <Card key={r.chunk_id ?? i} className="hover:border-eva-olive/30 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-medium text-eva-charcoal text-sm">{r.document_title ?? 'Sin título'}</p>
              <p className="text-xs text-eva-warm-gray">{r.section_header}</p>
            </div>
            {r.score != null && (
              <span className="text-xs font-medium text-eva-olive bg-eva-olive/10 px-2 py-0.5 rounded">
                {Math.round(r.score * 100)}%
              </span>
            )}
          </div>
          <p className="text-sm text-eva-charcoal/80 leading-relaxed">{r.content?.slice(0, 300)}...</p>
          {r.metadata?.type && <p className="text-xs text-eva-warm-gray mt-2">Tipo: {String(r.metadata.type)}</p>}
        </Card>
      ))}
    </div>
  )
}
