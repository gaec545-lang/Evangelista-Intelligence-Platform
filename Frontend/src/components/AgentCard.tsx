import { useNavigate } from 'react-router-dom';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { Terminal, ChevronRight } from 'lucide-react';
import type { AgentInfo } from '../lib/types';

export function AgentCard({ agent, index = 0 }: { agent: AgentInfo, index?: number }) {
  const navigate = useNavigate();

  return (
    <Card
      index={index}
      className="group flex flex-col h-full cursor-pointer transition-transform duration-200"
      hover
      onClick={() => navigate(`/agents/${agent.name}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
            style={{ background: 'rgba(149,184,119,0.10)' }}
          >
            <Terminal size={18} className="text-primary-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-content-primary capitalize tracking-tight">
              {agent.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success/80 animate-pulse-soft" />
              <span className="text-[9px] font-semibold text-content-secondary/60 uppercase tracking-widest">
                Activo
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="neutral" size="sm">v1.2</Badge>
          <ChevronRight size={14} className="text-content-secondary/40 group-hover:text-primary-500 transition-colors" />
        </div>
      </div>

      {/* Domain tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {agent.domains.map(d => (
          <span
            key={d}
            className="px-2 py-0.5 rounded-badge text-[10px] font-medium"
            style={{
              background: 'rgba(100,210,255,0.08)',
              color: '#64D2FF',
              border: '1px solid rgba(100,210,255,0.15)',
            }}
          >
            {d}
          </span>
        ))}
      </div>

      {/* Footer hint */}
      <div
        className="mt-auto pt-4 text-xs text-content-secondary flex items-center gap-1"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <span className="w-1 h-1 rounded-full bg-primary-500/50" />
        Click para configurar y ejecutar
      </div>
    </Card>
  );
}
