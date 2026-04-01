import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Search, Users, Brain, FileText, Settings, BookOpen, LogOut, GitBranch } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/analyze', label: 'Análisis', icon: Brain },
  { to: '/graph', label: 'Arquitectura RAG', icon: GitBranch },
  { to: '/clients', label: 'Clientes', icon: Users },
  { to: '/agents', label: 'Agentes', icon: Search },
  { to: '/proposals', label: 'Propuestas', icon: FileText },
  { to: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
  { to: '/settings', label: 'Configuración', icon: Settings },
]

export function Sidebar() {
  const signOut = useAuthStore(s => s.signOut)
  return (
    <aside className="w-56 bg-eva-charcoal flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <img src="/logo-evangelista.svg" alt="EIP" className="w-8 h-8 rounded" />
          <div>
            <p className="text-sm font-serif font-bold text-eva-cream">Evangelista</p>
            <p className="text-xs text-white/40">Intelligence Platform</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-eva-olive text-eva-cream' : 'text-white/60 hover:text-white hover:bg-white/5'}`
            }>
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button onClick={() => signOut()}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
