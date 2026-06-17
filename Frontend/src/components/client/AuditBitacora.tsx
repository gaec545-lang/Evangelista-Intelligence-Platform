import React, { useEffect, useState } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Shield, Clock, Hash } from 'lucide-react';
import type { AuditLog } from '../../lib/types';

export const AuditBitacora: React.FC<{ clientId: string }> = ({ clientId }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getBitacora(clientId)
      .then(data => setLogs(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [clientId]);

  if (loading) return <div className="p-4 text-[var(--eva-txt-muted)] text-sm">Cargando bitácora inmutable...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield size={18} className="text-[var(--eva-olive)]" />
        <h3 className="text-sm font-semibold text-[var(--eva-txt-primary)]">Log Inmutable (Append-Only)</h3>
      </div>
      
      {logs.length === 0 ? (
        <p className="text-xs text-[var(--eva-txt-muted)]">No hay registros de auditoría aún.</p>
      ) : (
        <div className="border border-[var(--eva-border)] rounded-xl overflow-hidden divide-y divide-[var(--eva-border)]">
          {logs.map(log => (
            <div key={log.id} className="p-4 hover:bg-[var(--eva-surface-2)] transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[var(--eva-olive)]/10 text-[var(--eva-olive)] px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {log.action}
                  </span>
                  <span className="text-xs text-[var(--eva-txt-secondary)]">{log.entity} ({log.entity_id.slice(0,8)})</span>
                </div>
                <div className="flex items-center gap-1 text-[var(--eva-txt-muted)] text-[10px]">
                  <Clock size={10} />
                  <span>{new Date(log.created_at).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 p-2 bg-[var(--eva-black)]/50 rounded-lg font-mono text-[9px] text-[var(--eva-txt-faint)] overflow-x-auto">
                <Hash size={10} className="text-[var(--eva-olive)] shrink-0" />
                <span className="truncate">{log.hash}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
