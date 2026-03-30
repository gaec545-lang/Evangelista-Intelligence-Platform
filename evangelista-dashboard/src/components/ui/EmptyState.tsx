import React from 'react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-eva-warm-gray mb-4 opacity-50">{icon}</div>}
      <h3 className="font-serif text-lg text-eva-charcoal mb-1">{title}</h3>
      {description && <p className="text-sm text-eva-warm-gray mb-4 max-w-sm">{description}</p>}
      {action}
    </div>
  )
}
