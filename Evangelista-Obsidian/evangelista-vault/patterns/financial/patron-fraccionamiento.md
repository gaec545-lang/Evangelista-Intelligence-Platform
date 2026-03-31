---
id: "EVK-PAT-FIN-001"
title: "Patrón de Hallazgo — Fraccionamiento de Compras"
type: pattern
version: "1.0"
domain: ["finance", "procurement", "audit"]
sector: ["general"]
agent_access: [data_eng, financial]
confidence: high
source: evangelista-methodology
last_validated: 2026-03-30
parent: ""
related: ["benford-law-protocol", "sentinel-fraud-detection"]
depends_on: []
tags: ["procurement-fraud", "audit-pattern", "benford-law", "puebla"]
status: active
last_ingested: null
chunk_count: null
---

# Patrón de Hallazgo — Fraccionamiento de Compras

## Definición
Ocurre cuando el área de compras o un departamento solicitante divide una compra grande que requiere autorización de la dirección en múltiples facturas pequeñas que caen justo por debajo del límite de aprobación automática.

## Cómo Detectar (Protocolo Data Eng)
1. **Identificación de Umbrales**: Identificar en el ERP el monto a partir del cual se requiere firma del DG (ej. $20,000 MXN).
2. **Radar de Benford**: Aplicar la [[benford-law]] a los montos de facturación de proveedores recurrentes. Buscar concentración anómala en los dígitos que componen montos cercanos al umbral (ej. una masa estadística de facturas de entre $18k y $19.5k).
3. **Query de Frecuencia**: `SELECT Supplier, COUNT(*) FROM Invoices WHERE Amount BETWEEN 18000 AND 19999 GROUP BY Supplier`.

## Cuantificación del Impacto (Protocolo Financial)
El impacto es el **Sobreprecio por pérdida de volumen**. Al comprar por partes, la empresa pierde la capacidad de negociar descuentos por volumen de escala.
- **Caso Referencia**: Arcom Textiles (Atoyac) — Se detectó una concentración del 40% de las facturas en el rango de $15K-$16K (umbral era $17K).
- **Ahorro potencial**: Reducción del 8-12% del costo de adquisición mediante consolidación de pedidos.

## Causa Raíz más Común
- Burocracia excesiva: El personal "fracciona" para evitar el tiempo de espera de la firma del DG.
- **Corrupción**: Convenio con el proveedor para emitir facturas pequeñas y evitar auditorías de compras mayores.

## Solución Architecture / Sentinel
1. **Consolidador de Cuentas**: Sentinel agrupa automáticamente todas las facturas de un mismo proveedor en un periodo de 30 días y notifica a la dirección si el total acumulado superó su umbral.
2. **Alerta Preventiva**: Bloqueo preventivo en el ERP si un proveedor intenta timbrar una segunda factura al mismo centro de costo en menos de 24h.

## Wikilinks y Referencias
- Ver [[benford-law-protocol]] para el fundamento matemático.
- Ver [[caso-hbs-financial-forensics]] para teoría avanzada.
