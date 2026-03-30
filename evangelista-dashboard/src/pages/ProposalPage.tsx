import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Copy } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ProposalForm } from '../components/ProposalForm'
import { api } from '../lib/api'
import ReactMarkdown from 'react-markdown'

interface FormData {
  client_name: string
  sector: string
  sucursales: number
  sistemas_erp: number
  erp_type: string
  city: string
  registros: number
  contact_name: string
  type: 'foundation' | 'architecture'
}

export function ProposalPage() {
  const [searchParams] = useSearchParams()
  const clientId = searchParams.get('client') ?? undefined
  const [proposal, setProposal] = useState<string | null>(null)
  const [proposalType, setProposalType] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async (data: FormData) => {
    setLoading(true)
    setError(null)
    try {
      const payload = { ...data, client_id: clientId }
      const result = data.type === 'foundation'
        ? await api.generateFoundation(payload)
        : await api.generateArchitecture(payload, [])
      setProposal(result.proposal)
      setProposalType(result.type)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error generando propuesta')
    } finally {
      setLoading(false) }
  }

  const copy = async () => {
    if (!proposal) return
    await navigator.clipboard.writeText(proposal)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-eva-charcoal">Generador de Propuestas</h1>
        <p className="text-eva-warm-gray mt-1">Genera propuestas Foundation o Architecture con pricing real</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-serif font-semibold text-eva-charcoal mb-4">Datos del cliente</h2>
          <ProposalForm onGenerate={handleGenerate} loading={loading} />
          {error && <p className="text-sm text-eva-red mt-3">{error}</p>}
        </Card>
        <div className="space-y-3">
          {proposal ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="font-serif font-semibold text-eva-charcoal capitalize">Propuesta {proposalType}</h2>
                <Button variant="secondary" size="sm" onClick={copy}>
                  <Copy size={14} /> {copied ? '¡Copiado!' : 'Copiar'}
                </Button>
              </div>
              <Card>
                <div className="prose prose-sm max-w-none text-eva-charcoal [&_h1]:font-serif [&_h2]:font-serif overflow-y-auto max-h-[600px]">
                  <ReactMarkdown>{proposal}</ReactMarkdown>
                </div>
              </Card>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 rounded-xl border-2 border-dashed border-[var(--eva-border)]">
              <p className="text-sm text-eva-warm-gray">La propuesta aparecerá aquí</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
