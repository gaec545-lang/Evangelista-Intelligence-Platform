---
id: monte-carlo-simplified
title: "Monte Carlo Simplificado para Riesgos en PyME"
type: formula
agent_access: [risk, financial]
tags: [monte-carlo, simulacion, riesgos, estadistica, probabilidad]
sector: [todos]
dominios: [riesgos, finanzas]
version: "1.0"
author: evangelista
---

# Monte Carlo Simplificado para Simulación de Riesgos en PyME

## ¿Qué es y para qué sirve?

Monte Carlo es una técnica de simulación que genera miles de escenarios posibles usando distribuciones de probabilidad en lugar de valores únicos. En el contexto de Evangelista, se usa para:

1. **Cuantificar el rango de pérdida esperada** ante un riesgo operativo
2. **Evaluar el impacto financiero** de decisiones con incertidumbre (¿vale la pena invertir en este control?)
3. **Comunicar riesgo a directivos** con lenguaje de negocio: "existe 80% de probabilidad de que la pérdida sea menor a $X"

## Versión Simplificada para PyME (sin software especializado)

### Paso 1 — Identificar las variables inciertas
Para cada riesgo clave, definir:
- **Mínimo probable** (percentil 10)
- **Valor más probable** (moda)
- **Máximo probable** (percentil 90)

**Ejemplo: Riesgo de ruptura de stock en manufactura textil**
- Costo por día de paro: Mínimo=$50K, Más probable=$120K, Máximo=$400K MXN
- Días de paro por evento: Mínimo=1, Más probable=3, Máximo=10 días
- Frecuencia anual: Mínimo=0, Más probable=2, Máximo=6 eventos

### Paso 2 — Distribución PERT (simplificación de Beta)

Para cada variable: `Valor_simulado = (Mín + 4×Moda + Máx) / 6`

Esta es la media PERT. Para simular variabilidad:
```
σ_PERT = (Máx - Mín) / 6
```

### Paso 3 — Simulación en Excel/Python (1,000 iteraciones mínimo)

```python
import numpy as np

def pert_sample(min_val, mode, max_val, n=1000):
    """Muestrea de distribución PERT usando Beta."""
    mean = (min_val + 4*mode + max_val) / 6
    sigma = (max_val - min_val) / 6
    # Parámetros Beta
    a = ((mean - min_val) * (2*mode - min_val - max_val)) / \
        ((mode - mean) * (max_val - min_val))
    b = a * (max_val - mean) / (mean - min_val)
    return min_val + (max_val - min_val) * np.random.beta(a, b, n)

# Simular pérdida anual por ruptura de stock
np.random.seed(42)
costo_dia = pert_sample(50_000, 120_000, 400_000)
dias_paro = pert_sample(1, 3, 10)
frecuencia = pert_sample(0, 2, 6)

perdida_anual = costo_dia * dias_paro * frecuencia

print(f"Pérdida esperada (media): ${perdida_anual.mean():,.0f} MXN")
print(f"Percentil 80: ${np.percentile(perdida_anual, 80):,.0f} MXN")
print(f"Percentil 95: ${np.percentile(perdida_anual, 95):,.0f} MXN")
```

### Paso 4 — Interpretar y comunicar

**Formato para reporte ejecutivo:**
> "Basado en 1,000 simulaciones, el costo esperado de rupturas de stock es **$720,000 MXN/año**. En el 80% de los escenarios, la pérdida no supera $1.4M MXN. En el peor 5% de los casos, puede llegar a $3.2M MXN."

## Aplicación al Costo de Inacción

El Monte Carlo se combina con la fórmula del Costo de Inacción para responder:
**"¿Cuánto cuesta NO contratar a Evangelista?"**

```
Costo_Inacción = E[Pérdida_Anual] × Horizonte_años - Inversión_Evangelista
```

Si `Costo_Inacción > 0`, el proyecto tiene VPN positivo incluso en el escenario conservador.

## Limitaciones y Honestidad

- **No es predicción:** Monte Carlo muestra rangos, no certezas
- **Garbage in, garbage out:** Si los rangos son malos, los resultados son inútiles
- **Correlaciones ignoradas:** La versión simplificada asume independencia entre variables
- **Uso correcto:** Como herramienta de diálogo con el cliente, no como oráculo
