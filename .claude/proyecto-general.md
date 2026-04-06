# Evangelista Intelligence Platform — Análisis General del Proyecto

## 1. Visión del Proyecto

**Evangelista Intelligence Platform (EIP)** es una plataforma de consultoría estratégica asistida por IA para pymes mexicanas. Combina un dashboard React, un backend orquestado con LangGraph (9 nodos RAG cíclicos), una base de datos vectorial Qdrant, almacenamiento PostgreSQL en Supabase, y un vault de conocimiento en Markdown con 119 documentos curados.

El flujo operativo es:
```
Usuario (Dashboard) → Consulta RAG → Router → Retrieval/Tools/Web
  → LLM Genera → Hallucination Check → Quality Check → Síntesis
  → Respuesta con confianza, fuentes e historial
```

### Puertos del ecosistema

| Servicio | Puerto | URL |
|---|---|---|
| Frontend Dashboard | **5174** | `http://localhost:5174` |
| Backend FastAPI | **8001** | `http://localhost:8001` |
| Qdrant (local) | **6333** | `localhost:6333` |
| Ollama (embeddings) | **11434** | `http://localhost:11434` |

---

## 2. Arquitectura de Alto Nivel

```
┌───────────────────────────────────────────────────────────────────┐
│              EVANGELISTA INTELLIGENCE PLATFORM                     │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌───────────────┐              ┌────────────────────────────┐   │
│  │   Dashboard    │── HTTP ────→│  Backend FastAPI + LangGraph│   │
│  │  React + Vite  │←── JSON ───│  Port 8001                   │   │
│  │  Port 5174     │              │  9 nodos cíclicos RAG       │   │
│  └───────────────┘              └──────────┬─────────────────┘   │
│         │                                  │                      │
│         │ CRUD vía Supabase JS             │ Qdrant local         │
│         ▼                                  ▼                      │
│  ┌───────────────┐              ┌────────────────────────────┐   │
│  │   Supabase     │              │  Qdrant Vector DB          │   │
│  │  PostgreSQL    │              │  ./qdrant_storage_v2       │   │
│  │  + Auth + Vault│              │  evangelista_knowledge     │   │
│  └───────────────┘              └────────────────────────────┘   │
│         │                                  │                      │
│         │ Vault pgsodium                   │ Archivos .md (119)  │
│         ▼                                  ▼                      │
│  ┌───────────────┐              ┌────────────────────────────┐   │
│  │  ERP Vaults    │              │  Evangelista-Obsidian      │   │
│  │  Zero-trust    │              │  Vault de conocimiento     │   │
│  │  read-only     │              │  Benchmarks, cases, etc.   │   │
│  └───────────────┘              └────────────────────────────┘   │
│                                                                    │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │  Servicios Externos                                        │   │
│  │  Groq (llama-3.3-70b)  •  Ollama (nomic-embed-text)       │   │
│  │  DuckDuckGo Search     •  Tavily Search                    │   │
│  └───────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 3. Módulo Frontend — `evangelista-dashboard/`

### 3.1. Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | React | 18.3.1 |
| Build | Vite | 5.4.1 |
| Lenguaje | TypeScript | 5.5.3 |
| Estilos | Tailwind CSS | 3.4.10 |
| Enrutamiento | React Router DOM | 6.26.0 |
| Estado global | Zustand | 5.0.0 |
| BD Cloud | @supabase/supabase-js | — |
| Animaciones | Framer Motion | — |
| Iconos | Lucide React | — |

### 3.2. Estructura de archivos

```
src/
├── App.tsx                          # Rutas principales (12 pages)
├── main.tsx                         # Entry point React
│
├── layouts/
│   ├── AppLayout.tsx                # Wrapper con estructura global
│   └── Sidebar.tsx                  # Navegación lateral
│
├── pages/                           # 12 páginas
│   ├── DashboardPage.tsx            # / — Stats, acciones rápidas, actividad reciente
│   ├── LoginPage.tsx                # /login — Auth email/password
│   ├── AnalyzePage.tsx              # /analyze — Selector de cliente + consulta RAG
│   ├── AgentsPage.tsx               # /agents — Grid de agentes disponibles
│   ├── AgentDetailPage.tsx          # /agents/:name — Detalle + ejecución manual
│   ├── ClientsPage.tsx              # /clients — Lista + búsqueda + CRUD modal
│   ├── ClientDetailPage.tsx         # /clients/:id — Perfil + KPIs + historial
│   ├── ProposalPage.tsx             # /proposals — Generador de propuestas
│   ├── KnowledgePage.tsx            # /knowledge — Búsqueda en vault
│   ├── GraphPage.tsx                # /graph — Visualización Mermaid del grafo
│   └── SettingsPage.tsx             # /settings — Health checks + info del sistema
│
├── components/
│   ├── ui/                          # Componentes base reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Spinner.tsx
│   │   ├── Counter.tsx
│   │   └── EmptyState.tsx
│   ├── AgentCard.tsx                # Tarjeta de agente en grid
│   ├── AnalysisHistory.tsx          # Panel lateral de historial (split view)
│   ├── AnalysisPanel.tsx            # Input de consulta RAG
│   ├── AnalysisResult.tsx           # Vista de resultado básico
│   ├── AnalysisResultV2.tsx         # Vista de resultado mejorada (layout)
│   ├── ClientForm.tsx               # Formulario CRUD de cliente
│   ├── ConfidenceBadge.tsx          # Indicador visual de confianza
│   ├── GraphVisualizer.tsx          # Renderizado de grafo Mermaid
│   ├── HistoryList.tsx              # Lista de historial
│   ├── MarkdownRenderer.tsx         # Markdown → HTML
│   ├── ProposalForm.tsx             # Constructor de propuestas
│   ├── SearchBar.tsx                # Barra de búsqueda de conocimiento
│   └── SubtaskTimeline.tsx          # Timeline de ejecución de agentes
│
├── hooks/                           # Custom React hooks
│   ├── useAgents.ts                 # Registro de agentes
│   ├── useAnalysis.ts               # Ejecución + historial de análisis
│   ├── useClients.ts                # CRUD de clientes
│   └── useHistory.ts                # Historial filtrable por cliente
│
├── stores/
│   └── authStore.ts                 # Zustand + Supabase Auth
│
└── lib/
    ├── api.ts                       # Wrapper HTTP hacia FastAPI (port 8001)
    ├── supabase.ts                  # Cliente + wrappers CRUD
    └── types.ts                     # Interfaces TypeScript
