---
id: "EVK-FWK-006"
title: "DMAIC Fase Control — Monitoreo Sentinel y Estabilidad de Procesos"
type: framework
version: "1.0"
domain: [procesos, finanzas, datos]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [analyst, process, financial, all]
confidence: high
source: evangelista
last_validated: 2026-03-29
parent: "_moc-dmaic"
related: ["dmaic-improve", "sentinel-monitoring", "capacidad-proceso", "success-fee-calc"]
depends_on: ["dmaic-improve"]
tags: [six-sigma, dmaic, sentinel, monitoreo, dashboards]
status: active
last_ingested: null
chunk_count: null
---

# DMAIC Fase Control — Monitoreo Sentinel y Estabilidad de Procesos

## ¿Qué es la Fase Control?

La Fase Control es el último paso del DMAIC. Su objetivo es garantizar que las mejoras implementadas en la Fase [[dmaic-improve]] se mantengan en el tiempo. Sin control, los procesos tienden a regresar a su estado anterior de entropía. En Evangelista, esta fase constituye el servicio **Sentinel**.

> [!RULE] Lo que no se mide, no se controla. Lo que no se controla, se degrada.
> Sentinel actúa como un sistema de alerta temprana. Si un proceso mejorado empieza a desviarse de sus límites de control, se dispara una alerta antes de que el impacto financiero sea significativo.

## Herramientas de Control en Sentinel

### 1. Gráficos de Control Estocástico
Monitoreamos variables críticas (KPIs) en tiempo real. 
- **Límite Superior de Control (LSC)**: El punto máximo de ineficiencia tolerable.
- **Media**: El debería-ser (Should-Be state).
- **Límite Inferior de Control (LIC)**: El estado óptimo.

Si un punto sale de los límites (especialmente del LSC), el equipo de Sentinel interviene.

### 2. Dashboards de Auditoría de Datos
Sentinel no solo mide el KPI operativo, sino la **salud del dato** (ALCOA+):
- ¿Siguen llegando datos a tiempo? (Timeliness)
- ¿Los datos son íntegros? (Integrity)
- ¿Hay fallos en los pipes de ETL?

### 3. Protocolos de Reacción (OCAP)
El *Out-of-Control Action Plan* define qué hacer cuando algo falla:
1. **Nivel 1**: Alerta automática al responsable del proceso en la planta.
2. **Nivel 2**: Notificación al CEO/CFO del cliente indicando pérdida financiera diaria.
3. **Nivel 3**: Intervención técnica de Evangelista para ajustar el modelo o recalibrar.

## El Rol de la Estabilidad Financiera

En esta fase se valida el ahorro acumulado para el pago del [[success-fee-calc]]. No basta con una mejora puntual; la mejora debe ser **estable** durante el periodo de monitoreo (normalmente 6-12 meses).

## Entregables de la Fase Control

1. **Dashboard Sentinel Activo**: Conexión directa a los datos productivos.
2. **Reporte Mensual de Desempeño**: Comparativa Sized vs Real.
3. **Plan de Continuidad**: Documentación para que el cliente mantenga la estabilidad si decide cancelar Sentinel (aunque el riesgo de entropía aumenta).
4. **Validación de Ahorro**: Documento final que certifica el ROI logrado.

## Transición a un nuevo ciclo

La Fase Control a menudo revela nuevas oportunidades de mejora superficiales o adyacentes, lo que puede iniciar un nuevo ciclo DMAIC (Define) para otra área de la empresa, manteniendo el crecimiento continuo del Intelligence Architecture.
