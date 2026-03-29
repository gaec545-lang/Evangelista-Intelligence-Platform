---
id: "EVK-FWK-008"
title: "NASA Agile Hybrid — Gestión de Proyectos Architecture"
type: framework
version: "1.0"
domain: [procesos]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [pm, process, data_eng, all]
confidence: medium
source: custom
last_validated: 2026-03-28
parent: ""
related: ["factor-gamma-system", "data-mesh-over-erp", "evangelista-rules"]
depends_on: []
tags: [agile, nasa-standards, procesos, architecture]
status: active
last_ingested: null
chunk_count: null
---

# NASA Agile Hybrid — Gestión de Proyectos Architecture

## ¿Qué es el Modelo NASA Agile Hybrid?

Evangelista adapta los principios de gestión de proyectos de alta confiabilidad de la NASA combinados con metodologías ágiles (Scrum/Kanban) para gestionar los proyectos Architecture.

La filosofía NASA aplicada: **"Failure is not an option"** — cada entregable de Architecture debe ser correcto antes de avanzar al siguiente. No se entrega algo que no está probado contra los datos reales del cliente.

La filosofía Agile: entregas incrementales, visibilidad constante del avance, y ajuste rápido ante hallazgos inesperados durante la implementación.

## Estructura de Sprints por Factor Γ

### Γ 1.0 – 1.5 (6-7 semanas)

| Sprint | Semanas | Entregable |
|--------|---------|------------|
| Sprint 1 | 1-2 | Modelo de datos validado, acceso confirmado |
| Sprint 2 | 3-4 | ETL funcionando, DW con datos históricos |
| Sprint 3 | 5-6 | Power BI dashboards, pruebas de usuario |
| Sprint 4 | 7 | QA final, capacitación, Delivery Handshake |

### Γ 2.0 – 3.0 (9-12 semanas)

| Sprint | Semanas | Entregable |
|--------|---------|------------|
| Sprint 1 | 1-2 | Levantamiento técnico completo, mapeo de fuentes |
| Sprint 2 | 3-5 | ETL por fuente (SAP + Legacy), modelo dimensional |
| Sprint 3 | 6-8 | Data Warehouse cargado, validación vs. ERP |
| Sprint 4 | 9-10 | Power BI dashboards operativos y ejecutivos |
| Sprint 5 | 11-12 | QA final, capacitación, Delivery Handshake |

## Principios NASA Aplicados

### 1. Revisión de Puertas (Gate Reviews)

Antes de avanzar de un sprint al siguiente, el CTO realiza una **Gate Review** que valida:
- Los datos del sprint anterior son correctos (validación vs. ERP fuente)
- No hay dependencias no resueltas para el siguiente sprint
- El cliente ha confirmado el acceso necesario para continuar

Si la Gate Review falla, el sprint se repite o se ajusta el alcance. No se sigue adelante con datos sin validar.

### 2. Documentación como Artefacto de Primera Clase

Cada sprint produce:
- Código del ETL comentado y versionado en Git
- Documentación del modelo dimensional
- Log de validaciones (DW vs. ERP fuente)
- Registro de decisiones técnicas tomadas

La documentación no es opcional — es parte del entregable. Esto es lo que permite que Sentinel funcione sin intervención constante del CTO después de la entrega.

### 3. Pruebas de Regresión

Antes del Delivery Handshake, el CTO ejecuta pruebas de regresión que verifican:
- Que los totales del DW coinciden con los totales del ERP fuente (±0.1%)
- Que los ETLs corren correctamente de forma automatizada
- Que los dashboards de Power BI muestran los datos correctos para el período de prueba

## Comunicación con el Cliente Durante Architecture

El CEO envía un **Reporte de Avance Semanal** al Sponsor del cliente con:
- % de completitud del sprint actual
- Entregables completados en la semana
- Entregables planificados para la próxima semana
- Riesgos o bloqueos que requieren acción del cliente

Este reporte es breve (1 página o menos), visual (con semáforo de estado), y se envía todos los viernes antes del mediodía.

## Protocolo de Cambio de Alcance (Change Order)

Si durante Architecture se descubre que el alcance original era insuficiente (nueva fuente de datos no mapeada, sucursal adicional, etc.), se activa el protocolo de Change Order:

1. El CTO documenta el cambio descubierto y su impacto en el timeline
2. El CEO evalúa el impacto en el Factor Γ y el precio
3. Se presenta al cliente por escrito con opciones: a) aceptar el cambio con ajuste de precio y timeline, b) excluir el cambio del alcance actual

Sin Change Order firmado por el cliente, el cambio no se implementa.
