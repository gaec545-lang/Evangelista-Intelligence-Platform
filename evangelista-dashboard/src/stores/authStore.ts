import { create } from 'zustand'
import { supabase, teamDB } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import type { TeamMember } from '../lib/types'

const SUPABASE_CONFIGURED = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
)

/**
 * Permisos predeterminados por rol:
 * — ceo: todo
 * — cto: operations + architecture_rag + erp_connections
 * — cfo_cqa: operations (lectura + análisis, sin architecture_rag)
 * — consultant: operations (lectura + análisis, sin config)
 * — viewer: operations (solo lectura)
 */
const ROLE_PERMISSIONS: Record<string, TeamMember['permissions']> = {
  ceo:         { operations: true,  architecture_rag: true,  erp_connections: true,  team_management: true  },
  cto:         { operations: true,  architecture_rag: true,  erp_connections: true,  team_management: false },
  cfo_cqa:     { operations: true,  architecture_rag: false, erp_connections: false, team_management: false },
  consultant:  { operations: true,  architecture_rag: false, erp_connections: false, team_management: false },
  viewer:      { operations: true,  architecture_rag: false, erp_connections: false, team_management: false },
}

interface AuthState {
  user: User | null
  session: Session | null
  teamMember: TeamMember | null
  loading: boolean
  initialized: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
  hasPermission: (permission: keyof TeamMember['permissions']) => boolean
  isRole: (...roles: TeamMember['role'][]) => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  teamMember: null,
  loading: true,
  initialized: false,

  signIn: async (email: string, password: string) => {
    if (!SUPABASE_CONFIGURED) throw new Error('Supabase no está configurado.')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    // Cargar perfil de equipo
    let member = await teamDB.getByUserId(data.user.id)

    // Normalizar permisos según el rol si no existen en la BD
    if (member) {
      if (!member.permissions) {
        member.permissions = ROLE_PERMISSIONS[member.role] || ROLE_PERMISSIONS.viewer
        // Actualizar en DB para persistir
        await teamDB.update(member.id, { permissions: member.permissions })
      }
    }

    set({ user: data.user, session: data.session, teamMember: member as TeamMember | null, loading: false })
  },

  signOut: async () => {
    if (SUPABASE_CONFIGURED) await supabase.auth.signOut()
    set({ user: null, session: null, teamMember: null })
  },

  initialize: async () => {
    if (!SUPABASE_CONFIGURED) {
      set({ user: null, session: null, loading: false, initialized: true })
      return
    }
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      let member = await teamDB.getByUserId(session.user.id)

      // Normalizar permisos según el rol si no existen en la BD
      if (member && !member.permissions) {
        member.permissions = ROLE_PERMISSIONS[member.role] || ROLE_PERMISSIONS.viewer
        await teamDB.update(member.id, { permissions: member.permissions })
      }

      set({ user: session.user, session, teamMember: member as any, initialized: true, loading: false })
    } else {
      set({ initialized: true, loading: false })
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const member = await teamDB.getByUserId(session.user.id)
        set({ user: session.user, session, teamMember: member as any })
      } else {
        set({ user: null, session: null, teamMember: null })
      }
    })
  },

  hasPermission: (permission: keyof TeamMember['permissions']) => {
    const member = get().teamMember
    if (!member) return false
    // CEO siempre ve todo
    if (member.role === 'ceo') return true
    return member.permissions?.[permission] ?? false
  },

  isRole: (...roles: TeamMember['role'][]) => {
    const member = get().teamMember
    if (!member) return false
    return roles.includes(member.role)
  }
}))
