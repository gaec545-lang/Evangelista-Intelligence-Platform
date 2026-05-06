import React, { useState, useEffect } from 'react';
import { Shield, Database, Globe, Table, FileText, Zap, HardDrive, Package, HelpCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import Button from '../ui/Button';
import { DataSource, DataSourceType } from '../../lib/types';

interface AddDataSourceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: DataSource | null;
}

const SOURCE_TYPES = [
  { id: 'sql_server', label: 'SQL Server', icon: Database },
  { id: 'mysql', label: 'MySQL', icon: Database },
  { id: 'postgresql', label: 'PostgreSQL', icon: Database },
  { id: 'oracle', label: 'Oracle', icon: Database },
  { id: 'sap_b1', label: 'SAP Business One', icon: Globe },
  { id: 'contpaqi', label: 'CONTPAQi', icon: Package },
  { id: 'aspel', label: 'Aspel', icon: Package },
  { id: 'excel', label: 'Excel / CSV', icon: Table },
  { id: 'api_rest', label: 'API REST', icon: Zap },
  { id: 'otro', label: 'Otro', icon: HardDrive },
];

export function AddDataSourceModal({ open, onClose, onSave, initialData }: AddDataSourceModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    source_type: 'sql_server' as DataSourceType,
    authorized_tables: '',
    notes: '',
    config: {
      host: '',
      port: '',
      database: '',
      username: '',
      password: '',
      schema: 'dbo',
      path: '',
      file_name: '',
      base_url: '',
    }
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        source_type: initialData.source_type,
        authorized_tables: initialData.authorized_tables?.join(', ') || '',
        notes: initialData.notes || '',
        config: { ...form.config, ...(initialData.connection_config as any) }
      });
    } else {
      setForm({
        name: '',
        source_type: 'sql_server',
        authorized_tables: '',
        notes: '',
        config: {
          host: '',
          port: '1433',
          database: '',
          username: '',
          password: '',
          schema: 'dbo',
          path: '',
          file_name: '',
          base_url: '',
        }
      });
    }
  }, [initialData, open]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave({
        ...form,
        authorized_tables: form.authorized_tables.split(',').map(t => t.trim()).filter(t => t)
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderConfigFields = () => {
    const { source_type, config } = form;

    if (['sql_server', 'mysql', 'postgresql', 'oracle', 'sap_b1', 'contpaqi', 'aspel'].includes(source_type)) {
      return (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Host / IP *</label>
            <input 
              type="text" 
              value={config.host}
              onChange={e => setForm({...form, config: {...config, host: e.target.value}})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-architecture/50 focus:ring-1 focus:ring-architecture/20 transition-all outline-none"
              placeholder="192.168.1.100"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Puerto *</label>
            <input 
              type="text" 
              value={config.port}
              onChange={e => setForm({...form, config: {...config, port: e.target.value}})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-architecture/50 outline-none"
              placeholder="1433"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Base de Datos *</label>
            <input 
              type="text" 
              value={config.database}
              onChange={e => setForm({...form, config: {...config, database: e.target.value}})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-architecture/50 outline-none"
              placeholder="ERP_PROD"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Schema</label>
            <input 
              type="text" 
              value={config.schema}
              onChange={e => setForm({...form, config: {...config, schema: e.target.value}})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-architecture/50 outline-none"
              placeholder="dbo"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Usuario *</label>
            <input 
              type="text" 
              value={config.username}
              onChange={e => setForm({...form, config: {...config, username: e.target.value}})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-architecture/50 outline-none"
              placeholder="evangelista_svc"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Contraseña *</label>
            <input 
              type="password" 
              value={config.password}
              onChange={e => setForm({...form, config: {...config, password: e.target.value}})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-architecture/50 outline-none"
              placeholder="••••••••••••"
            />
          </div>
        </div>
      );
    }

    if (source_type === 'excel' || source_type === 'csv') {
      return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Ruta del Archivo / Carpeta *</label>
            <input 
              type="text" 
              value={config.path}
              onChange={e => setForm({...form, config: {...config, path: e.target.value}})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-architecture/50 outline-none"
              placeholder="\\SERVIDOR\Share\Inventarios\"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Nombre del Archivo (o patrón)</label>
            <input 
              type="text" 
              value={config.file_name}
              onChange={e => setForm({...form, config: {...config, file_name: e.target.value}})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-architecture/50 outline-none"
              placeholder="ventas_*.xlsx"
            />
          </div>
        </div>
      );
    }

    if (source_type === 'api_rest') {
      return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Base URL *</label>
            <input 
              type="text" 
              value={config.base_url}
              onChange={e => setForm({...form, config: {...config, base_url: e.target.value}})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-architecture/50 outline-none"
              placeholder="https://api.empresa.com/v1"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Token / API Key</label>
            <input 
              type="password" 
              value={config.password}
              onChange={e => setForm({...form, config: {...config, password: e.target.value}})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-architecture/50 outline-none"
              placeholder="Bearer ••••••••••••"
            />
          </div>
        </div>
      );
    }

    return (
        <div className="p-8 text-center bg-white/5 rounded-xl border border-dashed border-white/10">
            <HelpCircle className="w-8 h-8 text-white/10 mx-auto mb-2" />
            <p className="text-xs text-white/40 italic">Configuración simplificada para este tipo de fuente.</p>
        </div>
    );
  };

  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      title={initialData ? "Editar Fuente de Datos" : "Agregar Fuente de Datos"}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-8 py-2">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] uppercase tracking-[0.15em] font-bold text-white/40 mb-2 ml-1">Nombre descriptivo *</label>
            <input 
              type="text" 
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-cream focus:border-architecture/50 outline-none transition-all shadow-inner"
              placeholder="Ej: SAP B1 — Planta Norte"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] uppercase tracking-[0.15em] font-bold text-white/40 mb-2 ml-1">Tipo de fuente *</label>
            <select 
              value={form.source_type}
              onChange={e => setForm({...form, source_type: e.target.value as DataSourceType})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-cream focus:border-architecture/50 outline-none cursor-pointer appearance-none shadow-inner"
            >
              {SOURCE_TYPES.map(t => (
                <option key={t.id} value={t.id} className="bg-[#1a1a1a]">{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
             <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
             <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-white/20 whitespace-nowrap">Configuración de Conexión</span>
             <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>
          {renderConfigFields()}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] font-bold text-white/40 mb-2 ml-1">Tablas Autorizadas</label>
            <input 
              type="text" 
              value={form.authorized_tables}
              onChange={e => setForm({...form, authorized_tables: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-cream focus:border-architecture/50 outline-none"
              placeholder="OITM, OITW, IGE1, IGN1..."
            />
            <p className="text-[10px] text-white/20 mt-2 italic ml-1">Especifica las tablas con acceso explícito (separadas por coma).</p>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.15em] font-bold text-white/40 mb-2 ml-1">Notas Internas</label>
            <textarea 
              value={form.notes}
              onChange={e => setForm({...form, notes: e.target.value})}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-cream focus:border-architecture/50 outline-none resize-none shadow-inner"
              placeholder="Detalles sobre el usuario, acceso o periodicidad..."
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-architecture/5 border border-architecture/10 flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-architecture/10 flex items-center justify-center shrink-0">
             <Shield className="w-4 h-4 text-architecture" />
          </div>
          <div className="space-y-1">
             <p className="text-[11px] font-bold text-architecture uppercase tracking-widest">Protocolo ALCOA+ Read-Only</p>
             <p className="text-[10px] text-white/40 leading-relaxed">
               Las credenciales se almacenan cifradas. Toda conexión se establece en modo **Solo Lectura**. 
               No se ejecutan operaciones de escritura bajo ninguna circunstancia.
             </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/5">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button 
            variant="primary" 
            onClick={handleSave} 
            isLoading={loading}
            className="flex-1 bg-architecture/20 hover:bg-architecture/30 border-architecture/50 text-cream"
          >
            {initialData ? 'Guardar Cambios' : 'Registrar Fuente →'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
