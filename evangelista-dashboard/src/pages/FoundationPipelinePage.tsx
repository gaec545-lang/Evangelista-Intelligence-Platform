import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { foundationDB, clientsDB } from '../lib/supabase';
import type { FoundationEngagement, Client } from '../lib/types';
import { Plus, Filter, LayoutGrid, List, Building2, Calendar, User, X, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';

const PIPELINE_COLUMNS = [
  { id: 'scoping', label: 'Scoping', statuses: ['scoping', 'cita_1_scheduled', 'cita_1_done'], accent: '#95B877', accentBg: 'rgba(149,184,119,0.08)', accentBorder: 'rgba(149,184,119,0.2)' },
  { id: 'immersion', label: 'Inmersi\u00f3n', statuses: ['immersion', 'cita_2_done'], accent: '#D4A843', accentBg: 'rgba(212,168,67,0.08)', accentBorder: 'rgba(212,168,67,0.2)' },
  { id: 'dictamen', label: 'Dictamen', statuses: ['dictamen_review', 'cita_3_scheduled', 'cita_3_done'], accent: '#A78BFA', accentBg: 'rgba(167,139,250,0.08)', accentBorder: 'rgba(167,139,250,0.2)' },
  { id: 'vetting', label: 'Vetting', statuses: ['vetting_gate', 'cita_4_scheduled', 'cita_4_done'], accent: '#F97316', accentBg: 'rgba(249,115,22,0.08)', accentBorder: 'rgba(249,115,22,0.2)' },
  { id: 'closed', label: 'Cerrado', statuses: ['closed_go', 'closed_nogo', 'closed_lost'], accent: '#636366', accentBg: 'rgba(99,99,102,0.08)', accentBorder: 'rgba(99,99,102,0.2)' },
];

const STATUS_LABELS: Record<string, string> = {
  scoping: 'Scoping',
  cita_1_scheduled: 'Cita 1 agendada',
  cita_1_done: 'Cita 1 completada',
  immersion: 'Inmersi\u00f3n',
  cita_2_done: 'Inmersi\u00f3n completada',
  dictamen_review: 'Dictamen en revisi\u00f3n',
  cita_3_scheduled: 'Cita 3 agendada',
  cita_3_done: 'Cita 3 completada',
  vetting_gate: 'Vetting Gate',
  cita_4_scheduled: 'Cita 4 agendada',
  cita_4_done: 'Cita 4 completada',
  closed_go: 'Go',
  closed_nogo: 'No-Go',
  closed_lost: 'Perdido',
};

const STATUS_VARIANT: Record<string, { bg: string; text: string; border: string }> = {
  scoping:              { bg: 'rgba(149,184,119,0.12)', text: '#95B877', border: 'rgba(149,184,119,0.25)' },
  cita_1_scheduled:     { bg: 'rgba(149,184,119,0.12)', text: '#95B877', border: 'rgba(149,184,119,0.25)' },
  cita_1_done:          { bg: 'rgba(48,209,88,0.12)',   text: '#30D158', border: 'rgba(48,209,88,0.25)' },
  immersion:            { bg: 'rgba(212,168,67,0.12)',   text: '#D4A843', border: 'rgba(212,168,67,0.25)' },
  cita_2_done:          { bg: 'rgba(48,209,88,0.12)',   text: '#30D158', border: 'rgba(48,209,88,0.25)' },
  dictamen_review:      { bg: 'rgba(167,139,250,0.12)',  text: '#A78BFA', border: 'rgba(167,139,250,0.25)' },
  cita_3_scheduled:     { bg: 'rgba(167,139,250,0.12)',  text: '#A78BFA', border: 'rgba(167,139,250,0.25)' },
  cita_3_done:          { bg: 'rgba(48,209,88,0.12)',   text: '#30D158', border: 'rgba(48,209,88,0.25)' },
  vetting_gate:         { bg: 'rgba(249,115,22,0.12)',   text: '#F97316', border: 'rgba(249,115,22,0.25)' },
  cita_4_scheduled:     { bg: 'rgba(249,115,22,0.12)',   text: '#F97316', border: 'rgba(249,115,22,0.25)' },
  cita_4_done:          { bg: 'rgba(48,209,88,0.12)',   text: '#30D158', border: 'rgba(48,209,88,0.25)' },
  closed_go:            { bg: 'rgba(48,209,88,0.12)',   text: '#30D158', border: 'rgba(48,209,88,0.25)' },
  closed_nogo:          { bg: 'rgba(255,69,58,0.12)',   text: '#FF453A', border: 'rgba(255,69,58,0.25)' },
  closed_lost:          { bg: 'rgba(99,99,102,0.12)',   text: '#A1A1A6', border: 'rgba(99,99,102,0.25)' },
};

const TABLE_COLUMNS = [
  { key: 'client', label: 'Cliente', sortable: true },
  { key: 'sector', label: 'Sector', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'gamma', label: '\u0393', sortable: true },
  { key: 'fee', label: 'Fee', sortable: true },
  { key: 'assigned', label: 'Asignado', sortable: true },
  { key: 'updated', label: '\u00daltima actualizaci\u00f3n', sortable: true },
];

// ---------- small presentational pieces ----------

function GammaBadge({ gamma }: { gamma: number | null }) {
  if (gamma == null || isNaN(gamma)) return <span className="text-sm text-[#636366]">-</span>;
  const color = gamma > 3.0 ? '#FF453A' : gamma >= 1.5 ? '#D4A843' : '#30D158';
  return <span className="text-xl font-bold tabular-nums" style={{ color }}>{gamma.toFixed(2)}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const label = STATUS_LABELS[status] || status;
  const v = STATUS_VARIANT[status] ?? { bg: 'rgba(99,99,102,0.1)', text: '#A1A1A6', border: 'rgba(99,99,102,0.2)' };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border"
      style={{ backgroundColor: v.bg, color: v.text, borderColor: v.border }}
    >
      {label}
    </span>
  );
}

