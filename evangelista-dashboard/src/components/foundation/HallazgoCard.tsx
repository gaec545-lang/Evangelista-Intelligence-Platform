import { useState } from 'react';
import { Trash2, Edit3 } from 'lucide-react';
import type { Hallazgo } from '../../lib/types';
import { FactorCard } from './FactorCard';

const CRITICIDAD_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  critico: { color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20' },
  alto: { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
  medio: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  bajo: { color: 'text-content-secondary', bg: 'bg-white/[0.02]', border: 'border-white/[0.06]' },
};

interface HallazgoCardProps {
  hallazgo: Hallazgo;
  onEdit?: (h: Hallazgo) => void;
  onDelete?: (id: string) => void;
}

export function HallazgoCard({ hallazgo, onEdit, onDelete }: HallazgoCardProps) {
  const crit = CRITICIDAD_CONFIG[hallazgo.criticidad] || CRITICIDAD_CONFIG.bajo;

  return (
    <div className={`p-4 rounded-lg border ${crit.border} ${crit.bg}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-content-secondary">
              {hallazgo.id}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${crit.color} ${crit.bg} border ${crit.border}`}>
              {hallazgo.criticidad}
            </span>
          </div>
          <p className="text-sm font-semibold text-content-primary mt-1">{hallazgo.nombre}</p>
          <p className="text-xs text-content-secondary mt-1 line-clamp-2">{hallazgo.descripcion}</p>

          <div className="flex items-center gap-4 mt-3">
            <span className="text-sm font-bold text-primary-500">
              ${hallazgo.costo_anual.toLocaleString('es-MX')} MXN
            </span>
            <span className="text-xs text-content-secondary">
              Método: {hallazgo.metodo_deteccion}
            </span>
            {hallazgo.atendible_architecture && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-primary-500/10 text-primary-500 font-medium">
                Architecture
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(hallazgo)}
              className="p-1.5 rounded hover:bg-white/[0.05] transition-colors text-content-secondary"
            >
              <Edit3 size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(hallazgo.id)}
              className="p-1.5 rounded hover:bg-danger/10 transition-colors text-content-secondary hover:text-danger"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
