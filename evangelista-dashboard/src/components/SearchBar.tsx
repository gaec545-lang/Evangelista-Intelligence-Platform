import { useState } from 'react';
import { Search } from 'lucide-react';
import Button from './ui/Button';

interface SearchBarProps {
  onSearch: (query: string, agent: string) => void;
  loading?: boolean;
  agents?: string[];
}

export function SearchBar({ onSearch, loading, agents = ['all', 'financial', 'process', 'data_engineer', 'analyst', 'risk'] }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [agent, setAgent] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim(), agent);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 items-stretch">
      {/* Query input */}
      <div className="flex-1 relative group">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-content-secondary/50 group-focus-within:text-primary-500 transition-colors pointer-events-none"
        />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Explorar el Vault de conocimiento..."
          className="input-glass w-full pl-10 pr-4 py-3 text-sm rounded-button"
        />
      </div>

      {/* Agent selector */}
      <div className="relative min-w-[160px]">
        <select
          value={agent}
          onChange={e => setAgent(e.target.value)}
          className="input-glass w-full px-3 py-3 text-[11px] font-semibold uppercase tracking-widest rounded-button appearance-none cursor-pointer text-content-secondary"
        >
          {agents.map(a => <option key={a} value={a}>{a === 'all' ? 'Global' : a}</option>)}
        </select>
      </div>

      <Button
        type="submit"
        isLoading={loading}
        disabled={!query.trim()}
      >
        Consultar
      </Button>
    </form>
  );
}
