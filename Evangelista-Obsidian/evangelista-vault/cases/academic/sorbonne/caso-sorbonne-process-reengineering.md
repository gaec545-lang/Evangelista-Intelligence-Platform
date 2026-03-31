---
id: "EVK-CASE-013"
title: "Adaptación Sorbonne — Reingeniería de Procesos DMAIC"
type: case
version: "1.0"
domain: ["lean-manufacturing", "dmaic", "process-reengineering"]
sector: ["manufactura", "textil"]
agent_access: [all]
confidence: high
source: academic-sorbonne
last_validated: 2026-03-30
parent: ""
related: ["dmaic-framework", "lean-manufacturing-vsm"]
depends_on: []
tags: ["sorbonne-adapted", "dmaic", "process-reengineering", "manufactura-mexicana"]
status: active
last_ingested: null
chunk_count: null
---

# Adaptación Sorbonne — Reingeniería de Procesos DMAIC

## Contexto del Caso Original (Sorbonne/INSEAD)

Caso de reingeniería profunda de procesos en la industria manufacturera europea. Utiliza la metodología Six Sigma (DMAIC) para reducir drásticamente los tiempos de ciclo y maximizar la utilización de activos mediante la eliminación de cuellos de botella y la estandarización de tareas críticas. Se enfoca en procesos de alta tecnología.

## Adaptación al Contexto PyME Mexicana

Donde en Europa se pelea por micro-segundos con robótica, en la PyME mexicana se pelea por **minutos de inactividad** por falta de organización básica. La reingeniería en México debe ser "cultural" antes que tecnológica. El personal operativo suele tener baja cultura digital, por lo que el DMAIC de Evangelista se enfoca en la visibilidad simple del dato en piso antes de buscar la automatización completa.

### Escenario Adaptado: Fábrica de Calzado en León, Guanajuato
- **Suelo:** Taller con 45 operadores y procesos manuales.
- **Problema:** El tiempo de entrega (Lead Time) es de 25 días, cuando el mercado exige 15. Hay inventario de "piezas sueltas" acumulado en todo el taller.
- **Fallas detectadas por Evangelista:** La mitad del tiempo de un artesano se gasta buscando las herramientas o esperando el material de la estación anterior.

## Hallazgos con Enfoque Evangelista

### Hallazgo H-01 — El Cuello de Botella "Fugitivo"
**Descripción técnica:**
Mapeo de flujo de valor (VSM) automatizado con Sentinel. Se detectó que el proceso de "montado" era el cuello de botella, pero solo durante las tardes, debido a un problema de iluminación que ralentizaba la precisión manual de los operarios.

**Impacto financiero:**
- Capacidad desperdiciada: **$1,100,000 MXN/año**.
- Causa raíz: Falta de estandarización ergonómica en el puesto de trabajo.

### Hallazgo H-02 — La Burocracia de la Calidad Manual
**Descripción técnica:**
Análisis de tiempos de espera. Se descubrió que el material esperaba detenido en piso un promedio de 4 horas diarias solo aguardando a que el "jefe de turno" firmara el vale de calidad para pasar al siguiente proceso.

**Impacto financiero:**
- Incremento innecesario de inventario WIP: **$340,000 MXN**.
- Causa raíz: Proceso de aprobación analógico y centralizado en una sola persona.

## Solución Basada en Architecture

Implementación del ciclo **DMAIC-Vanguard**:
1. **Define/Measure:** Instalación de tableros de producción visuales alimentados por el Data Warehouse de Architecture. Los operadores ven su propia meta vs. realidad cada hora.
2. **Analyze:** Identificación estadística de la correlación entre ausentismo y caídas de producción en líneas específicas.
3. **Improve/Control:** Digitalización de las firmas de calidad en tablets industriales con el protocolo [[alcoa-protocol]], eliminando el cuello de botella administrativo.

## Lecciones para los Agentes Especialistas

- **Para Process Specialist:** No proponer robots cuando falta orden básico (5S). El mayor ROI está en eliminar esperas administrativas. [[dmaic-framework]].
- **Para Data Engineer:** Diseñar interfaces de captura que un operario con manos sucias o guantes pueda usar fácilmente (captura por voz o QR).
- **Argumento de Venta:** "Su planta tiene una capacidad oculta del 20% que hoy se está perdiendo en esperas, no en falta de máquinas".
