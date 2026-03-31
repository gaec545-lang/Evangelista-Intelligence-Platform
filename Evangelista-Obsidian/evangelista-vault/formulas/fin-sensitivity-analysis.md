---
id: "EVK-FORM-003"
title: "Análisis de Sensibilidad Financiera para ROI de Architecture"
type: formula
version: "1.0"
domain: [finanzas]
sector: [all]
agent_access: [financial, all]
confidence: high
source: evangelista
last_validated: 2026-03-29
parent: ""
related: ["roi-npv-irr", "success-fee-calc", "factor-gamma"]
depends_on: []
tags: [finanzas, sensibilidad, roi, arquitectura, economia]
status: active
last_ingested: null
chunk_count: null
---

# Análisis de Sensibilidad Financiera para ROI de Architecture

## El Concepto de Sensibilidad

El **Análisis de Sensibilidad** permite al agente Financiero responder qué pasa si nuestras asunciones de ahorro o inversión cambian. Es vital para presentar un ROI conservador al cliente y mitigar el escepticismo.

## La Fórmula de Sensibilidad de Ahorro

Deseamos calcular cuánto debe ahorrarse como *mínimo* para que el proyecto de Architecture tenga un ROI de cero (Punto de Equilibrio).

```
Ahorro de Equilibrio (BEP) = (Inversión Architecture + OpEx Anual Sentinel) / (1 - Success Fee %)
```

### Ejemplo:
- **Inversión**: $225,000 MXN (Architecture)
- **OpEx Sentinel**: $360,000 MXN ($30,000/mes)
- **Success Fee**: 15%
- **BEP** = ($225k + $360k) / 0.85 = **$688,235 MXN** de ahorro anual necesario.

## Escenarios (Monte-Carlo Simplificado)

Presentamos siempre tres escenarios al cliente:

1. **Pessimistic (30% de ahorro base)**: Si solo logramos capturar el 30% del hallazgo analizado en Foundation.
2. **Target (60% de ahorro base)**: Meta de diseño de Architecture.
3. **Optimistic (90% de ahorro base)**: Captura total de la ineficiencia.

> [!RULE] Guardrail de Realismo
> Si el escenario Optimistic da un ROI > 1000%, el FinancialAgent debe revisar los datos de entrada (fórmulas α y β) para evitar promesas excesivas (Over-promise).

## Sensibilidad al Factor Γ (Gamma)

Si el cliente decide añadir una sucursal o un ERP a mitad del proyecto, el ROI se desplaza según el incremento en el Setup Fee:

```
Δ ROI = (Ahorro / (Base Setup Fee × (1 + ΔΓ))) - 1
```

Donde ΔΓ es el incremento en el Factor de Complejidad Gamma.
