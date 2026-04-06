import { useState, useCallback } from 'react';
import { Upload, X, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface DetectedParams {
  registros_estimados: number;
  fuentes_datos: number;
  nodo_critico: string | null;
  sucursales: number;
  erp_type: string | null;
  confidence_scores: Record<string, number>;
  column_profile: Array<{ name: string; dtype: string; null_pct: number; unique_count: number }>;
  row_count: number;
  column_count: number;
}

interface DataUploadWizardProps {
  clientId: string;
  engagementId?: string;
  onDetected: (params: DetectedParams) => void;
  onClose: () => void;
}

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000');

export default function DataUploadWizard({ clientId, engagementId, onDetected, onClose }: DataUploadWizardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DetectedParams | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const analyzeFile = async () => {
    if (!file) return;
    setAnalyzing(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (engagementId) formData.append('engagement_id', engagementId);

      const res = await fetch(`${API_BASE}/api/v1/foundation/${clientId}/analyze-upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Error desconocido' }));
        throw new Error(typeof err.detail === 'string' ? err.detail : 'Error del servidor');
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error analizando archivo');
    } finally {
      setAnalyzing(false);
    }
  };

  const applyResults = () => {
    if (result) {
      onDetected(result);
    }
  };

  const confidenceBar = (score: number) => {
    const pct = Math.round(score * 100);
    const color = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-400';
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-[#0D0D0F] rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-mono text-[#A1A1A6] w-8 text-right">{pct}%</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#151518] rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-[rgba(255,255,255,0.08)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.08)]">
          <h2 className="text-lg font-semibold text-[#F5F5F7] flex items-center gap-2">
            <FileSpreadsheet size={18} className="text-[#95B877]" />
            Auto-detectar Scoping
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#0D0D0F] text-[#A1A1A6]">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Upload Area */}
          {!result && (
            <>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragging
                    ? 'border-[#95B877] bg-[#95B877]/5'
                    : 'border-[rgba(255,255,255,0.08)] hover:border-[#95B877]/50'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <Upload size={32} className="mx-auto mb-3 text-[#A1A1A6]" />
                <p className="text-sm font-medium text-[#F5F5F7] mb-1">
                  Arrastra un archivo CSV o Excel
                </p>
                <p className="text-xs text-[#A1A1A6] mb-4">
                  CSV, TSV, XLSX, XLS (se analizará hasta 100k filas)
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#95B877] text-white text-sm font-medium cursor-pointer hover:bg-[#95B877]/90 transition-colors">
                  <Upload size={14} />
                  Seleccionar archivo
                  <input type="file" accept=".csv,.tsv,.xlsx,.xls" className="hidden" onChange={handleFileSelect} />
                </label>
                {file && (
                  <p className="mt-3 text-xs text-[#95B877] font-medium">
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3 border border-red-200">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg text-[#A1A1A6] hover:bg-[#0D0D0F] transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={analyzeFile}
                  disabled={!file || analyzing}
                  className="px-5 py-2 rounded-lg bg-[#95B877] text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#95B877]/90 transition-colors flex items-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    'Analizar archivo'
                  )}
                </button>
              </div>
            </>
          )}

          {/* Results */}
          {result && (
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-[#F5F5F7]">
                  <CheckCircle size={16} className="text-green-500" />
                  Analisis completado — {result.row_count.toLocaleString()} filas, {result.column_count} columnas
                </div>

                {/* Detected Params Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <ParamField label="Registros estimados" value={result.registros_estimados.toLocaleString()} confidence={result.confidence_scores.registros} bar={confidenceBar} />
                  <ParamField label="Fuentes de datos" value={result.fuentes_datos} confidence={result.confidence_scores.fuentes} bar={confidenceBar} />
                  <ParamField label="Nodo critico" value={result.nodo_critico || 'No detectado'} confidence={result.confidence_scores.nodo_critico} bar={confidenceBar} />
                  <ParamField label="Sucursales" value={result.sucursales} confidence={result.confidence_scores.sucursales} bar={confidenceBar} />
                  {result.erp_type && (
                    <ParamField label="Tipo ERP" value={result.erp_type} confidence={result.confidence_scores.erp_type} bar={confidenceBar} />
                  )}
                </div>

                {/* Column Preview */}
                {result.column_profile.length > 0 && (
                  <details className="rounded-lg border border-[rgba(255,255,255,0.08)] overflow-hidden">
                    <summary className="px-3 py-2 text-xs font-medium text-[#A1A1A6] cursor-pointer hover:bg-[#0D0D0F] transition-colors">
                      Columnas detectadas ({result.column_profile.length})
                    </summary>
                    <div className="max-h-40 overflow-y-auto border-t border-[rgba(255,255,255,0.08)]">
                      <table className="w-full text-xs">
                        <thead className="bg-[#0D0D0F]">
                          <tr>
                            <th className="text-left px-3 py-1.5 font-semibold text-[#A1A1A6]">Columna</th>
                            <th className="text-left px-3 py-1.5 font-semibold text-[#A1A1A6]">Tipo</th>
                            <th className="text-right px-3 py-1.5 font-semibold text-[#A1A1A6]">Nulls</th>
                            <th className="text-right px-3 py-1.5 font-semibold text-[#A1A1A6]">Unicos</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.column_profile.slice(0, 30).map((col) => (
                            <tr key={col.name} className="border-t border-[rgba(255,255,255,0.08)] hover:bg-[#0D0D0F]/50">
                              <td className="px-3 py-1 font-mono text-[#F5F5F7] truncate max-w-[200px]">{col.name}</td>
                              <td className="px-3 py-1 text-[#A1A1A6]">{col.dtype}</td>
                              <td className="px-3 py-1 text-right text-[#A1A1A6]">{col.null_pct}%</td>
                              <td className="px-3 py-1 text-right text-[#A1A1A6]">{col.unique_count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {result.column_profile.length > 30 && (
                        <p className="text-xs text-[#A1A1A6] px-3 py-1.5 text-center">
                          ...y {result.column_profile.length - 30} columnas mas
                        </p>
                      )}
                    </div>
                  </details>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-[rgba(255,255,255,0.08)]">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm rounded-lg text-[#A1A1A6] hover:bg-[#0D0D0F] transition-colors"
                >
                  Descartar
                </button>
                <button
                  onClick={applyResults}
                  className="px-5 py-2 rounded-lg bg-[#95B877] text-white text-sm font-semibold hover:bg-[#95B877]/90 transition-colors"
                >
                  Aplicar al Scoping
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ParamField({
  label,
  value,
  confidence,
  bar,
}: {
  label: string;
  value: string | number;
  confidence: number;
  bar: (score: number) => React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[rgba(255,255,255,0.08)] p-3 space-y-1.5">
      <div className="text-xs font-semibold uppercase tracking-wider text-[#A1A1A6]">{label}</div>
      <div className="text-base font-mono font-bold text-[#F5F5F7]">{value}</div>
      {bar(confidence)}
    </div>
  );
}
