---
id: "EVK-BENCH-003"
title: "Benchmark Sectorial — Retail y Comercio al por Menor en México"
type: benchmark
version: "1.0"
domain: ["retail", "kpi", "commerce"]
sector: ["retail"]
agent_access: [analyst, financial]
confidence: high
source: "ANTAD, INEGI, Evangelista-Internal"
last_validated: 2026-03-30
parent: ""
related: ["playbook-ferreteria", "patron-inventario-fantasma"]
depends_on: []
tags: ["benchmark", "retail", "inventory-turnover", "shrinkage"]
status: active
last_ingested: null
chunk_count: null
---

# Benchmark Sectorial — Retail y Comercio al por Menor en México

## Introducción
El retail mexicano se caracteriza por una alta dependencia del inventario físico y una lucha constante contra la merma (shrinkage) y los quiebres de stock.

## Métricas Clave de Rentabilidad y Eficiencia

| KPI | Promedio PyME MX | Clase Mundial (World Class) | Fuente |
|-----|------------------|-----------------------------|--------|
| **Venta por m² (Anual)** | $12k - $18k MXN | $35k+ MXN | ANTAD |
| **Rotación de Inventario** | 4 - 6 veces/año | 12+ veces/año | INEGI |
| **Ticket Promedio** | $150 - $450 MXN | N/A (Variable) | ANTAD |
| **Shrinkage (Merma/Robo)** | 1.5% - 3.0% | < 0.8% | ANTAD |
| **Quiebre de Stock (Out-of-stock)**| 8% - 12% | < 3% | Interno |

## Análisis de Brechas (Gap Analysis)
- **Rotación de Inventario**: Una PyME que rota su inventario menos de 4 veces al año tiene capital atrapado que genera costos de oportunidad y obsolescencia.
- **Quiebre de Stock**: El 10% de las ventas perdidas en retail son por no tener el producto en el estante cuando el cliente lo busca, a pesar de tenerlo "en el almacén general".

## Tendencias en México
El crecimiento del e-commerce (Omnicanalidad) está forzando a las PyMEs de retail a integrar sus inventarios físicos con sus tiendas en línea en tiempo real para evitar vender productos sin existencia.

## Uso para el Agente Analyst
Utilizar la métrica de **Venta por m²** para identificar sucursales sub-utilizadas. Si el Shrinkage es > 2%, disparar inmediatamente el protocolo de [[patron-inventario-fantasma]].