```

### 3.3. Rutas y Navegación (12 rutas)

| Ruta | Página | Descripción |
|---|---|---|
| `/` | DashboardPage | Panel principal — estadísticas, acciones rápidas, actividad reciente |
| `/login` | LoginPage | Autenticación email/password vía Supabase Auth |
| `/analyze` | AnalyzePage | Selector de cliente + campo de consulta + resultado RAG |
| `/agents` | AgentsPage | Grid de todos los agentes disponibles con dominios y tools |
| `/agents/:name` | AgentDetailPage | Detalle de un agente, ejecución manual, resultados |
| `/clients` | ClientsPage | Lista paginada + búsqueda + modal CRUD |
| `/clients/:id` | ClientDetailPage | Perfil de cliente con KPIs, factores γ/α/β, historial |
| `/proposals` | ProposalPage | Generador de propuestas (foundation/architecture) |
| `/knowledge` | KnowledgePage | Búsqueda textual en el vault de conocimiento |
| `/graph` | GraphPage | Visualización Mermaid del estado de ejecución del grafo |
| `/settings` | SettingsPage | Health checks, info del backend, estado de servicios |

### 3.4. Modelo de Datos Frontend (`src/lib/types.ts`)

**Client** — Representa una empresa cliente:
- Campos de contacto: name, sector, city, contact_name/email/phone
- Infraestructura: sucursales, sistemas_erp, erp_type
- Factores metodológicos: factor_gamma, factor_alpha, factor_beta
- Estado: vetting_status (pending/go/no_go), status (prospect/active/completed/archived)

**Analysis** — Registro de una ejecución del enjambre:
- task, execution_plan, final_response, confidence [0-1]
- subtasks[]: resumen por agente (nombre, estado, confianza)
- sources_used[], errors[], execution_time_ms, status

**Proposal** — Propuesta comercial:
- type: foundation o architecture
- pricing: ProposalPricing (foundation_fee, setup_fee, success_fee, γ/α/β)
- status: draft/sent/accepted/rejected

**AgentInfo** — Metadato de un agente: nombre, dominios, herramientas.

### 3.5. Capa de Autenticación (`authStore.ts`)

- Estado con **Zustand**, auth con **Supabase**
- `signIn(email, password)` → `supabase.auth.signInWithPassword()`
- `signOut()` → `supabase.auth.signOut()` + reset
- `initialize()` → `getSession()` + suscripción `onAuthStateChange` en tiempo real
- **Graceful degradation**: si `SUPABASE_CONFIGURED` es false, el store se inicializa sin error — la app funciona en modo offline

### 3.6. Capa de Datos Supabase (`supabase.ts`)

Tres wrappers con operaciones CRUD:

| Wrapper | Tabla | Operaciones |
|---|---|---|
| `clientsDB` | clients | list, get, create, update, delete |
| `analysesDB` | analyses | list(con/sin filtro clientId), create (con join a clients) |
| `proposalsDB` | proposals | list(clientId), create |

### 3.7. Comunicación con Backend (`api.ts`)

Wrapper HTTP que apunta a `http://localhost:8001`. Consume los endpoints de FastAPI para:
- Ejecutar análisis RAG
- Listar agentes
- Ejecutar agentes individuales
- Buscar conocimiento
- Obtener estado de grafo
- Generar propuestas

