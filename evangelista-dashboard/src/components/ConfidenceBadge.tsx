export function ConfidenceBadge({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  const color = pct >= 80 ? 'text-green-700 bg-green-50' : pct >= 60 ? 'text-eva-gold bg-eva-gold/10' : 'text-eva-red bg-eva-red/10'
  const label = pct >= 80 ? 'Alta' : pct >= 60 ? 'Media' : 'Baja'
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label} {pct}%
    </span>
  )
}
