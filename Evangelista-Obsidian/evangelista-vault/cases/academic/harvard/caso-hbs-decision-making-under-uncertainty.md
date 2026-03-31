---
id: "EVK-CASE-012"
title: "Adaptación HBS — Toma de Decisiones Bajo Incertidumbre"
type: case
version: "1.0"
domain: ["decision-making", "risk-management", "simulations"]
sector: ["retail", "manufactura"]
agent_access: [all]
confidence: high
source: academic-hbs
last_validated: 2026-03-30
parent: ""
related: ["monte-carlo-simulation-protocol", "sentinel-uncertainty-reduction"]
depends_on: []
tags: ["hbs-adapted", "monte-carlo", "incertidumbre", "capital-investment"]
status: active
last_ingested: null
chunk_count: null
---

# Adaptación HBS — Toma de Decisiones Bajo Incertidumbre

## Contexto del Caso Original (Harvard Business School)

El caso original presenta el dilema corporativo de la inversión en grandes proyectos bajo condiciones de alta incertidumbre. Utiliza herramientas como el análisis de sensibilidad y simulaciones de **Monte Carlo** para evaluar la probabilidad de éxito de una inversión basándose en variables externas fuera de control (inflación, demanda, competencia).

## Adaptación al Contexto PyME Mexicana

El DG de una PyME mexicana a menudo decide "por las tripas". Se enfrenta a la decisión de abrir una nueva sucursal o comprar una máquina de $5M MXN basándose en proyecciones lineales que no consideran el riesgo. La incertidumbre aquí no es macroeconómica, sino de **calidad de los datos internos**. Si el estado financiero actual no es confiable, proyectar el futuro es construir sobre arena.

### Escenario Adaptado: Cadena de Panaderías con 10 Puntos de Venta
- **Suelo:** El dueño quiere abrir 3 sucursales más. Inversión requerida: $4.5M MXN.
- **Problema:** Las sucursales actuales muestran utilidades inconsistentes. Unas ganan y otras pierden sin razón clara (aparentemente).
- **Fallas detectadas por Evangelista:** La variabilidad en el costo de los insumos (harina/huevo) fluctúa un 20% mensual, invalidando los puntos de equilibrio estáticos.

## Hallazgos con Enfoque Evangelista

### Hallazgo H-01 — La Tiranía del Promedio
**Descripción técnica:**
Análisis de sensibilidad sobre el punto de equilibrio. El modelo de "precio fijo / costo promedio" del cliente tiene un 65% de probabilidad de generar pérdida neta si el precio de la harina sube un 10%, lo cual ocurre cíclicamente.

**Impacto financiero:**
- Riesgo de quiebra de nueva inversión: **$4,500,000 MXN** (Pérdida total del capital).
- Causa raíz: Falta de un modelo financiero dinámico (Stress-Testing).

### Hallazgo H-02 — Incertidumbre por Corrupción de Datos
**Descripción técnica:**
Auditoría de integridad de datos transaccionales. El 15% de los tickets de venta no tienen registrado el método de pago, imposibilitando la conciliación de comisiones bancarias y flujo real de efectivo.

**Impacto financiero:**
- Error en flujo de caja proyectado: **$320,000 MXN/mes**.
- Causa raíz: Falta de validación de campos obligatorios en el POS.

## Solución Basada en Architecture

Implementación del módulo **Sentinel Predictive Decisions**:
1. **Simulación Monte Carlo PyME:** Corremos 1,000 escenarios de rentabilidad para la nueva inversión variando el costo de insumos y la demanda proyectada.
2. **Cálculo de Supervivencia:** Determinamos cuántos meses de "caja" necesita la nueva sucursal en el peor escenario posible (Stress Case).
3. **Reducción de Incertidumbre de Datos:** Implementación de protocolos de captura obligatoria que reducen la "vibración" de los datos primarios de Foundation.

## Lecciones para los Agentes Especialistas

- **Para Financial Specialist:** No entregar proyecciones simples a los DGs. Siempre presentar un rango de probabilidad basado en Monte Carlo.
- **Para Risk Analyst:** Identificar las "variables clave" (insumos, energía) que pueden matar el proyecto. [[monte-carlo-simulation-protocol]].
- **Argumento de Venta:** "No podemos ver el futuro, pero podemos simularlo 1,000 veces para que usted no se equivoque en la vida real".