### 3.8. Componentes UI Base (`components/ui/`)

| Componente | Propósito |
|---|---|
| Button | Botón con variantes (primary, ghost, danger) y tamaños |
| Input | Campo de texto con estilos glass |
| Modal | Overlay con backdrop y contenido |
| Card | Contenedor con fondo y borde |
| Badge | Indicador con color semántico (success, warning, danger) |
| Spinner | Indicador de carga circular |
| Counter | Contador animado |
| EmptyState | Estado vacío con icono y mensaje |

---

## 4. Módulo Backend — `evangelista-rag/`

### 4.1. Stack tecnológico

| Capa | Tecnología | Versión/Config |
|---|---|---|
| Framework | FastAPI | 0.115 |
| Orquestación | LangGraph | 0.2 |
| Vector DB | Qdrant | 1.9+, modo local |
| Cloud DB | Supabase (PostgreSQL) | vía supabase-py |
| LLM Primario | Groq (llama-3.3-70b-versatile) | — |
| Embeddings | Ollama (nomic-embed-text) | dim=768 |
| Búsqueda Web | DuckDuckGo + Tavily | — |
| Fallback LLM | Anthropic (claude-sonnet-4-5) | — |
| Logging | Structlog | — |

### 4.2. Aplicación FastAPI (`src/api/server.py`)

**Lifespan management:**
- Startup: importa módulos de agentes para disparar auto-registro, luego `AgentRegistry.list_agents()` para log
- Shutdown: `close_qdrant_client()` para limpiar conexión

**Middleware:**
- CORS: permite `http://localhost:5174` con credentials
- RequestLoggingMiddleware: log de todas las peticiones

**Routers incluidos:**

| Router | Prefijo | Tag |
|---|---|---|
| health | `/` | Health |
| analyze | `/api/v1` | Analyze |
| graph_viz | `/api/v1` | Graph Visualization |
| agents | `/api/v1` | Agents |
| knowledge | `/api/v1` | Knowledge |
| proposals | `/api/v1` | Proposals |

### 4.3. Endpoints HTTP

| Método | Endpoint | Handler | Descripción |
|---|---|---|---|
| GET | `/readiness` | health | Verificación completa de todos los servicios |
| GET | `/health` | health | Heartbeat simple |
| POST | `/api/v1/analyze` | analyze | Ejecuta el grafo RAG completo |
| GET | `/api/v1/agents` | agents | Lista agentes disponibles |
| POST | `/api/v1/agents/{name}/execute` | agents | Ejecuta un agente específico |
| GET | `/api/v1/knowledge/search` | knowledge | Búsqueda en vault por query |
| GET | `/api/v1/graph/state/{id}` | graph_viz | Estado de ejecución + log Mermaid |
| POST | `/api/v1/proposals/generate` | proposals | Genera propuesta comercial |

### 4.4. Grafo LangGraph (`src/graph/`)

#### Estado (`state.py`) — `GraphState`

Modelo Pydantic con 30+ campos que viajan por todos los nodos:

