import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { foundationDB } from '../lib/supabase';
import type { Hallazgo, TeamMember } from '../lib/types';
import {
  ArrowLeft,
  Calendar,
  FileText,
  Calculator,
  ShieldCheck,
  Save,
  Plus,
  Wand2,
} from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import DocumentDownloader from '../components/DocumentDownloader';
import CitaPipeline from '../components/foundation/CitaPipeline';
import ScopingCalculator from '../components/foundation/ScopingCalculator';
import DataUploadWizard from '../components/foundation/DataUploadWizard';
import { HallazgoCard } from '../components/foundation/HallazgoCard';
import { VettingCheck } from '../components/foundation/VettingCheck';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { agentActions } from '../lib/agentActions';

type Tab = 'pipeline' | 'scoping' | 'dictamen' | 'vetting';

const TABS: { key: Tab; label: string; icon: React.ComponentType<any> }[] = [
  { key: 'pipeline', label: 'Pipeline', icon: Calendar },
  { key: 'scoping', label: 'Scoping', icon: Calculator },
  { key: 'dictamen', label: 'Dictamen', icon: FileText },
  { key: 'vetting', label: 'Vetting Gate', icon: ShieldCheck },
];

function getStatusBadgeVariant(status: string): 'success' | 'primary' | 'warning' | 'danger' | 'neutral' {
  const s = status.toLowerCase();
  if (s.startsWith('cita_') || s.endsWith('_done') || s === 'closed_go') return 'success';
  if (s === 'scoping' || s === 'immersion') return 'primary';
  if (s === 'vetting_gate') return 'warning';
  if (s === 'closed_nogo' || s === 'closed_lost') return 'danger';
  return 'neutral';
}

