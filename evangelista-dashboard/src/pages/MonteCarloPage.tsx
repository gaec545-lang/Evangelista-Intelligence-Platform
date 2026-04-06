import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { sentinelDB } from '../lib/supabase';
import Button from '../components/ui/Button';
import { ArrowLeft, Shield, AlertTriangle, Play, XCircle, BarChart3, Activity, Zap, TrendingUp, Plus } from 'lucide-react';

export default function MonteCarloPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sub, setSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Monte Carlo state
  const [mcVariables, setMcVariables] = useState<Array<{ nombre: string; distribucion: string; parametros: Record<string, number> }>>([
    { nombre: 'Ingresos', distribucion: 'normal', parametros: { mean: 1000000, std: 150000 } },
    { nombre: 'Costos', distribucion: 'triangular', parametros: { min: 400000, mode: 600000, max: 800000 } },
    { nombre: 'Tasa de Conversion', distribucion: 'uniform', parametros: { min: 0.02, max: 0.08 } },
  ]);
  const [mcIterations, setMcIterations] = useState(10000);
  const [mcModelo, setMcModelo] = useState('ingresos - costos');
  const [mcRunning, setMcRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const [mcRemaining, setMcRemaining] = useState<number | null>(null);
  const [mcCooldown, setMcCooldown] = useState(false);
  const [mcProgress, setMcProgress] = useState<'prep' | 'computing' | 'analyzing' | null>(null);
  const [mcResults, setMcResults] = useState<any>(null);
  const [mcError, setMcError] = useState<string | null>(null);
  const [mcHistory, setMcHistory] = useState<any[]>([]);

  const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8001';

  useEffect(() => {
    if (!id) return;
    sentinelDB.get(id).then((data) => {
      setSub(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const validateVariables = (): string | null => {
    for (const v of mcVariables) {
      if (!v.nombre.trim()) return 'Todas las variables deben tener un nombre.';
      if (v.distribucion === 'normal') {
        if (typeof v.parametros.mean !== 'number' || typeof v.parametros.std !== 'number' || v.parametros.std <= 0) return 'Parámetros Normal inválidos.';
      } else if (v.distribucion === 'triangular') {
        if (typeof v.parametros.min !== 'number' || typeof v.parametros.mode !== 'number' || typeof v.parametros.max !== 'number') return 'Parámetros Triangular inválidos.';
      } else if (v.distribucion === 'uniform') {
        if (typeof v.parametros.min !== 'number' || typeof v.parametros.max !== 'number') return 'Parámetros Uniform inválidos.';
      }
    }
    return null;
  };

  const abortSimulation = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
      setMcRunning(false);
      setMcProgress(null);
      setMcError('Simulación cancelada.');
    }
  };

  const runSimulation = async () => {
    if (!id || mcVariables.length === 0) return;
    const err = validateVariables();
    if (err) return setMcError(err);
    if (mcCooldown) return setMcError('Espera el cooldown.');

    setMcRunning(true);
    setMcResults(null);
    setMcError(null);
    setMcProgress('prep');

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const session = useAuthStore.getState().session;
      const token = session?.access_token;
      if (!token) throw new Error('No activo');

      setTimeout(() => setMcProgress('computing'), 300);
      setTimeout(() => setMcProgress('analyzing'), 1200);

      const body = {
        subscription_id: id,
        iterations: mcIterations,
        variables: mcVariables,
        modelo_negocio: mcModelo?.trim() || null,
      };

      const res = await fetch(`${API_BASE}/api/v1/sentinel/${id}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        if (res.status === 429) {
          const retryAfter = errData?.detail?.retry_after || 60;
          setMcError(errData?.detail?.message || 'Demasiadas solicitudes.');
          setMcCooldown(true);
          setMcRemaining(retryAfter);
          let remaining = retryAfter;
          const interval = setInterval(() => {
            remaining--;
            setMcRemaining(remaining);
            if (remaining <= 0) { clearInterval(interval); setMcCooldown(false); }
          }, 1000);
        } else {
          setMcError(errData?.detail || 'Error en simulacion.');
        }
        return;
      }
      const data = await res.json();
      setMcResults(data);
      setMcHistory(p => [data, ...p].slice(0, 10));
    } catch (e: any) {
      if (e.name !== 'AbortError') setMcError('Error de conexión.');
    } finally {
      setMcRunning(false);
      setMcProgress(null);
      abortRef.current = null;
    }
  };

  if (loading) return <div className="p-10">Cargando...</div>;
  if (!sub) return <div className="p-10">Suscripcion no encontrada</div>;

  return (
    <div className="flex-1 space-y-6 max-w-5xl mx-auto p-4 sm:p-6 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(`/sentinel/${id}`)} className="p-2 hover:bg-white/5 rounded-lg transition-colors border border-white/5 bg-black/20">
          <ArrowLeft size={18} className="text-[#A1A1A6]" />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#F5F5F7]">Motor Monte Carlo — {sub.clients?.name}</h1>
          <p className="text-sm text-[#A1A1A6]">Análisis estocástico y simulación de riesgos financieros</p>
        </div>
      </div>

      <div className="bg-[#1C1C1E] rounded-xl border border-white/10 p-5">
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-2"><Shield className="text-[#95B877]" size={16}/> Variables de Riesgo</h2>
            <select className="bg-black/20 border border-white/10 p-1.5 rounded text-xs" value={mcIterations} onChange={e => setMcIterations(Number(e.target.value))}>
              <option value="1000">1,000 iteraciones</option>
              <option value="10000">10,000 iteraciones</option>
            </select>
          </div>
          {mcVariables.map((v, idx) => (
            <div key={idx} className="flex flex-wrap gap-2 items-end p-3 bg-black/20 rounded border border-white/5">
              <input className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white flex-1" value={v.nombre} onChange={e => setMcVariables(prev => prev.map((item, i) => i === idx ? { ...item, nombre: e.target.value } : item))} />
              <select className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white" value={v.distribucion} onChange={e => setMcVariables(prev => prev.map((item, i) => i === idx ? { ...item, distribucion: e.target.value } : item))}>
                <option value="normal">Normal</option><option value="triangular">Triangular</option><option value="uniform">Uniforme</option>
              </select>
              <div className="flex gap-2">
                {Object.entries(v.parametros).map(([k, val]) => (
                  <input key={k} className="w-16 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white" type="number" placeholder={k} value={val} onChange={e => setMcVariables(prev => prev.map((item, i) => i === idx ? { ...item, parametros: { ...item.parametros, [k]: Number(e.target.value) } } : item))} />
                ))}
              </div>
              <button className="text-red-400 hover:text-red-300" onClick={() => setMcVariables(prev => prev.filter((_, i) => i !== idx))}><XCircle size={16}/></button>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={() => setMcVariables(p => [...p, { nombre: 'Variable', distribucion: 'normal', parametros: { mean: 0, std: 1 } }])}>
            <Plus size={14}/> Agregar variable
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <label className="text-xs text-[#A1A1A6] mb-1 block">Modelo (Expresión Python)</label>
          <input className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm font-mono text-white" value={mcModelo} onChange={e => setMcModelo(e.target.value)} />
        </div>

        {mcError && <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm flex gap-2"><AlertTriangle size={16}/> {mcError}</div>}
        {mcRemaining !== null && mcCooldown && <div className="mt-4 p-3 bg-amber-900/20 border border-amber-500/50 rounded-lg text-amber-400 text-sm">Bloqueado. Reintente en {mcRemaining}s</div>}

        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="text-xs text-[#95B877] font-mono">{mcProgress || ''}</div>
          {mcRunning ? (
            <Button variant="ghost" onClick={abortSimulation}>Abortar</Button>
          ) : (
            <Button variant="primary" disabled={mcCooldown} onClick={runSimulation}><Play size={16} className="mr-2"/> Ejecutar Simulación</Button>
          )}
        </div>
      </div>

      {mcResults && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#1C1C1E] border border-white/10 p-4 rounded-xl text-center"><p className="text-xs text-gray-400 mb-1">Mediana</p><p className="text-xl font-bold text-white">${mcResults.statistics?.median?.toLocaleString('es-MX')}</p></div>
            <div className="bg-[#1C1C1E] border border-white/10 p-4 rounded-xl text-center"><p className="text-xs text-gray-400 mb-1">P10 (Pesimista)</p><p className="text-xl font-bold text-white">${mcResults.statistics?.p10?.toLocaleString('es-MX')}</p></div>
            <div className="bg-[#1C1C1E] border border-white/10 p-4 rounded-xl text-center"><p className="text-xs text-gray-400 mb-1">P90 (Optimista)</p><p className="text-xl font-bold text-white">${mcResults.statistics?.p90?.toLocaleString('es-MX')}</p></div>
            <div className="bg-[#1C1C1E] border border-white/10 p-4 rounded-xl text-center"><p className="text-xs text-gray-400 mb-1">VaR 95%</p><p className="text-xl font-bold text-white">${mcResults.statistics?.var_95?.toLocaleString('es-MX')}</p></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1C1C1E] border border-white/10 p-5 rounded-xl">
              <h3 className="font-semibold flex items-center gap-2 mb-4"><Activity size={16}/> Triggers de Riesgo</h3>
              <div className="space-y-3">
                {mcResults.triggers?.map((t: any, i: number) => (
                  <div key={i} className="p-3 border border-red-500/20 bg-red-500/5 rounded">
                    <p className="text-sm font-semibold text-red-400">[{t.severity}] Alerta</p>
                    <p className="text-xs text-white/70">{t.message}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#1C1C1E] border border-white/10 p-5 rounded-xl">
              <h3 className="font-semibold flex items-center gap-2 mb-4"><TrendingUp size={16}/> Recomendaciones (IA)</h3>
              <div className="space-y-3">
                {mcResults.recommendations?.map((r: any, i: number) => (
                  <div key={i} className="p-3 border border-[#95B877]/20 bg-[#95B877]/5 rounded">
                    <p className="text-sm font-semibold text-[#95B877]">{r.action}</p>
                    <p className="text-xs text-white/70">Impacto: {r.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