// ---------- MAIN PAGE ----------

export default function FoundationPipelinePage() {
  const navigate = useNavigate();

  const [engs, setEngs] = useState<FoundationEngagement[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'pipeline' | 'table'>('pipeline');

  // Modal state
  const [showNewModal, setShowNewModal] = useState(false);

  // Table state
  const [sortBy, setSortBy] = useState('updated');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSector, setFilterSector] = useState('');
  const [filterAssigned, setFilterAssigned] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.warn('[FoundationPipeline] Timeout loading data');
      setLoading(false);
    }, 10000);

    Promise.all([foundationDB.list(), clientsDB.list()]).then(([e, c]) => {
      clearTimeout(timeout);
      setEngs(e || []);
      setClients(c || []);
      setLoading(false);
    }).catch((err) => {
      clearTimeout(timeout);
      console.error('[FoundationPipeline] Error loading data:', err);
      setLoading(false);
    });
  }, []);

  const assignedNames = [...new Set(
    engs.map((e) => e.assigned_to || e.team_members?.full_name).filter(Boolean)
  )] as string[];
  const sectors = [...new Set(clients.map((c) => c.sector).filter(Boolean))] as string[];
  const activeEngs = engs.filter((e) => e && e.status && !e.status.startsWith('closed_'));
  const activeCount = activeEngs.length;

  const clientMap = new Map<string, Client>();
  for (const c of clients) clientMap.set(c.id, c);

  function getClientEng(eng: FoundationEngagement): Client | undefined {
    return (eng as any).clients || clientMap.get(eng.client_id);
  }

  function getFilteredSortedEngs() {
    let list = [...engs];
    if (filterStatus) list = list.filter((e) => e.status === filterStatus);
    if (filterSector) list = list.filter((e) => getClientEng(e)?.sector === filterSector);
    if (filterAssigned) list = list.filter((e) => (e.assigned_to || e.team_members?.full_name) === filterAssigned);
    list.sort((a, b) => {
      let va: any, vb: any;
      const clA = getClientEng(a), clB = getClientEng(b);
      switch (sortBy) {
        case 'client': va = clA?.name || ''; vb = clB?.name || ''; break;
        case 'sector': va = clA?.sector || ''; vb = clB?.sector || ''; break;
        case 'status': va = a.status; vb = b.status; break;
        case 'gamma': va = a.factor_gamma ?? 9999; vb = b.factor_gamma ?? 9999; break;
        case 'fee': va = a.foundation_fee ?? 9999999; vb = b.foundation_fee ?? 9999999; break;
        case 'assigned': va = a.assigned_to || a.team_members?.full_name || ''; vb = b.assigned_to || b.team_members?.full_name || ''; break;
        case 'updated': default: va = a.updated_at || ''; vb = b.updated_at || ''; break;
      }
      if (typeof va === 'string' && typeof vb === 'string') {
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortDir === 'asc' ? (va - vb) : (vb - va);
    });
    return list;
  }

  function handleSort(key: string) {
    if (sortBy === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(key); setSortDir('asc'); }
  }

  function formatDate(iso: string | null) {
    if (!iso) return '-';
    try {
      return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return '-'; }
  }

  function formatCurrency(n: number | null) {
    if (n == null) return '-';
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
  }

  const activeClientIds = new Set(engs.filter((e) => e && e.status && !e.status.startsWith('closed_')).map((e) => e.client_id));
  const availableClients = clients.filter((c) => !activeClientIds.has(c.id) && c.status !== 'archived');

  async function handleCreateEngagement(clientId: string) {
    const eng = await foundationDB.create({
      client_id: clientId,
      status: 'scoping',
      fuentes_datos: 0,
      requiere_viaticos: false,
      hallazgos: [],
    });
    setShowNewModal(false);
    navigate(`/foundation/${eng.id}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#95B877] border-t-transparent" />
      </div>
    );
  }

  if (engs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <Building2 className="h-16 w-16 mb-4" style={{ color: '#95B877' }} />
        <h2 className="text-2xl font-semibold mb-2 text-content-primary">
          No hay engagements de Foundation
        </h2>
        <p className="text-lg mb-6 text-content-secondary">
          Comienza creando el primer engagement para iniciar el pipeline.
        </p>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm transition-all hover:bg-[#95B877]/90 active:scale-[0.98]"
          style={{ backgroundColor: '#95B877' }}
        >
          <Plus className="h-4 w-4" />
          Nuevo engagement
        </button>
        {showNewModal && (
          <NewEngagementModal
            clients={availableClients}
            onClose={() => setShowNewModal(false)}
            onSelect={handleCreateEngagement}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <Building2 className="h-7 w-7" style={{ color: '#95B877' }} />
            <h1 className="text-2xl font-bold text-content-primary">Foundation Pipeline</h1>
            <span className="inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-sm font-semibold" style={{ backgroundColor: 'rgba(149,184,119,0.15)', color: '#95B877' }}>
              {activeCount}
            </span>
          </div>
          <p className="text-sm mt-1 text-content-secondary">
            {engs.length} en total &middot; {activeCount} activos
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex rounded-xl border border-[rgba(255,255,255,0.06)] overflow-hidden">
            <button
              onClick={() => setView('pipeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors
                ${view === 'pipeline' ? 'text-white' : 'bg-[#1C1C1E] hover:bg-[#2C2C2E] text-content-secondary'}`}
              style={view === 'pipeline' ? { backgroundColor: '#95B877', color: '#0D0D0F' } : {}}
            >
              <LayoutGrid className="h-4 w-4" />
              Pipeline
            </button>
            <button
              onClick={() => setView('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors
                ${view === 'table' ? 'text-white' : 'bg-[#1C1C1E] hover:bg-[#2C2C2E] text-content-secondary'}`}
              style={view === 'table' ? { backgroundColor: '#95B877', color: '#0D0D0F' } : {}}
            >
              <List className="h-4 w-4" />
              Tabla
            </button>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-[#0D0D0F] transition-all hover:bg-[#95B877]/90 active:scale-[0.98]"
            style={{ backgroundColor: '#95B877' }}
          >
            <Plus className="h-4 w-4" />
            Nuevo engagement
          </button>
        </div>
      </div>

      {/* Pipeline View (Kanban) */}
      {view === 'pipeline' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_COLUMNS.map((col) => {
            const colEngs = engs.filter((e) => col.statuses.includes(e.status));
            return (
              <div
                key={col.id}
                className="flex-shrink-0 w-72 rounded-xl border flex flex-col"
                style={{
                  maxHeight: 'calc(100vh - 220px)', minHeight: '200px',
                  backgroundColor: col.accentBg,
                  borderColor: col.accentBorder,
                }}
              >
                <div className="flex items-center justify-between px-3 py-2.5 rounded-t-xl border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.accent }} />
                    <span className="text-sm font-semibold text-content-primary">{col.label}</span>
                  </div>
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold text-content-primary" style={{ backgroundColor: `${col.accent}33` }}>
                    {colEngs.length}
                  </span>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-2">
                  {colEngs.length === 0 && (
                    <div className="text-center py-8 text-sm text-[#636366]">
                      Vac\u00edo
                    </div>
                  )}
                  {colEngs.map((eng) => {
                    const cl = getClientEng(eng);
                    const assignedName = eng.assigned_to || eng.team_members?.full_name;
                    return (
                      <button
                        key={eng.id}
                        onClick={() => navigate(`/foundation/${eng.id}`)}
                        className="w-full text-left rounded-lg p-3 transition-all hover:shadow-lg active:scale-[0.98] cursor-pointer border"
                        style={{
                          backgroundColor: '#1C1C1E',
                          borderColor: 'rgba(255,255,255,0.06)',
                        }}
                      >
                        <p className="font-semibold text-sm text-content-primary truncate">{cl?.name || 'Cliente desconocido'}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-content-secondary">
                          <span>{cl?.sector || ''}</span>
                          {cl?.city && <span>&middot; {cl.city}</span>}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <GammaBadge gamma={eng.factor_gamma} />
                          {eng.foundation_fee != null && (
                            <span className="text-xs font-medium text-content-secondary tabular-nums">{formatCurrency(eng.foundation_fee)}</span>
                          )}
                        </div>
                        {assignedName && (
                          <div className="flex items-center gap-1 mt-1.5 text-xs text-content-secondary">
                            <User className="h-3 w-3" />
                            <span className="truncate">{assignedName}</span>
                          </div>
                        )}
                        <div className="mt-2">
                          <StatusBadge status={eng.status} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div>
          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Filter className="h-4 w-4" style={{ color: '#95B877' }} />
            <FilterSelect value={filterStatus} onChange={setFilterStatus} label="Todos los status" options={Object.entries(STATUS_LABELS)} />
            <FilterSelect value={filterSector} onChange={setFilterSector} label="Todos los sectores" options={sectors.map((s) => [s, s])} />
            {assignedNames.length > 0 && (
              <FilterSelect value={filterAssigned} onChange={setFilterAssigned} label="Todos los asignados" options={assignedNames.map((n) => [n, n])} />
            )}
            {(filterStatus || filterSector || filterAssigned) && (
              <button
                onClick={() => { setFilterStatus(''); setFilterSector(''); setFilterAssigned(''); }}
                className="text-xs underline hover:opacity-70 transition-opacity"
                style={{ color: '#95B877' }}
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.06)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ backgroundColor: '#151518', borderColor: 'rgba(255,255,255,0.06)' }}>
                  {TABLE_COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      className={`text-left px-4 py-3 font-semibold text-content-secondary ${col.sortable ? 'cursor-pointer select-none hover:text-content-primary transition-colors' : ''}`}
                      onClick={() => col.sortable && handleSort(col.key)}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {col.sortable && (
                          sortBy === col.key ? (
                            sortDir === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                          )
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getFilteredSortedEngs().map((eng) => {
                  const cl = getClientEng(eng);
                  const assignedName = eng.assigned_to || eng.team_members?.full_name;
                  return (
                    <tr
                      key={eng.id}
                      className="border-b hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer"
                      style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                      onClick={() => navigate(`/foundation/${eng.id}`)}
                    >
                      <td className="px-4 py-3 font-medium text-content-primary">{cl?.name || '-'}</td>
                      <td className="px-4 py-3 text-content-secondary">{cl?.sector || '-'}</td>
                      <td className="px-4 py-3"><StatusBadge status={eng.status} /></td>
                      <td className="px-4 py-3"><GammaBadge gamma={eng.factor_gamma} /></td>
                      <td className="px-4 py-3 text-content-secondary tabular-nums">{formatCurrency(eng.foundation_fee)}</td>
                      <td className="px-4 py-3 text-content-secondary">{assignedName || '-'}</td>
                      <td className="px-4 py-3 text-xs text-[#636366]">{formatDate(eng.updated_at)}</td>
                    </tr>
                  );
                })}
                {getFilteredSortedEngs().length === 0 && (
                  <tr>
                    <td colSpan={TABLE_COLUMNS.length} className="px-4 py-8 text-center text-[#636366]">
                      No se encontraron engagements con los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showNewModal && (
        <NewEngagementModal
          clients={availableClients}
          onClose={() => setShowNewModal(false)}
          onSelect={handleCreateEngagement}
        />
      )}
    </div>
  );
}

// ---------- FILTER SELECT ----------

function FilterSelect({ value, onChange, label, options }: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: [string, string][];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-lg border bg-[#1C1C1E] pl-3 pr-8 py-1.5 text-sm text-content-secondary focus:outline-none focus:ring-1 focus:ring-[#95B877]/50"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <option value="">{label}</option>
        {options.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none" style={{ color: '#636366' }} />
    </div>
  );
}

// ---------- MODAL ----------

function NewEngagementModal({
  clients,
  onClose,
  onSelect,
}: {
  clients: Client[];
  onClose: () => void;
  onSelect: (clientId: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-xl shadow-2xl border max-w-lg w-full mx-4 flex flex-col overflow-hidden" style={{ backgroundColor: '#151518', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <h2 className="text-lg font-semibold text-content-primary">
            Nuevo Engagement
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[rgba(255,255,255,0.06)] transition-colors">
            <X className="h-5 w-5" style={{ color: '#A1A1A6' }} />
          </button>
        </div>

        <div className="px-5 py-3 text-sm text-content-secondary">
          Selecciona un cliente para crear un engagement en fase de Scoping.
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-5 space-y-2" style={{ maxHeight: '50vh' }}>
          {clients.length === 0 && (
            <div className="text-center py-8 text-sm text-content-secondary">
              No hay clientes disponibles.
            </div>
          )}
          {clients.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className="w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-all hover:shadow-md hover:border-[rgba(149,184,119,0.3)]"
              style={{ backgroundColor: '#1C1C1E', borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <Building2 className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: '#95B877' }} />
              <div className="min-w-0">
                <p className="font-medium truncate text-content-primary">{c.name}</p>
                <div className="flex items-center gap-2 text-xs mt-0.5 text-content-secondary">
                  <span>{c.sector}</span>
                  {c.city && <><span>&middot;</span><span>{c.city}</span></>}
                  {c.sucursales > 0 && <><span>&middot;</span><span>{c.sucursales} sucursal(es)</span></>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
