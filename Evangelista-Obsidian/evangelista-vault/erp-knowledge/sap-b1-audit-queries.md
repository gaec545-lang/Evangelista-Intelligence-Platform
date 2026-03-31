---
id: "EVK-ERP-002"
title: "SAP Business One — SQL Audit Queries"
type: technical-guide
version: "1.0"
domain: ["erp", "sap-b1", "sql", "audit"]
sector: ["general"]
agent_access: [data_eng, financial]
confidence: high
source: evangelista-it
last_validated: 2026-03-30
parent: "sap-b1-tables-core"
related: ["patron-inventario-fantasma", "patron-facturas-apocrifas"]
depends_on: []
tags: ["sap-b1", "sql-queries", "forensics", "inventory-audit"]
status: active
last_ingested: null
chunk_count: null
---

# SAP Business One — SQL Audit Queries

Esta guía proporciona queries SQL (versión SQL Server/HANA) para ejecutar diagnósticos rápidos durante la fase de auditoría Foundation.

## 1. Inventario Fantasma (OnHand vs Conteo)
Identifica SKUs que tienen un stock registrado mayor a lo que dicta el historial de movimientos o conteos físicos cargados en tablas temporales.
```sql
SELECT T0.ItemCode, T0.ItemName, T1.WhsCode, T1.OnHand, 
       (SELECT SUM(Quantity) FROM IGN1 WHERE ItemCode = T0.ItemCode) as TotalEntries
FROM OITM T0 
INNER JOIN OITW T1 ON T0.ItemCode = T1.ItemCode
WHERE T1.OnHand > 0 AND T0.InvntryItem = 'Y';
```

## 2. Facturas sin Socio de Negocio (Huérfanas)
Busca inconsistencias en la integridad referencial de `OINV`.
```sql
SELECT DocEntry, DocNum, CardCode, DocDate 
FROM OINV 
WHERE CardCode NOT IN (SELECT CardCode FROM OCRD);
```

## 3. Movimientos Duplicados (Misma Fecha/Hora)
Detecta posibles errores de sistema o duplicidad de carga manual en entradas de mercancía.
```sql
SELECT ItemCode, DocDate, DocTime, COUNT(*) 
FROM IGN1 
GROUP BY ItemCode, DocDate, DocTime 
HAVING COUNT(*) > 1;
```

## 4. Órdenes de Producción sin Cierre (Capital Atrapado)
Identifica órdenes de producción "abiertas" por más de 30 días, lo que infla el valor del WIP (Work In Progress).
```sql
SELECT DocNum, ItemCode, PlannedQty, PostDate 
FROM OWOR 
WHERE Status = 'R' AND DATEDIFF(day, PostDate, GETDATE()) > 30;
```

## 5. Diferencias de Inventario por Almacén
Compara el stock entre almacenes lógicos vs físicos.
```sql
SELECT ItemCode, SUM(OnHand) as StockTotal 
FROM OITW 
GROUP BY ItemCode 
HAVING COUNT(WhsCode) > 1 AND SUM(MinStock) > SUM(OnHand);
```

## 6. Top 20 SKUs Obsoletos (Sin movimiento > 6 meses)
Identifica capital inmovilizado en artículos de nula rotación.
```sql
SELECT TOP 20 T0.ItemCode, T0.ItemName, T1.OnHand, T1.LastPurDat
FROM OITM T0 JOIN OITW T1 ON T0.ItemCode = T1.ItemCode
WHERE T1.LastPurDat < DATEADD(month, -6, GETDATE()) AND T1.OnHand > 0
ORDER BY T1.OnHand DESC;
```

## 7. Asientos Contables Sospechosos (Montos Redondos)
Auditando `JDT1` para montos que terminan en `.00` con frecuencia inusual, lo que puede indicar estimaciones manuales no justificadas.
```sql
SELECT TransId, ContraLine, Debit, Credit 
FROM JDT1 
WHERE (Debit % 100 = 0 OR Credit % 100 = 0) AND (Debit > 0 OR Credit > 0);
```

## 8. Movimientos Inter-Almacén sin Confirmación
Busca documentos con `StockTransfer` que no tienen un recibo de mercancía compensatorio.
```sql
SELECT DocEntry, DocNum, Filler, ToWhsCod, DocDate 
FROM OWTR 
WHERE DocStatus = 'O' AND DATEDIFF(day, DocDate, GETDATE()) > 2;
```

## 9. Proveedores con RFC Duplicado
Indica posible creación de proveedores "espejo" para fragmentación de compras.
```sql
SELECT LicTradNum, COUNT(CardCode) 
FROM OCRD 
WHERE CardType = 'S' 
GROUP BY LicTradNum 
HAVING COUNT(CardCode) > 1;
```

## 10. Productos con Costo Negativo o Cero
Riesgo crítico de valuación de inventario y margen bruto.
```sql
SELECT ItemCode, ItemName, LastPurPrc 
FROM OITM 
WHERE LastPurPrc <= 0 AND InvntryItem = 'Y';
```

## Consideraciones para los Agentes
Estos queries deben ejecutarse contra la base de datos de producción (idealmente una réplica) para alimentar los dashboards de Sentinel. El agente `data_eng` es responsable de automatizar estos checks semanalmente.
