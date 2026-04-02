import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Users, Search, MapPin, Building2, ChevronRight, Filter } from 'lucide-react'
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
      c.sector.toLowerCase().includes(search.toLowerCase())
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
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary group-focus-within:text-primary-600 transition-colors" />
            <input
              type="text"
              placeholder="Buscar…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-9 pl-9 pr-3 text-sm bg-white rounded-button border border-surface-border w-56 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600 transition-colors outline-none"
            />
          </div>
          <Button variant="outline" size="sm" icon={<Filter size={14} />}>Filtros</Button>
          <Button onClick={() => setShowModal(true)} icon={<Plus size={16} />}>Nuevo</Button>
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
          action={!search && <Button onClick={() => setShowModal(true)} icon={<Plus size={16} />}>Añadir cliente</Button>}
        />
      ) : (
        <div className="bg-white rounded-card border border-surface-border divide-y divide-surface-border">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => navigate(`/clients/${c.id}`)}
              className="group flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-surface-hover/70 transition-colors"
            >
              {/* Name */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center text-primary-700 text-sm font-medium group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-content-primary">{c.name}</p>
                  <p className="text-xs text-content-tertiary flex items-center gap-1">
                    <Building2 size={11} /> {c.sector} · {c.city}
                    <MapPin size={10} className="text-surface-border" />
                  </p>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-6">
                <div className="text-right shrink-0">
                  <p className="font-mono text-sm text-content-primary">{c.factor_gamma?.toFixed(2) ?? '—'}</p>
                  <p className="text-xs text-content-tertiary">Γ factor</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm text-content-primary">{c.sucursales}</p>
                  <p className="text-xs text-content-tertiary">sucursales</p>
                </div>
                <Badge variant={getStatusVariant(c.status)} size="sm">{c.status}</Badge>
                <ChevronRight size={16} className="text-surface-border group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nuevo cliente">
        <div className="px-2 pb-2">
          <ClientForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
        </div>
      </Modal>
    </div>
  )
}
