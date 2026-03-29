---
id: "EVK-CASE-001"
title: "Caso Textiles Atoyac — Architecture Multi-Planta con Inventario Crítico"
type: case
version: "1.0"
domain: [finanzas, procesos, datos, inventarios]
sector: [textiles]
agent_access: [all]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: ""
related: ["alcoa-protocol", "factor-gamma-system", "benford-law", "architecture-pricing", "success-fee-calc", "playbook-textiles"]
depends_on: []
tags: [textiles, foundation, architecture, inventarios, factor-gamma, success-fee, manufactura]
status: active
last_ingested: null
chunk_count: null
---

# Caso Textiles Atoyac — Architecture Multi-Planta con Inventario Crítico

## Perfil del Cliente

| Dato | Valor |
|------|-------|
| **Empresa** | Textiles Atoyac S.A. de C.V. |
| **Sector** | Manufactura textil (telas industriales y rollos) |
| **Plantas** | 3: Atlixco, San Martín Texmelucan, Puebla (centro) |
| **ERP** | SAP Business One v10 |
| **Sistema Legacy** | Sistema propio de etiquetado de rollos (sin integración SAP) |
| **Facturación aprox.** | $85M MXN/año |
| **Empleados** | ~320 personas (incluyendo operarios de planta) |
| **Sponsor** | DG Varela (Director General, dueño de la empresa) |
| **Factor Γ** | **2.7** (3 sucursales + 1 ERP) |

## Nodo Crítico Identificado: Inventarios

Foundation identificó el nodo de **Inventarios** como el punto de mayor dolor y mayor oportunidad financiera. Los 4 hallazgos del Dictamen Forense son los siguientes:

---

### Hallazgo H-01 — Traslados Inter-Planta sin Confirmación de Recepción

**Descripción técnica:**
847 órdenes de traslado inter-planta en los últimos 18 meses permanecen en estado "en tránsito" en SAP B1 sin registro de confirmación de recepción en la planta destino. El sistema marca el inventario como "en tránsito" indefinidamente porque no existe un protocolo de cierre de traslados.

**Distribución por planta destino:**
- Atlixco → San Martín Texmelucan: 312 órdenes
- Puebla → Atlixco: 289 órdenes
- San Martín Texmelucan → Puebla: 246 órdenes

**Impacto financiero:**
- Valor total en inventario "en tránsito" permanente: **$4,812,000 MXN**
- Factor de merma estimada: 30% (rollos > 30 días en tránsito se deterioran o extravían)
- **Costo anual: $1,443,600 MXN**

**Causa raíz:** Los almacenistas de plantas receptoras no tienen acceso a SAP para registrar la confirmación de recepción. El proceso existe en papel pero no se digitaliza.

---

### Hallazgo H-02 — Duplicados de Lote en Múltiples Plantas

**Descripción técnica:**
127 registros de rollos de tela tienen el mismo código de lote activo en 2 plantas simultáneamente. Esto es materialmente imposible — un rollo físico solo puede estar en un lugar. Las entradas dobles ocurren porque al transferir un rollo de planta, el sistema Legacy de etiquetado genera un nuevo registro en la planta destino sin eliminar el original en la planta origen.

**Impacto financiero:**
- Valor por duplicado: $6,000 MXN promedio por rollo (costo de producción)
- 127 duplicados × $6,000 = $762,000 MXN en activo duplicado ficticio
- **Costo anual: $762,000 MXN** (sobre-stock de materia prima por tomar decisiones sobre inventario inflado)

**Causa raíz:** El Sistema Legacy de etiquetado no tiene integración bidireccional con SAP. Las transferencias físicas crean registros en el Legacy sin propagar la baja en SAP de la planta origen.

---

### Hallazgo H-03 — Desincronización Legacy-SAP (3 Días de Retraso)

**Descripción técnica:**
El Sistema Legacy de etiquetado actualiza SAP con un retraso promedio de 3 días hábiles. Esto significa que el inventario visible en SAP está sistemáticamente desactualizado. El equipo de compras toma decisiones de reabastecimiento basado en datos que no reflejan la realidad actual.

