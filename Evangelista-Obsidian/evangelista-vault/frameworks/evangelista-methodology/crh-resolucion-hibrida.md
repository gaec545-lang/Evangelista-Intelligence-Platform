---
id: "EVK-FWK-009"
title: "Ciclo de Resolución Híbrida (CRH) — Framework Operativo EIP"
type: framework
version: "1.0"
domain: [metodologia, operaciones, inteligencia-artificial]
sector: [interno-evangelista]
agent_access: [financial, process, data_engineer]
confidence: high
source: evangelista
last_validated: 2026-04-03
parent: ""
related: ["alcoa-protocol", "monte-carlo-simplified", "argumento-costo-de-inaccion"]
depends_on: ["alcoa-protocol", "monte-carlo-simplified"]
tags: [framework, metodologia, operaciones, inteligencia-artificial, enterprise]
status: active
last_ingested: null
chunk_count: null
---

# Framework: Ciclo de Resolución Híbrida (CRH)

## Tesis del Framework (Propósito Operativo)

El **Ciclo de Resolución Híbrida (CRH)** es el pipeline metodológico inflexible de Evangelista & Co. Dicta el flujo de trabajo desde que un cliente firma un contrato (ej. *The Foundation*) hasta la entrega del dictamen forense final. Es una evolución del método de resolución de problemas de firmas Tier 1 (McKinsey, BCG), diseñado específicamente para operar en tándem con la Evangelista Intelligence Platform (EIP).

El objetivo es eliminar la ambigüedad en el diagnóstico, sustituyendo las "mejores prácticas" genéricas por determinismo matemático y validación estocástica.

## Los Cuatro Cuadrantes de Resolución

### Cuadrante 1: Encuadre (Cognición Humana)

* **Objetivo:** Extraer la sintomatología real del negocio, aislando la percepción subjetiva del cliente.
* **Herramientas:** Entrevista Directiva y Framework SCQA (Situación, Complicación, Pregunta, Respuesta).
* **Protocolo de Ejecución:** El Consultor nunca acepta datos pre-masticados en Excel. Se documenta el SCQA y se construye un **Árbol de Hipótesis (MECE)** (Mutuamente Excluyentes, Colectivamente Exhaustivos). Este árbol define las ramas exactas del negocio (ej. logística, *pricing*, inventario) que el enjambre de agentes auditará.

### Cuadrante 2: Ingesta (Abstracción Zero-Trust)

* **Objetivo:** Secuestrar la verdad operativa conectando la EIP directamente a la fuente inmutable de datos del cliente.
* **Herramientas:** Data Abstraction Vault y esquemas de cifrado en la plataforma.
* **Protocolo de Ejecución:** El Arquitecto de Datos exige acceso *Read-Only* al ERP (SAP, Aspel, Contpaqi) o Base de Datos. Una vez inyectadas las credenciales, el *Data Engineer Agent* realiza un escaneo de entropía. Si la data incumple los estándares mínimos de integridad del [[alcoa-protocol]], el proyecto se detiene o se re-cotiza por limpieza forense.

> [!CRITICAL] Stop Condition del Cuadrante 2
> Si la data del cliente no cumple los estándares del [[alcoa-protocol]], el proyecto se detiene inmediatamente. No se avanza al Cuadrante 3 con data corrupta.

### Cuadrante 3: Estrés (Fuerza Bruta Estocástica)

* **Objetivo:** Destruir las suposiciones de negocio mediante simulación matemática masiva.
* **Herramientas:** LangGraph Agent Swarm & Code Execution Sandbox.
* **Protocolo de Ejecución:** El Consultor inyecta las variables de riesgo al Sandbox. El *Financial Agent* aísla métricas como el Margen de Contribución por Unidad y el motor proyectado en [[monte-carlo-simplified]] ejecuta miles de simulaciones para predecir escenarios de quiebra, ruptura de stock o sobrecostos logísticos.

> [!RULE] Cálculos en Sandbox, Nunca en Excel
> Todo cálculo matemático pesado se delega al *Code Execution Sandbox* de la IA. El Consultor tiene prohibido usar hojas de cálculo estáticas para métricas del Cuadrante 3.

### Cuadrante 4: Veredicto (Síntesis y Choque)

* **Objetivo:** Entregar una declaración de impacto inmutable y justificar la transición hacia los niveles operativos superiores (*Architecture* o *Sentinel*).
* **Herramientas:** Motor de inyección de PDF (PyMuPDF) y Presentación Ejecutiva.
* **Protocolo de Ejecución:** El *Synthesizer Agent* redacta el hallazgo y estampa los datos matemáticos en la plantilla corporativa oficial. El Socio Director toma el documento, ejecuta la presentación de choque y expone el [[cost-of-inaction]] real del cliente.

## Conexión con Otros Documentos

- **[[alcoa-protocol]]**: Define los estándares de integridad de datos que validan el paso del Cuadrante 2 al Cuadrante 3.
- **[[monte-carlo-simplified]]**: Motor estocástico ejecutado durante el Cuadrante 3 para simulación de escenarios de riesgo.
- **[[argumento-costo-de-inaccion]]**: Marco de venta utilizado en el Cuadrante 4 para presentar el impacto financiero de no actuar sobre los hallazgos del dictamen.
