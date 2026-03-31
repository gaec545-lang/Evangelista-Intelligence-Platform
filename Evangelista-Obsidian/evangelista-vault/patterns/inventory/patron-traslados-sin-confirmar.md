---
id: "EVK-PAT-INV-002"
title: "Patrón de Hallazgo — Traslados sin Confirmar (Tránsito Eterno)"
type: pattern
version: "1.0"
domain: ["inventory", "logistics", "data-integrity"]
sector: ["distribucion", "retail-multi-sucursal"]
agent_access: [data_eng, financial, process]
confidence: high
source: evangelista-methodology
last_validated: 2026-03-30
parent: ""
related: ["patron-inventario-fantasma", "caso-distribuidora-aurora"]
depends_on: []
tags: ["in-transit", "transfer-leak", "logistics-audit", "puebla"]
status: active
last_ingested: null
chunk_count: null
---

# Patrón de Hallazgo — Traslados sin Confirmar (Tránsito Eterno)

## Definición
El "Tránsito Eterno" se da cuando se registra una salida de mercancía de un Almacén A hacia un Almacén B (Transferencia), pero el Almacén B nunca registra la entrada. La mercancía queda en un "limbo" contable que oculta mermas de transporte o robo sistemático en ruta.

## Cómo Detectar (Protocolo Data Eng)
1. **Cruce de Documentos**: Buscar en el ERP registros de Salida por Traspaso (`StockTransfer` out) que no tengan un documento espejo de Entrada por Traspaso (`StockTransfer` in) vinculado.
2. **Ventana de Tiempo**: Marcar como hallazgo cualquier traslado abierto por más de 48 horas (en entregas locales/estatales).
3. **En SAP B1**: Tabla `OWTR` (Cabecera de Transferencia) donde `DocStatus = 'O'` y la fecha de creación es superior a `T+2`.

## Cuantificación del Impacto (Protocolo Financial)
Este patrón oculta el "Shrinkage" (merma) de la cadena de suministro.
- **Fórmula**: `Σ (Monto total de traslados abiertos > 48h) × Tasa de Merma Histórica`.
- **Referencia**: Caso [[caso-distribuidora-aurora]], donde se detectaron **$4.8M MXN** en traslados abiertos que eran, en realidad, robos del personal de logística.

## Causa Raíz más Común
- Falta de un protocolo de "Cierre de Traslado": El chofer entrega la mercancía pero el bodeguero receptor no "da clic" en el sistema.
- **Triangulación**: Robo de mercancía en el trayecto que se intenta ocultar manteniendo el documento "abierto" hasta que el sistema lo archive por antigüedad.

## Solución Architecture / Sentinel
1. **Radar de Tránsito**: Dashboards en Sentinel que visualizan en rojo los folios de transferencia que superan el tiempo de tránsito estándar.
2. **Cierre por Escaneo**: No se considera entregado el producto hasta que el almacén receptor escanee el código de barras de llegada, disparando el cierre automático en el ERP.

## Wikilinks y Referencias
- Ver [[logistics-route-optimization]] para prevención en ruta.
- Caso de referencia: [[caso-distribuidora-aurora]].
