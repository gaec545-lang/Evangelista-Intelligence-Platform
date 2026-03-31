---
id: "EVK-PAT-OPE-002"
title: "Patrón de Hallazgo — Cuello de Botella (Restricción Sistémica)"
type: pattern
version: "1.0"
domain: ["operations", "process-design", "constraints"]
sector: ["manufactura", "logistica", "servicios"]
agent_access: [data_eng, process]
confidence: high
source: evangelista-methodology
last_validated: 2026-03-30
parent: ""
related: ["lean-manufacturing-vsm", "caso-sorbonne-process-reengineering"]
depends_on: []
tags: ["bottleneck", "toc", "wip", "lead-time"]
status: active
last_ingested: null
chunk_count: null
---

# Patrón de Hallazgo — Cuello de Botella (Restricción Sistémica)

## Definición
Basado en la Teoría de Restricciones (TOC), el cuello de botella es la estación o proceso que tiene la menor capacidad de salida y, por lo tanto, determina el ritmo de toda la empresa. Todo el inventario acumulado (WIP) se encuentra justo antes de esta restricción.

## Cómo Detectar (Protocolo Data Eng)
1. **Análisis de WIP**: Identificar en el almacén de producción (WIP Warehouse) dónde se concentra la mayor cantidad de piezas semi-terminadas por más de un turno completo.
2. **Timestamp Analysis**: Medir el tiempo entre `Entrada a Estación` y `Salida de Estación`. La estación con el mayor tiempo promedio de ciclo es el cuello de botella.
3. **Indicador**: Takt Time vs Cycle Time.

## Cuantificación del Impacto (Protocolo Process)
- El costo del cuello de botella es el **Ingreso Perdido (Throughput)** por no poder procesar la demanda existente.
- Un minuto perdido en el cuello de botella es un minuto perdido para toda la planta.
- **Caso Referencia**: [[caso-sorbonne-process-reengineering]].

## Causa Raíz más Común
- **Falta de Capacidad Balanceada**: Compra de una máquina rápida pero con una alimentación manual lenta.
- **Falta de Mantenimiento Preventivo**: La estación crítica falla frecuentemente por falta de refacciones.

## Solución Architecture / Sentinel
1. **Control de Flujo (Drum-Buffer-Rope)**: Sentinel programa la carga de trabajo de toda la planta basándose exclusivamente en el ritmo del cuello de botella, evitando la sobre-producción inútil en las estaciones rápidas.
2. **Buffer de Protección**: Implementar un stock de seguridad justo antes del cuello de botella para asegurar que nunca se detenga por falta de material.

## Wikilinks y Referencias
- Ver [[caso-sorbonne-process-reengineering]].
- Ver [[lean-manufacturing-vsm]] (Identificación de desperdicios).
