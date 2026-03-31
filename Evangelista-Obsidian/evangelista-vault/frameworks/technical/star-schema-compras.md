---
id: "EVK-TECH-004"
title: "Star Schema — Modelo Dimensional de Compras y Suministro"
type: technical-framework
version: "1.0"
domain: ["data-engineering", "modeling", "procurement"]
sector: ["general"]
agent_access: [data_eng, analyst]
confidence: high
source: evangelista-architecture
last_validated: 2026-03-30
parent: "star-schema-ventas"
related: ["patron-fraccionamiento", "patron-facturas-apocrifas"]
depends_on: []
tags: ["procurement-modeling", "supplier-performance", "spend-analytics"]
status: active
last_ingested: null
chunk_count: null
---

# Star Schema — Modelo Dimensional de Compras y Suministro

## Introducción
El modelo de compras analiza el **Spend Analysis** y el desempeño de los proveedores. Es vital para detectar fraudes y optimizar el costo de adquisición.

## La Tabla de Hechos (Fact Table): `fact_compras`

### Estructura DDL
```sql
CREATE TABLE fact_compras (
    purchase_id BIGINT PRIMARY KEY,
    fecha_id INT,           -- FK dim_fecha
    proveedor_id INT,       -- FK dim_proveedor
    producto_id INT,        -- FK dim_producto
    cantidad DECIMAL(18,2),
    monto_unitario_mxn DECIMAL(18,2),
    monto_total_mxn DECIMAL(18,2),
    fecha_prometida DATE,
    fecha_real_entrega DATE,
    lead_time_dias AS (DATEDIFF(day, fecha_prometida, fecha_real_entrega))
);
```

## KPIs Principales Derivables
1. **Lead Time Promedio**: Confiabilidad del proveedor.
2. **Concentración de Proveedores**: `% de compra al Top 3 proveedores`.
3. **Cumplimiento de Entregas (OTIF)**: On-Time In-Full.
4. **Varianza de Compra**: Comparativa del precio pagado hoy vs precio histórico.

## Resumen para Agentes
Este esquema alimenta los radares forenses para el [[patron-fraccionamiento]] y permite al agente `financial` negociar mejores descuentos master con proveedores estratégicos.
