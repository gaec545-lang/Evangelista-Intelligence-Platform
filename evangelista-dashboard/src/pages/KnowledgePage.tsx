import { useState, useMemo } from 'react'
import { BookOpen, Database, HelpCircle, Filter, Tag, Globe, Shield, BarChart3, Layout } from 'lucide-react'
import { api } from '../lib/api'
import { SearchBar } from '../components/SearchBar'
import { SearchResults } from '../components/SearchResults'
import { EmptyState } from '../components/ui/EmptyState'
import Badge from '../components/ui/Badge'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORIES = [
  { id: 'all', label: 'Todo', icon: <Globe size={14} /> },
  { id: 'framework', label: 'Frameworks', icon: <Shield size={14} /> },
  { id: 'playbook', label: 'Playbooks', icon: <BookOpen size={14} /> },
  { id: 'benchmark', label: 'Benchmarks', icon: <BarChart3 size={14} /> },
  { id: 'rule', label: 'Reglas', icon: <Tag size={14} /> },
  { id: 'template', label: 'Templates', icon: <Layout size={14} /> },
]

export function KnowledgePage() {
  const [results, setResults] = useState<Array<any>>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')

  const handleSearch = async (query: string, agent: string) => {
    setLoading(true)
    try {
      const data = await api.searchKnowledge(query, agent)
      setResults(data.results || [])
      setSearched(true)
    } catch (e) {
      console.error(e)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const filteredResults = useMemo(() => {
    if (activeCategory === 'all') return results
    return results.filter((r: any) => r.metadata?.type === activeCategory)
  }, [results, activeCategory])

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-eva-border pb-8">
        <div className="space-y-2">
          <Badge variant="olive" size="sm" className="mb-1">Intelligence Ecosystem</Badge>
          <h1 className="text-4xl font-brand">Knowledge Vault</h1>
          <p className="text-eva-txt-mid max-w-lg leading-relaxed">
            Acceso semántico al cerebro metodológico de Evangelista & Co. 
            Consulte frameworks, playbooks sectoriales y benchmarks institucionales.
          </p>
        </div>
        
        <div className="flex items-center gap-6 text-[10px] caps-detail bg-white/50 px-4 py-2 rounded-full border border-eva-border shadow-sm">
          <span className="flex items-center gap-1.5">
            <Database size={12} className="text-eva-gold" /> 
            Qdrant Vector DB
          </span>
          <div className="w-px h-3 bg-eva-border" />
          <span className="flex items-center gap-1.5">
            <HelpCircle size={12} className="text-eva-olive" /> 
            Nomic Embeddings
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar de Filtros */}
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs caps-detail flex items-center gap-2">
              <Filter size={12} /> Filtrar Categoría
            </h3>
            <div className="flex flex-col gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                    activeCategory === cat.id 
                      ? 'bg-eva-olive text-white shadow-md' 
                      : 'text-eva-txt-mid hover:bg-eva-beige-2'
                  }`}
                >
                  <span className={activeCategory === cat.id ? 'text-white' : 'text-eva-txt-faint'}>
                    {cat.icon}
                  </span>
                  <span className="font-medium">{cat.label}</span>
                  {activeCategory === cat.id && (
                    <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-eva-gold" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-eva-gold/5 border border-eva-gold/10 space-y-2">
            <h4 className="text-[10px] caps-detail text-eva-gold">Tip de Búsqueda</h4>
            <p className="text-xs text-eva-txt-mid leading-relaxed">
              Use términos naturales como "¿Cuál es el margen EBITDA esperado en retail?" para mejores resultados.
            </p>
          </div>
        </div>

        {/* Área Principal */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Bar Container */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-eva-border ring-4 ring-eva-beige-2">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>

          <AnimatePresence mode="wait">
            {!searched && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyState
                  icon={<BookOpen size={48} className="text-eva-olive/30" />}
                  title="Explora la Inteligencia Colectiva"
                  description="Busca conceptos, normativas o datos sectoriales para recuperar fragmentos relevantes de nuestra base de conocimiento."
                />
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 flex flex-col items-center justify-center space-y-4"
              >
                <div className="w-12 h-12 border-4 border-eva-olive/10 border-t-eva-olive rounded-full animate-spin" />
                <p className="text-xs caps-detail animate-pulse">Consultando el Vault...</p>
              </motion.div>
            )}

            {searched && !loading && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs caps-detail">
                    {filteredResults.length} {filteredResults.length === 1 ? 'hallazgo' : 'hallazgos'} {activeCategory !== 'all' ? `en ${activeCategory}` : ''}
                  </p>
                  {results.length > filteredResults.length && (
                    <button 
                      onClick={() => setActiveCategory('all')}
                      className="text-xs text-eva-gold hover:underline font-medium"
                    >
                      Mostrar todos ({results.length})
                    </button>
                  )}
                </div>

                {filteredResults.length === 0 ? (
                  <div className="py-12 text-center border-2 border-dashed border-eva-border rounded-2xl bg-white/30">
                    <p className="text-eva-txt-muted font-medium">Sin resultados para esta categoría</p>
                    <p className="text-xs text-eva-txt-faint mt-1">Pruebe cambiando el filtro o la consulta.</p>
                  </div>
                ) : (
                  <SearchResults results={filteredResults} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
