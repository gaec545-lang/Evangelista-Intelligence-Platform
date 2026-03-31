---
id: "EVK-FWK-007"
title: "Lean Manufacturing — VSM, 5S y Kaizen para Intelligence Architecture"
type: framework
version: "1.0"
domain: [procesos, datos]
sector: [manufactura, textiles, alimentos, logistica]
agent_access: [analyst, process, all]
confidence: high
source: evangelista
last_validated: 2026-03-29
parent: ""
related: ["six-sigma-dmaic", "factor-gamma", "delta-scoping"]
depends_on: []
tags: [lean, vsm, kaizen, 5s, desperdicio, procesos]
status: active
last_ingested: null
chunk_count: null
---

# Lean Manufacturing — VSM, 5S y Kaizen para Intelligence Architecture

## ¿Por qué Lean en Evangelista & Co?

Mientras que Six Sigma se enfoca en reducir la **variabilidad**, Lean se enfoca en eliminar el **desperdicio** (Muda). En el contexto de Intelligence Architecture, el desperdicio no solo es material físico, sino también **datos redundantes**, **esperas en procesos de aprobación** y **sobre-procesamiento de reportes**.

## Value Stream Mapping (VSM) Digital

El VSM es nuestra herramienta principal para visualizar el flujo de valor. En Evangelista, añadimos una capa de "Flujo de Información":

1. **Flujo de Materiales**: Cómo se mueve el producto (ej. rollo de tela) por la planta.
2. **Flujo de Información**: Cómo se mueve el dato (ej. orden de producción) por los sistemas.

> [!TIP] Desconexión VSM
> El hallazgo más común de Evangelista es que el material se mueve más rápido que la información, o viceversa, creando "islas de datos" desincronizadas.

## Los 8 Desperdicios Técnicos (Muda)

Adaptados a la era del dato:
- **Transporte**: Mover archivos de un servidor a otro innecesariamente.
- **Inventario**: Datos acumulados en tablas "Legacy" que nadie usa.
- **Movimiento**: Clics excesivos en un ERP mal diseñado.
- **Esperas**: Tiempo que un gerente espera a que el contador le envíe el reporte de cierre.
- **Sobre-producción**: Reportes de 80 páginas que nadie lee.
- **Sobre-procesamiento**: Limpiar los mismos datos manualmente en Excel cada mes.
- **Defectos**: Errores de entrada de datos que requieren re-trabajo.
- **Talento no utilizado**: Analistas perdiendo el tiempo copiando y pegando en lugar de analizar.

## Kaizen: Mejora Continua

Kaizen significa "cambio para mejor". En Architecture, implementamos Kaizen mediante:
- **Automatización incremental**: Pequeños scripts que ahorran 10 minutos al día.
- **Dashboards de visibilidad**: Democratizar el acceso al dato para que los operadores puedan tomar decisiones.

## Conexión con Factor Gamma

Un factor Γ alto (muchas plantas/sistemas) suele indicar una oportunidad masiva para Lean, ya que la comunicación entre nodos es donde más desperdicio se genera. Lean resuelve la eficiencia del nodo, mientras que Architecture resuelve la integridad de la red.
