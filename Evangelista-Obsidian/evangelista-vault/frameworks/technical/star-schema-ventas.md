---
id: "EVK-TECH-001"
title: "Star Schema — Modelo Dimensional de Ventas (EIP Standard)"
type: technical-framework
version: "1.0"
domain: ["data-engineering", "modeling", "power-bi"]
sector: ["general"]
agent_access: [data_eng, analyst]
confidence: high
source: evangelista-architecture
last_validated: 2026-03-30
parent: ""
related: ["star-schema-inventario", "star-schema-produccion"]
depends_on: []
tags: ["star-schema", "data-modeling", "fact-table", "dimensions", "sql"]
status: active
last_ingested: null
chunk_count: null
---

# Star Schema — Modelo Dimensional de Ventas (EIP Standard)

## Introducción
Para que la Evangelista Intelligence Platform (EIP) funcione con velocidad, el Agente Data Engineer debe transformar los datos planos del ERP en un modelo dimensional (Esquema Estrella). Esto optimiza el cálculo de KPIs masivos en Power BI y Sentinel.

## La Tabla de Hechos (Fact Table): `fact_ventas`
Registra cada transacción o línea de factura. Debe contener las llaves foráneas a las dimensiones y las métricas numéricas base.

### Estructura DDL (Ejemplo SQL)
```sql
CREATE TABLE fact_ventas (
    id BIGINT PRIMARY KEY,
    fecha_id INT,           -- FK dim_fecha
    cliente_id INT,         -- FK dim_cliente
    producto_id INT,        -- FK dim_producto
    vendedor_id INT,        -- FK dim_vendedor
    sucursal_id INT,        -- FK dim_sucursal
    cantidad DECIMAL(18,2),
    monto_bruto_mxn DECIMAL(18,2),
    descuentos_mxn DECIMAL(18,2),
    costo_mxn DECIMAL(18,2), -- Costo real al momento de la venta
    margen_mxn AS (monto_bruto_mxn - descuentos_mxn - costo_mxn)
);
```

## Las Dimensiones (Dimensions)

- **dim_fecha**: No usar solo la fecha del sistema. Debe incluir: Año, Mes, Trimestre, Semana del Año, Día de la semana, Si es festivo (México).
- **dim_cliente**: RFC, Razón Social, Clasificación (Estratégico/Recurrente), Región, Límite de Crédito.
- **dim_producto**: SKU, Nombre, Grupo (Categoría), Subgrupo, Proveedor Principal, Si requiere refrigeración/cuidado especial.
- **dim_vendedor**: Nombre, Oficina, Cuota Mensual, Comisiones.
- **dim_sucursal**: Nombre, Dirección, Gerente, Formato (Coto/Express/Premium).

## KPIs Principales Derivables
1. **Margen por SKU**: Identificar productos que "quitan dinero".
2. **Lifetime Value (LTV)**: Cuánto valor ha traído un cliente en toda su historia.
3. **Ticket Promedio**: `Σ monto_bruto / COUNT(DISTINCT factura_id)`.
4. **Varianza de Precio**: Comparativa de precio de venta vs precio de lista sugerido.

## Resumen para Agentes
Este modelo estrella es el destino final de cualquier proceso ETL de Evangelista. El `data_eng` debe asegurar que la granularidad sea "Nivel Transacción" para permitir el *drill-down* hasta el ticket individual en los tableros de Sentinel.
