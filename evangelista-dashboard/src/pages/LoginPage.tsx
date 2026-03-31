import { useState, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

const MAX_ATTEMPTS = 5
const LOCKOUT_SECONDS = 30

export function LoginPage() {
  const { user, signIn } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const attemptsRef = useRef(0)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)

  if (user) return <Navigate to="/" replace />

  const isLocked = lockedUntil != null && Date.now() < lockedUntil
  const secondsLeft = isLocked ? Math.ceil((lockedUntil! - Date.now()) / 1000) : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLocked) return
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      attemptsRef.current = 0
    } catch {
      attemptsRef.current += 1
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_SECONDS * 1000)
        attemptsRef.current = 0
        setError(`Demasiados intentos fallidos. Espera ${LOCKOUT_SECONDS} segundos.`)
      } else {
        setError('Credenciales inválidas. Verifica tu email y contraseña.')
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-eva-cream flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--eva-border)] p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo-evangelista.svg" alt="Evangelista" className="w-12 h-12 mx-auto mb-4 rounded-xl" />
          <h1 className="font-serif text-2xl font-bold text-eva-charcoal">Evangelista &amp; Co.</h1>
          <p className="text-sm text-eva-warm-gray mt-1">Intelligence Platform</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus disabled={isLocked} />
          <Input label="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} required disabled={isLocked} />
          {error && <p className="text-xs text-eva-red">{error}</p>}
          {isLocked && <p className="text-xs text-eva-warm-gray">Disponible en {secondsLeft}s</p>}
          <Button type="submit" loading={loading} className="w-full" disabled={isLocked}>Ingresar</Button>
        </form>
      </div>
    </div>
  )
}

