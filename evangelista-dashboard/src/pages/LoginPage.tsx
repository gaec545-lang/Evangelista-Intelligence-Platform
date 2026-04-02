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
        setError(`Demasiados intentos. Espera ${LOCKOUT_SECONDS}s.`)
      } else {
        setError('Credenciales inválidas.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-primary-600 flex items-center justify-center mb-4">
            <span className="text-white text-lg font-semibold">E</span>
          </div>
          <p className="text-sm text-content-primary">Evangelista</p>
          <p className="text-xs text-content-tertiary mt-0.5">Intelligence Platform</p>
        </div>

        {/* Login form */}
        <div className="bg-white rounded-card border border-surface-border p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus disabled={isLocked} />
            <Input label="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} required disabled={isLocked} />
            {error && <p className="text-xs text-red-600">{error}</p>}
            {isLocked && <p className="text-xs text-content-tertiary">Disponible en {secondsLeft}s</p>}
            <Button type="submit" loading={loading} className="w-full" disabled={isLocked}>
              Ingresar
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
