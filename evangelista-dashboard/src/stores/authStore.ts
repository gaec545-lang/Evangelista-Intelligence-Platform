import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

const SUPABASE_CONFIGURED = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
)

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  initialize: async () => {
    if (!SUPABASE_CONFIGURED) {
      // Sin credenciales → app sigue funcionando, mostrará LoginPage
      set({ user: null, session: null, loading: false })
      return
    }
    const { data: { session } } = await supabase.auth.getSession()
    set({ user: session?.user ?? null, session, loading: false })
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null, session })
    })
  },
  signIn: async (email, password) => {
    if (!SUPABASE_CONFIGURED) throw new Error('Supabase no está configurado.')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  },
  signOut: async () => {
    if (SUPABASE_CONFIGURED) await supabase.auth.signOut()
    set({ user: null, session: null })
  },
}))

