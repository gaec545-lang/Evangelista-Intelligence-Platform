import { useState, useEffect } from 'react'
import { Folder, FileText, ChevronRight, ChevronDown } from 'lucide-react'
import { api } from '../lib/api'
import { motion, AnimatePresence } from 'framer-motion'

interface NodeProps {
  node: any
  level: number
}

function TreeNode({ node, level }: NodeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isDir = node.type === 'directory'

  return (
    <div className="w-full">
      <div 
        className={`flex items-center gap-2 py-1.5 px-2 hover:bg-eva-beige-2 rounded-lg cursor-pointer transition-colors ${level === 0 ? 'font-medium' : 'text-sm'}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => isDir && setIsOpen(!isOpen)}
      >
        <span className="text-eva-txt-faint w-4">
          {isDir ? (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : null}
        </span>
        <span className={isDir ? 'text-eva-olive' : 'text-eva-txt-mid'}>
          {isDir ? <Folder size={16} /> : <FileText size={16} />}
        </span>
        <span className={isDir ? 'text-eva-txt-high' : 'text-eva-txt-mid'}>{node.name}</span>
      </div>
      
      <AnimatePresence>
        {isDir && isOpen && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {node.children.map((child: any, i: number) => (
              <TreeNode key={i} node={child} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function LibraryBrowser() {
  const [tree, setTree] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTree() {
      try {
        const data = await api.getKnowledgeLibrary()
        setTree(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadTree()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-eva-olive/10 border-t-eva-olive rounded-full animate-spin mb-4" />
        <span className="text-xs caps-detail animate-pulse">Cargando biblioteca...</span>
      </div>
    )
  }

  if (tree.length === 0) {
    return (
      <div className="p-8 text-center text-eva-txt-muted text-sm border-2 border-dashed border-eva-border rounded-xl">
        No se encontraron archivos en la biblioteca.
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-eva-border">
      <h3 className="text-sm font-brand mb-4 flex items-center gap-2">
        <Folder size={16} className="text-eva-gold" /> Directorio del Vault
      </h3>
      <div className="space-y-1">
        {tree.map((node, i) => (
          <TreeNode key={i} node={node} level={0} />
        ))}
      </div>
    </div>
  )
}
