---
id: "EVK-PAT-OPE-003"
title: "Patrón de Hallazgo — Captura Manual y Entropía de Datos"
type: pattern
version: "1.0"
domain: ["data-quality", "risk-management", "operations"]
sector: ["general"]
agent_access: [data_eng, process]
confidence: high
source: evangelista-methodology
last_validated: 2026-03-30
parent: ""
related: ["excel-as-erp", "foundation-architecture"]
depends_on: []
tags: ["manual-entry", "data-corruption", "factor-beta", "puebla"]
status: active
last_ingested: null
chunk_count: null
---

# Patrón de Hallazgo — Captura Manual y Entropía de Datos

## Definición
Ocurre cuando la información crítica para la toma de decisiones no proviene directamente del sistema de origen (ERP/POS), sino de capturistas que re-escriben el dato en hojas secundarias o en el sistema. Representa una alta "vibración" o entropía en la calidad de la información (Factor β).

## Cómo Detectar (Protocolo Data Eng)
1. **Metadatos de Registro de Auditoría**: Buscar en la base de datos registros cuya fecha de creación (System Time) sea superior en más de 8 horas a la fecha reportada del evento (Event Time). Esto indica una carga masiva al final del día.
2. **Factor β**: Un proceso con >40% de registros manuales (fuera de sensores o APIs) tiene un Factor β de entropía inaceptable.

## Cuantificación del Impacto (Protocolo Process)
- **Ineficiencia Administrativa**: En una PyME típica, este patrón consume entre **15 y 30 horas semanales** de personal solo en tareas de "copiar y pegar" o reconciliación de errores de dedo.
- **Riesgo de Decisión**: Tomar decisiones basadas en datos que tienen un 5% de error por captura manual puede invalidar un proyecto de inversión de millones de pesos.

## Causa Raíz más Común
- **Interfaces no Amigables**: El ERP es tan complejo de usar que el operario prefiere anotar en papel y que alguien más lo capture después.
- **Falta de Dispositivos en Piso**: Ausencia de scanners, tablets o IoT para captura directa.

## Solución Architecture / Sentinel
1. **Captura Directa (Zero-Input)**: Eliminar la captura manual mediante integración automática de bitácoras de producción y ventas al Warehouse de Architecture.
2. **Validación de Mascara**: Si no se puede automatizar, forzar máscaras de entrada que rechacen formatos inconsistentes en tiempo real.

## Wikilinks y Referencias
- Ver [[excel-as-erp]] para el análisis de riesgo de hojas de cálculo.
- Ver [[foundation-architecture]] para el protocolo de depuración de datos primarios.
