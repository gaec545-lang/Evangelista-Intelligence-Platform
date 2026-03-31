---
id: "EVK-TECH-003"
title: "Star Schema — Modelo Dimensional de Producción (OEE focus)"
type: technical-framework
version: "1.0"
domain: ["data-engineering", "modeling", "production"]
sector: ["manufactura"]
agent_access: [data_eng, analyst]
confidence: high
source: evangelista-architecture
last_validated: 2026-03-30
parent: "star-schema-ventas"
related: ["star-schema-inventario", "patron-cuello-botella"]
depends_on: []
tags: ["manufacturing-data", "oee", "yield-rate", "shop-floor"]
status: active
last_ingested: null
chunk_count: null
---

# Star Schema — Modelo Dimensional de Producción (OEE focus)

## Introducción
El modelo de producción mide la eficiencia del uso de activos y el cumplimiento de órdenes de trabajo. Es fundamental para el cálculo del **OEE (Overall Equipment Effectiveness)**.

## La Tabla de Hechos (Fact Table): `fact_produccion`

### Estructura DDL
```sql
CREATE TABLE fact_ordenes_produccion (
    orden_id BIGINT PRIMARY KEY,
    fecha_id INT,               -- FK dim_fecha
    producto_final_id INT,      -- FK dim_producto
    linea_produccion_id INT,    -- FK dim_recurso (Máquina/Estación)
    cantidad_planeada DECIMAL(18,2),
    cantidad_producida_ok DECIMAL(18,2),
    cantidad_defectuosa DECIMAL(18,2),
    tiempo_operacion_min INT,
    tiempo_parada_min INT,
    costo_unitario_real DECIMAL(18,2)
);
```

## KPIs Principales Derivables
1. **OEE %**: `Disponibilidad × Rendimiento × Calidad`.
2. **Yield Rate**: `Cantidad OK / Total Producido`.
3. **Costo Unitario Real vs Estándar**: Desviación acumulada por orden de producción.
4. **WIP Aging**: Tiempo que una orden pasa "abierta" en sistema.

## Resumen para Agentes
Este modelo es la herramienta del agente `process` para identificar el [[patron-cuello-botella]] mediante el análisis de `tiempo_operacion_min` comparativo entre estaciones.
