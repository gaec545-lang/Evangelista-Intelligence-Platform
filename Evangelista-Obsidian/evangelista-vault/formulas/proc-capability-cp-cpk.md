---
id: "EVK-FORM-002"
title: "Capacidad de Proceso (Cp y Cpk) en Monitoreo Sentinel"
type: framework
version: "1.0"
domain: [procesos]
sector: [manufactura, textiles, alimentos]
agent_access: [process, all]
confidence: high
source: evangelista
last_validated: 2026-03-29
parent: ""
related: ["dmaic-control", "sentinel-monitoring"]
depends_on: []
tags: [procesos, calidad, estadistica, cp, cpk, varianza]
status: active
last_ingested: null
chunk_count: null
---

# Capacidad de Proceso (Cp y Cpk) en Monitoreo Sentinel

## Definición Técnica

Los índices **Cp** y **Cpk** miden qué tan capaz es un proceso de mantenerse dentro de los límites de especificación definidos por el cliente (Customer Specifications).

- **Cp (Capacidad Potencial)**: Indica si el proceso puede cumplir si estuviera perfectamente centrado.
- **Cpk (Capacidad Real)**: Indica si el proceso está cumpliendo actualmente, ajustado por el centrado de la media.

## Fórmulas de Control

```
Cp = (LSE - LIE) / (6 × σ)
Cpk = Min [ (Media - LIE) / (3 × σ) ; (LSE - Media) / (3 × σ) ]
```

Donde:
- **LSE**: Límite Superior de Especificación (ej. Máximo 5% de merma).
- **LIE**: Límite Inferior de Especificación (ej. Mínimo 0.5% de merma).
- **σ (Sigma)**: Desviación estándar del proceso.
- **Media**: Promedio real medido por Sentinel.

## Interpretación para el Agente Process

| Valor Cpk | Significado | Acción Sugerida |
|-----------|-------------|-----------------|
| < 1.00 | No capaz | **Urgente**: Iniciar ciclo DMAIC (Define) |
| 1.00 - 1.33 | Marginal | Monitoreo Sentinel intensivo (Muestreo +50%) |
| 1.33 - 1.67 | Capable (Satisfactorio) | Mantener Sentinel estándar |
| > 1.67 | Six Sigma Level | Optimizar costos de monitoreo |

## Uso en el Dictamen Forense (Foundation)

El **ProcessAgent** usa el Cpk histórico para demostrar que, aunque el promedio parezca "bueno", la variabilidad está destruyendo valor.

> [!TIP] El Cpk es para el Director
> Mientras que el operador ve "si el lote salió bien", el Director ve si su **planta es capaz** de repetir el éxito. Un Cpk bajo es un argumento de venta directo para **Architecture**.

## Cálculo en Qdrant

Sentinel realiza este cálculo diariamente sobre los chunks de datos temporales recibidos en el Data Warehouse. Si el Cpk móvil de 7 días cae por debajo de 1.1, se dispara la alerta de Nivel 2.
