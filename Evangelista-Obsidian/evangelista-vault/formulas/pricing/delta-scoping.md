---
id: "EVK-FOR-006"
title: "Delta Scoping — Ajuste de Alcance por Descubrimientos en Foundation"
type: formula
version: "1.0"
domain: [finanzas, procesos]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [financial, pm, analyst]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: ""
related: ["foundation-pricing", "architecture-pricing", "factor-gamma-system"]
depends_on: ["foundation-pricing", "factor-gamma-system"]
tags: [pricing, foundation, architecture, factor-gamma]
status: active
last_ingested: null
chunk_count: null
---

# Delta Scoping — Ajuste de Alcance por Descubrimientos en Foundation

## ¿Qué es el Delta Scoping?

El Delta Scoping es el proceso de ajuste de precio y alcance que ocurre cuando Foundation descubre, durante el análisis, que la complejidad real del proyecto es mayor a la estimada en el Scoping de la Cita 1.

La fórmula del Delta Scoping es:

```
ΔP = P_ajustado - P_original

Donde:
P_ajustado = $35,000 × (1 + α_real + β_real) + viáticos + fuentes_adicionales
P_original = Precio cotizado en Cita 1
```

## Cuándo se activa el Delta Scoping

El Delta Scoping se activa cuando durante la Fase A (análisis remoto) el CTO descubre:

1. **Más fuentes de datos de las declaradas**: El cliente dijo "solo SAP" pero tiene un sistema adicional con datos críticos
2. **Factor β real > Factor β estimado**: Los datos están más desordenados de lo que parecía en la Cita 1
3. **Volumen de registros mucho mayor**: El cliente subestimó el volumen de transacciones
4. **Nodo crítico adicional**: Se descubre un segundo nodo problemático que no se puede ignorar

## Protocolo de Comunicación del Delta

El CEO comunica el Delta al cliente **antes** de la Cita 2 (visita presencial), nunca durante o después:

> "Al iniciar el análisis remoto, encontramos [descripción del hallazgo que cambia el alcance]. Esto requiere ajustar el alcance de Foundation a [descripción ajustada] con un costo adicional de $[ΔP] MXN. ¿Confirmamos el nuevo alcance antes de continuar?"

## Rangos típicos del Delta

| Causa del Delta | ΔP típico |
|----------------|-----------|
| 1 fuente adicional | +$5,000 MXN |
| β real = 0.6 vs. β estimado = 0.3 | +$8,750 MXN |
| Volumen 10x mayor al estimado | +$5,000 – $10,000 MXN |
| Nodo crítico adicional | Nuevo contrato Foundation |

El Delta nunca es retroactivo: se comunica y se aprueba antes de incurrir en el trabajo adicional.
