import { useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import AppLayout from './components/layout/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { ClientLoginPage } from './pages/ClientLoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { AnalyzePage } from './pages/AnalyzePage'
import GraphPage from './pages/GraphPage'
import AnalysisHistory from './components/AnalysisHistory'
import { AgentsPage } from './pages/AgentsPage'
import { AgentDetailPage } from './pages/AgentDetailPage'
import { ClientsPage } from './pages/ClientsPage'
import { ClientDetailPage } from './pages/ClientDetailPage'
import { ProposalPage } from './pages/ProposalPage'
import { KnowledgePage } from './pages/KnowledgePage'
import { SettingsPage } from './pages/SettingsPage'
import { Spinner } from './components/ui/Spinner'
// War room pages (Part 2/3)
import SentinelListPage from './pages/SentinelListPage'
import SentinelDetailPage from './pages/SentinelDetailPage'
import MonteCarloPage from './pages/MonteCarloPage'
import TeamPage from './pages/TeamPage'
import ERPConnectionsPage from './pages/ERPConnectionsPage'
import { TemplatesPage } from './pages/TemplatesPage'

// Redesign: Project-centric model (Spec 00)
import ProjectsListPage from './pages/ProjectsListPage'
import ProjectWorkspacePage from './pages/ProjectWorkspacePage'

import { EntryPage } from './pages/EntryPage'

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
          <Route index element={<DashboardPage />} />
          <Route path="analyze" element={<AnalyzePage />} />
          <Route path="history" element={<AnalysisHistory />} />
          <Route path="graph" element={<GraphPage />} />
          <Route path="agents" element={<AgentsPage />} />
          <Route path="agents/:name" element={<AgentDetailPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/:id" element={<ClientDetailPage />} />
          <Route path="proposals" element={<ProposalPage />} />
          <Route path="knowledge" element={<KnowledgePage />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* === REDESIGN: PROJECTS (Spec 00) === */}
          <Route path="projects" element={<ProjectsListPage />} />
          <Route path="projects/:projectId" element={<ProjectWorkspacePage />} />

          {/* === WAR ROOM: SENTINEL === */}
          <Route path="sentinel" element={<SentinelListPage />} />
          <Route path="sentinel/:id" element={<SentinelDetailPage />} />
          <Route path="sentinel/:id/montecarlo" element={<MonteCarloPage />} />

          {/* === WAR ROOM: ADMIN === */}
          <Route path="team" element={<TeamPage />} />
          <Route path="erp-connections" element={<ERPConnectionsPage />} />

          {/* === PLANTILLAS === */}
          <Route path="templates" element={<TemplatesPage />} />
        </Route>

        {/* Catch-all redirect to / if not matched */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
