import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Plus, Shield, CheckCircle, XCircle, UserPlus, Users, X } from 'lucide-react';
import type { TeamMember } from '../lib/types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8001';

const ROLE_CONFIG = [
  { key: 'ceo', label: 'Admin', permissions: { operations: true, architecture_rag: true, erp_connections: true, team_management: true } },
  { key: 'consultant', label: 'Consultor', permissions: { operations: true, architecture_rag: false, erp_connections: false, team_management: false } },
];

export default function TeamPage() {
  const { isRole } = useAuthStore();

  if (!isRole('ceo')) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Shield size={40} className="text-[#A1A1A6] opacity-40" />
        <p className="text-lg font-medium text-[#F5F5F7]">Acceso restringido</p>
        <p className="text-sm text-[#A1A1A6]">Solo el Admin puede gestionar el equipo.</p>
      </div>
    );
  }

  return <TeamContent />;
}

function TeamContent() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'assignments'>('users');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', full_name: '', role: 'consultant' as string });
  const [saving, setSaving] = useState(false);
  const [createdPassword, setCreatedPassword] = useState('');

  // Assignment state
  const [assignments, setAssignments] = useState<any[]>([]);
  const [assignForm, setAssignForm] = useState({ consultant_id: '', client_id: '' });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [mRes, cRes] = await Promise.all([
        fetch(`${API_BASE}/api/v1/team/list`),
        fetch(`${API_BASE}/api/v1/clients`),
      ]);
      if (mRes.ok) setMembers(await mRes.json());
      if (cRes.ok) setClients(await cRes.json());
    } catch {}

    // Load assignments from foundation_engagements
    try {
      const res = await fetch(`${API_BASE}/api/v1/assignments`, {
        headers: { 'apikey': (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '' },
      }).catch(() => null);
      if (res?.ok) setAssignments(await res.json());
    } catch {}

    setLoading(false);
  }

  const handleCreateUser = async () => {
    if (!form.email || !form.full_name) return;
    setSaving(true);
    setCreatedPassword('');
    try {
      const res = await fetch(`${API_BASE}/api/v1/team/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Error creando usuario');
      setCreatedPassword(data.temporary_password);
      void loadData();
    } catch (err) {
      alert('Error: ' + (err as Error).message);
    } finally { setSaving(false); }
  };

  const handleDeactivate = async (m: TeamMember) => {
    if (!confirm(`¿Desactivar a ${m.full_name}?`)) return;
    try {
      await fetch(`${API_BASE}/api/v1/team/${m.id}/deactivate`, { method: 'POST' });
      setMembers(prev => prev.map(x => x.id === m.id ? { ...x, is_active: false } : x));
    } catch {}
  };

  const handleReactivate = async (id: string) => {
    try {
      await fetch(`${API_BASE}/api/v1/team/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: true }),
      });
      setMembers(prev => prev.map(x => x.id === id ? { ...x, is_active: true } : x));
    } catch {}
  };

  // Client assignment handlers
  const assignClient = async () => {
    if (!assignForm.consultant_id || !assignForm.client_id) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignForm),
      });
      if (res.ok) {
        setAssignForm({ consultant_id: '', client_id: '' });
        void loadData();
      }
    } catch {}
  };

  const removeAssignment = async (id: string) => {
    try {
      await fetch(`${API_BASE}/api/v1/assignments/${id}`, { method: 'DELETE' });
      setAssignments(prev => prev.filter(a => a.id !== id));
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-medium text-[#F5F5F7]">Equipo</h1>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-[#0D0D0F]/50 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all ${
            activeTab === 'users'
              ? 'bg-[#1C1C1E] shadow-sm text-[#F5F5F7] font-medium'
              : 'text-[#A1A1A6] hover:text-[#F5F5F7]'
          }`}
        >
          <UserPlus size={14} /> Usuarios
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all ${
            activeTab === 'assignments'
              ? 'bg-[#1C1C1E] shadow-sm text-[#F5F5F7] font-medium'
              : 'text-[#A1A1A6] hover:text-[#F5F5F7]'
          }`}
        >
          <Users size={14} /> Asignar clientes
        </button>
      </div>

      {/* Tab: Usuarios */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Add user button */}
          <div className="flex items-center justify-end">
            <Button onClick={() => { setShowForm(true); setCreatedPassword(''); }} icon={<Plus size={14} />}>
              Agregar usuario
            </Button>
          </div>

          {/* Member list */}
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin w-6 h-6 border-2 border-[#95B877] border-t-transparent rounded-full" />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-[rgba(255,255,255,0.08)] rounded-xl bg-[#0D0D0F]/30">
              <p className="text-[#A1A1A6]">No hay usuarios registrados.</p>
              <p className="text-sm text-[#A1A1A6] mt-1">Agrega el primer usuario para comenzar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {members.map(m => {
                const roleCfg = ROLE_CONFIG.find(r => r.key === m.role);
                return (
                  <div key={m.id} className={`bg-[#1C1C1E] rounded-xl border p-5 transition-all ${m.is_active ? 'border-[rgba(255,255,255,0.08)]' : 'border-gray-200 opacity-60'}`}>
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-[#95B877]/15 flex items-center justify-center">
                          <span className="text-lg font-bold text-[#95B877]">{m.full_name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${m.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <p className="text-base font-semibold text-[#F5F5F7]">{m.full_name}</p>
                          <Badge variant={m.role === 'ceo' ? 'primary' : 'neutral'} size="sm" dot={false}>
                            {roleCfg?.label || m.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#A1A1A6]">{m.email}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {m.is_active ? (
                          <button onClick={() => handleDeactivate(m)} className="text-xs text-[#A1A1A6] hover:text-[#FF453A] px-3 py-1.5 rounded border border-[rgba(255,255,255,0.08)] hover:border-[#FF453A]/30 transition-colors">
                            Desactivar
                          </button>
                        ) : (
                          <button onClick={() => handleReactivate(m.id)} className="text-xs text-[#95B877] hover:underline px-3 py-1.5">
                            Reactivar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Asignar clientes */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          {/* Assignment form */}
          <div className="bg-[#1C1C1E] rounded-xl border border-[rgba(255,255,255,0.08)] p-5">
            <h3 className="text-sm font-semibold text-[#F5F5F7] mb-3">Asignar consultor a cliente</h3>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1A6] px-0.5">Consultor</label>
                <select className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1C1C1E] text-sm text-[#F5F5F7]" value={assignForm.consultant_id} onChange={e => setAssignForm(f => ({ ...f, consultant_id: e.target.value }))}>
                  <option value="">Seleccionar consultor...</option>
                  {members.filter(m => m.role === 'consultant' && m.is_active).map(m => (
                    <option key={m.id} value={m.id}>{m.full_name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1A6] px-0.5">Cliente</label>
                <select className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1C1C1E] text-sm text-[#F5F5F7]" value={assignForm.client_id} onChange={e => setAssignForm(f => ({ ...f, client_id: e.target.value }))}>
                  <option value="">Seleccionar cliente...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <Button onClick={assignClient} disabled={!assignForm.consultant_id || !assignForm.client_id} icon={<UserPlus size={14} />}>
                Asignar
              </Button>
            </div>
          </div>

          {/* Assignment list */}
          {assignments.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-[rgba(255,255,255,0.08)] rounded-xl bg-[#0D0D0F]/30">
              <p className="text-[#A1A1A6]">No hay asignaciones de clientes.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {assignments.map(a => (
                <div key={a.id} className="bg-[#1C1C1E] rounded-xl border border-[rgba(255,255,255,0.08)] px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#95B877]/15 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#95B877]">{a.consultant_name?.charAt(0) || '?'}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#F5F5F7]">{a.consultant_name}</p>
                      <p className="text-xs text-[#A1A1A6]">→ {a.client_name}</p>
                    </div>
                  </div>
                  <button onClick={() => removeAssignment(a.id)} className="p-1.5 rounded hover:bg-red-50 text-[#A1A1A6] hover:text-[#FF453A] transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Result Modal */}
      {showForm && !createdPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowForm(false); }} />
          <div className="relative bg-[#1C1C1E] rounded-2xl border border-[rgba(255,255,255,0.08)] w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#F5F5F7]">Agregar usuario</h2>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1A6] px-0.5">Correo electr&oacute;nico</label>
                <input className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1C1C1E] text-sm text-[#F5F5F7] placeholder-[#A1A1A6]" type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1A6] px-0.5">Nombre completo</label>
                <input className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1C1C1E] text-sm text-[#F5F5F7] placeholder-[#A1A1A6]" placeholder="Nombre del usuario" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1A6] px-0.5">Rol</label>
                <select className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1C1C1E] text-sm text-[#F5F5F7]" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  {ROLE_CONFIG.map(r => (
                    <option key={r.key} value={r.key}>{r.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button size="sm" onClick={handleCreateUser} isLoading={saving}>Crear usuario</Button>
            </div>
          </div>
        </div>
      )}

      {/* Password result */}
      {createdPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-[#1C1C1E] rounded-2xl border border-[rgba(255,255,255,0.08)] w-full max-w-md p-6 space-y-4">
            <div className="text-center">
              <CheckCircle size={32} className="mx-auto text-[#95B877]" />
              <h2 className="text-lg font-semibold text-[#F5F5F7] mt-3">Usuario creado</h2>
              <p className="text-sm text-[#A1A1A6] mt-1">Contraseña temporal para {form.email}:</p>
              <div className="mt-3 p-3 bg-[#0D0D0F] rounded-lg">
                <code className="text-sm font-mono font-bold text-[#F5F5F7] select-all">{createdPassword}</code>
              </div>
              <p className="text-xs text-[#A1A1A6] mt-2">Comparte esta contraseña con el usuario.</p>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => { setShowForm(false); setCreatedPassword(''); setForm({ email: '', full_name: '', role: 'consultant' }); }}>Listo</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
