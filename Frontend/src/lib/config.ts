let apiBase = import.meta.env.VITE_API_URL;

if (!apiBase && typeof window !== 'undefined') {
  const hostname = window.location.hostname;
  if (hostname.includes('app-evangelista-frontend')) {
    apiBase = `https://${hostname.replace('app-evangelista-frontend', 'app-evangelista-backend')}`;
  } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
    apiBase = 'http://localhost:8000';
  } else {
    // ponytail: fallback to backend FQDN for custom domains or other production hosts
    apiBase = 'https://app-evangelista-backend.jollyflower-774ba306.eastus2.azurecontainerapps.io';
  }
}

export const API_BASE = apiBase || 'http://localhost:8000';
