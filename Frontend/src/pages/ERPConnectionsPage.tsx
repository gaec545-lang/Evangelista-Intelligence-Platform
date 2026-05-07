import { useState, useEffect, useMemo } from 'react';
import { api } from '../lib/api';
import { clientsDB } from '../lib/supabase';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Plus, Database, AlertTriangle, CheckCircle, Trash2, ExternalLink, Shield, Zap, X, Server, FileCode, Globe, FileSpreadsheet, KeyRound, Cloud, FileText } from 'lucide-react';
import type { Client } from '../lib/types';

const ERP_SYSTEMS = ['SAP Business One', 'SAP HANA', 'Microsoft Dynamics 365', 'Oracle NetSuite', 'CONTPAQi', 'Aspel', 'Otro'];

const CONNECTION_METHODS = [
  {
    key: 'direct',
    label: 'Conexión directa',
    icon: Server,
    description: 'TCP/IP directo al motor de base de datos del cliente.',
    fields: ['host', 'port', 'database', 'username', 'password'],
    erpCompatible: ['postgresql', 'mysql', 'sql_server', 'sap_hana', 'sap_b1'],
  },
  {
    key: 'odbc',
    label: 'ODBC / Bridge local',
    icon: FileCode,
    description: 'Usa un driver ODBC instalado localmente como puente.',
    fields: ['dsn_name', 'username', 'password'],
    erpCompatible: ['sap_hana', 'sql_server', 'oracle', 'db2'],
  },
  {
    key: 'api_rest',
    label: 'API REST / OData',
    icon: Globe,
    description: 'Conexión via API del ERP (OData, REST endpoints).',
    fields: ['api_base_url', 'api_key', 'oauth_token'],
    erpCompatible: ['dynamics_365', 'netsuite', 'sap_b1'],
  },
  {
    key: 'csv_export',
    label: 'CSV / Archivos exportados',
    icon: FileSpreadsheet,
    description: 'Importación periódica de archivos CSV/Excel exportados por el ERP.',
    fields: ['upload_path', 'schedule'],
    erpCompatible: ['contpaqi', 'aspel', 'otro'],
  },
  {
    key: 'ssh_tunnel',
    label: 'Túnel SSH',
    icon: KeyRound,
    description: 'Conexión segura vía bastion host SSH al ERP.',
    fields: ['ssh_host', 'ssh_port', 'ssh_username', 'ssh_key', 'db_host', 'db_port', 'database', 'db_username', 'db_password'],
    erpCompatible: ['postgresql', 'mysql', 'sql_server'],
  },
  {
    key: 'webhook',
    label: 'Webhook / Push',
    icon: Cloud,
    description: 'El ERP empuja datos via webhook a nuestro sistema.',
    fields: ['endpoint_url', 'auth_header', 'webhook_secret'],
    erpCompatible: ['dynamics_365', 'netsuite', 'sap_b1', 'otro'],
  },
];

const CONNECTION_METHOD_ICONS: Record<string, React.ComponentType<any>> = {
  direct: Server,
  odbc: FileCode,
  api_rest: Globe,
  csv_export: FileSpreadsheet,
  ssh_tunnel: KeyRound,
  webhook: Cloud,
};

// API_BASE removed — handled by api.ts centrally

interface ErpConnection {
  id: string;
  client_id: string;
  client_name: string;
  erp_type: string;
  connection_method: string;
  host: string;
  database_name: string;
  status: 'active' | 'inactive' | 'error';
  last_test: string | null;
  is_read_only: boolean;
  connection_config: Record<string, string>;
  created_at: string;
}

