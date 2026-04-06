import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { architectureDB } from '../lib/supabase';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import {
  ArrowLeft, GitBranch, DollarSign, Plug, ClipboardCheck,
  Plus, Save, ExternalLink, CheckCircle, Circle,
} from 'lucide-react';
import { agentActions } from '../lib/agentActions';

type Tab = 'sprints' | 'financiero' | 'erp' | 'delivery';
const TABS: { key: Tab; label: string; icon: React.ComponentType<any> }[] = [
  { key: 'sprints', label: 'Sprints', icon: GitBranch },
  { key: 'financiero', label: 'Financiero', icon: DollarSign },
  { key: 'erp', label: 'ERP', icon: Plug },
  { key: 'delivery', label: 'Delivery Handshake', icon: ClipboardCheck },
];

const DEFAULT_SPRINTS = [
  { sprint_num: 1, titulo: 'Levantamiento AS-IS', status: 'pending', fecha_inicio: null, fecha_fin: null, tareas: [
    { nombre: 'Mapeo de proceso actual con stakeholders', done: false },
    { nombre: 'Inventario de fuentes de datos', done: false },
    { nombre: 'Identificación de quick wins del Dictamen', done: false },
  ]},
  { sprint_num: 2, titulo: 'Diseño TO-BE + Modelo Dimensional', status: 'pending', fecha_inicio: null, fecha_fin: null, tareas: [
    { nombre: 'Proceso TO-BE validado con sponsor', done: false },
    { nombre: 'Modelo estrella diseñado (Facts + Dims)', done: false },
    { nombre: 'SQL DDL del Data Warehouse', done: false },
  ]},
  { sprint_num: 3, titulo: 'ETL + Data Warehouse', status: 'pending', fecha_inicio: null, fecha_fin: null, tareas: [
    { nombre: 'Conexión a ERP establecida (read-only)', done: false },
    { nombre: 'Scripts ETL desarrollados y testeados', done: false },
    { nombre: 'Data Warehouse poblado con datos históricos', done: false },
    { nombre: 'Validación de integridad vs. ERP fuente', done: false },
  ]},
  { sprint_num: 4, titulo: 'Dashboards Power BI', status: 'pending', fecha_inicio: null, fecha_fin: null, tareas: [
    { nombre: 'Dashboard ejecutivo diseñado', done: false },
    { nombre: 'Dashboard operativo diseñado', done: false },
    { nombre: 'KPIs del Dictamen implementados', done: false },
    { nombre: 'Refresh schedule configurado', done: false },
  ]},
  { sprint_num: 5, titulo: 'Testing + UAT', status: 'pending', fecha_inicio: null, fecha_fin: null, tareas: [
    { nombre: 'Testing con datos reales', done: false },
    { nombre: 'UAT con usuarios clave del cliente', done: false },
    { nombre: 'Correcciones post-UAT', done: false },
  ]},
  { sprint_num: 6, titulo: 'Delivery Handshake', status: 'pending', fecha_inicio: null, fecha_fin: null, tareas: [
    { nombre: 'Migración a infraestructura del cliente', done: false },
    { nombre: 'Capacitación completada', done: false },
    { nombre: 'Documentación entregada', done: false },
    { nombre: 'Kickoff Sentinel agendado', done: false },
  ]},
];

const STATUS_LABELS: Record<string, string> = {
  setup: 'Setup',
  fase_1: 'Fase 1',
  fase_2: 'Fase 2',
  fase_3: 'Fase 3',
  delivery: 'Delivery',
  completed: 'Completado',
  on_hold: 'En pausa',
};

const PHASE_ORDER: string[] = ['setup', 'fase_1', 'fase_2', 'fase_3', 'delivery'];

function formatCurrency(n: number | null) {
  if (n == null) return '-';
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
}

function calcSprintProgress(sprint: any) {
  const total = sprint.tareas?.length || 0;
  const done = sprint.tareas?.filter((t: any) => t.done).length || 0;
  return { done, total, pct: total > 0 ? (done / total) * 100 : 0 };
}

