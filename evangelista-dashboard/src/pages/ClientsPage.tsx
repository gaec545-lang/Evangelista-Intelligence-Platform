import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Users, Search, MapPin, Building2, ChevronRight } from 'lucide-react'
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

export function ClientsPage() {
  const { clients, loading, createClient } = useClients()
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
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

  const filtered = clients.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.sector.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users size={14} className="text-eva-olive" />
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-eva-txt-muted">
              Corporate Directory
            </span>
          </div>
          <h1 className="font-brand text-3xl font-medium text-eva-black leading-tight">
            Gestión de Clientes
          </h1>
          <p className="font-ui text-sm text-eva-txt-muted mt-1">
            Directorio central de relaciones y prospectos activos.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-64 hidden lg:block">
            <Input 
              placeholder="Buscar cliente o sector…" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon={Search}
            />
          </div>
          <Button onClick={() => setShowModal(true)} icon={<Plus size={16} />}>
            Nuevo Registro
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
          />
          <MetricCard 
            label="Proyectos Activos" 
            value={clients.filter(c => c.status === 'active').length} 
            subtitle="Con transacciones recurrentes" 
            serviceColor="#4a5c3a"
          />
          <MetricCard 
            label="Tasa de Cierre" 
            value="68%" 
            subtitle="Promedio últimos 30 días" 
            serviceColor="#c9a84c"
          />
        </section>
      )}

      {loading ? (
        <div className="py-24 flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="font-ui text-xs text-eva-txt-muted">Sincronizando directorio…</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              statusVariant={getStatusVariant(client.status)}
              onClick={() => navigate(`/dashboard/clients/${client.id}`)}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Nuevo Registro de Cliente"
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
      whileHover={{ y: -2 }}
      className="bg-white border border-eva-border rounded-xl p-5 cursor-pointer group hover:border-eva-olive/30 hover:shadow-card-hover transition-all duration-300"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-eva-beige-2 flex items-center justify-center flex-shrink-0 group-hover:bg-eva-olive-light group-hover:text-eva-olive transition-colors">
            <Building2 size={20} className="text-eva-txt-muted group-hover:text-eva-olive transition-colors" />
          </div>
          <div className="min-w-0">
            <h3 className="font-ui text-[15px] font-semibold text-eva-black truncate group-hover:text-eva-olive transition-colors">
              {client.name}
            </h3>
            <p className="font-ui text-[12px] text-eva-txt-muted">{client.sector}</p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Badge variant={statusVariant} size="sm">{client.status}</Badge>
        </div>
      </div>

      {/* Contact info */}
      <div className="flex items-center gap-4 text-[12px] text-eva-txt-muted font-ui mb-4">
        <span className="flex items-center gap-1.5">
          <MapPin size={14} className="text-eva-txt-faint" /> {client.city}
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-eva-txt-faint" />
          {client.sucursales} sucursales
        </span>
      </div>

      {/* Factors Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-eva-border">
        <div className="flex items-center gap-2">
          {client.factor_gamma && (
            <div className="px-2 py-0.5 rounded bg-eva-olive-light text-eva-olive text-[10px] font-bold font-mono">
              Γ {client.factor_gamma}
            </div>
          )}
          {client.factor_alpha && (
            <div className="px-2 py-0.5 rounded bg-eva-beige-3 text-eva-txt-mid text-[10px] font-bold font-mono">
              α {client.factor_alpha}
            </div>
          )}
        </div>
        <ChevronRight size={16} className="text-eva-txt-faint group-hover:text-eva-olive group-hover:translate-x-1 transition-all" />
      </div>
    </motion.div>
  )
}
