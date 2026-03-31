---
id: "EVK-FWK-005"
title: "DMAIC Fase Improve — Implementación de Soluciones en Architecture"
type: framework
version: "1.0"
domain: [procesos, finanzas, datos]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [analyst, process, financial, data_engineer, all]
confidence: high
source: evangelista
last_validated: 2026-03-29
parent: "_moc-dmaic"
related: ["dmaic-analyze", "architecture-foundation", "delta-scoping", "success-fee-calc"]
depends_on: ["dmaic-analyze"]
tags: [six-sigma, dmaic, architecture, implementacion, roi]
status: active
last_ingested: null
chunk_count: null
---

# DMAIC Fase Improve — Implementación de Soluciones en Architecture

## ¿Qué es la Fase Improve?

La Fase Improve es el cuarto paso del DMAIC. Su objetivo es diseñar, probar e implementar soluciones que ataquen directamente las **causas raíz** identificadas en la fase [[dmaic-analyze]]. En el modelo de Evangelista & Co., esta fase coincide con la ejecución del servicio **Architecture**.

> [!RULE] Innovación basada en datos, no en corazonadas.
> No implementamos software por "modernizar". Implementamos soluciones técnicas (Data Warehouse, automatización, protocolos) que tienen un impacto directo en el ROI calculado en Analyze.

## El Proceso de Mejora (Improve) en Architecture

En esta fase, el equipo de Evangelista sigue tres pasos críticos:

### 1. Diseño de la Solución (Delta Scoping)
Se utiliza el [[delta-scoping]] para definir qué se va a construir. La solución debe resolver la causa raíz #5 (sistémica).
- **Ejemplo**: Si la causa raíz es "procesos manuales sin confirmación", la solución es un "Módulo Automático de Conciliación de Traslados" en el Data Warehouse.

### 2. Prueba Piloto (Sandbox)
Antes de desplegar a toda la empresa, se prueba la solución en un entorno controlado o con un subconjunto de datos (ej. una sola planta o una sola categoría de producto).
- Se mide el KPI de nuevo para verificar que la mejora es real.
- **Métrica**: Reducción de la variabilidad y acercamiento al "Should-Be State".

### 3. Despliegue Completo (Full Scale)
Implementación en producción. Aquí es donde entra el rol del **Data Engineer** para asegurar que los pipelines de datos sean robustos y escalables.

## Matriz de Priorización de Mejoras

No todas las mejoras se pueden hacer a la vez. Usamos la Matriz Impacto-Esfuerzo:

| Mejora | Impacto ($MXN) | Esfuerzo (Días/Hombre) | Prioridad |
|--------|----------------|------------------------|-----------|
| Automatizar Conciliación | $1.4M / año | 15 días | **Alta (Quick Win)** |
| Re-entrenar personal | $0.2M / año | 20 días | Baja |
| Nueva infra de red | $0.5M / año | 60 días | Estratégica |

## Cálculo del Beneficio Proyectado

En la Fase Improve, refinamos el cálculo del ROI para la firma del contrato de Architecture:

```
Beneficio Neto = (Ahorro Anual Proyectado × Confianza) - Inversión Architecture
```

Donde:
- **Ahorro Anual**: Derivado de Analyze.
- **Confianza**: Factor de riesgo de implementación (normalmente 0.8 a 0.9).
- **Inversión**: Fee de Architecture ($180,000 MXN × Factor Γ).

## El Rol del Success Fee

La Fase Improve define la métrica base para el [[success-fee-calc]]. Se establece un "Snapshot Zero" antes de la implementación. Cualquier mejora sostenida por encima de esta base durante los primeros 6 meses genera un Success Fee para Evangelista & Co.

> [!IMPORTANT] Alineación de Incentivos
> El Success Fee asegura que Evangelista no solo entregue código, sino resultados financieros reales. Si la solución en Improve no ahorra dinero, Evangelista no cobra el bono.

## Entregables de la Fase Improve

1. **Protocolos Operativos Nuevos**: Documentación de cómo debe operar el proceso ahora.
2. **Data Warehouse / ETLs**: La infraestructura técnica que automatiza la solución.
3. **Dashboard de Mejora**: Visualización en tiempo real del KPI mejorando (input para la Fase Control).
4. **Plan de Capacitación**: Guía para que el personal del cliente adopte la nueva tecnología.

## Conexión con Control

Una vez que la mejora está estabilizada y el KPI muestra resultados positivos (ej. reducción del inventario en tránsito en un 80%), la responsabilidad pasa a la Fase [[dmaic-control]] y al servicio **Sentinel**.