| Categoría | Campos |
|---|---|
| Input | `question`, `context`, `thread_id` |
| Routing | `route`, `route_reasoning` |
| Retrieval | `documents[]`, `web_results[]` |
| CRAG | `relevant_documents[]`, `needs_web_search`, `crag_action`, `refined_query` |
| Tools | `tool_results{}` |
| Generation | `generation`, `generation_sources[]` |
| Self-Reflection | `hallucination_check`, `hallucination_reasoning`, `quality_check`, `quality_reasoning` |
| Synthesis | `final_response`, `confidence` |
| Meta | `current_node`, `node_history[]`, `retry_count`, `max_retries`, `errors[]`, `execution_time_ms` |
| Visualización | `mermaid_log[]` |

#### Nodos del grafo (9+ nodos)

| Nodo | Archivo | Función |
|---|---|---|
| **Router** | `nodes/router.py` | Decide la ruta: rag, tools, web, o multi |
| **Retriever** | `nodes/retriever.py` | Búsqueda vectorial en Qdrant |
| **Grader** | `nodes/grader.py` | CRAG — evalúa relevancia de documentos recuperados |
| **Generator** | `nodes/generator.py` | Genera respuesta con LLM |
| **HallucinationCheck** | `nodes/hallucination_check.py` | Auto-validación: ¿la respuesta está fundamentada? |
| **QualityCheck** | `nodes/quality_check.py` | ¿La respuesta es útil y responde la pregunta? |
| **Synthesizer** | `nodes/synthesizer.py` | Síntesis final con confianza y formato |
| **WebSearcher** | `nodes/web_searcher.py` | Búsqueda externa (DuckDuckGo/Tavily) |
| **ToolExecutor** | `nodes/tool_executor.py` | Ejecuta herramientas disponibles |
| **Consensus** | `nodes/consensus.py` | Consenso multi-agente |
| **AgentNodes** | `nodes/agent_nodes.py` | Ejecución de agentes (legacy/deprecado) |
| **EIP variants** | `nodes/eip_router.py`, `eip_grader.py`, `eip_synthesizer.py` | Versiones especializadas EIP |

#### Edges condicionales (6 funciones)

| Edge | Archivo | Decisión |
|---|---|---|
| `route_decision` | `edges/route_decision.py` | router → retriever / web_searcher / tool_executor |
| `grade_decision` | `edges/grade_decision.py` | grader → use_docs / web_search / refine_query |
| `hallucination_decision` | `edges/hallucination_decision.py` | check → retry generator / synthesize |
| `quality_decision` | `edges/quality_decision.py` | check → synthesize / retry retriever |
| `eip_distribute` | `edges/eip_distribute.py` | Distribución EIP multi-agente |
| `eip_grader_decision` | `edges/eip_grader_decision.py` | Grader EIP-specific |

#### Flujo de ejecución con ciclos

```
┌─ ROUTER ───────────────────────────────────────────────────┐
│  Decide: rag | tools | web | multi                          │
│                                                            │
│  ┌─ RAG PATH ───────────┐                                  │
│  │ Retriever → Grader ───┐                                  │
│  │   ├─ use_docs        │                                   │
│  │   ├─ web_search → WebSearcher → Grader ↺                │
│  │   └─ refine_query → Retriever ↺                          │
│  └─────────────────────────────────────┐                    │
│                                        ↓                    │
│  ┌─ TOOLS PATH ────────┐        GENERATOR                   │
│  │ ToolExecutor ──────→│            │                       │
│  └─────────────────────┘            ↓                       │
│                              HALLUCINATION_CHECK             │
│                           ┌─ grounded? ──────────┐          │
│                           │  No ↺ Generator       │ Yes     │
│                           │                       │         │
│                           │              QUALITY_CHECK       │
│                           │             ┌─ useful? ───┐      │
│                           │             │  No ↺ Retriever │
│                           │             │  Yes ↓          │
│                           │             │  SYNTHESIZER → END│
└──────────────────────────────────────────────────────────┘
```

**Ciclos controlados:**
1. Retriever → Grader → (no relevante) → Web Searcher → Grader → Generator
2. Generator → Hallucination Check → (hallucinada) → Generator [máx 2 retries]
3. Quality Check → (no útil) → Retriever [máx 2 retries]

