import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Users, Search, MapPin, Building2, ChevronRight } from 'lucide-react'
import Button from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { ClientForm } from '../components/ClientForm'
import { useClients } from '../hooks/useClients'
import type { Client } from '../lib/types'

export function ClientsPage() {
  const { clients, loading, createClient } = useClients()
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleCreate = async (data: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    await createClient(data)
    setShowModal(false)
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

  const filtered = clients.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.sector.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-1">
          <h1>Clientes</h1>
          <p className="max-w-md">Directorio de relaciones corporativas.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group hidden lg:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary/50 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-glass h-9 pl-9 pr-3 text-sm rounded-button w-56"
            />
          </div>
          <Button onClick={() => setShowModal(true)} icon={<Plus size={16} />}>
            Nuevo Cliente
          </Button>
        </div>
      </section>

      {loading ? (
        <div className="py-24 flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-xs text-content-tertiary">Cargando clientes…</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Users size={32} />}
          title={search ? 'Sin resultados' : 'Directorio vacío'}
          description={
            search
              ? `No hay clientes que coincidan con "${search}"`
              : 'Agrega el primer cliente corporativo para comenzar.'
          }
          action={!search && (
            <Button onClick={() => setShowModal(true)} icon={<Plus size={16} />}>
              Nuevo Cliente
            </Button>
          )}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              statusVariant={getStatusVariant(client.status)}
              onClick={() => navigate(`/clients/${client.id}`)}
            />
          ))}
        </div>
      )}

      {/* Summary */}
      {!loading && clients.length > 0 && (
        <div className="flex items-center justify-between text-xs text-content-tertiary">
          <span>{filtered.length} de {clients.length} clientes</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success inline-block" /> Active
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-warning inline-block" /> Prospect
            </span>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Nuevo Cliente"
      >
        <ClientForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
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
      className="card-interactive cursor-pointer group"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(149,184,119,0.10)' }}
          >
            <Building2 size={18} className="text-primary-400" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate">{client.name}</h3>
            <p className="text-xs text-content-tertiary">{client.sector}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant={statusVariant} size="sm">{client.status}</Badge>
          <ChevronRight
            size={16}
            className="text-content-tertiary/40 group-hover:text-accent-olive transition-colors"
          />
        </div>
      </div>

      {/* Contact info */}
      <div className="flex items-center gap-4 text-xs text-content-tertiary mb-3">
        <span className="flex items-center gap-1">
          <MapPin size={12} /> {client.city}
        </span>
        <span>{client.sucursales} sucursales</span>
      </div>

      {/* Factors */}
      <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {client.factor_gamma && (
          <Badge variant="olive" size="xs">Γ {client.factor_gamma}</Badge>
        )}
        {client.factor_alpha && (
          <Badge variant="neutral" size="xs">α {client.factor_alpha}</Badge>
        )}
        {client.factor_beta && (
          <Badge variant="info" size="xs">β {client.factor_beta}</Badge>
        )}
      </div>
    </motion.div>
  )
}
