---
id: "EVK-TECH-002"
title: "Star Schema — Modelo Dimensional de Inventario"
type: technical-framework
version: "1.0"
domain: ["data-engineering", "modeling", "inventory"]
sector: ["general"]
agent_access: [data_eng, analyst]
confidence: high
source: evangelista-architecture
last_validated: 2026-03-30
parent: "star-schema-ventas"
related: ["star-schema-ventas", "patron-inventario-fantasma"]
depends_on: []
tags: ["inventory-modeling", "stock-aging", "warehouse-data"]
status: active
last_ingested: null
chunk_count: null
---

# Star Schema — Modelo Dimensional de Inventario

## Introducción
El modelo de inventario debe permitir responder no solo "cuánto hay", sino "cuál es el estado y la calidad de ese capital". Se basa en los movimientos físicos de almacén (`IGE1`/`IGN1` en SAP).

## La Tabla de Hechos (Fact Table): `fact_movimientos_inv`
Registra cada entrada, salida y transferencia.

### Estructura DDL
```sql
CREATE TABLE fact_movimientos_inv (
    movimiento_id BIGINT PRIMARY KEY,
    fecha_id INT,           -- FK dim_fecha
    producto_id INT,        -- FK dim_producto
    almacen_id INT,         -- FK dim_almacen
    tipo_movimiento_id INT, -- FK dim_tipo_movimiento (Entrada, Salida, Traspaso, Ajuste)
    cantidad DECIMAL(18,4),
    costo_unitario_mxn DECIMAL(18,2),
    monto_total_mxn AS (cantidad * costo_unitario_mxn),
    lote_id VARCHAR(50)     -- Llave para trazabilidad
);
```

## KPIs Principales Derivables
1. **Días de Inventario**: `(Stock Promedio / Costo de Venta Diario)`.
2. **Rotación**: `Ventas / Stock Promedio`.
3. **Shrinkage Rate (Merma %)**: `Σ Ajustes Negativos / Stock Total`.
4. **Valorización ABC**: Clasificación automática de SKUs por valor de capital inmovilizado.

## Resumen para Agentes
Este modelo permite al agente `data_eng` detectar el patrón de [[patron-inventario-fantasma]] al cruzar los "ajustes de inventario" manuales contra las existencias proyectadas.
