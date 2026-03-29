---
id: "EVK-RULE-001"
title: "Reglas de Gobernanza Evangelista — G-01 a G-08"
type: rule
version: "1.0"
domain: [procesos, riesgos, finanzas]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [all]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: ""
related: ["alcoa-protocol", "factor-gamma-system", "foundation-pricing", "architecture-pricing"]
depends_on: []
tags: [foundation, architecture, riesgos, procesos, vetting-gate]
status: active
last_ingested: null
chunk_count: null
---

# Reglas de Gobernanza Evangelista — G-01 a G-08

## ¿Por qué existen las Reglas de Gobernanza?

Las Reglas G son los controles de gobernanza interna de Evangelista & Co. Fueron diseñadas bajo los principios del marco COSO ERM (Enterprise Risk Management) para proteger tres activos críticos del negocio:

1. **Integridad técnica**: Que los análisis sean objetivos, reproducibles y legalmente defendibles
2. **Modelo de negocio**: Que el sistema de precios y propuestas sea consistente y no se erosione por presión comercial
3. **Reputación**: Que Evangelista nunca sea asociado a irregularidades, conflictos de interés o entrega de trabajo de baja calidad

> [!CRITICAL] Las Reglas G no son sugerencias.
> Son protocolos obligatorios. Cualquier miembro del equipo (CEO, CTO, CFO) que viole una Regla G debe reportarlo internamente. La violación reiterada puede resultar en la disolución del proyecto o del contrato laboral.

---

## G-01 — Pago Primero

> **"Ningún trabajo técnico se inicia sin pago 100% confirmado."**

**Aplicación:**
- En Foundation: el CTO no inicia el análisis de datos hasta que el CFO confirma que el pago de Foundation está acreditado en cuenta bancaria.
- En Architecture: el CTO no inicia el Sprint 1 hasta que el Tramo A está confirmado.
- El CFO es el único autorizado para confirmar la recepción del pago. CEO y CTO no tienen visibilidad de cuentas bancarias del negocio.

**Por qué existe:**
Proyectos iniciados sin pago han resultado históricamente en clientes que solicitan trabajo adicional, luego cuestionan el alcance, y finalmente no pagan alegando "insatisfacción". El pago primero elimina esta dinámica.

---

## G-02 — ReadOnly Absoluto

> **"El CTO opera exclusivamente con permisos de lectura sobre los sistemas del cliente. Nunca escritura. Violación = terminación inmediata."**

**Aplicación:**
- El acceso al ERP del cliente siempre es con credenciales read-only creadas específicamente para Evangelista
- Antes de conectarse, el CTO verifica que el usuario de base de datos solo tiene permisos SELECT
- Scripts de análisis: solo `SELECT`, nunca `UPDATE`, `INSERT`, `DELETE`
- Si por error se descubren credenciales con más permisos, se notifica al cliente y se solicita un usuario restringido

**Por qué existe:**
Si el CTO modifica (aunque sea accidentalmente) datos del cliente, Evangelista es responsable de cualquier distorsión en los resultados del análisis, en los estados financieros, o en los sistemas fiscales del cliente. Esta regla protege a Evangelista de responsabilidad legal y al cliente de riesgos operativos.

---

## G-03 — SoD en el Vetting Gate

> **"La decisión Go/No-Go requiere consenso CEO + CTO. Ninguno decide solo."**

**Aplicación:**
Después del análisis de Foundation (Fase A + Cita 2), el CEO y el CTO se reúnen para evaluar los 4 criterios del Vetting Gate:
- β < 0.7 (datos manejables)
- α ≥ 0.0 (datos suficientes)
- Γ < 3.0 (o activar Protocolo Omega)
- Sponsor con autoridad real (DG o dueño)

Si ambos están de acuerdo en Go → se presenta Architecture en Cita 4.
Si alguno dice No-Go → el proyecto se detiene. No se negocia entre ellos.

**Por qué existe:**
SoD (Segregation of Duties) de COSO: ninguna persona debe tener control completo sobre una decisión de alto impacto. El CEO puede tener presión comercial para aprobar proyectos inviables. El CTO puede ser excesivamente técnico y rechazar proyectos viables. El consenso equilibra ambas perspectivas.

---

## G-04 — NDA Antes de Todo

