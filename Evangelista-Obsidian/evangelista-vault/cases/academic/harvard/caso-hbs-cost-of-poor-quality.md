---
id: "EVK-CASE-009"
title: "Adaptación Juran/HBS — El Costo de la Pobre Calidad (COPQ)"
type: case
version: "1.0"
domain: ["quality-control", "lean", "forensics"]
sector: ["manufactura", "alimentos"]
agent_access: [all]
confidence: high
source: academic-juran
last_validated: 2026-03-30
parent: ""
related: ["dmaic-framework", "data-profiling-protocol"]
depends_on: []
tags: ["copq", "prevention-cost", "juran-institute", "retrabajo"]
status: active
last_ingested: null
chunk_count: null
---

# Adaptación Juran/HBS — El Costo de la Pobre Calidad (COPQ)

## Contexto del Caso Original (Juran Institute)

El concepto de "Cost of Poor Quality" desarrollado por Joseph Juran postula que la mayoría de las empresas solo ven los costos obvios de la mala calidad (rechazos), pero ignoran la "masa sumergida del iceberg": retrabajos, inspecciones excesivas, pérdida de lealtad del cliente y garantías. El costo de la prevención siempre es menor al costo de la falla.

## Adaptación al Contexto PyME Mexicana

En la PyME manufacturera tradicional en México, la calidad se ve como un "gasto" necesario para evitar que el cliente regrese el producto, no como un motor de rentabilidad. El error común es tener un "departamento de calidad" al final de la línea que separa lo bueno de lo malo, en lugar de controlar el proceso.

### Escenario Adaptado: Fabricante de Envases Plásticos
- **Problema:** Tasa de rechazo del 12% en el cliente final.
- **Visión del Dueño:** "Es normal por el desgaste de los moldes".
- **Realidad detectada por Evangelista:** La variabilidad no es mecánica, es de proceso.

## Hallazgos con Enfoque Evangelista

### Hallazgo H-01 — La Masa Sumergida del COPQ
**Descripción técnica:**
Mediante [[data-profiling-protocol]], se cruzaron las horas extra reportadas en nómina con las órdenes de producción que tuvieron rechazos. Se descubrió que el 25% de la nómina nocturna se dedicaba exclusivamente a "retrabajar" piezas deformes de la mañana.

**Impacto financiero:**
- Costo de retrabajo oculto: **$780,000 MXN/año**.
- Causa raíz: Los supervisores no registran el retrabajo como una falla, sino como "cumplimiento de cuota".

### Hallazgo H-02 — Costo de Inspección Reactiva
**Descripción técnica:**
Análisis de tiempos. Se detectó que el 15% del tiempo de ciclo de cada pieza se perdía en una inspección visual 100% manual por falta de confianza en la calibración inicial.

**Impacto financiero:**
- Pérdida de capacidad instalada: **$450,000 MXN/año**.
- Causa raíz: Falta de control estadístico de proceso (SPC) en tiempo real.

## Solución Basada en Vanguard

Evangelista implementa un tablero de **Métricas de No-Calidad** en Sentinel:
1. **Detección de Patrones:** Correlación entre la temperatura de inyección y la tasa de rechazo reportada 2 horas después.
2. **Costo Real por Pieza:** Inclusión automática del costo de "energía y mano de obra de retrabajo" en el costo unitario real.
3. **Prevención Basada en Datos:** Alerta de "Desviación de Proceso" automática cuando los sensores detectan que el parámetro se aleja de la norma, *antes* de que se produzca la pieza defectuosa.

## Lecciones para los Agentes Especialistas

- **Para Process Specialist:** Usar el [[dmaic-framework]] con enfoque en la etapa "Improve" para estabilizar los parámetros de proceso.
- **Para Financial Specialist:** El COPQ es una de las mayores fugas de efectivo invisibles. Debe incluirse en todo dictamen forense.
- **Argumento de Venta:** "Producir bien a la primera no es solo calidad, es el aumento directo del 15% en su flujo de caja".
