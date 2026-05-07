import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sentinelDB, architectureDB } from '../lib/supabase';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import {
  ArrowLeft, TrendingUp, AlertTriangle, Calendar,
  Plus, CheckCircle, XCircle, TrendingDown, Minus, ExternalLink,
  Play, BarChart3, Activity, Shield, Zap,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { agentActions } from '../lib/agentActions';

type Tab = 'kpis' | 'alertas' | 'junta' | 'simulacion';
const TABS: { key: Tab; label: string; icon: React.ComponentType<any> }[] = [
  { key: 'kpis', label: 'KPIs', icon: TrendingUp },
  { key: 'alertas', label: 'Alertas', icon: AlertTriangle },
  { key: 'junta', label: 'Junta Consejo', icon: Calendar },
  { key: 'simulacion', label: 'Simulación MC', icon: BarChart3 },
];

const TIER_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  silver: { label: 'Silver', color: 'text-gray-500', bg: 'bg-gray-100', border: 'border-gray-200' },
  gold: { label: 'Gold', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  platinum: { label: 'Platinum', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-300' },
};

function fmt(n: number | null) {
  if (n == null) return '-';
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
}

function statusVariant(s: string): 'success' | 'warning' | 'danger' | 'neutral' {
  return s === 'active' ? 'success' : s === 'paused' ? 'warning' : s === 'cancelled' ? 'danger' : 'neutral';
}

function trendIcon(t: string) {
  if (t === 'up') return <TrendingUp size={16} className="text-emerald-600" />;
  if (t === 'down') return <TrendingDown size={16} className="text-[#FF453A]" />;
  return <Minus size={16} className="text-gray-400" />;
}

function calcHealth(kpis: any[]) {
  if (!kpis?.length) return 0;
  return kpis.filter((k: any) => k.actual >= k.meta * 0.9 && k.actual <= k.meta * 1.1).length / kpis.length;
}

export default function SentinelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session } = useAuthStore();
  const [sub, setSub] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>('kpis');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showKpiForm, setShowKpiForm] = useState(false);
  const [kpiForm, setKpiForm] = useState({ nombre: '', formula: '', actual: '', meta: 0, tendencia: 'stable' as string });
  const [archInfo, setArchInfo] = useState<any>(null);

  // Estocástico movido a MonteCarloPage.tsx

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    if (!id) return;
    sentinelDB.get(id).then((data) => {
      setSub(data);
      if (data?.architecture_id) {
        architectureDB.get(data.architecture_id).then(setArchInfo).catch(() => {});
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (updates: any) => {
    if (!sub || !id) return;
    setSaving(true);
    try {
      const u = await sentinelDB.update(id, updates);
      setSub((p: any) => ({ ...p, ...updates, updated_at: u?.updated_at ?? p?.updated_at }));
    } finally { setSaving(false); }
  };

  const kpis: any[] = sub?.kpis || [];
  const tier = TIER_META[sub?.tier] || TIER_META.gold;

  /* ── KPI management ── */
  const addKpi = async () => {
    if (!kpiForm.nombre) return;
    const newKpi = { nombre: kpiForm.nombre, formula: kpiForm.formula, meta: Number(kpiForm.actual) || 0, actual: Number(kpiForm.actual) || 0, tendencia: kpiForm.tendencia, alerta: false };
    const updated = [...kpis, newKpi];
    const alerts = updated.filter((k: any) => k.actual > k.meta * 1.2 || k.actual < k.meta * 0.8).length;
    handleUpdate({ kpis: updated, alertas_activas: alerts });
    setShowKpiForm(false);
    setKpiForm({ nombre: '', formula: '', actual: '', meta: 0, tendencia: 'stable' });
  };

  const toggleKpiAlert = async (idx: number) => {
    const updated = [...kpis];
    updated[idx].alerta = !updated[idx].alerta;
    const alerts = updated.filter((k: any) => k.alerta).length;
    handleUpdate({ kpis: updated, alertas_activas: alerts });
  };

  const editKpiValue = async (idx: number, value: number) => {
    const updated = [...kpis];
    updated[idx].actual = value;
    if (updated[idx].actual > updated[idx].meta * 1.2 || updated[idx].actual < updated[idx].meta * 0.8) {
      updated[idx].tendencia = value < updated[idx].meta ? 'down' : 'up';
      updated[idx].alerta = true;
    } else {
      updated[idx].tendencia = 'stable';
      updated[idx].alerta = false;
    }
    const alerts = updated.filter((k: any) => k.alerta).length;
    handleUpdate({ kpis: updated, alertas_activas: alerts });
  };

  const deleteKpi = async (idx: number) => {
    const updated = kpis.filter((_: any, i: number) => i !== idx);
    const alerts = updated.filter((k: any) => k.alerta).length;
    handleUpdate({ kpis: updated, alertas_activas: alerts });
  };



  if (loading) return <div className="flex justify-center py-24"><div className="animate-spin w-6 h-6 border-2 border-[#95B877] border-t-transparent rounded-full" /></div>;
  if (!sub) return <div className="text-center py-16 text-[#A1A1A6]">Suscripci\u00f3n no encontrada.</div>;

  const clientName = sub.clients?.name || 'Cliente';
  const health = calcHealth(kpis);
  const healthPct = Math.round(health * 100);
  const healthColor = health > 0.8 ? 'bg-emerald-500' : health >= 0.5 ? 'bg-amber-400' : 'bg-[#FF453A]';
  const alertKpis = kpis.filter((k: any) => k.alerta);

  return (
    <div className="flex gap-6">
      {/* Main content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/sentinel')} className="p-1 hover:bg-[#0D0D0F] rounded transition-colors">
              <ArrowLeft size={18} className="text-[#A1A1A6]" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-serif font-medium text-[#F5F5F7]">Sentinel — {clientName}</h1>
                <Badge variant={statusVariant(sub.status)}>{sub.status}</Badge>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${tier.bg} ${tier.color} border ${tier.border}`}>{tier.label}</span>
              </div>
              <p className="text-sm text-[#A1A1A6] mt-1">{fmt(sub.monthly_fee)}/mes · Alertas: {alertKpis.length} · Próxima junta: {sub.proxima_junta ? new Date(sub.proxima_junta).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Sin agendar'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#95B877]">{fmt(sub.monthly_fee)}</p>
            <p className="text-xs text-[#A1A1A6]">MRR</p>
          </div>
        </div>

        {/* Health bar */}
        {kpis.length > 0 && (
          <div className="bg-[#1C1C1E] rounded-xl border border-[rgba(255,255,255,0.08)] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#F5F5F7]">Health Score</span>
              <span className="text-sm font-bold" style={{ color: health > 0.8 ? '#059669' : health >= 0.5 ? '#D97706' : '#DC2626' }}>{healthPct}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full transition-all ${healthColor}`} style={{ width: `${healthPct}%` }} /></div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-[#0D0D0F]/50 p-1 rounded-lg">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all ${activeTab === t.key ? 'bg-[#1C1C1E] shadow-sm text-[#F5F5F7] font-medium' : 'text-[#A1A1A6] hover:text-[#F5F5F7]'}`}>
              <t.icon size={14} />{t.label}
            </button>
          ))}
        </div>

        {/* Tab: KPIs */}
        {activeTab === 'kpis' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#F5F5F7]">{kpis.length} KPIs monitoreados</h2>
              <Button size="sm" variant="outline" onClick={() => setShowKpiForm(!showKpiForm)}><Plus size={14} className="mr-1"/> KPI</Button>
            </div>
            {showKpiForm && (
              <div className="bg-[#1C1C1E] rounded-xl border border-[rgba(255,255,255,0.08)] p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1C1C1E] text-sm text-[#F5F5F7] placeholder-[#A1A1A6]" placeholder="Nombre del KPI" value={kpiForm.nombre} onChange={e => setKpiForm(f => ({ ...f, nombre: e.target.value }))} />
                  <input className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1C1C1E] text-sm text-[#F5F5F7] placeholder-[#A1A1A6]" placeholder="Fórmula" value={kpiForm.formula} onChange={e => setKpiForm(f => ({ ...f, formula: e.target.value }))} />
                  <input className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1C1C1E] text-sm text-[#F5F5F7] placeholder-[#A1A1A6]" type="number" placeholder="Meta" value={kpiForm.meta} onChange={e => setKpiForm(f => ({ ...f, meta: Number(e.target.value) }))} />
                  <select className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1C1C1E] text-sm text-[#F5F5F7]" value={kpiForm.tendencia} onChange={e => setKpiForm(f => ({ ...f, tendencia: e.target.value }))}>
                    <option value="up">Tendencia ↑</option><option value="down">Tendencia ↓</option><option value="stable">Estable →</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={addKpi}>Agregar</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowKpiForm(false)}>Cancelar</Button>
                </div>
              </div>
            )}
            {kpis.length === 0 && !showKpiForm && (
              <div className="text-center py-12 text-[#A1A1A6] text-sm border-2 border-dashed border-[rgba(255,255,255,0.08)] rounded-xl">Sin KPIs configurados. Agrega KPIs para monitorear.</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {kpis.map((kpi: any, i: number) => {
                const pct = kpi.meta > 0 ? Math.min(100, (kpi.actual / kpi.meta) * 100) : 0;
                const barColor = kpi.alerta ? 'bg-[#FF453A]' : pct >= 90 ? 'bg-emerald-500' : 'bg-amber-400';
                return (
                  <div key={i} className={`bg-[#1C1C1E] rounded-xl border p-4 ${kpi.alerta ? 'border-[#FF453A]/30 bg-red-50/30' : 'border-[rgba(255,255,255,0.08)]'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#F5F5F7]">{kpi.nombre}</p>
                        {trendIcon(kpi.tendencia)}
                      </div>
                      <div className="flex items-center gap-1">
                        {kpi.alerta && <Badge variant="danger" dot={false}>Alerta</Badge>}
                        <button onClick={() => deleteKpi(i)} className="p-1 text-gray-400 hover:text-[#FF453A] transition-colors"><XCircle size={14} /></button>
                      </div>
                    </div>
                    <div className="flex items-end justify-between mb-2">
                      <div>
                        <p className="text-2xl font-bold text-[#F5F5F7]">{kpi.actual?.toLocaleString('es-MX') ?? '-'}</p>
                        <p className="text-xs text-[#A1A1A6]">Meta: {kpi.meta?.toLocaleString('es-MX')}</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2"><div className={`h-1.5 rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} /></div>
                    <div className="flex items-center gap-2">
                      <input className="w-20 px-2 py-1 rounded border border-[rgba(255,255,255,0.08)] bg-[#1C1C1E] text-xs text-[#F5F5F7] placeholder-[#A1A1A6]" type="number" placeholder="Valor" onKeyDown={e => { if (e.key === 'Enter') { const v = Number((e.target as HTMLInputElement).value); if (!isNaN(v)) editKpiValue(i, v); } }} />
                      <button onClick={() => toggleKpiAlert(i)} className={`text-xs px-2 py-1 rounded border transition-colors ${kpi.alerta ? 'bg-[#FF453A]/10 border-[#FF453A]/20 text-[#FF453A]' : 'border-[rgba(255,255,255,0.08)] text-[#A1A1A6]'}`}>
                        {kpi.alerta ? 'Quitar alerta' : 'Marcar alerta'}
                      </button>
                    </div>
                    {kpi.formula && <p className="text-[10px] font-mono text-[#A1A1A6] mt-1">{kpi.formula}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab: Alertas */}
        {activeTab === 'alertas' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-[#F5F5F7]">{alertKpis.length} alertas activas</h2>
            {alertKpis.length === 0 && (
              <div className="text-center py-12 text-[#A1A1A6] text-sm bg-green-50/50 rounded-xl border border-emerald-200">
                <CheckCircle size={24} className="mx-auto mb-2 text-emerald-500" />Sin alertas activas. Los KPIs están dentro del rango esperado.
              </div>
            )}
            {alertKpis.map((kpi: any, i: number) => (
              <div key={i} className="bg-[#1C1C1E] rounded-xl border border-[#FF453A]/20 bg-red-50/20 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-[#FF453A] mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#F5F5F7]">{kpi.nombre}</p>
                    <p className="text-xs text-[#A1A1A6] mt-1">Valor actual: <span className="font-bold text-[#FF453A]">{kpi.actual?.toLocaleString('es-MX')}</span> vs Meta: {kpi.meta?.toLocaleString('es-MX')}</p>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { /* placeholder: RAG recommendation */ }}>
                        Generar recomendación IA
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Junta de Consejo */}
        {activeTab === 'junta' && (
          <div className="space-y-6">
            {/* Próxima junta */}
            <div className="bg-[#1C1C1E] rounded-xl border border-[rgba(255,255,255,0.08)] p-5">
              <h3 className="text-sm font-semibold text-[#F5F5F7] mb-3">Próxima Junta de Consejo</h3>
              <div className="flex items-center gap-4">
                <input className="w-full max-w-56 px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1C1C1E] text-sm text-[#F5F5F7]" type="date" value={sub.proxima_junta?.split('T')[0] ?? ''} onChange={e => handleUpdate({ proxima_junta: e.target.value })} />
                <span className="text-xs text-[#A1A1A6]">{sub.juntas_realizadas || 0} juntas realizadas</span>
              </div>
            </div>
            {/* Generar agenda */}
            <div className="bg-[#1C1C1E] rounded-xl border border-[rgba(255,255,255,0.08)] p-5">
              <h3 className="text-sm font-semibold text-[#F5F5F7] mb-2">Generar Agenda</h3>
              <p className="text-xs text-[#A1A1A6] mb-3">Genera la agenda para la junta de consejo basada en los KPIs actuales, alertas activas y tendencias.</p>
              <Button size="sm" disabled={saving} onClick={async () => {
                setSaving(true);
                try {
                  const res = await agentActions.generarAgendaJunta({ cliente_nombre: clientName, kpis, alertas_activas: alertKpis.length });
                  alert("Agenda Generada (Ver Consola)\n\n" + res.response.substring(0, 100) + '...');
                  console.log(res.response);
                } finally { setSaving(false); }
              }}>
                <Calendar size={14} className="mr-1" />{' '}Generar agenda con IA
              </Button>
              <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.08)]">
                <Button size="sm" variant="outline" disabled={saving} onClick={async () => {
                  setSaving(true);
                  try {
                    const res = await agentActions.generarReporteMensual({ cliente_nombre: clientName, mes: new Date().toISOString(), kpis });
                    alert("Reporte Mensual Generado (Ver Consola)\n\n" + res.response.substring(0, 100) + '...');
                    console.log(res.response);
                  } finally { setSaving(false); }
                }}>
                  Generar reporte mensual
                </Button>
              </div>
            </div>
            {/* Incrementar juntas */}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleUpdate({ juntas_realizadas: (sub.juntas_realizadas || 0) + 1 })} icon={<Plus size={14} />}>
                Registrar junta realizada
              </Button>
            </div>
          </div>
        )}

        {/* Tab: Simulacion Monte Carlo */}
        {activeTab === 'simulacion' && (
          <div className="bg-[#1C1C1E] rounded-xl border border-[rgba(255,255,255,0.08)] p-8 text-center space-y-4">
            <BarChart3 size={48} className="mx-auto text-[#95B877] opacity-80" />
            <h2 className="text-xl font-serif text-[#F5F5F7]">Motor Estocástico</h2>
            <p className="text-sm text-[#A1A1A6] max-w-md mx-auto">
              El análisis estocástico y simulación de riesgos financieros se ha migrado a un motor dedicado para mayor rendimiento.
            </p>
            <Button size="lg" variant="primary" onClick={() => navigate(`/sentinel/${id}/montecarlo`)} icon={<Play size={16} />}>
              Abrir Motor Monte Carlo
            </Button>
          </div>
        )}
      </div>

      {/* Right sidebar */}
      <div className="w-80 shrink-0 space-y-4">
        <div className="bg-[#1C1C1E] rounded-xl border border-[rgba(255,255,255,0.08)] p-4">
          <h3 className="text-sm font-semibold text-[#F5F5F7] mb-3">Información</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-[#A1A1A6]">Tier</span><span className="font-medium">{tier.label}</span></div>
            <div className="flex justify-between"><span className="text-[#A1A1A6]">Status</span><Badge variant={statusVariant(sub.status)} size="sm" dot={false}>{sub.status}</Badge></div>
            <div className="flex justify-between"><span className="text-[#A1A1A6]">MRR</span><span className="font-medium">{fmt(sub.monthly_fee)}</span></div>
            <div className="flex justify-between"><span className="text-[#A1A1A6]">KPIs</span><span className="font-medium">{kpis.length}</span></div>
            <div className="flex justify-between"><span className="text-[#A1A1A6]">Health</span><span className="font-medium" style={{ color: health > 0.8 ? '#059669' : health >= 0.5 ? '#D97706' : '#DC2626' }}>{healthPct}%</span></div>
            <div className="flex justify-between"><span className="text-[#A1A1A6]">Juntas</span><span className="font-medium">{sub.juntas_realizadas || 0}</span></div>
          </div>
        </div>
        {/* Architecture link */}
        {archInfo && (
          <div className="bg-[#1C1C1E] rounded-xl border border-[rgba(255,255,255,0.08)] p-4">
            <h3 className="text-sm font-semibold text-[#F5F5F7] mb-2">Architecture</h3>
            <p className="text-sm text-[#F5F5F7]">{archInfo.clients?.name || 'Proyecto'}</p>
            <p className="text-xs text-[#A1A1A6] mb-2">Fase: {archInfo.status}</p>
            <button onClick={() => navigate(`/architecture/${archInfo.id}`)} className="text-xs text-[#95B877] flex items-center gap-1">
              Ver proyecto <ExternalLink size={12} />
            </button>
          </div>
        )}
        {/* Status change */}
        <div className="bg-[#1C1C1E] rounded-xl border border-[rgba(255,255,255,0.08)] p-4">
          <h3 className="text-sm font-semibold text-[#F5F5F7] mb-3">Cambiar status</h3>
          <div className="space-y-2">
            {['active', 'paused', 'cancelled'].map((s) => (
              <button key={s} disabled={sub.status === s} onClick={() => handleUpdate({ status: s })} className={`w-full py-2 text-sm rounded-lg border transition-all ${sub.status === s ? 'border-[#95B877] bg-[#95B877]/10 text-[#95B877] font-medium' : 'border-[rgba(255,255,255,0.08)] text-[#A1A1A6] hover:bg-[#0D0D0F]'}`}>
                {s === 'active' ? 'Activa' : s === 'paused' ? 'Pausada' : 'Cancelada'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
