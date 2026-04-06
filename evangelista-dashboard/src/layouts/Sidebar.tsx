import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useState } from 'react';
import {
  LayoutDashboard, Users, Search, History, FileText,
  Shield, Building2, Activity, 
  Network, Bot, BookOpen, Cpu, Settings, UserCog, Database,
  ChevronDown, LogOut, BarChart3
} from 'lucide-react';

interface NavSection {
  id: string;
  label: string;
  icon?: React.ComponentType<any>;
  permission?: string;
  items: { path: string; label: string; icon: React.ComponentType<any>; accent?: string }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'war-room',
    label: 'War Room',
    items: [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/clients', label: 'Clientes', icon: Users },
      { path: '/analyze', label: 'Análisis RAG', icon: Search },
      { path: '/history', label: 'Historial', icon: History },
    ]
  },
  {
    id: 'foundation',
    label: 'Foundation',
    icon: Shield,
    permission: 'operations',
    items: [
      { path: '/foundation', label: 'Pipeline', icon: Shield, accent: 'foundation' },
      { path: '/proposals', label: 'Propuestas', icon: FileText, accent: 'foundation' },
    ]
  },
  {
    id: 'architecture',
    label: 'Architecture',
    icon: Building2,
    permission: 'operations',
    items: [
      { path: '/architecture', label: 'Proyectos', icon: Building2, accent: 'architecture' },
      { path: '/erp-connections', label: 'Conexiones ERP', icon: Database, accent: 'architecture' },
    ]
  },
  {
    id: 'sentinel',
    label: 'Sentinel',
    icon: Activity,
    permission: 'operations',
    items: [
      { path: '/sentinel', label: 'Monitor', icon: Activity, accent: 'sentinel' },
      { path: '/sentinel/simulations', label: 'Monte Carlo', icon: BarChart3, accent: 'sentinel' },
    ]
  },
  {
    id: 'admin',
    label: 'Administración',
    items: [
      { path: '/team', label: 'Equipo', icon: UserCog },
      { path: '/settings', label: 'Configuración', icon: Settings },
    ]
  },
  {
    id: 'rag-arch',
    label: 'Arquitectura RAG',
    permission: 'architecture_rag',
    items: [
      { path: '/graph', label: 'Grafo cíclico', icon: Network },
      { path: '/agents', label: 'Agentes', icon: Bot },
      { path: '/knowledge', label: 'Knowledge base', icon: BookOpen },
      { path: '/models', label: 'Modelos LLM', icon: Cpu },
    ]
  },
];

export default function Sidebar() {
  const { teamMember, hasPermission, signOut } = useAuthStore();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setCollapsed(p => ({ ...p, [id]: !p[id] }));

  const visible = NAV_SECTIONS.filter(s => !s.permission || hasPermission(s.permission as any));

  const accentClass = (accent?: string) => {
    if (!accent) return '';
    return {
      foundation: 'hover:text-eva-foundation',
      architecture: 'hover:text-eva-architecture',
      sentinel: 'hover:text-eva-sentinel',
    }[accent] || '';
  };

  return (
    <aside className="w-60 h-screen bg-[#0D0D0F] border-r border-[#1C1C1E] flex flex-col fixed left-0 top-0 z-[var(--z-sidebar)]">
      {/* Brand */}
      <div className="px-5 py-4 border-b border-[#1C1C1E]">
        <div className="flex items-center gap-3">
          <img src="/logoEvangelistaCo.png" alt="Evangelista & Co." className="w-8 h-8 object-contain invert brightness-0 dark:brightness-200" />
          <div>
            <p className="text-sm font-medium text-[#F5F5F7] tracking-tight">Evangelista & Co.</p>
            <p className="text-[11px] text-[#A1A1A6]">War Room</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {visible.map(section => (
          <div key={section.id}>
            <button
              onClick={() => toggle(section.id)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-medium text-[#A1A1A6] uppercase tracking-widest hover:text-[#F5F5F7] transition-colors"
            >
              <span>{section.label}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${collapsed[section.id] ? '-rotate-90' : ''}`} />
            </button>
            {!collapsed[section.id] && (
              <div className="mt-0.5 space-y-px">
                {section.items.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `group flex items-center gap-2.5 px-3 py-[7px] rounded-button text-[13px] transition-all duration-150 ${
                        isActive
                          ? 'bg-[#95B877]/15 text-[#95B877] font-medium'
                          : `text-[#A1A1A6] hover:bg-white/[0.05] hover:text-[#F5F5F7] ${accentClass(item.accent)}`
                      }`
                    }
                  >
                    <item.icon className="w-[15px] h-[15px] flex-shrink-0 opacity-70 group-hover:opacity-100" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-3 border-t border-[#1C1C1E]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#95B877]/15 flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-medium text-[#95B877]">
              {teamMember?.full_name?.charAt(0) || '?'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[#F5F5F7] truncate">{teamMember?.full_name || 'Sin perfil'}</p>
            <p className="text-[11px] text-[#A1A1A6]">{teamMember?.role?.toUpperCase()}</p>
          </div>
          <button onClick={signOut} className="p-1 text-[#A1A1A6] hover:text-[#FF453A] transition-colors" title="Salir">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
