---
id: "EVK-CASE-003"
title: "Caso Metalmecánica Torres — Manufactura Eficiencia de Producción"
type: case
version: "1.0"
domain: ["manufacturing", "costing", "sap-b1"]
sector: ["manufactura", "metalmecanica"]
agent_access: [all]
confidence: high
source: evangelista
last_validated: 2026-03-30
parent: ""
related: ["dmaic-framework", "manufacturing-logbook-protocol"]
depends_on: []
tags: ["merma-acero", "costeo-real", "sap-business-one", "tlaxcala"]
status: active
last_ingested: null
chunk_count: null
---

# Caso Metalmecánica Torres — Manufactura Eficiencia de Producción

## Perfil del Cliente

| Dato | Valor |
|------|-------|
| **Empresa** | Metalmecánica Torres S.A. de C.V. |
| **Sector** | Manufactura Metalmecánica (Componentes Industriales) |
| **Plantas / Sucursales** | 2 Plantas en Tlaxcala |
| **ERP** | SAP Business One + Hojas de Excel en piso |
| **Facturación aprox.** | $92,000,000 MXN / año |
| **Empleados** | 115 |
| **Sponsor** | Gerente de Planta y CFO |
| **Factor Γ** | 2.2 |

## Nodo Crítico Identificado

Metalmecánica Torres sufría del síntoma clásico de la "Manufactura Ciega": reportaban utilidades globales en el estado de resultados, pero no sabían cuáles órdenes de producción eran rentables y cuáles estaban erosionando el flujo. El Factor Γ de 2.2 reflejaba una complejidad media, centrada principalmente en la dificultad de integrar las hojas de control manual de los operadores con los datos financieros de SAP Business One. La principal preocupación era el desperdicio de materia prima (acero) cuya merma no cuadraba con las compras de insumos.

## Hallazgos del Dictamen Forense

### Hallazgo H-01 — Costeo por Promedios vs. Realidad
**Descripción técnica:**
SAP Business One estaba configurado para promediar los costos indirectos de fabricación (CIF) de manera plana sobre todas las órdenes. Sin embargo, mediante un análisis de tiempos y movimientos con dispositivos *IoT* temporales, se descubrió que las órdenes de piezas personalizadas consumían un 40% más de energía y horas-máquina que las piezas estándar, sin que este costo se reflejara en el precio de venta.

**Impacto financiero:**
- Sub-costeo operativo: **$1,450,000 MXN/año**.
- Causa raíz: Falta de un modelo de costeo por actividades (ABC) integrado al pipeline de producción.

### Hallazgo H-02 — Merma de Acero no Rastreada
**Descripción técnica:**
Conciliación de pesaje de chatarra (scrap) vs. rendimiento teórico de planos CAD. Existe una brecha del 8% entre lo que el software de diseño dice que debería ser desperdicio y lo que físicamente se registra en la venta de scrap.

**Impacto financiero:**
- Fuga de material: **$1,100,000 MXN/año**.
- Causa raíz: Malas prácticas en el nido (nesting) de troquelado y robo hormiga de sobrantes de alto valor.

### Hallazgo H-03 — Órdenes de Producción "Zombis"
**Descripción técnica:**
Se encontraron 340 órdenes de producción en SAP con estatus "Abierto" desde hace más de 18 meses. Estas órdenes acumulaban inventario en proceso (WIP) de forma ficticia, distorsionando el balance general.

**Impacto financiero:**
- Distorsión contable: **$250,000 MXN** (ajuste inmediato).
- Causa raíz: Disciplina administrativa deficiente; los supervisores inician órdenes nuevas sin cerrar administrativamente las anteriores terminado el ensamble.

## Resumen Financiero

| Hallazgo | Costo Anual ($MXN) | % del Total |
|----------|-------------------|-------------|
| H-01: Sub-costeo de CIF | $1,450,000 | 51.8% |
| H-02: Merma e Ineficiencia Nesting | $1,100,000 | 39.3% |
| H-03: WIP Ficticio y Cierre de OP | $250,000 | 8.9% |
| **Total** | **$2,800,000** | **100%** |

## Propuesta Architecture

| Indicador | Valor |
|-----------|-------|
| Factor Γ | 2.2 |
| Setup Fee (sin IVA) | $396,000 MXN |
| Success Fee (estimado) | $280,000 MXN |
| Total Architecture (sin IVA) | $676,000 MXN |
| Total con IVA (16%) | $784,160 MXN |
| **ROI proyectado** | **607%** |
| Punto de equilibrio | 3.5 meses |
| Timeline | 14 semanas |

## Estado y Resultados

Implementación del protocolo [[manufacturing-logbook-protocol]] digitalizado en tablets industriales en piso de producción. Se re-configuró el motor de costeo de SAP para asignar CIF por centros de costo dinámicos. A los 4 meses del lanzamiento de Architecture, la merma de acero bajó del 14% al 9% gracias a la trazabilidad por operador y turno. El Success Fee se pactó sobre la reducción neta comprobable de desperdicio de materia prima.
