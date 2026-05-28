import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Users, Search, MapPin, Building2, ChevronRight, Filter } from 'lucide-react'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { ClientForm } from '../components/ClientForm'
import { useClients } from '../hooks/useClients'
import type { Client } from '../lib/types'
import MetricCard from '../components/ui/MetricCard'

type StatusFilter = 'all' | 'prospect' | 'active' | 'completed' | 'archived'

export function ClientsPage() {
  const { clients, loading, createClient } = useClients()
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const navigate = useNavigate()

  const handleCreate = async (data: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createClient(data)
      setShowModal(false)
    } catch (error: any) {
      console.error("Error creating client:", error)
      alert("Error al conectar con la base de datos: " + (error.message || "Error desconocido"))
    }
  }

  const getStatusVariant = (s: string): 'success' | 'warning' | 'neutral' | 'danger' => {
    const map: Record<string, 'success' | 'warning' | 'neutral' | 'danger'> = {
      active: 'success',
      prospect: 'warning',
      completed: 'neutral',
      archived: 'danger',
    }
    return map[s] ?? 'neutral'
  }

  const filtered = useMemo(() => {
    return clients.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.sector.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || c.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [clients, search, statusFilter])

  return (
    <div className="space-y-8 animate-fade-in bg-[var(--eva-black)] min-h-screen text-[var(--eva-txt-primary)]">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} className="text-[var(--eva-olive)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--eva-txt-muted)]">
              Corporate Directory
            </span>
          </div>
          <h1 className="font-brand text-3xl font-medium text-[var(--eva-txt-primary)] leading-tight">
            Gestión de Clientes
          </h1>
          <p className="font-ui text-sm text-[var(--eva-txt-muted)] mt-1">
            Directorio central de relaciones y prospectos activos.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 bg-[var(--eva-surface)] border border-[var(--eva-border)] p-1 rounded-lg">
             {(['all', 'prospect', 'active', 'completed', 'archived'] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-xs font-ui font-medium rounded-md transition-all ${
                    statusFilter === status 
                      ? 'bg-[var(--eva-olive)] text-white shadow-sm' 
                      : 'text-[var(--eva-txt-muted)] hover:text-[var(--eva-txt-primary)] hover:bg-[var(--eva-surface-2)]'
                  }`}
                >
                  {status === 'all' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
             ))}
          </div>
          <div className="w-64 hidden lg:block">
            <Input 
              placeholder="Buscar cliente o sector…" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon={Search}
              className="bg-[var(--eva-surface)] border-[var(--eva-border)] text-[var(--eva-txt-primary)] focus:border-[var(--eva-olive)]"
            />
          </div>
          <Button onClick={() => setShowModal(true)} icon={<Plus size={16} />} className="bg-[var(--eva-olive)] text-white hover:bg-[var(--eva-olive-2)] border-none">
            Nuevo cliente
          </Button>
        </div>
      </section>

      {/* Quick Metrics */}
      {!loading && clients.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard 
            label="Total Clientes" 
            value={clients.length} 
            subtitle="En el directorio actual" 
            className="bg-[var(--eva-surface)] border-[var(--eva-border)] text-[var(--eva-txt-primary)]"
          />
          <MetricCard 
            label="Proyectos Activos" 
            value={clients.filter(c => c.status === 'active').length} 
            subtitle="Con transacciones recurrentes" 
            serviceColor="var(--eva-olive)"
            className="bg-[var(--eva-surface)] border-[var(--eva-border)] text-[var(--eva-txt-primary)]"
          />
          <MetricCard 
            label="Tasa de Cierre" 
            value="68%" 
            subtitle="Promedio últimos 30 días" 
            serviceColor="var(--eva-gold)"
            className="bg-[var(--eva-surface)] border-[var(--eva-border)] text-[var(--eva-txt-primary)]"
          />
        </section>
      )}

      {loading ? (
        <div className="py-24 flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="font-ui text-xs text-[var(--eva-txt-muted)]">Sincronizando directorio…</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={32} className="text-[var(--eva-txt-muted)]" />}
          title={search || statusFilter !== 'all' ? 'Sin resultados' : 'Directorio vacío'}
          description={
            search || statusFilter !== 'all'
              ? `No hay clientes que coincidan con los filtros actuales.`
              : 'Agrega el primer cliente corporativo para comenzar.'
          }
          action={!(search || statusFilter !== 'all') && (
            <Button onClick={() => setShowModal(true)} icon={<Plus size={16} />}>
              Nuevo cliente
            </Button>
          )}
          className="bg-[var(--eva-surface)] border-[var(--eva-border)]"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map(client => (
              <ClientCard
                key={client.id}
                client={client}
                statusVariant={getStatusVariant(client.status)}
                onClick={() => navigate(`/dashboard/clientes/${client.id}`)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Nuevo cliente"
      >
        <div className="p-1">
          <ClientForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
        </div>
      </Modal>
    </div>
  )
}

/* ─── Sub-components ─── */

interface ClientCardProps {
  client: Client
  statusVariant: 'success' | 'warning' | 'neutral' | 'danger'
  onClick: () => void
}

function ClientCard({ client, statusVariant, onClick }: ClientCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-xl p-5 cursor-pointer group hover:border-[var(--eva-olive)] hover:shadow-lg transition-all duration-300"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[var(--eva-surface-2)] flex items-center justify-center flex-shrink-0 group-hover:bg-[#4a5c3a20] group-hover:text-[var(--eva-olive)] transition-colors border border-[var(--eva-border)]">
            <Building2 size={20} className="text-[var(--eva-txt-muted)] group-hover:text-[var(--eva-olive)] transition-colors" />
          </div>
          <div className="min-w-0">
            <h3 className="font-ui text-[15px] font-semibold text-[var(--eva-txt-primary)] truncate group-hover:text-[var(--eva-olive)] transition-colors">
              {client.name}
            </h3>
            <p className="font-ui text-[12px] text-[var(--eva-txt-muted)]">{client.sector}</p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Badge variant={statusVariant} size="sm">{client.status}</Badge>
        </div>
      </div>

      {/* Contact info */}
      <div className="flex items-center gap-4 text-[12px] text-[var(--eva-txt-muted)] font-ui mb-4">
        <span className="flex items-center gap-1.5">
          <MapPin size={14} className="opacity-60" /> {client.city}
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-[var(--eva-border)]" />
          {client.sucursales} sucursales
        </span>
      </div>

      {/* Factors Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--eva-border)]">
        <div className="flex items-center gap-2">
          {client.factor_gamma && (
            <div className="px-2 py-0.5 rounded bg-[#4a5c3a20] text-[var(--eva-olive)] text-[10px] font-bold font-mono border border-[var(--eva-olive)]/20">
              Γ {client.factor_gamma}
            </div>
          )}
          {client.factor_alpha && (
            <div className="px-2 py-0.5 rounded bg-[var(--eva-surface-2)] text-[var(--eva-txt-secondary)] text-[10px] font-bold font-mono border border-[var(--eva-border)]">
              α {client.factor_alpha}
            </div>
          )}
        </div>
        <ChevronRight size={16} className="text-[var(--eva-txt-muted)] group-hover:text-[var(--eva-olive)] group-hover:translate-x-1 transition-all" />
      </div>
    </motion.div>
  )
}
