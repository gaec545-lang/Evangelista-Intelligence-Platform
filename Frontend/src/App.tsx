import { useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import AppLayout from './components/layout/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { ClientLoginPage } from './pages/ClientLoginPage'
import { EntryPage } from './pages/EntryPage'
import { Spinner } from './components/ui/Spinner'

import CommandCenterPage from './pages/CommandCenterPage'
import { ClientsPage } from './pages/ClientsPage'
import { ClientDetailPage } from './pages/ClientDetailPage'
import { ProjectsListPage } from './pages/ProjectsListPage'
import { ProjectWorkspacePage } from './pages/ProjectWorkspacePage'
import { KnowledgePage } from './pages/KnowledgePage'
import { SettingsPage } from './pages/SettingsPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  if (!user) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const initialize = useAuthStore(s => s.initialize)
  useEffect(() => { initialize() }, [initialize])

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/client-login" element={<ClientLoginPage />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<CommandCenterPage />} />
          <Route path="clientes" element={<ClientsPage />} />
          <Route path="clientes/:id" element={<ClientDetailPage />} />
          <Route path="proyectos" element={<ProjectsListPage />} />
          <Route path="proyectos/:id" element={<ProjectWorkspacePage />} />
          <Route path="conocimiento" element={<KnowledgePage />} />
          <Route path="equipo" element={<div className="p-6 text-center text-[var(--eva-txt-muted)] font-ui py-24 bg-[var(--eva-black)] min-h-screen"><h2 className="text-xl font-brand text-white mb-2">Sección de Equipo</h2><p className="text-sm">Próximamente en Evangelista Intelligence Platform.</p></div>} />
          <Route path="configuracion" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