export default function ERPConnectionsPage() {
  const [connections, setConnections] = useState<ErpConnection[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [formStep, setFormStep] = useState<'erp' | 'method' | 'config'>('erp');
  const [form, setForm] = useState({
    client_id: '',
    erp_type: ERP_SYSTEMS[0],
    connection_method: 'direct',
    // Common fields
    host: '',
    port: '',
    database_name: '',
    username: '',
    password: '',
    is_read_only: true,
    // ODBC fields
    dsn_name: '',
    // API REST fields
    api_base_url: '',
    api_key: '',
    oauth_token: '',
    // CSV fields
    upload_path: '',
    schedule: 'daily',
    // SSH tunnel fields
    ssh_host: '',
    ssh_port: '22',
    ssh_username: '',
    ssh_key: '',
    db_host: '',
    db_port: '',
    db_username: '',
    db_password: '',
    // Webhook fields
    endpoint_url: '',
    auth_header: '',
    webhook_secret: '',
  });
  const [testingId, setTestingId] = useState<string | null>(null);

  // Filter methods compatible with selected ERP
  const availableMethods = useMemo(() => {
    const erpKey = form.erp_type.toLowerCase().replace(/\s+/g, '_');
    return CONNECTION_METHODS.filter(m => m.erpCompatible.includes(erpKey) || m.erpCompatible.includes('otro'));
  }, [form.erp_type]);

  // Get required fields for selected method
  const currentMethodFields = useMemo(() => {
    return CONNECTION_METHODS.find(m => m.key === form.connection_method)?.fields ?? [];
  }, [form.connection_method]);

  useEffect(() => {
    Promise.all([
      fetchConnections(),
      clientsDB.list()
    ]).then(([conns, cl]) => {
      setConnections(conns);
      setClients(cl);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function fetchConnections(): Promise<ErpConnection[]> {
    try {
      return api.get<ErpConnection[]>('/api/v1/erp-connections');
    } catch {
      return [];
    }
  }

  function resetForm() {
    setShowNew(false);
    setFormStep('erp');
    setForm({
      client_id: '', erp_type: ERP_SYSTEMS[0], connection_method: 'direct',
      host: '', port: '', database_name: '', username: '', password: '', is_read_only: true,
      dsn_name: '', api_base_url: '', api_key: '', oauth_token: '',
      upload_path: '', schedule: 'daily', ssh_host: '', ssh_port: '22', ssh_username: '', ssh_key: '',
      db_host: '', db_port: '', db_username: '', db_password: '',
      endpoint_url: '', auth_header: '', webhook_secret: '',
    });
  }

  function canProceedToNext() {
    if (formStep === 'erp') return form.client_id && form.erp_type;
    if (formStep === 'method') return form.connection_method;
    return true;
  }

  function handleNext() {
    if (!canProceedToNext()) return;
    if (formStep === 'erp') { setFormStep('method'); return; }
    if (formStep === 'method') { setFormStep('config'); return; }
    handleCreate();
  }

  async function handleCreate() {
    if (!form.client_id || !form.connection_method) return;
    const payload = {
      client_id: form.client_id,
      erp_type: form.erp_type,
      connection_method: form.connection_method,
      is_read_only: form.is_read_only,
      connection_config: getConnectionConfigValues(form, form.connection_method),
    };
    try {
      await api.post('/api/v1/erp-connections', payload);
      setConnections(await fetchConnections());
      resetForm();
    } catch (err) {
      alert('Error al crear conexión: ' + (err as Error).message);
    }
  }

  async function handleTest(id: string) {
    setTestingId(id);
    try {
      await api.post(`/api/v1/erp-connections/${id}/test`, {});
      setConnections(prev => prev.map(c => c.id === id ? { ...c, status: 'active' as const, last_test: new Date().toISOString() } : c));
    } catch {
      setConnections(prev => prev.map(c => c.id === id ? { ...c, status: 'error' as const, last_test: new Date().toISOString() } : c));
    } finally {
      setTestingId(null);
    }
  }

  // Extract the relevant config values based on connection method
  function getConnectionConfigValues(formData: typeof form, method: string): Record<string, string> {
    const methodFields = CONNECTION_METHODS.find(m => m.key === method)?.fields ?? [];
    const config: Record<string, string> = {};
    for (const fieldKey of methodFields) {
      const cfg = fieldConfig[fieldKey];
      if (!cfg) continue;
      config[cfg.key] = (formData as any)[cfg.key] ?? '';
    }
    return config;
  }

  async function handleRevoke(id: string) {
    if (!confirm('¿Revocar esta conexión ERP? Esto eliminará las credenciales cifradas.')) return;
    try {
      await api.delete(`/api/v1/erp-connections/${id}`);
      setConnections(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Error: ' + (err as Error).message);
    }
  }

  function formatTimeAgo(date: string | null) {
    if (!date) return 'Nunca';
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `hace ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `hace ${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `hace ${days} d`;
  }

  const clientsWithoutConnection = clients.filter(c => !connections.find(conn => conn.client_id === c.id));

  // Step indicator
  const steps = [
    { key: 'erp' as const, label: '1. ERP' },
    { key: 'method' as const, label: '2. Método' },
    { key: 'config' as const, label: '3. Detalles' },
  ];

  // Field definitions per method for form rendering
  const fieldConfig: Record<string, { key: string; label: string; type?: string; placeholder?: string }> = {
    host: { key: 'host', label: 'Host / IP del servidor', placeholder: 'erp.cliente.com' },
    port: { key: 'port', label: 'Puerto', type: 'number', placeholder: '5432' },
    database: { key: 'database_name', label: 'Nombre de la base de datos', placeholder: 'HANA_DB' },
    username: { key: 'username', label: 'Usuario', placeholder: 'evangelista_ro' },
    password: { key: 'password', label: 'Contraseña', type: 'password', placeholder: '••••••••' },
    dsn_name: { key: 'dsn_name', label: 'Nombre del DSN (origen de datos ODBC)', placeholder: 'SAP_HANA_DSN' },
    api_base_url: { key: 'api_base_url', label: 'URL base de la API / OData', placeholder: 'https://api.erp.com/odata/v4' },
    api_key: { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'sk-••••••••' },
    oauth_token: { key: 'oauth_token', label: 'OAuth Token (opcional)', type: 'password', placeholder: 'Bearer ••••••••' },
    upload_path: { key: 'upload_path', label: 'Ruta de subida (folder o S3)', placeholder: '/exports/cliente/' },
    schedule: { key: 'schedule', label: 'Frecuencia de importación' },
    ssh_host: { key: 'ssh_host', label: 'Host del bastion SSH', placeholder: 'ssh.cliente.com' },
    ssh_port: { key: 'ssh_port', label: 'Puerto SSH', type: 'number', placeholder: '22' },
    ssh_username: { key: 'ssh_username', label: 'Usuario SSH', placeholder: 'evangelista' },
    ssh_key: { key: 'ssh_key', label: 'Llave SSH (PEM, sin passphrase)', type: 'password', placeholder: '-----BEGIN RSA PRIVATE KEY-----' },
    db_host: { key: 'db_host', label: 'Host de la base de datos (interno)', placeholder: 'localhost' },
    db_port: { key: 'db_port', label: 'Puerto de la base de datos', type: 'number', placeholder: '5432' },
    db_username: { key: 'db_username', label: 'Usuario de la base de datos', placeholder: 'readonly' },
    db_password: { key: 'db_password', label: 'Contraseña de la base de datos', type: 'password', placeholder: '••••••••' },
    endpoint_url: { key: 'endpoint_url', label: 'URL del endpoint local', placeholder: 'http://localhost:8001/webhook/data' },
    auth_header: { key: 'auth_header', label: 'Header de autenticación', type: 'password', placeholder: 'X-Webhook-Key: ••••••••' },
    webhook_secret: { key: 'webhook_secret', label: 'Webhook Secret', type: 'password', placeholder: 'whsec_••••••••' },
  };

  function renderConnectionFields() {
    return (
      <div className="space-y-3">
        {currentMethodFields.map(fieldKey => {
          const cfg = fieldConfig[fieldKey];
          if (!cfg) return null;
          return (
            <div key={cfg.key}>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1A6] px-0.5 block mb-1">
                {cfg.label}
              </label>
              {cfg.key === 'schedule' ? (
                <select
                  className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1C1C1E] text-sm text-[#F5F5F7]"
                  value={form.schedule}
                  onChange={e => setForm(f => ({ ...f, schedule: e.target.value }))}
                >
                  <option value="daily">Diaria</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensual</option>
                </select>
              ) : (
                <input
                  className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1C1C1E] text-sm text-[#F5F5F7] placeholder-[#A1A1A6]"
                  type={cfg.type ?? 'text'}
                  placeholder={cfg.placeholder}
                  value={(form as any)[cfg.key] ?? ''}
                  onChange={e => setForm(f => ({ ...f, [cfg.key]: e.target.value }))}
                />
              )}
            </div>
          );
        })}
        {/* Read-only toggle for direct DB connections */}
        {form.connection_method === 'direct' && (
          <label className="flex items-center gap-2 text-sm text-[#F5F5F7] pt-1">
            <input type="checkbox" checked={form.is_read_only} onChange={e => setForm(f => ({ ...f, is_read_only: e.target.checked }))} className="rounded border-[rgba(255,255,255,0.08)]" />
            Read-Only (recomendado)
          </label>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#F5F5F7]">Conexiones ERP</h1>
          <p className="text-sm text-[#A1A1A6] mt-1">{connections.length} conexiones activas</p>
        </div>
        <Button onClick={() => setShowNew(true)} icon={<Plus size={14} />}>Nueva conexión</Button>
      </div>

      {/* Security notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <Shield size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Credenciales cifradas</p>
          <p className="text-xs text-amber-700 mt-0.5">Las credenciales se almacenan cifradas con pgsodium en Supabase Vault. Solo el backend las descifra en runtime. Nunca se exponen en la UI ni en responses de API.</p>
        </div>
      </div>

      {/* Loading */}
      {loading && <div className="flex justify-center py-12"><div className="animate-spin w-6 h-6 border-2 border-[#95B877] border-t-transparent rounded-full" /></div>}

      {/* Empty state */}
      {!loading && connections.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-[rgba(255,255,255,0.08)] rounded-xl bg-[#0D0D0F]/30">
          <Database size={32} className="mx-auto mb-3 text-[#A1A1A6] opacity-40" />
          <h3 className="text-sm font-medium text-[#F5F5F7]">Sin conexiones ERP</h3>
          <p className="text-xs text-[#A1A1A6] mt-1 mb-4">Configura la primera conexión ERP de un cliente.</p>
          <Button size="sm" onClick={() => setShowNew(true)} icon={<Plus size={14} />}>Nueva conexión</Button>
        </div>
      )}

      {/* Connection cards */}
      {!loading && connections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connections.map(conn => (
            <div key={conn.id} className="bg-[#1C1C1E] rounded-xl border border-[rgba(255,255,255,0.08)] p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-base font-semibold text-[#F5F5F7]">{conn.client_name}</p>
                  <p className="text-sm text-[#A1A1A6]">{conn.erp_type}</p>
                  {conn.connection_method && CONNECTION_METHOD_ICONS[conn.connection_method] && (() => {
                    const Icon = CONNECTION_METHOD_ICONS[conn.connection_method];
                    const methodLabel = CONNECTION_METHODS.find(m => m.key === conn.connection_method)?.label || conn.connection_method;
                    return (
                      <span className="text-[10px] text-[#95B877] font-medium flex items-center gap-1 mt-0.5">
                        <Icon size={10} /> {methodLabel}
                      </span>
                    );
                  })()}
                </div>
                <Badge variant={conn.status === 'active' ? 'success' : conn.status === 'error' ? 'danger' : 'neutral'} size="sm" dot={false}>
                  {conn.status === 'active' ? 'Activa' : conn.status === 'error' ? 'Error' : 'Inactiva'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-xs mb-4">
                <span className="text-[#A1A1A6]">Host</span>
                <span className="font-mono text-[#F5F5F7]">{conn.host}</span>
                <span className="text-[#A1A1A6]">Base de datos</span>
                <span className="font-mono text-[#F5F5F7]">{conn.database_name}</span>
                <span className="text-[#A1A1A6]">Modo</span>
                <span className="text-[#F5F5F7]">{conn.is_read_only ? 'Read-Only' : 'Read/Write'}</span>
                <span className="text-[#A1A1A6]">Último test</span>
                <span className="text-[#F5F5F7]">{formatTimeAgo(conn.last_test)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" isLoading={testingId === conn.id} onClick={() => handleTest(conn.id)}>
                  <Zap size={12} className={testingId === conn.id ? '' : 'mr-1'} /> Test
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleRevoke(conn.id)} icon={<Trash2 size={14} />}>
                  Revocar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal — Multi-step */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative bg-[#1C1C1E] rounded-2xl border border-[rgba(255,255,255,0.08)] w-full max-w-lg p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#F5F5F7]">Nueva conexión ERP</h2>
              <button onClick={resetForm} className="text-[#A1A1A6] hover:text-[#F5F5F7]"><X size={18} /></button>
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-1">
              {steps.map(s => {
                const stepOrder = ['erp', 'method', 'config'];
                const isActive = s.key === formStep;
                const isDone = stepOrder.indexOf(s.key) < stepOrder.indexOf(formStep);
                return (
                  <span key={s.key} className={`text-[10px] font-medium px-2 py-1 rounded-full transition ${
                    isActive ? 'bg-[#95B877] text-white' : isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-[#0D0D0F] text-[#A1A1A6]'
                  }`}>{s.label}</span>
                );
              })}
            </div>

            {/* Step 1: ERP + Client */}
            {formStep === 'erp' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1A6] px-0.5 block mb-1">Cliente</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1C1C1E] text-sm text-[#F5F5F7]" value={form.client_id} onChange={e => setForm(f => ({ ...f, client_id: e.target.value }))}>
                    <option value="">Seleccionar cliente...</option>
                    {clientsWithoutConnection.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1A6] px-0.5 block mb-1">ERP / Sistema</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1C1C1E] text-sm text-[#F5F5F7]" value={form.erp_type} onChange={e => setForm(f => ({ ...f, erp_type: e.target.value }))}>
                    {ERP_SYSTEMS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="bg-[#0D0D0F] rounded-lg p-3 text-xs text-[#A1A1A6]">
                  <p className="font-medium mb-1">¿Por qué múltiples métodos?</p>
                  <p>Algunos ERPs no permiten conexión directa por políticas de seguridad. En el siguiente paso podrás elegir entre conexión directa, ODBC, API REST, CSV exportados, túnel SSH o webhook.</p>
                </div>
              </div>
            )}

            {/* Step 2: Connection Method */}
            {formStep === 'method' && (
              <div className="space-y-3">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1A6] px-0.5">
                  Método de conexión — <span className="text-[#95B877]">{form.erp_type}</span>
                </label>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {availableMethods.length === 0 && (
                    <p className="text-sm text-[#A1A1A6]">No se encontraron métodos compatibles.</p>
                  )}
                  {availableMethods.map(m => {
                    const Icon = m.icon;
                    const isSelected = m.key === form.connection_method;
                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, connection_method: m.key }))}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-[#95B877] bg-[#95B877]/5 shadow-sm'
                            : 'border-[rgba(255,255,255,0.08)] bg-[#1C1C1E] hover:border-[#95B877]/40'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#95B877] text-white' : 'bg-[#0D0D0F] text-[#A1A1A6]'
                          }`}>
                            <Icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#F5F5F7]">{m.label}</p>
                            <p className="text-xs text-[#A1A1A6] mt-0.5">{m.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Fallback: add custom method */}
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, connection_method: 'custom' }))}
                  className={`w-full text-center p-3 rounded-xl border-2 border-dashed transition-all text-sm ${
                    form.connection_method === 'custom'
                      ? 'border-[#95B877] text-[#95B877] bg-[#95B877]/5'
                      : 'border-gray-200 text-gray-400 hover:border-[#95B877]/40 hover:text-[#A1A1A6]'
                  }`}
                >
                  + Otro método personalizado
                </button>
              </div>
            )}

            {/* Step 3: Connection-specific fields */}
            {formStep === 'config' && (
              <div>
                <p className="text-xs text-[#A1A1A6] mb-3">
                  Configuración para <span className="text-[#F5F5F7] font-medium">{CONNECTION_METHODS.find(m => m.key === form.connection_method)?.label || form.connection_method}</span>
                </p>
                {form.connection_method === 'custom' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-[#A1A1A6] px-0.5 block mb-1">Descripción del método</label>
                      <textarea
                        className="w-full px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#1C1C1E] text-sm text-[#F5F5F7] placeholder-[#A1A1A6] resize-none"
                        rows={3}
                        placeholder="Describe cómo se conectará el ERP (ej: via file sync, via vendor SDK, etc.)"
                        value={form.host}
                        onChange={e => setForm(f => ({ ...f, host: e.target.value }))}
                      />
                    </div>
                  </div>
                ) : (
                  renderConnectionFields()
                )}
                <div className="bg-[#0D0D0F]/60 rounded-lg p-3 text-xs text-[#A1A1A6] mt-3 flex items-center gap-2">
                  <Shield size={12} className="shrink-0" />
                  <span>Credenciales cifradas automáticamente con pgsodium en Supabase Vault.</span>
                </div>
              </div>
            )}

            {/* Footer buttons */}
            <div className="flex gap-2 justify-end pt-2">
              {formStep !== 'erp' ? (
                <Button size="sm" variant="ghost" onClick={() => {
                  const order = ['erp', 'method', 'config'];
                  const idx = order.indexOf(formStep);
                  setFormStep(order[idx - 1] as any);
                }}>Atrás</Button>
              ) : (
                <Button size="sm" variant="ghost" onClick={resetForm}>Cancelar</Button>
              )}
              {formStep === 'erp' || formStep === 'method' ? (
                <Button size="sm" onClick={handleNext}>Siguiente</Button>
              ) : (
                <Button size="sm" onClick={handleCreate}>Crear conexión</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
