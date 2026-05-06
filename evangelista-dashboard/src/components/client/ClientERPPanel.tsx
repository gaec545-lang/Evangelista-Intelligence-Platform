import { useState, useEffect, useMemo } from 'react'
import { api } from '../../lib/api'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { Plus, Database, Shield, Zap, Trash2, X, Server, FileCode, Globe, FileSpreadsheet, KeyRound, Cloud } from 'lucide-react'

const ERP_SYSTEMS = ['SAP Business One', 'SAP HANA', 'Microsoft Dynamics 365', 'Oracle NetSuite', 'CONTPAQi', 'Aspel', 'Otro']

const CONNECTION_METHODS = [
  { key: 'direct', label: 'Conexión directa', icon: Server, fields: ['host','port','database','username','password'] },
  { key: 'odbc', label: 'ODBC / Bridge', icon: FileCode, fields: ['dsn_name','username','password'] },
  { key: 'api_rest', label: 'API REST', icon: Globe, fields: ['api_base_url','api_key'] },
  { key: 'csv_export', label: 'CSV / Archivos', icon: FileSpreadsheet, fields: ['upload_path','schedule'] },
  { key: 'ssh_tunnel', label: 'Túnel SSH', icon: KeyRound, fields: ['ssh_host','ssh_port','ssh_username','db_host','db_port','db_username','db_password'] },
  { key: 'webhook', label: 'Webhook', icon: Cloud, fields: ['endpoint_url','auth_header'] },
]

const METHOD_ICONS: Record<string, React.ComponentType<any>> = {
  direct: Server, odbc: FileCode, api_rest: Globe,
  csv_export: FileSpreadsheet, ssh_tunnel: KeyRound, webhook: Cloud,
}

interface ErpConnection {
  id: string; client_id: string; erp_type: string; connection_method: string;
  host: string; database_name: string; status: 'active' | 'inactive' | 'error';
  last_test: string | null; is_read_only: boolean; created_at: string;
}

