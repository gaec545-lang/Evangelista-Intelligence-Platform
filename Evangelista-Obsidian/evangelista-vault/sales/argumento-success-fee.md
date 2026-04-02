---
id: argumento-success-fee
title: "Argumento: Solo Ganamos Si Usted Gana — El Mecanismo del Success Fee"
type: sales_argument
agent_access: [financial, process]
tags: [ventas, success-fee, alineacion-incentivos, riesgo-compartido, cierre, pricing]
sector: [todos]
dominios: [ventas, pricing, financiero]
version: "1.0"
author: evangelista
---

# Argumento: "Solo Ganamos Si Usted Gana"

## Por qué el Success Fee es el diferenciador más importante

La mayoría de las consultoras cobran por tiempo o por entregable. Su modelo de negocio garantiza su ingreso independientemente del resultado del cliente. Evangelista cobra el **25% del Setup Fee como Success Fee, condicionado a resultado financiero verificable en 90 días**.

Esto no es marketing. Es un mecanismo contractual con cuatro componentes técnicos que lo hacen funcionar.

> "Solo cobramos el Success Fee si el ahorro es real. Si no lo es, no lo cobramos. Ese es el punto."

## Los cuatro componentes del mecanismo

### Componente 1: Snapshot Día Cero

En la primera semana del Architecture, Evangelista realiza una **fotografía forense del estado actual** de los procesos e indicadores clave:

- Hash MD5 de las tablas de datos críticas (inventario, ventas, cartera)
- KPIs base medidos con los datos actuales (antes de cualquier cambio)
- Estado de los procesos documentado (tiempos de ciclo, tasas de error, desperdicios)
- Firma digital de ambas partes sobre el documento de Snapshot Día Cero

Este snapshot es la línea base contra la cual se mide el resultado. No puede ser manipulado retroactivamente — está firmado y fechado por ambas partes.

### Componente 2: Ventana de medición de 90 días

A partir de la entrega del Architecture (cuando los sistemas y procesos están en producción), comienza una **ventana de 90 días** de medición activa:

- Los KPIs acordados se miden semanalmente
- Evangelista accede a los datos en modo Read-Only para verificar independientemente
- El cliente reporta los resultados en el portal Sentinel
- Si hay discrepancias, se resuelven con el dato del sistema — no con la percepción

Al día 90, se hace el **cierre de la ventana** y se calcula el ahorro real.

### Componente 3: Libros Abiertos (Open Book)

El cálculo del ahorro no puede depender de la buena fe de ninguna de las partes. Por eso el contrato especifica **Libros Abiertos** para el período de medición:

- El cliente da acceso de lectura a los datos relevantes (mismo acceso Read-Only del proyecto)
- Evangelista presenta el cálculo del ahorro con la metodología definida en el contrato
- Si el cliente no está de acuerdo con el cálculo, tiene 10 días hábiles para objetar con datos
- En caso de disputa, se contrata un auditor externo acordado por ambas partes — su costo lo paga quien estuvo equivocado

### Componente 4: Cálculo Forense

El ahorro se calcula comparando:

```
Ahorro_Real = KPI_Post × Volumen_Post - KPI_Pre × Volumen_Pre
```

Ejemplo para merma de inventario:
```
KPI_Pre = 8.2% de merma sobre ventas
KPI_Post = 3.1% de merma sobre ventas
Ventas_Post = $4.8M MXN en 90 días
Ahorro = (8.2% - 3.1%) × $4.8M = $244,800 MXN en 90 días
Ahorro_Anualizado = $979,200 MXN
Success_Fee = $979,200 × 25% = $244,800 MXN
```

El Success Fee se cobra **una sola vez**, al cierre de la ventana de 90 días. No es una renta perpetua.

## Objeciones anticipadas al Success Fee

### "¿Y si el ahorro no se materializa?"

> "Entonces no cobramos el Success Fee. Ese es el punto. Si no hay resultado, no hay honorario variable. Por eso tomamos tan en serio el diagnóstico previo — solo aceptamos proyectos donde estamos seguros de que el ahorro existe. Si el Dictamen Foundation no identifica al menos $500,000 MXN en ineficiencias recuperables, le decimos que no tiene sentido continuar al Architecture."

### "¿Cómo sé que el ahorro es real y no fabricado?"

> "El Snapshot Día Cero lo firmamos los dos antes de empezar. Usted tiene copia. Los datos vienen de sus propios sistemas, no de nuestros cálculos. Y si no está de acuerdo con el número al final, traemos un auditor externo que lo valida. La metodología está en el contrato — página por página."

### "El 25% del Setup Fee es mucho dinero"

> "Es 25% del Setup Fee, que a su vez es una fracción del ahorro que vamos a generar. En el ejemplo de hace un momento: Setup Fee $486,000, Success Fee $121,500. El ahorro verificado fue $979,200 en 90 días. Usted pagó $607,500 en total y recuperó $979,200 en el primer trimestre. ¿Le parece mucho el 25%?"

### "¿Qué pasa si el ahorro se da, pero nosotros no lo queremos reconocer?"

Esta objeción raramente se hace explícitamente, pero está implícita. La respuesta está en el diseño:
- Los datos son objetivos — no dependen de la opinión del cliente
- El mecanismo de auditor externo existe exactamente para este caso
- La cláusula penal convencional aplica si el cliente obstruye la medición

## Cuándo NO ofrecer el Success Fee

- Si el cliente no tiene datos históricos confiables (Factor α < 1.0): no hay línea base medible
- Si el cliente tiene Factor β > 0.7 ([[coso-risk-assessment]]): el riesgo de fracaso es demasiado alto para asumirlo
- Si la intervención propuesta tarda más de 6 meses en generar ahorro visible: la ventana de 90 días no alcanza

## Referencia de casos

El mecanismo funcionó en:
- **Caso Textiles Atoyac**: ahorro verificado de $1.67M MXN en 90 días, Success Fee cobrado: $121,500 MXN
- **Caso Supply Chain Disruption** (ver [[caso-supply-chain-disruption]]): reducción de costos de ruptura de $890K en primer trimestre

## Wikilinks relacionados

- [[foundation-pricing]] — El Foundation es el prerequisito del Architecture y el Success Fee
- [[architecture-pricing]] — Setup Fee base para calcular el 25% de Success Fee
- [[factor-gamma-system]] — Γ determina el Setup Fee y por tanto el Success Fee máximo
- [[coso-risk-assessment]] — Factor β como criterio de viabilidad del modelo de success fee
- [[argumento-costo-de-inaccion]] — Usar el CoI para justificar el nivel de inversión total
