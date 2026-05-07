import { useState, useEffect, useCallback, useRef } from 'react'
import { Save, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { clientsDB } from '../../lib/supabase'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function ClientNotes({ clientId, initialNotes }: { clientId: string; initialNotes?: string }) {
  const [notes, setNotes] = useState(initialNotes ?? '')
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  // Autoguardado con debounce de 1.5s
  useEffect(() => {
    if (notes === (initialNotes ?? '')) return
    setSaveState('idle')
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setSaveState('saving')
      try {
        await clientsDB.update(clientId, { notes })
        setSaveState('saved')
        setLastSaved(new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }))
        setTimeout(() => setSaveState('idle'), 2000)
      } catch {
        setSaveState('error')
      }
    }, 1500)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [notes, clientId])

  return (
    <div className="rounded-2xl border border-eva-border bg-white p-5 shadow-eva-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Save size={16} className="text-eva-olive" />
          <h3 className="font-brand text-base font-medium text-eva-black">Notas de Caso</h3>
        </div>
        <div className="flex items-center gap-1.5">
          {saveState === 'saving' && <><Loader2 size={12} className="animate-spin text-eva-txt-muted" /><span className="text-[10px] text-eva-txt-muted">Guardando…</span></>}
          {saveState === 'saved' && <><CheckCircle size={12} className="text-green-500" /><span className="text-[10px] text-green-600">Guardado</span></>}
          {saveState === 'error' && <><AlertCircle size={12} className="text-red-500" /><span className="text-[10px] text-red-500">Error</span></>}
          {saveState === 'idle' && lastSaved && <span className="text-[9px] text-eva-txt-faint">Último: {lastSaved}</span>}
        </div>
      </div>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Observaciones del caso, recordatorios, notas de reunión…"
        rows={7}
        className="w-full rounded-xl border border-eva-border bg-eva-beige-light px-4 py-3 text-[13px] font-ui text-eva-black placeholder-eva-txt-faint resize-none focus:outline-none focus:ring-1 focus:ring-eva-olive/40 focus:border-eva-olive transition-all"
      />
    </div>
  )
}
