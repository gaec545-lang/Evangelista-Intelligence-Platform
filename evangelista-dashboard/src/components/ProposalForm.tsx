import { useState } from 'react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'

interface ProposalFormData {
  client_name: string
  sector: string
  sucursales: number
  sistemas_erp: number
  erp_type: string
  city: string
  registros: number
  contact_name: string
  type: 'foundation' | 'architecture'
}

interface Props {
  initialData?: Partial<ProposalFormData>
  onGenerate: (data: ProposalFormData) => Promise<void>
  loading?: boolean
}

export function ProposalForm({ initialData, onGenerate, loading }: Props) {
  const [form, setForm] = useState<ProposalFormData>({
    client_name: initialData?.client_name ?? '',
    sector: initialData?.sector ?? 'manufactura',
    sucursales: initialData?.sucursales ?? 1,
    sistemas_erp: initialData?.sistemas_erp ?? 1,
    erp_type: initialData?.erp_type ?? 'SAP',
    city: initialData?.city ?? 'Puebla',
    registros: initialData?.registros ?? 100000,
    contact_name: initialData?.contact_name ?? '',
    type: initialData?.type ?? 'foundation',
  })

  const gamma = 1 + 0.5 * form.sucursales + 0.2 * form.sistemas_erp
  const set = <K extends keyof ProposalFormData>(k: K, v: ProposalFormData[K]) => setForm(p => ({ ...p, [k]: v }))

  return (
    <form onSubmit={e => { e.preventDefault(); onGenerate(form) }} className="space-y-4">
      <div className="flex gap-2 mb-2">
        {(['foundation', 'architecture'] as const).map(t => (
          <button key={t} type="button" onClick={() => set('type', t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${form.type === t ? 'bg-eva-olive text-eva-cream' : 'bg-white border border-[var(--eva-border)] text-eva-charcoal hover:bg-eva-cream'}`}>
            {t === 'foundation' ? 'Foundation' : 'Architecture'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Empresa *" value={form.client_name} onChange={e => set('client_name', e.target.value)} required />
        <Input label="Contacto" value={form.contact_name} onChange={e => set('contact_name', e.target.value)} />
        <Input label="Sucursales" type="number" min={1} value={form.sucursales} onChange={e => set('sucursales', Number(e.target.value))} />
        <Input label="ERPs" type="number" min={0} value={form.sistemas_erp} onChange={e => set('sistemas_erp', Number(e.target.value))} />
        <Input label="Registros BD" type="number" value={form.registros} onChange={e => set('registros', Number(e.target.value))} />
        <Input label="Ciudad" value={form.city} onChange={e => set('city', e.target.value)} />
      </div>
      <div className="rounded-lg bg-eva-cream p-3 text-sm">
        <span className="font-medium">Factor Γ: {gamma.toFixed(2)}</span>
        <span className="text-eva-warm-gray ml-2">· Tipo: {form.type}</span>
      </div>
      <Button type="submit" loading={loading} className="w-full">Generar propuesta</Button>
    </form>
  )
}
