import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { architectureDB, foundationDB } from '../lib/supabase';
import type { ArchitectureProject, Client } from '../lib/types';
import { Plus, Filter, ArrowLeft } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const STATUS_LABELS: Record<string, string> = {
  setup: 'Setup',
  fase_1: 'Fase 1',
  fase_2: 'Fase 2',
  fase_3: 'Fase 3',
  delivery: 'Delivery',
  completed: 'Completado',
  on_hold: 'En pausa',
};

const INFRA_LABELS: Record<string, string> = { A: 'Infra Cliente (A)', B: 'Infra Evangelista (B)' };

const statusToBadgeVariant: Record<string, 'primary' | 'warning' | 'info' | 'success' | 'neutral'> = {
  setup: 'primary',
  fase_1: 'warning',
  fase_2: 'warning',
  fase_3: 'warning',
  delivery: 'info',
  completed: 'success',
  on_hold: 'neutral',
};

const DEFAULT_SPRINTS = [
  { sprint_num: 1, titulo: 'Levantamiento AS-IS', status: 'pending', fecha_inicio: null, fecha_fin: null, tareas: [
    { nombre: 'Mapeo de proceso actual con stakeholders', done: false },
    { nombre: 'Inventario de fuentes de datos', done: false },
    { nombre: 'Identificaci\u00f3n de quick wins del Dictamen', done: false },
  ]},
  { sprint_num: 2, titulo: 'Dise\u00f1o TO-BE + Modelo Dimensional', status: 'pending', fecha_inicio: null, fecha_fin: null, tareas: [
    { nombre: 'Proceso TO-BE validado con sponsor', done: false },
    { nombre: 'Modelo estrella dise\u00f1ado (Facts + Dims)', done: false },
    { nombre: 'SQL DDL del Data Warehouse', done: false },
  ]},
  { sprint_num: 3, titulo: 'ETL + Data Warehouse', status: 'pending', fecha_inicio: null, fecha_fin: null, tareas: [
    { nombre: 'Conexi\u00f3n a ERP establecida (read-only)', done: false },
    { nombre: 'Scripts ETL desarrollados y testeados', done: false },
    { nombre: 'Data Warehouse poblado con datos hist\u00f3ricos', done: false },
    { nombre: 'Validaci\u00f3n de integridad vs. ERP fuente', done: false },
  ]},
  { sprint_num: 4, titulo: 'Dashboards Power BI', status: 'pending', fecha_inicio: null, fecha_fin: null, tareas: [
    { nombre: 'Dashboard ejecutivo dise\u00f1ado', done: false },
    { nombre: 'Dashboard operativo dise\u00f1ado', done: false },
    { nombre: 'KPIs del Dictamen implementados', done: false },
    { nombre: 'Refresh schedule configurado', done: false },
  ]},
  { sprint_num: 5, titulo: 'Testing + UAT', status: 'pending', fecha_inicio: null, fecha_fin: null, tareas: [
    { nombre: 'Testing con datos reales', done: false },
    { nombre: 'UAT con usuarios clave del cliente', done: false },
    { nombre: 'Correcciones post-UAT', done: false },
  ]},
  { sprint_num: 6, titulo: 'Delivery Handshake', status: 'pending', fecha_inicio: null, fecha_fin: null, tareas: [
    { nombre: 'Migraci\u00f3n a infraestructura del cliente', done: false },
    { nombre: 'Capacitaci\u00f3n completada', done: false },
    { nombre: 'Documentaci\u00f3n entregada', done: false },
    { nombre: 'Kickoff Sentinel agendado', done: false },
  ]},
];

function formatCurrency(value: number | null): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '—';
  }
}

