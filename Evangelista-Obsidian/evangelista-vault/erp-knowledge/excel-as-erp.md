---
id: "EVK-ERP-006"
title: "Excel como ERP — Patrones de Ingestión en PyMEs"
type: technical-guide
version: "1.0"
domain: ["excel", "data-engineering", "data-quality"]
sector: ["general"]
agent_access: [data_eng, process]
confidence: high
source: evangelista-it
last_validated: 2026-03-30
parent: ""
related: ["patterns/operational/patron-captura-manual"]
depends_on: []
tags: ["excel", "python", "pandas", "openpyxl", "red-flags"]
status: active
last_ingested: null
chunk_count: null
---

# Excel como ERP — Patrones de Ingestión en PyMEs

## Introducción
A pesar de tener SAP o CONTPAQi, el 90% de las PyMEs mexicanas terminan usando "Excel como ERP de facto" para procesos críticos: producción, control de deudas o incluso inventarios paralelos.

## El Reto del Dato no Estructurado

El principal problema de Excel no es el software, sino la libertad del usuario para corromper la estructura.
### 5 Red Flags de un Excel no Confiable:
1. **Celdas Fusionadas**: Rompen cualquier lógica de parseo automático.
2. **Múltiples Formatos de Fecha**: Ej. "30/03/26" conviviendo con "Mar 30, 2026".
3. **Cálculos manuales vs fórmulas**: Cifras que parecen el resultado de una suma pero son solo texto escrito.
4. **Fórmulas Circulares**: El archivo arroja valores diferentes cada vez que se abre.
5. **Comentarios como Datos**: Información crítica (ej. "Descuento autorizado por el dueño") guardada en un comentario de celda y no en una columna.

## Estrategia de Ingestión Evangelista

Cuando el `data_eng` encuentra un Excel crítico, debe seguir este flujo en Python:
1. **Validación de Schema**: Usar `openpyxl` para verificar que las columnas necesarias existan y no estén vacías.
2. **Carga a Pandas**: `df = pd.read_excel(file, skip_rows=X)` para saltar encabezados decorativos.
3. **Limpieza de Tipos**: Forzar conversión de fechas y números, detectando errores de captura.
4. **Validación de Integridad**: El total del Excel debe coincidir con el total del ERP (si existe cruce).

## Factor β (Entropía)
En el dictamen forense de Evangelista, un proceso basado en Excel tiene un Factor β alto (>0.7), lo que indica que el riesgo de error humano es inaceptable.

## Solución Architecture
El objetivo de Evangelista es **matar el Excel**.
- **Acción**: Automatizar la captura de datos desde el origen (sensores o POS) directamente al Data Warehouse, eliminando la necesidad de la hoja de cálculo intermedia.

## Resumen para Agentes
No confíes en el Excel de "Cuentas por Cobrar" de la secretaria. Siempre crúzalo contra los depósitos bancarios reales. El Excel aguanta todo, la cuenta de banco no.
