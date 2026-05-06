import { useState, useEffect } from 'react'
import { Activity, FlaskConical, Layers, Radio, Database, FileSpreadsheet, Users } from 'lucide-react'
import { activityLogDB } from '../../lib/supabase'
import { Spinner } from '../ui/Spinner'

const ENTITY_ICONS: Record<string, React.ComponentType<any>> = {
  foundation: FlaskConical, architecture: Layers, sentinel: Radio,
  erp: Database, file: FileSpreadsheet, client: Users,
}

const ENTITY_COLORS: Record<string, string> = {
  foundation: '#e89a88', architecture: '#9a98e8', sentinel: '#60c4a8',
  erp: '#c9a84c', file: '#6a6a58', client: '#3e4d32',
}

export default function ClientActivityLog({ clientId }: { clientId: string }) {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    activityLogDB.list(15, clientId)
      .then(data => setActivities(data || []))
      .catch(() => setActivities([]))
      .finally(() => setLoading(false))
  }, [clientId])

  function timeAgo(iso: string) {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
    if (mins < 1) return 'ahora'
    if (mins < 60) return `hace ${mins}m`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `hace ${hrs}h`
    const days = Math.floor(hrs / 24)
    if (days < 7) return `hace ${days}d`
    return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })
  }

  return (
    <div className="rounded-2xl border border-eva-border bg-white p-5 shadow-eva-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-eva-txt-muted" />
          <h3 className="font-brand text-base font-medium text-eva-black">Actividad</h3>
        </div>
        {activities.length > 0 && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-eva-beige-2 text-eva-txt-muted">{activities.length}</span>
        )}
      </div>

      {loading && <div className="py-8 flex justify-center"><Spinner size="sm" /></div>}

      {!loading && activities.length === 0 && (
        <div className="py-8 text-center">
          <Activity size={20} className="mx-auto mb-2 text-eva-border" />
          <p className="text-xs text-eva-txt-muted">Sin actividad registrada</p>
        </div>
      )}

      {!loading && activities.length > 0 && (
        <div className="relative space-y-0">
          {/* Timeline line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-eva-border" />

          {activities.map((act, i) => {
            const Icon = ENTITY_ICONS[act.entity_type] || Activity
            const color = ENTITY_COLORS[act.entity_type] || '#6a6a58'
            return (
              <div key={act.id || i} className="relative flex items-start gap-3 py-2.5 pl-1">
                <div
                  className="relative z-10 w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 border-2 border-white"
                  style={{ background: `${color}15`, color }}
                >
                  <Icon size={13} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[12px] text-eva-black leading-snug">{act.action}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-eva-txt-faint">{act.team_members?.full_name || 'Sistema'}</span>
                    <span className="text-[10px] text-eva-txt-faint">·</span>
                    <span className="text-[10px] text-eva-txt-faint">{timeAgo(act.created_at)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
