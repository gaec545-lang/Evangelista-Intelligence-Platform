import React, { useEffect, useState } from 'react';
import { apiClient } from '../../lib/apiClient';
import { Key, FileText, Download } from 'lucide-react';
import type { Documento, Credencial } from '../../lib/types';

export const Boveda: React.FC<{ clientId: string }> = ({ clientId }) => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [credenciales, setCredenciales] = useState<Credencial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.getDocumentos(clientId).catch(() => []),
      apiClient.getCredenciales(clientId).catch(() => [])
    ]).then(([docs, creds]) => {
      setDocumentos(docs);
      setCredenciales(creds);
    }).finally(() => setLoading(false));
  }, [clientId]);

  if (loading) return <div className="p-4 text-[var(--eva-txt-muted)] text-sm">Cargando bóveda...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--eva-border)]">
          <FileText size={18} className="text-[var(--eva-olive)]" />
          <h3 className="text-sm font-semibold text-[var(--eva-txt-primary)]">Documentos y Expedientes</h3>
        </div>
        {documentos.length === 0 ? (
          <p className="text-xs text-[var(--eva-txt-muted)]">No hay documentos registrados.</p>
        ) : (
          <div className="space-y-3">
            {documentos.map(doc => (
              <div key={doc.id} className="flex justify-between items-center p-3 rounded-lg border border-[var(--eva-border)] hover:border-[var(--eva-olive)]">
                <div>
                  <p className="text-sm font-medium text-[var(--eva-txt-primary)]">{doc.name}</p>
                  <p className="text-[10px] text-[var(--eva-txt-muted)]">{new Date(doc.created_at).toLocaleDateString()}</p>
                </div>
                <button className="p-2 text-[var(--eva-txt-muted)] hover:text-[var(--eva-gold)] transition-colors">
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[var(--eva-surface)] border border-[var(--eva-border)] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--eva-border)]">
          <Key size={18} className="text-[var(--eva-gold)]" />
          <h3 className="text-sm font-semibold text-[var(--eva-txt-primary)]">Credenciales y Conexiones</h3>
        </div>
        {credenciales.length === 0 ? (
          <p className="text-xs text-[var(--eva-txt-muted)]">No hay credenciales registradas.</p>
        ) : (
          <div className="space-y-3">
            {credenciales.map(cred => (
              <div key={cred.id} className="flex justify-between items-center p-3 rounded-lg border border-[var(--eva-border)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--eva-surface-2)] flex items-center justify-center">
                    <Key size={12} className="text-[var(--eva-txt-muted)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--eva-txt-primary)]">{cred.service_name}</p>
                    <p className="text-[10px] text-green-500/80">Activo y Encriptado</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
