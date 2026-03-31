---
id: "EVK-CASE-011"
title: "Adaptación Columbia — Forense Financiero y Detección de Fraude"
type: case
version: "1.0"
domain: ["finance", "forensics", "audit"]
sector: ["contabilidad", "servicios"]
agent_access: [all]
confidence: high
source: academic-columbia
last_validated: 2026-03-30
parent: ""
related: ["benford-law-protocol", "sentinel-fraud-detection"]
depends_on: []
tags: ["financial-forensics", "columbia-adapted", "benford-law", "puebla"]
status: active
last_ingested: null
chunk_count: null
---

# Adaptación Columbia — Forense Financiero y Detección de Fraude

## Contexto del Caso Original (Columbia Business School)

El caso original de Columbia explora el uso de herramientas estadísticas para la detección de fraude contable. Se enfoca en el análisis de discrepancias masivas en estados de resultados de empresas públicas y el uso de la **Ley de Benford** (frecuencia de dígitos) para identificar anomalías que los auditores tradicionales suelen pasar por alto.

## Adaptación al Contexto PyME Mexicana

En la PyME mexicana, el "fraude" es menos común que la **ineficiencia extrema** y el error de captura manual. Sin embargo, ambos se ven estadísticamente iguales en un análisis de datos. La mayoría de los "libros cocinados" en una PyME son el resultado de la duplicidad de facturas, la falta de controles en caja chica y la captura de datos basada en estimaciones en lugar de transacciones reales.

### Escenario Adaptado: Comercializadora de Refacciones con 50 empleados
- **Suelo:** Facturación manual de tickets de venta por un equipo administrativo sobrepasado.
- **Problema:** El margen neto declarado es del 15%, pero el flujo de caja disponible sugiere que es del 8%. ¿Dónde está el dinero?
- **Fallas detectadas por Evangelista:** El 20% de las facturas no tienen un CFDI (XML) válido que las respalde en el sistema, lo que indica un pasivo fiscal oculto.

## Hallazgos con Enfoque Evangelista

### Hallazgo H-01 — Anomalías en el Primer Dígito (Benford)
**Descripción técnica:**
Análisis de frecuencia de facturación de compras. Los datos muestran una frecuencia anormal del dígito "9" (facturas de $9,XXX MXN) y del dígito "4" ($4,XXX MXN). Estas frecuencias superan en un 300% lo esperado según la Ley de Benford.

**Impacto financiero:**
- Posible desvío/error recurrente: **$850,000 MXN/año**.
- Causa raíz: Segmentación deliberada de facturas para evitar que el Director General deba autorizar gastos mayores a $15,000 MXN.

### Hallazgo H-02 — El Pasivo Fiscal "Invisible"
**Descripción técnica:**
Conciliación de Base de Datos vs. Bóveda Fiscal del SAT. Se detectaron transacciones registradas como "pagadas" en el ERP, pero cuyos CFDI fueron cancelados por el proveedor un mes después.

**Impacto financiero:**
- Riesgo de multa SAT: **$420,000 MXN** (más recargos).
- Causa raíz: Falta de un sistema de vigilancia fiscal automático que valide el estatus de los comprobantes recibidos.

## Solución Basada en Architecture

Implementación del módulo **Sentinel Financial Forensics**:
1. **Radar Benford:** Alerta inmediata cuando un proveedor o categoría de gasto presenta patrones anómalos estadísticamente.
2. **Conciliador Fiscal Automático:** Sincronización diaria con el portal del SAT para validar que ningún comprobante registrado en el ERP haya sido cancelado.
3. **Dashboard de Coherencia:** Gráficos que comparan la Facturación Emitida vs. Bancos vs. Costo de Venta, disparando alertas de "Incoherencia Sistémica".

## Lecciones para los Agentes Especialistas

- **Para Risk Analyst:** El dato no miente. Si la estadística de Benford se rompe, hay una falla de control o un fraude en curso.
- **Para Financial Specialist:** Integrar la validación de XMLs como parte fundamental del dictamen forense. [[sentinel-fraud-detection]].
- **Argumento de Venta:** "No audite personas, audite datos. Una anomalía estadística es una fuga de dinero comprobada".
