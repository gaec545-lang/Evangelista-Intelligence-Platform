---
id: "EVK-FWK-006"
title: "Data Mesh sobre ERP — Arquitectura de Inteligencia No Invasiva"
type: framework
version: "1.0"
domain: [datos, procesos]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [data_eng, process, analyst, all]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: ""
related: ["caso-textiles-atoyac", "dmaic-measure", "factor-gamma-system"]
depends_on: []
tags: [data-mesh, architecture, datos, procesos]
status: active
last_ingested: null
chunk_count: null
---

# Data Mesh sobre ERP — Arquitectura de Inteligencia No Invasiva

## Principio Rector

> "El objetivo no es entregar un proyecto y desaparecer. Es construir un activo que el cliente no puede operar solo sin Evangelista."

El principio de Data Mesh sobre ERP es la base arquitectónica de todos los proyectos Architecture de Evangelista. Se define así:

**NO se toca el ERP del cliente.** Se extrae la información, se modela en un Data Warehouse externo, y se sirve en Power BI. El ERP del cliente sigue operando exactamente igual que antes.

## ¿Por qué no intervenir el ERP?

Los ERPs de PyMEs mexicanas (SAP Business One, CONTPAQi, sistemas propios) son la columna vertebral operativa del negocio. Modificar el ERP representa:

| Riesgo | Impacto |
|--------|---------|
| Corrupción de datos históricos | Pérdida de trazabilidad contable y fiscal |
| Incompatibilidad con actualizaciones | El proveedor del ERP niega soporte si fue modificado |
| Dependencia del implementador original | Cambios requieren al mismo proveedor que lo instaló |
| Riesgo de paro operativo | Una modificación mal aplicada puede detener facturación |
| Responsabilidad legal | Evangelista asumiría co-responsabilidad de problemas operativos |

La arquitectura Data Mesh elimina todos estos riesgos: si el Data Warehouse falla, el cliente sigue operando con su ERP exactamente igual. Solo pierde los reportes — no la operación.

## Stack Tecnológico de Architecture

```
[SAP B1 / CONTPAQi / Legacy]
          ↓  (extracción Read-Only)
    [ETL Automatizado]
    Python/SQL Scripts
    Ejecución programada
          ↓
   [SQL Server — Data Warehouse]
   Modelo Dimensional:
   - Fact_Inventarios
   - Fact_Ventas
   - Fact_Produccion
   - Dim_Clientes
   - Dim_Productos
   - Dim_Plantas
          ↓
   [Power BI Service]
   Dashboards operativos
   Dashboards ejecutivos
   Alertas automáticas
          ↓
   [Usuarios finales]
   Dirección General
   Gerentes de área
   Almacenistas (vía Power BI Mobile)
```

## Modelo Dimensional

El Data Warehouse de Evangelista sigue el modelo dimensional de Ralph Kimball (Data Warehouse Toolkit):

### Tablas de Hechos (Fact Tables)

Las Fact Tables almacenan las transacciones del negocio:

| Tabla | Descripción | Granularidad |
|-------|-------------|--------------|
| `Fact_Inventarios` | Movimientos de inventario (entradas, salidas, traslados) | Por movimiento |
| `Fact_Ventas` | Órdenes de venta y facturas | Por línea de factura |
| `Fact_Produccion` | Órdenes de producción y consumo de materiales | Por orden |
| `Fact_Compras` | Órdenes de compra y recepciones | Por línea de PO |

### Tablas de Dimensión (Dimension Tables)

Las Dimension Tables almacenan los catálogos y descriptoress:

| Tabla | Descripción |
|-------|-------------|
| `Dim_Productos` | Catálogo de artículos/SKUs con clasificación |
| `Dim_Clientes` | Catálogo de clientes con segmentación |
| `Dim_Proveedores` | Catálogo de proveedores |
| `Dim_Plantas` | Catálogo de plantas/bodegas/sucursales |
| `Dim_Tiempo` | Calendario con día, semana, mes, trimestre, año |
| `Dim_Empleados` | Catálogo de usuarios del sistema |

## ETL Automatizado

El ETL (Extract, Transform, Load) es el proceso que mueve los datos del ERP al Data Warehouse automáticamente:

```python
# Estructura del ETL de Evangelista
# Ejecución: cada noche a las 23:00 horas (cuando el ERP está en baja demanda)

# 1. EXTRACT — conexión Read-Only al ERP
engine_erp = create_engine(f"mssql+pyodbc://user:pass@{erp_server}/{erp_db}")
df_movimientos = pd.read_sql(query_movimientos_inventario, engine_erp)

# 2. TRANSFORM — limpieza y modelado dimensional
df_clean = (
    df_movimientos
    .rename(columns=COLUMN_MAP)
    .assign(fecha_carga=datetime.now())
    .merge(dim_plantas, on='codigo_planta', how='left')
    .merge(dim_productos, on='codigo_articulo', how='left')
)

# 3. LOAD — carga al Data Warehouse
df_clean.to_sql('Fact_Inventarios', engine_dw, if_exists='append', index=False)

# 4. LOG — registro en Bitácora Forense
log_etl_execution(rows_extracted=len(df_movimientos), rows_loaded=len(df_clean))
```

El cliente recibe los dashboards actualizados cada mañana con datos del día anterior.

## La Fuente Única de Verdad (Single Source of Truth)

El Data Warehouse es la Fuente Única de Verdad para el cliente. Esto resuelve el problema más común en PyMEs mexicanas:

> **Problema típico**: El Director de Compras tiene un Excel con "su" inventario. El Almacenista tiene el inventario en SAP. El Director General tiene otro reporte en CONTPAQi. Los tres números son diferentes. ¿Cuál es el real?

> **Solución Data Mesh**: El Data Warehouse consolida todas las fuentes, aplica las reglas de negocio, y produce un único número. Todos los usuarios ven el mismo dato. Las discusiones sobre "cuál Excel es el correcto" desaparecen.

## Por qué el cliente no puede operar solo sin Evangelista

La arquitectura de Data Mesh crea dependencia estructural legítima:

1. **Actualización del ETL**: Si el cliente actualiza su ERP, el ETL puede romperse. Evangelista lo repara.
2. **Nuevos KPIs**: Si la dirección quiere un nuevo dashboard, Evangelista lo diseña y agrega.
3. **Sentinel**: El módulo de alertas automáticas requiere calibración periódica de umbrales.
4. **Capacidad técnica**: El equipo del cliente no tiene skills de SQL Server + Python + Power BI.

Esta dependencia no es un defecto — es el modelo de negocio de Sentinel (la fase 3 del servicio de Evangelista).

## Conexión con casos

- **[[caso-textiles-atoyac]]**: Ejemplo concreto de implementación Data Mesh para empresa textil con 3 plantas. El ETL extrae de SAP B1 + Sistema Legacy de etiquetado y consolida en un DW único que sirve dashboards a los 3 gerentes de planta y al DG.
