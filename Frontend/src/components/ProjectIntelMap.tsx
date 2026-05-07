import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingDown, GitBranch, AlertTriangle, Info, ChevronRight } from 'lucide-react'
import { findingsDB, hypothesesDB, projectsDB } from '../lib/supabase'
import type { Finding, Hypothesis, Project } from '../lib/types'
import { Spinner } from './ui/Spinner'

// ─── Paleta de colores ────────────────────────────────────────────────
const SEVERITY_COLOR: Record<string, string> = {
  critico:     '#c05538',
  alto:        '#d4793a',
  medio:       '#c9a84c',
  bajo:        '#6b9c5a',
  oportunidad: '#4a7a9c',
}

const HYPO_COLOR: Record<string, string> = {
  planteada:      '#534ab7',
  en_validacion:  '#c9a84c',
  validada:       '#3e8c6a',
  refutada:       '#c05538',
  derivada:       '#7a6c4a',
}

const AREA_COLOR: Record<string, string> = {
  finanzas:     '#c05538',
  supply_chain: '#4a5c3a',
  operaciones:  '#534ab7',
  ventas:       '#0f6e56',
  logistica:    '#7a6c4a',
  rrhh:         '#6a4a7a',
  tecnologia:   '#2a5c7a',
  multi:        '#4a4a48',
}

// ─── Layout engine ────────────────────────────────────────────────────
const W = 960
const H = 580

function buildLayout(findings: Finding[], hypotheses: Hypothesis[]) {
  // Collect unique areas
  const areaSet = new Set<string>()
  findings.forEach(f => { if (f.area) areaSet.add(f.area.toLowerCase()) })
  if (areaSet.size === 0) areaSet.add('general')
  const areas = Array.from(areaSet)

  const areaNodes = areas.map((area, i) => ({
    id: `area-${area}`,
    label: area,
    kind: 'area' as const,
    x: (W / (areas.length + 1)) * (i + 1),
    y: 80,
    r: 36,
    color: AREA_COLOR[area] || '#4a4a48',
  }))

  // Findings per area
  const findingsByArea: Record<string, Finding[]> = {}
  areas.forEach(a => { findingsByArea[a] = [] })
  findings.forEach(f => {
    const a = (f.area || 'general').toLowerCase()
    if (!findingsByArea[a]) findingsByArea[a] = []
    findingsByArea[a].push(f)
  })

  const findingNodes = findings.map(f => {
    const area = (f.area || areas[0]).toLowerCase()
    const areaNode = areaNodes.find(a => a.id === `area-${area}`) || areaNodes[0]
    const siblings = findingsByArea[area] || [f]
    const idx = siblings.findIndex(s => s.id === f.id)
    const spread = siblings.length > 1 ? (idx - (siblings.length - 1) / 2) * 90 : 0
    const impact = f.economic_impact ?? 0
    const r = Math.min(30, Math.max(14, 14 + Math.log10(Math.max(impact, 1)) * 4))
    return {
      id: f.id,
      label: f.folio || 'H',
      sublabel: f.title,
      kind: 'finding' as const,
      x: areaNode.x + spread,
      y: 240 + (idx % 2) * 30,
      r,
      color: SEVERITY_COLOR[f.severity] || '#4a4a48',
      data: f,
      areaId: `area-${area}`,
    }
  })

  const hypoNodes = hypotheses.map(h => {
    const parentFinding = findingNodes.find(fn => {
      const fData = fn.data as Finding
      return fData.area?.toLowerCase() === h.area?.toLowerCase()
    })
    const siblings = hypotheses.filter(hh => hh.parent_hypothesis_id === h.parent_hypothesis_id)
    const idx = siblings.findIndex(s => s.id === h.id)
    const spread = siblings.length > 1 ? (idx - (siblings.length - 1) / 2) * 70 : 0
    const baseX = parentFinding ? parentFinding.x : W / 2
    return {
      id: h.id,
      label: `Hi-${String(hypotheses.indexOf(h) + 1).padStart(2, '0')}`,
      sublabel: h.statement,
      kind: 'hypothesis' as const,
      x: baseX + spread,
      y: 430 + (idx % 2) * 25,
      r: 12,
      color: HYPO_COLOR[h.status] || '#534ab7',
      data: h,
      parentHypoId: h.parent_hypothesis_id,
      areaFindingId: parentFinding?.id,
    }
  })

  // Edges
  const edges: { from: { x: number; y: number }; to: { x: number; y: number }; style: 'solid' | 'dashed' | 'dotted' }[] = []

  findingNodes.forEach(fn => {
    const area = areaNodes.find(a => a.id === fn.areaId)
    if (area) edges.push({ from: { x: area.x, y: area.y }, to: { x: fn.x, y: fn.y }, style: 'solid' })
  })

  hypoNodes.forEach(hn => {
    if (hn.parentHypoId) {
      const parent = hypoNodes.find(h => h.id === hn.parentHypoId)
      if (parent) edges.push({ from: { x: parent.x, y: parent.y }, to: { x: hn.x, y: hn.y }, style: 'dashed' })
    } else if (hn.areaFindingId) {
      const fn = findingNodes.find(f => f.id === hn.areaFindingId)
      if (fn) edges.push({ from: { x: fn.x, y: fn.y }, to: { x: hn.x, y: hn.y }, style: 'dotted' })
    }
  })

  return { areaNodes, findingNodes, hypoNodes, edges }
}

