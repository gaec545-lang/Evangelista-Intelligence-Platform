import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Search, Users, Brain, FileText,
  Settings, BookOpen, LogOut, GitBranch, History,
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { motion } from 'framer-motion'

const NAV = [
  { to: '/',           label: 'Overview',   icon: LayoutDashboard, end: true },
  { to: '/analyze',    label: 'Análisis',    icon: Brain },
  { to: '/history',    label: 'Historial',   icon: History },
  { to: '/clients',    label: 'Clientes',    icon: Users },
  { to: '/agents',     label: 'Agentes',     icon: Search },
  { to: '/proposals',  label: 'Propuestas',  icon: FileText },
  { to: '/graph',      label: 'Arquitectura',icon: GitBranch },
  { to: '/knowledge',  label: 'Vault',       icon: BookOpen },
  { to: '/settings',   label: 'Configuración',icon: Settings },
]

function NavIcon({ Icon, active }: { Icon: typeof Search, active: boolean }) {
  return <Icon size={18} strokeWidth={active ? 2 : 1.5} />
}

export function Sidebar() {
  const signOut = useAuthStore(s => s.signOut)

  return (
    <aside className="w-56 flex flex-col h-full bg-surface-card border-r border-surface-border flex-shrink-0">
      {/* Brand */}
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">E</span>
          </div>
          <p className="text-sm font-semibold text-content-primary leading-tight">
            Evangelista
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 pt-2 space-y-0.5 overflow-y-auto scrollbar-hide">
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm
               transition-all duration-150 ${
                 isActive
                   ? 'text-primary-700 font-medium'
                   : 'text-content-tertiary hover:text-content-primary hover:bg-surface-hover'
               }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-primary-50 rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                    style={{ zIndex: -1 }}
                  />
                )}
                <NavIcon Icon={item.icon} active={isActive} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 pb-4 border-t border-surface-border mt-auto">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-content-tertiary hover:text-accent-red rounded-lg transition-colors"
        >
          <LogOut size={18} strokeWidth={1.5} />
          Salir
        </button>
      </div>
    </aside>
  )
}
