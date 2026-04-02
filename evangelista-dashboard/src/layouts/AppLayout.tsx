import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-[1200px] mx-auto px-8 py-10 lg:py-12">
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

  const pageName = location.pathname === '/'
    ? 'Overview'
    : location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2)

  return (
    <header className="h-14 flex items-center justify-between px-8 bg-white/70 backdrop-blur-xl border-b border-surface-border z-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-content-tertiary">
        <span className="font-medium">EIP</span>
        <span className="text-surface-border">/</span>
        <span className="text-content-primary font-medium">{pageName}</span>
      </div>

      {/* User */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-[10px] font-semibold">
          AD
        </div>
      </div>
    </header>
  )
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={window.location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
