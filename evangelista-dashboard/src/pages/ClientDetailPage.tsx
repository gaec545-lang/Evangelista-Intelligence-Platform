import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  ArrowLeft, FileText, Building2, MapPin, Zap, Clock,
  Layers, TrendingUp, AlertCircle, Plus, Mail, Phone,
  Globe, Hash, Users, Briefcase, Edit3, CheckCircle2, Lock
} from 'lucide-react'
import { clientsDB } from '../lib/supabase'
import ProjectsTab from '../components/client/ProjectsTab'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Counter from '../components/ui/Counter'
import { HistoryList } from '../components/HistoryList'
import { AnalysisPanel } from '../components/AnalysisPanel'
import { useHistory } from '../hooks/useHistory'
import { Spinner } from '../components/ui/Spinner'
import type { Client } from '../lib/types'

type ClientTab = 'info' | 'proyectos' | 'actividad'

const TABS: { key: ClientTab; label: string; icon: React.ComponentType<any> }[] = [
  { key: 'info',       label: 'Ficha Empresarial', icon: Building2 },
  { key: 'proyectos',  label: 'Proyectos',          icon: Layers    },
  { key: 'actividad',  label: 'Historial IA',       icon: Clock     },
]

/* ─── Field display component ─── */
function InfoField({ label, value, icon: Icon }: { label: string; value?: string | number | null; icon?: React.ComponentType<any> }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-eva-txt-faint">{label}</p>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} className="text-eva-txt-muted flex-shrink-0" />}
        <p className="text-[14px] font-ui text-eva-txt-dark font-medium">
          {value ?? <span className="text-eva-txt-faint italic font-normal">Sin registrar</span>}
        </p>
      </div>
    </div>
  )
}