export default function ArchitectureListPage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [infra, setInfra] = useState<'A' | 'B'>('A');
  const [creating, setCreating] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [clients, setClients] = useState<any[]>([]);
  const [foundations, setFoundations] = useState<any[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.warn('[ArchitectureList] Timeout loading projects');
      setLoading(false);
    }, 10000);

    architectureDB.list().then(data => {
      clearTimeout(timeout);
      setProjects(data || []);
      setLoading(false);
    }).catch((err) => {
      clearTimeout(timeout);
      console.error('[ArchitectureList] Error loading projects:', err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    Promise.all([
      foundationDB.list().catch(() => []),
    ]).then(([founds]) => {
      setFoundations(founds || []);
      const goClientIds = new Set(
        (founds || [])
          .filter((f: any) => f.vetting_decision === 'go')
          .map((f: any) => f.client_id)
      );
      setClients(
        (founds || []).filter((f: any) => goClientIds.has(f.client_id))
      );
    });
  }, []);

  const goClientIds = useMemo(() => {
    const ids = new Set<string>();
    foundations.forEach((f: any) => {
      if (f.vetting_decision === 'go') ids.add(f.client_id);
    });
    return ids;
  }, [foundations]);

  const activeCount = useMemo(
    () => projects.filter((p: any) => !['completed', 'on_hold'].includes(p.status)).length,
    [projects]
  );

  const filteredProjects = useMemo(() => {
    if (statusFilter === 'all') return projects;
    return projects.filter((p: any) => p.status === statusFilter);
  }, [projects, statusFilter]);

  function getFoundationForClient(clientId: string) {
    return foundations.find((f: any) => f.client_id === clientId) || null;
  }

  function calcFeeFromFoundation(f: any) {
    const gamma = f?.factor_gamma || 0;
    const setupFee = 180000 * gamma;
    const tramoA = setupFee * 0.7;
    const tramoB = setupFee * 0.3;
    const successFee = setupFee * 0.3;
    return { setupFee, tramoA, tramoB, successFee };
  }

  function handleCreate() {
    if (!selectedClient) return;
    setCreating(true);
    const f = getFoundationForClient(selectedClient);
    const fees = f ? calcFeeFromFoundation(f) : { setupFee: 0, tramoA: 0, tramoB: 0, successFee: 0 };

    const newProject = {
      client_id: selectedClient,
      foundation_id: f?.id || null,
      status: 'setup' as const,
      setup_fee: fees.setupFee,
      tramo_a: fees.tramoA,
      tramo_b: fees.tramoB,
      success_fee_estimado: fees.successFee,
      tramo_a_pagado: false,
      tramo_b_pagado: false,
      escenario_infra: infra,
      sprints: DEFAULT_SPRINTS as any,
      assigned_to: null,
    };

    architectureDB.create(newProject).then(() => {
      setCreating(false);
      setShowModal(false);
      setSelectedClient('');
      setInfra('A');
      architectureDB.list().then(data => setProjects(data || [])).catch(() => {});
    }).catch(() => {
      setCreating(false);
    });
  }

  function getStatusOptions(): Array<{ value: string; label: string }> {
    return [
      { value: 'all', label: 'Todos' },
      ...Object.entries(STATUS_LABELS).map(([v, l]) => ({ value: v, label: l })),
    ];
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin w-6 h-6 border-2 border-[#95B877] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-serif text-content-primary">Architecture — Proyectos</h1>
          <p className="text-sm text-content-secondary mt-1">
            {activeCount} proyecto{activeCount !== 1 ? 's' : ''} activo{activeCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-[rgba(255,255,255,0.08)] bg-canvas text-content-primary hover:bg-[rgba(255,255,255,0.08)]/30 transition"
          >
            <Filter className="w-3.5 h-3.5" />
            Filtrar
          </button>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
            Nuevo proyecto
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      {filterOpen && (
        <div className="mb-6 p-3 rounded-xl border border-[rgba(255,255,255,0.08)] bg-canvas flex flex-wrap gap-2">
          {getStatusOptions().map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-full transition
                ${statusFilter === opt.value
                  ? 'bg-[#95B877] text-white'
                  : 'bg-transparent text-content-secondary hover:bg-[rgba(255,255,255,0.08)]/20'
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-[rgba(255,255,255,0.08)] bg-canvas">
          <p className="text-content-secondary text-sm">No hay proyectos de Architecture a\u00fan.</p>
          <p className="text-xs text-content-secondary mt-1">
            Crea el primero con el bot\u00f3n de arriba.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project: any) => {
            const totalTasks = (project.sprints || []).reduce((s: number, sp: any) => s + (sp.tareas?.length || 0), 0);
            const doneTasks = (project.sprints || []).reduce((s: number, sp: any) => s + (sp.tareas?.filter((t: any) => t.done).length || 0), 0);
            const progress = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

            return (
              <div
                key={project.id}
                onClick={() => navigate(`/architecture/${project.id}`)}
                className="group cursor-pointer rounded-2xl border border-[rgba(255,255,255,0.08)] bg-canvas p-4 hover:shadow-md hover:border-[#95B877]/40 transition-all duration-200"
              >
                {/* Client name + sector */}
                <div className="mb-3">
                  <h3 className="font-semibold text-content-primary group-hover:text-[#95B877] transition">
                    {project.clients?.name || 'Sin cliente'}
                  </h3>
                  {project.clients?.sector && (
                    <p className="text-xs text-content-secondary mt-0.5">{project.clients.sector}</p>
                  )}
                </div>

                {/* Status badge */}
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge size="sm" variant={statusToBadgeVariant[project.status] || 'neutral'}>
                    {STATUS_LABELS[project.status] || project.status}
                  </Badge>
                  {project.escenario_infra && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-[rgba(255,255,255,0.08)]/20 text-content-secondary">
                      {INFRA_LABELS[project.escenario_infra]}
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[11px] text-content-secondary mb-1">
                    <span>Progreso</span>
                    <span className="font-mono">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.08)]/40 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#95B877] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Financial info */}
                <div className="mb-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-content-secondary">Setup fee</span>
                    <span className="font-mono text-content-primary">{formatCurrency(project.setup_fee)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-content-secondary">Tramo A</span>
                    <span className={project.tramo_a_pagado ? 'text-green-600' : 'text-amber-600'}>
                      {project.tramo_a_pagado ? '\u2705 pagado' : '\u23f3 pendiente'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-content-secondary">Tramo B</span>
                    <span className={project.tramo_b_pagado ? 'text-green-600' : 'text-amber-600'}>
                      {project.tramo_b_pagado ? '\u2705 pagado' : '\u23f3 pendiente'}
                    </span>
                  </div>
                </div>

                {/* Footer info */}
                <div className="pt-3 border-t border-[rgba(255,255,255,0.08)]/50 flex items-center justify-between text-[11px] text-content-secondary">
                  <span>{project.team_members?.full_name || 'Sin asignar'}</span>
                  <span>{formatDate(project.created_at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Nuevo proyecto */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-canvas border border-[rgba(255,255,255,0.08)] shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.08)]/50">
              <h2 className="text-lg font-serif text-content-primary">Nuevo proyecto Architecture</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-content-secondary hover:text-content-primary transition"
              >
                ✕
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-5">
              {/* Client select */}
              <div>
                <label className="block text-sm font-medium text-content-primary mb-1.5">Cliente</label>
                <select
                  value={selectedClient}
                  onChange={e => setSelectedClient(e.target.value)}
                  className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-white/60 px-3 py-2 text-sm text-content-primary focus:outline-none focus:ring-2 focus:ring-[#95B877]/40 focus:border-[#95B877]"
                >
                  <option value="">Seleccionar cliente...</option>
                  {foundations
                    .filter((f: any) => f.vetting_decision === 'go')
                    .map((f: any) => (
                      <option key={f.client_id} value={f.client_id}>
                        {f.clients?.name || 'Sin nombre'}
                        {f.factor_gamma ? ` (\u0393=${f.factor_gamma})` : ''}
                      </option>
                    ))}
                </select>
                {selectedClient && (() => {
                  const f = getFoundationForClient(selectedClient);
                  const fees = f ? calcFeeFromFoundation(f) : null;
                  return fees ? (
                    <div className="mt-2 p-2.5 rounded-lg bg-[rgba(255,255,255,0.08)]/15 text-xs space-y-1">
                      <div className="flex justify-between text-content-secondary">
                        <span>Setup fee</span>
                        <span className="font-mono">{formatCurrency(fees.setupFee)}</span>
                      </div>
                      <div className="flex justify-between text-content-secondary">
                        <span>Tramo A (70%)</span>
                        <span className="font-mono">{formatCurrency(fees.tramoA)}</span>
                      </div>
                      <div className="flex justify-between text-content-secondary">
                        <span>Tramo B (30%)</span>
                        <span className="font-mono">{formatCurrency(fees.tramoB)}</span>
                      </div>
                      <div className="flex justify-between text-content-secondary">
                        <span>Success fee est.</span>
                        <span className="font-mono">{formatCurrency(fees.successFee)}</span>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Infra scenario */}
              <div>
                <label className="block text-sm font-medium text-content-primary mb-2">Infraestructura</label>
                <div className="flex gap-4">
                  {(['A', 'B'] as const).map(val => (
                    <label
                      key={val}
                      className={`
                        flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition
                        ${infra === val
                          ? 'border-[#95B877] bg-[#95B877]/10 text-content-primary'
                          : 'border-[rgba(255,255,255,0.08)] text-content-secondary hover:border-[#95B877]/50'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="infra"
                        value={val}
                        checked={infra === val}
                        onChange={() => setInfra(val)}
                        className="sr-only"
                      />
                      <div>
                        <div className="text-sm font-medium">{INFRA_LABELS[val]}</div>
                        <div className="text-[11px] text-content-secondary">
                          {val === 'A' ? 'Infra del cliente' : 'Infra Evangelista'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[rgba(255,255,255,0.08)]/50">
              <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button
                variant="primary"
                disabled={!selectedClient || creating}
                isLoading={creating}
                onClick={handleCreate}
              >
                Crear proyecto
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
