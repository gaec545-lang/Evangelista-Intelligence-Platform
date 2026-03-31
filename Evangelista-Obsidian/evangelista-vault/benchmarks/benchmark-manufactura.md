---
id: "EVK-BENCH-001"
title: "Benchmark Sectorial — Manufactura en México"
type: benchmark
version: "1.0"
domain: ["industry", "kpi", "economics"]
sector: ["manufactura"]
agent_access: [analyst, financial]
confidence: high
source: "INEGI, Canacintra, Concamin, Evangelista-Internal"
last_validated: 2026-03-30
parent: ""
related: ["lean-manufacturing-vsm", "patron-reprocesos"]
depends_on: []
tags: ["benchmark", "manufactura", "oee", "kpis-mexico"]
status: active
last_ingested: null
chunk_count: null
---

# Benchmark Sectorial — Manufactura en México

## Introducción
Este documento proporciona las métricas estándar para PyMEs del sector manufacturero en México. Estas cifras sirven como línea base (Baseline) para comparar el rendimiento de nuestros clientes durante la auditoría Foundation.

## Métricas Clave de Rentabilidad y Eficiencia

| KPI | Promedio PyME MX | Clase Mundial (World Class) | Fuente |
|-----|------------------|-----------------------------|--------|
| **Margen Bruto** | 25% - 35% | 40%+ | Canacintra |
| **OEE (Eficiencia Global)**| 45% - 55% | 85%+ | Concamin |
| **Merma Materia Prima** | 3% - 8% | < 1% | INEGI |
| **Días de Inventario** | 45 - 90 días | < 30 días | ANTAD / Interno |
| **Rotación de Personal** | 8% - 15% anual | < 3% anual | INEGI |
| **Costo Logístico / Ventas**| 12% - 18% | < 8% | Concamin |

## Análisis de Brechas (Gap Analysis)
- **OEE**: El 80% de las PyMEs mexicanas operan a la mitad de su capacidad real por falta de mantenimiento preventivo y paros no programados. Una mejora del 10% en OEE suele representar un incremento del 20% en la utilidad neta.
- **Merma**: Una merma superior al 5% en manufactura metálica o de alimentos indica debilidad en el control de piso o falta de estandarización en la receta (BOM).

## Contexto Regional (Puebla / Centro)
En el corredor industrial Puebla-Tlaxcala, la rotación de personal operativo puede dispararse hasta el 20% en temporadas de alta demanda automotriz, afectando directamente la curva de aprendizaje y la calidad de la manufactura.

## Uso para el Agente Analyst
Si los datos del cliente muestran un OEE menor al 40%, el Agente Analyst debe priorizar el diagnóstico mediante el [[patron-cuello-botella]] y sugerir una intervención de [[lean-manufacturing-vsm]].
