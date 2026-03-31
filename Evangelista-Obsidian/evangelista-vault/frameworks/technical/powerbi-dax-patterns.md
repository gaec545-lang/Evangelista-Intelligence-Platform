---
id: "EVK-TECH-006"
title: "Fórmulas DAX — Cálculos Avanzados para Tableros Evangelista"
type: technical-framework
version: "1.0"
domain: ["power-bi", "dax", "analytics"]
sector: ["general"]
agent_access: [data_eng, analyst]
confidence: high
source: evangelista-architecture
last_validated: 2026-03-30
parent: ""
related: ["star-schema-ventas", "star-schema-inventario"]
depends_on: []
tags: ["dax", "power-bi", "kpi-formulas", "time-intelligence"]
status: active
last_ingested: null
chunk_count: null
---

# Fórmulas DAX — Cálculos Avanzados para Tableros Evangelista

## Introducción
Estas 10 fórmulas DAX son el estándar para los dashboards de Architecture y Sentinel.

### 1. Margen Bruto %
```dax
Margen Bruto % = DIVIDE(SUM(fact_ventas[margen_mxn]), SUM(fact_ventas[monto_bruto_mxn]), 0)
```

### 2. Crecimiento Año tras Año (YoY)
```dax
Ventas LY = CALCULATE(SUM(fact_ventas[monto_bruto_mxn]), SAMEPERIODLASTYEAR(dim_fecha[Date]))
YoY Growth = DIVIDE(SUM(fact_ventas[monto_bruto_mxn]) - [Ventas LY], [Ventas LY], 0)
```

### 3. Media Móvil de 7 Días (Tendencias)
```dax
Moving Avg 7D = 
AVERAGEX(
    DATESINPERIOD(dim_fecha[Date], LASTDATE(dim_fecha[Date]), -7, DAY),
    SUM(fact_ventas[monto_bruto_mxn])
)
```

### 4. Ranking de Productos (Margen Valor)
```dax
Product Rank = RANKX(ALL(dim_producto), SUM(fact_ventas[margen_mxn]), , DESC)
```

### 5. Semáforo KPI de Merma
```dax
Semaforo Merma = 
VAR Rate = [Merma Rate]
RETURN SWITCH(TRUE(),
    Rate > 0.08, "🔴",
    Rate > 0.05, "🟡",
    "🟢")
```

### 6. Días de Inventario (DOH)
```dax
Inventory Days = DIVIDE([Stock Valorizado], [Costo de Venta Diario], 0)
```

### 7. OTIF (On-Time In-Full)
```dax
OTIF Rate = DIVIDE(CALCULATE(COUNTROWS(fact_compras), fact_compras[lead_time_dias] <= 0), COUNTROWS(fact_compras), 0)
```

### 8. Top N Clientes (Pareto 80/20)
```dax
Top N Sales = CALCULATE(SUM(fact_ventas[monto_bruto_mxn]), TOPN(10, ALL(dim_cliente), [Monto Bruto]))
```

## Resumen para Agentes
Estas fórmulas permiten transformar datos técnicos en insights estratégicos inmediatos. El Agente `analyst` las usa para configurar las alertas en los dashboards de Sentinel.
