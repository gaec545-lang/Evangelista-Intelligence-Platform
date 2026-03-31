---
id: "EVK-PAT-OPE-001"
title: "Patrón de Hallazgo — Reprocesos (Trabajo Doble)"
type: pattern
version: "1.0"
domain: ["operations", "quality", "efficiency"]
sector: ["manufactura", "textil", "servicios"]
agent_access: [data_eng, process, financial]
confidence: high
source: evangelista-methodology
last_validated: 2026-03-30
parent: ""
related: ["lean-manufacturing-vsm", "caso-hbs-cost-of-poor-quality"]
depends_on: []
tags: ["rework", "quality-loss", "copq", "oee"]
status: active
last_ingested: null
chunk_count: null
---

# Patrón de Hallazgo — Reprocesos (Trabajo Doble)

## Definición
Ocurre cuando una orden de producción o un servicio no cumple con los estándares de calidad a la primera y debe ser "re-trabajado" para corregir errores. Es una de las formas de desperdicio más costosas porque consume el doble de capacidad instalada y energía, pero genera los mismos ingresos.

## Cómo Detectar (Protocolo Data Eng)
1. **Status de Órdenes**: Identificar en el ERP órdenes de producción (`OWOR` en SAP o `OT` en Aspel) que tengan el status "Re-procesado", "Corregido" o que tengan múltiples entradas de tiempo para el mismo SKU.
2. **Ratio de Calidad**: `Ratio = (Órdenes con retrabajo / Total órdenes del periodo)`.
3. **Indicador Clave**: First Pass Yield (FPY). Si FPY < 90%, el patrón de reproceso es crítico.

## Cuantificación del Impacto (Protocolo Financial)
Forma parte de la masa sumergida del Iceberg de la Calidad.
- **Fórmula**: `Σ (Horas de reproceso × Costo hora hombre) + (Materia prima desperdiciada en reproceso)`.
- **Costo Promedio**: En PyMEs manufactureras en Puebla, el reproceso suele devorar entre **5 y 7 puntos porcentuales** del margen neto anual.

## Causa Raíz más Común
- **Instrucciones Verbales**: Falta de fichas técnicas o recetas estandarizadas en sistema.
- **Maquinaria Descalibrada**: Sensores o herramientas fuera de rango que no se detectan hasta el control de calidad final.

## Solución Architecture / Sentinel
1. **Detección Temprana en Piso**: Implementar el protocolo [[dmaic-measure]] usando tablets industriales para que el operario reporte el rechazo en el momento que ocurre, no al final del turno.
2. **Dashboard de COPQ**: Sentinel visualiza el Cost of Poor Quality (COPQ) acumulado por semana, permitiendo ajustes preventivos en la calibración de activos.

## Wikilinks y Referencias
- Ver [[caso-hbs-cost-of-poor-quality]].
- Ver [[lean-manufacturing-vsm]] (Mapeo de Flujo de Valor).
