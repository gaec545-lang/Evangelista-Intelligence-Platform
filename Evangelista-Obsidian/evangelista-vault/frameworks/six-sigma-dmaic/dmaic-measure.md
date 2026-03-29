---
id: "EVK-FWK-003"
title: "DMAIC Fase Measure — Establecimiento de Línea Base con Datos Reales"
type: framework
version: "1.0"
domain: [datos, procesos, finanzas]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [data_eng, analyst, process, all]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: "_moc-dmaic"
related: ["dmaic-define", "dmaic-analyze", "benford-law", "alcoa-protocol", "success-fee-calc"]
depends_on: ["dmaic-define"]
tags: [six-sigma, dmaic, datos, procesos, success-fee]
status: active
last_ingested: null
chunk_count: null
---

# DMAIC Fase Measure — Establecimiento de Línea Base con Datos Reales

## ¿Qué es la Fase Measure?

La Fase Measure es el segundo paso del DMAIC. Su objetivo es cuantificar el estado actual del proceso con datos verificables, no con percepciones o estimados del equipo del cliente. El output de la Fase Measure es la **línea base (baseline)** que servirá como punto de referencia para medir el éxito del proyecto.

> [!RULE] Medir con datos, no con percepciones.
> "Creemos que perdemos el 20% en merma" no es una medición. "Los registros de producción de los últimos 18 meses muestran una discrepancia promedio de 18.3% entre insumos ingresados y producto terminado registrado" sí lo es.

## Rol del CTO en la Fase Measure

El CTO ejecuta un proceso estructurado de Data Profiling sobre los sistemas del cliente:

### Paso 1 — Extracción de datos (Read-Only)
El CTO extrae los datos directamente del ERP o sistema fuente sin modificar ningún registro. La extracción se hace en un entorno sandbox aislado conforme al protocolo [[alcoa-protocol]].

```sql
-- Ejemplo: extracción de movimientos de inventario SAP
SELECT
    DocDate, ItemCode, ItemName, Warehouse,
    Quantity, TransType, DocNum
FROM OINM  -- tabla de movimientos de inventario SAP B1
WHERE DocDate >= DATEADD(MONTH, -18, GETDATE())
ORDER BY DocDate
```

### Paso 2 — Data Profiling
El CTO ejecuta 4 pruebas estándar sobre los datos extraídos:

| Prueba | Qué detecta | Herramienta |
|--------|-------------|-------------|
| **Test de Benford** | Anomalías en distribución de primeros dígitos (fraude/fraccionamiento) | Python scipy.stats |
| **Integridad Referencial** | Registros huérfanos, claves foráneas rotas | SQL queries |
| **Detección de Duplicados** | Registros idénticos o cuasi-idénticos | Fuzzy matching |
| **Control Estadístico de Procesos** | Variabilidad, outliers, tendencias | SPC charts |

### Paso 3 — Establecimiento de KPIs de línea base

La regla de Evangelista establece que se miden **máximo 5 KPIs por proyecto**. Más KPIs generan ruido y dificultan el cálculo del Success Fee.

Los KPIs se seleccionan junto con el cliente durante el Sprint 1 de Architecture, y deben ser:
1. Medibles con los datos disponibles en el ERP
2. Directamente conectados al nodo crítico identificado en Foundation
3. Con un valor monetario asignable (para el cálculo del Success Fee)
4. Computables automáticamente por Sentinel (para el monitoreo post-entrega)

**Ejemplo de KPIs para nodo crítico = Inventarios:**
- Días de inventario en tránsito sin confirmación
- Porcentaje de discrepancia SAP vs. conteo físico
- Costo de merma mensual (registrado vs. calculado)
- Número de duplicados de lote activos
- Tiempo de sincronización Legacy→ERP (horas)

## El Snapshot del Día Cero

Al final de la Fase Measure, el CTO congela los KPIs en su estado actual. Este snapshot es el **Día Cero** del proyecto:

1. Los valores de KPI se registran en la Bitácora Forense con timestamp
2. El cliente **firma** los valores en el Contrato Maestro de Architecture
3. El hash MD5 del dataset en ese momento se archiva como evidencia ALCOA+
4. Estos valores son los que se usarán para calcular el [[success-fee-calc]] al final del proyecto

> [!CRITICAL] Sin firma del cliente en el Día Cero, no hay Success Fee contractualmente exigible.
> La firma del Día Cero es la protección legal de Evangelista. Si el cliente luego alega que "el problema ya existía así" o que "los números no son correctos", la firma invalida esa objeción.

## Output entregable de la Fase Measure

El entregable formal de la Fase Measure es el **Baseline Report**, un documento interno (no se entrega al cliente) que contiene:

- Tabla de KPIs con valores actuales
- Gráficas SPC por KPI
- Resultados del Data Profiling (Benford, duplicados, integridad)
- Hash MD5 del dataset
- Firma del CTO y fecha
- Copia del extracto de datos con trazabilidad completa

## Errores comunes en la Fase Measure

1. **Medir sin datos disponibles**: Si el cliente no tiene ERP o los datos están en Excel dispersos, el Factor β (entropía) será > 0.7 y el proyecto puede ser inviable.
2. **Usar percepciones como baseline**: El dueño dice "perdemos 20%" — esto no es un baseline. Hay que medirlo con los datos reales.
3. **Más de 5 KPIs**: Demasiados KPIs generan ambigüedad sobre qué mejorar y complican el cálculo del Success Fee.
4. **Baseline sin firma del cliente**: Sin firma, el cálculo del Success Fee puede ser disputado.

## Conexión con la Fase Analyze

Los datos del Baseline Report son el input de la [[dmaic-analyze]]. La pregunta que la Fase Analyze debe responder es: "¿Por qué estos KPIs están en sus valores actuales?" — y la respuesta solo puede ser rigurosa si los valores son reales y auditables.
