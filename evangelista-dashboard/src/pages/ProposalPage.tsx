import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Copy, FileText, Sparkles, AlertCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Button from '../components/ui/Button'
import { ProposalForm } from '../components/ProposalForm'
import { api } from '../lib/api'
import { clientsDB } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { agentActions } from '../lib/agentActions'

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

  const handleGenerate = async (data: any) => {
    setLoading(true)
    setError(null)
    try {
      const payload = { ...data, client_id: clientId }
      
      const result = data.type === 'foundation' 
        ? await api.generateFoundation({
            ...payload,
            name: data.client_name, // Mapping frontend field to backend expected field
          })
        : await api.generateArchitecture(payload, []) // For now empty hallazgos

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
          <div className="glass-strong rounded-card border border-white/[0.10] p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-accent-gold" />
              <p className="text-[10px] text-content-tertiary uppercase tracking-widest">Configuración</p>
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
                  className="text-xs text-danger flex items-center gap-1.5"
                >
                  <AlertCircle size={12} />
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
                    <div className="w-1.5 h-1.5 rounded-full bg-success/80" />
                    <p className="text-xs text-content-tertiary">Previsualización</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-content-tertiary uppercase tracking-widest">{proposalType}</span>
                    <Button variant="ghost" size="sm" onClick={copy}>
                      {copied ? '¡Copiado!' : 'Copiar'}
                    </Button>
                  </div>
                </div>
                <div
                  className="glass-strong rounded-card border border-white/[0.10] p-8 space-y-6 overflow-y-auto max-h-[700px]"
                >
                  <div
                    className="text-sm leading-relaxed [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:mb-4 [&_h1]:text-content-primary"
                  >
                    <ReactMarkdown>{proposal}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-card border border-dashed border-white/[0.08] flex flex-col items-center justify-center text-center p-12 min-h-[500px]"
                style={{ background: 'rgba(255,255,255,0.01)' }}
              >
                <FileText size={36} className="text-content-tertiary/30 mb-4" />
                <p className="text-sm text-content-tertiary mb-1">Esperando parámetros</p>
                <p className="text-xs text-content-tertiary/60 max-w-xs">
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
