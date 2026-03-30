---
id: caso-supply-chain-disruption
title: "Caso Académico: Supply Chain Disruption en Manufactura"
type: case_study
agent_access: [process, financial, risk, data_engineer]
tags: [supply-chain, disrupcion, resiliencia, inventario, caso-harvard]
sector: [manufactura, logistica]
dominios: [procesos, riesgos, datos]
version: "1.0"
author: evangelista
---

# Caso Académico: Resiliencia en Cadena de Suministro — Lecciones para PyME Mexicana

*Adaptación didáctica de conceptos de Supply Chain Management para contexto de manufactura regional*

## Contexto

Una empresa manufacturera de componentes textiles (similar a muchos clientes de Evangelista en Puebla/Tlaxcala) opera con:
- 2 plantas de producción
- 35 proveedores activos (de los cuales 3 representan el 70% de los insumos críticos)
- Sistema ERP con módulo de compras desconectado del módulo de producción
- Tiempo de reposición promedio de materias primas: 18-45 días

En 2020, la empresa enfrentó una disrupción triple: restricciones de importación + alza de tipo de cambio + quiebra de su proveedor principal de hilaza (40% del volumen).

## Análisis de Fallas Sistémicas

### Falla 1: Concentración de Proveedores sin Monitoreo
El índice de concentración HHI (Herfindahl-Hirschman) de su base de proveedores era de **4,200** (mercado altamente concentrado, donde 10,000 = monopolio). Una empresa bien gestionada mantiene HHI < 2,500 para insumos críticos.

**Señales de alerta que existían pero no se monitoreaban:**
- El proveedor principal tenía 90+ días en cuentas por pagar con sus propios proveedores
- Sus tiempos de entrega habían aumentado de 12 a 28 días en los 6 meses previos
- No había second source calificado para la hilaza del calibre específico requerido

### Falla 2: Inventario de Seguridad Calculado Incorrectamente
La empresa tenía "2 semanas de stock de seguridad" pero este número era arbitrario, no basado en:
- Variabilidad real de la demanda (desviación estándar de ventas)
- Variabilidad del lead time del proveedor
- Costo del stockout vs. costo de mantener inventario

**Fórmula correcta de inventario de seguridad:**
```
SS = Z × σ_LT × D_avg + Z × LT_avg × σ_D
```
Donde:
- Z = factor de nivel de servicio (Z=1.65 para 95%)
- σ_LT = desviación estándar del lead time
- D_avg = demanda promedio diaria
- σ_D = desviación estándar de la demanda diaria
- LT_avg = lead time promedio

Con los datos reales de la empresa, el stock de seguridad correcto era de **5.2 semanas**, no 2.

### Falla 3: Ausencia de Plan de Contingencia Documentado
Cuando ocurrió la disrupción, el equipo dedicó los primeros **8 días** a debatir qué hacer en lugar de ejecutar un plan. No existía un playbook de contingencia para falla de proveedor crítico.

## Cuantificación del Impacto

| Concepto | Monto |
|---|---|
| Paro de producción (22 días × $180K/día) | $3.96M MXN |
| Compras de emergencia (sobreprecio 35%) | $840K MXN |
| Penalizaciones a clientes por retrasos | $620K MXN |
| Costo de calificación acelerada de nuevo proveedor | $280K MXN |
| **Total pérdida por disrupción** | **$5.7M MXN** |

**Costo de haber implementado un sistema de monitoreo de proveedores:** ~$180K MXN (Foundation + módulo de alertas).

**ROI preventivo: 31.7x**

## Lecciones y Aplicación en Architecture

### Indicadores de Riesgo de Proveedor (Evangelista recomendation)
1. **Days Payable Outstanding del proveedor** (si es público o se puede inferir)
2. **Tendencia de lead time** — ¿está aumentando sistemáticamente?
3. **Número de incidencias de calidad** en los últimos 6 meses
4. **Índice de dependencia:** % de compras concentradas en ese proveedor

### Modelo Dimensional para Supply Chain Resilience
```
Fact_Desempeño_Proveedor
├── dim_proveedor (nombre, país, categoría, criticidad)
├── dim_material
├── dim_tiempo
└── métricas: lead_time_real, lead_time_prometido, varianza_lead_time,
            incidencias_calidad, monto_compras, dias_pago
```

Este modelo permite construir un **Scorecard de Proveedores** que alerta antes de que ocurra una disrupción.

## Aplicación al Vetting Gate

Una empresa con alta concentración de proveedores (HHI > 3,000) sin plan de contingencia suma **+0.2 al factor β**. Si adicionalmente tiene deuda con ese proveedor, suma +0.1 adicional.

Esto es relevante para evaluar si el cliente tiene capacidad operativa para ejecutar un Architecture sin riesgos de disrupción durante el proyecto.
