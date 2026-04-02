import { useState } from 'react'
import { BookOpen, Database, HelpCircle } from 'lucide-react'
import { api } from '../lib/api'
import { SearchBar } from '../components/SearchBar'
import { SearchResults } from '../components/SearchResults'
import { EmptyState } from '../components/ui/EmptyState'

export function KnowledgePage() {
  const [results, setResults] = useState<Array<Record<string, unknown>>>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (query: string, agent: string) => {
    setLoading(true)
    try {
      const data = await api.searchKnowledge(query, agent)
      setResults(data.results)
      setSearched(true)
    } catch (e) {
      console.error(e)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="space-y-1">
        <h1>Intelligence Vault</h1>
        <p className="max-w-xl">
          Búsqueda semántica sobre la base de conocimiento de Evangelista &amp; Co.
        </p>
      </section>

      {/* Search */}
      <div className="card-glass p-6">
        <p className="text-xs text-content-tertiary mb-4">Consulta semántica — Ingresa un término de búsqueda</p>
        <SearchBar onSearch={handleSearch} loading={loading} />
        <div className="mt-3 flex items-center gap-5 text-xs text-content-tertiary">
          <span className="flex items-center gap-1.5">
            <Database size={12} /> Qdrant vector DB
          </span>
          <span className="flex items-center gap-1.5">
            <HelpCircle size={12} /> Nomic embed
          </span>
        </div>
      </div>

      {/* Results */}
      {!searched && !loading && (
        <EmptyState
          icon={<BookOpen size={32} />}
          title="Explora el Vault"
          description="Busca conceptos, normativas o datos sectoriales para recuperar fragmentos relevantes."
        />
      )}

      {searched && !loading && results.length === 0 && (
        <div className="card-glass border-dashed p-12 text-center">
          <p className="text-sm text-content-secondary">Sin hallazgos relevantes</p>
          <p className="text-xs text-content-tertiary mt-1 max-w-xs mx-auto">No encontramos coincidencias. Prueba con términos más simples.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs text-content-tertiary">
            {results.length} fragmento{results.length !== 1 ? 's' : ''} recuperado{results.length !== 1 ? 's' : ''}
          </p>
          <SearchResults results={results} />
        </div>
      )}
    </div>
  )
}
