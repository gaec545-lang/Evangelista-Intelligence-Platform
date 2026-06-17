import { create } from 'zustand'
import { PublicClientApplication, InteractionRequiredAuthError, AccountInfo } from '@azure/msal-browser'

// Define minimum roles
export type AppRole = 'socio' | 'cqa' | 'consultor' | string

// Standard MSAL configs expecting Entra ID details from env
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_ENTRA_CLIENT_ID || 'dummy-client-id',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_ENTRA_TENANT_ID || 'dummy-tenant-id'}`,
    redirectUri: import.meta.env.VITE_ENTRA_REDIRECT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  }
}

export const msalInstance = new PublicClientApplication(msalConfig)

const loginRequest = {
  // Scopes for accessing the backend API (ensure API is exposed in Entra ID)
  scopes: ['User.Read', `api://${msalConfig.auth.clientId}/access_as_user`]
}

interface AuthState {
  user: AccountInfo | null
  token: string | null
  roles: AppRole[]
  loading: boolean
  initialized: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
  acquireToken: () => Promise<string | null>
  hasRole: (role: AppRole) => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  roles: [],
  loading: true,
  initialized: false,

  signIn: async () => {
    try {
      // Usamos loginPopup (o loginRedirect según preferencia del usuario final)
      const result = await msalInstance.loginPopup(loginRequest)
      const roles = ((result.idTokenClaims as any)?.roles as AppRole[]) || []
      
      set({ 
        user: result.account, 
        token: result.accessToken, 
        roles, 
        loading: false 
      })
    } catch (e) {
      console.error("Login failed:", e)
      throw e
    }
  },

  signOut: async () => {
    try {
      const account = get().user
      if (account) {
        await msalInstance.logoutPopup({ account })
      }
      set({ user: null, token: null, roles: [] })
    } catch (e) {
      console.error("Logout failed:", e)
    }
  },

  initialize: async () => {
    await msalInstance.initialize()
    
    // Check if there are any accounts logged in
    const currentAccounts = msalInstance.getAllAccounts()
    if (currentAccounts.length > 0) {
      const account = currentAccounts[0]
      msalInstance.setActiveAccount(account)
      
      try {
        const result = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account
        })
        const roles = ((result.idTokenClaims as any)?.roles as AppRole[]) || ((result.account?.idTokenClaims as any)?.roles as AppRole[]) || []
        
        set({ 
          user: result.account, 
          token: result.accessToken, 
          roles, 
          initialized: true, 
          loading: false 
        })
      } catch (e) {
        if (e instanceof InteractionRequiredAuthError) {
           console.warn("Interaction required for silent token acquisition")
        }
        set({ initialized: true, loading: false })
      }
    } else {
      set({ initialized: true, loading: false })
    }
  },

  acquireToken: async () => {
    const account = get().user || msalInstance.getActiveAccount()
    if (!account) return null

    try {
      const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account
      })
      set({ token: response.accessToken })
      return response.accessToken
    } catch (e) {
      if (e instanceof InteractionRequiredAuthError) {
        try {
            const response = await msalInstance.acquireTokenPopup(loginRequest)
            set({ token: response.accessToken })
            return response.accessToken
        } catch (popupErr) {
            console.error("Popup token acquisition failed:", popupErr)
            return null
        }
      }
      return null
    }
  },

  hasRole: (role: AppRole) => {
    return get().roles.includes(role)
  }
}))