#### Prompts YAML (`src/graph/prompts/`)

6 templates parametrizados:
- `router.yaml`, `grader.yaml`, `generator.yaml`
- `hallucination_checker.yaml`, `quality_checker.yaml`
- `synthesizer.yaml`

### 4.5. Agentes Especializados (`src/agents/`)

#### Registry (`registry.py`)

Registro dinámico con patrón singleton:
- `AgentRegistry.register(agent)` — agrega al diccionario
- `AgentRegistry.get(name)` — recupera por nombre
- `AgentRegistry.list_agents()` — lista nombres
- `AgentRegistry.get_agent_for_domain(domain)` — agentes por dominio
- Agregar un nuevo agente = 1 línea de import en `server.py`

#### Los 3 agentes registrados

| Agente | Archivo | Dominios | Herramientas clave |
|---|---|---|---|
| **FinancialAgent** | `agents/financial.py` | finanzas, pricing, riesgos | rag_query, calculate, format_table |
| **ProcessAgent** | `agents/process.py` | procesos, optimización, calidad | rag_query, analyze_metrics, gap_analysis |
| **DataEngineerAgent** | `agents/data_engineer.py` | datos, ERP, integraciones | qdrant_search, sql_generator, erp_connector |

#### Base Agent (`base.py`)

- Clase abstracta `BaseAgent` con nombre, dominios, herramientas, método `execute()`
- `AgentOutput` — modelo Pydantic de respuesta: response, confidence, sources, errors, execution_time_ms
- Inyección de contexto RAG: cada agente puede usar documentos del vault para fundamentar respuestas

### 4.6. Motor RAG — Retrieval (`src/retrieval/`)

| Módulo | Función |
|---|---|
| `query_engine.py` | Wrapper de búsqueda Qdrant con score ranking |
| `document_loader.py` | Carga y parseo de archivos Markdown del vault |
| `embeddings.py` | Gestión de modelos de embebido (Ollama, FastEmbed) |

### 4.7. Herramientas (`src/tools/`)

- **`database_connector.py`** — Data Abstraction Vault (zero-trust ERP connections). Documentado en `supabase-architecture.md`
- **`sql_generator.py`** — Genera SQL a partir de prompt natural
- **`calculator.py`** (en `graph/tools/calculator.py`) — Evaluador de operaciones matemáticas

### 4.8. Utilidades

| Módulo | Función |
|---|---|
| `utils/qdrant.py` | Lifecycle de Qdrant: init, close, helper de colección |
| `utils/logger.py` | Config de Structlog para logging estructurado |
| `viz/mermaid_renderer.py` | Traza de ejecución del grafo → diagrama Mermaid |
| `llm/factory.py` | Fábrica de clientes LLM: Groq/Ollama/Anthropic |
| `core/exceptions.py` | Excepciones customizadas del dominio |

### 4.9. Configuración (`src/config.py`)

Pydantic-settings, carga desde `.env` del directorio backend:

