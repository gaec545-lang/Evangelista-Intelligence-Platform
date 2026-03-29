---
id: "EVK-FWK-007"
title: "COSO ERM — Marco de Gestión de Riesgos Aplicado en Evangelista"
type: framework
version: "1.0"
domain: [riesgos, procesos, finanzas]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [risk, financial, analyst, all]
confidence: high
source: coso
last_validated: 2026-03-28
parent: ""
related: ["evangelista-rules", "factor-gamma-system", "alcoa-protocol"]
depends_on: []
tags: [coso, riesgos, procesos, foundation, architecture]
status: active
last_ingested: null
chunk_count: null
---

# COSO ERM — Marco de Gestión de Riesgos Aplicado en Evangelista

## ¿Qué es COSO ERM?

El Committee of Sponsoring Organizations of the Treadway Commission (COSO) publicó en 2017 su marco actualizado de Enterprise Risk Management (ERM). Es el estándar global de referencia para la gestión integral de riesgos organizacionales.

Evangelista utiliza COSO ERM como fundamento para:
1. El diseño de las Reglas de Gobernanza (G-01 a G-08)
2. La estructura del Vetting Gate
3. La Segregación de Funciones (SoD) en el Motor de Precios
4. La identificación de riesgos en los Dictámenes Forenses de los clientes

## Los 5 Componentes de COSO ERM

| Componente | Descripción | Aplicación en Evangelista |
|------------|-------------|--------------------------|
| **Gobierno y Cultura** | Liderazgo y valores que moldean la gestión de riesgos | Reglas G, protocolo ALCOA+, roles CEO/CTO/CFO |
| **Estrategia y Objetivos** | Alineación de riesgos con la estrategia del negocio | Vetting Gate: proyectos que no cumplen criterios no se inician |
| **Performance** | Identificación, evaluación y respuesta a riesgos | Foundation: identificación de riesgos en operación del cliente |
| **Revisión** | Monitoreo continuo de la gestión de riesgos | Sentinel: monitoreo post-entrega de KPIs |
| **Información y Comunicación** | Datos correctos a las personas correctas | Data Mesh: Fuente Única de Verdad para el cliente |

## Segregación de Funciones (SoD) en Evangelista

La SoD es el principio de COSO que establece que ninguna persona debe tener control completo sobre un proceso de alto impacto. En Evangelista se aplica en 3 puntos críticos:

### SoD 1 — Motor de Precios
- El CEO **usa** el precio que calcula el algoritmo
- El CEO **no puede modificar** el algoritmo ni el precio resultante
- El CFO **audita** que el precio entregado al cliente sea el que calculó el sistema
- **Riesgo mitigado**: El CEO no puede hacer descuentos comerciales no autorizados

### SoD 2 — Vetting Gate
- La decisión Go/No-Go requiere **consenso** CEO + CTO
- Ninguno decide solo (Regla G-03)
- **Riesgo mitigado**: El CEO no puede aprobar proyectos técnicamente inviables por presión comercial

### SoD 3 — Acceso a Datos del Cliente
- El CTO tiene acceso **Read-Only** (Regla G-02)
- El CTO **no puede modificar** datos del cliente
- **Riesgo mitigado**: No hay posibilidad de que Evangelista altere evidencia o cause daño operativo

## Categorías de Riesgo que Foundation Identifica

Al analizar la operación de un cliente, Foundation mapea riesgos usando la taxonomía COSO:

| Categoría | Ejemplos en PyMEs Mexicanas |
|-----------|----------------------------|
| **Riesgo Operativo** | Inventario fantasma, merma no rastreada, costos de producción incorrectos |
| **Riesgo Financiero** | Facturación sin cobrar, cuentas por pagar duplicadas, costos ocultos |
| **Riesgo de Cumplimiento** | Discrepancias contables ante SAT, registros sin trazabilidad fiscal |
| **Riesgo de Reputación** | Anomalías Benford (fraccionamiento), concentración de proveedores |
| **Riesgo Estratégico** | Decisiones sobre datos incorrectos, expansión sin visibilidad real |

## COSO como Argumento Comercial

El CEO puede usar COSO en la conversación con DGs y dueños de empresa:

> "Lo que detectamos en su operación son riesgos que COSO ERM — el estándar global de gestión de riesgos empresariales — clasificaría como riesgos operativos y de cumplimiento de impacto alto. El costo de no gestionarlos no es hipotético: lo medimos en $3.16M MXN anuales."

Esto da contexto académico y de estándar internacional a los hallazgos de Foundation, elevando la percepción del rigor metodológico de Evangelista.
