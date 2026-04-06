# Evangelista Intelligence Platform — Mapa General Completo

> Última actualización: 2026-04-05

---

## Índice

1. [Visión del Proyecto](#1-visión-del-proyecto)
2. [Arquitectura de Alto Nivel](#2-arquitectura-de-alto-nivel)
3. [Puertos y Servicios](#3-puertos-y-servicios)
4. [Frontend — evangelista-dashboard](#4-frontend---evangelista-dashboard)
5. [Backend — evangelista-rag](#5-backend---evangelista-rag)
6. [Base de Datos — Supabase](#6-base-de-datos---supabase)
7. [Base de Conocimiento — Obsidian Vault](#7-base-de-conocimiento---obsidian-vault)
8. [Sistema de Diseño](#8-sistema-de-diseño)
9. [Flujos de Datos](#9-flujos-de-datos)
10. [Estado del Desarrollo](#10-estado-del-desarrollo)

---

## 1. Visión del Proyecto

**Evangelista Intelligence Platform (EIP)** es una plataforma de consultoría estratégica asistida por IA para pymes mexicanas. Combina:

- **Dashboard React** — interfaz de gestión y visualización
- **Backend FastAPI + LangGraph** — orquestador RAG con 9+ nodos cíclicos
- **Qdrant** — base de datos vectorial para conocimiento
- **Supabase (PostgreSQL)** — datos relacionales, auth, vault de credenciales
- **Observidian Vault** — 119 documentos Markdown de conocimiento curado

El flujo operativo es:

```
Usuario (Dashboard) → Consulta → Router LLM → Retrieval/Tools/Web
  → Generación → Hallucination Check → Quality Check → Síntesis
  → Respuesta con confianza, fuentes e historial de nodos
```

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
│  │  Port 5174     │              │  9+ nodos cíclicos RAG      │   │
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
│  │  Anthropic (claude-sonnet-4-5) — fallback                  │   │
│  └───────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 3. Puertos y Servicios

| Servicio | Puerto | URL | Propósito |
|---|---|---|---|
| **Frontend Dashboard** | **5174** | `http://localhost:5174` | UI React, War Room |
| **Backend FastAPI** | **8001** | `http://localhost:8001` | API REST, LangGraph, agentes |
| **Qdrant (local)** | **6333** | `http://localhost:6333` | Vector DB, embeddings |
| **Ollama (embeddings)** | **11434** | `http://localhost:11434` | Modelo de embedding local |
| **Supabase Cloud** | — | `https://zqyqtcteqtbkadkflaku.supabase.co` | PostgreSQL + Auth + Vault |

---

## 4. Frontend — evangelista-dashboard

### 4.1. Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | React | 18.3.1 |
| Build | Vite | 5.4.1 |
| Lenguaje | TypeScript | 5.5.3 |
| Estilos | Tailwind CSS | 3.4.10 |
| Enrutamiento | React Router DOM | 6.26.0 |
| Estado global | Zustand | 5.0.0 |
| BD Cloud | @supabase/supabase-js | 2.45.0 |
| Animaciones | Framer Motion | 12.38.0 |
| Iconos | Lucide React | 0.441.0 |
| Markdown | react-markdown + remark-gfm | 9.1.0 / 4.0.1 |
| Code highlight | rehype-highlight | 7.0.2 |
| Zoom grafos | react-zoom-pan-pinch | 3.7.0 |

### 4.2. Estructura de Archivos

```
evangelista-dashboard/
├── package.json, tsconfig.json, tailwind.config.ts, vite.config.ts
├── index.html, postcss.config.js
└── src/
    ├── main.tsx                          # Entry point React
    ├── App.tsx                           # Rutas (protected + public)
    ├── index.css                         # Global styles + Tailwind + clases custom
    │
    ├── layouts/
    │   ├── AppLayout.tsx                 # Wrapper global con estructura
    │   └── Sidebar.tsx                   # Navegación lateral colapsable
    │
    ├── pages/                            # 20 páginas
    │   ├── LoginPage.tsx                 # /login — Auth email/password
    │   ├── DashboardPage.tsx             # / — War Room overview, stats, revenue
    │   ├── AnalyzePage.tsx               # /analyze — Consulta RAG con selector de cliente
    │   ├── ClientsPage.tsx               # /clients — Lista + CRUD modal
    │   ├── ClientDetailPage.tsx           # /clients/:id — Perfil + KPIs + historial
    │   ├── AgentsPage.tsx                # /agents — Grid de agentes
    │   ├── AgentDetailPage.tsx           # /agents/:name — Detalle + ejecución manual
    │   ├── ProposalPage.tsx              # /proposals — Generador de propuestas
    │   ├── KnowledgePage.tsx             # /knowledge — Búsqueda en vault
    │   ├── GraphPage.tsx                 # /graph — Visualización Mermaid del grafo
    │   ├── SettingsPage.tsx              # /settings — Health checks + info
    │   ├── FoundationPipelinePage.tsx    # /foundation — Kanban + tabla pipeline
    │   ├── FoundationDetailPage.tsx      # /foundation/:id — Engagement completo
    │   ├── ArchitectureListPage.tsx       # /architecture — Lista de proyectos
    │   ├── ArchitectureDetailPage.tsx    # /architecture/:id — Sprints, fees, ERP
    │   ├── SentinelListPage.tsx          # /sentinel — Lista suscripciones
    │   ├── SentinelDetailPage.tsx        # /sentinel/:id — KPIs, alertas, simulación MC
    │   ├── TeamPage.tsx                  # /team — Gestión de equipo (solo CEO)
    │   └── ERPConnectionsPage.tsx        # /erp-connections — Conexiones ERP multi-step
    │
    ├── components/
    │   ├── ui/                           # Primitivos reutilizables
    │   │   ├── Button.tsx                # primary/outline/ghost/danger, sm/md/lg
    │   │   ├── Badge.tsx                 # success/warning/danger/neutral/primary
    │   │   ├── Card.tsx                  # glass card con hover
    │   │   ├── Counter.tsx               # contador animado
    │   │   ├── EmptyState.tsx            # estado vacío con icono
    │   │   ├── Input.tsx                 # campo con label/error/helper
    │   │   ├── Modal.tsx                 # overlay + backdrop
    │   │   └── Spinner.tsx               # loading circular
    │   │
    │   ├── foundation/                   # Feature components Foundation
    │   │   ├── CitaPipeline.tsx          # Stepper de citas 1-4 con auto-progress
    │   │   ├── DataUploadWizard.tsx      # Upload CSV/Excel → auto-detect scoping
    │   │   ├── ScopingCalculator.tsx     # Calculadora factores γ, α, β + fee
    │   │   ├── StatusStepper.tsx         # Stepper visual de estados
    │   │   ├── VettingCheck.tsx          # Checklist de vetting go/no-go
    │   │   ├── HallazgoCard.tsx          # Tarjeta de hallazgo
    │   │   └── FactorCard.tsx            # Tarjeta de factor metodológico
    │   │
    │   ├── AgentCard.tsx                 # Tarjeta de agente en grid
    │   ├── AnalysisPanel.tsx             # Input de consulta RAG