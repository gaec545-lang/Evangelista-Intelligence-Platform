import { useState } from 'react'
import { BookOpen } from 'lucide-react'
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
    } catch (e) { console.error(e); setResults([]) }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-eva-charcoal">Knowledge Base</h1>
        <p className="text-eva-warm-gray mt-1">Explora el vault de conocimiento de Evangelista</p>
      </div>
      <SearchBar onSearch={handleSearch} loading={loading} />
      {!searched && !loading && (
        <EmptyState icon={<BookOpen size={40} />} title="Busca en el knowledge base"
          description="Ingresa una consulta para encontrar documentos relevantes del vault" />
      )}
      {searched && !loading && results.length === 0 && (
        <EmptyState title="Sin resultados" description="Intenta con diferentes términos de búsqueda" />
      )}
      <SearchResults results={results} />
    </div>
  )
}
