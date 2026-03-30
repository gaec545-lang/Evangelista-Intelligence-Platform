const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface AnalyzeRequest {
  task: string
  context?: Record<string, unknown>
}

export interface AnalyzeResponse {
  status: string
  response: string
  confidence: number
  sources: string[]
  execution_time_ms: number
  errors: string[]
  subtasks?: Array<{ id: string; agent: string; status: string; confidence: number }>
}

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const error = await res.text()
    throw new Error(`API ${res.status}: ${error}`)
  }
  return res.json()
}

export const api = {
  async analyze(req: AnalyzeRequest): Promise<AnalyzeResponse> {
    return fetchAPI('/api/v1/analyze', { method: 'POST', body: JSON.stringify(req) })
  },
  async listAgents(): Promise<{ agents: Array<{ name: string; domains: string[]; tools: string[] }>; total: number }> {
    return fetchAPI('/api/v1/agents')
  },
  async executeAgent(name: string, task: string): Promise<Record<string, unknown>> {
    return fetchAPI(`/api/v1/agents/${name}/execute`, { method: 'POST', body: JSON.stringify({ task }) })
  },
  async searchKnowledge(query: string, agent = 'all', top_k = 5): Promise<{ results: Array<Record<string, unknown>>; total: number }> {
    return fetchAPI('/api/v1/search', { method: 'POST', body: JSON.stringify({ query, agent, top_k }) })
  },
  async generateFoundation(data: Record<string, unknown>): Promise<{ proposal: string; type: string }> {
    return fetchAPI('/api/v1/proposals/foundation', { method: 'POST', body: JSON.stringify(data) })
  },
  async generateArchitecture(data: Record<string, unknown>, hallazgos: string[]): Promise<{ proposal: string; type: string }> {
    return fetchAPI('/api/v1/proposals/architecture', { method: 'POST', body: JSON.stringify({ client_data: data, hallazgos }) })
  },
  async health(): Promise<{ ready: boolean; checks: Record<string, { status: string; count?: number }> }> {
    return fetchAPI('/readiness')
  },
}
