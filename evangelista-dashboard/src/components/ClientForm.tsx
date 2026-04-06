import { useState } from 'react';
import { Building2, Globe, MapPin, Calculator, Mail, Phone, User, FileEdit } from 'lucide-react';
import { Input } from './ui/Input';
import Button from './ui/Button';
import type { Client } from '../lib/types';

const SECTORS = ['manufactura', 'textiles', 'retail', 'logística', 'construcción', 'alimentos', 'farmacéutico', 'otro'];
const ERP_TYPES = ['SAP', 'CONTPAQi', 'Aspel', 'Oracle', 'Excel', 'Sin ERP'];

interface ClientFormProps {
  initial?: Partial<Client>;
  onSubmit: (data: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
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
  });
  const [loading, setLoading] = useState(false);

  const gamma = 1 + 0.5 * form.sucursales + 0.2 * form.sistemas_erp;
  const set = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ ...form, factor_gamma: gamma });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5 md:col-span-2">
          <Input
            label="Razón Social / Empresa *"
            placeholder="Ej. Textiles del Centro S.A."
            value={form.name}
            onChange={e => set('name', e.target.value)}
            required
          />
        </div>

        <SelectField
          label="Sector Industrial *"
          icon={Building2}
          value={form.sector}
          onChange={v => set('sector', v)}
          options={SECTORS.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
        />

        <Input
          label="Ciudad sede"
          placeholder="Ej. Puebla, Cholula"
          value={form.city}
          onChange={e => set('city', e.target.value)}
          icon={MapPin}
          iconTrailing
        />
      </div>

      {/* Operative Metrics */}
      <div
        className="rounded-[12px] p-6 space-y-5"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px dashed rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center gap-2">
          <Calculator size={16} className="text-[#95B877]" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A1A1A6]">
            Métricas Operativas
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Nº Sucursales"
            type="number"
            min={1}
            value={form.sucursales}
            onChange={e => set('sucursales', Number(e.target.value))}
          />
          <Input
            label="Sistemas RAG/ERP"
            type="number"
            min={0}
            value={form.sistemas_erp}
            onChange={e => set('sistemas_erp', Number(e.target.value))}
          />

          <SelectField
            label="Plataforma ERP Principal"
            icon={Globe}
            value={form.erp_type ?? ''}
            onChange={v => set('erp_type', v)}
            options={ERP_TYPES.map(t => ({ value: t, label: t }))}
          />
        </div>

        {/* Γ Factor */}
        <div
          className="rounded-[12px] p-4 flex items-center justify-between"
          style={{
            background: 'rgba(149,184,119,0.06)',
            border: '1px solid rgba(149,184,119,0.15)',
          }}
        >
          <div>
            <p className="text-[10px] font-semibold text-[#95B877] uppercase tracking-widest">
              Evangelista Factor Γ
            </p>
            <p className="text-[11px] text-[#A1A1A6] mt-0.5">
              Coeficiente de complejidad logística proyectado
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-semibold text-[#95B877]">{gamma.toFixed(2)}</span>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-[#A1A1A6]/80">INDEX</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 px-1">
          <User size={16} className="text-[#95B877]" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A1A1A6]">
            Información de Contacto
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Representante"
            placeholder="Nombre completo"
            value={form.contact_name}
            onChange={e => set('contact_name', e.target.value)}
          />
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="correo@empresa.com"
            value={form.contact_email}
            onChange={e => set('contact_email', e.target.value)}
            icon={Mail}
          />
          <Input
            label="Teléfono Directo"
            placeholder="+52 (...) ..."
            value={form.contact_phone}
            onChange={e => set('contact_phone', e.target.value)}
            icon={Phone}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <FileEdit size={16} className="text-[#95B877]" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A1A1A6]">
            Notas y Observaciones
          </h3>
        </div>
        <textarea
          value={form.notes}
          placeholder="Detalles adicionales sobre el cliente o el proceso de venta..."
          onChange={e => set('notes', e.target.value)}
          rows={3}
          className="input-glass w-full px-4 py-3 text-sm resize-none rounded-card"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" isLoading={loading}>
          {initial ? 'Actualizar Archivo' : 'Finalizar Registro'}
        </Button>
      </div>
    </form>
  );
}

/* ─── Select Field ─── */

function SelectField({
  label, icon: Icon, value, onChange, options, iconTrailing = false,
}: {
  label: string;
  icon?: React.ComponentType<{ size?: number | string; className?: string }>;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  iconTrailing?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold text-[#A1A1A6] uppercase tracking-widest px-1">
        {label}
      </label>
      <div className="relative group">
        {Icon && !iconTrailing && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1A6]/80 size-4 pointer-events-none group-focus-within:text-[#95B877] transition-colors" size={14} />
        )}
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="input-glass w-full appearance-none"
          style={{ paddingLeft: Icon && !iconTrailing ? '2.5rem' : '1rem' }}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {Icon && iconTrailing && (
          <Icon className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1A6]/60 size-4 pointer-events-none" size={14} />
        )}
      </div>
    </div>
  );
}
