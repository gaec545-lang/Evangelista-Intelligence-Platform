---
id: "EVK-OBJ-003"
title: "Objeción de Timeline — Manejo de 'No Tenemos Tiempo Ahora'"
type: objection
version: "1.0"
domain: [procesos]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [analyst, pm]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: ""
related: ["cost-of-inaction", "nasa-project-management", "architecture-pricing"]
depends_on: []
tags: [objecion, argumento-venta, procesos]
status: active
last_ingested: null
chunk_count: null
---

# Objeción de Timeline — Manejo de "No Tenemos Tiempo Ahora"

## Variantes de la Objeción de Timeline

| Variante | Contexto típico |
|----------|----------------|
| "Estamos en temporada alta, no podemos ahora" | Restricción operativa real o percibida |
| "Mejor en el próximo trimestre" | Postergación indefinida disfrazada de fecha |
| "Necesito revisar con mi equipo primero" | Falta de autoridad o de urgencia |
| "¿Cuánto tiempo va a interrumpir la operación?" | Miedo a la disrupción operativa |

## Respuestas por Variante

### Variante 1: "Estamos en temporada alta, no podemos ahora"

> "Entendido. Dos puntos: primero, el proyecto trabaja sobre los datos históricos, no en tiempo real con su operación — la implementación es paralela a su operación, no la interrumpe. Segundo, ¿cuándo termina su temporada alta?"

**Según la respuesta:**
> "Perfecto. Si empezamos Foundation ahora (que toma 2 semanas y no requiere más que acceso de lectura al sistema), el Dictamen estaría listo para presentarse justo cuando termina la temporada. Y Architecture iniciaría exactamente cuando tienen la banda ancha para verlo."

**Objetivo**: convertir "no ahora" en una fecha concreta.

### Variante 2: "Mejor en el próximo trimestre"

**Primero, hacer el costo de inacción concreto:**
> "Completamente entendible. Para que tengamos claridad: cada mes que pasa, los problemas que identificamos siguen costándoles $[costo mensual]. En un trimestre eso es $[costo × 3]. No es para presionar — es para que la decisión de cuándo empezar sea informada."

**Luego, agendar:**
> "¿Qué fecha del próximo trimestre es la ideal para ustedes? Les agendo la Cita 1 y bloqueamos el calendario."

**Nunca** dejar una conversación de "próximo trimestre" sin una fecha concreta. "Próximo trimestre" sin fecha concreta es un No disfrazado.

### Variante 3: "Necesito revisar con mi equipo primero"

**Primero calificar:**
> "¿Quién más necesita estar en esa conversación? ¿Es una decisión que depende de alguien más o es solo para informar al equipo?"

- Si hay otro decisor: programar Cita 4bis con esa persona presente
- Si es solo para informar: "Perfecto. ¿Podría ser yo quien los briefee brevemente en 20 minutos? A veces es más fácil que filtrar la información."

### Variante 4: "¿Cuánto tiempo va a interrumpir la operación?"

> "La respuesta corta es: prácticamente nada. Trabajamos sobre copias de los datos con acceso de solo lectura. Su ERP sigue funcionando exactamente igual. Lo único que necesitamos del equipo del cliente es: 30 minutos para que el área de sistemas nos configure el acceso, y 2-3 horas con el responsable del área del nodo crítico para el SIPOC. Eso es todo."

**Para Foundation:**
> "Foundation requiere 1 día de visita presencial (Cita 2). Ese día el CTO está con el equipo técnico, no con toda la planta. La operación no se detiene."

**Para Architecture:**
> "Architecture corre en paralelo a su operación. Construimos el Data Warehouse sin tocar el ERP. El único momento de 'atención' del equipo del cliente es la capacitación final — 4 horas, cuando el sistema ya está listo."

## Reglas del Manejo de Objeciones de Timeline

1. **Toda objeción de tiempo necesita una fecha concreta para ser real.** Sin fecha, es un No.
2. **El costo de inacción transforma el tiempo en dinero.** Usar cuando la postergación es indefinida.
3. **Calificar si la objeción de tiempo encubre otra objeción** (precio, autoridad, desconfianza). Preguntar directamente: "Si el timing fuera perfecto, ¿habría alguna otra razón que les impediría avanzar?"
4. **Nunca aceptar "te llamo" sin agenda.** Siempre terminar con una fecha y hora de seguimiento confirmada en el calendario.
