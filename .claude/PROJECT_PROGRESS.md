# Project Progress Tracker - Evangelista Vault & Dashboard

> Este archivo se mantiene como fuente de verdad del estado del proyecto.
> Actualizar en cada sesión. Los planes detallados van en `.claude/plans/`.

## Estado Actual

- **Última actualización**: 2026-04-02
- **Branch**: `main`
- **Último commit**: `7304566` — rebuild ClientsPage (truncated), fix LoginPage + AnalysisResultV2 imports
- **Puertos**: Dashboard `5174` | Backend `8001`
- **Servidores corriendo**: Backend (pid activo) + Frontend (node vite)

## Arquitectura

| Componente | Tech | Puerto | Status |
|---|---|---|---|
| Frontend Dashboard | React + TS + Vite + Tailwind | 5174 | Funcional |
| Backend RAG API | FastAPI + LangGraph + Qdrant | 8001 | Funcional (Qdrant fixed) |
| Database | Supabase (PostgreSQL) | Cloud | Funcional |
| Vector DB | Qdrant (local `./qdrant_storage_v2`) | — | Fixed — `search_points()` |
| LLM | Groq (gsk_...) | — | Funcional |
| Vault | Obsidian MD | — | Actualizado |

## Bugs Resueltos

### ~~BUG #1 — Qdrant search method (CRÍTICO)~~ ✅ FIXED (commit `60ba3f2`)
- `.search()` → `.search_points()` en `query_engine.py`

### ~~BUG #2 — Missing icon imports en AnalysisPanel~~ ✅ FIXED (commit `60ba3f2`)

### ~~BUG #3 — Port alignment~~ ✅ FIXED (commit `60ba3f2`, `7304566`)
- `.env` commiteado al repo (repo privado) con `VITE_API_URL=http://localhost:8001`

### ~~BUG #4 — ClientsPage truncado~~ ✅ FIXED (commit `7304566`)
- Archivo cortado en línea 78 — reconstruido completo con ClientCard, search, modal, summary

### ~~BUG #5 — LoginPage import~~ ✅ FIXED (commit `7304566`)
- `import { Button }` → `import Button` (default export)

### ~~BUG #6 — GraphVisualizer no importado~~ ✅ FIXED (commit `7304566`)
- Faltaba `import GraphVisualizer from './GraphVisualizer'` en AnalysisResultV2

## ROADMAP — Sprint Funcionalidad

### Diagnóstico: Por qué no se envían las preguntas a los agentes

**Root cause**: No hay un bug de UI — la interfaz funciona, pero hay 2 problemas:
1. **AgentCard tiene `api.executeAgent`** → endpoint `POST /api/v1/agents/{name}/execute` existe en backend. El `BaseAgent.execute()` llama a `QueryEngine.search()` (fixed con Qdrant fix). Sin embargo, el usuario probablemente ve agentes estáticos sin interacción funcional porque no hay ruta navegable.
2. **AnalyzePage usa `AnalysisPanel`** → `useAnalysis()` → `api.runGraph()` → `POST /api/v1/analyze` → `run_graph()`. Si el grafo falla en el retriever (Qdrant), el análisis devuelve error y no se muestra la respuesta.

### Fase 1: Fix de Textos Invisibles (legibilidad) ✅ COMPLETADA
- [x] Diagnosticar: `ClientDetailPage` usa `bg-white` en KPIs sobre fondo oscuro
- [x] Fix: `bg-white` → `card-glass` en KPI cards, Orquestador container e Historial container
- [x] Fix: `bg-white/80` → `bg-canvas-elevated` en `GraphVisualizer`

### Fase 2: Agent Detail Page ✅ COMPLETADA
- [x] Crear `AgentDetailPage.tsx` — página completa con:
  [x] Header del agente (nombre, status, dominios, herramientas)
  [x] Panel de configuración: dominios + herramientas display
  [x] Panel de ejecución: textarea funcional, envío a `POST /api/v1/agents/{name}/execute`
  [x] Resultado: análisis, confianza, recomendaciones, escalación, fuentes
  [x] Historial de ejecuciones en sesión
- [x] `AgentCard` simplificado: ahora solo muestra info + clickea y navega a `/agents/:name`
- [x] Ruta agregada en `App.tsx`: `/agents/:name` → `AgentDetailPage`
- [x] Import agregado en `App.tsx`
- [x] **Fix**: Ruta `/agents/:name` faltaba en App.tsx (commit separado pendiente)

### Fase 3: Test End-to-End
- [ ] Verificar que `POST /api/v1/analyze` funciona (Qdrant fixed)
- [ ] Verificar que `POST /api/v1/agents/{name}/execute` funciona
- [ ] Test Knowledge search
- [ ] Test Graph visualization

## Historial de Sesiones

### 2026-04-02 — Sesión actual
- Created: 5 commits
  - `818c318` — refactor UI components + Tailwind Apple-style design system
  - `cad4e42` — remove legacy agents/orchestrator, adopt LangGraph
  - `5ffa6ce` — vault glossary updates, sales notes, Obsidian config, root deps
  - `60ba3f2` — fix: Qdrant search_points() + missing icon imports + port alignment
  - `7304566` — rebuild ClientsPage (truncated), fix LoginPage + AnalysisResultV2 imports
- All pushed to main
- Servidores arrancados: backend :8001, frontend :5174

## Contexto Relevante

- El sistema de agentes especializados legacy fue eliminado y reemplazado por LangGraph cyclic graph
- 3 agentes registrados actualmente: `financial`, `process`, `data_engineer`
- Grafos LangGraph con 9 nodos: router → retriever → grader → CRAG decision → generator → hallucination_check → quality_check → synthesizer
- Tailwind configurado con tema "Apple Dark Canvas" + color Evangelista olive
- Supabase integrado para clients, analyses, proposals
- `.env` está versionado (repo privado)
