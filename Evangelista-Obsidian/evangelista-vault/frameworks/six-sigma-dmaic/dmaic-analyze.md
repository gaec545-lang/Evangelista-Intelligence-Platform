---
id: "EVK-FWK-004"
title: "DMAIC Fase Analyze — Identificación de Causas Raíz con Impacto Financiero"
type: framework
version: "1.0"
domain: [procesos, finanzas, datos]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [analyst, process, financial, all]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: "_moc-dmaic"
related: ["dmaic-measure", "dmaic-define", "caso-textiles-atoyac", "roi-npv-irr"]
depends_on: ["dmaic-define", "dmaic-measure"]
tags: [six-sigma, dmaic, procesos, finanzas, riesgos]
status: active
last_ingested: null
chunk_count: null
---

# DMAIC Fase Analyze — Identificación de Causas Raíz con Impacto Financiero

## ¿Qué es la Fase Analyze?

La Fase Analyze es el tercer paso del DMAIC. Su objetivo es identificar las **causas raíz** de los problemas medidos en la Fase Measure — no los síntomas, no las causas superficiales, sino los factores estructurales que, si se eliminan, resuelven el problema de raíz.

> [!RULE] Se ataca la causa raíz, no el síntoma.
> Si el inventario no cuadra (síntoma), investigar por qué. Las causas raíz pueden ser: entrada doble en SAP por proceso manual, retraso de sincronización del sistema Legacy, o falta de protocolo de confirmación de recepción en traslados inter-planta. Tratar el síntoma (hacer un conteo físico mensual) no elimina ninguna de estas causas.

## División de roles en la Fase Analyze

En Evangelista, la Fase Analyze tiene una división clara de responsabilidades:

| Rol | Responsabilidad en Analyze |
|-----|---------------------------|
| **CTO** | Identifica causas técnicas: bugs de sistema, desincronizaciones, procesos manuales que generan errores |
| **CEO** | Traduce las causas técnicas a **impacto financiero**. Monetiza cada causa raíz. |
| **CFO** | Valida que los cálculos financieros sean coherentes con la contabilidad real del cliente |

> [!CRITICAL] División de responsabilidades
> El CTO entrega datos y causas técnicas. El CEO entrega el impacto en pesos mexicanos. Nunca al revés. Si el CTO empieza a hablar de pesos o el CEO empieza a hablar de queries SQL, se rompe la cadena de custody intelectual y el reporte pierde credibilidad.

## Herramienta 1: Diagrama de Ishikawa Adaptado

El Diagrama de Ishikawa (espina de pescado) en Evangelista tiene 6 categorías adaptadas a PyMEs de manufactura/textiles:

```
                    EFECTO: [Descripción del problema medido]

Sistemas ──────┐    Procesos ──────┐
               │                   │
               ├───────────────────┼──── EFECTO
               │                   │
Personas ──────┘    Datos ─────────┘

+ Infraestructura (física) + Proveedores (externos)
```

**Ejemplo aplicado a Textiles Atoyac — H-01 (traslados sin confirmación):**
- **Sistemas**: SAP B1 no tiene alerta automática para órdenes de traslado sin confirmación > 48h
- **Procesos**: No existe protocolo escrito para confirmar recepción en plantas receptoras
- **Personas**: Los almacenistas de planta receptora no tienen acceso a SAP para registrar recepción
- **Datos**: Los movimientos de traslado se marcan como "en tránsito" indefinidamente sin trigger de cierre

## Herramienta 2: Los 5 Porqués

Para cada causa identificada en el Ishikawa, se aplica la técnica de los 5 Porqués hasta llegar a la causa raíz sistémica:

**Ejemplo:**
1. ¿Por qué hay 847 órdenes sin confirmación? → Porque nadie las cierra en SAP
2. ¿Por qué nadie las cierra? → Porque el proceso de recepción en planta no incluye ese paso
3. ¿Por qué no incluye ese paso? → Porque el ERP fue implementado sin configurar el flujo completo
4. ¿Por qué el ERP no tiene el flujo completo? → Porque la implementación se hizo con prisas y sin documentar el proceso actual
5. ¿Por qué se implementó sin documentar el proceso? → **Causa raíz**: La empresa nunca formalizó sus procesos operativos antes de digitalizar

La causa raíz #5 es la que Architecture resuelve con el Data Warehouse + procesos formalizados.

## Herramienta 3: Análisis de Pareto (80/20)

No todas las causas raíz tienen el mismo impacto financiero. El Pareto ayuda a priorizar:

| Hallazgo | Costo Anual ($MXN) | % del Total | % Acumulado |
|----------|-------------------|-------------|-------------|
| H-01: Traslados sin confirmación | $1,443,600 | 45.7% | 45.7% |
| H-04: Anomalía Benford | $953,700 | 30.2% | 75.9% |
| H-02: Duplicados de lote | $762,000 | 24.1% | 100.0% |
| H-03: Desincronización Legacy | Riesgo fiscal | — | — |

El 80% del ahorro viene del H-01 y H-04. Architecture prioriza resolver estos dos primero.

## Monetización de causas raíz (responsabilidad del CEO)

Para cada causa raíz identificada, el CEO asigna un valor monetario usando esta metodología:

```
Costo Anual = Frecuencia × Costo Unitario × Factor de Merma

Ejemplo H-01:
- Valor en tránsito: $4,812,000 MXN
- Factor de merma estimada: 30% (30% del inventario en tránsito > 30 días se deteriora o pierde)
- Costo anual = $4,812,000 × 0.30 = $1,443,600 MXN/año
```

La metodología de monetización se documenta en el [[roi-npv-irr]] y en el Dictamen Forense para que el cliente pueda auditarla.

## Output: Mapa de Causas Raíz

Al final de la Fase Analyze, el equipo produce el **Mapa de Causas Raíz**, que incluye:

1. Lista de causas raíz identificadas (máximo 10, ordenadas por impacto)
2. Evidencia técnica de cada causa (screenshot, query, log)
3. Costo anual monetizado de cada causa
4. Causa raíz sistémica (el "por qué #5" de cada hallazgo)
5. Propuesta preliminar de solución para cada causa (input para la Fase Improve)

Este mapa es el corazón del Dictamen Forense que se presenta en la [[evangelista-rules]] (Cita 3).

## Conexión con Architecture

Las causas raíz identificadas en Analyze definen directamente el alcance técnico de Architecture:
- Causa raíz sistémica → Módulo del Data Warehouse a construir
- Costo anual monetizado → Basis del [[success-fee-calc]]
- Frecuencia del problema → KPI de monitoreo para Sentinel

El CEO no llega a la Cita 4 sin haber completado la Fase Analyze. Es el insumo más crítico para la presentación de Architecture.
