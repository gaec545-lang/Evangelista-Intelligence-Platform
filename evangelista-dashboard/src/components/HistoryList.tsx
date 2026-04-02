import { motion } from 'framer-motion';
import { ConfidenceBadge } from './ConfidenceBadge';
import Badge from './ui/Badge';
import { History, ChevronRight } from 'lucide-react';
import type { Analysis } from '../lib/types';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'ahora';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export function HistoryList({ analyses, limit }: { analyses: Analysis[]; limit?: number }) {
  const items = limit ? analyses.slice(0, limit) : analyses;

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2">
        <History size={28} className="text-content-tertiary/40" />
        <p className="text-xs text-content-tertiary/60">Sin registros</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/[0.06]">
      {items.map((a, i) => (
        <motion.div
          key={a.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: Math.min(i * 0.04, 0.2) }}
          className="group flex items-center gap-3 px-5 py-3 hover:bg-white/[0.03] transition-all duration-150 cursor-pointer"
        >
          {/* Icon */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <History size={16} className="text-content-tertiary/60 group-hover:text-primary-500 transition-colors" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-content-primary truncate group-hover:text-primary-600 transition-colors">
              {a.task}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] text-content-tertiary/50 tabular-nums">
                {timeAgo(a.created_at)}
              </span>
              <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />
              <span className="text-[9px] text-content-tertiary/50 truncate max-w-[80px]">
                {a.client?.name || 'Consulta Directa'}
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {a.confidence != null && <ConfidenceBadge value={a.confidence} />}
            <Badge
              variant={a.status === 'completed' ? 'success' : a.status === 'failed' ? 'danger' : 'neutral'}
              size="sm"
            >
              {a.status}
            </Badge>
            <ChevronRight
              size={13}
              style={{ color: 'rgba(255,255,255,0.10)' }}
              className="group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
