---
id: "EVK-ERP-003"
title: "CONTPAQi Contabilidad — Estructura de Bases de Datos y Conexión"
type: technical-guide
version: "1.0"
domain: ["erp", "contpaqi", "audit", "sql"]
sector: ["general"]
agent_access: [data_eng, financial]
confidence: high
source: evangelista-it
last_validated: 2026-03-30
parent: ""
related: ["contpaqi-nominas-imss"]
depends_on: []
tags: ["contpaqi", "odbc", "mdb", "accdb", "sql-server"]
status: active
last_ingested: null
chunk_count: null
---

# CONTPAQi Contabilidad — Estructura de Bases de Datos y Conexión

## Introducción
CONTPAQi es el estándar *de facto* para la contabilidad en México. A diferencia de un ERP unificado, CONTPAQi suele manejar bases de datos separadas por empresa y, en versiones anteriores, por ejercicio fiscal.

## Arquitectura de Almacenamiento

### 1. El modelo multibase
Una de las mayores trampas para el `data_eng` es que CONTPAQi no consolida años automáticamente en una sola tabla.
- **Versiones Pro/SQL**: Una base de datos por empresa.
- **Versiones Base**: Archivos Microsoft Access (`.mdb` o `.accdb`) por cada ejercicio fiscal.
- **Estrategia**: Para analizar tendencias de 3 años, se deben conectar 3 orígenes distintos y unificarlos en el Data Warehouse de Architecture.

## Tablas Críticas para el Dictamen Forense

| Tabla | Descripción | Uso en Auditoría |
|-------|-------------|------------------|
| **Polizas** | Cabecera de pólizas | Identificación de fecha, tipo (Ingreso, Egreso, Diario) y concepto. |
| **Movimientos** | Detalle de las pólizas | Es el corazón de la contabilidad. Registra cargos, abonos y cuentas contables. |
| **Cuentas** | Catálogo de cuentas | Estructura jerárquica del plan de cuentas. |
| **Asociaciones** | Vínculo XML-Póliza | Crucial para validar que cada gasto tenga un CFDI real (evitar facturas apócrifas). |

## Conexión vía ODBC (Paso a Paso)

Para extraer datos sin comprometer la integridad:
1. Configurar un DSN de sistema en Windows apuntando al driver de SQL Server de CONTPAQi.
2. Utilizar el motor de **Architecture** para ejecutar un `SELECT` sobre la tabla `Movimientos`.
3. **Advertencia**: Nunca escribir directamente en las tablas de CONTPAQi; el sistema es altamente sensible a cambios externos en los índices.

## Queries de Auditoría Comunes

### 1. Pólizas sin XML asociado
```sql
SELECT P.Fecha, P.Folio, P.Concepto 
FROM Polizas P 
LEFT JOIN Asociaciones CFDI ON P.Id = CFDI.IdPoliza 
WHERE CFDI.Id IS NULL AND P.Tipo IN (1,2); -- Ingresos/Egresos
```

### 2. Duplicidad de Movimientos por Importe y Cuenta
```sql
SELECT CuentaId, Importe, Fecha, COUNT(*) 
FROM Movimientos 
GROUP BY CuentaId, Importe, Fecha 
HAVING COUNT(*) > 1;
```

## Trampas de CONTPAQi
- **Pólizas de Ajuste**: Suelen estar "escondidas" en periodos 13 o 14. Un análisis que solo llegue al periodo 12 perderá los ajustes de auditoría anuales.
- **Cuentas de Orden**: No afectan el balance pero pueden ocultar pasivos contingentes importantes para el análisis de riesgo.

## Resumen para Agentes
El agente `data_eng` debe asegurar que la extracción de CONTPAQi incluya siempre el UUID del XML asociado. Sin el UUID, el dictamen forense no puede garantizar la deducibilidad fiscal del gasto analizado.
