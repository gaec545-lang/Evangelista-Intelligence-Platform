---
id: "EVK-PB-003"
title: "Playbook Sector Servicios — Eficiencia de Capital Humano y Facturación"
type: playbook
version: "1.0"
domain: [finanzas, procesos]
sector: [servicios]
agent_access: [analyst, financial, all]
confidence: high
source: evangelista
last_validated: 2026-03-29
parent: ""
related: ["business-modeling", "roi-npv-irr", "success-fee-calc"]
depends_on: []
tags: [servicios, horas-hombre, facturacion, rentabilidad, consultoria]
status: active
last_ingested: null
chunk_count: null
---

# Playbook Sector Servicios — Eficiencia de Capital Humano y Facturación

## El Activo es el Tiempo

A diferencia de manufactura, en servicios el "material" es el tiempo del talento. La ineficiencia se mide en **Leakage de Facturación** (horas trabajadas no cobradas) y **Utilización de Staff**.

## Protocolo de Análisis Forense (Foundation)

Buscamos las siguientes anomalías:
- **H-S01: Horas Fantasma**: Diferencia entre las horas registradas en el Time-Tracker y las horas facturadas al cliente.
- **H-S02: Proyectos "Zombie"**: Proyectos que consumen recursos pero no han generado facturación en > 30 días.
- **H-S03: Variabilidad de Margen**: Diferencia de rentabilidad entre consultores o equipos realizando la misma tarea.

## Modelado en Architecture

Desarrollamos un modelo de **Unit Economics por Proyecto**:
- **Costo**: Salario cargado (incluyendo prestaciones) por hora × Horas totales.
- **Ingreso**: Fee del proyecto + gastos reembolsables.
- **Margen Contributivo**: Ingreso - Costo.

> [!TIP] Optimización de Recursos
> La arquitectura debe permitir predecir la saturación de equipos con 4 semanas de antelación para evitar contrataciones de emergencia o tiempos muertos (bench).

## KPIs de Sentinel

- **Ratio de Utilización**: (Horas Facturables / Horas Disponibles) × 100.
- **DSO (Days Sales Outstanding)**: Tiempo promedio de cobro a clientes.
- **Pipeline Velocity**: Qué tan rápido se mueven los prospectos de "Propuesta" a "Contrato Firmado".

## Estrategia de Success Fee en Servicios

El Success Fee suele amarrarse a la **Reducción de Gastos Operativos (OpEx)** mediante la automatización de procesos administrativos (facturación, reporteo) o al **Incremento de Margen Neto** por mejor asignación de recursos.
