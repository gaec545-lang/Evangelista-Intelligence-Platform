const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const REQUEST_TIMEOUT_MS = 90_000 // 90s — necesario para reintentos de IA en saturación

import { useAuthStore } from '../stores/authStore'

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
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const token = useAuthStore.getState().token;

    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      signal: controller.signal,
      ...options,
    })
    if (!res.ok) {
      // El orquestador no ha reportado agentes activos. Verifica el estado del backend.
      const status = res.status
      if (status >= 500) throw new Error('El servicio no está disponible. Intenta más tarde.')
      if (status === 401 || status === 403) throw new Error('No tienes permisos para realizar esta acción.')
      if (status === 404) throw new Error('Recurso no encontrado.')
      throw new Error(`Error en la solicitud (${status}).`)
    }
    return res.json()
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado. Intenta de nuevo.')
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
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
  async getKnowledgeLibrary(): Promise<any[]> {
    return fetchAPI('/api/v1/library', { method: 'GET' })
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
  async getGraphMermaid(): Promise<{ mermaid: string }> {
    return fetchAPI('/api/v1/graph/mermaid')
  },
  async runGraph(task: string, context?: Record<string, unknown>): Promise<{
    response: string;
    confidence: number;
    route: string;
    node_history: string[];
    sources: string[];
    mermaid_trace: string;
    execution_time_ms: number;
    retry_count: number;
    errors: string[];
  }> {
    return fetchAPI('/api/v1/analyze', { 
      method: 'POST', 
      body: JSON.stringify({ task, context: context || {} }) 
    })
  },
  async downloadDocument(template: string, data: Record<string, any>): Promise<void> {
    const token = useAuthStore.getState().token;
    const response = await fetch(`${API_BASE}/api/v1/documents/generate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ template, data }),
    });
    
    if (!response.ok) throw new Error('Error generando documento');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || `${template}.docx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
  async post<T>(path: string, body: any): Promise<T> {
    return fetchAPI<T>(path, { method: 'POST', body: JSON.stringify(body) });
  },
  async get<T>(path: string): Promise<T> {
    return fetchAPI<T>(path, { method: 'GET' });
  },
  async delete<T>(path: string): Promise<T> {
    return fetchAPI<T>(path, { method: 'DELETE' });
  },
}