// ─── Detail Panel ─────────────────────────────────────────────────────
function DetailPanel({ node, onClose }: { node: any; onClose: () => void }) {
  if (!node) return null
  const f: Finding | null = node.kind === 'finding' ? node.data : null
  const h: Hypothesis | null = node.kind === 'hypothesis' ? node.data : null

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: 'spring', damping: 24, stiffness: 260 }}
      className="w-80 flex-shrink-0 bg-white border-l border-eva-border flex flex-col overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-eva-border sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          {node.kind === 'finding' ? <AlertTriangle size={14} className="text-eva-gold" /> : <GitBranch size={14} className="text-architecture" />}
          <span className="text-[11px] font-mono font-black uppercase tracking-widest text-eva-txt-faint">
            {node.kind === 'finding' ? 'Hallazgo' : 'Hipótesis'}
          </span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-eva-beige-2 transition-colors">
          <X size={14} className="text-eva-txt-muted" />
        </button>
      </div>

      <div className="p-5 space-y-5 flex-1">
        {/* Badge label */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black" style={{ background: node.color }}>
            {node.label}
          </div>
          <div>
            <p className="text-[13px] font-ui font-semibold text-eva-black leading-tight">
              {f?.title || h?.statement?.slice(0, 60)}
            </p>
            {f && (
              <span className="text-[10px] font-mono uppercase text-eva-txt-faint">{f.severity}</span>
            )}
          </div>
        </div>

        {f && (
          <>
            {f.economic_impact && (
              <div className="bg-eva-beige-2 rounded-xl p-4">
                <p className="text-[9px] font-mono uppercase tracking-widest text-eva-txt-faint mb-1">Impacto Económico</p>
                <p className="text-xl font-brand font-bold text-eva-black">
                  {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(f.economic_impact)}
                  <span className="text-xs text-eva-txt-faint ml-1">/ año</span>
                </p>
                {f.economic_impact_basis && (
                  <p className="text-[11px] text-eva-txt-muted mt-1">{f.economic_impact_basis}</p>
                )}
              </div>
            )}
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-eva-txt-faint mb-1">Descripción</p>
                <p className="text-[12px] font-ui text-eva-txt-mid leading-relaxed">{f.description}</p>
              </div>
              {f.recommended_action && (
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-eva-txt-faint mb-1">Acción Recomendada</p>
                  <p className="text-[12px] font-ui text-eva-txt-mid leading-relaxed">{f.recommended_action}</p>
                </div>
              )}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-mono text-eva-txt-faint">Estado</span>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-eva-beige-2 text-eva-txt-mid">{f.status}</span>
              </div>
            </div>
          </>
        )}

        {h && (
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-eva-txt-faint mb-1">Hipótesis Completa</p>
              <p className="text-[12px] font-ui text-eva-txt-mid leading-relaxed">{h.statement}</p>
            </div>
            {h.evidence && (
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-eva-txt-faint mb-1">Evidencia</p>
                <p className="text-[12px] font-ui text-eva-txt-mid leading-relaxed">{h.evidence}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-eva-beige-2 rounded-lg p-3">
                <p className="text-[9px] font-mono uppercase tracking-widest text-eva-txt-faint mb-0.5">Tipo</p>
                <p className="text-[11px] font-ui font-semibold text-eva-black capitalize">{h.hypothesis_type?.replace('_', ' ')}</p>
              </div>
              <div className="bg-eva-beige-2 rounded-lg p-3">
                <p className="text-[9px] font-mono uppercase tracking-widest text-eva-txt-faint mb-0.5">Estado</p>
                <p className="text-[11px] font-ui font-semibold capitalize" style={{ color: HYPO_COLOR[h.status] }}>{h.status}</p>
              </div>
            </div>
            {h.framework_used && (
              <p className="text-[10px] font-mono text-eva-txt-faint">Framework: <span className="text-eva-txt-mid">{h.framework_used}</span></p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Legend ───────────────────────────────────────────────────────────
function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-mono text-eva-txt-faint">
      {[
        { label: 'Área', shape: 'hex', color: '#4a5c3a' },
        { label: 'Crítico', shape: 'circle', color: '#c05538' },
        { label: 'Alto', shape: 'circle', color: '#d4793a' },
        { label: 'Medio', shape: 'circle', color: '#c9a84c' },
        { label: 'Hipótesis', shape: 'small', color: '#534ab7' },
        { label: 'Validada', shape: 'small', color: '#3e8c6a' },
      ].map(item => (
        <div key={item.label} className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 14 14">
            {item.shape === 'hex'
              ? <polygon points="7,1 13,4 13,10 7,13 1,10 1,4" fill={item.color} opacity="0.8" />
              : item.shape === 'small'
                ? <circle cx="7" cy="7" r="4" fill={item.color} opacity="0.8" />
                : <circle cx="7" cy="7" r="6" fill={item.color} opacity="0.8" />
            }
          </svg>
          <span className="uppercase tracking-wider">{item.label}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5">
        <svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke="#9ca3af" strokeWidth="1.5" /></svg>
        <span>Pertenece</span>
      </div>
      <div className="flex items-center gap-1.5">
        <svg width="24" height="8"><line x1="0" y1="4" x2="24" y2="4" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="4 3" /></svg>
        <span>Deriva</span>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────
interface ProjectIntelMapProps {
  projects: Project[]
}

export default function ProjectIntelMap({ projects }: ProjectIntelMapProps) {
  const [selectedId, setSelectedId] = useState<string>(projects[0]?.id || '')
  const [findings, setFindings] = useState<Finding[]>([])
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    if (!selectedId) return
    setLoading(true)
    setSelectedNode(null)
    Promise.all([
      findingsDB.getByProject(selectedId),
      hypothesesDB.getByProject(selectedId),
    ]).then(([fRes, hRes]) => {
      setFindings((fRes.data || []) as Finding[])
      setHypotheses((hRes.data || []) as Hypothesis[])
    }).finally(() => setLoading(false))
  }, [selectedId])

  const filteredFindings = useMemo(() =>
    findings.filter(f =>
      filterSeverity === 'all' || f.severity === filterSeverity
    ), [findings, filterSeverity])

  const filteredHypos = useMemo(() =>
    hypotheses.filter(h =>
      filterStatus === 'all' || h.status === filterStatus
    ), [hypotheses, filterStatus])

  const { areaNodes, findingNodes, hypoNodes, edges } = useMemo(
    () => buildLayout(filteredFindings, filteredHypos),
    [filteredFindings, filteredHypos]
  )

  const selectedProject = projects.find(p => p.id === selectedId)

  return (
    <div className="flex flex-col h-full">
      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Project selector */}
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          className="h-9 px-3 rounded-lg border border-eva-border text-[12px] font-ui text-eva-black bg-white focus:border-eva-olive outline-none"
        >
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <div className="w-px h-5 bg-eva-border" />

        {/* Severity filter */}
        <select
          value={filterSeverity}
          onChange={e => setFilterSeverity(e.target.value)}
          className="h-9 px-3 rounded-lg border border-eva-border text-[11px] font-mono bg-white text-eva-txt-mid focus:border-eva-olive outline-none uppercase tracking-wider"
        >
          <option value="all">Todos los hallazgos</option>
          <option value="critico">Solo Críticos</option>
          <option value="alto">Alto+</option>
          <option value="medio">Medio+</option>
        </select>

        {/* Hypo status filter */}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="h-9 px-3 rounded-lg border border-eva-border text-[11px] font-mono bg-white text-eva-txt-mid focus:border-eva-olive outline-none uppercase tracking-wider"
        >
          <option value="all">Todas las hipótesis</option>
          <option value="validada">Validadas</option>
          <option value="planteada">Planteadas</option>
          <option value="en_validacion">En validación</option>
        </select>

        <div className="ml-auto flex items-center gap-3 text-[11px] font-mono text-eva-txt-faint">
          <span><span className="text-eva-black font-bold">{filteredFindings.length}</span> hallazgos</span>
          <span><span className="text-eva-black font-bold">{filteredHypos.length}</span> hipótesis</span>
          {selectedProject && (
            <span className="px-2 py-0.5 rounded-full bg-eva-olive/10 text-eva-olive font-bold uppercase">
              {selectedProject.area.replace('_', ' ')}
            </span>
          )}
        </div>
      </div>

      {/* Canvas + Detail Panel */}
      <div className="flex flex-1 rounded-xl border border-eva-border overflow-hidden bg-[#fafaf8] min-h-[520px]">
        {/* SVG Canvas */}
        <div className="flex-1 relative overflow-hidden">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : findings.length === 0 && hypotheses.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-eva-txt-muted">
              <Info size={32} className="opacity-30" />
              <p className="text-sm">Este proyecto no tiene hallazgos ni hipótesis registradas aún.</p>
            </div>
          ) : (
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full h-full"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
                </filter>
                <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="0" stdDeviation="6" floodOpacity="0.35" floodColor="currentColor" />
                </filter>
              </defs>

              {/* Layer labels */}
              <text x="16" y="88" fontSize="9" fill="#9ca3af" fontWeight="700" letterSpacing="2" textAnchor="start" style={{ textTransform: 'uppercase' }}>ÁREAS</text>
              <text x="16" y="258" fontSize="9" fill="#9ca3af" fontWeight="700" letterSpacing="2" textAnchor="start" style={{ textTransform: 'uppercase' }}>HALLAZGOS</text>
              <text x="16" y="445" fontSize="9" fill="#9ca3af" fontWeight="700" letterSpacing="2" textAnchor="start" style={{ textTransform: 'uppercase' }}>HIPÓTESIS</text>

              {/* Layer dividers */}
              <line x1="50" y1="160" x2={W - 20} y2="160" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50" y1="370" x2={W - 20} y2="370" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />

              {/* Edges */}
              {edges.map((e, i) => (
                <line
                  key={i}
                  x1={e.from.x} y1={e.from.y}
                  x2={e.to.x} y2={e.to.y}
                  stroke={e.style === 'dotted' ? '#c9a84c' : '#9ca3af'}
                  strokeWidth={e.style === 'solid' ? 2 : 1.5}
                  strokeDasharray={e.style === 'dashed' ? '5 4' : e.style === 'dotted' ? '2 3' : undefined}
                  strokeOpacity="0.5"
                />
              ))}

              {/* Area nodes — hexagon shape */}
              {areaNodes.map(node => {
                const r = node.r
                const pts = Array.from({ length: 6 }, (_, i) => {
                  const a = (Math.PI / 180) * (60 * i - 30)
                  return `${node.x + r * Math.cos(a)},${node.y + r * Math.sin(a)}`
                }).join(' ')
                return (
                  <g key={node.id} style={{ cursor: 'default' }}>
                    <polygon points={pts} fill={node.color} opacity="0.15" />
                    <polygon points={pts} fill="none" stroke={node.color} strokeWidth="2" />
                    <text x={node.x} y={node.y + 1} fontSize="10" fill={node.color} fontWeight="800"
                      textAnchor="middle" dominantBaseline="middle" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {node.label.slice(0, 10)}
                    </text>
                  </g>
                )
              })}

              {/* Finding nodes */}
              {findingNodes.map(node => (
                <g
                  key={node.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                >
                  <circle cx={node.x} cy={node.y} r={node.r + 4} fill={node.color} opacity="0.08" />
                  <circle
                    cx={node.x} cy={node.y} r={node.r}
                    fill={node.color}
                    stroke={selectedNode?.id === node.id ? '#fff' : node.color}
                    strokeWidth={selectedNode?.id === node.id ? 3 : 1.5}
                    filter={selectedNode?.id === node.id ? 'url(#shadow)' : undefined}
                  />
                  <text x={node.x} y={node.y + 1} fontSize="9" fill="#fff" fontWeight="800"
                    textAnchor="middle" dominantBaseline="middle">
                    {node.label}
                  </text>
                  <text x={node.x} y={node.y + node.r + 12} fontSize="9" fill="#6b7280"
                    textAnchor="middle" dominantBaseline="middle">
                    {node.sublabel?.slice(0, 18)}{node.sublabel && node.sublabel.length > 18 ? '…' : ''}
                  </text>
                </g>
              ))}

              {/* Hypothesis nodes */}
              {hypoNodes.map(node => (
                <g
                  key={node.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                >
                  <circle cx={node.x} cy={node.y} r={node.r + 3} fill={node.color} opacity="0.08" />
                  <circle
                    cx={node.x} cy={node.y} r={node.r}
                    fill={node.color}
                    stroke={selectedNode?.id === node.id ? '#fff' : node.color}
                    strokeWidth={selectedNode?.id === node.id ? 2.5 : 1}
                    filter={selectedNode?.id === node.id ? 'url(#shadow)' : undefined}
                  />
                  <text x={node.x} y={node.y + 1} fontSize="7" fill="#fff" fontWeight="800"
                    textAnchor="middle" dominantBaseline="middle">
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          )}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selectedNode && (
            <DetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="mt-3 px-1">
        <Legend />
      </div>
    </div>
  )
}