export default function ClientERPPanel({ clientId, clientName }: { clientId: string; clientName: string }) {
  const [connections, setConnections] = useState<ErpConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [testingId, setTestingId] = useState<string | null>(null)
  const [formStep, setFormStep] = useState<'erp' | 'method' | 'config'>('erp')
  const [form, setForm] = useState({ erp_type: ERP_SYSTEMS[0], connection_method: 'direct', host: '', port: '', database_name: '', username: '', password: '', is_read_only: true, dsn_name: '', api_base_url: '', api_key: '', upload_path: '', schedule: 'daily', ssh_host: '', ssh_port: '22', ssh_username: '', db_host: '', db_port: '', db_username: '', db_password: '', endpoint_url: '', auth_header: '' })

  useEffect(() => { fetchConns() }, [clientId])

  async function fetchConns() {
    try {
      const all = await api.get<ErpConnection[]>('/api/v1/erp-connections')
      setConnections((all || []).filter(c => c.client_id === clientId))
    } catch { setConnections([]) }
    finally { setLoading(false) }
  }

  function resetForm() { setShowNew(false); setFormStep('erp'); setForm({ erp_type: ERP_SYSTEMS[0], connection_method: 'direct', host: '', port: '', database_name: '', username: '', password: '', is_read_only: true, dsn_name: '', api_base_url: '', api_key: '', upload_path: '', schedule: 'daily', ssh_host: '', ssh_port: '22', ssh_username: '', db_host: '', db_port: '', db_username: '', db_password: '', endpoint_url: '', auth_header: '' }) }

  async function handleCreate() {
    try {
      await api.post('/api/v1/erp-connections', { client_id: clientId, erp_type: form.erp_type, connection_method: form.connection_method, is_read_only: form.is_read_only, connection_config: form })
      await fetchConns(); resetForm()
    } catch (err: any) { alert('Error: ' + (err.message || 'desconocido')) }
  }

  async function handleTest(id: string) {
    setTestingId(id)
    try { await api.post(`/api/v1/erp-connections/${id}/test`, {}); setConnections(p => p.map(c => c.id === id ? { ...c, status: 'active' as const, last_test: new Date().toISOString() } : c)) }
    catch { setConnections(p => p.map(c => c.id === id ? { ...c, status: 'error' as const } : c)) }
    finally { setTestingId(null) }
  }

  async function handleRevoke(id: string) {
    if (!confirm('¿Revocar esta conexión?')) return
    try { await api.delete(`/api/v1/erp-connections/${id}`); setConnections(p => p.filter(c => c.id !== id)) }
    catch (err: any) { alert('Error: ' + err.message) }
  }

  function timeAgo(d: string | null) {
    if (!d) return 'Nunca'; const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
    if (mins < 60) return `hace ${mins}m`; const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `hace ${hrs}h`; return `hace ${Math.floor(hrs / 24)}d`
  }

  const methodFields = useMemo(() => CONNECTION_METHODS.find(m => m.key === form.connection_method)?.fields ?? [], [form.connection_method])

  return (
    <div className="rounded-2xl border border-eva-border bg-white p-5 shadow-eva-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database size={16} className="text-eva-olive" />
          <h3 className="font-brand text-base font-medium text-eva-black">Conexiones ERP</h3>
          {connections.length > 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-eva-beige-2 text-eva-txt-muted">{connections.length}</span>}
        </div>
        <Button size="sm" variant="outline" icon={<Plus size={13} />} onClick={() => setShowNew(true)}>Conectar</Button>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 mb-4">
        <Shield size={12} className="text-amber-600 shrink-0" />
        <p className="text-[10px] text-amber-700">Credenciales cifradas — nunca expuestas en la UI.</p>
      </div>

      {loading && <div className="py-6 flex justify-center"><div className="w-5 h-5 border-2 border-eva-olive border-t-transparent rounded-full animate-spin" /></div>}

      {!loading && connections.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-eva-border rounded-xl">
          <Database size={22} className="mx-auto mb-2 text-eva-txt-faint" />
          <p className="text-xs text-eva-txt-muted">Sin conexiones configuradas</p>
          <button onClick={() => setShowNew(true)} className="mt-3 text-[11px] font-semibold text-eva-olive hover:underline">+ Configurar primera conexión</button>
        </div>
      )}

      {!loading && connections.map(conn => {
        const Icon = METHOD_ICONS[conn.connection_method] || Database
        const label = CONNECTION_METHODS.find(m => m.key === conn.connection_method)?.label || conn.connection_method
        return (
          <div key={conn.id} className="rounded-xl border border-eva-border p-4 bg-eva-beige-light mb-3 last:mb-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-ui text-[13px] font-semibold text-eva-black">{conn.erp_type}</p>
                <span className="text-[10px] text-eva-olive font-medium flex items-center gap-1 mt-0.5"><Icon size={10} /> {label}</span>
              </div>
              <Badge variant={conn.status === 'active' ? 'success' : conn.status === 'error' ? 'danger' : 'neutral'} size="sm">
                {conn.status === 'active' ? 'Activa' : conn.status === 'error' ? 'Error' : 'Inactiva'}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] mb-3">
              <span className="text-eva-txt-muted">Host</span><span className="font-mono text-eva-black truncate">{conn.host || '—'}</span>
              <span className="text-eva-txt-muted">Último test</span><span className="text-eva-black">{timeAgo(conn.last_test)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" isLoading={testingId === conn.id} onClick={() => handleTest(conn.id)}><Zap size={11} className="mr-1" />Test</Button>
              <button onClick={() => handleRevoke(conn.id)} className="p-1.5 rounded-lg text-eva-txt-faint hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={13} /></button>
            </div>
          </div>
        )
      })}

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={resetForm} />
          <div className="relative bg-white rounded-2xl border border-eva-border w-full max-w-lg p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-brand text-lg font-medium text-eva-black">Conexión ERP — {clientName}</h2>
              <button onClick={resetForm} className="text-eva-txt-muted hover:text-eva-black"><X size={18} /></button>
            </div>
            <div className="flex gap-1">
              {(['erp','method','config'] as const).map((s, i) => (
                <span key={s} className={`text-[10px] font-bold px-2 py-1 rounded-full ${s === formStep ? 'bg-eva-olive text-white' : ['erp','method','config'].indexOf(s) < ['erp','method','config'].indexOf(formStep) ? 'bg-green-50 text-green-700' : 'bg-eva-beige-2 text-eva-txt-muted'}`}>
                  {i+1}. {s === 'erp' ? 'ERP' : s === 'method' ? 'Método' : 'Config'}
                </span>
              ))}
            </div>
            {formStep === 'erp' && (
              <div><label className="text-[10px] font-bold uppercase tracking-wider text-eva-txt-muted block mb-1">Sistema ERP</label>
              <select className="w-full px-3 py-2 rounded-lg border border-eva-border bg-eva-beige-light text-sm" value={form.erp_type} onChange={e => setForm(f => ({ ...f, erp_type: e.target.value }))}>{ERP_SYSTEMS.map(s => <option key={s}>{s}</option>)}</select></div>
            )}
            {formStep === 'method' && (
              <div className="space-y-2 max-h-60 overflow-y-auto">{CONNECTION_METHODS.map(m => {
                const Icon = m.icon; const sel = m.key === form.connection_method
                return (<button key={m.key} onClick={() => setForm(f => ({ ...f, connection_method: m.key }))} className={`w-full text-left p-3 rounded-xl border transition-all ${sel ? 'border-eva-olive bg-eva-olive/5' : 'border-eva-border hover:border-eva-olive/30'}`}>
                  <div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-lg flex items-center justify-center ${sel ? 'bg-eva-olive text-white' : 'bg-eva-beige-2 text-eva-txt-muted'}`}><Icon size={14} /></div><p className="text-[13px] font-semibold text-eva-black">{m.label}</p></div></button>)
              })}</div>
            )}
            {formStep === 'config' && (
              <div className="space-y-3 max-h-60 overflow-y-auto">{methodFields.map(fk => (
                <div key={fk}><label className="text-[10px] font-bold uppercase tracking-wider text-eva-txt-muted block mb-1">{fk.replace(/_/g, ' ')}</label>
                <input className="w-full px-3 py-2 rounded-lg border border-eva-border bg-eva-beige-light text-sm placeholder-eva-txt-faint" type={fk.includes('password') || fk.includes('key') || fk.includes('secret') ? 'password' : 'text'} value={(form as any)[fk] ?? ''} onChange={e => setForm(f => ({ ...f, [fk]: e.target.value }))} /></div>
              ))}</div>
            )}
            <div className="flex gap-2 justify-end pt-2 border-t border-eva-border">
              {formStep !== 'erp' ? <Button size="sm" variant="outline" onClick={() => setFormStep(formStep === 'config' ? 'method' : 'erp')}>Atrás</Button> : <Button size="sm" variant="outline" onClick={resetForm}>Cancelar</Button>}
              {formStep !== 'config' ? <Button size="sm" onClick={() => setFormStep(formStep === 'erp' ? 'method' : 'config')}>Siguiente</Button> : <Button size="sm" onClick={handleCreate}>Crear conexión</Button>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
