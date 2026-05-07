import { useState } from 'react';
import { Input } from './ui/Input';
import Button from './ui/Button';
import { Calculator, Building2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProposalFormData {
  client_name: string;
  sector: string;
  sucursales: number;
  sistemas_erp: number;
  erp_type: string;
  city: string;
  registros: number;
  contact_name: string;
  type: 'foundation' | 'architecture';
  tone: 'profesional' | 'agresivo' | 'conservador' | 'conciliador';
}

interface Props {
  initialData?: Partial<ProposalFormData>;
  onGenerate: (data: ProposalFormData) => Promise<void>;
  loading?: boolean;
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
    tone: initialData?.tone ?? 'profesional',
  });

  const gamma = 1 + 0.5 * form.sucursales + 0.2 * form.sistemas_erp;
  const set = <K extends keyof ProposalFormData>(k: K, v: ProposalFormData[K]) => setForm(p => ({ ...p, [k]: v }));

  const tones = [
    { id: 'profesional', label: 'Profesional', desc: 'Equilibrado y técnico' },
    { id: 'agresivo', label: 'Agresivo', desc: 'Enfoque en ROI rápido' },
    { id: 'conservador', label: 'Conservador', desc: 'Riesgo bajo y solidez' },
    { id: 'conciliador', label: 'Conciliador', desc: 'Acompañamiento y equipo' },
  ];

  return (
    <form onSubmit={e => { e.preventDefault(); onGenerate(form); }} className="space-y-7">
      {/* Type Selector */}
      <div
        className="flex p-1 rounded-button"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {(['foundation', 'architecture'] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => set('type', t)}
            className="flex-1 py-2.5 rounded-button text-[10px] font-semibold uppercase tracking-widest transition-all duration-200"
            style={{
              background: form.type === t ? 'rgba(149,184,119,0.15)' : 'transparent',
              color: form.type === t ? '#A8CC8D' : '#636366',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Datos Maestros */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 px-1">
          <Building2 size={14} className="text-primary-500" />
          <h3 className="text-xs font-semibold text-content-secondary uppercase tracking-widest">Datos Maestros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <Input
              label="Razón Social / Empresa *"
              value={form.client_name}
              onChange={e => set('client_name', e.target.value)}
              required
            />
          </div>
          <Input
            label="Representante"
            placeholder="Nombre de contacto"
            value={form.contact_name}
            onChange={e => set('contact_name', e.target.value)}
          />
          <Input
            label="Ciudad Sede"
            value={form.city}
            onChange={e => set('city', e.target.value)}
          />
        </div>
      </div>

      {/* Tono Narrativo */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Sparkles size={14} className="text-accent-gold" />
          <h3 className="text-xs font-semibold text-content-secondary uppercase tracking-widest">Tono Narrativo (IA)</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {tones.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => set('tone', t.id as any)}
              className={`p-3 rounded-lg border text-left transition-all ${
                form.tone === t.id 
                  ? 'bg-eva-olive/10 border-eva-olive text-eva-olive' 
                  : 'bg-white/5 border-eva-border text-eva-txt-muted'
              }`}
            >
              <p className="text-[10px] font-bold uppercase">{t.label}</p>
              <p className="text-[9px] opacity-70 leading-tight mt-1">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Parámetros Técnicos */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 px-1">
          <Calculator size={14} className="text-primary-500" />
          <h3 className="text-xs font-semibold text-content-secondary uppercase tracking-widest">Parámetros Técnicos</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          <Input
            label="Sucursales"
            type="number"
            min={1}
            value={form.sucursales}
            onChange={e => set('sucursales', Number(e.target.value))}
          />
          <Input
            label="Sistemas ERP"
            type="number"
            min={0}
            value={form.sistemas_erp}
            onChange={e => set('sistemas_erp', Number(e.target.value))}
          />
          <div className="col-span-2 md:col-span-1">
            <Input
              label="Volumen Datos"
              type="number"
              value={form.registros}
              onChange={e => set('registros', Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Dynamic Summary */}
      <motion.div
        className="rounded-card p-5 overflow-hidden relative"
        style={{
          background: 'rgba(149,184,119,0.06)',
          border: '1px solid rgba(149,184,119,0.12)',
        }}
      >
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-[9px] font-semibold text-primary-600/70 uppercase tracking-widest mb-1">Impacto Logístico</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-primary-600 tracking-tight">Γ {gamma.toFixed(2)}</span>
              <span className="text-[11px] text-primary-500/60">Coeficiente</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-semibold text-content-secondary/60 uppercase tracking-widest mb-1">Estrategia</p>
            <p className="text-sm font-semibold text-content-primary capitalize">{form.type}</p>
          </div>
        </div>
        <Sparkles className="absolute right-0 bottom-0 size-16 text-primary-500/5 -mr-3 -mb-3" />
      </motion.div>

      <Button
        type="submit"
        isLoading={loading}
        size="lg"
        className="w-full"
      >
        Lanzar Generador de Propuesta
      </Button>
    </form>
  );
}