| Parámetro | Valor default | Descripción |
|---|---|---|
| `VAULT_PATH` | `../Evangelista-Obsidian/evangelista-vault` | Ruta al vault de conocimiento |
| `QDRANT_MODE` | `local` | Local = archivo en disco |
| `QDRANT_LOCAL_PATH` | `./qdrant_storage` | Directorio de persistencia Qdrant |
| `QDRANT_COLLECTION` | `evangelista_knowledge` | Colección vectorial |
| `LLM_PROVIDER` | `groq` | groq / ollama / anthropic |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` | Modelo principal |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Servicio local de Ollama |
| `OLLAMA_MODEL` | `qwen2.5:32b` | Modelo local LLM |
| `ANTHROPIC_MODEL` | `claude-sonnet-4-5-20251022` | Fallback |
| `EMBED_PROVIDER` | `ollama` | Proveedor de embeddings |
| `EMBED_MODEL` | `nomic-embed-text` | Modelo de embedding |
| `EMBED_DIMENSIONS` | `768` | Dimensión de vectores |
| `RETRIEVAL_TOP_K` | `10` | Documentos iniciales |
| `RETRIEVAL_FINAL_K` | `5` | Documentos tras reranking |

---

## 5. Módulo Conocimiento — `Evangelista-Obsidian/`

### 5.1. Estructura del Vault

```
evangelista-vault/
├── benchmarks/                    (6 docs)
│   ├── benchmark-alimentos.md
│   ├── benchmark-construccion.md
│   ├── benchmark-logistica.md
│   ├── benchmark-manufactura.md
│   ├── benchmark-retail.md
│   └── benchmark-textiles.md
│
├── cases/                         (15+ docs)
│   ├── academic/
│   │   ├── columbia/              (2 casos)
│   │   ├── harvard/               (4 casos)
│   │   └── sorbonne/              (1 caso)
│   └── evangelista/               (8 casos locales de pymes mexicanas)
│
├── erp-knowledge/                 (6 docs)
│   ├── aspel-ecosystem.md
│   ├── contpaqi-nominas-imss.md
│   ├── contpaqi-structure.md
│   ├── excel-as-erp.md
│   ├── pos-systems-mexico.md
│   └── sap-b1-audit-queries.md
│
├── formulas/                      (13+ docs)
│   ├── financial/
│   │   ├── cost-of-inaction.md
│   │   └── roi-npv-irr.md
│   ├── pricing/
│   │   ├── architecture-pricing.md
│   │   ├── delta-scoping.md
│   │   ├── foundation-pricing.md
│   │   └── success-fee-calc.md
│   └── statistical/
│       ├── benford-law.md
│       └── monte-carlo-simplified.md
│   └── capability-analysis.md, sensitivity-analysis.md
│
├── frameworks/                    (20+ docs)
│   ├── alcoa-plus/
│   ├── business-modeling/
│   ├── coso-erm/
│   ├── data-architecture/
│   ├── data-mesh/
│   ├── evangelista-methodology/   (CRH, MGO, PED)
│   ├── factor-gamma/
│   ├── iso-standard/
│   ├── lean-manufacturing/
│   ├── nasa-agile-hybrid/
│   ├── process-mining/
│   ├── risk-management/
│   └── six-sigma/
│
├── glossary/                      (Terminología)
├── methodologies/
├── playbooks/
├── regulatory/
├── sales-tools/
└── templates/
```

Total: **119 documentos Markdown**

### 5.2. Contenido por Categoría

**Benchmarks** — KPIs de referencia por industria: alimentos, construcción, logística, manufactura, retail, textiles.

**Casos de Estudio** — 15+ casos: académicos (Columbia, Harvard, Sorbonne) y prácticos (pymes mexicanas Evangelista).

**ERP Knowledge** — SAP B1, Aspel, ContPaqui, sistemas POS, Excel como ERP, auditoría SAP.

**Fórmulas** — Financieras (ROI, NPV, IRR, costo de inacción), Pricing (fundación, arquitectura, delta scoping, success fee), Estadísticas (Benford, Monte Carlo, análisis de capacidad, sensibilidad).

**Frameworks** — ALCOA+, COSO-ERM, Data Mesh, ISO 9001, Lean Manufacturing, Six Sigma, Process Mining, Risk Management, NASA Agile Hybrid, y las propias metodologías Evangelista: CRH (Corrective Hybrid Resolution), MGO (Management Governance Operations), PED (Probabilistic Execution Deterministic), Factor Gamma.

---

## 6. Supabase — Integración

**Proyecto**: `zqyqtcteqtbkadkflaku` → `https://zqyqtcteqtbkadkflaku.supabase.co`

Se usa en dos capas independientes:

### 6.1. Frontend

- `@supabase/supabase-js` con `VITE_SUPABASE_ANON_KEY`
- Auth: `signInWithPassword`, `signOut`, `onAuthStateChange`
- Tablas: `clients` (CRUD completo), `analyses` (list + create con join), `proposals` (list + create)

### 6.2. Backend

- `supabase-py` con `SUPABASE_SERVICE_ROLE_KEY`
- Data Abstraction Vault: conexiones zero-trust a ERPs
- `get_ephemeral_connection()` — descifra password de vault, abre read-only, elimina de memoria
- Migración SQL: `erp_connections` + `vault.secrets` + funciones RPC `create_erp_connection()` y `revoke_erp_connection()`

### 6.3. Tablas en Supabase

