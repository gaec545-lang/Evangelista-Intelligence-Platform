---
id: "EVK-PLAY-005"
title: "Playbook Agroindustria — Trazabilidad y Gestión de Perecederos"
type: playbook
version: "1.0"
domain: ["agriculture", "traceability", "quality-control"]
sector: ["agroindustria", "alimentos"]
agent_access: [process, data_eng, financial]
confidence: high
source: evangelista-methodology
last_validated: 2026-03-30
parent: ""
related: ["patron-duplicados-lote", "caso-alimentos-puebla-sana"]
depends_on: []
tags: ["agroindustria", "trazabilidad", "caducidad", "cofepris"]
status: active
last_ingested: null
chunk_count: null
---

# Playbook Agroindustria — Trazabilidad y Gestión de Perecederos

## Perfil del Cliente Típico (Evangelista Target)
- **Tamaño**: Empacadora, procesadora o distribuidora de productos frescos/congelados.
- **Operación**: Alto volumen, márgenes bajos, ciclos de vida cortos.
- **Sistema**: ERP genérico (a veces sin módulo de lotes activo).
- **Factor Γ (Vibración)**: 1.5 - 2.5 (Complejidad media, riesgo biológico alto).

## El "Dolor" Principal
"La trazabilidad de lotes es una pesadilla manual. Si COFEPRIS o un cliente de exportación nos pide el historial de un lote defectuoso, tardamos 3 días en armar el Excel y siempre hay huecos."

## Hallazgos Frecuentes en Auditoría Foundation

### 1. Trazabilidad "Inversa" Inexistente
- **Hallazgo**: La empresa sabe a quién le vendió, pero no puede identificar rápidamente qué materia prima (y de qué proveedor) se usó para ese producto específico (Forward vs Backward Traceability).
- **Riesgo**: Recall masivo de producto por no poder aislar el lote contaminado.

### 2. Merma por Caducidad Oculta (FEFO No Aplicado)
- **Definición**: El almacén despacha lo primero que tiene a la mano (FIFO) en vez de lo primero que está por caducar (First-Expired, First-Out).
- **Impacto**: Pérdidas recurrentes de producto terminado que "se queda al fondo del anaquel".

### 3. Falta de Control de Humedad/Temperatura en Datos
- El sistema no integra lecturas de sensores de cámara fría, por lo que la merma se justifica como "natural" cuando podría haber sido una falla técnica de 2 horas en refrigeración.

## Solución Architecture / Sentinel

### 1. Genealogía de Lote Digital
El Agente `data_eng` debe configurar una base de datos que vincule:
`Recibo de Campo -> ID de Tolva/Proceso -> ID de Lote de Empaque -> ID de Embarque`.

### 2. Alertas de Caducidad Proactiva
Sentinel debe emitir alertas cuando un lote esté a 15 días de su fecha de vencimiento, sugiriendo automáticamente una promoción de venta o un cambio de canal de distribución.

## KPIs Críticos para el Dashboard
1. **Traceability Score**: Tiempo promedio en reconstruir un historial de lote (Meta: < 60 minutos).
2. **% Merma por Caducidad sobre Ventas**: Cuantificación directa de la ineficiencia logística.
3. **Cumplimiento de Cadena de Frío**: % de tiempo que los sensores se mantuvieron en rango durante el tránsito.

## Resumen para Agentes
La agroindustria es una carrera contra el reloj. Sin trazabilidad automatizada, la PyME está a un error sanitario de la quiebra. El agente `process` debe implementar auditorías de [[patron-duplicados-lote]] semanalmente.
