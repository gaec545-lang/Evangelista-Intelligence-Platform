# Project Progress Tracker - Evangelista Vault & Dashboard

> Este archivo se mantiene como fuente de verdad del estado del proyecto.
> Actualizar en cada sesión. Los planes detallados van en `.claude/plans/`.

## Estado Actual

- **Última actualización**: 2026-04-02
- **Branch**: `main`
- **Último commit**: `60ba3f2` — fix: Qdrant search_points() + missing icon imports + port alignment
- **Puertos**: Dashboard `5174` | Backend `8000`

## Arquitectura

| Componente | Tech | Puerto | Status |
|---|---|---|---|
| Frontend Dashboard | React + TS + Vite + Tailwind | 5174 | Funcional |
| Backend RAG API | FastAPI + LangGraph + Qdrant | 8000 | Bugs fixeados |
| Database | Supabase (PostgreSQL) | Cloud | Funcional |
| Vector DB | Qdrant (local) | — | **FIXED** |
| LLM | Groq (gsk_...) | — | Funcional |
| Vault | Obsidian MD | — | Actualizado |

## Bugs Conocidos

### ~~BUG #1 — Qdrant search method (CRÍTICO)~~ ✅ FIXED
- Fix aplicado (commit `60ba3f2`): `.search()` → `.search_points()` en `query_engine.py`
- **Necesita prueba**: reiniciar backend y confirmar que retrieval funciona

### ~~BUG #2 — Missing icon imports en AnalysisPanel~~ ✅ FIXED
- Fix aplicado: importados `Cpu`, `Search`, `Zap` en `AnalysisPanel.tsx`

### ~~BUG #3 — Port alignment~~ ✅ FIXED
- Fix aplicado: `.env` ahora usa `http://localhost:8000`
- **Nota**: el archivo `.env` está en `.gitignore`, no se commitea (seguridad)
- **Acción**: el usuario debe confirmar que su `.env` local refleja este cambio antes de correr el dev server

## Endpoints Existentes (ya no faltantes)

### `GET /api/v1/graph/mermaid` ✅ EXISTE
- Archivo: `src/api/routes/graph_viz.py`
- LangGraph `draw_mermaid()` o fallback a `render_graph_definition()`

### `POST /api/v1/search` ✅ EXISTE
- Archivo: `src/api/routes/knowledge.py`
- Usa `QueryEngine.search()` — ahora debería funcionar post-fix de Qdrant

### `POST /api/v1/proposals/foundation` ✅ EXISTE
- Archivo: `src/api/routes/proposals.py`
- Genera propuesta Foundation con cálculo de pricing

### `POST /api/v1/analyze` ✅ EXISTE
- Archivo: `src/api/routes/analyze.py`
- Ejecuta grafo LangGraph

## Plan de Acción

### ~~Fase 1: Fix Críticos~~ ✅ COMPLETADA
- [x] Analizar código completo del proyecto
- [x] Crear archivo de tracking
- [x] Fix BUG #1: Qdrant `.search()` → `.search_points()`
- [x] Fix BUG #2: Importar `Cpu`, `Search`, `Zap` en AnalysisPanel.tsx
- [x] Fix BUG #3: Port alignment `.env` → 8000

### Fase 2: Testing End-to-End
- [ ] Backend: `make start` en evangelista-rag → verificar readiness
- [ ] Test: Knowledge search devuelve resultados (Qdrant fix)
- [ ] Test: Submit analyze → retrieve → response
- [ ] Test: Proposal generation con hallazgos
- [ ] Test: Graph visualization renderiza
- [ ] Frontend: verificar que `npm run dev` arranca sin errores en puerto 5174

### Fase 3: Hardening
- [ ] Verificar node_modules instalados en dashboard
- [ ] Error boundaries en React
- [ ] Rotar API key de Groq si se compromete en logs
- [ ] Verificar que `.env` no se commitea por accidente

## Historial de Sesiones

### 2026-04-02 — Sesión actual
- Created: 4 commits
  - `818c318` — refactor UI components + Tailwind Apple-style design system
  - `cad4e42` — remove legacy agents/orchestrator, adopt LangGraph
  - `5ffa6ce` — vault glossary updates, sales notes, Obsidian config, root deps
  - `60ba3f2` — fix: Qdrant search_points() + missing icon imports + port alignment
- All pushed to main

## Contexto Relevante

- El sistema de agentes especializados legacy fue eliminado y reemplazado por LangGraph cyclic graph
- 5 agentes registrados: `financial`, `process`, `data_engineer`, `analyst`, `risk`
- Grafos LangGraph con 9 nodos: router → retriever → grader → CRAG decision → generator → hallucination_check → quality_check → synthesizer
- Tailwind configurado con tema "Apple Dark Canvas" + color Evangelista olive
- Supabase integrado para clients, analyses, proposals
