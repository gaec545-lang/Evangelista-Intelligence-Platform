---
id: "EVK-ERP-005"
title: "Ecosistema Aspel — SAE, COI y el Reto de la Integración"
type: technical-guide
version: "1.0"
domain: ["erp", "aspel", "audit", "data-engineering"]
sector: ["general"]
agent_access: [data_eng, financial]
confidence: high
source: evangelista-it
last_validated: 2026-03-30
parent: ""
related: ["contpaqi-structure"]
depends_on: []
tags: ["aspel", "sae", "coi", "firebird", "sql-server"]
status: active
last_ingested: null
chunk_count: null
---

# Ecosistema Aspel — SAE, COI y el Reto de la Integración

## Introducción
Aspel es la suite administrativa más antigua y extendida en México. Se compone de módulos independientes: SAE (Administrativo y Ventas), COI (Contabilidad) y NOI (Nómina).

## Arquitectura de Bases de Datos

### 1. Firebird vs SQL Server
- Las versiones antiguas de Aspel usan **Firebird** como motor de base de datos.
- Versiones recientes permiten **SQL Server**.
- **Trampa**: Las bases de datos de SAE y COI NO se comunican nativamente a nivel DB; la "interfaz" entre ellas es una exportación de archivos planos o una conexión lógica frágil.

## Tablas Críticas en Aspel SAE (Ventas/Inventario)

| Tabla | Descripción | Uso en Auditoría |
|-------|-------------|------------------|
| **INVE01** | Inventario | Catálogo de productos y existencias. |
| **FACT01** | Facturas | Cabecera de documentos de venta. |
| **PAR_FACT01**| Partidas | Detalle de las facturas (SKU, cantidad, precio). |
| **CLIE01** | Clientes | Maestro de clientes y estados de cuenta. |
| **COMP01** | Compras | Registro de compras a proveedores. |

## Hallazgos Comunes en Aspel

### 1. Descuadre SAE vs COI
Debido a la falta de integración real, es común encontrar facturas en SAE que no fueron "contabilizadas" en COI.
- **Estrategia**: El `data_eng` debe extraer `FACT01` (SAE) y compararla contra `AuxiliarContable` (COI) usando el UUID como llave única.

### 2. Corrupción de Datos en Firebird
Firebird es propenso a corrupción de índices en cortes de energía. Si el Agente detecta valores nulos en campos obligatorios, debe sugerir un mantenimiento de base de datos antes del dictamen.

## Conexión y Extracción
Para bases Firebird, se requiere un driver ODBC específico (ej. IBPhoenix). El procesamiento debe ser liviano, ya que Firebird no maneja bien los queries de agregación masiva (SUM/COUNT en millones de registros). Se recomienda la extracción a un CSV temporal y procesamiento en Pandas.

## Resumen para Agentes
Aspel es "el ERP de la resistencia". Los agentes deben ser cautelosos con los reportes de stock de Aspel, ya que el sistema permite vender sin existencias (inventario negativo) por configuración por defecto, lo que invalida cualquier cálculo de costo de venta automático.
