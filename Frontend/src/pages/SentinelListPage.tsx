import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { sentinelDB, architectureDB, clientsDB } from '../lib/supabase';
import type { Client } from '../lib/types';
import { Plus, Shield, AlertTriangle, Calendar, TrendingUp, X, CheckCircle2, AlertCircle } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const TIER_CONFIG: Record<string, { color: string; bg: string; border: string; monthly: number; label: string }> = {
  silver: { color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-400/30', monthly: 25000, label: 'Silver' },
  gold: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30', monthly: 45000, label: 'Gold' },
  platinum: { color: 'text-slate-300', bg: 'bg-slate-300/10', border: 'border-slate-300/30', monthly: 75000, label: 'Platinum' },
};

function calcHealth(kpis: any[]): number {
  if (!kpis || kpis.length === 0) return 0;
  const inMeta = kpis.filter((k: any) => {
    const lower = k.meta * 0.9;
    const upper = k.meta * 1.1;
    return k.actual >= lower && k.actual <= upper;
  }).length;
  return inMeta / kpis.length;
}

function calcAlerts(kpis: any[]): number {
  if (!kpis) return 0;
  return kpis.filter((k: any) => k.actual > k.meta * 1.2 || k.actual < k.meta * 0.8).length;
}

function formatCurrency(n: number | null): string {
  if (n == null) return '-';
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
}

function formatDate(d: string | null | undefined): string {
  if (!d) return 'Sin agendar';
  try {
    return new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return 'Sin agendar';
  }
}

function getStatusVariant(status: string): 'success' | 'warning' | 'danger' | 'neutral' {
  if (status === 'active') return 'success';
  if (status === 'paused') return 'warning';
  if (status === 'cancelled') return 'danger';
  return 'neutral';
}

export default function SentinelListPage() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    sentinelDB.list().then((data) => {
      setSubs(data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalMRR = useMemo(
    () => subs.filter((s) => s.status === 'active').reduce((sum, s) => sum + (s.monthly_fee || 0), 0),
    [subs]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-[#95B877]" />
            <h1 className="text-2xl font-bold text-[#F5F5F7]">
              Sentinel &mdash; Monitor
            </h1>
          </div>
          <p className="text-sm text-[#A1A1A6]">
            Supervisi&oacute;n continua de clientes Architecture.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-[#A1A1A6] font-medium">
              MRR Total
            </p>
            <p className="text-2xl font-bold text-[#95B877] tabular-nums leading-tight">
              {formatCurrency(totalMRR)}
            </p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            icon={<Plus size={15} />}
            variant="primary"
          >
            Nueva suscripci&oacute;n
          </Button>
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <div className="py-24 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#95B877] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#A1A1A6]">Cargando suscripciones&hellip;</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && subs.length === 0 && (
        <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0D0D0F] p-12 text-center">
          <Shield size={40} className="mx-auto mb-4 text-[#95B877] opacity-40" />
          <h3 className="text-lg font-semibold text-[#F5F5F7] mb-1">
            Sin suscripciones
          </h3>
          <p className="text-sm text-[#A1A1A6] mb-6 max-w-sm mx-auto">
            A&uacute;n no hay contratos Sentinel activos. Crea tu primera suscripci&oacute;n para un cliente con Architecture completado.
          </p>
          <Button onClick={() => setShowModal(true)} icon={<Plus size={15} />}>
            Nueva suscripci&oacute;n
          </Button>
        </div>
      )}

      {/* Subscription cards */}
      {!loading && subs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subs.map((sub) => (
            <SentinelCard
              key={sub.id}
              sub={sub}
              onClick={() => navigate(`/dashboard/sentinel/${sub.id}`)}
            />
          ))}
        </div>
      )}

      {/* Summary bar */}
      {!loading && subs.length > 0 && (
        <div className="flex items-center justify-between text-xs text-[#A1A1A6] pt-2">
          <span>{subs.length} suscripci{subs.length !== 1 ? 'ones' : 'n'}</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#95B877] inline-block" /> Active
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Paused
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF453A] inline-block" /> Cancelled
            </span>
          </div>
        </div>
      )}

      {/* Create subscription modal */}
      <AnimatePresence>
        {showModal && (
          <CreateSubscriptionModal
            currentSubs={subs}
            onClose={() => setShowModal(false)}
            onCreated={(id) => navigate(`/dashboard/sentinel/${id}`)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Subscription card ─── */

interface SentinelCardProps {
  sub: any;
  onClick: () => void;
}

function SentinelCard({ sub, onClick }: SentinelCardProps) {
  const tier = TIER_CONFIG[sub.tier] || TIER_CONFIG.silver;
  const health = calcHealth(sub.kpis);
  const alerts = calcAlerts(sub.kpis);
  const healthPct = Math.round(health * 100);

  const healthBarColor =
    health > 0.8 ? 'bg-[#95B877]' : health >= 0.5 ? 'bg-amber-400' : 'bg-[#FF453A]';

  const clientName = sub.clients?.name || sub.client_name || 'Sin cliente';
  const assignedName = sub.team_members?.full_name || sub.assigned_name || 'Sin asignar';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="cursor-pointer group rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0D0D0F] p-5 transition-all duration-200 hover:shadow-lg hover:border-[#95B877]/30"
    >
      {/* Top row: client name + status badge */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-[#F5F5F7] truncate group-hover:text-[#95B877] transition-colors">
            {clientName}
          </h3>
        </div>
        <Badge variant={getStatusVariant(sub.status)} size="sm">
          {sub.status}
        </Badge>
      </div>

      {/* Tier badge + monthly fee */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium ${tier.color} ${tier.bg} ${tier.border}`}
        >
          <Shield size={11} />
          {tier.label}
        </span>
        <span className="text-xs text-[#A1A1A6]">
          {formatCurrency(sub.monthly_fee)}/mes
        </span>
      </div>

      {/* KPI summary: 3-column mini stats */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="flex flex-col items-center rounded-lg bg-white/40 p-2">
          <TrendingUp size={14} className="text-[#95B877] mb-0.5" />
          <span className="text-lg font-bold text-[#F5F5F7] leading-none">
            {sub.kpis?.length || 0}
          </span>
          <span className="text-[10px] text-[#A1A1A6]">KPIs</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-white/40 p-2">
          <AlertTriangle
            size={14}
            className={`mb-0.5 ${alerts > 0 ? 'text-[#FF453A]' : 'text-[#A1A1A6]'}`}
          />
          <span className={`text-lg font-bold leading-none ${alerts > 0 ? 'text-[#FF453A]' : 'text-[#A1A1A6]'}`}>
            {alerts}
          </span>
          <span className="text-[10px] text-[#A1A1A6]">Alertas</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-white/40 p-2">
          <Calendar size={14} className="text-[#A1A1A6] mb-0.5" />
          <span className="text-[11px] font-medium text-[#F5F5F7] text-center leading-tight">
            {formatDate(sub.proxima_junta)}
          </span>
          <span className="text-[10px] text-[#A1A1A6]">Junta</span>
        </div>
      </div>

      {/* Health score bar */}
      {sub.kpis && sub.kpis.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] text-[#A1A1A6] mb-1">
            <span>Health Score</span>
            <span className="font-semibold">{healthPct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/60 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${healthBarColor}`}
              style={{ width: `${healthPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-[11px] text-[#A1A1A6] pt-2 border-t border-[rgba(255,255,255,0.08)]">
        <span className="flex items-center gap-1 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-[#95B877]/60 inline-block flex-shrink-0" />
          {assignedName}
        </span>
        <span className="flex-shrink-0">
          {new Date(sub.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Create subscription modal ─── */

interface CreateSubscriptionModalProps {
  currentSubs: any[];
  onClose: () => void;
  onCreated: (id: string) => void;
}

function CreateSubscriptionModal({ currentSubs, onClose, onCreated }: CreateSubscriptionModalProps) {
  const [availableClients, setAvailableClients] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('gold');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      clientsDB.list().catch(() => []),
      architectureDB.list().catch(() => []) as Promise<any[]>,
    ]).then(([allClients, archs]) => {
      if (cancelled) return;
      // Aceptamos proyectos en fase activa o completada como candidatos
      const eligibleStatuses = ['delivery', 'completed'];
      const eligibleClientIds = new Set(
        archs.filter((a: any) => eligibleStatuses.includes(a.status)).map((a: any) => a.client_id)
      );
      const subscribedClientIds = new Set(currentSubs.map((s: any) => s.client_id));
      const filtered = (allClients as Client[]).filter(
        (c) => eligibleClientIds.has(c.id) && !subscribedClientIds.has(c.id)
      );
      console.log('[Sentinel] candidates:', {
        totalClients: allClients.length,
        totalArchs: archs.length,
        eligible: [...eligibleClientIds],
        subscribed: [...subscribedClientIds],
        filtered: filtered.length,
      });
      setAvailableClients(filtered);
      setLoaded(true);
    });
    return () => { cancelled = true; };
  }, [currentSubs]);

  const handleCreate = async () => {
    if (!selectedClient || !selectedTier) return;
    setCreating(true);
    try {
      const tier = TIER_CONFIG[selectedTier];
      const newSub = await sentinelDB.create({
        client_id: selectedClient,
        status: 'active',
        tier: selectedTier as any,
        monthly_fee: tier.monthly,
        kpis: [],
        alertas_activas: 0,
        juntas_realizadas: 0,
        proxima_junta: null,
        assigned_to: null,
      });
      onCreated(newSub.id);
    } catch (e) {
      console.error('Failed to create subscription:', e);
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !creating && onClose()}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        className="relative w-full max-w-lg rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#0D0D0F] shadow-2xl p-6 space-y-5"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#F5F5F7] flex items-center gap-2">
            <Shield size={18} className="text-[#95B877]" />
            Nueva suscripci&oacute;n Sentinel
          </h2>
          <button
            onClick={() => !creating && onClose()}
            className="p-1 rounded-lg hover:bg-black/5 text-[#A1A1A6] transition-colors"
            disabled={creating}
          >
            <X size={18} />
          </button>
        </div>

        {/* Client selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-[#A1A1A6]">
            Cliente
          </label>
          {!loaded ? (
            <select
              disabled
              className="w-full h-10 rounded-lg border border-[rgba(255,255,255,0.08)] bg-white/60 px-3 text-sm text-[#A1A1A6]"
            >
              <option>Cargando clientes disponibles&hellip;</option>
            </select>
          ) : availableClients.length === 0 ? (
            <div className="rounded-lg border border-amber-300/30 bg-amber-400/5 p-3 flex items-start gap-2 text-xs text-amber-700">
              <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
              <span>
                No hay clientes con Architecture completado sin suscripci&oacute;n Sentinel.
              </span>
            </div>
          ) : (
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              disabled={creating}
              className="w-full h-10 rounded-lg border border-[rgba(255,255,255,0.08)] bg-white/60 px-3 text-sm text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#95B877]/30 focus:border-[#95B877] disabled:opacity-50"
            >
              <option value="">Seleccionar cliente&hellip;</option>
              {availableClients.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Tier selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-[#A1A1A6]">
            Tier
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['silver', 'gold', 'platinum'] as const).map((tier) => {
              const cfg = TIER_CONFIG[tier];
              const isSelected = selectedTier === tier;
              return (
                <button
                  key={tier}
                  disabled={creating}
                  onClick={() => setSelectedTier(tier)}
                  className={`rounded-xl border-2 p-3 text-center transition-all ${
                    isSelected
                      ? `${cfg.border} bg-[#0D0D0F] shadow-sm`
                      : 'border-[rgba(255,255,255,0.08)] hover:border-[#95B877]/30'
                  } disabled:opacity-50`}
                >
                  <p className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</p>
                  <p className="text-[11px] text-[#A1A1A6] mt-0.5">
                    {formatCurrency(cfg.monthly)}/mes
                  </p>
                  {isSelected && (
                    <CheckCircle2 size={14} className="mx-auto mt-1 text-[#95B877]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        {selectedClient && (
          <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-white/40 p-3 text-xs text-[#A1A1A6] space-y-1">
            <div className="flex justify-between">
              <span>Tier</span>
              <span className="font-medium text-[#F5F5F7]">{TIER_CONFIG[selectedTier].label}</span>
            </div>
            <div className="flex justify-between">
              <span>Mensual</span>
              <span className="font-medium text-[#F5F5F7]">{formatCurrency(TIER_CONFIG[selectedTier].monthly)}</span>
            </div>
            <div className="flex justify-between">
              <span>Anual estimado</span>
              <span className="font-semibold text-[#95B877]">{formatCurrency(TIER_CONFIG[selectedTier].monthly * 12)}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end pt-1">
          <Button variant="outline" onClick={onClose} disabled={creating}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={!selectedClient || creating}
            isLoading={creating}
          >
            Crear suscripci&oacute;n
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
