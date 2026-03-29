---
id: "EVK-META-001"
title: "Taxonomía de Tags — Evangelista Vault"
type: meta
version: "1.0"
domain: []
sector: []
agent_access: [all]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: ""
related: ["vault-conventions"]
depends_on: []
tags: []
status: active
last_ingested: null
chunk_count: null
---

# Taxonomía de Tags — Evangelista Vault

## Regla General

> **Máximo 8 tags por nota.** Más de 8 tags es señal de que la nota intenta cubrir demasiados temas. Considera dividirla.

Los tags deben seleccionarse de esta taxonomía oficial. **No crear tags ad hoc** sin actualizar este documento primero.

---

## Nivel 1 — Servicio de Evangelista

| Tag | Descripción |
|-----|-------------|
| `foundation` | Relacionado con el servicio Foundation (Dictamen Forense) |
| `architecture` | Relacionado con el servicio Architecture (DW + BI) |
| `sentinel` | Relacionado con el servicio Sentinel (monitoreo continuo) |

---

## Nivel 2 — Metodología

| Tag | Descripción |
|-----|-------------|
| `six-sigma` | Metodología Six Sigma en general |
| `dmaic` | Ciclo DMAIC específicamente |
| `coso` | Marco COSO ERM |
| `alcoa` | Estándar ALCOA+ de integridad de datos |
| `data-mesh` | Arquitectura de Data Mesh |
| `nasa-standards` | Principios de gestión de proyectos NASA |
| `agile` | Metodología ágil (Scrum/Kanban) |

---

## Nivel 3 — Dominio

| Tag | Descripción |
|-----|-------------|
| `finanzas` | Análisis financiero, pricing, ROI |
| `procesos` | Análisis y mejora de procesos operativos |
| `riesgos` | Gestión de riesgos, compliance |
| `datos` | Análisis de datos, calidad de datos, ETL |
| `rh` | Recursos Humanos, nómina, personal |
| `produccion` | Procesos de producción y manufactura |
| `logistica` | Cadena de suministro, distribución, transporte |
| `ventas` | Proceso comercial, CRM, cartera de clientes |
| `inventarios` | Control de inventarios (subdomain de producción/logística) |
| `calidad` | Control de calidad, QA, estándares |

---

## Nivel 4 — Sector

| Tag | Descripción |
|-----|-------------|
| `manufactura` | Sector manufactura en general |
| `textiles` | Sector textiles y confección |
| `retail` | Comercio minorista |
| `logistica-sector` | Empresas de logística y transporte (distinguir de dominio `logistica`) |
| `alimentos` | Industria alimentaria |
| `construccion` | Sector construcción y materiales |
| `ferreteria` | Sector ferretería y materiales de construcción |
| `muebles` | Sector muebles y madera |

---

## Tags Especiales

| Tag | Descripción |
|-----|-------------|
| `pricing` | Relacionado con fórmulas de precios y motor MEC |
| `factor-gamma` | Relacionado específicamente con Factor Γ/α/β |
| `success-fee` | Relacionado con el cálculo y protocolo del Success Fee |
| `vetting-gate` | Relacionado con el proceso de decisión Go/No-Go |
| `alcoa-certificate` | Relacionado con el Certificado de Integridad ALCOA+ |
| `agent-config` | Configuración de agentes de IA (system prompts, RAG config) |
| `objecion` | Manejo de objeciones comerciales |
| `argumento-venta` | Argumentos y técnicas de venta |

---

## Combinaciones de Tags Recomendadas por Tipo de Nota

| Tipo de nota | Tags típicos |
|--------------|-------------|
| Framework metodológico | `[metodología]` + `[dominio]` + `[servicio]` |
| Fórmula de pricing | `pricing` + `finanzas` + `[servicio]` + `factor-gamma` |
| Caso de cliente | `[sector]` + `[servicio]` + `[dominio principal]` |
| Playbook de sector | `[sector]` + `[servicio]` + `procesos` |
| Objeción comercial | `objecion` + `argumento-venta` + `[tema de la objeción]` |
| Regla de gobernanza | `[servicio]` + `riesgos` + `procesos` |
| Prompt de agente | `agent-config` + `[dominio del agente]` |
