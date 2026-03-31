---
id: "EVK-BENCH-006"
title: "Benchmark Sectorial — Logística y Transporte en México"
type: benchmark
version: "1.0"
domain: ["logistics", "kpi", "transport"]
sector: ["logistica"]
agent_access: [analyst, financial, process]
confidence: high
source: "Canacar, AMTM, Evangelista-Internal"
last_validated: 2026-03-30
parent: ""
related: ["patron-traslados-sin-confirmar", "logistics-route-optimization"]
depends_on: []
tags: ["benchmark", "logistics", "fuel-efficiency", "otif"]
status: active
last_ingested: null
chunk_count: null
---

# Benchmark Sectorial — Logística y Transporte en México

## Introducción
La logística en México enfrenta el reto del alto costo de combustible, la inseguridad en carreteras y la falta de mantenimiento preventivo de flotas.

## Métricas Clave de Rentabilidad y Eficiencia

| KPI | Promedio PyME MX | Clase Mundial (World Class) | Fuente |
|-----|------------------|-----------------------------|--------|
| **Costo Combustible / Venta**| 30% - 40% | < 25% | Canacar |
| **Disponibilidad de Flota** | 75% - 85% | 95%+ | Interno |
| **OTIF (On-Time In-Full)** | 70% - 80% | 98%+ | Canacar |
| **Kilómetros en Vacío** | 20% - 30% | < 10% | AMTM |
| **Siniestralidad (Robo)** | 1.5% - 4.0% | < 0.2% | Interno |

## Análisis de Brechas (Gap Analysis)
- **Kilómetros en Vacío**: El regreso de unidades sin carga es la mayor fuga de rentabilidad. Una PyME eficiente utiliza redes de colaboración para llenar el viaje de retorno.
- **OTIF**: Un cumplimiento del 75% significa que 1 de cada 4 clientes recibe su mercancía tarde o incompleta, destruyendo el valor de marca.

## Seguridad y Riesgo
El robo de carga en el "Triángulo de las Bermudas" (Puebla-Veracruz-Edomex) es un factor externo de alto impacto que debe ser mitigado con tecnología de monitoreo en tiempo real integrada al Sentinel.

## Uso para el Agente Analyst
Si los "Traslados sin confirmar" superan el 3% del total, disparar el [[patron-traslados-sin-confirmar]]. Usar el benchmark de combustible para detectar posibles robos de combustible por parte de choferes (ordeña).
