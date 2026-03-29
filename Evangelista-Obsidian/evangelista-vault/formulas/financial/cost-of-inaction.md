---
id: "EVK-FOR-007"
title: "Costo de la Inacción — Herramienta de Cierre Comercial"
type: formula
version: "1.0"
domain: [finanzas]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [financial, analyst]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: ""
related: ["roi-npv-irr", "success-fee-calc", "caso-textiles-atoyac"]
depends_on: ["roi-npv-irr"]
tags: [finanzas, architecture, pricing, argumento-venta]
status: active
last_ingested: null
chunk_count: null
---

# Costo de la Inacción — Herramienta de Cierre Comercial

## Definición

```
Costo de Inacción Diario  = Ahorro Anual / 365
Costo de Inacción Mensual = Ahorro Anual / 12
Costo de Inacción Semanal = Ahorro Anual / 52
```

El Costo de la Inacción convierte el tiempo de decisión del cliente en dinero. Es la herramienta de cierre más poderosa de Evangelista porque transforma la pregunta "¿cuándo empezamos?" en "¿cuánto más vamos a perder antes de empezar?".

## Ejemplo — Textiles Atoyac

```
Ahorro Anual = $3,159,300 MXN

Costo de Inacción Mensual = $3,159,300 / 12 = $263,275 MXN/mes
Costo de Inacción Semanal = $3,159,300 / 52 = $60,756 MXN/semana
Costo de Inacción Diario  = $3,159,300 / 365 = $8,656 MXN/día
```

## Cómo Presentarlo en la Cita 4

El CEO lo introduce al final de la presentación, cuando el cliente dice "lo voy a pensar":

> "Completamente válido, es una decisión importante. Lo que sí me gustaría dejar claro es que cada semana que pasan considerando la propuesta, la operación sigue perdiendo $60,756 MXN en los costos que ya identificamos y cuantificamos juntos. No es presión — es simplemente la aritmética del problema."

**Pausa. No agregar nada más. Dejar que el cliente procese el número.**

## Variante: Costo de Inacción Acumulado

Para clientes que piden tiempo adicional de evaluación (ej. 30, 60, 90 días):

| Días de Evaluación | Costo Acumulado (Atoyac) |
|-------------------|--------------------------|
| 15 días | $129,863 MXN |
| 30 días | $259,726 MXN |
| 60 días | $519,452 MXN |
| 90 días | $779,178 MXN |

> "Si necesitan 30 días para revisar la propuesta, perfecto. Solo para contexto: en esos 30 días, el costo acumulado de los problemas identificados será de $259,726 MXN adicionales."

## Cuándo NO usar el Costo de Inacción

- No usarlo en Cita 1 o Cita 2 — aún no hay números reales
- No usarlo de forma agresiva o repetida — pierde efectividad
- No usarlo si el Sponsor no estuvo en la presentación y necesita "consultar con su socio" — en ese caso, el problema no es tiempo sino autoridad de decisión
