import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function LoginPage() {
  const { user, signIn } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try { await signIn(email, password) }
    catch { setError('Credenciales inválidas. Verifica tu email y contraseña.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-eva-cream flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--eva-border)] p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo-evangelista.svg" alt="Evangelista" className="w-12 h-12 mx-auto mb-4 rounded-xl" />
          <h1 className="font-serif text-2xl font-bold text-eva-charcoal">Evangelista & Co.</h1>
          <p className="text-sm text-eva-warm-gray mt-1">Intelligence Platform</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
          <Input label="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <p className="text-xs text-eva-red">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">Ingresar</Button>
        </form>
      </div>
    </div>
  )
}
