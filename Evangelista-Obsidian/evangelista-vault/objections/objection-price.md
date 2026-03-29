---
id: "EVK-OBJ-001"
title: "Objeción de Precio — Manejo de 'Es Muy Caro'"
type: objection
version: "1.0"
domain: [finanzas]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [analyst, financial]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: ""
related: ["roi-npv-irr", "cost-of-inaction", "architecture-pricing", "success-fee-calc"]
depends_on: []
tags: [objecion, argumento-venta, pricing, finanzas]
status: active
last_ingested: null
chunk_count: null
---

# Objeción de Precio — Manejo de "Es Muy Caro"

## Variantes de la Objeción de Precio

| Variante | Contexto típico |
|----------|----------------|
| "Es muy caro" / "Está muy alto" | Reacción inmediata al precio sin procesar el ROI |
| "No tenemos presupuesto ahora" | Restricción real o pretexto para no decidir |
| "¿Me puedes dar descuento?" | Prueba del límite de negociación |
| "Voy a cotizar con otros" | Comparación de precio sin comparar valor |
| "¿Por qué tan caro si solo son reportes?" | Subestimación del producto |

## Respuestas por Variante

### Variante 1: "Es muy caro"

**Primero, reencuadrar con el ROI:**
> "Entiendo la percepción. Veámoslo desde otro ángulo: el sistema detectó que la operación está perdiendo $[ahorro anual] al año. La inversión es $[setup fee]. En 4 meses el sistema se paga solo y a partir de ahí es ahorro neto. ¿Qué parte le parece cara?"

**Si persiste:**
> "Cuando un médico le dice que necesita una operación de $50,000, la pregunta no es '¿por qué tan caro?', sino '¿cuánto me cuesta no operarme?' Aquí es igual."

### Variante 2: "No tenemos presupuesto ahora"

**Preguntar para calificar si es real o pretexto:**
> "¿Es un tema de flujo de caja o de priorización de presupuesto? Porque si es flujo, tenemos una estructura de pagos que puede ayudar. Si es priorización, hablemos de qué otros proyectos están compitiendo por ese presupuesto."

**Si es restricción real de flujo:**
> "En ese caso podemos estructurar el pago en dos tramos: 70% al firmar y 30% al entregar. ¿Eso se acerca más a lo que su flujo puede manejar hoy?"

**Nunca ofrecer Milestone Payment 60/40 proactivamente** — solo si el cliente lo pide explícitamente (ver [[architecture-pricing]]).

### Variante 3: "¿Me puedes dar descuento?"

> "El precio lo calcula nuestro sistema de auditoría interna basado en la complejidad de su operación. No es un número que yo determine subjetivamente, así que no está en mi mano modificarlo. Lo que sí puedo hacer es revisar si el alcance tiene elementos que podríamos diferir a una segunda fase, lo que ajustaría el precio. ¿Qué parte del alcance siente que tiene menor prioridad?"

**Nunca dar un descuento directo.** El ajuste siempre es de alcance, no de precio.

### Variante 4: "Voy a cotizar con otros"

> "Perfecto, le recomiendo hacerlo. Lo que sí le pido es que al comparar cotizaciones, pregunte específicamente: ¿el precio incluye el análisis forense con protocolo ALCOA+? ¿El Success Fee está atado a mejoras realmente medidas? ¿El Data Warehouse es propiedad del cliente o del proveedor? Las respuestas a esas preguntas van a hacer la comparación mucho más clara."

### Variante 5: "¿Por qué tan caro si solo son reportes?"

> "No son reportes. Los reportes te dicen qué pasó. Lo que construimos te dice qué está pasando ahora y te avisa antes de que el problema llegue a tu escritorio. La diferencia es como un GPS vs. un mapa impreso: el mapa también te dice dónde están las calles."

## Reglas del Manejo de Objeciones de Precio

1. **Nunca bajar el precio sin bajar el alcance.** El precio es una función de la complejidad, no de la voluntad del CEO.
2. **El silencio es una técnica.** Después de responder una objeción con el ROI, callarse y dejar que el cliente procese.
3. **No repetir el argumento dos veces.** Si el cliente no compró el ROI la primera vez, repetirlo no ayuda. Cambiar de ángulo (punto de equilibrio, costo de inacción, comparación de alternativas).
4. **La objeción de precio a veces encubre la objeción real** (falta de autoridad para decidir, desconfianza en el resultado). Explorar antes de responder al precio.
