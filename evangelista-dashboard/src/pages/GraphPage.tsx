import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Map } from 'lucide-react'
import GraphVisualizer from '../components/GraphVisualizer'
import ProjectIntelMap from '../components/ProjectIntelMap'
import { projectsDB } from '../lib/supabase'
import type { Project } from '../lib/types'
import { Spinner } from '../components/ui/Spinner'

// ─── EIP Architecture definition (unchanged) ──────────────────────────
const EIP_ARCHITECTURE_MERMAID = [
  "flowchart TD",
  "",
  "  Start([\"Input Consultor\"])",
  "  Router{\"Enrutador\"}",
  "",
  "  subgraph Agentes[\" Enjambre de Agentes \"]",
  "    Financial[\"Financial Agent\"]",
  "    Process[\"Process Agent\"]",
  "    DataEng[\"Data Engineer\"]",
  "",
  "    Process -.->|\"Friccion Operativa\"| Financial",
  "    DataEng -.->|\"Viabilidad de Datos\"| Financial",
  "",
  "    Consenso{\"Consenso<br/>del Enjambre\"}",
  "    Financial --> Consenso",
  "    Process --> Consenso",
  "    DataEng --> Consenso",
  "  end",
  "",
  "  subgraph RAG[\" Motor RAG \"]",
  "    Embed[\"Embeddings\"]",
  "    Qdrant[\"Vector DB\"]",
  "    Vault[\"Contexto\"]",
  "    Embed -.-> Qdrant -.-> Vault",
  "  end",
  "",
  "  subgraph Sandbox[\" Sandbox Matematico \"]",
  "    Monte[\"Monte Carlo\"]",
  "    TTS[\"Text-to-SQL\"]",
  "  end",
  "",
  "  Grader{\"Grader\"}",
  "  Synthesizer[\"Synthesizer\"]",
  "  Final([\"Dictamen Forense\"])",
  "",
  "  Start --> Router",
  "  Router --> Agentes",
  "",
  "  Financial -.-> RAG",
  "  Financial -.-> Sandbox",
  "  Process -.-> RAG",
  "  Process -.-> Sandbox",
  "  DataEng -.-> RAG",
  "  DataEng -.-> Sandbox",
  "",
  "  Consenso --> Grader",
  "  Grader -->|\"Rechazo\"| Agentes",
  "  Grader -->|\"Validado\"| Synthesizer",
  "  Synthesizer --> Final",
  "",
  "  style Agentes stroke:#4a6b9a,stroke-width:2px,fill:none",
  "  style RAG stroke-dasharray:5 5,stroke:#666,fill:none",
  "  style Sandbox stroke-dasharray:5 5,stroke:#666,fill:none",
  "  style Consenso fill:#4a4a48,stroke:#6b6b68,stroke-width:2px,color:#fff",
  "",
  "  classDef input fill:#5a6b48,stroke:#6b7d5a,stroke-width:2px,color:#fff",
  "  classDef router fill:#4a3220,stroke:#5e4030,stroke-width:2px,color:#fff",
  "  classDef agent fill:#3e5e82,stroke:#4a6b9a,stroke-width:2px,color:#fff",
  "  classDef grader fill:#4a4a48,stroke:#6b6b68,stroke-width:2px,color:#fff",
  "  classDef synth fill:#6b42c6,stroke:#7c3aed,stroke-width:2px,color:#fff",
  "  classDef final fill:#1e5237,stroke:#1b4332,stroke-width:2px,color:#fff",
  "  class Start input",
  "  class Router router",
  "  class Financial,Process,DataEng agent",
  "  class Grader grader",
  "  class Synthesizer synth",
  "  class Final final",
].join("\n")

const FLOW_STEPS = [
  { step: "01", title: "Input Consultor",       tag: "Cognición",      color: "#5a6b48", detail: "El SCQA define el problema real del negocio. El árbol de hipótesis MECE nace aquí. Todo el flujo arranca desde este punto." },
  { step: "02", title: "Enrutador Determinista", tag: "Asignación",     color: "#4a3220", detail: "Asigna el trabajo al Enjambre de Agentes. Los agentes deciden cuándo consultar cada herramienta." },
  { step: "03", title: "Enjambre de Agentes",   tag: "LangGraph",      color: "#3e5e82", detail: "Financial, Process y Data Engineer trabajan en paralelo. Consultan al Motor RAG y al Sandbox de forma iterativa." },
  { step: "04", title: "Debate Multi-Agente",   tag: "Debate",         color: "#3e5e82", detail: "Process envía 'Fricción Operativa' al Financial. DataEng envía 'Viabilidad de Datos'. El análisis integra restricciones reales." },
  { step: "05", title: "Consenso del Enjambre", tag: "Convergencia",   color: "#4a4a48", detail: "Nodo de convergencia: unifica los 3 agentes. Solo este dictamen unificado va al Grader." },
  { step: "06", title: "Grader (Self-RAG)",     tag: "Anti-Alucinación", color: "#4a4a48", detail: "Detecta alucinaciones o datos insuficientes. Rechaza el Consenso completo y devuelve al Enjambre." },
  { step: "07", title: "Synthesizer",           tag: "Estructuración", color: "#6b42c6", detail: "Genera JSON determinista con hallazgos, confianza y fuentes. Estructura los datos para el dictamen corporativo." },
  { step: "08", title: "Dictamen Forense",      tag: "Choque",         color: "#1e5237", detail: "Entregable final con datos matemáticamente validados. El Socio Director presenta el Costo de Inacción real." },
]

