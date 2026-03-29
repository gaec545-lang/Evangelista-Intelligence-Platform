---
id: "EVK-OBJ-002"
title: "Objeción de Garantía — Manejo de '¿Y si No Funciona?'"
type: objection
version: "1.0"
domain: [riesgos]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [analyst, financial]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: ""
related: ["success-fee-calc", "evangelista-rules", "alcoa-protocol"]
depends_on: []
tags: [objecion, argumento-venta, success-fee, riesgos]
status: active
last_ingested: null
chunk_count: null
---

# Objeción de Garantía — Manejo de "¿Y si No Funciona?"

## Variantes de la Objeción de Garantía

| Variante | Contexto típico |
|----------|----------------|
| "¿Qué garantía me dan de que funcionará?" | Desconfianza en el resultado prometido |
| "¿Qué pasa si no llegan al ahorro prometido?" | Preocupación por el ROI |
| "Hemos contratado consultores antes y no funcionó" | Experiencia negativa previa |
| "¿Cómo sé que los números del diagnóstico son reales?" | Cuestionamiento de la metodología |

## Respuestas por Variante

### Variante 1: "¿Qué garantía me dan de que funcionará?"

> "Nuestra garantía es estructural: el Success Fee. El 15% del ahorro que cobramos solo se activa si el ahorro se genera y se mide. Si el sistema no produce resultados, ese componente es cero. Es la única forma de consultoría donde el proveedor pone en riesgo una parte de su ingreso si no entrega."

**Seguimiento:**
> "Además, el Dictamen Forense que firmaron en la Cita 3 documentó exactamente qué problemas existen, con datos del propio ERP de ustedes. No estamos prometiendo algo que no hemos visto — estamos ejecutando la solución a problemas que ya cuantificamos juntos."

### Variante 2: "¿Qué pasa si no llegan al ahorro prometido?"

> "El ahorro se mide a los 90 días con datos del sistema de ustedes, no con nuestros estimados. Si la mejora es menor a la proyectada, el Success Fee se calcula sobre lo que realmente se mejoró — no sobre el estimado. El sistema no tiene cómo 'inflar' los números porque lee directamente del ERP de ustedes."

### Variante 3: "Hemos contratado consultores antes y no funcionó"

**Primero, explorar (no defender):**
> "¿Qué fue lo que no funcionó en esas experiencias? ¿El diagnóstico era incorrecto, o el proyecto se quedó a medias, o los resultados no fueron medibles?"

**Según la respuesta, adaptar:**

- Si el diagnóstico era incorrecto: "Nuestro Dictamen usa protocolo ALCOA+ — cada hallazgo está respaldado por datos de su propio ERP con hash verificable. No es una opinión, es evidencia."
- Si el proyecto se quedó a medias: "Nuestra estructura de pagos (70% al firmar, 30% al entregar) crea el incentivo correcto: nosotros solo cobramos el 30% final cuando ustedes reciben el sistema funcionando."
- Si los resultados no fueron medibles: "Por eso el Success Fee existe. Los KPIs se congelan en el Día Cero y se miden a los 90 días con los datos de su ERP. No hay ambigüedad sobre si funcionó o no."

### Variante 4: "¿Cómo sé que los números del diagnóstico son reales?"

> "Los números vienen de su propio ERP. Nosotros solo los analizamos — no los creamos. El protocolo ALCOA+ garantiza que cada cifra del Dictamen tiene una fuente verificable: el query SQL que la generó, el dataset con su hash MD5, y el timestamp de cuándo se extrajo. Cualquier auditor externo puede reproducir exactamente el mismo resultado con los mismos datos."

**Si el cliente quiere verificar:**
> "Podemos mostrarles el query que generó el hallazgo y ejecutarlo juntos sobre sus datos en este momento, si quieren validarlo."

## El Argumento Estructural de la Garantía

La respuesta más poderosa a cualquier objeción de garantía es explicar la alineación de incentivos:

> "La forma en que estructuramos el negocio hace que nuestros intereses estén perfectamente alineados con los suyos. Si no funciona, nosotros no cobramos el Success Fee. Si funciona muy bien, ustedes ganan más ahorro del proyectado y nosotros cobramos más. No hay conflicto de interés posible."

Esta es la diferencia entre Evangelista y un consultor de fee fijo que cobra igual independientemente del resultado.