> **"NDA y Contrato se firman antes de revelar la metodología MEC (Motor de Evaluación y Cotización)."**

**Aplicación:**
- En Cita 1: el CEO puede hablar del servicio en términos generales y del proceso de 4 citas
- El Motor de Precios, los factores α/β/Γ, y la metodología de Foundation **no se revelan** hasta que el NDA está firmado
- El Contrato de Foundation se firma al inicio de Cita 2, antes de intercambiar credenciales de acceso al ERP

**Por qué existe:**
La metodología MEC es el activo intelectual más valioso de Evangelista. Revelarla antes del NDA permite que competidores o el propio cliente la repliquen sin compensar a Evangelista.

---

## G-05 — CQA Firma Antes de Cita 3

> **"Sin el Certificado de Integridad ALCOA+ firmado por el CFO/CQA, el reporte no se presenta al cliente."**

**Aplicación:**
- El CFO/CQA (rol de Chief Quality Assurance) revisa el Dictamen Forense antes de Cita 3
- Verifica que todos los hallazgos cumplan los 9 criterios ALCOA+ ([[alcoa-protocol]])
- Firma el Certificado de Integridad con su nombre completo y fecha
- Sin esa firma, la Cita 3 se pospone — no se improvisa

**Por qué existe:**
El Dictamen Forense es un documento con implicaciones legales (puede usarse en litigios, auditorías SAT, o negociaciones de financiamiento). Si tiene errores, Evangelista es responsable. La firma del CQA es el último control de calidad antes de que el documento salga del equipo.

---

## G-06 — Reporte Dual

> **"La versión del cliente nunca incluye α/β/Γ crudos ni las fórmulas del Motor de Precios."**

**Aplicación:**
Evangelista produce dos versiones de cada documento:
- **Versión Interna**: Incluye todos los factores, fórmulas, y cálculos del Motor de Precios
- **Versión Cliente**: Solo incluye el resultado final (precio, ROI, hallazgos) sin revelar la mecánica interna

**Por qué existe:**
Si el cliente conoce la fórmula exacta, puede:
1. Manipular los datos de Scoping para obtener un precio más bajo
2. Compartir la metodología con competidores o consultores externos
3. Cuestionar cada paso del cálculo en lugar de enfocarse en el valor del servicio

---

## G-07 — Deadline de Entrega Foundation

> **"El Dictamen Forense se entrega en máximo 10 días hábiles post Cita 2. Si hay riesgo de retraso, se notifica antes del día 8."**

**Aplicación:**
- El reloj inicia cuando el cliente entrega acceso al ERP en la Cita 2
- Días 1-2: Análisis remoto (Fase A completada)
- Días 3-5: Draft del Dictamen
- Días 6-8: Revisión CQA y firma ALCOA+
- Días 9-10: Entrega y presentación (Cita 3)

Si en el día 7 el CTO anticipa que necesita más tiempo (datos inesperadamente complejos, Legacy con problemas de acceso), el CEO notifica al cliente con la nueva fecha y justificación.

**Por qué existe:**
Un retraso sin comunicación destruye la confianza. Evangelista cobra un precio premium basado en profesionalismo y certeza. Entregar tarde sin aviso pone en riesgo la percepción del cliente en el momento más crítico del ciclo de ventas (justo antes de la propuesta de Architecture).

---

## G-08 — Cita 4 Solo si Go

> **"Architecture solo se presenta si los 4 criterios del Vetting Gate están en verde: β < 0.7, α ≥ 0.0, Γ < 3.0, Sponsor con autoridad."**

**Aplicación:**
Si alguno de los 4 criterios está en rojo, la Cita 4 no ocurre. El CEO comunica al cliente:

> "Con los datos que analizamos, encontramos que [criterio en rojo] impediría que el proyecto Architecture entregue el ROI que necesita para justificar la inversión. No sería honesto de nuestra parte presentarles una propuesta que sabemos que no funcionará. Lo que sí podemos hacer es [alternativa]."

**Por qué existe:**
Presentar Architecture en proyectos No-Go resulta en clientes que inician el proyecto, encuentran los problemas técnicos durante la implementación, y terminan insatisfechos aunque los problemas eran predecibles. Esto daña la reputación de Evangelista y genera disputas contractuales evitables.
