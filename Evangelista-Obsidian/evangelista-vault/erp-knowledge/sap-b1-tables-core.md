---
id: "EVK-ERP-001"
title: "SAP Business One — Estructura de Tablas Core para Auditoría"
type: technical-guide
version: "1.0"
domain: ["erp", "sap-b1", "data-engineering"]
sector: ["general"]
agent_access: [data_eng, financial]
confidence: high
source: evangelista-it
last_validated: 2026-03-30
parent: ""
related: ["sap-b1-audit-queries"]
depends_on: []
tags: ["sap-b1", "sql-server", "hana", "tables-schema"]
status: active
last_ingested: null
chunk_count: null
---

# SAP Business One — Estructura de Tablas Core para Auditoría

## Introducción
SAP Business One (SAP B1) es el ERP líder para PyMEs en México. Entender su arquitectura de datos es crítico para cualquier dictamen forense o proyecto de Business Intelligence con Evangelista. La base de datos es relacional y generalmente reside en SQL Server o SAP HANA.

## Diccionario de Tablas Críticas

| Tabla | Nombre SAP | Descripción y Uso en Auditoría |
|-------|------------|--------------------------------|
| **OITM** | Items | Maestro de Artículos. Clave para identificar SKUs, grupos de artículos y políticas de inventario. |
| **OITW** | Item Warehouse | Stock por Almacén. Vital para detectar "Inventario Fantasma" comparando `OnHand` vs Conteo. |
| **OINV / INV1** | Invoices | Cabecera y Detalle de Facturas de Venta. Fuente principal de ingresos y márgenes brutos. |
| **OPCH / PCH1** | Purchase Invoices | Facturas de Compra. Crucial para detectar sobrecostos y concentración de proveedores. |
| **OJDT / JDT1** | Journal Entries | Asientos Contables. El "Libro Mayor" donde se aplican auditorías de Ley de Benford. |
| **IGE1 / IGN1** | Goods Issue/Receipt | Salidas y Entradas de mercancía. Muestra el flujo físico fuera de la facturación. |
| **OWHS** | Warehouses | Maestro de Almacenes. Define la estructura logística de la empresa. |
| **OCRD** | Business Partners | Maestro de Clientes y Proveedores. Incluye RFC, condiciones de pago y límites de crédito. |

## Campos Clave y Relaciones (JOINs)

Para un análisis integral, el Agente Data Engineer debe dominar los siguientes cruces:

1. **Ventas con Costos**: `OINV` JOIN `INV1` JOIN `OITM` (usando `ItemCode`).
2. **Stock con Almacén**: `OITW` JOIN `OWHS` (usando `WhsCode`).
3. **Contabilidad con Documentos**: SAP B1 usa `TransId` para vincular asientos contables (`OJDT`) con los documentos de origen (ej. `OINV`).

## Trampas y Consideraciones Técnicas

### 1. UDTs (User Defined Tables)
Muchas PyMEs mexicanas personalizan SAP B1 con tablas de usuario (empiezan por `@`). Si el dictamen forense no incluye las UDTs, se está ignorando el 30% de la lógica de negocio (ej. prorrateos de fletes, bonificaciones especiales).

### 2. Campos SYSGEN
Evitar el uso de IDs auto-generados por el sistema (`DocEntry` vs `DocNum`). En auditorías multianuales, el `DocNum` puede reiniciarse, mientras que el `DocEntry` es el puntero único en la base de datos.

### 3. HANA vs SQL Server
- En **HANA**, los nombres de las tablas y campos son *Case Sensitive*.
- El rendimiento de los JOINs en HANA es superior, pero requiere sintaxis específica para funciones de fecha.

## Resumen para Agentes
Cuando un agente `financial` solicite un análisis de "fuga de efectivo", el `data_eng` debe empezar extrayendo `JDT1` (Movimientos contables) y cruzarlo con `OCRD` para identificar pagos a proveedores no registrados o con RFCs duplicados.
