import { useAuthStore } from '../stores/authStore';

import { API_BASE } from './config';

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const token = useAuthStore.getState().token;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options?.headers || {})
    }
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export const apiClient = {
  get: <T>(path: string) => fetchAPI<T>(path, { method: 'GET' }),
  post: <T>(path: string, body: any) => fetchAPI<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: any) => fetchAPI<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => fetchAPI<T>(path, { method: 'DELETE' }),

  // Entities
  getClients: () => apiClient.get<any[]>('/api/v1/clients'),
  getClient: (id: string) => apiClient.get<any>(`/api/v1/clients/${id}`),
  createClient: (data: any) => apiClient.post<any>('/api/v1/clients', data),
  
  getProjects: (clientId?: string) => apiClient.get<any[]>(`/api/v1/projects${clientId ? `?client_id=${clientId}` : ''}`),
  createProject: (data: any) => apiClient.post<any>('/api/v1/projects', data),

  // Notarial (Audit / Bóveda)
  createSnapshot: (data: any) => apiClient.post<any>('/api/v1/notarial/snapshots', data),
  createCoiCalculo: (data: any) => apiClient.post<any>('/api/v1/notarial/coi_calculos', data),
  logBitacora: (data: any) => apiClient.post<any>('/api/v1/notarial/bitacora', data),
  getBitacora: (clientId: string) => apiClient.get<any[]>(`/api/v1/notarial/bitacora?client_id=${clientId}`), // assumed get exists
  createDocumento: (data: any) => apiClient.post<any>('/api/v1/notarial/documentos', data),
  getDocumentos: (clientId: string) => apiClient.get<any[]>(`/api/v1/notarial/documentos?client_id=${clientId}`), // assumed get exists
  createCredencial: (data: any) => apiClient.post<any>('/api/v1/notarial/credenciales', data),
  getCredenciales: (clientId: string) => apiClient.get<any[]>(`/api/v1/notarial/credenciales?client_id=${clientId}`), // assumed get exists
};
