import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Users } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { ClientForm } from '../components/ClientForm'
import { useClients } from '../hooks/useClients'
import type { Client } from '../lib/types'

export function ClientsPage() {
  const { clients, loading, createClient } = useClients()
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const handleCreate = async (data: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    await createClient(data)
    setShowModal(false)
  }

  const statusBadge = (s: string) => {
    const map: Record<string, 'olive' | 'gold' | 'gray' | 'red'> = { active: 'olive', prospect: 'gold', completed: 'gray', archived: 'red' }
    return <Badge variant={map[s] ?? 'gray'}>{s}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-eva-charcoal">Clientes</h1>
          <p className="text-eva-warm-gray mt-1">{clients.length} clientes registrados</p>
        </div>
        <Button onClick={() => setShowModal(true)}><Plus size={16} /> Nuevo cliente</Button>
      </div>

      {loading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}

      {!loading && !clients.length && (
        <EmptyState icon={<Users size={40} />} title="Sin clientes" description="Agrega tu primer cliente para comenzar"
          action={<Button onClick={() => setShowModal(true)}><Plus size={16} /> Crear cliente</Button>} />
      )}

      {!loading && clients.length > 0 && (
        <Card padding={false}>
          <table className="w-full text-sm">
            <thead className="bg-eva-cream">
              <tr>
                {['Empresa', 'Sector', 'Ciudad', 'Γ', 'Sucursales', 'Status', 'Actualizado'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-eva-warm-gray uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--eva-border)]">
              {clients.map(c => (
                <tr key={c.id} onClick={() => navigate(`/clients/${c.id}`)} className="cursor-pointer hover:bg-eva-cream/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-eva-charcoal">{c.name}</td>
                  <td className="px-4 py-3 text-eva-warm-gray capitalize">{c.sector}</td>
                  <td className="px-4 py-3 text-eva-warm-gray">{c.city}</td>
                  <td className="px-4 py-3 font-mono text-eva-olive">{c.factor_gamma?.toFixed(2) ?? '—'}</td>
                  <td className="px-4 py-3">{c.sucursales}</td>
                  <td className="px-4 py-3">{statusBadge(c.status)}</td>
                  <td className="px-4 py-3 text-eva-warm-gray text-xs">{new Date(c.updated_at).toLocaleDateString('es-MX')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Nuevo cliente" maxWidth="max-w-2xl">
        <ClientForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
      </Modal>
    </div>
  )
}
