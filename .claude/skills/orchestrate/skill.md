---
name: orchestrate
description: >
  Coordina el equipo de agentes (Planner → Builder → Reviewer) para
  ejecutar tareas de desarrollo en la Evangelista Intelligence Platform.
  Usa este skill cuando el usuario pida construir, implementar, o
  modificar cualquier parte de la plataforma.
triggers:
  - construye
  - implementa
  - agrega
  - modifica
  - crea la página
  - rediseña
  - integra
  - war room
---

# Orchestrate — Coordinación de Equipo EIP

## Flujo de ejecución
Usuario describe requerimiento
↓

PLANNER analiza y genera plan
↓
PLANNER envía plan al usuario para aprobación
↓
Si aprobado → DESIGNER genera especificaciones visuales (si hay UI)
↓
BUILDER implementa siguiendo plan + diseño
↓
REVIEWER valida contra plan original
↓
Si approved → commit + notificar usuario
Si changes_required → BUILDER corrige (máx 2 ciclos)


## Reglas de orquestación

1. **NUNCA saltar el plan.** Incluso para tareas "simples", el Planner debe analizarla primero.
2. **Aprobación del usuario.** El plan se presenta al usuario antes de ejecutar. Si el usuario dice "dale" o "ejecuta", proceder. Si modifica, el Planner ajusta.
3. **Designer solo para UI.** Si la tarea es solo backend (endpoint, migración SQL, etc.), saltar al Builder directamente.
4. **Máximo 2 ciclos de revisión.** Si después de 2 correcciones el Reviewer sigue rechazando, escalar al usuario con el detalle.
5. **Commit atómicos.** Cada tarea completada es un commit con mensaje descriptivo.

## Datos de contexto que SIEMPRE se pasan

Cuando inicies una tarea, incluir en el mensaje al Planner:
Proyecto: Evangelista Intelligence Platform
Frontend: evangelista-dashboard/ (React+Vite+TS+Tailwind, port 5174)
Backend: evangelista-rag/ (FastAPI+LangGraph, port 8001)
Vault: Evangelista-Obsidian/evangelista-vault/ (97 docs Markdown)
DB: Supabase (clients, analyses, proposals, foundation_engagements,
architecture_projects, sentinel_subscriptions, team_members, activity_log)
Design: Eva design system (cream/olive/charcoal, Instrument Serif + Inter)
