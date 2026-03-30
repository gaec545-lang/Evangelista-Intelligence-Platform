import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-eva-charcoal">{label}</label>}
      <input
        className={`px-3 py-2 rounded-lg border border-[var(--eva-border)] bg-white text-eva-charcoal placeholder:text-eva-warm-gray focus:outline-none focus:ring-2 focus:ring-eva-olive/30 focus:border-eva-olive ${error ? 'border-eva-red' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-eva-red">{error}</p>}
    </div>
  )
}
