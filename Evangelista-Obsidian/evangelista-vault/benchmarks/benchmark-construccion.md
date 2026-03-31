---
id: "EVK-BENCH-005"
title: "Benchmark Sectorial — Construcción e Ingeniería en México"
type: benchmark
version: "1.0"
domain: ["construction", "kpi", "finance"]
sector: ["construccion"]
agent_access: [analyst, financial]
confidence: high
source: "CMIC, INEGI, Evangelista-Internal"
last_validated: 2026-03-30
parent: ""
related: ["caso-cibrian-arquitectos", "patron-jineteo-capital"]
depends_on: []
tags: ["benchmark", "construction", "budget-variance", "cash-flow"]
status: active
last_ingested: null
chunk_count: null
---

# Benchmark Sectorial — Construcción e Ingeniería en México

## Introducción
El sector construcción en México es volátil y depende fuertemente de la gestión de flujo de caja y el control de presupuestos en sitio (obra).

## Métricas Clave de Rentabilidad y Eficiencia

| KPI | Promedio PyME MX | Clase Mundial (World Class) | Fuente |
|-----|------------------|-----------------------------|--------|
| **Margen de Utilidad Neta** | 5% - 10% | 12%+ | CMIC |
| **Desvío Presupuestal** | 15% - 25% | < 5% | CMIC |
| **Días de Pago a Prov.** | 45 - 75 días | 30 días | Interno |
| **Accidentalidad (LTIFR)** | 10 - 15 | < 2 | INEGI |
| **Costo Indirecto / Total** | 20% - 30% | < 15% | CMIC |

## Análisis de Brechas (Gap Analysis)
- **Desvío Presupuestal**: La falta de control en el uso de materiales de obra (especialmente acero y cemento) provoca que el 20% de la utilidad se pierda en desperdicio o robo.
- **Margen de Utilidad**: PyMEs mexicanas suelen "jinetear" anticipos para terminar obras anteriores, creando un efecto de bola de nieve que asfixia el margen.

## Riesgos Específicos
El sector es el más vulnerable al [[patron-jineteo-capital]]. El Agente Analyst debe verificar que los cobros por avance correspondan a la realidad física de la obra.

## Uso para el Agente Analyst
Si el desvío presupuestal es > 15%, disparar el protocolo del [[patron-sobrecosto-proyecto]]. Utilizar métricas de la CMIC para justificar ante el cliente la necesidad de implementar bitácoras digitales.
