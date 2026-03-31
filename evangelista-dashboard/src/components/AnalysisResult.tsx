import ReactMarkdown from 'react-markdown'
import { ConfidenceBadge } from './ConfidenceBadge'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'

interface Props {
  response: string
  confidence: number
  sources?: string[]
  errors?: string[]
  executionTimeMs?: number
}

/** Sanitiza hrefs — permite sólo https: y mailto: para prevenir javascript: URIs */
function SafeLink({ href, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const safe = href && (href.startsWith('https://') || href.startsWith('mailto:'))
  if (!safe) return <span>{children}</span>
  return <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>
}

export function AnalysisResult({ response, confidence, sources = [], errors = [], executionTimeMs }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <ConfidenceBadge value={confidence} />
        {executionTimeMs != null && <span className="text-xs text-eva-warm-gray">{(executionTimeMs / 1000).toFixed(1)}s</span>}
        {errors.length > 0 && <Badge variant="red">{errors.length} advertencia(s)</Badge>}
      </div>
      <Card>
        <div className="prose prose-sm max-w-none text-eva-charcoal [&_h2]:font-serif [&_h3]:font-serif">
          {/* disallowedElements bloquea tags peligrosos; skipHtml evita HTML crudo → XSS */}
          <ReactMarkdown
            skipHtml
            disallowedElements={['script', 'iframe', 'object', 'embed', 'form', 'input']}
            components={{ a: SafeLink }}
          >{response}</ReactMarkdown>
        </div>
      </Card>
      {sources.length > 0 && (
        <div>
          <p className="text-xs font-medium text-eva-warm-gray mb-2">Fuentes utilizadas</p>
          <div className="flex flex-wrap gap-1">{sources.map((s, i) => <Badge key={i} variant="gray">{s}</Badge>)}</div>
        </div>
      )}
      {errors.length > 0 && (
        <div className="rounded-lg bg-eva-red/5 border border-eva-red/20 p-3">
          <p className="text-xs font-medium text-eva-red mb-1">Advertencias</p>
          {errors.map((e, i) => <p key={i} className="text-xs text-eva-red/80">• {e}</p>)}
        </div>
      )}
    </div>
  )
}

