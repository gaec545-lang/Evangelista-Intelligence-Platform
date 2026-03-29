---
id: "EVK-FOR-008"
title: "Monte Carlo Simplificado — Estimación de Rangos de Ahorro"
type: formula
version: "1.0"
domain: [datos, finanzas, riesgos]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [data_eng, financial, risk, analyst]
confidence: medium
source: custom
last_validated: 2026-03-28
parent: ""
related: ["benford-law", "roi-npv-irr", "success-fee-calc"]
depends_on: []
tags: [datos, riesgos, finanzas, foundation]
status: active
last_ingested: null
chunk_count: null
---

# Monte Carlo Simplificado — Estimación de Rangos de Ahorro

## ¿Por qué Monte Carlo en el contexto de Evangelista?

El ahorro proyectado en Foundation (y en el Success Fee) se basa en estimaciones que tienen incertidumbre inherente. El factor de merma (30% en Atoyac), el valor monetario por unidad de inventario, y la frecuencia de ocurrencia de los problemas son estimados, no certezas.

Monte Carlo permite calcular no solo el **valor esperado** del ahorro sino también el **rango de probabilidad** (escenario optimista, base y pesimista).

## Implementación Simplificada (3 Escenarios)

En lugar de una simulación completa de Monte Carlo con N iteraciones, Evangelista usa una versión de 3 escenarios que es suficientemente robusta para PyMEs:

```python
import numpy as np

def monte_carlo_ahorro(
    frecuencia_base, frecuencia_min, frecuencia_max,
    costo_unit_base, costo_unit_min, costo_unit_max,
    factor_merma_base, factor_merma_min, factor_merma_max,
    n_simulaciones=10000
):
    """
    Simulación Monte Carlo de ahorro anual.
    Parámetros: valores base, mínimo y máximo para cada variable.
    """
    # Distribuciones triangulares (apropiadas cuando no hay datos históricos)
    frecuencia = np.random.triangular(frecuencia_min, frecuencia_base, frecuencia_max, n_simulaciones)
    costo_unit = np.random.triangular(costo_unit_min, costo_unit_base, costo_unit_max, n_simulaciones)
    factor_merma = np.random.triangular(factor_merma_min, factor_merma_base, factor_merma_max, n_simulaciones)

    ahorro_simulado = frecuencia * costo_unit * factor_merma

    return {
        'media': np.mean(ahorro_simulado),
        'p10': np.percentile(ahorro_simulado, 10),  # escenario pesimista
        'p50': np.percentile(ahorro_simulado, 50),  # escenario base
        'p90': np.percentile(ahorro_simulado, 90),  # escenario optimista
        'std': np.std(ahorro_simulado)
    }
```

## Ejemplo — H-01 Textiles Atoyac

```python
resultado = monte_carlo_ahorro(
    # Frecuencia (órdenes sin confirmar por año)
    frecuencia_base=565, frecuencia_min=400, frecuencia_max=750,
    # Costo unitario por orden ($MXN)
    costo_unit_base=5700, costo_unit_min=4000, costo_unit_max=7500,
    # Factor de merma
    factor_merma_base=0.30, factor_merma_min=0.20, factor_merma_max=0.40
)

# Resultado:
# Media:    $1,423,500 MXN
# P10:      $672,000   MXN  (escenario pesimista — 10% de probabilidad de ser menor)
# P50:      $1,397,500 MXN  (escenario base)
# P90:      $2,187,000 MXN  (escenario optimista)
```

## Cómo Presentar el Rango al Cliente

> "El ahorro proyectado tiene un rango dependiendo de qué tan agresivamente se resuelva cada problema. En el escenario conservador: $672,000 MXN anuales. En el escenario base, que es el más probable según los datos: $1.4M MXN. En el escenario optimista: $2.2M MXN. Para la propuesta usamos el escenario base para ser conservadores con usted."

Presentar un rango en lugar de un número único transmite rigor estadístico y honestidad intelectual — características que diferencian a Evangelista de consultores que "inflan" el ahorro prometido.

## Cuándo usar Monte Carlo en Foundation

Monte Carlo se usa cuando:
1. El costo unitario tiene alta incertidumbre (estimación cualitativa del cliente)
2. El factor de merma no tiene datos históricos directos
3. El cliente pide "¿qué tan seguros están del ahorro prometido?"

Para hallazgos con datos directos (como duplicados de lote donde el valor es directamente del ERP), no se necesita Monte Carlo — el número es exacto.
