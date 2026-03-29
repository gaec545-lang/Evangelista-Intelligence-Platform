---
id: "EVK-MOC-001"
title: "MOC — DMAIC en Evangelista & Co."
type: moc
version: "1.0"
domain: [procesos]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [all]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: ""
related: ["dmaic-define", "dmaic-measure", "dmaic-analyze"]
depends_on: []
tags: [six-sigma, dmaic, procesos]
status: active
last_ingested: null
chunk_count: null
---

# MOC — DMAIC en Evangelista & Co.

Mapa de contenidos del ciclo DMAIC aplicado a los servicios de Evangelista.

## Fases del DMAIC

| Fase | Documento | Cuándo se aplica |
|------|-----------|-----------------|
| **Define** | [[dmaic-define]] | Architecture Sprint 1-2, formalización del AS-IS |
| **Measure** | [[dmaic-measure]] | Foundation Fase A + Architecture Sprint 1, establecimiento de baseline |
| **Analyze** | [[dmaic-analyze]] | Foundation Dictamen Forense, identificación de causas raíz |
| **Improve** | (ver Architecture) | Architecture Sprints 2-5, construcción del DW y ETL |
| **Control** | (ver Sentinel) | Sentinel, monitoreo continuo con alertas automáticas |

## Conexión con los Servicios de Evangelista

```
Foundation          Architecture          Sentinel
   ↓                    ↓                    ↓
Define+Measure      Improve               Control
   ↓                    ↓                    ↓
 Analyze           Data Warehouse        Dashboards +
(Dictamen)         ETL + Power BI        Alertas KPIs
```

El DMAIC es el esqueleto metodológico invisible del proceso de Evangelista. El cliente no lo ve explícitamente, pero cada entregable corresponde a una fase del ciclo.

## Notas de uso del framework

- Six Sigma estándar asume organizaciones con recursos para proyectos de 6-12 meses. Evangelista adapta el DMAIC a proyectos de 10 días (Foundation) a 12 semanas (Architecture).
- El rigor estadístico de la fase Measure (Benford, SPC) es lo que diferencia el Dictamen Forense de Evangelista vs. un análisis financiero convencional.
- La Fase Improve (Architecture) solo ocurre si el Vetting Gate pasa (Regla G-08).
