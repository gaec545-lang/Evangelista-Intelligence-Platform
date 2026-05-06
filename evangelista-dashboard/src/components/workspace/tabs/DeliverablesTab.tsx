import React from 'react';
import { FileText, Download, Package } from 'lucide-react';
import { Project } from '../../../lib/types';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';

export default function DeliverablesTab({ project }: { project: Project }) {
  // TODO: Fetch real deliverables from deliverables table in Spec 07/08
  const deliverables: any[] = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif text-eva-black">Entregables</h2>
      </div>

      <div className="bg-white border border-eva-border rounded-2xl overflow-hidden shadow-sm">
        {deliverables.length === 0 ? (
          <div className="p-20 text-center">
            <Package className="w-12 h-12 text-eva-txt-faint mx-auto mb-4" />
            <h4 className="text-lg font-serif text-eva-txt-muted mb-2 font-bold">Sin entregables generados</h4>
            <p className="text-xs text-eva-txt-faint max-w-xs mx-auto font-medium">
              Los entregables se generan automáticamente desde los módulos de 
              <span className="text-eva-olive mx-1 font-bold">Propuesta</span> y 
              <span className="text-eva-gold mx-1 font-bold">Análisis</span>.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-eva-border">
            {deliverables.map((d) => (
              <div key={d.id} className="p-6 flex items-center justify-between group hover:bg-eva-beige-2/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-eva-beige-2 flex items-center justify-center text-eva-txt-muted shadow-sm">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-eva-black font-serif font-bold">{d.name}</h4>
                    <p className="text-xs text-eva-txt-faint font-medium">Generado el {new Date(d.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-widest bg-service-sentinel/10 text-service-sentinel shadow-sm">
                    {d.status}
                  </div>
                  <Button variant="ghost" size="sm" className="text-eva-txt-mid hover:text-eva-olive font-bold">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
