---
id: "EVK-FWK-001"
title: "Protocolo ALCOA+ — Sello de Calidad Forense de Foundation"
type: framework
version: "1.0"
domain: [datos, riesgos, procesos]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [all]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: ""
related: ["dmaic-measure", "caso-textiles-atoyac", "evangelista-rules"]
depends_on: []
tags: [foundation, alcoa, calidad, alcoa-certificate, datos, riesgos]
status: active
last_ingested: null
chunk_count: null
---

# Protocolo ALCOA+ — Sello de Calidad Forense de Foundation

## ¿Qué es ALCOA+?

ALCOA es el acrónimo que define los cinco atributos mínimos de integridad para cualquier dato o registro en un proceso forense:

| Letra | Atributo | Significado operativo |
|-------|----------|-----------------------|
| A | **Attributable** | Se sabe exactamente quién generó el dato y cuándo |
| L | **Legible** | El dato es legible, claro e interpretable sin ambigüedad |
| C | **Contemporaneous** | El dato se registró en el momento en que ocurrió el evento |
| O | **Original** | El dato es la fuente primaria, no una copia o transcripción |
| A | **Accurate** | El dato refleja la realidad con precisión verificable |

El "+" extiende el estándar con cuatro atributos adicionales para entornos digitales complejos:

| Atributo | Significado operativo |
|----------|-----------------------|
| **Complete** | El registro incluye toda la información relevante, sin omisiones |
| **Consistent** | Los datos son coherentes entre fuentes y a lo largo del tiempo |
| **Enduring** | El dato persiste de forma duradera; no puede borrarse sin dejar rastro |
| **Available** | El dato es accesible cuando se necesita para auditoría o validación |

En Evangelista & Co., los 9 criterios ALCOA+ son el estándar mínimo e irrenunciable para cualquier hallazgo que ingrese al Dictamen Forense.

## Aplicación en el Proceso Foundation

### Fase A — Trabajo Remoto (48h previas a Cita 2)

Durante la fase de análisis remoto, el CTO ejecuta todos los scripts sobre los datos del cliente en un **sandbox aislado con permisos Read-Only**. Cada acción queda registrada en la **Bitácora Forense** con:

1. Timestamp exacto (UTC-6, Ciudad de México)
2. Nombre del script ejecutado
3. Hash MD5 del dataset en ese momento
4. Resultado obtenido (sin edición posterior)

> [!RULE] Lo que no se registra en el momento, no existe.
> Si el CTO descubre un hallazgo pero no lo registra en el instante, ese hallazgo es inválido para el Dictamen. No hay excepciones.

### Snapshot MD5 del Día Cero

Al iniciar cualquier proyecto, el CTO genera un snapshot MD5 del dataset completo antes de cualquier análisis:

```bash
md5sum dataset_cliente_YYYYMMDD.csv > hash_dia_cero.txt
git add hash_dia_cero.txt
git commit -m "DAY-ZERO: snapshot MD5 dataset [cliente] [fecha]"
```

Este hash es **evidencia ALCOA+** de que los datos no fueron modificados durante el análisis. Sin este hash, cualquier defensor legal del cliente podría argumentar que los datos fueron alterados post-extracción.

### Herramientas técnicas que garantizan ALCOA+

| Herramienta | Criterio ALCOA+ que protege |
|-------------|----------------------------|
| Scripts Python en modo Read-Only | Original, Accurate |
| Sandbox aislado (máquina virtual sin acceso a internet) | Consistent, Enduring |
| Bitácora Forense con timestamps automáticos | Contemporaneous, Attributable |
| Git con commits firmados | Enduring, Available |
| Hash MD5/SHA256 del dataset | Original, Accurate |

## Certificado de Integridad ALCOA+

Antes de presentar el Dictamen Forense al cliente (Cita 3), el CFO/CQA debe firmar el **Certificado de Integridad ALCOA+**, que declara:

> *"Los hallazgos contenidos en este Dictamen Forense cumplen los 9 criterios del estándar ALCOA+ (Attributable, Legible, Contemporaneous, Original, Accurate, Complete, Consistent, Enduring, Available). Cada hallazgo fue registrado en tiempo real, con datos de fuente original, en un entorno de solo lectura con hash verificable."*

> [!CRITICAL] Regla G-05
> Sin el Certificado ALCOA+ firmado por el CFO/CQA, el reporte **NO se presenta** al cliente. No hay excepciones. Presentar un reporte sin certificación compromete la credibilidad legal de Evangelista & Co.

## ¿Por qué ALCOA+ es el diferenciador de Foundation?

En el mercado de consultoría para PyMEs mexicanas, la mayoría de los análisis son:
- Basados en percepciones del dueño, no en datos
- Sin trazabilidad de quién tocó qué dato
- Sin registro de cuándo se descubrió cada problema
- Sin evidencia de que los datos no fueron modificados

ALCOA+ convierte el Dictamen Forense en un documento **legalmente defendible** y **auditable por terceros** (SAT, auditores externos, socios inversionistas). Esto es lo que justifica el precio premium de Foundation vs. un análisis financiero convencional.

## Conexión con otras metodologías

- **[[dmaic-measure]]**: La fase Measure del DMAIC depende de datos ALCOA+ para que la línea base sea confiable.
- **[[evangelista-rules]]**: La regla G-02 (ReadOnly Absoluto) es la implementación técnica del criterio "Original" de ALCOA+.
- **[[caso-textiles-atoyac]]**: Los 4 hallazgos del caso Atoyac están certificados bajo ALCOA+, lo que permitió que el cliente DG Varela los aceptara sin objeción técnica.
- **[[benford-law]]**: El test de Benford es una herramienta ALCOA+ para verificar la integridad estadística de los datos antes de incluirlos en el Dictamen.
