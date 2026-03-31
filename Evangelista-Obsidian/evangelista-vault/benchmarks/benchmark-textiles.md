---
id: "EVK-BENCH-002"
title: "Benchmark Sectorial — Industria Textil en México"
type: benchmark
version: "1.0"
domain: ["industry", "kpi", "textiles"]
sector: ["textiles"]
agent_access: [analyst, financial]
confidence: high
source: "Inegi, Canaintex, Evangelista-Internal"
last_validated: 2026-03-30
parent: ""
related: ["caso-textiles-atoyac", "patron-merma-no-rastreada"]
depends_on: []
tags: ["benchmark", "textiles", "apparel", "efficiency"]
status: active
last_ingested: null
chunk_count: null
---

# Benchmark Sectorial — Industria Textil en México

## Introducción
La industria textil en México (especialmente en Puebla y el Estado de México) enfrenta retos de eficiencia en el uso de materia prima y tiempos de preparación de maquinaria (Setup times).

## Métricas Clave de Rentabilidad y Eficiencia

| KPI | Promedio PyME MX | Clase Mundial (World Class) | Fuente |
|-----|------------------|-----------------------------|--------|
| **Margen Bruto** | 18% - 28% | 35%+ | Canaintex |
| **Rendimiento de Tela (Yield)**| 82% - 88% | 94%+ | Interno |
| **Tiempo de Setup (Cambio)**| 45 - 90 min | < 15 min (SMED) | Canaintex |
| **Productividad (Pzas/Hr)** | 12 - 18 | 25+ | INEGI |
| **Días de Cuentas por Cobrar**| 60 - 90 días | < 45 días | Canaintex |

## Análisis de Brechas (Gap Analysis)
- **Rendimiento de Tela**: La mayor pérdida en el sector ocurre en el corte. Una PyME que no utiliza software de optimización de trazo suele perder entre 10% y 15% de su capital directamente en el bote de basura.
- **Tiempos de Setup**: En plantas de teñido o tejido, los cambios de color/hilo son el principal cuello de botella. La falta de estandarización en estos cambios reduce la capacidad instalada en un 20%.

## Contexto Regional
Puebla concentra el mayor cluster textil del país. La competencia con productos de importación asiática obliga a las PyMEs locales a competir por **velocidad de entrega (Lead Time)** y **calidad de acabado**, más que por precio puro.

## Uso para el Agente Analyst
Si el rendimiento de tela del cliente es < 85%, el Agente Analyst debe cruzar este dato con el [[patron-merma-no-rastreada]] y proponer una auditoría de trazo y corte.
