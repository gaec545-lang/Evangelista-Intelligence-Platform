import { useState, useCallback } from 'react'
import { Upload, FileSpreadsheet, Trash2, Download, Loader2, AlertCircle } from 'lucide-react'

interface UploadedFile {
  name: string
  size: number
  uploaded_at: string
}

import { API_BASE } from '../../lib/config'

export default function ClientDataUpload({ clientId }: { clientId: string }) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }, [clientId])

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) uploadFile(e.target.files[0])
  }

  async function uploadFile(file: File) {
    setUploading(true); setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`${API_BASE}/api/v1/clients/${clientId}/files`, { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Error subiendo archivo')
      setFiles(prev => [...prev, { name: file.name, size: file.size, uploaded_at: new Date().toISOString() }])
    } catch (err: any) {
      setError(err.message || 'Error al subir')
    } finally { setUploading(false) }
  }

  async function deleteFile(name: string) {
    if (!confirm(`¿Eliminar ${name}?`)) return
    try {
      await fetch(`${API_BASE}/api/v1/clients/${clientId}/files/${encodeURIComponent(name)}`, { method: 'DELETE' })
      setFiles(prev => prev.filter(f => f.name !== name))
    } catch { /* silent */ }
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1048576).toFixed(1)} MB`
  }

  return (
    <div className="rounded-2xl border border-[var(--eva-border)] bg-[var(--eva-surface)] p-5 shadow-eva-sm">
      <div className="flex items-center gap-2 mb-4">
        <FileSpreadsheet size={16} className="text-[var(--eva-olive)]" />
        <h3 className="font-brand text-base font-medium text-[var(--eva-txt-primary)]">Archivos del Cliente</h3>
        {files.length > 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--eva-surface-2)] border border-[var(--eva-border)] text-[var(--eva-txt-muted)]">{files.length}</span>}
      </div>

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors mb-4 ${
          dragging ? 'border-eva-olive bg-eva-olive/5' : 'border-eva-border hover:border-eva-olive/40'
        }`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={22} className="animate-spin text-eva-olive" />
            <p className="text-xs text-eva-txt-muted">Subiendo archivo…</p>
          </div>
        ) : (
          <>
            <Upload size={22} className="mx-auto mb-2 text-eva-txt-faint" />
            <p className="text-xs text-eva-txt-muted mb-2">Arrastra Excel, CSV o PDF aquí</p>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-eva-olive text-white text-[11px] font-semibold cursor-pointer hover:bg-eva-olive/90 transition-colors">
              <Upload size={12} /> Seleccionar
              <input type="file" accept=".csv,.tsv,.xlsx,.xls,.pdf" className="hidden" onChange={handleSelect} />
            </label>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 rounded-lg p-2 mb-3 border border-red-500/20">
          <AlertCircle size={13} /> {error}
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map(f => (
            <div key={f.name} className="flex items-center justify-between p-3 rounded-lg border border-[var(--eva-border)] bg-[var(--eva-surface-2)]">
              <div className="flex items-center gap-2 min-w-0">
                <FileSpreadsheet size={14} className="text-[var(--eva-olive)] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[var(--eva-txt-primary)] truncate">{f.name}</p>
                  <p className="text-[10px] text-eva-txt-muted">{formatSize(f.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-1 rounded text-eva-txt-faint hover:text-eva-olive transition-colors"><Download size={13} /></button>
                <button onClick={() => deleteFile(f.name)} className="p-1 rounded text-eva-txt-faint hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
