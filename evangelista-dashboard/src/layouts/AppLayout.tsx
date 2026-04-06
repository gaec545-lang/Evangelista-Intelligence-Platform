import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Outlet, useLocation } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="h-screen bg-canvas overflow-hidden">
      <Sidebar />
      <div className="ml-64 flex flex-col h-full min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-[var(--max-content)] mx-auto px-8 py-10 lg:py-12">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  )
}

function Header() {
  const location = useLocation()

  const pageName =
    location.pathname === '/'
      ? 'Overview'
      : location.pathname
          .slice(1)
          .split('/')
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' / ')

  return (
    <header className="h-14 flex items-center justify-between px-8 bg-canvas/80 backdrop-blur-xl border-b border-white/[0.06] z-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-content-tertiary">
        <span className="font-medium">EIP</span>
        <span>/</span>
        <span className="text-content-primary font-medium">{pageName}</span>
      </div>

      {/* User */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-600 text-[10px] font-semibold">
          AD
        </div>
      </div>
    </header>
  )
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
