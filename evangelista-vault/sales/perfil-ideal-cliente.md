---
id: perfil-ideal-cliente
title: "ICP: Perfil Ideal del Cliente Evangelista"
type: sales_reference
agent_access: [financial, process, risk]
tags: [ventas, icp, calificacion, prospectacion, vetting, factor-beta]
sector: [todos]
dominios: [ventas, pricing, vetting]
version: "1.0"
author: evangelista
---

# ICP: Perfil Ideal del Cliente Evangelista

## Qué es el ICP y por qué importa

El **Ideal Customer Profile (ICP)** define exactamente qué tipo de empresa tiene más probabilidad de tener éxito con la metodología Evangelista, pagar el precio sin resistencia excesiva, y convertirse en un caso de éxito replicable.

No toda empresa con dolor de datos es un cliente ideal. Calificar mal a un prospecto cuesta tiempo, desgasta al equipo y puede generar un proyecto fallido que daña la reputación. **Rechazar prospectos fuera del ICP es tan importante como cerrar los que están dentro.**

## El ICP de Evangelista: criterios de inclusión

### Criterio 1: Facturación anual $10M – $200M MXN

**Por qué este rango**:
- Por debajo de $10M: el Foundation Fee representa >0.9% de la facturación anual — demasiado alto como porcentaje para que el ROI sea convincente
- Por encima de $200M: las empresas tienen equipos internos de datos, procesos de compras más complejos, y el modelo de Evangelista compite con grandes consultoras
- El rango $30M–$100M es el **sweet spot** — tamaño suficiente para tener datos complejos, sin estructura interna para resolverlos

### Criterio 2: Empleados 30 – 500

**Por qué este rango**:
- <30 empleados: los procesos son informales, los datos son escasos, y el dolor es real pero el negocio no tiene capacidad de absorber el cambio
- >500 empleados: la complejidad política y de adopción sube exponencialmente — el Factor β tiende a ser alto

### Criterio 3: ERP instalado y operando

El cliente debe tener al menos uno de estos sistemas con datos de los últimos 24 meses:

| ERP | Prevalencia en PyMEs México | Factor α típico |
|---|---|---|
| SAP Business One | Media-alta | 2.5–4.0 |
| CONTPAQi Adminpaq/Contpaq | Alta | 1.5–3.0 |
| Aspel NOI / SAE / COI | Alta | 1.5–2.5 |
| Microsip | Media | 1.2–2.0 |
| Siigo (antes Exactus) | Baja-media | 1.8–3.0 |

**No aplica**:
- Desarrollo propio sin documentar: los datos están en estructuras propietarias sin llave de acceso estándar → Factor α desconocido, riesgo técnico alto
- Solo Excel: no hay sistema transaccional → sin historial confiable

### Criterio 4: Factor β < 0.7

El Factor β mide la complejidad organizacional y resistencia al cambio. Ver [[coso-risk-assessment]] para el cálculo completo.

Componentes que elevan β:
- Conflictos entre socios activos (>0.15 de incremento)
- Dirección General sin autoridad real (holding o empresa familiar con fundador no activo)
- Litigios laborales o fiscales activos relevantes
- Empresa en proceso de venta o fusión
- Plantilla con sindicato activo y resistencia documentada al cambio

Si β > 0.7: **el proyecto es un NO-GO** — el riesgo de fracaso supera el umbral aceptable para el modelo de Success Fee. Ver [[evangelista-rules]].

### Criterio 5: Factor α > 1.0

El Factor α mide la riqueza del historial de datos disponibles.

```
α = log10(registros_transaccionales_últimos_24_meses) - 4
```

| Registros en 24 meses | α | Interpretación |
|---|---|---|
| < 10,000 | < 0 | Datos insuficientes para análisis estadístico confiable |
| 10,000 | 0 | Mínimo absoluto |
| 50,000 | 0.7 | Borderline — Foundation posible, Architecture limitado |
| 100,000 | 1.0 | ICP mínimo |
| 500,000 | 1.7 | ICP óptimo |
| 1,000,000+ | 2.0 | ICP premium — máximo impacto del Architecture |

### Criterio 6: Sponsor con autoridad identificado

**Sponsor ideal**: Director General o dueño con poder de firma y que participa personalmente en al menos Cita 2 (Diagnóstico) y Cita 4 (Propuesta formal).

**Sponsor aceptable**: CFO o Director de Operaciones con delegación explícita del DG para aprobar gastos de esta categoría.

**Sponsor no válido**: Gerente de sistemas, coordinador de TI, o cualquier persona que necesita aprobación de otra persona para cerrar.

La regla es simple: si el sponsor no puede decir "sí" en la reunión, no es el sponsor correcto.

### Criterio 7: DG/CFO accesibles para Cita 3

El Dictamen (Cita 3) debe presentarse al DG o CFO directamente — no a través de intermediarios. Si el acceso al DG no se puede garantizar antes de iniciar el Foundation, el proyecto tiene riesgo alto de muerte en comités.

## Anti-ICP: razones de descalificación inmediata

| Condición | Por qué descalifica |
|---|---|
| Sin ERP (solo Excel) | No hay historia transaccional confiable — Factor α imposible de calcular |
| β > 0.7 | Riesgo de fracaso inaceptable para el modelo de Success Fee |
| Sin sponsor identificado | El proyecto morirá en el proceso de aprobación |
| Startup sin datos históricos | Menos de 12 meses de datos — sin base estadística para diagnóstico |
| Empresa en proceso de venta/fusión | Las prioridades cambiarán durante el proyecto |
| Empresa con fraude activo documentado | El diagnóstico puede usarse en litigios — riesgo legal para Evangelista |
| Facturación < $5M MXN | El Foundation Fee supera el 1.8% de la facturación anual |
| DG inaccesible o desinteresado en Cita 1 | Sin patrocinio ejecutivo, el proyecto no tiene condiciones para tener éxito |

## Señales positivas que aceleran el cierre

- El DG habla del problema espontáneamente sin que se le pregunte
- Hay un "episodio reciente" que expuso el dolor (auditoría fallida, cliente importante perdido, diferencia grande en inventario)
- Ya intentaron resolver el problema antes (ver [[objection-we-tried-before]]) — tienen urgencia basada en experiencia
- El CFO ya tiene una cifra aproximada del costo del problema
- La empresa tiene competidores directos que ya resolvieron el mismo problema

## Calificación rápida (checklist Cita 1)

```
☐ Facturación en rango $10M–$200M MXN
☐ ERP instalado con ≥24 meses de datos
☐ Sponsor en sala con autoridad de firma
☐ β estimado < 0.7 (primera impresión)
☐ Dolor verbalizado espontáneamente
☐ Presupuesto de operación que puede absorber el Foundation
☐ Acceso confirmado al DG para Cita 3
```

5/7 o más → Prospecto calificado, avanzar a Cita 2.
3–4/7 → Prospecto borderline, verificar los criterios faltantes antes de invertir más tiempo.
<3/7 → Descalificar amablemente.

## Wikilinks relacionados

- [[coso-risk-assessment]] — Cálculo detallado del Factor β
- [[factor-gamma-system]] — Factor Γ que determina el precio del Architecture
- [[foundation-pricing]] — Pricing del primer paso del proceso
- [[objection-decision-committee]] — Qué hacer cuando el sponsor no tiene autoridad suficiente
- [[argumento-costo-de-inaccion]] — Para convertir prospectos borderline en calificados
