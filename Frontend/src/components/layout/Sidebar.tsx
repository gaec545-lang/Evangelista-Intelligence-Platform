import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users,
  Settings,
  MoreVertical,
  LogOut,
  FileText,
  Briefcase,
  BrainCircuit,
  Database,
  Bot
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import logoFull from '../../assets/logoEvangelistaCo.png';


const NavItem = ({ to, icon: Icon, label, badge }: { to: string; icon: any; label: string; badge?: string }) => {
  const baseStyle = "flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-transparent transition-all duration-200 group mb-0.5";
  
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => {
        if (!isActive) return `${baseStyle} text-[#6a6a58] hover:bg-[#1e1e1a]`;
        
        // Custom active styles based on route
        if (to === '/dashboard') return `${baseStyle} bg-eva-olive/20 border-eva-olive/30 text-[#d8d4c8]`;
        if (to.includes('clients')) return `${baseStyle} bg-eva-olive/20 border-eva-olive/30 text-[#d8d4c8]`;
        
        return `${baseStyle} bg-eva-black-2 border-eva-black-3 text-white`;
      }}
    >
      <div className="flex items-center justify-center w-5 h-5 transition-transform duration-200 group-hover:scale-110">
        <Icon size={18} />
      </div>
      <span className="font-ui text-[13px] font-medium flex-1">{label}</span>
      {badge && (
        <span className="font-ui text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-eva-black-3 text-eva-txt-muted">
          {badge}
        </span>
      )}
    </NavLink>
  );
};

const Sidebar = () => {
  const { user, signOut } = useAuthStore();
  const userInitials = user?.email?.substring(0, 2).toUpperCase() || 'E&';

  return (
    <aside className="w-[240px] h-full bg-eva-black flex flex-col border-r border-eva-black-3 select-none">
      {/* Logo Section */}
      <div className="py-5 px-[18px] border-b border-eva-black-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            <img src="/platform/logo-white.png" alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="font-brand text-[15px] font-medium text-[#f0ece2] leading-none mb-1">
              Evangelista & Co.
            </h1>
            <p className="font-mono text-[8.5px] uppercase tracking-[0.10em] text-eva-gold/40">
              Intelligence Firm
            </p>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto pt-[14px] px-2.5">
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Command Center" />
        
        <div className="h-[1px] bg-eva-black-3 my-3 mx-2.5" />
        
        <div className="px-5 mb-3 mt-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-eva-txt-faint opacity-60 font-black">
            Orquestación Operativa
          </span>
        </div>
        
        <NavItem to="/dashboard/clients" icon={Users} label="Cartera Fiducia" />
        <NavItem to="/dashboard/projects" icon={Briefcase} label="Engagements Activos" />
        
        <div className="h-[1px] bg-eva-black-3 my-3 mx-2.5" />

        <div className="px-5 mb-3 mt-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-eva-txt-faint opacity-60 font-black">
            Vault de Inteligencia
          </span>
        </div>
        
        <NavItem to="/dashboard/knowledge" icon={Database} label="Knowledge RAG" />
        <NavItem to="/dashboard/analyze" icon={BrainCircuit} label="Inteligencia Estratégica" />
        <NavItem to="/dashboard/agents" icon={Bot} label="Agentes Especialistas" />
        <NavItem to="/dashboard/templates" icon={FileText} label="Vault de Estructuras" />
      </nav>


      {/* Bottom Section */}
      <div className="mt-auto border-t border-eva-black-3 p-2.5 space-y-1">
        <NavItem to="/dashboard/settings" icon={Settings} label="Configuración" />
        
        <div className="bg-[#1a1a16] border border-[#2a2a24] rounded-lg p-2.5 mt-1">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-eva-olive to-eva-olive-2 border-2 border-eva-gold/30 flex items-center justify-center text-eva-gold font-ui text-[11px] font-bold">
                {userInitials}
              </div>
              <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#0f6e56] border-[1.5px] border-[#1a1a16]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-ui text-[12px] font-medium text-[#c8c4b8] truncate">
                {user?.email?.split('@')[0] || 'Consultor'}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-[#4a4a38]">Firm Agent</p>
            </div>
            <button 
              onClick={() => signOut()}
              className="text-[#3a3a30] hover:text-service-foundation transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
