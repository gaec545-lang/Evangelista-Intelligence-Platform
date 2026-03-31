---
id: "EVK-PAT-INV-003"
title: "Patrón de Hallazgo — Duplicados de Lote"
type: pattern
version: "1.0"
domain: ["inventory", "data-integrity", "traceability"]
sector: ["alimentos", "farmoquimica", "manufactura"]
agent_access: [data_eng, process]
confidence: high
source: evangelista-methodology
last_validated: 2026-03-30
parent: ""
related: ["patron-inventario-fantasma", "caso-alimentos-puebla-sana"]
depends_on: []
tags: ["batch-duplicates", "traceability-leak", "data-corruption"]
status: active
last_ingested: null
chunk_count: null
---

# Patrón de Hallazgo — Duplicados de Lote

## Definición
Ocurre cuando el mismo identificador de lote (Batch ID) aparece registrado simultáneamente en dos ubicaciones físicas distintas o con fechas de caducidad diferentes. Es un síntoma de falla grave en la trazabilidad y riesgo de inocuidad alimentaria o legal.

## Cómo Detectar (Protocolo Data Eng)
1. **Query de Agregación**: `SELECT BatchID FROM InventoryTable GROUP BY BatchID HAVING COUNT(DISTINCT WarehouseID) > 1`.
2. **Validación de Fechas**: Cruzar lotes duplicados con su fecha de creación. Si el mismo ID de lote tiene fechas con > 30 días de diferencia, hay un error de re-etiquetado.

## Cuantificación del Impacto (Protocolo Process)
El impacto principal es el **Riesgo de Retiro de Producto (Recall)**.
- El costo de no poder trazar un lote defectuoso puede ser la clausura de la planta por COFEPRIS o multas de hasta el 5% de la facturación anual.

## Causa Raíz más Común
- **Re-etiquetado Manual**: Personal de almacén que imprime etiquetas de un lote existente para cubrir mercancía sin ID.
- **Falla en el ERP**: El sistema no valida la unicidad del lote al momento del ingreso.

## Solución Architecture / Sentinel
1. **Unicidad Obligatoria**: Implementación de un gatekeeper en la capa de datos que rechace ingresos de lotes que ya existen con stock activo.
2. **Trazabilidad Inversa**: Dashboard que permite rastrear un ID de lote desde el cliente hasta el proveedor de materia prima de forma inmediata.

## Wikilinks y Referencias
- Ver [[caso-alimentos-puebla-sana]] para impacto en sector alimentos.
- Ver [[sap-b1-audit-queries]] para búsqueda de lotes en SAP (Tablas OBTM / OBTQ).
