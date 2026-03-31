---
id: "EVK-CASE-004"
title: "Caso Alimentos Puebla Sana — Trazabilidad y Caducidad"
type: case
version: "1.0"
domain: ["food-safety", "logistics", "traceability"]
sector: ["alimentos", "produccion"]
agent_access: [all]
confidence: high
source: evangelista
last_validated: 2026-03-30
parent: ""
related: ["alcoa-protocol", "logistics-route-optimization"]
depends_on: []
tags: ["cofepris-ready", "aspel-sae", "consumibles", "snack-healthy"]
status: active
last_ingested: null
chunk_count: null
---

# Caso Alimentos Puebla Sana — Trazabilidad y Caducidad

## Perfil del Cliente

| Dato | Valor |
|------|-------|
| **Empresa** | Alimentos Puebla Sana S. De R.L. |
| **Sector** | Producción de Snacks Saludables |
| **Plantas / Sucursales** | 1 Planta de Producción + 3 Rutas Logísticas |
| **ERP** | Aspel SAE + Hojas de cálculo aisladas |
| **Facturación aprox.** | $45,000,000 MXN / año |
| **Empleados** | 35 |
| **Sponsor** | DUEÑO (Director General) |
| **Factor Γ** | 1.8 |

## Nodo Crítico Identificado

Puebla Sana enfrentaba un riesgo existencial: una auditoría de COFEPRIS podría cerrar la planta debido a la incapacidad de rastrear lotes de materia prima desde el origen hasta el producto final. El Factor Γ de 1.8 indicaba una operación relativamente compacta pero crítica en términos de cumplimiento normativo. Además del riesgo legal, el costo financiero por merma de productos caducados en rutas de distribución estaba erosionando los márgenes de utilidad neta en un 12%.

## Hallazgos del Dictamen Forense

### Hallazgo H-01 — Mermas por Caducidad No Monitoreada
**Descripción técnica:**
Análisis de devoluciones de clientes (retailers). Se detectó que el 8.5% del producto entregado era devuelto por estar a menos de 10 días de expirar. Aspel SAE no emitía alertas preventivas, y el personal de ventas seguía el modelo "First-In-First-Out" (FIFO) de manera visual y no sistémica, lo que generaba errores humanos constantes.

**Impacto financiero:**
- Pérdida directa: **$520,000 MXN/año**.
- Causa raíz: Falta de un módulo FEFO (First-Expired-First-Out) en el ERP y ausencia de digitalización de fechas en el picking.

### Hallazgo H-02 — Rutas Logísticas sin Optimización
**Descripción técnica:**
Auditoría de combustible vs. kilometraje recorrido en las 3 rutas principales. Las rutas se diseñaban diariamente por los choferes basándose en su "experiencia", resultando en solapamientos geográficos y visitas en horarios de alto tráfico innecesarias.

**Impacto financiero:**
- Desperdicio de combustible y mantenimiento: **$480,000 MXN/año**.
- Causa raíz: Ausencia de herramientas de ruteo dinámico y monitoreo de eficiencia de combustible por kilómetro.

### Hallazgo H-03 — Riesgo de Trazabilidad (COFEPRIS)
**Descripción técnica:**
Simulacro de *Recall* (Retiro de producto). Se intentó rastrear un lote de "Sal Rosada" de un proveedor específico en las órdenes de producción de los últimos 30 días. El equipo tardó 72 horas en consolidar la información manual, cuando la norma exige una respuesta casi inmediata (menos de 4 horas).

**Impacto financiero:**
- Riesgo de multa/cierre: Estimado en **$1,500,000 MXN** en sanciones potenciales.
- Causa raíz: Registros de producción en carpetas físicas sin enlace digital con el módulo de compras de Aspel.

## Resumen Financiero

| Hallazgo | Costo Anual ($MXN) | % del Total |
|----------|-------------------|-------------|
| H-01: Merma por Caducidad | $520,000 | 27.4% |
| H-02: Ineficiencia Logística | $480,000 | 25.3% |
| H-03: Pasivo Contingente (Riesgo COFEPRIS) | $900,000* | 47.3% |
| **Total** | **$1,900,000** | **100%** |
*\*Valor ponderado del riesgo legal.*

## Propuesta Architecture

| Indicador | Valor |
|-----------|-------|
| Factor Γ | 1.8 |
| Setup Fee (sin IVA) | $324,000 MXN |
| Success Fee (estimado) | $190,000 MXN |
| Total Architecture (sin IVA) | $514,000 MXN |
| Total con IVA (16%) | $596,240 MXN |
| **ROI proyectado** | **486%** |
| Punto de equilibrio | 5 meses |
| Timeline | 10 semanas |

## Estado y Resultados

Se implementó el protocolo [[alcoa-protocol]] para digitalizar la captura de datos en planta. Se integró una herramienta de ruteo conectada a Sentinel que redujo el kilometraje mensual en un 22%. El éxito más contundente fue la aprobación de una auditoría real de cumplimiento a los 3 meses de implementación, logrando una trazabilidad completa (backwards and forwards) en menos de 15 minutos, blindando la operación legal de la empresa.
