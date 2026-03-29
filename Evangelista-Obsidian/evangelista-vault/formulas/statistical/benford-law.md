---
id: "EVK-FOR-005"
title: "Ley de Benford — Análisis Forense de Integridad de Datos"
type: formula
version: "1.0"
domain: [datos, riesgos, finanzas]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [data_eng, risk, analyst, all]
confidence: high
source: custom
last_validated: 2026-03-28
parent: ""
related: ["alcoa-protocol", "dmaic-measure", "caso-textiles-atoyac"]
depends_on: []
tags: [foundation, datos, riesgos, six-sigma]
status: active
last_ingested: null
chunk_count: null
---

# Ley de Benford — Análisis Forense de Integridad de Datos

## ¿Qué es la Ley de Benford?

La Ley de Benford (también llamada Ley del Primer Dígito) establece que en conjuntos de datos que ocurren naturalmente — facturas, movimientos de inventario, gastos operativos, montos de cheques — el primer dígito significativo NO está distribuido uniformemente. En cambio, sigue una distribución logarítmica predecible:

```
P(d) = log₁₀(1 + 1/d)
```

Donde **d** es el primer dígito (1 a 9).

### Distribución Esperada

| Primer Dígito | Frecuencia Esperada |
|---------------|---------------------|
| 1 | 30.1% |
| 2 | 17.6% |
| 3 | 12.5% |
| 4 | 9.7% |
| 5 | 7.9% |
| 6 | 6.7% |
| 7 | 5.8% |
| 8 | 5.1% |
| 9 | 4.6% |

La clave: en datos reales y no manipulados, el dígito "1" aparece como primer dígito ~30% del tiempo, y los dígitos mayores son progresivamente menos frecuentes.

## Aplicación Forense en Foundation

El CTO ejecuta el test de Benford durante la **Fase A** (trabajo remoto, 48 horas antes de la Cita 2). Se aplica sobre:

1. Montos de facturas de compra y venta
2. Movimientos de inventario (valor monetario)
3. Gastos operativos por categoría
4. Órdenes de compra
5. Nómina (cuando está disponible)

### Test Estadístico

La desviación se mide con el test **chi-cuadrado**:

```python
from scipy import stats
import numpy as np

def benford_test(series):
    """
    Test de Benford sobre una serie de montos.
    Returns: estadístico chi2, p-value, interpretación
    """
    # Extraer primer dígito
    first_digits = series.astype(str).str.lstrip('0').str[0].astype(int)
    observed = first_digits.value_counts(normalize=True).sort_index()

    # Distribución esperada de Benford
    expected = {d: np.log10(1 + 1/d) for d in range(1, 10)}

    # Chi-cuadrado
    obs_vals = [observed.get(d, 0) * len(series) for d in range(1, 10)]
    exp_vals = [expected[d] * len(series) for d in range(1, 10)]

    chi2, p_value = stats.chisquare(obs_vals, f_exp=exp_vals)

    return {
        'chi2': chi2,
        'p_value': p_value,
        'anomalia': p_value < 0.05,
        'interpretacion': 'ANOMALÍA DETECTADA' if p_value < 0.05 else 'Distribución normal'
    }
```

### Umbral de Significancia

| p-value | Interpretación |
|---------|---------------|
| > 0.05 | Distribución normal — sin señales de manipulación |
| 0.01 – 0.05 | Anomalía leve — investigar contexto |
| < 0.01 | **Anomalía significativa** — alta probabilidad de manipulación o fraccionamiento |
| < 0.001 | **Anomalía severa** — hallazgo crítico para el Dictamen |

## Caso Textiles Atoyac — Hallazgo H-04

En el análisis de 47,832 movimientos de inventario de los últimos 18 meses, el test de Benford detectó:

**Distribución observada vs. esperada:**

| Dígito | Esperado | Observado | Desviación |
|--------|----------|-----------|------------|
| 1 | 30.1% | 31.2% | +1.1% (normal) |
| 2 | 17.6% | 16.8% | -0.8% (normal) |
| 3 | 12.5% | **18.9%** | **+6.4% (anómalo)** |
| 4 | 9.7% | **14.2%** | **+4.5% (anómalo)** |
| 5 | 7.9% | 5.1% | -2.8% (leve) |
| 6-9 | 22.2% | 13.8% | -8.4% (subrepresentados) |

**Estadístico: χ² = 47.3, p-value = 0.003 (< 0.05)**

**Interpretación:** La concentración anómala en dígitos 3 y 4 corresponde a movimientos en el rango **$15,000 – $16,999 MXN**. Este rango está sistemáticamente por debajo del umbral de aprobación del Director de Compras ($17,000 MXN). El patrón es consistente con **fraccionamiento intencional** de operaciones para evadir controles de autorización.

**127 movimientos sospechosos** fueron identificados en detalle:
- Monto promedio: $15,821 MXN
- Total acumulado en 18 meses: $2,009,267 MXN
- Costo estimado de pérdida: **$953,700 MXN** (extrapolado a 12 meses)

## Limitaciones del Test de Benford

El CTO debe comunicar las siguientes limitaciones al CEO antes de incluir un hallazgo Benford en el Dictamen:

1. **No es prueba de fraude**: Benford detecta anomalías estadísticas, no identifica responsables ni confirma intencionalidad. Las anomalías pueden tener causas legítimas (redondeo de precios, tarifas fijas, precios de lista).
2. **Requiere n > 1,000**: El test no es confiable con muestras pequeñas.
3. **No aplica a todos los datos**: Datos con rango artificial (ej. salarios dentro de una banda salarial) no deben analizarse con Benford.
4. **Correlación ≠ causalidad**: Un patrón anómalo en dígitos 3-4 no significa que el Director de Compras está cometiendo fraude. Significa que se debe investigar.

## Comunicación del Hallazgo al Cliente

La forma en que el CEO comunica un hallazgo Benford es crítica:

**Formulación correcta:**
> "El análisis estadístico detectó una concentración inusual de movimientos en el rango de $15,000 a $16,999 MXN que estadísticamente no debería existir en la distribución normal de su operación. Esto puede tener múltiples explicaciones: desde un proveedor con precio fijo en ese rango, hasta un patrón de fraccionamiento para evitar autorizaciones. Lo que sí es claro es que este rango requiere una revisión interna."

**Formulación incorrecta (nunca usar):**
> "Encontramos fraude en su departamento de compras."

Evangelista presenta evidencia estadística. Las conclusiones de responsabilidad son del cliente, sus auditores, o las autoridades competentes.
