---
id: "EVK-PLAY-002"
title: "Playbook Textiles — Guía de Engagement para el Sector"
type: playbook
version: "1.0"
domain: [procesos, datos, inventarios]
sector: [textiles]
agent_access: [analyst, pm, process, all]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: ""
related: ["playbook-manufactura", "caso-textiles-atoyac", "factor-gamma-system", "benford-law"]
depends_on: []
tags: [textiles, manufactura, foundation, architecture, inventarios]
status: active
last_ingested: null
chunk_count: null
---

# Playbook Textiles — Guía de Engagement para el Sector

## Perfil del Cliente Típico

| Atributo | Rango / Descripción |
|----------|---------------------|
| **Facturación** | $20M – $150M MXN anuales |
| **Plantas** | 2 – 4 plantas (producción, tinte, acabado, distribución) |
| **ERP** | SAP Business One (predominante en empresas > $50M MXN) |
| **Sistemas Legacy** | Sistema propio de etiquetado de rollos o telas (casi universal) |
| **Factor Γ típico** | 2.0 – 3.0 (por estructura multi-planta) |
| **Sponsor** | Dueño de la empresa o Director General de segunda generación |
| **Zona geográfica Puebla** | San Martín Texmelucan, Atlixco, Tehuacán, Cd. Puebla |

## Características Únicas del Sector Textiles

El sector textil tiene particularidades que lo distinguen de manufactura genérica:

1. **Manejo de rollos/lotes**: La unidad de inventario es el rollo o el lote de tela, no el SKU estándar. Un mismo artículo puede tener variaciones de color y textura por lote que no son visibles en el ERP.
2. **Sistemas Legacy de etiquetado**: Prácticamente todas las empresas textiles de Puebla tienen un sistema propio (desarrollado hace 10-15 años) para etiquetar y rastrear rollos físicamente. Este sistema rara vez está integrado correctamente con el ERP.
3. **Traslados inter-planta intensivos**: Las telas pasan por múltiples plantas en distintas fases (hilado → tejido → tinte → acabado → distribución). Cada traslado es un punto de ruptura potencial en la trazabilidad.
4. **Ventas por metro / kilogramo**: La facturación mezcla ventas por metro lineal, metro cuadrado y kilogramo, lo que complica los cálculos de costo unitario.

## Los 2 Dolores Principales del Sector Textil

### Dolor 1: "La mercancía se pierde entre plantas"

Esta es la queja más universal en el sector. Se manifiesta como:
- Materiales que "desaparecen" en tránsito entre plantas sin que nadie sepa dónde están
- Conteos físicos que revelan diferencias significativas vs. el ERP
- Debates entre gerentes de planta sobre qué planta "tiene" el inventario

**Lo que Foundation encuentra:**
- Órdenes de traslado sin confirmación de recepción (como en [[caso-textiles-atoyac]] H-01)
- Rollos con el mismo código de lote activo en 2 plantas simultáneamente
- Materiales marcados como "en tránsito" indefinidamente sin fecha de resolución

### Dolor 2: "No sabemos el inventario real hasta que contamos físicamente"

Manifestaciones típicas:
- El conteo físico se hace cada 3-6 meses porque "el sistema no es confiable"
- El ERP siempre muestra inventario diferente al que existe físicamente
- El Director General no confía en los reportes de inventario del ERP

**Lo que Foundation encuentra:**
- Desincronización entre el Sistema Legacy de etiquetado y el ERP (retraso promedio: 2-5 días)
- Entradas dobles no conciliadas
- Registro tardío de movimientos (almacenistas capturan al final del turno, no en el momento)

## Factor Γ en el Sector Textil

El sector textil es el que más frecuentemente genera Factor Γ ≥ 2.5 por su estructura multi-planta:

| Estructura | Γ Calculado | Setup Fee |
|------------|-------------|-----------|
| 2 plantas, 1 ERP | 2.2 | $396,000 MXN |
| 3 plantas, 1 ERP | **2.7** | **$486,000 MXN** ← Caso Atoyac |
| 3 plantas, 1 ERP + 1 Legacy | 2.9 | $522,000 MXN |
| 4 plantas, 2 sistemas | 3.2 | Protocolo Omega |

Para Γ típico del sector (2.5 – 2.9), el Timeline es de 9-12 semanas.

## Nodos Críticos Más Frecuentes

| Nodo Crítico | Hallazgo típico | Ahorro Típico |
|--------------|----------------|---------------|
| Inventario de rollos inter-planta | Traslados sin confirmar | $800K – $2M MXN/año |
| Duplicados de lote | Entradas dobles | $400K – $1M MXN/año |
| Sincronización Legacy-ERP | Retraso de días | Riesgo fiscal |
| Costos de producción por tipo de tela | Costos mal asignados por metraje | $500K – $1.5M MXN/año |

## KPIs Recomendados para Textiles

| KPI | Definición Específica para Textiles |
|-----|-------------------------------------|
| **Días en tránsito inter-planta** | Promedio de días desde que un traslado se registra hasta que se confirma recepción |
| **Tasa de duplicación de lotes** | % de códigos de lote activos en > 1 planta simultáneamente |
| **Diferencia SAP vs. físico** | % de discrepancia entre inventario en ERP y último conteo físico |
| **Retraso de sincronización Legacy-ERP** | Horas promedio entre registro en Legacy y actualización en ERP |
| **Costo de tela por tipo** | Costo real (metro lineal) vs. estándar presupuestado |

## Preguntas de Scoping para la Cita 1

Las siguientes preguntas revelan el Factor Γ y la gravedad del problema rápidamente:

1. "¿Con qué frecuencia hacen conteos físicos de inventario? ¿Y qué tan grandes son las diferencias que encuentran?"
2. "Cuando transfieren rollos de [planta A] a [planta B], ¿cómo saben que llegaron correctamente?"
3. "¿El sistema de etiquetado y SAP hablan entre sí automáticamente, o alguien tiene que capturar en los dos?"
4. "¿Cuántas plantas tiene la operación? ¿Cada una tiene su propio almacén?"
5. "¿El último conteo físico encontró diferencias? ¿De cuánto?"

La respuesta a estas preguntas casi siempre confirma el patrón textil: traslados sin confirmar + desincronización de sistemas.

## Referencia de Caso

**[[caso-textiles-atoyac]]** es el caso de referencia primario para este playbook. Todos los ejemplos de este playbook son consistentes con los hallazgos reales de ese proyecto. Al presentar Foundation a un cliente textil, el CEO puede mencionar:

> "Hemos trabajado con empresas del sector en Puebla. En un caso típico de manufactura textil con 3 plantas, encontramos más de $3M MXN anuales en costos ocultos que el sistema de ERP no estaba capturando correctamente. ¿Les gustaría que revisáramos si su operación tiene patrones similares?"

Este "benchmarking anónimo" es poderoso porque el CEO habla de resultados reales sin revelar el nombre del cliente.