export default function ArchitectureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>('sprints');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [foundation, setFoundation] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    architectureDB.get(id).then(data => {
      setProject(data);
      if (!data?.sprints || data.sprints.length === 0) {
        architectureDB.update(id, { sprints: DEFAULT_SPRINTS as any });
        setProject((prev: any) => ({ ...prev, sprints: DEFAULT_SPRINTS }));
      }
      if (data?.foundation_engagements) {
        setFoundation(data.foundation_engagements);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (updates: any) => {
    if (!project || !id) return;
    setSaving(true);
    try {
      const updated = await architectureDB.update(id, updates);
      setProject((prev: any) => ({ ...prev, ...updates, updated_at: updated?.updated_at ?? prev?.updated_at }));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleTask = useCallback((sprintNum: number, taskIndex: number) => {
    if (!project?.sprints) return;
    const sprints = project.sprints.map((s: any) => {
      if (s.sprint_num !== sprintNum) return s;
      const tareas = s.tareas.map((t: any, i: number) =>
        i === taskIndex ? { ...t, done: !t.done } : t
      );
      const doneCount = tareas.filter((t: any) => t.done).length;
      const totalCount = tareas.length;
      return {
        ...s,
        tareas,
        status: doneCount === 0 ? 'pending' : doneCount === totalCount ? 'completed' : 'in_progress',
      };
    });
    handleUpdate({ sprints });
  }, [project, handleUpdate]);

  const handleCompleteDelivery = useCallback(() => {
    if (!project?.sprints) return;
    const sprint6 = project.sprints.find((s: any) => s.sprint_num === 6);
    if (!sprint6) return;
    const allDone = sprint6.tareas?.every((t: any) => t.done);
    if (!allDone) return;
    handleUpdate({ status: 'completed' });
  }, [project, handleUpdate]);

  const handleToggleTramo = useCallback((tramo: 'tramo_a_pagado' | 'tramo_b_pagado') => {
    if (!project) return;
    handleUpdate({ [tramo]: !project[tramo] });
  }, [project, handleUpdate]);

  const handleAdvancePhase = useCallback(() => {
    if (!project) return;
    const idx = PHASE_ORDER.indexOf(project.status);
    if (idx < 0 || idx >= PHASE_ORDER.length - 1) return;
    handleUpdate({ status: PHASE_ORDER[idx + 1] });
  }, [project, handleUpdate]);

  const gamma = (foundation?.factor_gamma ?? 0) as number;
  const timelineWeeks: string = gamma >= 2.0 && gamma <= 3.0
    ? '9-12 sem'
    : gamma >= 1.0 && gamma < 2.0
      ? '6-7 sem'
      : '-';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin w-6 h-6 border-2 border-[#95B877] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-[#A1A1A6] text-sm">Proyecto no encontrado.</p>
        <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/architecture')}>
          Volver
        </Button>
      </div>
    );
  }

  const clientName = project.clients?.name || 'Sin cliente';

  const totalTasks = (project.sprints || []).reduce((s: number, sp: any) => s + (sp.tareas?.length || 0), 0);
  const doneTasks = (project.sprints || []).reduce((s: number, sp: any) => s + (sp.tareas?.filter((t: any) => t.done).length || 0), 0);
  const globalPct = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

  const activeSprint = (project.sprints || []).find((s: any) => s.status === 'in_progress')
    || (project.sprints || []).find((s: any) => s.status === 'pending');

  return (
    <div className="px-4 py-6 md:px-8 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/architecture')}
          className="inline-flex items-center gap-1.5 text-sm text-[#A1A1A6] hover:text-[#F5F5F7] transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-serif text-[#F5F5F7]">
              Architecture {clientName && <span className="text-[#A1A1A6]">—</span>} {clientName}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-[#A1A1A6]">
              {project.escenario_infra && (
                <span>
                  Scenario: <strong className="text-[#F5F5F7]">{project.escenario_infra === 'A' ? 'Infra Cliente' : 'Infra Evangelista'}</strong>
                </span>
              )}
              <span className="text-[rgba(255,255,255,0.08)]">|</span>
              <span>{project.team_members?.full_name || 'Sin asignar'}</span>
              {activeSprint && (
                <>
                  <span className="text-[rgba(255,255,255,0.08)]">|</span>
                  <span>
                    Sprint activo:{' '}
                    <strong className="text-[#F5F5F7]">{activeSprint.sprint_num} — {activeSprint.titulo}</strong>
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={project.status === 'completed' ? 'success' : project.status === 'on_hold' ? 'neutral' : 'primary'} size="md">
              {STATUS_LABELS[project.status] || project.status}
            </Badge>
            {project.setup_fee != null && (
              <span className="text-sm font-mono text-[#95B877]">{formatCurrency(project.setup_fee)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Main layout: content + sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left content */}
        <div className="flex-1 min-w-0">
          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6 border-b border-[rgba(255,255,255,0.08)]/50">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition
                    border-b-2 -mb-px
                    ${activeTab === tab.key
                      ? 'border-[#95B877] text-[#95B877]'
                      : 'border-transparent text-[#A1A1A6] hover:text-[#F5F5F7] hover:border-[rgba(255,255,255,0.08)]'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB: Sprints */}
          {activeTab === 'sprints' && (
            <div className="space-y-4">
              {project.sprints?.map((sprint: any) => {
                const { done, total, pct } = calcSprintProgress(sprint);
                return (
                  <div
                    key={sprint.sprint_num}
                    className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0D0D0F] overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.08)]/50">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#95B877]/15 text-xs font-bold text-[#95B877]">
                          {sprint.sprint_num}
                        </span>
                        <span className="text-sm font-medium text-[#F5F5F7]">{sprint.titulo}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#A1A1A6]">{done}/{total}</span>
                        <span className="text-xs font-mono text-[#95B877] w-10 text-right">{Math.round(pct)}%</span>
                      </div>
                    </div>

                    <div className="h-1 w-full bg-[rgba(255,255,255,0.08)]/30">
                      <div
                        className="h-full bg-[#95B877] transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="divide-y divide-[rgba(255,255,255,0.08)]/30">
                      {sprint.tareas?.map((task: any, i: number) => (
                        <label
                          key={i}
                          className={`
                            flex items-center gap-3 px-4 py-2.5 cursor-pointer transition
                            ${task.done ? 'text-[#A1A1A6]' : 'text-[#F5F5F7]'}
                          `}
                        >
                          {task.done ? (
                            <CheckCircle className="w-4 h-4 text-[#95B877] shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-[rgba(255,255,255,0.08)] shrink-0" />
                          )}
                          <span className={`text-sm ${task.done ? 'line-through' : ''}`}>{task.nombre}</span>
                          <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => handleToggleTask(sprint.sprint_num, i)}
                            className="sr-only"
                            disabled={saving}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB: Financiero */}
          {activeTab === 'financiero' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0D0D0F] p-5">
                <h3 className="text-sm font-medium text-[#A1A1A6] mb-1">Setup Fee</h3>
                <p className="text-2xl font-serif text-[#F5F5F7]">{formatCurrency(project.setup_fee)}</p>
                {gamma > 0 && (
                  <p className="text-xs text-[#A1A1A6] mt-1">basado en Γ = {gamma} (180,000 x {gamma})</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`rounded-xl border p-4 transition ${project.tramo_a_pagado ? 'border-green-400/50 bg-green-900/20' : 'border-[rgba(255,255,255,0.08)] bg-[#0D0D0F]'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#F5F5F7]">Tramo A (70%)</span>
                    {project.tramo_a_pagado
                      ? <CheckCircle className="w-4 h-4 text-green-600" />
                      : <Circle className="w-4 h-4 text-amber-500" />}
                  </div>
                  <p className="text-lg font-mono text-[#F5F5F7] mb-2">{formatCurrency(project.tramo_a)}</p>
                  <button
                    onClick={() => handleToggleTramo('tramo_a_pagado')}
                    disabled={saving}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition border ${
                      project.tramo_a_pagado
                        ? 'border-green-400/40 text-green-700 bg-green-50 hover:bg-green-100/50'
                        : 'border-amber-400/40 text-amber-700 bg-amber-50 hover:bg-amber-100/50'
                    }`}
                  >
                    {project.tramo_a_pagado ? 'Pagado' : 'Pendiente — Marcar pagado'}
                  </button>
                </div>

                <div className={`rounded-xl border p-4 transition ${project.tramo_b_pagado ? 'border-green-400/50 bg-green-900/20' : 'border-[rgba(255,255,255,0.08)] bg-[#0D0D0F]'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#F5F5F7]">Tramo B (30%)</span>
                    {project.tramo_b_pagado
                      ? <CheckCircle className="w-4 h-4 text-green-600" />
                      : <Circle className="w-4 h-4 text-amber-500" />}
                  </div>
                  <p className="text-lg font-mono text-[#F5F5F7] mb-2">{formatCurrency(project.tramo_b)}</p>
                  <button
                    onClick={() => handleToggleTramo('tramo_b_pagado')}
                    disabled={saving}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition border ${
                      project.tramo_b_pagado
                        ? 'border-green-400/40 text-green-700 bg-green-50 hover:bg-green-100/50'
                        : 'border-amber-400/40 text-amber-700 bg-amber-50 hover:bg-amber-100/50'
                    }`}
                  >
                    {project.tramo_b_pagado ? 'Pagado' : 'Pendiente — Marcar pagado'}
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0D0D0F] p-5">
                <h3 className="text-sm font-medium text-[#A1A1A6] mb-1">Success Fee Estimado</h3>
                <p className="text-2xl font-serif text-[#F5F5F7]">{formatCurrency(project.success_fee_estimado)}</p>
              </div>

              <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0D0D0F] p-5">
                <h3 className="text-sm font-medium text-[#A1A1A6] mb-1">Estimación de Timeline</h3>
                <p className="text-lg font-mono text-[#F5F5F7]">
                  {timelineWeeks !== '-' ? timelineWeeks : 'Sin dato de Γ'}
                </p>
                {foundation ? (
                  <p className="text-xs text-[#A1A1A6] mt-1">
                    Foundation engagement de {clientName} — Γ = {foundation.factor_gamma}
                  </p>
                ) : (
                  <p className="text-xs text-[#A1A1A6] mt-1">Sin foundation engagement vinculado</p>
                )}
              </div>
            </div>
          )}

          {/* TAB: ERP */}
          {activeTab === 'erp' && (
            <div>
              {(project.erp_connection_id || project.erp_type) ? (
                <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0D0D0F] p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Plug className="w-5 h-5 text-[#95B877]" />
                    <h3 className="text-base font-medium text-[#F5F5F7]">Conexión ERP activa</h3>
                    <Badge variant="success" size="sm">Conectado</Badge>
                  </div>
                  {project.erp_type && (
                    <p className="text-sm text-[#F5F5F7]">
                      Tipo de ERP: <strong>{project.erp_type}</strong>
                    </p>
                  )}
                  {project.erp_connection_id && (
                    <p className="text-sm text-[#A1A1A6]">
                      Connection ID:{' '}
                      <code className="text-xs font-mono px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.08)]/20">
                        {project.erp_connection_id}
                      </code>
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[rgba(255,255,255,0.08)] bg-[#0D0D0F] p-8 text-center space-y-4">
                  <Plug className="w-8 h-8 text-[rgba(255,255,255,0.08)] mx-auto" />
                  <h3 className="text-base font-medium text-[#F5F5F7]">Sin conexión ERP configurada</h3>
                  <p className="text-sm text-[#A1A1A6] max-w-sm mx-auto">
                    Configura una conexión ERP para habilitar la extracción de datos para el Data Warehouse del proyecto.
                  </p>
                  <Button
                    variant="primary"
                    icon={<ExternalLink className="w-4 h-4" />}
                    onClick={() => navigate('/erp-connections')}
                  >
                    Ir a conexiones ERP
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* TAB: Delivery Handshake */}
          {activeTab === 'delivery' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0D0D0F] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(255,255,255,0.08)]/50">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-[#95B877]" />
                    <h3 className="text-sm font-medium text-[#F5F5F7]">Checklist de Entrega</h3>
                  </div>
                  {(() => {
                    const sprint6 = project.sprints?.find((s: any) => s.sprint_num === 6);
                    const d = sprint6?.tareas?.filter((t: any) => t.done).length || 0;
                    const t = sprint6?.tareas?.length || 0;
                    return <span className="text-xs font-mono text-[#95B877]">{d}/{t}</span>;
                  })()}
                </div>

                <div className="divide-y divide-[rgba(255,255,255,0.08)]/30">
                  {project.sprints
                    ?.find((s: any) => s.sprint_num === 6)
                    ?.tareas?.map((task: any, i: number) => (
                      <label
                        key={i}
                        className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition ${task.done ? 'text-[#A1A1A6]' : 'text-[#F5F5F7]'}`}
                      >
                        {task.done ? (
                          <CheckCircle className="w-4 h-4 text-[#95B877] shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-[rgba(255,255,255,0.08)] shrink-0" />
                        )}
                        <span className={`text-sm ${task.done ? 'line-through' : ''}`}>{task.nombre}</span>
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => handleToggleTask(6, i)}
                          className="sr-only"
                          disabled={saving}
                        />
                      </label>
                    ))}
                </div>
              </div>

              {project.status === 'completed' ? (
                <div className="rounded-xl border border-green-400/40 bg-green-900/20 p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Proyecto entregado</p>
                    <p className="text-xs text-green-700/70">Todos los items del checklist fueron completados y el proyecto fue marcado como completado.</p>
                  </div>
                </div>
              ) : (() => {
                const sprint6 = project.sprints?.find((s: any) => s.sprint_num === 6);
                const allDone = sprint6?.tareas?.every((t: any) => t.done) ?? false;
                return (
                  <Button
                    variant="primary"
                    icon={<CheckCircle className="w-4 h-4" />}
                    disabled={!allDone || saving}
                    onClick={handleCompleteDelivery}
                  >
                    {allDone ? 'Marcar como entregado' : 'Completa todos los items del checklist primero'}
                  </Button>
                );
              })()}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="lg:w-[320px] shrink-0 space-y-4">
          {/* Project info card */}
          <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0D0D0F] p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A1A1A6] mb-3">
              Info del Proyecto
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-[#A1A1A6]">Estado</dt>
                <dd className="text-[#F5F5F7] font-medium">{STATUS_LABELS[project.status] || project.status}</dd>
              </div>
              <div>
                <dt className="text-[#A1A1A6]">Infraestructura</dt>
                <dd className="text-[#F5F5F7] font-medium">
                  {project.escenario_infra === 'A' ? 'Infra Cliente (A)' : project.escenario_infra === 'B' ? 'Infra Evangelista (B)' : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-[#A1A1A6]">Asignado a</dt>
                <dd className="text-[#F5F5F7] font-medium">{project.team_members?.full_name || 'Sin asignar'}</dd>
              </div>

              {/* Progress summary */}
              <div>
                <dt className="text-[#A1A1A6] mb-1">Progreso global</dt>
                <dd>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#A1A1A6]">{doneTasks}/{totalTasks} tareas</span>
                      <span className="font-mono text-[#95B877]">{Math.round(globalPct)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[rgba(255,255,255,0.08)]/30 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#95B877] transition-all duration-300"
                        style={{ width: `${globalPct}%` }}
                      />
                    </div>
                  </div>
                </dd>
              </div>

              {/* Financial summary */}
              <div className="pt-3 border-t border-[rgba(255,255,255,0.08)]/50">
                <dt className="text-[#A1A1A6] mb-2">Resumen financiero</dt>
                <dd>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#A1A1A6]">Setup fee</span>
                      <span className="font-mono text-[#F5F5F7]">{formatCurrency(project.setup_fee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A1A1A6]">Tramo A</span>
                      <span className={project.tramo_a_pagado ? 'text-green-600' : 'text-amber-600'}>
                        {project.tramo_a_pagado ? 'Pagado' : 'Pendiente'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#A1A1A6]">Tramo B</span>
                      <span className={project.tramo_b_pagado ? 'text-green-600' : 'text-amber-600'}>
                        {project.tramo_b_pagado ? 'Pagado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </dd>
              </div>

              {/* Foundation link */}
              {project.foundation_id && (
                <div className="pt-3 border-t border-[rgba(255,255,255,0.08)]/50">
                  <dt className="text-[#A1A1A6] mb-2">Foundation</dt>
                  <dd>
                    <button
                      onClick={() => navigate(`/foundation/${project.foundation_id}`)}
                      className="inline-flex items-center gap-1 text-xs text-[#95B877] hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Ver engagement en Foundation
                    </button>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Quick actions */}
          <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0D0D0F] p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A1A1A6] mb-3">
              Acciones rápidas
            </h3>
            <div className="space-y-2">
              {project.status !== 'completed' && project.status !== 'on_hold' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  icon={<ArrowLeft className="w-3.5 h-3.5 rotate-90" />}
                  onClick={handleAdvancePhase}
                  disabled={saving || PHASE_ORDER.indexOf(project.status) >= PHASE_ORDER.length - 1}
                >
                  Avanzar fase
                </Button>
              )}
              {project.status !== 'completed' && project.status !== 'on_hold' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleUpdate({ status: 'on_hold' })}
                >
                  Poner en pausa
                </Button>
              )}
              {project.status === 'on_hold' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleUpdate({ status: project.foundation_id ? 'fase_1' : 'setup' })}
                >
                  Reanudar proyecto
                </Button>
              )}
              {project.status !== 'completed' && project.status !== 'on_hold' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    disabled={saving}
                    onClick={async () => {
                      setSaving(true);
                      try {
                        const res = await agentActions.generarModeloDimensional({
                          cliente_nombre: clientName, sector: project.clients?.sector || 'Industrial', nodo_critico: 'TBD', erp_type: project.erp_type || 'SAP', hallazgos: [] 
                        });
                        alert("Modelo Generado (Ver Consola)\n\n" + res.response.substring(0, 100) + '...');
                        console.log(res.response);
                      } finally { setSaving(false); }
                    }}
                  >
                    Generar Modelo Dimensional
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    disabled={saving}
                    onClick={async () => {
                      setSaving(true);
                      try {
                        const res = await agentActions.generarETL({ erp_type: project.erp_type || 'SAP', fact_tables: ['fact_ventas'], dim_tables: ['dim_fecha'] });
                        alert("ETL Generado (Ver Consola)\n\n" + res.response.substring(0, 100) + '...');
                        console.log(res.response);
                      } finally { setSaving(false); }
                    }}
                  >
                    Generar Scripts ETL
                  </Button>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
