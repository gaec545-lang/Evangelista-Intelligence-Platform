import { useState, useEffect } from 'react';
import { FileText, Download, Filter, CheckCircle, AlertCircle, Loader2, Search } from 'lucide-react';
import Panel from '../components/ui/Panel';

// ── Types ──────────────────────────────────────────────────────────────────

interface Template {
  id: string;
  name: string;
  family: 'foundation' | 'architecture' | 'commercial';
  description: string;
  formats: string[];
  variables: string[];
  phase: string;
}

interface GenerateForm {
  [key: string]: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const FAMILY_META = {
  foundation: {
    label: 'Foundation',
    color: 'text-service-foundation',
    bg: 'bg-service-foundation/10',
    border: 'border-service-foundation/20',
    dot: 'bg-service-foundation',
  },
  architecture: {
    label: 'Architecture',
    color: 'text-service-architecture',
    bg: 'bg-service-architecture/10',
    border: 'border-service-architecture/20',
    dot: 'bg-service-architecture',
  },
  commercial: {
    label: 'Comercial',
    color: 'text-eva-gold',
    bg: 'bg-eva-gold/10',
    border: 'border-eva-gold/20',
    dot: 'bg-eva-gold',
  },
};

const VAR_LABELS: Record<string, string> = {
  cliente_nombre: 'Nombre del Cliente',
  cliente_rfc: 'RFC del Cliente',
  representante_legal: 'Representante Legal',
  cliente_sector: 'Sector del Cliente',
  precio_foundation: 'Precio Foundation ($)',
  precio_architecture: 'Precio Architecture ($)',
  precio_tramo_a: 'Precio Tramo A ($)',
  precio_tramo_b: 'Precio Tramo B ($)',
  precio_tramo_c: 'Precio Tramo C ($)',
  fecha_propuesta: 'Fecha de la Propuesta',
  fecha_contrato: 'Fecha del Contrato',
  fecha_nda: 'Fecha del NDA',
  fecha_inicio: 'Fecha de Inicio del Proyecto',
  fecha_dictamen: 'Fecha del Dictamen',
  fecha_certificado: 'Fecha del Certificado',
  fecha_factura: 'Fecha de la Factura',
  fecha_entrega: 'Fecha de Entrega',
  lugar_firma: 'Lugar de Firma',
  consultor_nombre: 'Nombre del Consultor',
  cqa_nombre: 'Nombre del CQA Firmante',
  cliente_erp: 'Sistema ERP del Cliente',
  alcance_acordado: 'Alcance Acordado',
  num_dictamen: 'Número de Dictamen',
  num_tramo: 'Número de Tramo (A/B/C)',
  num_tramos: 'Número de Tramos',
  num_orden: 'Número de Orden',
  monto_foundation: 'Monto Foundation ($)',
  duracion_semanas: 'Duración en Semanas',
  entregables_tramo: 'Entregables del Tramo',
  factor_alpha: 'Factor α (Disponibilidad)',
  factor_beta: 'Factor β (Complejidad)',
  factor_gamma: 'Factor Γ (Entropía)',
  decision_go_nogo: 'Decisión Go / No-Go',
  justificacion: 'Justificación de la Decisión',
};

// ── Main Component ─────────────────────────────────────────────────────────

export function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Template | null>(null);
  const [form, setForm] = useState<GenerateForm>({});
  const [format, setFormat] = useState<'pdf' | 'docx'>('pdf');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('http://localhost:8001/api/templates/');
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch {
      // Fallback: mostrar ejemplos estáticos si el backend no responde
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (tpl: Template) => {
    setSelected(tpl);
    setResult(null);
    // Auto-llenar fecha de hoy
    const today = new Date().toLocaleDateString('es-MX', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    }).replace(/\//g, '/');
    const defaults: GenerateForm = {};
    tpl.variables.forEach(v => {
      if (v.startsWith('fecha_')) defaults[v] = today;
    });
    setForm(defaults);
    setFormat(tpl.formats.includes('pdf') ? 'pdf' : 'docx');
  };

  const handleGenerate = async () => {
    if (!selected) return;
    setGenerating(true);
    setResult(null);
    try {
      const res = await fetch(`http://localhost:8001/api/templates/${selected.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variables: form, format }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ success: true, message: `Documento "${selected.name}" generado correctamente. Variables validadas.` });
      } else {
        setResult({ success: false, message: data.detail || 'Error al generar el documento.' });
      }
    } catch {
      setResult({ success: false, message: 'No se pudo conectar con el servidor.' });
    } finally {
      setGenerating(false);
    }
  };

  const filtered = templates
    .filter(t => filter === 'all' || t.family === filter)
    .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()));

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex gap-6 h-full animate-fade-in">

      {/* LEFT PANEL: Catalog */}
      <div className="flex-1 space-y-5 overflow-y-auto pb-10">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-[1px] bg-eva-olive-3" />
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-eva-olive-3">Documentos Operativos</span>
          </div>
          <h1 className="font-brand text-3xl font-medium text-eva-black">Plantillas de la Firma</h1>
          <p className="font-ui text-[13px] text-eva-txt-muted mt-1">
            Genera documentos pre-llenados con datos del cliente. Listos para firmar o presentar.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-eva-txt-muted" />
            <input
              type="text"
              placeholder="Buscar plantilla..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white border border-eva-border rounded-lg text-[13px] font-ui focus:outline-none focus:border-eva-olive"
            />
          </div>
          {(['all', 'foundation', 'architecture', 'commercial'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-ui text-[12px] font-semibold transition-all border ${
                filter === f
                  ? 'bg-eva-black text-eva-beige border-eva-black'
                  : 'bg-white text-eva-txt-muted border-eva-border hover:border-eva-olive'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'commercial' ? 'Comercial' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-eva-olive" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-eva-txt-muted">
            <FileText size={40} className="mb-3 opacity-30" />
            <p className="font-ui text-[14px]">No se encontraron plantillas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map(tpl => {
              const meta = FAMILY_META[tpl.family];
              const isSelected = selected?.id === tpl.id;
              return (
                <button
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`text-left p-5 rounded-2xl border transition-all group ${
                    isSelected
                      ? `${meta.bg} ${meta.border} shadow-md`
                      : 'bg-white border-eva-border hover:border-eva-olive hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold uppercase tracking-wider ${meta.bg} ${meta.color}`}>
                      {meta.label}
                    </div>
                    <span className="font-mono text-[9px] text-eva-txt-faint">{tpl.id}</span>
                  </div>

                  <h3 className="font-ui text-[14px] font-semibold text-eva-black mb-1.5 group-hover:text-eva-olive transition-colors">
                    {tpl.name}
                  </h3>
                  <p className="font-ui text-[12px] text-eva-txt-muted leading-relaxed line-clamp-2 mb-3">
                    {tpl.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {tpl.formats.map(fmt => (
                        <span key={fmt} className="px-2 py-0.5 rounded-sm bg-eva-beige-2 text-[10px] font-mono text-eva-txt-muted uppercase">
                          {fmt}
                        </span>
                      ))}
                    </div>
                    <span className="font-mono text-[10px] text-eva-txt-faint">{tpl.phase}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* RIGHT PANEL: Generator */}
      <div className="w-[340px] shrink-0 border-l border-eva-border pl-6 overflow-y-auto pb-10">
        {!selected ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-eva-txt-muted py-20">
            <FileText size={48} className="mb-4 opacity-20" />
            <p className="font-ui text-[13px] leading-relaxed">
              Selecciona una plantilla del catálogo para configurar y descargar el documento.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <h3 className="font-brand text-[18px] font-medium text-eva-black">{selected.name}</h3>
              <p className="font-mono text-[10px] text-eva-txt-faint mt-0.5">{selected.id} · Fase: {selected.phase}</p>
            </div>

            {/* Format selector */}
            <div>
              <label className="block font-ui text-[11px] font-semibold text-eva-txt-mid mb-2 uppercase tracking-wider">
                Formato de Descarga
              </label>
              <div className="flex gap-2">
                {selected.formats.map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt as 'pdf' | 'docx')}
                    className={`flex-1 py-2 rounded-lg font-mono text-[11px] uppercase font-semibold border transition-all ${
                      format === fmt
                        ? 'bg-eva-black text-white border-eva-black'
                        : 'bg-white text-eva-txt-muted border-eva-border hover:border-eva-olive'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Variables */}
            <div className="space-y-3">
              <label className="block font-ui text-[11px] font-semibold text-eva-txt-mid uppercase tracking-wider">
                Variables del Documento
              </label>
              {selected.variables.map(v => (
                <div key={v}>
                  <label className="block font-ui text-[11px] text-eva-txt-muted mb-1">
                    {VAR_LABELS[v] || v}
                  </label>
                  <input
                    type="text"
                    value={form[v] || ''}
                    onChange={e => setForm(prev => ({ ...prev, [v]: e.target.value }))}
                    placeholder={VAR_LABELS[v] || v}
                    className="w-full px-3 py-2 bg-eva-beige border border-eva-border rounded-lg text-[12px] font-ui focus:outline-none focus:border-eva-olive transition-colors"
                  />
                </div>
              ))}
            </div>

            {/* Result */}
            {result && (
              <div className={`flex items-start gap-2.5 p-3.5 rounded-xl border text-[12px] font-ui ${
                result.success
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {result.success
                  ? <CheckCircle size={16} className="shrink-0 mt-0.5" />
                  : <AlertCircle size={16} className="shrink-0 mt-0.5" />
                }
                <span>{result.message}</span>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 bg-eva-black hover:bg-eva-olive text-eva-beige py-3 rounded-xl font-ui text-[13px] font-semibold transition-all duration-200 disabled:opacity-50"
            >
              {generating
                ? <><Loader2 size={16} className="animate-spin" /> Generando…</>
                : <><Download size={16} /> Generar y Descargar</>
              }
            </button>

            <p className="font-mono text-[9px] text-eva-txt-faint text-center leading-relaxed">
              El documento generado queda registrado<br />en el Expediente del cliente en Supabase.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
