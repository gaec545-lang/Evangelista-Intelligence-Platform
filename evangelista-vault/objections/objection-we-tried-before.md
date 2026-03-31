---
id: objection-we-tried-before
title: "Objeción: Ya Intentamos Algo Similar y No Funcionó"
type: objection_handler
agent_access: [financial, process]
tags: [objeciones, ventas, experiencia-previa, confianza, diferenciacion]
sector: [todos]
dominios: [ventas, pricing]
version: "1.0"
author: evangelista
---

# Objeción: "Ya Intentamos Algo Similar y No Funcionó"

## Variantes de esta objeción

1. "Contratamos una consultora hace dos años y no vimos resultados"
2. "Ya implementamos Power BI y nadie lo usa"
3. "Intentamos un proyecto de ERP y fue un desastre"
4. "Pagamos a un freelancer para hacer dashboards y no sirvieron"
5. "Nuestro proveedor de SAP nos hizo un proyecto de reportería que nadie entiende"

## Por qué aparece esta objeción

Esta es la objeción más valiosa de todas. Un cliente que ya intentó algo similar tiene dos características:

1. **Confirma que el dolor es real** — invirtió dinero en intentar resolverlo
2. **Tiene miedo específico** — no miedo genérico, sino miedo basado en una experiencia concreta

La respuesta incorrecta es defender a Evangelista genéricamente. La respuesta correcta es **diagnosticar el fracaso anterior** y mostrar que Evangelista lo habría hecho diferente.

## La pregunta de diagnóstico

> "¿Qué salió mal? ¿Qué fue lo que no funcionó?"

Dejar que el cliente hable. No interrumpir. Tomar notas. Las respuestas más comunes caen en tres categorías:

### Categoría 1: Automatizaron sobre un proceso roto

**Síntomas que el cliente describe**: "Los dashboards mostraban números que no cuadraban con la realidad", "La gente seguía usando Excel porque los reportes no coincidían con lo que ellos sabían", "Había datos en tres sistemas diferentes y nadie sabía cuál era el bueno."

**Diagnóstico**: El proyecto de datos asumió que los procesos subyacentes eran correctos. No lo eran. Los datos eran un reflejo fiel de procesos rotos.

**Respuesta Evangelista**: "Exacto. Eso es lo que pasa cuando se implementa tecnología sin antes sanear los procesos. Nosotros empezamos diferente: antes de tocar ninguna herramienta, hacemos un diagnóstico de proceso con metodología DMAIC. Si el proceso está roto, lo decimos en el Dictamen. La automatización viene después, nunca antes."

Ver [[coso-control-activities]] y metodología de proceso en [[dmaic-analyze]].

### Categoría 2: El proveedor desapareció post-entrega

**Síntomas**: "Entregaron el proyecto y desaparecieron", "Cuando algo fallaba no había quién respondiera", "Los reportes se rompieron a los 3 meses y nadie sabía repararlos."

**Diagnóstico**: El modelo de negocio del proveedor era entregar y cobrar. Sin éxito compartido, sin incentivo para que funcione.

**Respuesta Evangelista**: "Tiene sentido. Cuando el proveedor ya cobró su honorario completo, no tiene incentivo financiero para que siga funcionando. Nuestro Success Fee se paga 90 días después de la entrega, medido contra resultados reales. Si algo falla en ese período, nos afecta directamente. Por eso tenemos Sentinel activo durante el período de medición."

### Categoría 3: Los KPIs no medían impacto real

**Síntomas**: "Teníamos muchos dashboards pero nadie sabía si el negocio mejoraba o empeoraba", "Los indicadores eran técnicos pero no financieros", "El CEO preguntaba cuánto dinero nos estábamos ahorrando y nadie sabía responder."

**Diagnóstico**: El proveedor entregó herramientas de visualización, no análisis de impacto financiero. Hay una diferencia enorme entre un dashboard bonito y un KPI que mueve el EBITDA.

**Respuesta Evangelista**: "Eso es muy común. La industria de BI tiende a entregar más reportes cuando lo que el negocio necesita es menos decisiones malas. Nosotros limitamos los KPIs a máximo 5 por rol, todos vinculados a una línea del estado de resultados. Si un KPI no puede conectarse con un impacto financiero verificable en 90 días, no lo incluimos."

Ver [[agent-analyst]] para la regla de máx. 5 KPIs y prohibición de SLAs vacíos.

## Cómo cerrar tras esta objeción

Después de diagnosticar el fracaso anterior y posicionar la diferencia, hacer la pregunta de cierre:

> "El problema que usted tuvo antes fue [X]. Nosotros lo resolvemos de esta manera: [respuesta específica]. La pregunta es: ¿el dolor que usted tiene hoy es suficientemente grande para volver a intentarlo con una metodología diferente?"

Si la respuesta es sí, el cliente está más calificado que uno que nunca lo intentó — porque ya sabe el costo de no resolverlo.

## Señal de alerta

Si el cliente no puede describir con claridad qué salió mal, quizás el fracaso fue en la adopción interna (resistencia al cambio), no en la metodología del proveedor. En ese caso, el riesgo para Evangelista también es real. Evaluar factor β de cambio organizacional en [[coso-risk-assessment]].

## Wikilinks relacionados

- [[evangelista-rules]] — Reglas que diferencian la metodología de Evangelista
- [[argumento-success-fee]] — Alineación de incentivos como respuesta al "proveedor que desaparece"
- [[coso-control-activities]] — Diagnóstico de controles antes de automatizar
- [[perfil-ideal-cliente]] — Validar que el cliente anterior tenía el perfil correcto
