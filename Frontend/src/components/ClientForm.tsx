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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Razón Social / Empresa *"
            placeholder="Ej. Textiles del Centro S.A."
            value={form.name}
            onChange={e => set('name', e.target.value)}
            required
            autoFocus
            variant="dark"
          />
        </div>

        <SelectField
          label="Sector Industrial *"
          icon={Building2}
          value={form.sector}
          onChange={v => set('sector', v)}
          options={SECTORS.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
          variant="dark"
        />

        <Input
          label="Ciudad sede"
          placeholder="Ej. Puebla, Cholula"
          value={form.city}
          onChange={e => set('city', e.target.value)}
          icon={MapPin}
          iconTrailing
          variant="dark"
        />
      </div>

      {/* Operative Metrics - Boxed */}
      <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-5 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Calculator size={14} className="text-eva-gold" />
          <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 font-bold">
            Métricas Operativas
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nº Sucursales"
            type="number"
            min={1}
            value={form.sucursales}
            onChange={e => set('sucursales', Number(e.target.value))}
            variant="dark"
          />
          <Input
            label="Sistemas RAG/ERP"
            type="number"
            min={0}
            value={form.sistemas_erp}
            onChange={e => set('sistemas_erp', Number(e.target.value))}
            variant="dark"
          />

          <div className="md:col-span-2">
            <SelectField
              label="Plataforma ERP Principal"
              icon={Globe}
              value={form.erp_type ?? ''}
              onChange={v => set('erp_type', v)}
              options={ERP_TYPES.map(t => ({ value: t, label: t }))}
              variant="dark"
            />
          </div>
        </div>

        {/* Γ Factor Result */}
        <div className="bg-eva-gold/[0.03] border border-eva-gold/20 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-[9px] font-bold text-eva-gold uppercase tracking-[0.15em]">
              Evangelista Factor Γ
            </p>
            <p className="font-ui text-[11px] text-white/50 mt-0.5">
              Complejidad logística estimada
            </p>
          </div>
          <div className="text-right">
            <span className="font-brand text-2xl font-bold text-eva-gold tracking-tighter">{gamma.toFixed(2)}</span>
            <p className="font-mono text-[8px] font-bold text-eva-gold/40">INDEX</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <User size={14} className="text-eva-gold" />
          <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 font-bold">
            Representante Legal
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre Completo"
            placeholder="Ej. Juan Pérez"
            value={form.contact_name}
            onChange={e => set('contact_name', e.target.value)}
            variant="dark"
          />
          <Input
            label="Email Directo"
            type="email"
            placeholder="correo@empresa.com"
            value={form.contact_email}
            onChange={e => set('contact_email', e.target.value)}
            icon={Mail}
            variant="dark"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <FileEdit size={14} className="text-eva-gold" />
          <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 font-bold">
            Observaciones Internas
          </h3>
        </div>
        <textarea
          value={form.notes}
          placeholder="Anotaciones extra sobre el perfil del cliente..."
          onChange={e => set('notes', e.target.value)}
          rows={3}
          className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] font-ui text-white placeholder:text-white/20 focus:outline-none focus:border-eva-gold/50 focus:ring-2 focus:ring-eva-gold/5 transition-all resize-none"
        />
      </div>


      {/* Footer Actions */}
      <div className="flex gap-3 justify-end pt-6 border-t border-white/[0.08]">
        <Button variant="outline" onClick={onCancel} size="md" className="text-white/60 hover:text-white border-white/10 hover:bg-white/5">
          Cancelar
        </Button>
        <Button type="submit" isLoading={loading} size="md" variant="primary" className="bg-eva-gold text-eva-black hover:bg-eva-gold/90 border-none">
          {initial ? 'Guardar Cambios' : 'Confirmar Registro'}
        </Button>
      </div>
    </form>
  );
}

/* ─── Private Components ─── */

function SelectField({
  label, icon: Icon, value, onChange, options, iconTrailing = false, variant = 'light',
}: {
  label: string;
  icon?: React.ComponentType<{ size?: number | string; className?: string }>;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  iconTrailing?: boolean;
  variant?: 'light' | 'dark';
}) {
  const isDark = variant === 'dark';
  return (
    <div className="flex flex-col gap-1.5">
      <label className={`font-ui text-[12px] font-semibold px-0.5 ${isDark ? 'text-white/60' : 'text-eva-txt-mid'}`}>
        {label}
      </label>
      <div className="relative group">
        {Icon && !iconTrailing && (
          <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none transition-colors ${isDark ? 'text-white/30 group-focus-within:text-eva-gold' : 'text-eva-txt-muted group-focus-within:text-eva-olive'}`} />
        )}
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`
            w-full h-[41px] rounded-lg font-ui text-[13px] transition-all appearance-none pr-8
            ${isDark 
              ? 'bg-black border-white/[0.1] text-white focus:border-eva-gold/50 focus:ring-2 focus:ring-eva-gold/5 select-dark' 
              : 'bg-eva-beige border border-eva-border-2 text-eva-black focus:border-eva-olive focus:ring-2 focus:ring-eva-olive/8'
            }
          `}

          style={{ paddingLeft: Icon && !iconTrailing ? '2.5rem' : '1rem' }}
        >
          {options.map(o => <option key={o.value} value={o.value} className={isDark ? 'bg-[#1a1a1a] text-white' : ''}>{o.label}</option>)}
        </select>
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-white/30' : 'text-eva-txt-faint'}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

