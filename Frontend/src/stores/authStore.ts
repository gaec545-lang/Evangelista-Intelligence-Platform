import { create } from 'zustand'

export type AppRole = 'socio' | 'cqa' | 'consultor' | string

export interface User {
  id?: string;
  email: string;
  name?: string;
  roles: AppRole[];
  [key: string]: any;
}

interface AuthState {
  user: User | null
  token: string | null
  roles: AppRole[]
  loading: boolean
  initialized: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
  hasRole: (role: AppRole) => boolean
}

function decodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('access_token') || null,
  roles: [],
  loading: true,
  initialized: false,

  signIn: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        throw new Error('Credenciales inválidas o error de conexión.');
      }
      const data = await res.json();
      
      const token = data.access_token || data.token;
      let user = data.user;
      let roles: AppRole[] = [];
      
      if (!user && token) {
         const payload = decodeJwt(token);
         if (payload) {
           user = {
             email: payload.email || payload.sub || email,
             name: payload.name,
             roles: payload.roles || []
           };
           roles = user.roles;
         } else {
           user = { email, roles: [] };
         }
      } else if (user) {
         roles = user.roles || [];
      }
      
      if (token) {
        localStorage.setItem('access_token', token);
      }
      
      set({ 
        user, 
        token, 
        roles, 
        loading: false 
      })
    } catch (e) {
      console.error("Login failed:", e)
      throw e
    }
  },

  signOut: async () => {
    localStorage.removeItem('access_token');
    set({ user: null, token: null, roles: [] })
  },

  initialize: async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
         const payload = decodeJwt(token);
         if (payload) {
           const user = {
             email: payload.email || payload.sub,
             name: payload.name,
             roles: payload.roles || []
           };
           set({ user, token, roles: user.roles, initialized: true, loading: false })
         } else {
           localStorage.removeItem('access_token');
           set({ initialized: true, loading: false, token: null })
         }
    } else {
        set({ initialized: true, loading: false })
    }
  },

  hasRole: (role: AppRole) => {
    return get().roles.includes(role)
  }
}))
