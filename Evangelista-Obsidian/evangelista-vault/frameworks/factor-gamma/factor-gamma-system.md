---
id: "EVK-FWK-005"
title: "Sistema Factor Gamma — Multiplicador de Complejidad Organizacional"
type: framework
version: "1.0"
domain: [finanzas, procesos]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [financial, analyst, pm]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: ""
related: ["architecture-pricing", "foundation-pricing", "evangelista-rules", "caso-textiles-atoyac"]
depends_on: []
tags: [pricing, factor-gamma, architecture, finanzas]
status: active
last_ingested: null
chunk_count: null
---

# Sistema Factor Gamma — Multiplicador de Complejidad Organizacional

## Definición del Factor Γ

```
Γ = 1 + (0.5 × Sucursales) + (0.2 × Sistemas ERP)
```

El Factor Gamma (Γ) es el multiplicador de complejidad organizacional que escala el Setup Fee de Architecture en función de la estructura operativa del cliente. Fue diseñado por Evangelista & Co. para capturar objetivamente la complejidad de integración sin depender del juicio subjetivo del CEO.

El Factor Γ se calcula durante la **Cita 1** utilizando la Scoping Calculator V4 y se presenta al cliente como parte del modelo de propuesta en la **Cita 4**.

> [!RULE] Regla de Preparación
> El CEO lleva Γ **pre-calculado** a la sesión de Architecture (Cita 4). **Nunca** lo calcula en vivo frente al cliente. Calcular en vivo transmite improvisación e inseguridad. El número debe estar listo antes de que empiece la reunión.

## Los Tres Factores del Sistema

### Factor Γ (Gamma) — Complejidad Estructural

```
Γ = 1 + (0.5 × Sucursales) + (0.2 × Sistemas ERP)
```

Escala el **Setup Fee** de Architecture.

| Componente | Definición | Peso |
|------------|------------|------|
| Base | Empresa mínima viable (1 sede, 1 ERP) | 1.0 |
| Sucursales | Cada planta, bodega o punto de operación adicional con datos propios | +0.5 cada una |
| Sistemas ERP | Cada sistema de gestión independiente a integrar | +0.2 cada uno |

**Ejemplos:**

| Empresa | Sucursales | ERPs | Γ |
|---------|------------|------|---|
| Taller familiar (1 sede) | 0 | 1 | 1.2 |
| Empresa con bodega | 1 | 1 | 1.7 |
| Dos plantas + CONTPAQi | 2 | 1 | 2.2 |
| **Textiles Atoyac** | **3** | **1** | **2.7** |
| Multi-ERP (SAP + CONTPAQi) | 3 | 2 | 2.9 |
| Protocolo Omega | 4+ | 2+ | >3.0 |

### Factor β (Beta) — Entropía de Datos

```
β = Σ(F_manual × 0.2 + F_roto × 0.5) / N_fuentes
```

Escala el **precio de Foundation** y determina la **viabilidad del proyecto**.

| Rango β | Interpretación | Decisión |
|---------|---------------|----------|
| 0.0 – 0.3 | Entorno digital ordenado | Go — Foundation estándar |
| 0.3 – 0.5 | Caos moderado | Go — Foundation con αβ ajustado |
| 0.5 – 0.7 | Caos severo | Go condicional — riesgo de timeline |
| > 0.7 | Entropía extrema | **No-Go** — proyecto inviable en plazos estándar |

Un β > 0.7 significa que más de 70% de las fuentes de datos son manuales o tienen integridad referencial rota. En esas condiciones, no es posible construir un Data Warehouse confiable sin primero limpiar los datos, lo cual está fuera del alcance de Foundation.

### Factor α (Alpha) — Volumen de Datos

```
α = log₁₀(Registros Totales) - 4
```

Determina si hay **suficiente data para Machine Learning** y escala el precio de Foundation.

| Registros | α calculado | Interpretación |
|-----------|-------------|----------------|
| < 10,000 | < 0 → 0 | Sin escala (datos insuficientes) |
| 10,000 | 0.0 | Mínimo viable para análisis estadístico |
| 100,000 | 1.0 | Suficiente para reportería inteligente |
| 1,000,000 | 2.0 → cap 0.25 | ML viable — volumen enterprise |

Si α < 1.0, los modelos predictivos (ML) no son recomendables. El proyecto Architecture se limita a reportería y alertas, no a predicciones. Esto debe comunicarse al cliente para gestionar expectativas.

## Cálculo Integrado en Scoping Calculator V4

Los tres factores se calculan simultáneamente durante la Cita 1 en la Scoping Calculator V4 (hoja de cálculo interna de Evangelista). El output automático es:

1. **Precio Foundation** = $35,000 × (1 + α + β) + viáticos
2. **Setup Fee Architecture** = $180,000 × Γ
3. **Recomendación Go/No-Go** basada en β y α
4. **Timeline estimado** basado en Γ
5. **Probabilidad de éxito de ML** basada en α

El CEO solo necesita ingresar 5 datos en la calculadora:
- Número de registros totales en el ERP
- Número de fuentes manuales (Excel, papel)
- Número de fuentes con integridad rota
- Número de sucursales/plantas
- Número de sistemas ERP activos

## Conexión con el Vetting Gate

El Factor Γ es uno de los 4 criterios del **Vetting Gate** (Regla G-08):

| Criterio | Factor | Umbral de Go |
|----------|--------|--------------|
| Entropía aceptable | β | β < 0.7 |
| Datos suficientes | α | α ≥ 0.0 (idealmente ≥ 1.0) |
| Complejidad manejable | Γ | Γ < 3.0 (si Γ ≥ 3.0 → Protocolo Omega) |
| Sponsor con autoridad | Cualitativo | DG o Dueño en la sala |

Si alguno de los 4 criterios es rojo, Architecture no se presenta (Cita 4 no ocurre). La decisión es del CEO y CTO en consenso (Regla G-03).

## Referencia de casos

- **[[caso-textiles-atoyac]]**: Γ = 2.7, β = 0.25, α = 0.25. Los tres factores en verde. Setup Fee = $486,000 MXN. Proyecto Go.
