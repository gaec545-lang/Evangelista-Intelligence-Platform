---
id: "EVK-META-004"
title: "TODO — Tareas Pendientes del Vault"
type: meta
version: "1.1"
domain: []
sector: []
agent_access: [all]
confidence: high
source: evangelista
last_validated: 2026-03-29
last_ingested: 2026-03-29
chunk_count: 197
---

# TODO — Tareas Pendientes Stage 2 ✅

> Actualizado: 2026-03-29 (Fase de Integración RAG)

---

## 🗂️ Vault — Contenido Expansion ✅
- [x] **DMAIC Improve**: Crear `frameworks/six-sigma-dmaic/dmaic-improve.md`
- [x] **DMAIC Control**: Crear `frameworks/six-sigma-dmaic/dmaic-control.md`
- [x] **Lean Manufacturing**: Crear `frameworks/lean-manufacturing/vsm-kaizen.md`
- [x] **ISO Standards**: Crear `frameworks/iso-standard/iso-9001-45001.md`
- [x] **Playbook Alimentos**: Crear `playbooks/playbook-alimentos.md`
- [x] **Playbook Servicios**: Crear `playbooks/playbook-servicios.md`
- [x] **Fórmulas Core**: 
    - [x] Análisis de Sensibilidad (Finanzas)
    - [x] Capacidad de Proceso Cp/Cpk (Procesos)

---

## 🤖 Pipeline RAG — Integración Real ✅
- [x] **Configulación**: Actualizar `VAULT_PATH` en `src/config.py` para apuntar al vault completo
- [x] **BaseAgent**: Implementar lógica `execute()` con `QueryEngine` e `LLMClient`
- [x] **Especialistas**: Refinar `financial`, `process` y `data_engineer` con lógica de dominio
- [x] **Ingesta**: Ejecutar `make ingest` y validar en Qdrant
- [x] **Demo**: Ejecutar `make demo` para probar orquestación completa

---

## ✅ Completado Stage 1
- [x] Estructura base de agentes (`BaseAgent`, `Registry`)
- [x] Prompts iniciales en Markdown y YAML
- [x] Corrección de rutas absolutas para prompts
- [x] Verificación de auto-registro exitosa
