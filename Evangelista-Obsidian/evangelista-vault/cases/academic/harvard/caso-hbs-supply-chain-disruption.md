---
id: "EVK-CASE-008"
title: "Adaptación HBS — Gestión de Disrupciones en Cadena de Suministro"
type: case
version: "1.0"
domain: ["supply-chain", "risk-management", "forecasting"]
sector: ["manufactura", "distribucion"]
agent_access: [all]
confidence: high
source: academic-hbs
last_validated: 2026-03-30
parent: ""
related: ["foundation-architecture", "supply-chain-resilience"]
depends_on: []
tags: ["hbs-adapted", "supply-chain", "prophet-forecasting", "puebla"]
status: active
last_ingested: null
chunk_count: null
---

# Adaptación HBS — Gestión de Disrupciones en Cadena de Suministro

## Contexto del Caso Original (HBS)

Basado en el caso "Managing Supply Chain Disruptions" de Harvard Business School, el cual analiza cómo las empresas globales gestionan eventos imprevistos (desastres naturales, huelgas, pandemias) para mantener la continuidad operativa. El enfoque original se centra en la redundancia de proveedores y el monitoreo de riesgos geopolíticos.

## Adaptación al Contexto PyME Mexicana

En el ecosistema de Puebla y el centro de México, la disrupción no siempre viene de desastres globales, sino de la alta variabilidad en los *lead times* de proveedores locales (CDMX) y la falta de visibilidad en el tránsito de mercancías. La PyME típica reacciona al desabasto (quiebre de stock) cuando este ya ocurrió, resultando en paros de línea o ventas perdidas.

### Escenario Adaptado: Manufacturera de Autopartes Puebla
- **Suelo:** PyME con 80 empleados dependiendo de 3 proveedores críticos de acero en CDMX.
- **Problema:** Retrasos promedio de 4 días en el 30% de los pedidos de insumos.
- **Fallas detectadas por Evangelista:** El sistema actual solo detecta el quiebre cuando el operador de piso reporta "no hay material".

## Hallazgos con Enfoque Evangelista

### Hallazgo H-01 — El "Efecto Látigo" (Bullwhip Effect)
**Descripción técnica:**
Análisis de la serie de tiempo de pedidos vs. consumo real de producción. Se detectó que las variaciones en los pedidos de la PyME eran un 40% superiores a la demanda real, amplificando la inestabilidad de los proveedores.

**Impacto financiero:**
- Sobrecosto por urgencias: **$350,000 MXN/año**.
- Causa raíz: Compras reactivas sin uso de modelos predictivos.

### Hallazgo H-02 — Invisibilidad de Tránsito
**Descripción técnica:**
Brecha de datos entre la "Orden de Compra Saliente" y la "Recepción en Almacén". No existe un monitoreo del *Lead Time* variable por SKU.

**Impacto financiero:**
- Paros de línea (Costo/Hora): **$600,000 MXN/año**.
- Causa raíz: Falta de integración de avisos de embarque de proveedores en el Sentinel.

## Solución Basada en Architecture

Se implementó un modelo de **Forecasting con Prophet** (librería de código abierto integrada en el Data Warehouse de Architecture).
1. **Detección Temprana:** El sistema analiza patrones históricos de entrega y demanda de producción.
2. **Alerta Preventiva:** Architecture emite una alerta de "Riesgo de Quiebre" 5 días antes de que ocurra físicamente.
3. **Buffer Dinámico:** Ajuste automático del stock de seguridad basado en la desviación estándar del lead time del proveedor.

## Lecciones para los Agentes Especialistas

- **Para Data Engineer:** La calidad del dato de "Fecha de Recepción" es vital para el modelo Prophet. [[foundation-architecture]].
- **Para Risk Analyst:** La resiliencia no es tener más inventario, sino tener mejores datos preventivos.
- **Argumento de Venta:** "No podemos controlar al proveedor, pero podemos controlar nuestra reacción ante su ineficiencia usando datos".
