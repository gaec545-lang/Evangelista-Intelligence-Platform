---
id: "EVK-FWK-010"
title: "Modelo de Gobernanza Operativa (MGO) — Cadena de Mando Evangelista"
type: framework
version: "1.0"
domain: [gobernanza, management, rbac]
sector: [interno-evangelista]
agent_access: [all]
confidence: high
source: evangelista
last_validated: 2026-04-03
parent: ""
related: ["crh-resolucion-hibrida"]
depends_on: ["crh-resolucion-hibrida"]
tags: [framework, gobernanza, management, rbac, enterprise]
status: active
last_ingested: null
chunk_count: null
---

# Framework: Modelo de Gobernanza Operativa (MGO)

## Tesis del Framework (Propósito de Control)

En una firma aumentada por Inteligencia Artificial, el mayor riesgo operativo es la difuminación de responsabilidades: humanos intentando hacer el trabajo de las máquinas (cálculos en Excel) o máquinas tomando decisiones estratégicas sin supervisión.

El **Modelo de Gobernanza Operativa (MGO)** delimita la Cadena de Mando interna de Evangelista & Co., estableciendo fronteras estrictas (Mandatos y Prohibiciones) para la interacción humana con la EIP (Evangelista Intelligence Platform) y con el cliente final. Este framework rige el Control de Acceso Basado en Roles (RBAC) de nuestra infraestructura digital.

> [!RULE] Separación Humano-IA
> Ningún humano debe ejecutar cálculos que la IA puede realizar. Ninguna IA toma decisiones estratégicas sin supervisión humana. El MGO establece las fronteras exactas de esta separación.

## Vértices de Autoridad (Estructura de Roles)

### Vértice 1: La Autoridad Estratégica (Socio Director)

Es el rostro de la autoridad empírica y el decisor final de la firma.

* **Mandato:** Relacionamiento de C-Level, encuadre del problema, *pricing* estratégico y ejecución del "Choque" final (Presentación de resultados).
* **Responsabilidad:** Ejerce el "Poder de Veto" sobre prospectos que no cumplen el perfil ideal y audita el Índice de Confianza Global del enjambre de LangGraph.
* **Prohibición Estricta:** Tiene prohibido configurar bases de datos, extraer registros o redactar los diagnósticos.

> [!RULE] El Director No Toca Datos
> El Socio Director jamás configura conexiones a ERPs, extrae datos del vault ni redacta análisis forenses. Su función es estrictamente estratégica, comercial y de validación final.

### Vértice 2: La Orquestación Táctica (Consultor Analítico / Engagement Manager)

Es el piloto de la EIP y el traductor entre el dolor del negocio y el código del sistema.

* **Mandato:** Estructurar el problema. Ejecutar las Fases 1, 3 y 4 del [[crh-resolucion-hibrida]].
* **Responsabilidad:** Diseñar el Árbol de Problemas (MECE), levantar el formato SCQA, invocar a los agentes (Financial, Process) en la plataforma y validar que la respuesta estocástica tenga sentido lógico de negocios antes de inyectarla al entregable en PDF.
* **Prohibición Estricta:** Cero cálculos manuales. Tiene prohibido usar hojas de cálculo estáticas para calcular márgenes; toda carga matemática pesada debe delegarse al *Code Execution Sandbox* de la IA.

> [!RULE] Cálculos en Sandbox, Nunca Manuales
> El Consultor Analítico tiene prohibido usar Excel, calculadoras u hojas estáticas para cualquier métrica financiera u operativa. Todas las cargas matemáticas se delegan al *Code Execution Sandbox*.

### Vértice 3: El Blindaje Técnico (Arquitecto de Datos / Centinela)

Es el guardián de la seguridad, la latencia y la integridad estructural de las operaciones.

* **Mandato:** Abstracción de datos (Zero-Trust), infraestructura en la nube y disponibilidad del grafo.
* **Responsabilidad:** Recibir, encriptar y gestionar las credenciales de los clientes en Supabase Vault. Asegurar que los puertos de lectura a los ERPs funcionen y mantener el orquestador de LangGraph libre de errores de sintaxis en el backend.
* **Prohibición Estricta:** Cero consultoría de negocio. Tiene prohibido interpretar los datos financieros extraídos o interactuar directamente con la Junta Directiva del cliente para presentar hallazgos.

> [!RULE] El Técnico No Interpreta Datos del Negocio
> El Arquitecto de Datos gestiona la infraestructura pero jamás emite juicios sobre métricas financieras, márgenes u operacionalidad del cliente. Esa interpretación es exclusiva del Consultor Analítico y el Socio Director.

## Integración Digital

Estos vértices no son solo organigramas teóricos. Se reflejan en el código del *Evangelista Dashboard*. Cada Vértice tiene acceso a interfaces específicas:

| Vértice | Interfaces del Dashboard | Acceso a Datos |
|---------|------------------------|----------------|
| **Socio Director** | Deal Flow global, Índice de Confianza Global, Presentaciones de Choque | Lectura de KPIs y métricas de cierre |
| **Consultor Analítico** | Panel de Prompts interactivos, ejecución de agentes, historial de análisis | Lectura de datos del cliente (anonimizados si aplica) |
| **Arquitecto de Datos** | Bóveda de Credenciales (Supabase Vault), monitoreo de infraestructura, logs del orquestador | Credenciales cifradas, métricas de sistema |

## Conexión con Otros Documentos

- **[[crh-resolucion-hibrida]]**: El CRH define *qué* se hace en cada fase del proyecto. El MGO define *quién* tiene autoridad para hacerlo y qué le está prohibido.
