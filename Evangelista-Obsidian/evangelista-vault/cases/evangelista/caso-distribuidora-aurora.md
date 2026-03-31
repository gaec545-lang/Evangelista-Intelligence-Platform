---
id: "EVK-CASE-002"
title: "Caso Distribuidora Aurora — Retail/Distribución Optimización de Inventario"
type: case
version: "1.0"
domain: ["inventory", "retail", "logistics"]
sector: ["retail", "distribucion"]
agent_access: [all]
confidence: high
source: evangelista
last_validated: 2026-03-30
parent: ""
related: ["inventory-management-protocol", "factor-gamma-definition"]
depends_on: []
tags: ["sku-optimization", "inventory-shrinkage", "contpaqi", "microsip"]
status: active
last_ingested: null
chunk_count: null
---

# Caso Distribuidora Aurora — Retail/Distribución Optimización de Inventario

## Perfil del Cliente

| Dato | Valor |
|------|-------|
| **Empresa** | Distribuidora Aurora S.A. de C.V. |
| **Sector** | Retail / Distribución de Abarrotes |
| **Plantas / Sucursales** | 5 Puntos de Venta + 1 Almacén Central (Puebla) |
| **ERP** | CONTPAQi + POS Microsip |
| **Facturación aprox.** | $65,000,000 MXN / año |
| **Empleados** | 42 |
| **Sponsor** | Director General (Dueño) |
| **Factor Γ** | 3.9 |

## Nodo Crítico Identificado

El principal punto de dolor de Distribuidora Aurora era la desconexión total entre lo que el sistema Microsip reportaba y la realidad física en las sucursales. El Director General sospechaba de fugas masivas de inventario, pero la falta de visibilidad en el margen real por SKU impedía tomar acciones drásticas. El Factor Γ de 3.9 indicaba una alta complejidad operativa debido a la dispersión de puntos de venta y la mezcla de sistemas POS con el ERP central, lo que generaba duplicidad de tareas y errores de captura manual que el equipo administrativo ya no podía controlar.

## Hallazgos del Dictamen Forense

### Hallazgo H-01 — Inventario Fantasma y Desfase de Stock
**Descripción técnica:** 
Mediante una técnica de *Data Profiling* cruzado entre las tablas de existencias de Microsip y las pólizas de salida en CONTPAQi, se detectó un "inventario fantasma" en 3 de las 5 sucursales. El sistema mostraba existencias teóricas de productos de alta rotación (aceite vegetal, harina y granos) que físicamente no se encontraban en anaquel ni en bodega sucursal.

**Impacto financiero:**
- Costo anual: **$890,000 MXN** por shrinkage no detectado.
- Causa raíz: Falta de conciliación diaria entre el POS y el inventario físico, exacerbada por devoluciones mal registradas que nunca reingresaban al stock disponible.

### Hallazgo H-02 — SKUs "Zombi" y Capital Atrapado
**Descripción técnica:**
Análisis de antigüedad de saldos de inventario. Se identificaron 2,340 SKUs que no habían registrado un solo movimiento de venta en los últimos 6 meses. Muchos de estos productos estaban ubicados en el Almacén Central ocupando espacio crítico.

**Impacto financiero:**
- Costo de oportunidad: **$1,800,000 MXN** en capital de trabajo retenido.
- Causa raíz: Ausencia de una política de liquidación de inventario obsoleta y compras basadas en "intuición" del encargado de almacén en lugar de datos históricos de demanda.

### Hallazgo H-03 — Margen por SKU Desconocido
**Descripción técnica:**
Al limpiar la base de datos de costos, se descubrió que el 15% de los productos se vendían con un margen bruto inferior al 2%, el cual no cubría los gastos operativos de logística y personal de la sucursal.

**Impacto financiero:**
- Pérdida operativa estimada: **$450,000 MXN/año**.
- Causa raíz: Errores en la carga de costos de entrada que no incluían el flete prorrateado desde el almacén central hacia las sucursales foráneas.

## Resumen Financiero

| Hallazgo | Costo Anual ($MXN) | % del Total |
|----------|-------------------|-------------|
| H-01: Fugas e Inventario Fantasma | $890,000 | 28.3% |
| H-02: Capital en SKUs Zombi | $1,800,000 | 57.3% |
| H-03: Pérfida por Margen Negativo | $450,000 | 14.4% |
| **Total** | **$3,140,000** | **100%** |

## Propuesta Architecture

| Indicador | Valor |
|-----------|-------|
| Factor Γ | 3.9 |
| Setup Fee (sin IVA) | $702,000 MXN |
| Success Fee (estimado) | $420,000 MXN (10% de ahorros logrados) |
| Total Architecture (sin IVA) | $1,122,000 MXN |
| Total con IVA (16%) | $1,301,520 MXN |
| **ROI proyectado** | **498%** |
| Punto de equilibrio | 4.2 meses |
| Timeline | 18 semanas |

## Estado y Resultados

El proyecto fue firmado el 15 de enero. Se implementó un módulo de conciliación automática en tiempo real para Sentinel que dispara alertas cuando la discrepancia entre tickets de venta y stock supera el 1.5%. Los resultados a los 6 meses muestran una reducción del 40% en los SKUs zombi tras una campaña de liquidación agresiva y la automatización de órdenes de reabastecimiento basada en algoritmos de demanda predictiva. El Success Fee del primer tramo ya ha sido liquidado tras confirmar un ahorro de $1.2M MXN en el primer trimestre de operación completa.