| Tabla | Uso | Acceso |
|---|---|---|
| `clients` | Gestión de clientes | Frontend CRUD + FK en backend |
| `analyses` | Historial del enjambre | Frontend lectura/escritura |
| `proposals` | Propuestas comerciales | Frontend lectura/escritura |
| `erp_connections` | Metadatos ERP (sin passwords) | Backend RPC exclusivo |
| `auth.users` | Usuarios del dashboard | Supabase Auth |
| `vault.secrets` | Credenciales ERP cifradas | Backend RPC via pgsodium |

---

## 7. Estado del Desarrollo

### Fixes Recientes

- **`7304566`** — ClientsPage truncado, LoginPage imports, AnalysisResultV2 GraphVisualizer
- **`2ec3261`** — Tracking de archivos .env (en repo privado)
- **`0e03a09`** — Agent execute crashes + ruta /proposals faltante
- **`2a2c781`** — Ruta faltante `/agents/:name` en App.tsx
- **`9a2fcec`** — AgentDetailPage + theme consistency

### Consideraciones Activas

1. **`config.py` del backend** no declara `SUPABASE_URL` ni `SUPABASE_SERVICE_ROLE_KEY` explícitamente — se extraen con `getattr()` dinámico del `.env`
2. **RLS (Row Level Security)** — no hay evidencia de políticas definidas para las tablas accedidas desde frontend
3. **`erp_connections` tiene índice único por `client_id`** — una sola conexión ERP por cliente
4. **La migración SQL** debe aplicarse manualmente en Supabase Dashboard > SQL Editor
5. **Archivos no rastreados** recientes: `evangelista-rag/src/db/`, `evangelista-rag/src/graph/nodes/agent_nodes.py`, `consensus.py`, `eip_*` variants, `evangelista-rag/src/tools/`

---

## 8. Inventario de Archivos Clave

### Frontend (45 archivos TypeScript)

| Archivo | Rol |
|---|---|
| `App.tsx` | Definición de 12 rutas |
| `main.tsx` | Entry point React |
| `lib/api.ts` | HTTP client → FastAPI |
| `lib/supabase.ts` | Supabase client + CRUD wrappers |
| `lib/types.ts` | Interfaces Client, Analysis, Proposal, AgentInfo |
| `stores/authStore.ts` | Zustand auth state |
| `hooks/useClients.ts` | CRUD reactivo de clientes |
| `hooks/useHistory.ts` | Historial de análisis reactivo |
| `hooks/useAnalysis.ts` | Ejecución de análisis RAG |
| `hooks/useAgents.ts` | Registro de agentes |

### Backend (82 archivos Python)

| Archivo/Directorio | Rol |
|---|---|
| `api/server.py` | FastAPI app, middleware, lifespan |
| `api/routes/analyze.py` | POST /api/v1/analyze |
| `api/routes/agents.py` | Agentes: list + execute |
| `api/routes/knowledge.py` | Búsqueda en vault |
| `api/routes/graph_viz.py` | Estado del grafo |
| `api/routes/proposals.py` | Generación de propuestas |
| `api/routes/health.py` | Health checks |
| `graph/state.py` | GraphState (30+ campos) |
| `graph/builder.py` | Construcción del grafo LangGraph |
| `graph/nodes/*.py` | 13 implementaciones de nodos |
| `graph/edges/*.py` | 6 funciones de decisión condicional |
| `graph/prompts/*.yaml` | 6 templates de prompt |
| `graph/tools/*.py` | Calculadora + SQL generator |
| `agents/registry.py` | Registro dinámico |
| `agents/base.py` | Clase base de agentes |
| `agents/financial.py` | Agente financiero |
| `agents/process.py` | Agente de procesos |
| `agents/data_engineer.py` | Agente de datos/ERP |
| `retrieval/*.py` | Motor RAG (Qdrant, documentos, embeddings) |
| `tools/database_connector.py` | Data Vault zero-trust |
| `tools/sql_generator.py` | SQL-from-prompt |
| `config.py` | Settings con pydantic-settings |
| `llm/factory.py` | Fábrica de LLMs |
| `viz/mermaid_renderer.py` | Generador de diagramas Mermaid |
| `db/migrations/01_supabase_vault.sql` | Schema de vault |

### Vault (119 archivos Markdown)

Distribuidos en: benchmarks, cases, erp-knowledge, formulas, frameworks, glossary, methodologies, playbooks, regulatory, sales-tools, templates.
