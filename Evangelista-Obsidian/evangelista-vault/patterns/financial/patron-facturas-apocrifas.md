---
id: "EVK-PAT-FIN-004"
title: "Patrón de Hallazgo — Facturas Apócrifas (Empresas Fantasma)"
type: pattern
version: "1.0"
domain: ["finance", "tax-compliance", "audit"]
sector: ["general"]
agent_access: [data_eng, financial]
confidence: high
source: evangelista-methodology
last_validated: 2026-03-30
parent: ""
related: ["sentinel-fraud-detection", "caso-columbia-financial-forensics"]
depends_on: []
tags: ["sat", "69-b", "efo", "edp", "tax-fraud", "mexico"]
status: active
last_ingested: null
chunk_count: null
---

# Patrón de Hallazgo — Facturas Apócrifas (Empresas Fantasma)

## Definición
Ocurre cuando la empresa recibe y registra facturas de proveedores que han sido listados por el SAT en el listado 69-B (EFOs - Empresas que Facturan Operaciones Inexistentes). Es el riesgo fiscal de mayor impacto en México (delito penal).

## Cómo Detectar (Protocolo Data Eng)
1. **Bóveda Fiscal**: Sincronizar todos los UUIDs de facturas recibidas de los últimos 5 años en el Data Warehouse.
2. **Cruce Sentinel-SAT**: Cruzar semanalmente el RFC de la lista de proveedores (`OCRD` en SAP, `CLIE01` en SAE) contra el JSON oficial del listado 69-B del SAT (disponible vía API o descarga masiva).
3. **Query de Detección**: `SELECT SupplierName FROM Vendors WHERE RFC IN (SELECT RFC FROM SAT_BlackList_69B)`.

## Cuantificación del Impacto (Protocolo Financial)
- **Costo Directo**: 100% del monto facturado (que deja de ser deducible) + multas de hasta el 75% del valor de la factura + recargos.
- **Riesgo Total**: El impacto financiero suele ser **4x el monto de las facturas detectadas** tras una auditoría del SAT.

## Causa Raíz más Común
- **Falta de Vigilancia**: Se contrata un proveedor sin verificar su estatus fiscal actualizado.
- **Evasión Deliberada**: Compra de facturas para reducir artificialmente la base gravable.

## Solución Architecture / Sentinel
1. **Bloqueo Inteligente**: Sentinel impide que el departamento de tesorería procese el pago a cualquier RFC que aparezca en la lista negra del SAT.
2. **Monitor Histórico**: Notificación inmediata si un proveedor que "estaba limpio" hace un año es subido hoy a la lista de EFOs, permitiendo a la empresa presentar una corrección voluntaria antes de que el SAT notifique.

## Wikilinks y Referencias
- Ver [[sentinel-fraud-detection]].
- Caso de referencia: [[caso-columbia-financial-forensics]].