type Mode = 'arquitectura' | 'proyecto'

export default function GraphPage() {
  const [mode, setMode] = useState<Mode>('arquitectura')
  const [activeStep, setActiveStep] = useState(0)
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)

  useEffect(() => {
    if (mode === 'proyecto' && projects.length === 0) {
      setLoadingProjects(true)
      projectsDB.list()
        .then(data => setProjects(data as Project[]))
        .catch(console.error)
        .finally(() => setLoadingProjects(false))
    }
  }, [mode])

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Page Header ── */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={13} className="text-eva-olive" />
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-eva-txt-muted">
              Intelligence Graph
            </span>
          </div>
          <h1 className="font-brand text-3xl font-medium text-eva-black leading-tight">
            {mode === 'arquitectura' ? 'Arquitectura EIP' : 'Mapa de Proyecto'}
          </h1>
          <p className="font-ui text-sm text-eva-txt-muted mt-1">
            {mode === 'arquitectura'
              ? 'Protocolo de Ejecución Determinista — Máquina de estados con ciclos de evaluación estocástica.'
              : 'Visualización de dependencias entre hallazgos e hipótesis de un proyecto activo.'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center bg-eva-beige-2 p-1 rounded-xl border border-eva-border gap-1 self-start md:self-auto">
          {([
            { key: 'arquitectura', label: 'Arquitectura EIP', icon: Cpu },
            { key: 'proyecto',     label: 'Mapa de Proyecto', icon: Map },
          ] as { key: Mode; label: string; icon: any }[]).map(item => {
            const isActive = mode === item.key
            return (
              <button
                key={item.key}
                onClick={() => setMode(item.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-ui font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-eva-black shadow-sm border border-eva-border'
                    : 'text-eva-txt-muted hover:text-eva-black'
                }`}
              >
                <item.icon size={13} className={isActive ? 'text-eva-olive' : ''} />
                {item.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Content ── */}
      <AnimatePresence mode="wait">

        {/* MODO 1: Arquitectura EIP */}
        {mode === 'arquitectura' && (
          <motion.div
            key="arquitectura"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Graph — 2/3 */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-eva-border shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-eva-border">
                <div className="flex items-center gap-2">
                  <Cpu size={13} className="text-eva-olive" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-eva-txt-faint">
                    EIP · LangGraph Architecture
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-eva-txt-faint">Live</span>
                </div>
              </div>
              <div className="min-h-[500px]">
                <GraphVisualizer mermaid={EIP_ARCHITECTURE_MERMAID} />
              </div>
            </div>

            {/* Side panel — 1/3 */}
            <div className="lg:col-span-1 space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-eva-txt-faint px-1 mb-3">
                Flujo de Ejecución · 8 Etapas
              </p>
              {FLOW_STEPS.map((step, i) => {
                const active = i === activeStep
                return (
                  <button
                    key={step.step}
                    onClick={() => setActiveStep(i)}
                    className={`w-full text-left rounded-xl p-4 transition-all duration-200 border ${
                      active
                        ? 'bg-white border-eva-border shadow-sm'
                        : 'bg-eva-beige-2/40 border-transparent hover:bg-white hover:border-eva-border'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-0.5 h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0"
                        style={{ backgroundColor: step.color }}
                      >
                        {step.step}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[13px] font-ui font-semibold text-eva-black">{step.title}</span>
                          <span
                            className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold"
                            style={{ backgroundColor: step.color + '18', color: step.color }}
                          >
                            {step.tag}
                          </span>
                        </div>
                        <AnimatePresence>
                          {active && (
                            <motion.p
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="text-[11px] font-ui text-eva-txt-mid mt-2 leading-relaxed overflow-hidden"
                            >
                              {step.detail}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* MODO 2: Mapa de Proyecto */}
        {mode === 'proyecto' && (
          <motion.div
            key="proyecto"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl border border-eva-border shadow-sm p-5"
          >
            {loadingProjects ? (
              <div className="py-24 flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : projects.length === 0 ? (
              <div className="py-24 text-center text-eva-txt-muted text-sm">
                No hay proyectos activos. Crea un proyecto desde la Cartera Fiducia.
              </div>
            ) : (
              <ProjectIntelMap projects={projects} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
