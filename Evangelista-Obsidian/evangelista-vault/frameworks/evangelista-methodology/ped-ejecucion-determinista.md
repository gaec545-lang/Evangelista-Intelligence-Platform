---
id: "EVK-FWK-011"
title: "Protocolo de Ejecución Determinista (PED) — Zero-Hallucination EIP"
type: framework
version: "1.0"
domain: [tecnologia, inteligencia-artificial, data-engineering]
sector: [interno-evangelista]
agent_access: [financial, process, data_engineer]
confidence: high
source: evangelista
last_validated: 2026-04-03
parent: ""
related: ["alcoa-protocol", "crh-resolucion-hibrida", "mgo-gobernanza-operativa", "monte-carlo-simplified"]
depends_on: ["alcoa-protocol", "crh-resolucion-hibrida", "mgo-gobernanza-operativa"]
tags: [framework, tecnologia, inteligencia-artificial, data-engineering, enterprise]
status: active
last_ingested: null
chunk_count: null
---

# Framework: Protocolo de Ejecución Determinista (PED)

## Tesis del Framework (La Doctrina de la Máquina)

El **Protocolo de Ejecución Determinista (PED)** es el manifiesto técnico y el blindaje operativo de la Evangelista Intelligence Platform (EIP).

Mientras la competencia comercializa "Ingeniería de Prompts" probabilística, Evangelista & Co. comercializa **Determinismo Matemático**. Este framework garantiza que ninguna decisión financiera, logística o estratégica entregada a un cliente sea producto de una alucinación de un Modelo de Lenguaje (LLM). Rige la separación técnica entre el razonamiento (texto) y la ejecución (matemáticas).

> [!CRITICAL] Cero Alucinación Financiera
> Todo número entregado a un cliente es producto de código ejecutado, no de texto generado por un LLM. Esta es la diferencia entre consultoría IA genérica y Evangelista & Co.

## Los Tres Mandatos de Ejecución

### Mandato 1: Cero-Inferencia Matemática (Zero-Hallucination)

* **Regla Inflexible:** Ningún agente LLM (sea el *Financial Agent* o el *Process Agent*) tiene permitido realizar cálculos aritméticos, estadísticos o de probabilidad dentro de su ventana de contexto.
* **Protocolo de Ejecución:** Toda solicitud que requiera cálculo de variables (como ROI, LTV/CAC, o el [[cost-of-inaction]]) activa un *hard-stop* en el orquestador (LangGraph). El agente está obligado a estructurar los parámetros e invocar una Herramienta (*Tool*) aislada en el **Code Execution Sandbox**. El procesador (Python/Pandas) realiza el cálculo; el LLM se limita a leer la salida de la terminal.

> [!RULE] Hard-Stop ante Cálculos
> Si un agente detecta que necesita un cálculo numérico, se detiene inmediatamente y delega al Sandbox. Nunca aproxima, nunca estima, nunca calcula dentro de su contexto de texto.

### Mandato 2: Separación Cerebro-Músculo (Separation of Concerns)

* **Regla Inflexible:** El LLM actúa exclusivamente como el "Director de Orquesta" (Cerebro), nunca como el motor de procesamiento de datos masivos (Músculo).
* **Protocolo de Ejecución:** Está prohibido inyectar archivos CSV masivos o volcados de ERP directamente al contexto del chat de la IA. Para cumplir con el Cuadrante 2 del [[crh-resolucion-hibrida]], el *Data Engineer Agent* debe redactar consultas SQL (Text-to-SQL). El backend ejecuta la consulta en la base de datos del cliente, y el agente recibe únicamente los resultados agregados y filtrados. Esto permite analizar bases de datos de millones de filas sin colapsar el modelo.

> [!RULE] Prohibido Inyectar Datasets Crudos al Contexto del LLM
> Nunca se pasan CSV completos, tablas ERP completas ni volcados raw al contexto del agente. Solo resultados agregados de consultas SQL. El LLM dirige, la base de datos procesa.

### Mandato 3: Trazabilidad de Auditoría Directa

* **Regla Inflexible:** Todo número impreso en un Dictamen Forense debe cumplir con la trazabilidad del [[alcoa-protocol]].
* **Protocolo de Ejecución:** La plataforma EIP debe mantener un registro (Log) de la ejecución exacta de código que generó un resultado. Si el Dictamen indica una proyección basada en [[monte-carlo-simplified]], el Consultor gobernado por el [[mgo-gobernanza-operativa]] debe tener acceso en la interfaz a la semilla aleatoria (*Seed*) y a las iteraciones que generaron ese percentil para demostrar la validez ante la Junta Directiva del cliente. No existen las "cajas negras" en Evangelista & Co.

> [!RULE] Sin Cajas Negras
> Cada resultado numérico en un Dictamen Forense tiene un log de ejecución asociado: código ejecutado, semilla aleatoria, parámetros de entrada y timestamp. El Consultor debe poder mostrar esto ante el cliente si se le solicita.

## Conexión con Otros Documentos

- **[[alcoa-protocol]]**: El PED garantiza la trazabilidad que el ALCOA+ exige. Cada cálculo registrado cumple con los principios de Atribuible, Legible, Contemporáneo, Original y Exacto.
- **[[crh-resolucion-hibrida]]**: El PED es la infraestructura técnica que habilita los Cuadrantes 2, 3 y 4 del ciclo de resolución. Sin determinismo, el Estrés y el Veredicto carecen de validez.
- **[[mgo-gobernanza-operativa]]**: El MGO define quién tiene acceso a los logs de traza. El Arquitecto de Datos los almacena; el Consultor los interpreta; el Socio Director los presenta como evidencia.
- **[[monte-carlo-simplified]]**: Motor estocástico que opera bajo el Mandato 1 (cálculo en Sandbox) y el Mandato 3 (trazabilidad de seed e iteraciones).