/* ─── MAIN PAGE ─── */
export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [client, setClient] = useState<Client | null>(null)
  const [activeTab, setActiveTab] = useState<ClientTab>('info')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { analyses, loading: loadingHistory, saveAnalysis } = useHistory(id)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    clientsDB.get(id)
      .then(data => { if (data) setClient(data); else setError('Cliente no encontrado.') })
      .catch(err => setError(err.message || 'Error de conexión'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (client?.name) document.title = `${client.name} | EIP`
  }, [client?.name])

  const handleComplete = async (r: { task: string; response: string; confidence: number }) => {
    if (!id) return
    await saveAnalysis({ client_id: id, task: r.task, final_response: r.response, confidence: r.confidence, status: 'completed' })
  }

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p className="text-xs text-eva-txt-muted">Cargando expediente…</p>
    </div>
  )

  if (error || !client) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="p-3 rounded-full bg-red-50 text-red-500"><AlertCircle size={32} /></div>
      <div className="text-center">
        <h3 className="text-lg font-brand text-eva-black">Error de Carga</h3>
        <p className="text-sm text-eva-txt-muted max-w-xs">{error || 'No se pudo cargar el expediente.'}</p>
      </div>
      <Button variant="outline" onClick={() => navigate('/dashboard/clients')}>Volver al Directorio</Button>
    </div>
  )

  return (
    <div className="space-y-0 animate-fade-in">

      {/* ── Header ── */}
      <div className="space-y-5 pb-6 border-b border-eva-border mb-0">
        <button
          onClick={() => navigate('/dashboard/clients')}
          className="flex items-center gap-2 text-xs text-eva-txt-muted hover:text-eva-olive transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Cartera Fiducia
        </button>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-eva-olive flex items-center justify-center text-eva-gold text-xl font-bold shadow-sm border border-eva-gold/20 flex-shrink-0">
              {client.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-brand font-medium text-eva-black">{client.name}</h1>
                <Badge variant={client.status === 'active' ? 'success' : 'warning'} size="sm">
                  {client.status}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs font-ui text-eva-txt-muted">
                <span className="flex items-center gap-1.5"><MapPin size={12} className="text-eva-olive/60" />{client.city}</span>
                <span className="w-1 h-1 rounded-full bg-eva-border" />
                <span className="capitalize">{client.sector}</span>
                {client.erp_type && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-eva-border" />
                    <span className="font-mono text-eva-txt-faint">{client.erp_type}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/templates?client=${id}`)} icon={<FileText size={14} />}>
              Expediente
            </Button>
            <Button size="sm" onClick={() => navigate(`/dashboard/proposals?client=${id}`)} icon={<Zap size={14} />}>
              Nueva Propuesta
            </Button>
          </div>
        </div>

        {/* Gamma ribbon */}
        <div className="flex items-center gap-6 pt-1">
          <div className="flex items-center gap-2 bg-eva-olive-light border border-eva-olive/15 rounded-full px-3 py-1">
            <span className="text-[10px] font-mono font-black text-eva-olive uppercase tracking-wider">Γ</span>
            <span className="text-[13px] font-mono font-bold text-eva-olive">{(client.factor_gamma ?? 0).toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-eva-txt-faint">
            <Counter target={client.sucursales} />
            <span>sucursales</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-eva-txt-faint">
            <Counter target={analyses.length} />
            <span>análisis IA</span>
          </div>
        </div>
      </div>

      {/* ── Tab Nav ── */}
      <div className="border-b border-eva-border mb-8">
        <nav className="flex gap-0.5 -mb-px pt-2">
          {TABS.map(tab => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 text-[12px] font-ui font-semibold rounded-t-lg transition-all duration-200 ${
                  isActive
                    ? 'text-eva-olive border-b-2 border-eva-olive bg-white'
                    : 'text-eva-txt-muted hover:text-eva-black hover:bg-eva-beige-2/60'
                }`}
              >
                <tab.icon size={14} className={isActive ? 'text-eva-olive' : 'opacity-60'} />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* ── FICHA EMPRESARIAL ── */}
      {activeTab === 'info' && (
        <div className="space-y-6 animate-fade-in">
          {/* 2-col layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Company Profile */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-eva-border shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-eva-border">
                  <div className="flex items-center gap-2">
                    <Building2 size={15} className="text-eva-olive" />
                    <h2 className="text-[13px] font-ui font-semibold text-eva-black">Datos Corporativos</h2>
                  </div>
                  <button onClick={() => navigate(`/dashboard/clients/${id}/edit`)} className="flex items-center gap-1.5 text-[11px] text-eva-txt-muted hover:text-eva-olive transition-colors">
                    <Edit3 size={12} />
                    Editar
                  </button>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
                  <InfoField label="Razón Social" value={client.company_name || client.name} icon={Building2} />
                  <InfoField label="RFC" value={client.rfc} icon={Hash} />
                  <InfoField label="Sector" value={client.sector} icon={Briefcase} />
                  <InfoField label="Ciudad Sede" value={client.city} icon={MapPin} />
                  <InfoField label="Sucursales" value={client.sucursales} icon={Globe} />
                  <InfoField label="Sistemas ERP" value={client.sistemas_erp} icon={Globe} />
                  <InfoField label="Plataforma ERP" value={client.erp_type} icon={Globe} />
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-2xl border border-eva-border shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-6 py-4 border-b border-eva-border">
                  <Users size={15} className="text-eva-olive" />
                  <h2 className="text-[13px] font-ui font-semibold text-eva-black">Representante Legal</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InfoField label="Nombre" value={client.contact_name} icon={Users} />
                  <InfoField label="Email" value={client.contact_email} icon={Mail} />
                  <InfoField label="Teléfono" value={client.contact_phone} icon={Phone} />
                </div>
              </div>

              {/* Notes */}
              {client.notes && (
                <div className="bg-white rounded-2xl border border-eva-border shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-6 py-4 border-b border-eva-border">
                    <FileText size={15} className="text-eva-olive" />
                    <h2 className="text-[13px] font-ui font-semibold text-eva-black">Observaciones Internas</h2>
                  </div>
                  <div className="p-6">
                    <p className="text-[13px] font-ui text-eva-txt-mid leading-relaxed whitespace-pre-line">{client.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Status + Quick Actions */}
            <div className="space-y-4">
              {/* Vetting */}
              <div className="bg-white rounded-2xl border border-eva-border shadow-sm p-5 space-y-4">
                <h3 className="text-[11px] font-mono font-black uppercase tracking-widest text-eva-txt-faint">Estado Operativo</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Vetting', value: client.vetting_status },
                    { label: 'Relación', value: client.status },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-[12px] font-ui text-eva-txt-muted">{item.label}</span>
                      <Badge variant={item.value === 'go' || item.value === 'active' ? 'success' : item.value === 'no_go' ? 'danger' : 'warning'} size="sm">
                        {item.value?.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gamma Card */}
              <div className="bg-eva-olive rounded-2xl p-5 space-y-1 text-white">
                <p className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-eva-gold/70">Factor de Complejidad</p>
                <p className="text-4xl font-brand font-bold text-eva-gold tracking-tight">Γ {(client.factor_gamma ?? 0).toFixed(2)}</p>
                <p className="text-[11px] font-ui text-white/50">
                  {client.sucursales} sucursal{client.sucursales !== 1 ? 'es' : ''} · {client.sistemas_erp} ERP{client.sistemas_erp !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Quick Nav to Projects */}
              <button
                onClick={() => setActiveTab('proyectos')}
                className="w-full bg-white rounded-2xl border border-eva-border shadow-sm p-5 text-left hover:border-eva-olive/40 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-eva-beige-2 group-hover:bg-eva-olive-light transition-colors">
                      <Layers size={16} className="text-eva-txt-muted group-hover:text-eva-olive transition-colors" />
                    </div>
                    <div>
                      <p className="text-[13px] font-ui font-semibold text-eva-black">Ver Proyectos</p>
                      <p className="text-[11px] text-eva-txt-faint">Engagements de este cliente</p>
                    </div>
                  </div>
                  <Plus size={16} className="text-eva-txt-faint group-hover:text-eva-olive transition-colors" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PROYECTOS ── */}
      {activeTab === 'proyectos' && (
        <div className="animate-fade-in">
          <ProjectsTab clientId={client.id} clientName={client.name} />
        </div>
      )}

      {/* ── HISTORIAL IA ── */}
      {activeTab === 'actividad' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-eva-gold" />
              <h2 className="font-brand text-base font-medium text-eva-black">Orquestador de Inteligencia</h2>
            </div>
            <div className="bg-white rounded-2xl border border-eva-border p-6 shadow-sm">
              <AnalysisPanel clientId={id} onComplete={handleComplete} />
            </div>
          </div>
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-eva-txt-muted" />
                <h2 className="font-brand text-base font-medium text-eva-black">Historial</h2>
              </div>
              {analyses.length > 0 && (
                <span className="bg-eva-beige-2 text-eva-txt-muted text-[10px] font-bold px-2 py-0.5 rounded-full">{analyses.length}</span>
              )}
            </div>
            <div className="bg-white rounded-2xl border border-eva-border overflow-hidden shadow-sm">
              {loadingHistory ? (
                <div className="p-12 flex items-center justify-center"><Spinner size="md" /></div>
              ) : analyses.length === 0 ? (
                <div className="p-12 text-center">
                  <AlertCircle size={22} className="mx-auto text-eva-border mb-2" />
                  <p className="text-xs text-eva-txt-muted">Sin registros previos</p>
                </div>
              ) : (
                <HistoryList analyses={analyses} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