**Impacto financiero:**
- Este hallazgo no tiene un costo directo cuantificado (el costo está embebido en H-01 y H-02)
- **Riesgo fiscal crítico:** En caso de auditoría SAT, el inventario en libros no coincidirá con el inventario físico real. Las diferencias no explicadas pueden ser interpretadas como ingresos no declarados o discrepancias contables sancionables.
- Clasificación de riesgo: **Alto** (impacto regulatorio y fiscal)

**Causa raíz:** La interfaz entre el Legacy y SAP fue desarrollada por un proveedor externo en 2019. El contrato de mantenimiento venció. El archivo de configuración de sincronización tiene un parámetro de delay = 72h que nadie ha corregido.

---

### Hallazgo H-04 — Anomalía Ley de Benford en Movimientos de Inventario

**Descripción técnica:**
El análisis de [[benford-law]] sobre 47,832 movimientos de inventario detectó una concentración estadísticamente anómala en los dígitos iniciales 3 y 4, específicamente en el rango de $15,000 a $16,999 MXN. Esta concentración tiene un p-value de 0.003 (< 0.05), indicando que la distribución no es aleatoria.

La hipótesis más probable: **fraccionamiento de operaciones** para mantenerse por debajo de los umbrales de aprobación interna ($17,000 MXN requiere firma del Director de Compras).

**Impacto financiero:**
- 127 movimientos sospechosos identificados en 18 meses
- Monto promedio: $7,510 MXN por movimiento
- **Costo estimado: $953,700 MXN** en los 18 meses de muestra

**Nota legal:** Este hallazgo fue presentado al DG Varela con la recomendación de una auditoría interna de compras. Evangelista no hace determinaciones de responsabilidad penal — ese es el ámbito de los peritos y autoridades competentes.

---

## Resumen Financiero del Dictamen Foundation

| Hallazgo | Tipo | Costo Anual ($MXN) | % del Total |
|----------|------|--------------------|-------------|
| H-01: Traslados sin confirmar | Operativo | $1,443,600 | 45.7% |
| H-04: Anomalía Benford | Riesgo/Fraude | $953,700 | 30.2% |
| H-02: Duplicados de lote | Operativo | $762,000 | 24.1% |
| H-03: Desincronización Legacy | Riesgo Fiscal | No cuantificado | — |
| **Total ahorro proyectado** | | **$3,159,300 MXN/año** | **100%** |

## Propuesta Architecture

### Métricas del proyecto

| Indicador | Valor |
|-----------|-------|
| Factor Γ | 2.7 |
| Setup Fee (sin IVA) | $486,000 MXN |
| Success Fee (estimado) | $526,550 MXN |
| Total Architecture (sin IVA) | $1,012,550 MXN |
| IVA (16%) | $162,008 MXN |
| **Total con IVA** | **$1,174,558 MXN** |
| ROI proyectado | **213% a 12 meses** |
| Punto de equilibrio | **~4 meses** |
| Timeline | 9-12 semanas (Γ = 2.7) |

### Estructura de pagos acordada (70/30)

| Tramo | Porcentaje | Monto sin IVA | Con IVA |
|-------|------------|---------------|---------|
| Tramo A (firma) | 70% | $340,200 MXN | $394,632 MXN |
| Tramo B (entrega) | 30% | $145,800 MXN | $169,128 MXN |

## Cierre y Estado del Proyecto

- **Firma del Contrato Maestro:** 28 de febrero de 2026
- **Transferencia Tramo A:** 28 de febrero de 2026 (mismo día de la firma)
- **Monto Tramo A transferido:** $394,632 MXN (incluye IVA 16%)
- **Status actual:** Architecture en progreso, Sprint 2

DG Varela firmó sin objeciones después de la presentación del modelo financiero en la Cita 4. La objeción inicial sobre el precio fue respondida con el ROI de 213% y el punto de equilibrio de 4 meses. El factor decisivo fue el hallazgo H-04 (anomalía Benford) que implicó un riesgo interno que el DG desconocía.
