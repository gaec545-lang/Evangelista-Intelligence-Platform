import React from 'react'

type BadgeVariant = 'olive' | 'gold' | 'red' | 'gray' | 'blue'

interface BadgeProps { children: React.ReactNode; variant?: BadgeVariant }

export function Badge({ children, variant = 'gray' }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    olive: 'bg-eva-olive/10 text-eva-olive',
    gold: 'bg-eva-gold/10 text-eva-gold',
    red: 'bg-eva-red/10 text-eva-red',
    gray: 'bg-black/5 text-eva-warm-gray',
    blue: 'bg-blue-50 text-blue-700',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}
