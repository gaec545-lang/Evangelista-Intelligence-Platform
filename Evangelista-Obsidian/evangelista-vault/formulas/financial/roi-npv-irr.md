---
id: "EVK-FOR-004"
title: "ROI, NPV e IRR — Fórmulas Financieras para Propuestas Architecture"
type: formula
version: "1.0"
domain: [finanzas]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [financial, analyst, pm]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: ""
related: ["success-fee-calc", "architecture-pricing", "caso-textiles-atoyac"]
depends_on: []
tags: [finanzas, architecture, pricing]
status: active
last_ingested: null
chunk_count: null
---

# ROI, NPV e IRR — Fórmulas Financieras para Propuestas Architecture

## Propósito

Estas fórmulas son la columna vertebral del modelo financiero que el CEO presenta en la **Cita 4** (Architecture). Su objetivo es convertir el ahorro técnico identificado en Foundation en un lenguaje de negocios que resuene con el Sponsor (Director General o dueño).

El modelo financiero responde a la pregunta del cliente: **"¿Por qué vale la pena invertir $X en este proyecto?"**

---

## ROI — Retorno sobre la Inversión

```
ROI (%) = [(Ahorro Anual − Inversión Total) / Inversión Total] × 100
```

### Componentes

| Componente | Descripción |
|------------|-------------|
| **Ahorro Anual** | Suma de los costos anuales de todos los hallazgos del Dictamen |
| **Inversión Total** | Setup Fee + Success Fee estimado (sin IVA) |

### Ejemplo — Textiles Atoyac

```
Ahorro Anual = $3,159,300 MXN (suma de H-01 + H-02 + H-04)
Inversión Total = $486,000 + $526,550 = $1,012,550 MXN

ROI = [($3,159,300 - $1,012,550) / $1,012,550] × 100
ROI = [$2,146,750 / $1,012,550] × 100
ROI = 212.0% ≈ 213%
```

### Regla de presentación del ROI

El CEO presenta el ROI redondeado a número entero, siempre **después** de presentar el ahorro. El orden importa:

1. "El sistema detectó un problema que les cuesta $3.16M MXN al año."
2. "La inversión para resolverlo es $1.01M MXN."
3. "El retorno es del 213% en 12 meses."

Si el ROI se presenta primero, el cliente se ancla en el porcentaje. Si el ahorro se presenta primero, el cliente se ancla en los millones que está perdiendo — que es más efectivo emocionalmente.

---

## Punto de Equilibrio

```
Punto de Equilibrio (meses) = Inversión Total / (Ahorro Mensual)
```

```
Ahorro Mensual = Ahorro Anual / 12

Ejemplo Atoyac:
Ahorro Mensual = $3,159,300 / 12 = $263,275 MXN/mes
Punto de Equilibrio = $1,012,550 / $263,275 = 3.84 meses ≈ ~4 meses
```

El punto de equilibrio es la métrica más poderosa para el cierre comercial. Convierte la inversión en tiempo, no en dinero:

> "En 4 meses el sistema se paga solo. A partir del mes 5, todo es ahorro neto para la empresa."

---

## NPV — Valor Presente Neto

```
NPV = Σ [Flujo_t / (1 + r)^t] − Inversión_inicial
```

Donde:
- **Flujo_t**: Ahorro neto en el período t (después de deducir el Success Fee)
- **r**: Tasa de descuento (usar WACC de la empresa, o 15% si no se conoce)
- **t**: Período (meses o años)

### Cuándo usar el NPV en propuestas

El NPV se usa principalmente cuando el cliente es sofisticado financieramente (Director Financiero presente en la Cita 4) o cuando el proyecto tiene un horizonte largo (Sentinel = 2-3 años de contrato).

Para el perfil típico de cliente Evangelista (dueño de PyME, 40-55 años, sin educación financiera formal), el ROI y el Punto de Equilibrio son más efectivos que el NPV.

### Ejemplo NPV a 3 años — Textiles Atoyac

```
Tasa de descuento: 15% anual (típica para PYME México, CETES + riesgo operativo)
Inversión inicial: $1,012,550 MXN
Ahorro anual neto (después de Sentinel ~$180,000 MXN/año): $2,979,300 MXN

Año 1: $2,979,300 / 1.15^1 = $2,590,696
Año 2: $2,979,300 / 1.15^2 = $2,252,779
Año 3: $2,979,300 / 1.15^3 = $1,959,808

NPV = ($2,590,696 + $2,252,779 + $1,959,808) − $1,012,550
NPV = $6,803,283 − $1,012,550
NPV = $5,790,733 MXN
```

Un NPV positivo de $5.79M MXN confirma que el proyecto crea valor significativo incluyendo el costo del dinero.

---

## IRR — Tasa Interna de Retorno

```
IRR es la tasa r que hace NPV = 0
Se calcula iterativamente (no tiene fórmula cerrada)
```

Para el caso de Textiles Atoyac, el IRR es aproximadamente **245% anual** — muy superior al costo de capital de cualquier PyME mexicana.

El IRR se usa en propuestas cuando el cliente compara el proyecto contra otras inversiones (maquinaria, expansión, financiamiento bancario). La pregunta implícita es: "¿Es mejor invertir en esto que en [alternativa]?"

> "El IRR de este proyecto es 245% anual. Comparado con una línea de crédito bancaria al 18% anual o con una máquina nueva al 30% de ROI, este proyecto es la inversión de mayor retorno disponible para su empresa hoy."

---

## Costo de la Inacción

La métrica más subestimada en las propuestas. Ver [[cost-of-inaction]] para el cálculo completo.

```
Costo de Inacción Mensual = Ahorro Anual / 12

Ejemplo Atoyac: $3,159,300 / 12 = $263,275 MXN por cada mes de retraso en decidir
```

El CEO lo presenta al cierre:

> "Cada mes que pasan sin decidir les cuesta $263,275 MXN en pérdidas que ya conocemos y que ya cuantificamos. La decisión de no decidir tiene un precio."
