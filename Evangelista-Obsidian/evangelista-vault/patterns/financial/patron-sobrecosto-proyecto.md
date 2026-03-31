---
id: "EVK-PAT-FIN-002"
title: "Patrón de Hallazgo — Sobrecosto de Proyecto No Detectado"
type: pattern
version: "1.0"
domain: ["finance", "project-management", "costing"]
sector: ["construccion", "arquitectura", "manufactura-bajo-pedido"]
agent_access: [data_eng, financial, process]
confidence: high
source: evangelista-methodology
last_validated: 2026-03-30
parent: ""
related: ["caso-cibrian-arquitectos", "star-schema-ventas"]
depends_on: []
tags: ["project-costing", "budget-variance", "cost-overrun"]
status: active
last_ingested: null
chunk_count: null
---

# Patrón de Hallazgo — Sobrecosto de Proyecto No Detectado

## Definición
Ocurre cuando los costos reales acumulados de un proyecto o pedido especial exceden el presupuesto autorizado sin que el sistema genere una alerta temprana. Se detecta generalmente hasta el cierre contable, cuando ya no es posible recuperar el margen.

## Cómo Detectar (Protocolo Data Eng)
1. **Ratio de Alerta**: `% de Consumo = (Costo acumulado real / Presupuesto base)`.
2. **Punto Rojo**: Si `% de Consumo` > 1.10 y el proyecto no ha sido entregado en un 90%, el sobrecosto es inminente.
3. **Visibilidad en Base de Datos**: Join entre tabla de Presupuestos (`BGT1` en SAP) vs Gasto Real (`JDT1`).

## Cuantificación del Impacto (Protocolo Financial)
- **Costo Promedio**: En construcción/manufactura a medida en México, el sobrecosto no detectado suele ser del **15% al 25%** del margen esperado.
- **Caso Referencia**: [[caso-cibrian-arquitectos]], donde un desvío del 30% en materiales de una obra no se detectó hasta 3 meses después de ocurrida la compra.

## Causa Raíz más Común
- **Órdenes de Cambio Verbales**: El cliente pide cambios, el residente de obra los ejecuta y compra material, pero "se le olvida" subir la orden de cambio al sistema.
- **Compras sin Referencia a Proyecto**: Gastos de una obra cargados a la "Caja Chica General" para no afectar el presupuesto del residente.

## Solución Architecture / Sentinel
1. **Presupuesto Vivo**: Dashboard que muestra el semáforo (Verde/Amarillo/Rojo) de presupuesto por proyecto con actualización diaria.
2. **Candado de Compras**: El sistema de compras bloquea automáticamente órdenes de compra que no tengan un centro de costo o ID de proyecto con presupuesto remanente suficiente.

## Wikilinks y Referencias
- Ver [[star-schema-ventas]] para la estructura de la fact table de costos por proyecto.
- Caso de referencia: [[caso-cibrian-arquitectos]].
