---
id: "EVK-META-004"
title: "TODO — Tareas Pendientes del Vault"
type: meta
version: "1.0"
domain: []
sector: []
agent_access: [all]
confidence: high
source: evangelista
last_validated: 2026-03-29
parent: ""
related: ["changelog", "vault-conventions"]
depends_on: []
tags: []
status: active
last_ingested: null
chunk_count: null
---

# TODO — Tareas Pendientes del Vault

> Actualizado: 2026-03-29

---

## 🗂️ Vault — Contenido

### Completado ✅
- [x] Inicialización del vault (2026-03-28)
- [x] 15 documentos core creados con frontmatter completo
- [x] 5 templates para nuevas notas
- [x] 3 archivos meta (changelog, tags-taxonomy, vault-conventions)
- [x] 8 archivos de soporte (COSO, NASA, delta-scoping, cost-of-inaction, monte-carlo, sat-compliance, etc.)
- [x] 3 prompts de agentes (financial, process, data-engineer)
- [x] 3 objections (price, guarantee, timeline)
- [x] 1 glosario completo (EVK-GLOS-001)
- [x] 1 MOC para DMAIC
- [x] Repo unificado vault + RAG pipeline (commit c623319)

### Pendiente 🔲

#### Frameworks
- [ ] Completar fases restantes de DMAIC: `dmaic-improve.md`, `dmaic-control.md`
- [ ] Ampliar `factor-gamma-system.md` con casos de uso reales
- [ ] Agregar framework: **Lean Manufacturing** (VSM, 5S, Kaizen)
- [ ] Agregar framework: **ISO 9001 / ISO 45001** para manufactura y textiles

#### Playbooks
- [ ] Crear `playbook-alimentos.md` con rutas de análisis para sector alimentos
- [ ] Crear `playbook-servicios.md` para empresas de servicios profesionales
- [ ] Actualizar `playbook-manufactura.md` con integración de Factor Gamma

#### Cases
- [ ] Documentar caso real #2 (pendiente de aprobación del cliente)
- [ ] Crear template `case-study-template.md` para estandarizar nuevos casos

#### Formulas
- [ ] Agregar fórmula: **Análisis de sensibilidad** para modelos financieros
- [ ] Agregar fórmula: **Cálculo de capacidad de proceso (Cp/Cpk)**

#### Glossary
- [ ] Revisar y ampliar `glossary.md` con términos de Data Mesh y RAG

---

## 🤖 Pipeline RAG — evangelista-rag

### Completado ✅
- [x] Estructura base del pipeline definida
- [x] `docker-compose.yml` con Qdrant configurado
- [x] `requirements.txt` con dependencias base
- [x] `Makefile` con comandos de orquestación
- [x] Configuración de entorno (`.env.example`)
- [x] Estructura de carpetas: `src/`, `cli/`, `tests/`

### Pendiente 🔲

#### Ingesta
- [ ] Ejecutar primera ingesta completa de todos los documentos del vault
- [ ] Validar que todos los chunks tienen frontmatter parseado correctamente
- [ ] Verificar conteo de chunks por documento (actualizar `chunk_count` en frontmatter)

#### Pipeline
- [ ] Implementar y probar modo de búsqueda híbrida (BM25 + dense)
- [ ] Configurar filtros por `domain`, `sector`, y `agent_access` en Qdrant
- [ ] Conectar agentes de IA al RAG endpoint

#### Testing
- [ ] Escribir pruebas de integración para el pipeline de ingesta
- [ ] Crear suite de queries de benchmark para evaluar retrieval
- [ ] Documentar resultados de pruebas de stress (PDF, PNG, JPEG)

#### Infraestructura
- [ ] Configurar CI/CD para re-ingesta automática en push a `main`
- [ ] Agregar monitoreo de Qdrant (métricas de colecciones)

---

## 📋 Meta / Mantenimiento

- [ ] Revisar y actualizar `tags-taxonomy.md` con nuevas categorías
- [ ] Crear `roadmap.md` con visión de largo plazo del vault
- [ ] Definir política de versionado de documentos (v1.x → v2.0)
- [ ] Agregar campo `reviewed_by` al frontmatter de documentos críticos

---

*Las tareas completadas se mueven a la sección ✅ con fecha. Las nuevas tareas se agregan aquí.*
