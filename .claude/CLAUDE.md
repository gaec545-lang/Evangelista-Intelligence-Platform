# Evangelista Intelligence Platform — CLAUDE.md

## Equipo de agentes

Este proyecto usa un equipo de 4 agentes coordinados:

- **Planner** (`.claude/agents/planner.md`): Analiza requerimientos y diseña planes
- **Builder** (`.claude/agents/builder.md`): Implementa código frontend y backend
- **Reviewer** (`.claude/agents/reviewer.md`): Valida calidad contra el plan
- **Designer** (`.claude/agents/designer.md`): Especialista en UI React+Tailwind

### Flujo de trabajo
Usuario → Planner (plan) → Usuario aprueba → Designer (si UI) → Builder (código) → Reviewer (QA) → Commit

### Cómo invocar
"Construye la página Foundation Pipeline" → activa orchestrate skill → Planner → Builder → Reviewer
"Mejora el diseño del Dashboard" → activa design-react skill → Designer → Builder → Reviewer
"Agrega el endpoint de Monte Carlo" → activa build-backend skill → Planner → Builder → Reviewer

## Skills disponibles

| Skill | Trigger | Qué hace |
|---|---|---|
| orchestrate | "construye", "implementa", "agrega" | Coordina el equipo completo |
| design-react | "diseña", "mejora visual", "estilo" | Genera UI con design system Eva |
| build-backend | "endpoint", "router", "agente" | Desarrollo Python/FastAPI |
| generate-docs | "genera documento", "propuesta .docx" | Genera .docx con python-docx |

## Reglas del proyecto

1. **NO borrar archivos existentes** sin confirmación explícita del usuario
2. **NO cambiar puertos** (frontend:5174, backend:8001, qdrant:6333)
3. **NO modificar el grafo RAG** (src/graph/) sin aprobación del Planner
4. **NO exponer fórmulas α/β/Γ** en interfaces de cliente — la war room es solo para consultores internos
5. **Commit después de cada tarea** completada y aprobada por el Reviewer
