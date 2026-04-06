import { useState } from 'react'
import GraphVisualizer from '../components/GraphVisualizer'

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
  "    %% Debate multi-agente",
  "    Process -.->|\"Friccion Operativa\"| Financial",
  "    DataEng -.->|\"Viabilidad de Datos\"| Financial",
  "",
  "    %% Consenso: convergencia de los 3 agentes",
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
  "  %% Flujo principal",
  "  Start --> Router",
  "  Router --> Agentes",
  "",
  "  %% Agentes consultan herramientas como tools iterativas",
  "  Financial -.-> RAG",
  "  Financial -.-> Sandbox",
  "  Process -.-> RAG",
  "  Process -.-> Sandbox",
  "  DataEng -.-> RAG",
  "  DataEng -.-> Sandbox",
  "",
  "  %% Del consenso al evaluador",
  "  Consenso --> Grader",
  "",
  "  %% Ciclo de rechazo",
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
  {
    step: "01",
    title: "Input Consultor",
    detail: "El SCQA define el problema real del negocio. Nunca se aceptan datos pre-masticados — el árbol de hipótesis MECE nace aquí y todo el flujo arranca desde este punto.",
    tag: "Cognición Humana",
  },
  {
    step: "02",
    title: "Enrutador Determinista",
    detail: "Asigna el trabajo al Enjambre de Agentes. Ya no bifurca entre RAG y Sandbox — los agentes son los que deciden cuándo consultar cada herramienta.",
    tag: "Asignación",
  },
  {
    step: "03",
    title: "Enjambre de Agentes",
    detail: "Financial, Process y Data Engineer trabajan en paralelo. Consultan iterativamente al Motor RAG para metodología y al Sandbox para cálculos. Flechas punteadas cruzadas = debate interno entre agentes.",
    tag: "LangGraph",
  },
  {
    step: "04",
    title: "Debate Multi-Agente",
    detail: "Process Agent envía 'Fricción Operativa' al Financial. Data Engineer envía 'Viabilidad de Datos'. Esto asegura que el análisis financiero integre restricciones reales de datos y operación.",
    tag: "Debate Interno",
  },
  {
    step: "05",
    title: "Consenso del Enjambre",
    detail: "Nodo de convergencia: unifica los resultados de los 3 agentes en una sola salida coherente. Solo este dictamen unificado va al Grader — nunca un agente suelto.",
    tag: "Convergencia",
  },
  {
    step: "06",
    title: "Grader (Self-RAG)",
    detail: "Si detecta alucinación o datos insuficientes, rechaza todo el Consenso (no solo un agente) y devuelve al Enjambre para re-análisis. Solo si valida, pasa al Synthesizer.",
    tag: "Anti-Alucinación",
  },
  {
    step: "07",
    title: "Synthesizer",
    detail: "Genera JSON determinista con hallazgos, confianza y fuentes. Estructura los datos para inyección directa en la plantilla corporativa via PyMuPDF.",
    tag: "PDF",
  },
  {
    step: "08",
    title: "Dictamen Forense",
    detail: "Entregable final: declaración de impacto con datos matemáticos validados. El Socio Director ejecuta la presentación de choque y expone el Costo de Inacción real.",
    tag: "Choque",
  },
]

const COLORS = {
  input: "#5a6b48",
  router: "#4a3220",
  sandbox: "#a1442f",
  agent: "#3e5e82",
  grader: "#4a4a48",
  synth: "#6b42c6",
  final: "#1e5237",
}

const TAG_COLORS: Record<string, string> = {
  "Cognición Humana": COLORS.input,
  "Asignación": COLORS.router,
  "Mandato PED": COLORS.sandbox,
  "LangGraph": COLORS.agent,
  "Debate Interno": COLORS.agent,
  "Convergencia": COLORS.grader,
  "Anti-Alucinación": COLORS.grader,
  "PDF": COLORS.synth,
  "Choque": COLORS.final,
}

export default function GraphPage() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="space-y-1">
        <h1>Arquitectura EIP</h1>
        <p className="max-w-xl">
          Protocolo de Ejecución Determinista — Máquina de estados con ciclos de evaluación estocástica.
        </p>
      </section>

      {/* Graph + Side panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph (2/3) */}
        <div className="lg:col-span-2 glass-strong rounded-card border border-white/[0.10] p-8">
          <div className="min-h-[500px]">
            <GraphVisualizer mermaid={EIP_ARCHITECTURE_MERMAID} />
          </div>
        </div>

        {/* Side panel (1/3) */}
        <div className="lg:col-span-1 space-y-4">
          {FLOW_STEPS.map((step, i) => {
            const active = i === activeStep
            const tagColor = TAG_COLORS[step.tag] || ""
            return (
              <button
                key={step.step}
                onClick={() => setActiveStep(i)}
                className={`w-full text-left rounded-card p-4 transition-all border cursor-pointer ${
                  active
                    ? "bg-white/[0.10] border-white/[0.25] ring-1 ring-white/10"
                    : "bg-white/[0.03] border-transparent hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: tagColor }}
                  >
                    {step.step}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-content-primary font-medium">{step.title}</span>
                      <span
                        className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium"
                        style={{
                          backgroundColor: tagColor + "22",
                          color: tagColor,
                        }}
                      >
                        {step.tag}
                      </span>
                    </div>
                    {active && (
                      <p className="text-xs text-content-tertiary mt-2 leading-relaxed">
                        {step.detail}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
