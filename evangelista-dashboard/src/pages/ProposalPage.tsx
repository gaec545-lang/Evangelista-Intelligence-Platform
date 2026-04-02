import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Copy, FileText, CheckCircle2, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Button from '../components/ui/Button'
import { ProposalForm } from '../components/ProposalForm'
import { api } from '../lib/api'
import { clientsDB } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

export function ProposalPage() {
  const [searchParams] = useSearchParams()
  const clientId = searchParams.get('client') ?? undefined

  const [clientData, setClientData] = useState<Partial<Record<string, string | number>> | null>(null)
  const [proposal, setProposal] = useState<string | null>(null)
  const [proposalType, setProposalType] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (clientId) {
      clientsDB
        .get(clientId)
        .then(c => {
          if (c)
            setClientData({
              client_name: c.name,
              sector: c.sector,
              sucursales: c.sucursales,
              sistemas_erp: c.sistemas_erp,
              erp_type: c.erp_type || 'SAP',
              city: c.city,
              contact_name: c.contact_name || '',
            })
        })
        .catch(console.error)
    }
  }, [clientId])

  const handleGenerate = async (data: Record<string, string | number>) => {
    setLoading(true)
    setError(null)
    try {
      const payload = { ...data, client_id: clientId }
      const result =
        data.type === 'foundation'
          ? await api.generateFoundation(payload)
          : await api.generateArchitecture(payload, [])
      setProposal(result.proposal)
      setProposalType(result.type)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error generando propuesta')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    if (!proposal) return
    await navigator.clipboard.writeText(proposal)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="space-y-1">
        <h1>Generador de propuestas</h1>
        <p className="max-w-xl">
          Propuestas Foundation &amp; Architecture con pricing basado en complejidad real.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-card border border-surface-border p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-accent-gold" />
              <p className="text-xs text-content-tertiary">Configuración</p>
            </div>
            <ProposalForm
              key={clientData ? 'loaded' : 'initial'}
              initialData={clientData ?? undefined}
              onGenerate={handleGenerate}
              loading={loading}
            />
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-xs text-red-600"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {proposal ? (
              <motion.div
                key="proposal"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <p className="text-sm text-content-secondary">Previsualización</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-content-tertiary">{proposalType}</span>
                    <Button variant="outline" size="sm" icon={<Copy size={14} />} onClick={copy}>
                      {copied ? '¡Copiado!' : 'Copiar'}
                    </Button>
                  </div>
                </div>
                <div className="bg-white rounded-card border border-surface-border p-8 space-y-6 overflow-y-auto max-h-[700px]">
                  <div className="prose prose-sm max-w-none prose-headings:text-content-primary prose-p:text-content-secondary prose-strong:text-primary-700 [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_hr]:border-surface-border">
                    <ReactMarkdown>{proposal}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-card border-2 border-dashed border-surface-border flex flex-col items-center justify-center text-center p-12 bg-surface/50 min-h-[500px]"
              >
                <FileText size={40} className="text-content-tertiary mb-4" />
                <p className="text-sm text-content-secondary mb-1">Esperando parámetros</p>
                <p className="text-xs text-content-tertiary max-w-xs">
                  Completa los datos del cliente para generar la propuesta.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
