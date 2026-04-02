---
id: objection-budget
title: "Objeción: No Tenemos Presupuesto Este Año"
type: objection_handler
agent_access: [financial, process]
tags: [objeciones, ventas, presupuesto, costo-inaccion, urgencia]
sector: [todos]
dominios: [ventas, pricing]
version: "1.0"
author: evangelista
---

# Objeción: "No Tenemos Presupuesto Este Año"

## Variantes de esta objeción

1. "El presupuesto ya está comprometido para este ejercicio"
2. "Tendríamos que esperar al siguiente año fiscal"
3. "No entra en nuestra planeación financiera actual"
4. "El CFO ya cerró el presupuesto de TI y consultoría"
5. "Podríamos verlo para Q1 del próximo año"

## Por qué aparece esta objeción

"No hay presupuesto" es la objeción más común y la más deshonesta — no porque el cliente mienta, sino porque **el presupuesto siempre existe para las emergencias**. La empresa tiene presupuesto para pagar nómina, para comprar materia prima, para resolver una avería en producción. El problema es que el dolor de datos no se percibe como emergencia aunque destruya más valor que cualquiera de esas.

La objeción de presupuesto señala un diagnóstico incompleto: el dolor no fue cuantificado con suficiente precisión o el sponsor no tiene la autoridad suficiente para aprobar gasto de emergencia.

## La respuesta central

> "Entiendo. El Foundation cuesta $89,000 MXN. Según los datos que vimos juntos, su empresa pierde aproximadamente $X al año por [merma / duplicidad de pedidos / cuentas por cobrar vencidas]. ¿Tiene presupuesto para seguir perdiendo $X este año?"

Esta pregunta no es retórica — es una invitación a hacer el cálculo. Si el cliente dice "sí, tenemos presupuesto para seguir perdiendo", el problema es de urgencia, no de presupuesto. Si dice "no", la conversación ya cambió.

Ver [[argumento-costo-de-inaccion]] para la fórmula completa y ejemplos sectoriales.

## Foundation como proyecto de emergencia

La mayoría de las empresas tienen un mecanismo para aprobar gastos de emergencia fuera de presupuesto. El Foundation ($35,000–$89,000 MXN típicamente) entra en ese rango:

- No requiere licitación formal (por debajo de umbrales de compras en la mayoría de PyMEs)
- Puede clasificarse como "auditoría de procesos" o "diagnóstico operativo" — no como "consultoría de TI"
- El DG o CFO puede aprobarlo en una firma si el dolor está bien cuantificado
- El ROI del Foundation es demostrable antes de cerrar: si el diagnóstico revela $500K+ en ineficiencias, el Foundation se paga solo en el primer mes del Architecture

## Táctica: Milestone Payment (último recurso)

Si el cash flow es el problema real (no la falta de presupuesto), ofrecer pagos por hito:

| Hito | % del Foundation Fee | Momento |
|---|---|---|
| Firma de contrato | 40% | Día 0 |
| Entrega de Dictamen | 40% | Día 21–28 |
| Aceptación del Dictamen | 20% | Día 28–35 |

**Condición**: Milestone Payment solo se ofrece si el cliente tiene sponsor claro con autoridad de firma y el diagnóstico previo (Cita 1–2) ya reveló dolor cuantificado. No ofrecer como primer recurso — deprecia el valor percibido.

## Cuándo el "no hay presupuesto" es genuino

Algunas empresas genuinamente tienen el presupuesto 100% comprometido (cierre de año fiscal, crisis de caja, covenants bancarios restrictivos). En ese caso:

1. **Documentar el dolor** — Pedir permiso para dejar un resumen ejecutivo del valor potencial, para que el sponsor lo use en la planeación del siguiente año.
2. **Fecha de seguimiento** — Agendar llamada específica para semana 2 del siguiente periodo presupuestal.
3. **Caso de urgencia al CEO** — Si el dolor es mayor a $500K/año, escalar al DG directamente: el CFO raramente bloquea proyectos que el DG impulsa.

## Señal de que la objeción es pretexto

Si el cliente dice "no hay presupuesto" pero al mismo tiempo está comprando maquinaria nueva, contratando personal o invirtiendo en marketing, el problema no es el presupuesto. Es que el dolor de datos no está en su radar de prioridades. En ese caso, regresar a la cuantificación del dolor con datos más duros.

## Wikilinks relacionados

- [[argumento-costo-de-inaccion]] — Fórmula y ejemplos para calcular el costo de no actuar
- [[foundation-pricing]] — Estructura y rangos del Foundation Fee
- [[cost-of-inaction]] — Modelo financiero del costo de inacción
- [[perfil-ideal-cliente]] — Validar si el ICP es correcto antes de insistir
