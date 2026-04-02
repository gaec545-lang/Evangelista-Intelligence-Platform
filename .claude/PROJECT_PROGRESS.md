# Project Progress Tracker - Evangelista Vault & Dashboard

> Este archivo se mantiene como fuente de verdad del estado del proyecto.
> Actualizar en cada sesión. Los planes detallados van en `.claude/plans/`.

## Estado Actual

- **Última actualización**: 2026-04-02
- **Branch**: `main`
- **Último commit**: `5ffa6ce` — chore: vault glossary updates, sales notes, Obsidian config, root deps
- **Puertos**: Dashboard `5174` | Backend `8001`

## Arquitectura

| Componente | Tech | Puerto | Status |
|---|---|---|---|
| Frontend Dashboard | React + TS + Vite + Tailwind | 5174 | Funcional |
| Backend RAG API | FastAPI + LangGraph + Qdrant | 8001 | Bugs críticos |
| Database | Supabase (PostgreSQL) | Cloud | Funcional |
| Vector DB | Qdrant (local) | — | **BROKEN** |
| LLM | Groq (gsk_...) | — | Funcional |
| Vault | Obsidian MD | — | Actualizado |

## Bugs Conocidos

### BUG #1 — Qdrant search method (CRÍTICO)
- **Archivo**: `evangelista-rag/src/retrieval/query_engine.py` línea ~68
- **Error**: `'QdrantClient' object has no attribute 'search'` → debe usar `search_points()`
- **Impacto**: Rompe TODA recuperación: proposals, graph visualization, knowledge search
- **Estado**: PENDIENTE — primera prioridad

### BUG #2 — Missing icon imports en AnalysisPanel
- **Archivo**: `evangelista-dashboard/src/components/AnalysisPanel.tsx`
- **Falta**: `<Cpu>`, `<Search>`, `<Zap>` no importados de `lucide-react`
- **Impacto**: UI rota en loading state

### BUG #3 — Port alignment
- **Frontend `.env`**: `VITE_API_URL=http://localhost:8001`
- **Backend default**: port 8000
- **Verificar**: que el backend efectivamente corra en 8001

## Endpoints Faltantes

### `/api/v1/graph/mermaid`
- **Necesario para**: GraphPage renderiza visualización Mermaid
- **Qué hace**: Retorna trace Mermaid de la ejecución LangGraph
- **Estado**: NO EXISTE en el backend

## Plan de Acción

### Fase 1: Fix Críticos
- [x] Analizar código completo del proyecto
- [x] Crear archivo de tracking
- [ ] Fix BUG #1: Qdrant `.search()` → `.search_points()` en `query_engine.py`
- [ ] Fix BUG #2: Importar `Cpu`, `Search`, `Zap` en AnalysisPanel.tsx
- [ ] Fix BUG #3: Verificar backend corre en 8001, alinear si no

### Fase 2: Endpoints Faltantes
- [ ] Crear `POST /api/v1/search` que use QueryEngine correctamente
- [ ] Crear `GET /api/v1/graph/mermaid` para visualización
- [ ] Verificar proposal endpoints funcionen post-fix de Qdrant

### Fase 3: End-to-End Testing
- [ ] Test: Submit analyze → retrieve → response (puerto 8001)
- [ ] Test: Knowledge search devuelve resultados
- [ ] Test: Proposal generation con hallazgos
- [ ] Test: Graph visualization renderiza
- [ ] Verificar no hay errores de TypeScript (`npx tsc --noEmit` en dashboard)

### Fase 4: Hardening
- [ ] Agregar `__pycache__/` a `.gitignore` con path absoluto o limpiar
- [ ] Error boundaries en React
- [ ] Rotar API key de Groq si se compromete en logs

## Historial de Sesiones

### 2026-04-02 — Sesión actual
- Created: 3 commits (dashboard refactor, backend cleanup, vault config)
- Pushed to main: `818c318`, `cad4e42`, `5ffa6ce`
- Pendiente: Fixes de bugs críticos (Qdrant, imports, endpoints)

## Contexto Relevante

- El sistema de agentes especializados legacy fue eliminado y reemplazado por LangGraph cyclic graph
- 5 agentes registrados: `financial`, `process`, `data_engineer`, `analyst`, `risk`
- Grafos LangGraph con 9 nodos: router → retriever → grader → CRAG decision → generator → hallucination_check → quality_check → synthesizer
- Tailwind configurado con tema "Apple Dark Canvas" + color Evangelista olive
- Supabase integrado para clients, analyses, proposals
