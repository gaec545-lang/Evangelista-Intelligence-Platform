---
id: "EVK-CASE-006"
title: "Caso Ferretería 3 Hermanos — Retail Escalamiento Multi-Sucursal"
type: case
version: "1.0"
domain: ["retail", "inventory", "price-strategy"]
sector: ["ferreteria", "retail"]
agent_access: [all]
confidence: high
source: evangelista
last_validated: 2026-03-30
parent: ""
related: ["inventory-management-protocol", "sku-rationalization"]
depends_on: []
tags: ["puebla", "pos-optimization", "inventory-variance", "contpaqi"]
status: active
last_ingested: null
chunk_count: null
---

# Caso Ferretería 3 Hermanos — Retail Escalamiento Multi-Sucursal

## Perfil del Cliente

| Dato | Valor |
|------|-------|
| **Empresa** | Ferretería 3 Hermanos S.A. de C.V. |
| **Sector** | Ferretería / Venta al por menor |
| **Plantas / Sucursales** | 4 Sucursales (Zona Metropolitana Puebla) |
| **ERP** | POS propio (Desarrollo local) + CONTPAQi |
| **Facturación aprox.** | $110,000,000 MXN / año |
| **Empleados** | 58 |
| **Sponsor** | Director de Operaciones (Hijo del Fundador) |
| **Factor Γ** | 3.0 |

## Nodo Crítico Identificado

La pérdida de control por crecimiento: "Lo que funcionaba para una sola ferretería, fracasó al tener cuatro". Ferretería 3 Hermanos tenía una dispersión de precios inaceptable (el mismo clavo costaba diferente en cada tienda) y un sistema de inventarios que reportaba diferencias millonarias al cierre de cada semestre. El Factor Γ de 3.0 reflejaba la fricción generada por un software POS "hecho a medida" que no se comunicaba bidireccionalmente con CONTPAQi, creando un abismo de datos entre la caja y la contabilidad.

## Hallazgos del Dictamen Forense

### Hallazgo H-01 — Discrepancia de Precios y Margen Negativo
**Descripción técnica:**
Auditoría de catálogos mediante *Fuzzy Matching*. Se detectó que el 12% de los productos de alta rotación tenían precios en sistema que no coincidían con el anaquel en 2 de las 4 sucursales. Peor aún, debido a cambios no actualizados de los proveedores, se estaban vendiendo 450 artículos por debajo del costo de reposición.

**Impacto financiero:**
- Pérdida de margen: **$950,000 MXN/año**.
- Causa raíz: Falta de un proceso centralizado de actualización de precios; cada gerente de sucursal tenía permisos de edición manual.

### Hallazgo H-02 — Diferencias de Inventario no Reconciliadas
**Descripción técnica:**
Análisis de varianza mensual. Se encontró una brecha acumulada de $2.1M MXN al año entre las compras registradas y las ventas facturadas, descontando la merma natural. Mediante análisis forense de datos, se identificaron transacciones de "ajuste de inventario" manuales realizadas fuera de horario de operación.

**Impacto financiero:**
- Pérdida directa (robo/mala gestión): **$2,100,000 MXN/año**.
- Causa raíz: Controles de acceso laxos en el POS y falta de arqueos de stock sorpresivos vinculados al sistema.

### Hallazgo H-03 — Proveedores Duplicados y Triangulación
**Descripción técnica:**
Limpieza de base de datos de proveedores. Se detectó que el mismo RFC estaba registrado con 3 razones sociales diferentes. Se descubrió que una de estas razones sociales pertenecía a un familiar del encargado de compras, quien revendía material a la ferretería con un sobreprecio del 15% (triangulación).

**Impacto financiero:**
- Sobrecosto de compra: **$450,000 MXN/año**.
- Causa raíz: Falta de un protocolo de auditoría de *Compliance* para el alta de proveedores.

## Resumen Financiero

| Hallazgo | Costo Anual ($MXN) | % del Total |
|----------|-------------------|-------------|
| H-01: Discrepancia de Precios | $950,000 | 27.1% |
| H-02: Robo y Diferencias Stock | $2,100,000 | 60.0% |
| H-03: Triangulación de Compras | $450,000 | 12.9% |
| **Total** | **$3,500,000** | **100%** |

## Propuesta Architecture

| Indicador | Valor |
|-----------|-------|
| Factor Γ | 3.0 |
| Setup Fee (sin IVA) | $540,000 MXN |
| Success Fee (estimado) | $350,000 MXN |
| Total Architecture (sin IVA) | $890,000 MXN |
| Total con IVA (16%) | $1,032,400 MXN |
| **ROI proyectado** | **548%** |
| Punto de equilibrio | 3.8 meses |
| Timeline | 20 semanas |

## Estado y Resultados

Se implementó el [[inventory-management-protocol]] cerrando los permisos de edición manual de precios. Se integró una capa de validación en Sentinel que rastrea el RFC de todos los proveedores contra una "lista blanca" aprobada. Los resultados al cierre del primer año incluyeron la recuperación total del control de precios y una reducción de las diferencias de inventario al 0.5% del stock total, lo que validó el pago del Success Fee máximo estipulado.
