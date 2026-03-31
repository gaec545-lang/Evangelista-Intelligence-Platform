---
id: "EVK-PAT-INV-001"
title: "Patrón de Hallazgo — Inventario Fantasma"
type: pattern
version: "1.0"
domain: ["inventory", "forensics", "data-analysis"]
sector: ["retail", "manufactura", "distribucion"]
agent_access: [data_eng, financial, process]
confidence: high
source: evangelista-methodology
last_validated: 2026-03-30
parent: ""
related: ["sap-b1-audit-queries", "caso-alimentos-puebla-sana"]
depends_on: []
tags: ["ghost-inventory", "shrinkage", "audit-pattern", "capital-atrapado"]
status: active
last_ingested: null
chunk_count: null
---

# Patrón de Hallazgo — Inventario Fantasma

## Definición
Ocurre cuando el sistema ERP registra existencias (OnHand) de un SKU que físicamente no se encuentran en el almacén o están dañadas/no disponibles para venta. Es el principal síntoma de una mala gestión de mermas o robo hormiga.

## Cómo Detectar (Protocolo Data Eng)
1. **Diferencia de Conteo**: Comparar el campo `OnHand` del ERP (ej. tabla `OITW` en SAP o `INVE01` en Aspel) contra el último conteo físico cargado en la base de datos de auditoría.
2. **Threshold**: Si la diferencia es mayor al 5% del valor total del stock de ese SKU, se marca como Hallazgo Crítico.
3. **Query de Detección**: `SELECT SKU FROM Inventory WHERE SystemQty > PhysicalQty`.

## Cuantificación del Impacto (Protocolo Financial)
El impacto no es solo la pérdida del producto, sino el capital que la empresa cree que tiene disponible para flujo y que no existe.
- **Fórmula**: `(Unidades en Sistema - Unidades Físicas) × Costo Promedio del SKU`.
- **Costo Típico**: En una PyME mediana mexicana ($100M facturación), este hallazgo suele representar entre **$500k y $3.5M MXN** anuales en capital atrapado/perdido.

## Causa Raíz más Común
- Entradas de mercancía registradas sin verificación física.
- Devoluciones de clientes recibidas en sistema pero no re-ingresadas al almacén físico.
- **Robo Hormiga**: Extracción sistemática de bajas cantidades no detectables en el corto plazo.

## Solución Architecture / Sentinel
1. **Alerta de Varianza**: Notificar automáticamente al Gerente de Almacén cuando la varianza exceda el umbral de seguridad.
2. **Ciclo de Conteo Cíclico**: Implementar conteos semanales automáticos de los SKUs con mayor varianza histórica.
3. **Reconciliación Automatizada**: Sincronización del stock físico vía scanners QR directamente con la capa de Sentinel, puenteando la captura manual en el ERP.

## Wikilinks y Referencias
- Ver [[dmaic-measure]] para el protocolo de medición.
- Caso de referencia: [[caso-alimentos-puebla-sana]].
- Ver [[sap-b1-audit-queries]] para queries específicos de SAP B1.