export default function FoundationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [engagement, setEngagement] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>('pipeline');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notasInternas, setNotasInternas] = useState('');
  const [editingHallazgo, setEditingHallazgo] = useState<Hallazgo | null>(null);
  const [showDataWizard, setShowDataWizard] = useState(false);
  const [autoDetected, setAutoDetected] = useState<any>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hallazgoForm, setHallazgoForm] = useState({
    nombre: '',
    costo_anual: '',
    criticidad: 'medio' as Hallazgo['criticidad'],
    metodo_deteccion: 'observacion' as Hallazgo['metodo_deteccion'],
    descripcion: '',
    atendible_architecture: false,
  });

  useEffect(() => {
    if (!id) return;
    foundationDB.get(id).then((data) => {
      setEngagement(data);
      setNotasInternas(data?.notas_internas ?? '');
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleUpdate = useCallback(
    async (updates: any) => {
      if (!engagement || !id) return;
      setSaving(true);
      setSaveError(null);
      try {
        const updated = await foundationDB.update(id, updates);
        setEngagement((prev: any) => ({ ...prev, ...updates, updated_at: updated?.updated_at ?? prev?.updated_at }));
      } catch (err: any) {
        console.error('Error al guardar scoping:', err);
        setSaveError(err.message || 'Error desconocido al guardar');
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [engagement, id]
  );

  const handleDictamenUpdate = async (updates: any) => {
    if (!engagement || !id) return;
    setSaving(true);
    setSaveError(null);
    try {
      const combined = { ...engagement, ...updates };
      await foundationDB.update(id, {
        hallazgos: combined.hallazgos,
        dictamen_total_impacto: combined.dictamen_total_impacto,
      });
      setEngagement(combined);
    } catch (err: any) {
      console.error('Error al guardar dictamen:', err);
      setSaveError(err.message || 'Error desconocido al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleAutoDetected = (params: any) => {
    setAutoDetected(params);
    setShowDataWizard(false);
    if (!engagement || !id) return;
    handleUpdate({
      sucursales: params.sucursales,
      registros_estimados: params.registros_estimados,
      fuentes_datos: params.fuentes_datos,
      nodo_critico: params.nodo_critico,
    });
  };

  const nextHallazgoId = (): string => {
    const hallazgos: Hallazgo[] = engagement?.hallazgos ?? [];
    const num = hallazgos.length + 1;
    return `H-${num.toString().padStart(2, '0')}`;
  };

  const generateHallazgo = (): Hallazgo => ({
    id: nextHallazgoId(),
    nombre: hallazgoForm.nombre,
    costo_anual: parseFloat(hallazgoForm.costo_anual) || 0,
    criticidad: hallazgoForm.criticidad,
    metodo_deteccion: hallazgoForm.metodo_deteccion,
    descripcion: hallazgoForm.descripcion,
    atendible_architecture: hallazgoForm.atendible_architecture,
  });

  const handleAddHallazgo = async () => {
    if (!hallazgoForm.nombre.trim()) return;
    const newHallazgo = generateHallazgo();
    const existing = engagement?.hallazgos ?? [];
    const hallazgos = [...existing, newHallazgo];
    const total = hallazgos.reduce((s: number, h: { costo_anual: number }) => s + h.costo_anual, 0);
    await handleDictamenUpdate({ hallazgos, dictamen_total_impacto: total });
    setShowForm(false);
    setEditingHallazgo(null);
    setHallazgoForm({
      nombre: '',
      costo_anual: '',
      criticidad: 'medio',
      metodo_deteccion: 'observacion',
      descripcion: '',
      atendible_architecture: false,
    });
  };

  const handleEditHallazgo = async (updated: Hallazgo) => {
    const existing = engagement?.hallazgos ?? [];
    const hallazgos = existing.map((h: Hallazgo) => (h.id === updated.id ? updated : h));
    const total = hallazgos.reduce((s: number, h: { costo_anual: number }) => s + h.costo_anual, 0);
    await handleDictamenUpdate({ hallazgos, dictamen_total_impacto: total });
    setEditingHallazgo(null);
  };

  const handleDeleteHallazgo = async (hallazgoId: string) => {
    const existing = engagement?.hallazgos ?? [];
    const hallazgos = existing.filter((h: Hallazgo) => h.id !== hallazgoId);
    const total = hallazgos.reduce((s: number, h: { costo_anual: number }) => s + h.costo_anual, 0);
    const impact = total > 0 ? total : null;
    await handleDictamenUpdate({ hallazgos, dictamen_total_impacto: impact });
  };

  const handleVettingToggle = async (key: string, value: boolean) => {
    await handleUpdate({ [key]: value });
  };

  const handleVettingDecision = async (decision: 'go' | 'no_go') => {
    const status = decision === 'go' ? 'cita_4_scheduled' : 'closed_nogo';
    await handleUpdate({ vetting_decision: decision, status });
  };

  const canDecide = (): boolean => {
    const role = engagement?.team_members?.role;
    return role === 'ceo' || role === 'cto';
  };

  const vettingResult = (): { label: string; variant: 'success' | 'danger' | 'warning' } => {
    const d = engagement?.vetting_decision;
    if (d === 'go') return { label: 'GO', variant: 'success' };
    if (d === 'no_go') return { label: 'NO-GO', variant: 'danger' };
    return { label: 'PENDIENTE', variant: 'warning' };
  };

  const saveNotasDebounced = useCallback(() => {
    const timer = setTimeout(async () => {
      if (!engagement || !id) return;
      if ((engagement.notas_internas ?? '') !== notasInternas) {
        await foundationDB.update(id, { notas_internas: notasInternas });
        setEngagement((prev: any) => prev ? { ...prev, notas_internas: notasInternas } : null);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [engagement, id, notasInternas]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#A1A1A6]">Cargando engagement...</p>
      </div>
    );
  }

  if (!engagement) {
    return (
      <div className="text-center py-16">
        <p className="text-[#A1A1A6] text-lg">Engagement no encontrado</p>
        <button
          onClick={() => navigate('/foundation')}
          className="mt-4 text-[#95B877] hover:underline text-sm"
        >
          Volver al pipeline
        </button>
      </div>
    );
  }

  const clientName = engagement.clients?.name ?? 'Cliente';
  const result = vettingResult();

  return (
    <div className="flex min-h-screen bg-[#0D0D0F]">
      {/* Main Content */}
      <div className="flex-1 mr-[320px]">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#0D0D0F]/95 backdrop-blur-sm border-b border-[rgba(255,255,255,0.06)] px-6 py-4">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-[#95B877]/10 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl font-semibold text-[#F5F5F7]">
              Foundation — {clientName}
            </h1>
            <Badge variant={getStatusBadgeVariant(engagement.status)} size="sm">
              {engagement.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-[#A1A1A6] ml-12">
            {engagement.clients?.sector && (
              <span>Sector: {engagement.clients.sector}</span>
            )}
            {engagement.assigned_to && (
              <>
                <span>|</span>
                <span>Asignado: {engagement.assigned_to}</span>
              </>
            )}
            {engagement.created_at && (
              <>
                <span>|</span>
                <span>Creado: {new Date(engagement.created_at).toLocaleDateString('es-MX')}</span>
              </>
            )}
          </div>
        </header>

        {/* Tabs */}
        <div className="border-b border-[rgba(255,255,255,0.06)] bg-[#0D0D0F] px-6">
          <nav className="flex gap-1" role="tablist">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                role="tab"
                aria-selected={activeTab === key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === key
                    ? 'bg-[#0D0D0F] border-t-2 border-[#95B877] text-[#F5F5F7]'
                    : 'text-[#A1A1A6] hover:text-[#F5F5F7] hover:bg-[#95B877]/5'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <main className="p-6">
          {activeTab === 'pipeline' && (
            <CitaPipeline engagement={engagement} onUpdate={handleUpdate} />
          )}

          {activeTab === 'scoping' && (
            <>
              {saveError && (
                <div className="mb-4 rounded-xl border border-[rgba(255,69,58,0.2)] bg-[rgba(255,69,58,0.08)] px-4 py-3 flex items-center justify-between">
                  <p className="text-sm text-[#FF453A]">Error al guardar: {saveError}</p>
                  <button
                    className="text-xs text-[#FF453A]/80 hover:text-[#FF453A] font-medium ml-4"
                    onClick={() => setSaveError(null)}
                  >
                    Descartar
                  </button>
                </div>
              )}
              {!autoDetected && engagement?.status !== 'closed_nogo' && engagement?.status !== 'closed_lost' && (
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={() => setShowDataWizard(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#95B877] text-[#95B877] text-sm font-semibold hover:bg-[#95B877]/10 transition-colors"
                  >
                    <Wand2 size={16} />
                    Auto-detectar scoping
                  </button>
                </div>
              )}
              <ScopingCalculator
                engagement={engagement}
                onUpdate={handleUpdate}
                client={engagement.clients}
                saving={saving}
                autoDetected={autoDetected}
              />
              {showDataWizard && (
                <DataUploadWizard
                  clientId={engagement.client_id}
                  engagementId={id}
                  onDetected={handleAutoDetected}
                  onClose={() => setShowDataWizard(false)}
                />
              )}
            </>
          )}

          {activeTab === 'dictamen' && (
            <div className="space-y-6">
              {/* Total Impact Card */}
              {(engagement.hallazgos?.length ?? 0) > 0 && (
                <div className="rounded-xl border-2 border-[#95B877]/30 bg-[#95B877]/5 p-6">
                  <p className="text-sm font-semibold uppercase tracking-wider text-[#95B877] mb-1">
                    Impacto Anual Total Detectado
                  </p>
                  <p className="text-4xl font-bold text-[#F5F5F7]">
                    ${(engagement.dictamen_total_impacto ?? 0).toLocaleString('es-MX')}
                  </p>
                  <p className="text-xs text-[#A1A1A6] mt-1">MXN</p>
                </div>
              )}

              {/* Dictamen Generado */}
              <div className="flex justify-between items-center bg-[#151518] p-5 rounded-xl border border-[rgba(255,255,255,0.08)] mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-[#F5F5F7]">Dictamen Forense con IA</h3>
                  <p className="text-xs text-[#A1A1A6]">Análisis automatizado del nodo crítico</p>
                </div>
                <Button size="sm" disabled={saving} onClick={async () => {
                  setSaving(true);
                  try {
                    const res = await agentActions.generarDictamen({
                      cliente_nombre: clientName,
                      sector: engagement.clients?.sector || 'N/A',
                      nodo_critico: engagement.nodo_critico || 'N/A',
                      hallazgos: engagement.hallazgos || [],
                      total_impacto: engagement.dictamen_total_impacto || 0,
                      factor_gamma: engagement.factor_gamma || 1.0
                    });
                    alert("Dictamen Generado (Ver Consola)\n\n" + res.response.substring(0, 200) + '...');
                    console.log(res.response);
                  } finally { setSaving(false); }
                }}>Generar Dictamen con IA</Button>
              </div>

              {/* Add Hallazgo Form */}
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-[rgba(255,255,255,0.06)] text-[#A1A1A6] hover:border-[#95B877] hover:text-[#95B877] transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Agregar hallazgo
                </button>
              ) : (
                <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#151518] p-5 space-y-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-[#F5F5F7]">
                    Nuevo Hallazgo — {nextHallazgoId()}
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-[#A1A1A6] mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={hallazgoForm.nombre}
                      onChange={(e) =>
                        setHallazgoForm((p) => ({ ...p, nombre: e.target.value }))
                      }
                      className="w-full rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#1C1C1E] px-3 py-2 text-sm text-[#F5F5F7] focus:outline-none focus:ring-1 focus:ring-[#95B877]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#A1A1A6] mb-1">
                        Costo Anual
                      </label>
                      <input
                        type="number"
                        value={hallazgoForm.costo_anual}
                        onChange={(e) =>
                          setHallazgoForm((p) => ({ ...p, costo_anual: e.target.value }))
                        }
                        className="w-full rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#1C1C1E] px-3 py-2 text-sm text-[#F5F5F7] focus:outline-none focus:ring-1 focus:ring-[#95B877]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#A1A1A6] mb-1">
                        Criticidad
                      </label>
                      <select
                        value={hallazgoForm.criticidad}
                        onChange={(e) =>
                          setHallazgoForm((p) => ({
                            ...p,
                            criticidad: e.target.value as Hallazgo['criticidad'],
                          }))
                        }
                        className="w-full rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#1C1C1E] px-3 py-2 text-sm text-[#F5F5F7] focus:outline-none focus:ring-1 focus:ring-[#95B877]"
                      >
                        <option value="critico">Crítico</option>
                        <option value="alto">Alto</option>
                        <option value="medio">Medio</option>
                        <option value="bajo">Bajo</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#A1A1A6] mb-1">
                      Método de Detección
                    </label>
                    <select
                      value={hallazgoForm.metodo_deteccion}
                      onChange={(e) =>
                        setHallazgoForm((p) => ({
                          ...p,
                          metodo_deteccion: e.target.value as Hallazgo['metodo_deteccion'],
                        }))
                      }
                      className="w-full rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#1C1C1E] px-3 py-2 text-sm text-[#F5F5F7] focus:outline-none focus:ring-1 focus:ring-[#95B877]"
                    >
                      <option value="benford">Benford</option>
                      <option value="integridad_referencial">Integridad Referencial</option>
                      <option value="duplicados">Duplicados</option>
                      <option value="observacion">Observación</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#A1A1A6] mb-1">
                      Descripción
                    </label>
                    <textarea
                      rows={2}
                      value={hallazgoForm.descripcion}
                      onChange={(e) =>
                        setHallazgoForm((p) => ({ ...p, descripcion: e.target.value }))
                      }
                      className="w-full rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#1C1C1E] px-3 py-2 text-sm text-[#F5F5F7] focus:outline-none focus:ring-1 focus:ring-[#95B877] resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={hallazgoForm.atendible_architecture}
                        onChange={(e) =>
                          setHallazgoForm((p) => ({
                            ...p,
                            atendible_architecture: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded accent-[#95B877] cursor-pointer"
                      />
                      <span className="text-sm font-medium text-[#F5F5F7]">
                        Atendible con Architecture?
                      </span>
                    </label>
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditingHallazgo(null);
                        setHallazgoForm({
                          nombre: '',
                          costo_anual: '',
                          criticidad: 'medio',
                          metodo_deteccion: 'observacion',
                          descripcion: '',
                          atendible_architecture: false,
                        });
                      }}
                      className="px-4 py-2 text-sm rounded-lg text-[#A1A1A6] hover:bg-[#0D0D0F] transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleAddHallazgo}
                      className="px-4 py-2 text-sm rounded-lg bg-[#95B877] text-white hover:bg-[#95B877]/90 font-semibold transition-colors"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              )}

              {/* Hallazgos List */}
              {engagement.hallazgos && engagement.hallazgos.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#A1A1A6] uppercase tracking-wider">
                    Hallazgos ({engagement.hallazgos.length})
                  </h3>
                  {engagement.hallazgos.map((h: Hallazgo) => (
                    <HallazgoCard
                      key={h.id}
                      hallazgo={h}
                      onEdit={(updated) => handleEditHallazgo(updated)}
                      onDelete={(hallazgoId) => handleDeleteHallazgo(hallazgoId)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'vetting' && (
            <div className="space-y-6">
              {/* 2x2 Vetting Grid */}
              <div className="grid grid-cols-2 gap-4">
                <VettingCheck
                  label="Beta — Riesgo de datos"
                  passed={engagement.vetting_beta_ok}
                  value={
                    engagement.factor_beta != null
                      ? `${engagement.factor_beta < 0.7 ? 'CUMPLE' : 'NO CUMPLE'} (${engagement.factor_beta.toFixed(2)})`
                      : 'Sin calcular'
                  }
                  onToggle={
                    engagement.vetting_beta_ok == null
                      ? (v) => handleVettingToggle('vetting_beta_ok', v)
                      : undefined
                  }
                />
                <VettingCheck
                  label="Alpha — ROI esperado"
                  passed={engagement.vetting_alpha_ok}
                  value={
                    engagement.factor_alpha != null
                      ? `${engagement.factor_alpha >= 1.0 ? 'CUMPLE' : 'NO CUMPLE'} (${engagement.factor_alpha.toFixed(2)})`
                      : 'Sin calcular'
                  }
                  onToggle={
                    engagement.vetting_alpha_ok == null
                      ? (v) => handleVettingToggle('vetting_alpha_ok', v)
                      : undefined
                  }
                />
                <VettingCheck
                  label="Gamma — Viabilidad tecnica"
                  passed={engagement.vetting_gamma_viable}
                  value={
                    engagement.factor_gamma != null
                      ? `Gamma = ${engagement.factor_gamma.toFixed(2)}`
                      : 'Sin calcular'
                  }
                  onToggle={
                    engagement.vetting_gamma_viable == null
                      ? (v) => handleVettingToggle('vetting_gamma_viable', v)
                      : undefined
                  }
                />
                <VettingCheck
                  label="Sponsor identificado"
                  passed={engagement.vetting_sponsor_ok}
                  onToggle={
                    engagement.vetting_sponsor_ok == null
                      ? (v) => handleVettingToggle('vetting_sponsor_ok', v)
                      : undefined
                  }
                />
              </div>

              {/* Auto-evaluate Beta and Alpha based on factors */}
              {engagement.factor_beta != null && engagement.vetting_beta_ok == null && (
                <div className="text-xs text-[#A1A1A6] bg-[#0D0D0F] rounded-lg p-3 border border-[rgba(255,255,255,0.06)]">
                  Beta actual: {engagement.factor_beta.toFixed(3)} — umbral {'<'} 0.7:
                  {' '}<strong>{engagement.factor_beta < 0.7 ? 'CUMPLE automaticamente' : 'No cumple, revise manualmente'}</strong>
                </div>
              )}
              {engagement.factor_alpha != null && engagement.vetting_alpha_ok == null && (
                <div className="text-xs text-[#A1A1A6] bg-[#0D0D0F] rounded-lg p-3 border border-[rgba(255,255,255,0.06)]">
                  Alpha actual: {engagement.factor_alpha.toFixed(3)} — umbral {'>='} 1.0:
                  {' '}<strong>{engagement.factor_alpha >= 1.0 ? 'CUMPLE automaticamente' : 'No cumple, revise manualmente'}</strong>
                </div>
              )}

              {/* Overall Result */}
              <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-white p-6 text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-[#A1A1A6] mb-2">
                  Resultado de Vetting
                </p>
                <Badge variant={result.variant} size="lg">
                  {result.label}
                </Badge>
              </div>

              {/* Decision Buttons */}
              {engagement.vetting_decision == null && (
                <div className="flex items-center gap-4">
                  {canDecide() ? (
                    <>
                      <button
                        onClick={() => handleVettingDecision('go')}
                        disabled={saving}
                        className="flex-1 py-3 rounded-xl bg-[#95B877] text-white font-semibold hover:bg-[#95B877]/90 transition-colors disabled:opacity-50"
                      >
                        {saving ? 'Guardando...' : 'Confirmar Go'}
                      </button>
                      <button
                        onClick={() => handleVettingDecision('no_go')}
                        disabled={saving}
                        className="flex-1 py-3 rounded-xl bg-[#FF453A] text-white font-semibold hover:bg-[#FF453A]/90 transition-colors disabled:opacity-50"
                      >
                        {saving ? 'Guardando...' : 'Confirmar No-Go'}
                      </button>
                    </>
                  ) : (
                    <div className="w-full text-center py-3 rounded-xl border-2 border-dashed border-[rgba(255,255,255,0.06)] text-[#A1A1A6] text-sm">
                      Se requiere rol CEO o CTO para tomar la decision de vetting
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Documentos War Room */}
          <div className="mt-8 bg-[#1C1C1E] rounded-xl border border-[rgba(255,255,255,0.06)] p-5">
            <h3 className="font-serif text-lg text-[#F5F5F7] mb-4">Documentos</h3>
            <div className="grid grid-cols-2 gap-3">
              <DocumentDownloader
                template="propuesta_foundation"
                label="Propuesta Foundation"
                accent="foundation"
                data={{
                  cliente_nombre: engagement.clients?.name,
                  razon_social: engagement.clients?.name,
                  sector: engagement.clients?.sector,
                  nodo_critico: engagement.nodo_critico,
                  factor_gamma: engagement.factor_gamma,
                  foundation_fee: engagement.foundation_fee,
                  contacto_nombre: engagement.clients?.contact_name,
                  ciudad: engagement.clients?.city,
                }}
              />
              <DocumentDownloader
                template="dictamen_forense"
                label="Dictamen Forense"
                accent="foundation"
                data={{
                  cliente_nombre: engagement.clients?.name,
                  sector: engagement.clients?.sector,
                  nodo_critico: engagement.nodo_critico,
                  factor_gamma: engagement.factor_gamma,
                  total_impacto: engagement.dictamen_total_impacto,
                  hallazgos: engagement.hallazgos,
                  ceo_nombre: 'Adriel Evangelista',
                  cto_nombre: 'CTO Evangelista',
                }}
              />
              <DocumentDownloader
                template="contrato_foundation"
                label="Contrato Foundation"
                accent="foundation"
                data={{
                  cliente_nombre: engagement.clients?.name,
                  foundation_fee: engagement.foundation_fee,
                  contacto_nombre: engagement.clients?.contact_name,
                }}
              />
              <DocumentDownloader
                template="orden_servicio"
                label="Orden de Servicio"
                accent="foundation"
                data={{
                  cliente_nombre: engagement.clients?.name,
                  foundation_fee: engagement.foundation_fee,
                }}
              />
              <DocumentDownloader
                template="expediente_operativo"
                label="Expediente Operativo"
                accent="foundation"
                data={{
                  cliente_nombre: engagement.clients?.name,
                  sector: engagement.clients?.sector,
                  ceo_nombre: 'Adriel Evangelista',
                  cto_nombre: 'CTO Evangelista',
                }}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Fixed Right Sidebar (320px) */}
      <aside
        className="fixed top-0 right-0 w-[320px] h-screen border-l border-[rgba(255,255,255,0.06)] bg-[#151518] overflow-y-auto"
        style={{ zIndex: 5 }}
      >
        <div className="p-5 space-y-6">
          {/* Notas Internas */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Save size={14} className="text-[#95B877]" />
              <h3 className="text-sm font-semibold text-[#F5F5F7]">
                Notas Internas
              </h3>
              <span className="text-[10px] text-[#A1A1A6]">autoguardado</span>
            </div>
            <textarea
              value={notasInternas}
              onChange={(e) => setNotasInternas(e.target.value)}
              onBlur={saveNotasDebounced}
              placeholder="Escriba notas internas, observaciones, recordatorios..."
              rows={8}
              className="w-full rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#0D0D0F] px-3 py-2.5 text-sm text-[#F5F5F7] focus:outline-none focus:ring-1 focus:ring-[#95B877]/50 resize-none placeholder-[#A1A1A6]/50"
            />
          </div>

          {/* Historial de Analisis */}
          <div>
            <h3 className="text-sm font-semibold text-[#F5F5F7] flex items-center gap-2 mb-3">
              <FileText size={14} className="text-[#95B877]" />
              Historial de Analisis
            </h3>
            <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0D0D0F] p-4 text-center">
              <p className="text-sm text-[#A1A1A6]">Coming soon</p>
              <p className="text-xs text-[#A1A1A6] mt-1">
                Historial de analisis del cliente
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
