import { useState } from 'react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import type { Client } from '../lib/types'

const SECTORS = ['manufactura', 'textiles', 'retail', 'logística', 'construcción', 'alimentos', 'farmacéutico', 'otro']
const ERP_TYPES = ['SAP', 'CONTPAQi', 'Aspel', 'Oracle', 'Excel', 'Sin ERP']

interface ClientFormProps {
  initial?: Partial<Client>
  onSubmit: (data: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
}

export function ClientForm({ initial, onSubmit, onCancel }: ClientFormProps) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    sector: initial?.sector ?? 'manufactura',
    contact_name: initial?.contact_name ?? '',
    contact_email: initial?.contact_email ?? '',
    contact_phone: initial?.contact_phone ?? '',
    city: initial?.city ?? 'Puebla',
    sucursales: initial?.sucursales ?? 1,
    sistemas_erp: initial?.sistemas_erp ?? 1,
    erp_type: initial?.erp_type ?? 'SAP',
    notes: initial?.notes ?? '',
    vetting_status: (initial?.vetting_status ?? 'pending') as Client['vetting_status'],
    status: (initial?.status ?? 'prospect') as Client['status'],
  })
  const [loading, setLoading] = useState(false)

  const gamma = 1 + 0.5 * form.sucursales + 0.2 * form.sistemas_erp
  const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try { await onSubmit({ ...form, factor_gamma: gamma }) }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nombre de la empresa *" value={form.name} onChange={e => set('name', e.target.value)} required />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-eva-charcoal">Sector *</label>
          <select value={form.sector} onChange={e => set('sector', e.target.value)}
            className="px-3 py-2 rounded-lg border border-[var(--eva-border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-eva-olive/30">
            {SECTORS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <Input label="Ciudad" value={form.city} onChange={e => set('city', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Sucursales" type="number" min={1} value={form.sucursales} onChange={e => set('sucursales', Number(e.target.value))} />
        <Input label="Sistemas ERP" type="number" min={0} value={form.sistemas_erp} onChange={e => set('sistemas_erp', Number(e.target.value))} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-eva-charcoal">Tipo de ERP</label>
        <select value={form.erp_type ?? ''} onChange={e => set('erp_type', e.target.value)}
          className="px-3 py-2 rounded-lg border border-[var(--eva-border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-eva-olive/30">
          {ERP_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="rounded-lg bg-eva-olive/5 border border-eva-olive/20 p-3">
        <p className="text-xs font-medium text-eva-olive">Factor Γ calculado: <span className="text-lg">{gamma.toFixed(2)}</span></p>
        <p className="text-xs text-eva-warm-gray mt-0.5">1 + (0.5 × {form.sucursales}) + (0.2 × {form.sistemas_erp})</p>
      </div>
      <Input label="Contacto" value={form.contact_name} onChange={e => set('contact_name', e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Email" type="email" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} />
        <Input label="Teléfono" value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-eva-charcoal">Notas</label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
          className="px-3 py-2 rounded-lg border border-[var(--eva-border)] resize-none text-sm focus:outline-none focus:ring-2 focus:ring-eva-olive/30" />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" loading={loading}>{initial ? 'Guardar cambios' : 'Crear cliente'}</Button>
      </div>
    </form>
  )
}
