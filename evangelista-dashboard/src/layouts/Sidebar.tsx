import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Search, Users, Brain, FileText,
  Settings, BookOpen, LogOut, GitBranch, History,
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { motion, AnimatePresence } from 'framer-motion'

const NAV = [
  { to: '/',           label: 'Overview',    icon: LayoutDashboard, end: true },
  { to: '/analyze',    label: 'An\u00e1lisis',     icon: Brain },
  { to: '/history',    label: 'Historial',    icon: History },
  { to: '/clients',    label: 'Clientes',     icon: Users },
  { to: '/agents',     label: 'Agentes',      icon: Search },
  { to: '/proposals',  label: 'Propuestas',   icon: FileText },
  { to: '/graph',      label: 'Arquitectura', icon: GitBranch },
  { to: '/knowledge',  label: 'Vault',        icon: BookOpen },
  { to: '/settings',   label: 'Configuraci\u00f3n', icon: Settings },
]

function NavIcon({ Icon, active }: { Icon: typeof Search; active: boolean }) {
  return <Icon size={18} strokeWidth={active ? 2 : 1.5} />
}

export function Sidebar() {
  const signOut = useAuthStore((s) => s.signOut)

  return (
    <aside className="w-[var(--sidebar-w)] flex flex-col h-full bg-canvas border-r border-white/[0.06] flex-shrink-0">
      {/* Brand */}
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shadow-olive-glow">
            <span className="text-white text-xs font-semibold">E</span>
          </div>
          <p className="text-sm font-semibold text-content-primary leading-tight">
            Evangelista
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 pt-2 pb-1 flex flex-col gap-1 overflow-y-auto scrollbar-hide">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
               transition-colors duration-150 ${
                 isActive
                   ? 'text-primary-600 font-medium bg-primary-500/[0.10]'
                   : 'text-content-tertiary hover:text-content-secondary hover:bg-white/[0.04]'
               }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator with layoutId spring */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-lg bg-primary-500/[0.08]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                </AnimatePresence>

                {/* Active left border */}
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-primary-500" />
                )}

                <NavIcon Icon={item.icon} active={isActive} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2.5 pb-4 border-t border-white/[0.06] mt-auto pt-2">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-content-tertiary hover:text-accent-red hover:bg-white/[0.04] rounded-lg transition-colors duration-150"
        >
          <LogOut size={18} strokeWidth={1.5} />
          Salir
        </button>
      </div>
    </aside>
  )
}
