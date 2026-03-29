---
id: "EVK-RULE-002"
title: "Cumplimiento SAT para PyMEs — Riesgos Fiscales Identificados en Foundation"
type: rule
version: "1.0"
domain: [finanzas, riesgos]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [financial, risk, analyst, all]
confidence: high
source: sat
last_validated: 2026-03-28
parent: ""
related: ["evangelista-rules", "benford-law", "caso-textiles-atoyac", "alcoa-protocol"]
depends_on: []
tags: [riesgos, finanzas, foundation]
status: active
last_ingested: null
chunk_count: null
---

# Cumplimiento SAT para PyMEs — Riesgos Fiscales Identificados en Foundation

## Contexto

El Servicio de Administración Tributaria (SAT) de México ha incrementado significativamente sus capacidades de auditoría a PyMEs desde 2022, con especial énfasis en:
- Discrepancias entre inventario contable y físico
- Comprobantes fiscales digitales (CFDI) con montos inconsistentes
- Operaciones con empresas que facturan operaciones simuladas (EFOS)
- Fraccionamiento de operaciones para evadir umbrales de control

Foundation de Evangelista identifica proactivamente estos riesgos como parte del Dictamen Forense, permitiendo al cliente remediarlos antes de una auditoría del SAT.

## Riesgos SAT Más Frecuentes en Clientes de Evangelista

### Riesgo 1 — Discrepancia Inventario-Libros Contables

**Descripción:** Cuando el inventario físico no coincide con el contable, el SAT puede interpretar la diferencia como:
- Ingresos no declarados (si el inventario físico es menor al contable)
- Compras ficticias (si el inventario físico es mayor al contable)

**Nivel de riesgo:** Alto
**Hallazgo relacionado:** Traslados inter-planta sin confirmar (como en Textiles Atoyac H-01) generan exactamente este tipo de discrepancia a escala.

**Remediación Architecture:** El ETL con confirmación automática de traslados elimina la discrepancia sistémica.

### Riesgo 2 — Registros sin Trazabilidad Temporal

**Descripción:** El SAT requiere que cada movimiento contable tenga una fecha y hora de registro contemporánea al evento. Registros capturados días después del evento físico (como el retraso Legacy-SAP de 3 días en Atoyac H-03) pueden ser cuestionados en una auditoría.

**Nivel de riesgo:** Medio-Alto
**Remediación Architecture:** El ETL automatizado captura los eventos en tiempo real, eliminando el retraso de sincronización.

### Riesgo 3 — Patrones de Fraccionamiento

**Descripción:** El SAT tiene herramientas estadísticas para detectar el fraccionamiento de operaciones (similar a la Ley de Benford que usa Evangelista). Si detecta un patrón de operaciones justo por debajo de umbrales de autorización o de umbrales de retención, puede iniciar una auditoría por presunción de evasión.

**Nivel de riesgo:** Alto (si el p-value del test de Benford es < 0.01)
**Hallazgo relacionado:** H-04 en Textiles Atoyac — concentración anómala en $15,000-$16,999 MXN.

### Riesgo 4 — Operaciones con EFOS

**Descripción:** Si algún proveedor del cliente está clasificado como EFOS (Empresa que Factura Operaciones Simuladas) por el SAT, todas las operaciones con ese proveedor pueden ser rechazadas como deducciones y generar créditos fiscales revocados con recargos y multas.

**Nivel de riesgo:** Bajo-Medio (depende de la cartera de proveedores)
**Detección en Foundation:** Cruzar RFC de proveedores del cliente con la lista negra del SAT (descargable públicamente del portal del SAT).

## Cómo Presentar el Riesgo SAT al Cliente

El CEO nunca presenta el riesgo SAT de forma alarmista. La formulación recomendada es:

> "Además de los costos operativos que identificamos, encontramos [descripción del hallazgo] que en el contexto de una revisión del SAT podría ser interpretado como [descripción del riesgo fiscal]. Esto no significa que haya problema hoy — significa que resolver esto con Architecture es también una protección fiscal, no solo un tema de eficiencia operativa."

Este enfoque convierte el riesgo SAT de una amenaza abstracta en un argumento adicional de ROI: el costo de una auditoría del SAT (honorarios legales, recargos, multas, tiempo directivo) puede fácilmente superar el costo de Architecture.

## Disclaimer Obligatorio

> **Nota**: Evangelista & Co. no es un despacho fiscal ni jurídico. Los riesgos fiscales identificados en el Dictamen Forense son señalamientos de alerta basados en patrones de datos. Para la evaluación legal y fiscal definitiva, el cliente debe consultar a su contador o asesor fiscal certificado. Evangelista recomienda esta consulta como parte del proceso de remediación.
