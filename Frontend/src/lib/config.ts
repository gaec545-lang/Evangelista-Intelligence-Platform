let apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';

if (typeof window !== 'undefined') {
  const hostname = window.location.hostname;
  if (hostname.includes('app-evangelista-frontend')) {
    apiBase = `https://${hostname.replace('app-evangelista-frontend', 'app-evangelista-backend')}`;
  }
}

export const API_BASE = apiBase;
