import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { AppLayout } from './layouts/AppLayout'
import { LoginPage } from './pages/LoginPage'
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
import FoundationPipelinePage from './pages/FoundationPipelinePage'
import FoundationDetailPage from './pages/FoundationDetailPage'
import ArchitectureListPage from './pages/ArchitectureListPage'
import ArchitectureDetailPage from './pages/ArchitectureDetailPage'
import SentinelListPage from './pages/SentinelListPage'
import SentinelDetailPage from './pages/SentinelDetailPage'
import MonteCarloPage from './pages/MonteCarloPage'
import TeamPage from './pages/TeamPage'
import ERPConnectionsPage from './pages/ERPConnectionsPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const initialize = useAuthStore(s => s.initialize)
  useEffect(() => { initialize() }, [initialize])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
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

          {/* === WAR ROOM: FOUNDATION === */}
          <Route path="foundation" element={<FoundationPipelinePage />} />
          <Route path="foundation/:id" element={<FoundationDetailPage />} />

          {/* === WAR ROOM: ARCHITECTURE === */}
          <Route path="architecture" element={<ArchitectureListPage />} />
          <Route path="architecture/:id" element={<ArchitectureDetailPage />} />

          {/* === WAR ROOM: SENTINEL === */}
          <Route path="sentinel" element={<SentinelListPage />} />
          <Route path="sentinel/:id" element={<SentinelDetailPage />} />
          <Route path="sentinel/:id/montecarlo" element={<MonteCarloPage />} />

          {/* === WAR ROOM: ADMIN === */}
          <Route path="team" element={<TeamPage />} />
          <Route path="erp-connections" element={<ERPConnectionsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
