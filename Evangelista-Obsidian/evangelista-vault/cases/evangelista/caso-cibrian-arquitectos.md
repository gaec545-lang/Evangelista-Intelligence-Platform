---
id: "EVK-CASE-005"
title: "Caso Cibrián Arquitectos — Construcción Control de Proyectos"
type: case
version: "1.0"
domain: ["construction", "project-finance", "forensics"]
sector: ["construccion", "arquitectura"]
agent_access: [all]
confidence: high
source: evangelista
last_validated: 2026-03-30
parent: ""
related: ["canvas-proyecto-cibrian", "success-fee-calc"]
depends_on: []
tags: ["contpaqi", "jineteo-capital", "benford-law", "monterrey"]
status: active
last_ingested: null
chunk_count: null
---

# Caso Cibrián Arquitectos — Construcción Control de Proyectos

## Perfil del Cliente

| Dato | Valor |
|------|-------|
| **Empresa** | Cibrián Arquitectos S.C. |
| **Sector** | Construcción / Arquitectura de Lujo |
| **Plantas / Sucursales** | 3 Sedes (Puebla, Zapopan, Monterrey) |
| **ERP** | CONTPAQi + Excel por proyecto |
| **Facturación aprox.** | $120,000,000 MXN / año |
| **Empleados** | 25 (Staff) + 150 (Subcontratistas) |
| **Sponsor** | Socio Fundador (Arquitecto Principal) |
| **Factor Γ** | 2.4 |

## Nodo Crítico Identificado

El "Cáncer de la Construcción": el jineteo de capital entre obras y la falta de correlación entre el avance físico y el flujo cobrado. Cibrián Arquitectos tenía proyectos que financieramente aparecían al 80% de cobro pero físicamente solo llevaban el 20% de cimentación, lo que generaba un riesgo de impago catastrófico al final de la obra. El Factor Γ de 2.4 reflejaba la complejidad de gestionar múltiples sedes con presupuestos descentralizados que no se consolidaban en tiempo real en la oficina central de Puebla.

## Hallazgos del Dictamen Forense

### Hallazgo H-01 — Jineteo de Capital Involuntario
**Descripción técnica:**
Mediante un análisis de "Saldos Vivos" por proyecto, se detectó que el 30% del presupuesto de la obra "Torre Arboleda" en Monterrey se estaba utilizando para cubrir la nómina de la obra "Residencial La Paz" en Puebla. Este desvío no era robo, sino una mala gestión de la caja chica y falta de etiquetado de fondos.

**Impacto financiero:**
- Riesgo de asfixia financiera: **$1,200,000 MXN** en líneas de crédito saturadas para cubrir huecos.
- Causa raíz: Falta de conciliación bancaria unitaria por proyecto en CONTPAQi.

### Hallazgo H-02 — Fugas por Compras a Proyectos Cancelados
**Descripción técnica:**
Auditoría de compras vs. órdenes de cambio. Se identificaron $643,800 MXN en materiales habilitados (mármol y cristalería) Facturados a un proyecto que fue cancelado por el cliente hace 3 meses. El material llegó a bodega y "desapareció" sin ser reasignado a otra obra.

**Impacto financiero:**
- Pérdida directa: **$643,800 MXN**.
- Causa raíz: Desconexión entre el área comercial (cancelaciones) y el área de compras (procedimientos automáticos).

### Hallazgo H-03 — Anomalías estadísticas en Proveedores (Ley de Benford)
**Descripción técnica:**
Aplicación de la [[benford-law]] a la lista de 450 proveedores recurrentes. Se encontró un patrón anómalo en el proveedor de materiales de construcción "Agregados del Norte" (Monterrey), donde las facturas de $9,XXX MXN se repetían con una frecuencia estadística imposible.

**Impacto financiero:**
- Sobrecosto detectado: **$200,000 MXN** en facturación inflada.
- Causa raíz: Acuerdo colusorio entre un residente de obra y el proveedor para evitar revisiones de montos mayores.

## Resumen Financiero

| Hallazgo | Costo Anual ($MXN) | % del Total |
|----------|-------------------|-------------|
| H-01: Costo de Financiamiento de Jineteo | $1,200,000 | 58.7% |
| H-02: Compras a Proyectos Inactivos | $643,800 | 31.5% |
| H-03: Facturación Inflada (Benford) | $200,000 | 9.8% |
| **Total** | **$2,043,800** | **100%** |

## Propuesta Architecture

| Indicador | Valor |
|-----------|-------|
| Factor Γ | 2.4 |
| Setup Fee (sin IVA) | $432,000 MXN |
| Success Fee (estimado) | $310,000 MXN |
| Total Architecture (sin IVA) | $742,000 MXN |
| Total con IVA (16%) | $860,720 MXN |
| **ROI proyectado** | **372%** |
| Punto de equilibrio | 5.2 meses |
| Timeline | 16 semanas |

## Estado y Resultados

Basado en el [[canvas-proyecto-cibrian]], se implementó una estructura de fideicomisos unitarios por obra en Sentinel. El Success Fee se vinculó a la reducción del diferencial entre "Avance Físico vs. Avance Financiero". A los 5 meses, el desvío promedio por proyecto se redujo de un 25% a un 4%. Se recuperaron $150k de los cobros anómalos detectados mediante ley de Benford tras encarar al proveedor con datos estadísticos irrefutables.
