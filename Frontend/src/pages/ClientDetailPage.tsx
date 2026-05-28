import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  ArrowLeft, Building2, MapPin, Zap, Clock,
  Layers, AlertCircle, Plus, Mail, Phone,
  Globe, Briefcase, Activity, UserCircle2, 
  Send, History, ShieldAlert
} from 'lucide-react'
import { clientsDB } from '../lib/supabase'
import ProjectsTab from '../components/client/ProjectsTab'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { AnalysisPanel } from '../components/AnalysisPanel'
import { Spinner } from '../components/ui/Spinner'
import type { Client } from '../lib/types'

type ClientTab = 'resumen' | 'contactos' | 'proyectos' | 'cuenta'

const TABS: { key: ClientTab; label: string; icon: React.ComponentType<any> }[] = [
  { key: 'resumen',    label: 'Resumen',    icon: Activity },
  { key: 'contactos',  label: 'Contactos',  icon: UserCircle2 },
  { key: 'proyectos',  label: 'Proyectos',  icon: Layers },
  { key: 'cuenta',     label: 'Cuenta',     icon: History },
]

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [client, setClient] = useState<Client | null>(null)
  const [activeTab, setActiveTab] = useState<ClientTab>('resumen')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Mocks for UI requirements
  const [touchpoints, setTouchpoints] = useState([
    { id: '1', date: '2023-10-12', type: 'Reunión Presencial', notes: 'Presentación de propuesta inicial.', author: 'Admin' },
    { id: '2', date: '2023-09-01', type: 'Llamada', notes: 'Primer contacto y scoping.', author: 'Admin' }
  ])
  const [newTouchpoint, setNewTouchpoint] = useState('')

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

  const handleAddTouchpoint = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTouchpoint.trim()) return
    const pt = {
      id: Math.random().toString(),
      date: new Date().toISOString().split('T')[0],
      type: 'Nota Log',
      notes: newTouchpoint,
      author: 'Usuario Actual'
    }
    setTouchpoints([pt, ...touchpoints])
    setNewTouchpoint('')
  }

  const handleComplete = async (r: { task: string; response: string; confidence: number }) => {
    console.log("Analysis Completed:", r)
  }

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 bg-[var(--eva-black)]">
      <Spinner size="lg" />
      <p className="text-xs text-[var(--eva-txt-muted)]">Cargando expediente…</p>
    </div>
  )

  if (error || !client) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-[var(--eva-black)]">
      <div className="p-3 rounded-full bg-red-500/10 text-red-400"><AlertCircle size={32} /></div>
      <div className="text-center">
        <h3 className="text-lg font-brand text-[var(--eva-txt-primary)]">Error de Carga</h3>
        <p className="text-sm text-[var(--eva-txt-muted)] max-w-xs">{error || 'No se pudo cargar el expediente.'}</p>
      </div>
      <Button variant="outline" onClick={() => navigate('/dashboard/clientes')} className="border-[var(--eva-border)] text-[var(--eva-txt-primary)] hover:bg-[var(--eva-surface)]">Volver al Directorio</Button>
    </div>
  )

  // Contacts logic for enforcing Max 1 Sponsor and 1 Interlocutor
  const mockContacts = [
    { id: 1, name: client.contact_name || 'Sin Asignar', role: 'Sponsor', email: client.contact_email, phone: client.contact_phone },
    { id: 2, name: 'María Gómez', role: 'Interlocutor Principal', email: 'maria@ejemplo.com', phone: '555-0102' },
    { id: 3, name: 'Juan Pérez', role: 'Stakeholder', email: 'juan@ejemplo.com', phone: '555-0103' }
  ]

  const lastTouchpointDate = new Date(touchpoints[0]?.date || '2000-01-01')
  const daysSinceLastTouchpoint = Math.floor((new Date().getTime() - lastTouchpointDate.getTime()) / (1000 * 3600 * 24))
  const isAlertTouchpoint = daysSinceLastTouchpoint > 30

  return (
    <div className="space-y-0 animate-fade-in bg-[var(--eva-black)] min-h-screen text-[var(--eva-txt-primary)]">

      {/* ── Fixed Header ── */}
      <div className="sticky top-0 z-10 bg-[var(--eva-black)]/90 backdrop-blur-md border-b border-[var(--eva-border)] pt-4 pb-6 px-2 space-y-5 mb-0">
        <button
          onClick={() => navigate('/dashboard/clientes')}
          className="flex items-center gap-2 text-xs text-[var(--eva-txt-muted)] hover:text-[var(--eva-olive)] transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Directorio
        </button>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--eva-surface-2)] flex items-center justify-center text-[var(--eva-gold)] text-xl font-bold shadow-sm border border-[var(--eva-border)] flex-shrink-0">
              {client.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-brand font-medium text-[var(--eva-txt-primary)]">{client.name}</h1>
                <Badge variant={client.status === 'active' ? 'success' : client.status === 'prospect' ? 'warning' : 'neutral'} size="sm">
                  {client.status}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs font-ui text-[var(--eva-txt-muted)]">
                <span className="flex items-center gap-1.5"><MapPin size={12} className="opacity-60" />{client.city}</span>
                <span className="w-1 h-1 rounded-full bg-[var(--eva-border)]" />
                <span className="capitalize flex items-center gap-1.5"><Briefcase size={12} className="opacity-60" />{client.sector}</span>
                <span className="w-1 h-1 rounded-full bg-[var(--eva-border)]" />
                <span className="font-mono text-[var(--eva-txt-secondary)] flex items-center gap-1.5"><Globe size={12} className="opacity-60" /> ERP: {client.erp_type || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-[#c9a84c15] border border-[var(--eva-gold)]/20 rounded-full px-3 py-1">
              <span className="text-[10px] font-mono font-black text-[var(--eva-gold)] uppercase tracking-wider">Γ</span>
              <span className="text-[13px] font-mono font-bold text-[var(--eva-gold)]">{(client.factor_gamma ?? 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab Nav ── */}
      <div className="border-b border-[var(--eva-border)] mb-8 mt-4 px-2">
        <nav className="flex gap-2 -mb-px">
          {TABS.map(tab => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 text-[13px] font-ui font-semibold rounded-t-lg transition-all duration-200 ${
                  isActive
                    ? 'text-[var(--eva-olive)] border-b-2 border-[var(--eva-olive)] bg-[var(--eva-surface)]'
                    : 'text-[var(--eva-txt-muted)] hover:text-[var(--eva-txt-primary)] hover:bg-[var(--eva-surface-2)]'
                }`}
              >
                <tab.icon size={14} className={isActive ? 'text-[var(--eva-olive)]' : 'opacity-60'} />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="px-2">
        {/* ── RESUMEN ── */}
        {activeTab === 'resumen' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2 space-y-6">
                {/* Account Health Alert */}
                {isAlertTouchpoint && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
                    <ShieldAlert size={20} className="text-red-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-red-400">Alerta de Salud de Cuenta</h4>
                      <p className="text-xs text-red-400/80 mt-1">
                        Han pasado {daysSinceLastTouchpoint} días desde el último touchpoint registrado. Se recomienda contactar al cliente pronto.
                      </p>
                    </div>
                  </div>
                )}

                {/* Timeline de Proyectos (Mock visual representation) */}
                <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Layers size={16} className="text-[var(--eva-olive)]" />
                    <h2 className="text-sm font-semibold text-[var(--eva-txt-primary)]">Timeline de Proyectos</h2>
                  </div>
                  <div className="space-y-4 border-l-2 border-[var(--eva-border)] ml-2 pl-4">
                     <div className="relative">
                        <div className="absolute w-3 h-3 bg-[var(--eva-olive)] rounded-full -left-[23px] top-1"></div>
                        <p className="text-xs text-[var(--eva-txt-muted)]">2023 - Presente</p>
                        <p className="text-sm font-medium text-[var(--eva-txt-primary)]">Auditoría Foundation</p>
                     </div>
                     <div className="relative">
                        <div className="absolute w-3 h-3 bg-[var(--eva-border)] rounded-full -left-[23px] top-1"></div>
                        <p className="text-xs text-[var(--eva-txt-muted)]">2022 - 2023</p>
                        <p className="text-sm font-medium text-[var(--eva-txt-secondary)]">Optimización de ERP</p>
                     </div>
                  </div>
                </div>
              </div>

              {/* Panel de Inteligencia */}
              <div className="lg:col-span-1">
                <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-2xl p-6 shadow-sm h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap size={16} className="text-[var(--eva-gold)]" />
                    <h2 className="text-sm font-semibold text-[var(--eva-txt-primary)]">Panel de Inteligencia</h2>
                  </div>
                  <AnalysisPanel clientId={id} onComplete={handleComplete} />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── CONTACTOS ── */}
        {activeTab === 'contactos' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--eva-txt-primary)]">Contactos Clave</h2>
              <Button size="sm" icon={<Plus size={14} />} className="bg-[var(--eva-surface-2)] text-[var(--eva-txt-primary)] border border-[var(--eva-border)] hover:bg-[var(--eva-surface)]">
                Añadir Contacto
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {mockContacts.map(contact => (
                <div key={contact.id} className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-xl p-5 hover:border-[var(--eva-olive)] transition-colors">
                   <div className="flex items-start justify-between mb-3">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-[var(--eva-surface-2)] border border-[var(--eva-border)] flex items-center justify-center">
                         <UserCircle2 size={20} className="text-[var(--eva-txt-muted)]" />
                       </div>
                       <div>
                         <p className="text-sm font-medium text-[var(--eva-txt-primary)]">{contact.name}</p>
                         <p className="text-xs text-[var(--eva-txt-muted)]">{contact.email}</p>
                       </div>
                     </div>
                   </div>
                   <div className="mt-4">
                     <Badge 
                        variant={contact.role === 'Sponsor' ? 'warning' : contact.role === 'Interlocutor Principal' ? 'success' : 'neutral'} 
                        size="sm"
                      >
                        {contact.role}
                      </Badge>
                   </div>
                   {(contact.role === 'Sponsor' || contact.role === 'Interlocutor Principal') && (
                     <p className="text-[10px] text-[var(--eva-txt-faint)] mt-2 italic">* Máximo 1 {contact.role} permitido</p>
                   )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PROYECTOS ── */}
        {activeTab === 'proyectos' && (
          <div className="animate-fade-in bg-[var(--eva-surface)] p-6 rounded-2xl border border-[var(--eva-border)]">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-sm font-semibold text-[var(--eva-txt-primary)]">Proyectos Asociados</h2>
            </div>
            <ProjectsTab clientId={client.id} clientName={client.name} />
          </div>
        )}

        {/* ── CUENTA (Touchpoints) ── */}
        {activeTab === 'cuenta' && (
          <div className="max-w-3xl space-y-6 animate-fade-in">
             <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-2xl p-5">
               <h3 className="text-xs font-semibold text-[var(--eva-txt-primary)] uppercase tracking-wider mb-4">Registrar Touchpoint</h3>
               <form onSubmit={handleAddTouchpoint} className="flex gap-3">
                 <div className="flex-1">
                   <Input 
                     value={newTouchpoint}
                     onChange={e => setNewTouchpoint(e.target.value)}
                     placeholder="Añade notas de una reunión, llamada o correo..."
                     className="bg-[var(--eva-surface-2)] border-[var(--eva-border)] text-[var(--eva-txt-primary)]"
                   />
                 </div>
                 <Button type="submit" icon={<Send size={14} />} className="bg-[var(--eva-olive)] text-white hover:bg-[var(--eva-olive-2)] border-none">
                   Guardar Log
                 </Button>
               </form>
             </div>

             <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-[var(--eva-border)]">
                  <h3 className="text-sm font-semibold text-[var(--eva-txt-primary)]">Log Inmutable de Touchpoints</h3>
                </div>
                <div className="divide-y divide-[var(--eva-border)]">
                  {touchpoints.map(pt => (
                    <div key={pt.id} className="p-5 hover:bg-[var(--eva-surface-2)]/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-[var(--eva-txt-muted)]" />
                          <span className="text-xs font-mono text-[var(--eva-txt-secondary)]">{pt.date}</span>
                          <Badge variant="neutral" size="sm">{pt.type}</Badge>
                        </div>
                        <span className="text-xs text-[var(--eva-txt-muted)]">{pt.author}</span>
                      </div>
                      <p className="text-sm text-[var(--eva-txt-primary)] font-ui">{pt.notes}</p>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  )
}
