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
          <Button onClick={() => setShowModal(true)}>Nuevo</Button>
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
          action={!search && <Button onClick={() => setShowModal(true)}>