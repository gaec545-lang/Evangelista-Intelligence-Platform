---
id: "EVK-FWK-002"
title: "DMAIC Fase Define — Definición de Problemas en PyMEs Mexicanas"
type: framework
version: "1.0"
domain: [procesos, datos]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [process, analyst, pm, all]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: "_moc-dmaic"
related: ["dmaic-measure", "dmaic-analyze", "alcoa-protocol", "caso-textiles-atoyac"]
depends_on: []
tags: [six-sigma, dmaic, procesos, foundation, architecture]
status: active
last_ingested: null
chunk_count: null
---

# DMAIC Fase Define — Definición de Problemas en PyMEs Mexicanas

## ¿Qué es la Fase Define?

La Fase Define es el primer paso del ciclo DMAIC (Define, Measure, Analyze, Improve, Control) de Six Sigma. Su objetivo es establecer con precisión matemática y operativa **cuál es el problema**, quién lo sufre, cuánto cuesta y cuál es el objetivo de mejora.

En el contexto de Evangelista & Co., la Fase Define se aplica principalmente durante **Architecture Fase 1 (Sprint 1-2)** para formalizar el proceso AS-IS y convertir los hallazgos del Dictamen Forense en un proyecto de mejora estructurado.

## La Regla de Definición de Problemas

> [!RULE] Un problema que no se puede medir no existe.
> La Fase Define exige que todo problema esté expresado en términos cuantitativos, no narrativos.

**Ejemplos de definiciones inválidas vs. válidas:**

| Definición INVÁLIDA (narrativa) | Definición VÁLIDA (medible) |
|--------------------------------|-----------------------------|
| "Perdemos dinero en inventarios" | "El inventario SAP tiene 3 días de retraso vs. el físico, causando compras basadas en datos obsoletos con un costo estimado de $762,000 MXN/año en sobre-stock" |
| "El proceso de facturación es lento" | "El ciclo de facturación toma 8 días cuando el estándar del sector es 2 días, generando un riesgo de flujo de caja de $1.2M MXN por mes" |
| "Hay problemas con los proveedores" | "El 23% de las órdenes de compra se retrasan más de 5 días, causando paros de línea con un costo de $45,000 MXN por evento" |

## Herramienta Principal: SIPOC Adaptado

El SIPOC (Suppliers, Inputs, Process, Outputs, Customers) es la herramienta estándar de la Fase Define. En Evangelista se adapta a la realidad de las PyMEs mexicanas:

```
SIPOC Evangelista:
┌─────────────┬──────────────┬─────────────────┬──────────────┬──────────────┐
│  Suppliers  │    Inputs    │    Process      │   Outputs    │  Customers   │
│ (Fuentes)   │  (Datos/Mat) │ (Nodo Crítico)  │  (Salidas)   │ (Usuarios)   │
├─────────────┼──────────────┼─────────────────┼──────────────┼──────────────┤
│ SAP         │ Órdenes de   │ Traslado inter- │ Inventario   │ Compras      │
│ Legacy ERP  │ traslado     │ planta (3 días) │ reportado    │ Contabilidad │
│ Almacenistas│ Rollos/lotes │ Recepción física│ Balance DW   │ Dirección    │
└─────────────┴──────────────┴─────────────────┴──────────────┴──────────────┘
```

### Cómo llenar el SIPOC con el cliente

1. **Suppliers**: ¿De dónde viene la información/material que entra al proceso? (sistemas, personas, proveedores externos)
2. **Inputs**: ¿Qué datos o materiales específicos entran? (documentos, registros, materias primas)
3. **Process**: El nodo crítico identificado en Foundation. Máximo 5-7 pasos.
4. **Outputs**: ¿Qué debería producir el proceso correctamente? (reportes, inventario, facturas)
5. **Customers**: ¿Quién depende del output? (áreas internas, sistemas downstream, dirección)

## Conexión con Foundation

Cuando el cliente llega a Architecture (Cita 4), el Dictamen Forense ya trajo el problema definido. La Fase Define en Architecture **no re-descubre** el problema — lo formaliza en un lenguaje de proyecto:

- El hallazgo H-01 del Dictamen → Problem Statement del proyecto
- El costo anual cuantificado → Business Case
- El nodo crítico identificado → Scope del proyecto
- Las métricas del Dictamen → Baseline para el success fee

> [!NOTE] Eficiencia metodológica
> Esta conexión Foundation→Architecture es lo que permite a Evangelista iniciar Architecture en Sprint 1 con claridad total sobre el problema, sin necesidad de un Discovery adicional que cobraría otras consultoras.

## Project Charter de Evangelista

Al final de la Fase Define, el CEO produce el **Project Charter** del proyecto Architecture con estos elementos:

| Campo | Contenido |
|-------|-----------|
| Problem Statement | Problema medible con impacto financiero cuantificado |
| Business Case | ROI proyectado, punto de equilibrio, success fee esperado |
| Goal Statement | Métrica objetivo al final del proyecto (ej. "reducir días de retraso de 3 a 0") |
| Scope | Sistemas, plantas, procesos incluidos y excluidos explícitamente |
| Timeline | Semanas de implementación según Factor Γ |
| Team | CEO (Sponsor/Comercial), CTO (Técnico), CFO (Finanzas/QA) |
| Constraints | Restricciones técnicas identificadas en Foundation |

## Errores comunes que invalidan la Fase Define

1. **Scope creep desde el inicio**: El cliente quiere incluir "todo el sistema" — el CEO debe delimitar el nodo crítico con firmeza.
2. **Problema narrativo sin métrica**: Si no hay una cifra en el Problem Statement, la Fase Define está incompleta.
3. **Múltiples nodos críticos simultáneos**: Máximo 1 nodo crítico por proyecto Architecture. Si el cliente tiene 3 problemas, son 3 proyectos.
4. **Goal Statement ambiguo**: "Mejorar el inventario" no es un goal. "Reducir la discrepancia SAP vs. físico de 3 días a 0 días en 90 días" sí lo es.

## Referencia de casos

- **[[caso-textiles-atoyac]]**: Problem Statement = "847 órdenes de traslado sin confirmación de recepción representan $4.8M MXN en inventario fantasma con costo anual de $1.4M MXN". Este fue el nodo crítico de inventarios para el proyecto Architecture de Textiles Atoyac.
