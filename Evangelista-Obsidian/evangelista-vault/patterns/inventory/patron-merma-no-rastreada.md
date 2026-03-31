---
id: "EVK-PAT-INV-004"
title: "Patrón de Hallazgo — Merma No Rastreada"
type: pattern
version: "1.0"
domain: ["inventory", "production", "efficiency"]
sector: ["manufactura", "alimentos", "textil"]
agent_access: [data_eng, process, financial]
confidence: high
source: evangelista-methodology
last_validated: 2026-03-30
parent: ""
related: ["lean-manufacturing-vsm", "caso-metalmecanica-torres"]
depends_on: []
tags: ["yield-loss", "merma-oculta", "bom-variance", "puebla"]
status: active
last_ingested: null
chunk_count: null
---

# Patrón de Hallazgo — Merma No Rastreada

## Definición
Es la diferencia entre la cantidad de materia prima que teóricamente debería consumirse para producir una cantidad X (basado en la BOM o Receta) y la cantidad que realmente sale del almacén hacia producción. A menudo se "normaliza" como desperdicio pero no se cuantifica.

## Cómo Detectar (Protocolo Data Eng)
1. **Comparativa Teórica vs Real**: `(Producción Terminada × Insumo Teórico por Unidad) vs (Salida Total de Almacén de dicho Insumo)`.
2. **Análisis de Varianza**: Si la brecha es > 3%, existe una merma no rastreada.
3. **Indicador Clave**: Yield Rate (Rendimiento).

## Cuantificación del Impacto (Protocolo Financial)
- **Fórmula**: `Σ (Insumo Real Consumido - Insumo Teórico Requerido) × Costo Unitario Insumo`.
- **Rango PyME**: Típico en manufactura mexicana es perder entre **3% y 8%** de los ingresos brutos en merma no detectada.
- **Caso Referencia**: [[caso-metalmecanica-torres]], donde se perdían $3.2M MXN en retazos de acero no optimizados.

## Causa Raíz más Común
- **BOM (Bill of Materials) Desactualizada**: La receta en el sistema dice que se usan 10g pero en planta se usan 12g por desgaste de maquinaria.
- **No-Registro de Scrap**: Los operarios tiran el material defectuoso al bote de basura sin reportarlo como merma en el sistema.

## Solución Architecture / Sentinel
1. **Ajuste de BOM en Tiempo Real**: Sentinel sugiere ajustes automáticos a la BOM teórica basados en el promedio móvil del consumo real.
2. **Estación de Pesaje Digital**: Integración de básculas IoT al final de la línea que reportan automáticamente el desperdicio al Sentinel.

## Wikilinks y Referencias
- Ver [[dmaic-framework]] (fase Analyze).
- Caso de referencia: [[caso-metalmecanica-torres]].
