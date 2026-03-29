---
id: "EVK-FOR-003"
title: "Cálculo del Success Fee — Protocolo de Liquidación Post-Entrega"
type: formula
version: "1.0"
domain: [finanzas]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [financial, analyst]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: ""
related: ["architecture-pricing", "foundation-pricing", "dmaic-measure", "caso-textiles-atoyac", "evangelista-rules"]
depends_on: ["dmaic-measure"]
tags: [pricing, success-fee, finanzas, architecture]
status: active
last_ingested: null
chunk_count: null
---

# Cálculo del Success Fee — Protocolo de Liquidación Post-Entrega

## Fórmula del Success Fee

```
Success Fee = (Métrica Base − Métrica Actual) × Valor Monetario Unitario × 15%
```

El Success Fee es el componente variable de la propuesta Architecture. Representa el 15% del ahorro **real y medido** que el sistema genera para el cliente en los 90 días post-entrega.

## Componentes de la Fórmula

| Componente | Definición | Origen |
|------------|------------|--------|
| **Métrica Base** | Valor del KPI en el Día Cero (antes del proyecto) | Firmado por el cliente en el Contrato Maestro |
| **Métrica Actual** | Valor del KPI medido por Sentinel a los 90 días post-entrega | Dashboard de Sentinel (auditable) |
| **Valor Monetario Unitario** | Costo monetario de una unidad de la métrica | Calculado por CEO, validado por CFO |
| **15%** | Porcentaje de Evangelista sobre el ahorro generado | Fijo, no negociable |

## Protocolo de Liquidación en 4 Pasos

### Paso 1 — Snapshot del Día Cero
Al inicio de Architecture, el CTO congela las métricas base:
- Se extraen los KPIs del sistema del cliente
- Se registran en la Bitácora Forense con timestamp y hash MD5
- **El cliente firma los valores en el Contrato Maestro**
- Sin firma, los valores son los del Dictamen Forense (que el cliente ya validó en Cita 3)

### Paso 2 — Ventana de Medición (90 días)
- Comienza exactamente cuando el cliente firma el **Delivery Handshake** (documento de entrega formal)
- Durante 90 días, Sentinel corre automáticamente sin intervención de Evangelista
- Los datos son tomados directamente del ERP del cliente (Read-Only)
- El cliente tiene acceso al dashboard de Sentinel en tiempo real

> [!CRITICAL] Regla del Delivery Handshake
> Sin firma del cliente en el Delivery Handshake, el cronómetro de 90 días **no inicia**. Si el cliente se niega a firmar o posterga indefinidamente, se aplica el cobro estimado máximo a los 90 días naturales post-entrega técnica.
>
> Esto protege a Evangelista de clientes que intenten retrasar la medición esperando que los números mejoren por otras razones.

### Paso 3 — Cálculo Forense
Al día 90, el CEO y CTO realizan el cálculo forense:

```python
# Ejemplo cálculo Success Fee Textiles Atoyac

metrica_base_dias_transito = 32.5  # días promedio de inventario en tránsito sin confirmar
metrica_actual_dias_transito = 1.2  # días a los 90 días post-entrega

valor_monetario_dia = 1_443_600 / 365  # $3,954 MXN por día de inventario en tránsito

ahorro_diario = (metrica_base_dias_transito - metrica_actual_dias_transito) * valor_monetario_dia
ahorro_90_dias = ahorro_diario * 90

success_fee = ahorro_90_dias * 0.15
# success_fee ≈ $526,550 MXN
```

### Paso 4 — Cláusula de Libros Abiertos
Para que el cálculo sea auditable, el contrato incluye la **Cláusula de Libros Abiertos**:

> *"El cliente otorga a Evangelista & Co. acceso de solo lectura a los registros del ERP y/o cuentas bancarias relevantes para la medición del Success Fee durante los 90 días de la ventana de medición."*

**Si el cliente no otorga acceso:**
- Se aplica el cobro estimado máximo (calculado con las métricas del Día Cero y el ahorro potencial del Dictamen)
- Evangelista no tiene obligación de renegociar ni probar mejora
- Esta cláusula se explica en la Cita 4 como protección mutua: "Si el sistema no funciona, usted lo prueba con datos. Si funciona, usted paga el 15% del ahorro real. Sin datos, asumimos que funcionó al 100%."

## Ejemplo Completo — Textiles Atoyac

| KPI | Día Cero | Día 90 | Mejora | Valor/unidad | Ahorro base |
|-----|----------|--------|--------|--------------|-------------|
| Órdenes en tránsito sin confirmar | 847 | 12 | 835 | $5,700 MXN c/u | $4,759,500 |
| Duplicados de lote activos | 127 | 3 | 124 | $6,145 MXN c/u | $762,000 |

```
Ahorro total medido (extrapolado a 12 meses) = $3,159,300 MXN
Ahorro base 90 días = $3,159,300 / 4 = $789,825 MXN (trimestral)
Success Fee = $789,825 × 0.15 / 0.75 ≈ $526,550 MXN

(El ajuste /0.75 normaliza de 90 días al año completo según cláusula de contrato)
```

**Propuesta Financiera Final Textiles Atoyac:**
- Setup Fee: $486,000 MXN
- Success Fee: $526,550 MXN
- Total Architecture: $1,012,550 MXN + IVA 16% = **$1,174,558 MXN**
- Ahorro proyectado: $3,159,300 MXN/año
- ROI: 213% a 12 meses

## Presentación al Cliente del Success Fee

El CEO nunca presenta el Success Fee como "te cobro si funciona". Lo presenta como:

> "Además del Setup Fee, tenemos un componente de éxito: el 15% del ahorro que el sistema genere, medido en los primeros 90 días. Si el sistema no funciona, ese 15% es cero. Es nuestra forma de poner los intereses de Evangelista completamente alineados con los suyos."

Esta formulación convierte el Success Fee de un riesgo para el cliente en una garantía de alineación de incentivos.
