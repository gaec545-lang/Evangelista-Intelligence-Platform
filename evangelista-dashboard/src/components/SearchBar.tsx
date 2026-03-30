import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from './ui/Button'

interface SearchBarProps {
  onSearch: (query: string, agent: string) => void
  loading?: boolean
  agents?: string[]
}

export function SearchBar({ onSearch, loading, agents = ['all', 'financial', 'process', 'data_engineer', 'analyst', 'risk'] }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [agent, setAgent] = useState('all')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim(), agent)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-eva-warm-gray" />
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Buscar en el knowledge base..."
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-[var(--eva-border)] bg-white focus:outline-none focus:ring-2 focus:ring-eva-olive/30" />
      </div>
      <select value={agent} onChange={e => setAgent(e.target.value)}
        className="px-3 py-2 text-sm rounded-lg border border-[var(--eva-border)] bg-white focus:outline-none focus:ring-2 focus:ring-eva-olive/30">
        {agents.map(a => <option key={a} value={a}>{a === 'all' ? 'Todos' : a}</option>)}
      </select>
      <Button type="submit" loading={loading} disabled={!query.trim()}>Buscar</Button>
    </form>
  )
}
