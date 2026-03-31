---
id: "EVK-PB-002"
title: "Playbook Sector Alimentos — Inocuidad, Trazabilidad y Merma"
type: playbook
version: "1.0"
domain: [procesos, cumplimiento]
sector: [alimentos, retail]
agent_access: [analyst, process, all]
confidence: high
source: evangelista
last_validated: 2026-03-29
parent: ""
related: ["alcoa-plus", "iso-9001-45001", "dmaic-measure"]
depends_on: []
tags: [alimentos, haccp, trazabilidad, merma, inocuidad]
status: active
last_ingested: null
chunk_count: null
---

# Playbook Sector Alimentos — Inocuidad, Trazabilidad y Merma

## Retos Críticos del Sector Alimentos

En el sector alimentos, el Intelligence Architecture se enfoca en tres pilares:
1. **Inocuidad**: Garantizar que el dato refleje el cumplimiento de normas sanitarias (HACCP).
2. **Trazabilidad**: Capacidad de rastrear un lote desde el campo hasta el consumidor final en < 4 horas.
3. **Control de Merma**: Reducir el desperdicio por caducidad o mal manejo de inventario.

## Protocolo de Análisis Forense (Foundation)

Al auditar una empresa de alimentos, el equipo debe buscar:
- **H-A01: Discrepancias de Lote**: Registros de producción que no coinciden con las salidas de almacén de materia prima.
- **H-A02: Ruptura de Cadena de Frío**: Datos de sensores de temperatura con huecos (gaps) o registros fuera de rango sin acción correctiva.
- **H-A03: First-Expired, First-Out (FEFO)**: ¿El sistema ERP realmente prioriza la salida de productos próximos a caducar?

## Implementación Architecture (Improve)

### Módulo de Trazabilidad Total
Implementamos un sistema de "Genealogía de Lote" en el Data Warehouse:
- **Input**: Registro de recepción de materia prima (con certificado de calidad).
- **Proceso**: Transformación en planta (mezclas, horneado, empaque).
- **Output**: Lote terminado con referencia a todos los insumos utilizados.

> [!CRITICAL] Alerta de Recall
> La arquitectura debe permitir ejecutar un "Fake Recall" (Simulacro de Retiro) en 15 minutos. Si el sistema tarda más, el factor de riesgo β aumenta un 0.3.

## KPIs de Sentinel (Control)

- **Yield de Producción**: Relación entre materia prima entrante y producto terminado neto.
- **Tasa de Merma por Caducidad**: % de producto destruido por vencimiento.
- **Índice de Cumplimiento Sanitario**: % de registros críticos (temperatura, pH, limpieza) completados y válidos.

## Conexión con ALCOA+

En alimentos, la **Contemporaneidad** (C de ALCOA) es vital. Un registro de temperatura llenado al final del turno es inválido y representa un riesgo legal masivo. Sentinel dispara alertas si detecta registros en batch (llenado masivo de datos manuales).
