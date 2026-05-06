import { useState } from 'react';
import { Clock, Plus, Trash2, CheckCircle, DollarSign } from 'lucide-react';
import { timeTrackerDB } from '../../lib/supabase';
import type { TimeEntry, TimeEntryBillable } from '../../lib/types';
import { Button } from '../ui/Button';

interface TimeTrackerProps {
  teamMemberId: string;
  projectId?: string;
  foundationId?: string;
  hourlyRate?: number;  // default rate for the consultant
}

const CATEGORIES: { value: TimeEntry['category']; label: string }[] = [
  { value: 'scoping', label: 'Scoping' },
  { value: 'analisis', label: 'Análisis' },
  { value: 'presentacion', label: 'Presentación' },
  { value: 'documentacion', label: 'Documentación' },
  { value: 'reunion_cliente', label: 'Reunión Cliente' },
  { value: 'administracion', label: 'Administración' },
  { value: 'otro', label: 'Otro' },
];

const BILLABLE_OPTIONS: { value: TimeEntryBillable; label: string; color: string }[] = [
  { value: 'facturable', label: 'Facturable', color: 'text-service-sentinel' },
  { value: 'no_facturable', label: 'No Facturable', color: 'text-eva-txt-muted' },
  { value: 'interno', label: 'Interno', color: 'text-service-architecture' },
];

const initialForm = {
  description: '',
  category: 'analisis' as TimeEntry['category'],
  date: new Date().toISOString().split('T')[0],
  hours: '',
  billable: 'facturable' as TimeEntryBillable,
  notes: '',
};

export default function TimeTracker({
  teamMemberId,
  projectId,
  foundationId,
  hourlyRate = 150,
}: TimeTrackerProps) {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const data = await timeTrackerDB.list({ team_member_id: teamMemberId, project_id: projectId, foundation_id: foundationId });
      setEntries(data);
    } catch (e) {
      console.error('TimeTracker fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Load on first open
  const handleOpen = () => {
    setShowForm(true);
    if (entries.length === 0) fetchEntries();
  };

  const handleSave = async () => {
    if (!form.description || !form.hours) return;
    setSaving(true);
    try {
      const entry = await timeTrackerDB.create({
        team_member_id: teamMemberId,
        project_id: projectId,
        foundation_id: foundationId,
        description: form.description,
        category: form.category,
        date: form.date,
        hours: parseFloat(form.hours),
        billable: form.billable,
        hourly_rate: form.billable === 'facturable' ? hourlyRate : 0,
        notes: form.notes || undefined,
      });
      setEntries(prev => [entry, ...prev]);
      setForm(initialForm);
    } catch (e) {
      console.error('TimeTracker save error:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await timeTrackerDB.delete(id);
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch (e) {
      console.error('TimeTracker delete error:', e);
    }
  };

  // Metrics
  const totalHours = entries.reduce((s, e) => s + e.hours, 0);
  const billableHours = entries.filter(e => e.billable === 'facturable').reduce((s, e) => s + e.hours, 0);
  const estimatedRevenue = entries.filter(e => e.billable === 'facturable').reduce((s, e) => s + e.hours * (e.hourly_rate ?? hourlyRate), 0);
  const efficiency = totalHours > 0 ? Math.round((billableHours / totalHours) * 100) : 0;

  return (
    <div className="bg-white border border-eva-border rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-eva-border flex items-center justify-between bg-eva-beige/30">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-eva-olive" />
          <h3 className="font-ui text-sm font-semibold text-eva-black">Time Tracker</h3>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={showForm ? () => setShowForm(false) : handleOpen}
          aria-label="Toggle time tracker"
        >
          {showForm ? 'Cerrar' : 'Registrar Tiempo'}
        </Button>
      </div>

      {showForm && (
        <div className="p-4 space-y-4">
          {/* KPI Strip */}
          <div className="grid grid-cols-3 gap-3 pb-3 border-b border-eva-border">
            <div className="text-center">
              <p className="caps-detail mb-1">Total Hrs</p>
              <p className="font-ui text-lg font-bold text-eva-black">{totalHours.toFixed(1)}h</p>
            </div>
            <div className="text-center">
              <p className="caps-detail mb-1">Facturables</p>
              <p className="font-ui text-lg font-bold text-service-sentinel">{billableHours.toFixed(1)}h</p>
              <p className="text-[10px] text-eva-txt-muted">{efficiency}% eficiencia</p>
            </div>
            <div className="text-center">
              <p className="caps-detail mb-1">Valor Est.</p>
              <p className="font-ui text-lg font-bold text-eva-gold">
                ${estimatedRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          {/* New Entry Form */}
          <div className="space-y-3">
            <p className="caps-detail">Nueva Entrada</p>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="border border-eva-border rounded-lg px-3 py-2 text-sm font-ui text-eva-black bg-white focus:outline-none focus:ring-1 focus:ring-eva-olive/30 focus:border-eva-olive"
              />
              <input
                type="number"
                step="0.25"
                min="0.25"
                max="24"
                placeholder="Horas (ej. 1.5)"
                value={form.hours}
                onChange={e => setForm(p => ({ ...p, hours: e.target.value }))}
                className="border border-eva-border rounded-lg px-3 py-2 text-sm font-ui text-eva-black bg-white focus:outline-none focus:ring-1 focus:ring-eva-olive/30 focus:border-eva-olive"
              />
            </div>
            <input
              type="text"
              placeholder="Descripción de la actividad..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full border border-eva-border rounded-lg px-3 py-2 text-sm font-ui text-eva-black bg-white focus:outline-none focus:ring-1 focus:ring-eva-olive/30 focus:border-eva-olive"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value as TimeEntry['category'] }))}
                className="border border-eva-border rounded-lg px-3 py-2 text-sm font-ui text-eva-black bg-white focus:outline-none focus:ring-1 focus:ring-eva-olive/30 focus:border-eva-olive"
              >
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <select
                value={form.billable}
                onChange={e => setForm(p => ({ ...p, billable: e.target.value as TimeEntryBillable }))}
                className="border border-eva-border rounded-lg px-3 py-2 text-sm font-ui text-eva-black bg-white focus:outline-none focus:ring-1 focus:ring-eva-olive/30 focus:border-eva-olive"
              >
                {BILLABLE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              isLoading={saving}
              disabled={!form.description || !form.hours}
              aria-label="Guardar entrada de tiempo"
              className="w-full"
            >
              <Plus size={14} />
              Guardar Entrada
            </Button>
          </div>

          {/* Entry List */}
          {loading ? (
            <p className="text-xs text-eva-txt-muted text-center py-4">Cargando entradas…</p>
          ) : entries.length === 0 ? (
            <p className="text-xs text-eva-txt-muted text-center py-4">Sin entradas registradas.</p>
          ) : (
            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {entries.map(e => {
                const billableInfo = BILLABLE_OPTIONS.find(b => b.value === e.billable);
                return (
                  <div key={e.id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-eva-beige/50 border border-eva-border/50 group">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-ui font-medium text-eva-black truncate">{e.description}</p>
                      <p className="text-[10px] text-eva-txt-muted">{e.date} · {CATEGORIES.find(c => c.value === e.category)?.label}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-mono font-bold ${billableInfo?.color}`}>{e.hours}h</span>
                      {e.billable === 'facturable' && (
                        <DollarSign size={11} className="text-eva-gold" />
                      )}
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600"
                        aria-label="Eliminar entrada"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
