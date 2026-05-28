import { motion } from 'framer-motion';
import React from 'react';
import { 
  Database, 
  Globe, 
  Table, 
  FileText, 
  Zap, 
  HardDrive, 
  Package, 
  TestTube, 
  Edit2, 
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { DataSource, DataSourceType } from '../../lib/types';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface DataSourceCardProps {
  source: DataSource;
  onTest: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isTesting: boolean;
}

const sourceTypeConfig: Record<DataSourceType, { icon: any; label: string; color: string }> = {
  sql_server:   { icon: Database,   label: 'SQL Server',   color: '#c05538' },
  mysql:        { icon: Database,   label: 'MySQL',        color: '#f5a623' },
  postgresql:   { icon: Database,   label: 'PostgreSQL',   color: '#336791' },
  oracle:       { icon: Database,   label: 'Oracle',       color: '#f80000' },
  contpaqi:     { icon: Package,    label: 'CONTPAQi',     color: '#0066cc' },
  aspel:        { icon: Package,    label: 'Aspel',        color: '#00a651' },
  sap_b1:       { icon: Globe,      label: 'SAP B1',       color: '#0070f3' },
  excel:        { icon: Table,      label: 'Excel',        color: '#217346' },
  csv:          { icon: FileText,   label: 'CSV',          color: '#4a5c3a' },
  api_rest:     { icon: Zap,        label: 'API REST',     color: '#534ab7' },
  otro:         { icon: HardDrive,  label: 'Otro',         color: '#666' },
};

const statusConfig: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
  conectado:   { label: 'Conectado',   icon: CheckCircle2, color: 'text-[var(--eva-success)]', bgColor: 'bg-[var(--eva-success)]/10 border border-[var(--eva-success)]/20' },
  error:       { label: 'Error',       icon: AlertCircle,  color: 'text-red-400',         bgColor: 'bg-red-500/10 border border-red-500/20' },
  pendiente:   { label: 'Pendiente',   icon: Clock,        color: 'text-[var(--eva-gold)]',        bgColor: 'bg-[var(--eva-gold)]/10 border border-[var(--eva-gold)]/20' },
  sin_probar:  { label: 'Sin probar',  icon: Clock,        color: 'text-eva-txt-faint',   bgColor: 'bg-[var(--eva-surface-2)] border border-[var(--eva-border)]' },
};

export default function DataSourceCard({ source, onTest, onEdit, onDelete, isTesting }: DataSourceCardProps) {
  const config = sourceTypeConfig[source.source_type] || sourceTypeConfig.otro;
  const status = statusConfig[source.status] || statusConfig.sin_probar;
  
  const getDisplayPath = () => {
    const cfg = source.connection_config as any;
    if (!cfg) return '—';
    
    switch (source.source_type) {
      case 'sql_server':
      case 'mysql':
      case 'postgresql':
      case 'oracle':
        return `${cfg.host}:${cfg.port} / ${cfg.database || cfg.service_name || '—'}`;
      case 'api_rest':
        return cfg.base_url || '—';
      case 'excel':
      case 'csv':
        return `${cfg.path || ''}${cfg.file_name || ''}`;
      case 'sap_b1':
      case 'contpaqi':
      case 'aspel':
        return `${cfg.host}:${cfg.port} / ${cfg.database || '—'}`;
      default:
        return '—';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group"
    >
      <Card className="p-6 bg-[var(--eva-surface)] border-[var(--eva-border)] hover:border-[var(--eva-olive)] hover:shadow-md transition-all flex flex-col h-full shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: `${config.color}15`, border: `1px solid ${config.color}30` }}
            >
              <config.icon className="w-6 h-6 shadow-sm" style={{ color: config.color }} />
            </div>
            <div>
              <h4 className="text-lg font-serif text-[var(--eva-txt-primary)] leading-tight font-bold">{source.name}</h4>
              <p className="text-[10px] text-[var(--eva-txt-muted)] uppercase tracking-widest font-bold mt-1.5 font-mono">
                {config.label}
              </p>
            </div>
          </div>
          
          <div className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest shadow-sm ${status.bgColor} ${status.color}`}>
            <status.icon className="w-3 h-3" />
            {status.label}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <p className="text-[9px] text-eva-txt-faint uppercase tracking-widest font-bold">Endpoint / Ruta</p>
            <p className="text-sm text-[var(--eva-txt-secondary)] font-mono truncate font-bold bg-[var(--eva-surface-2)] p-2 rounded border border-[var(--eva-border)]">{getDisplayPath()}</p>
          </div>
          
          {source.authorized_tables && source.authorized_tables.length > 0 && (
            <div className="space-y-2">
              <p className="text-[9px] text-eva-txt-faint uppercase tracking-widest font-bold">Tablas Autorizadas</p>
              <div className="flex flex-wrap gap-1.5">
                {source.authorized_tables.map(table => (
                  <span key={table} className="px-2 py-0.5 rounded bg-[var(--eva-surface-2)] text-[10px] text-[var(--eva-txt-muted)] font-mono font-bold border border-[var(--eva-border)] shadow-sm">
                    {table}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {source.last_test_result && source.status === 'error' && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 shadow-sm">
              <p className="text-[9px] text-red-400/60 uppercase font-bold mb-1">Último Error</p>
              <p className="text-xs text-red-400 line-clamp-2 italic font-medium leading-tight">{source.last_test_result}</p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-eva-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onTest}
              isLoading={isTesting}
              className="h-8 border-[var(--eva-border)] hover:border-[var(--eva-olive)] bg-[var(--eva-surface-2)] text-[var(--eva-txt-secondary)] font-bold shadow-sm"
            >
              <TestTube className="w-3.5 h-3.5 mr-2" />
              Probar
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onEdit}
              className="h-8 text-eva-txt-faint hover:text-eva-olive transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDelete}
            className="h-8 text-eva-txt-faint hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
