---
id: imss-digital-workforce
title: "IMSS Digital y Reforma de Outsourcing: Implicaciones para Consultoras y BI"
type: regulatory_reference
agent_access: [financial, process]
tags: [regulatorio, imss, outsourcing, repse, laboral, compliance, consultora]
sector: [todos]
dominios: [compliance, rrhh, financiero]
version: "1.0"
author: evangelista
---

# IMSS Digital y Reforma de Outsourcing: Implicaciones para Consultoras y BI

## La Reforma de Outsourcing 2021

La **Reforma al artículo 13 de la LFT** (DOF 23-abr-2021) modificó radicalmente el esquema de subcontratación laboral en México. Los puntos principales:

- Se **prohíbe el outsourcing de personal** en su modalidad tradicional (empresa que pone personal a disposición de otra)
- Se permite la **subcontratación de servicios especializados** cuando no forman parte del objeto social del contratante
- Las empresas que prestan servicios especializados deben inscribirse en el **REPSE** (Registro de Prestadoras de Servicios Especializados u Obras Especializadas)

## ¿Aplica REPSE a Evangelista?

**Respuesta corta: probablemente sí, dependiendo de la estructura del contrato.**

### Escenario A: Evangelista como prestadora de servicios especializados

Si Evangelista firma contratos donde personal de Evangelista trabaja en las instalaciones del cliente por períodos extendidos (más de 3 meses), esto puede clasificarse como subcontratación de servicios especializados.

**Acción requerida**:
1. Inscripción en REPSE ante la STPS (trámite en línea, vigencia 3 años)
2. El cliente debe retener 6% del monto de la factura e informarlo al SAT (formulario CFDI complemento de retenciones)
3. Evangelista debe proporcionar al cliente copia del REPSE, IMSS Idse e ISR mensualmente

**Costo de incumplimiento**: El cliente no puede deducir las facturas de servicios especializados sin el REPSE del proveedor. Esto convierte el incumplimiento de Evangelista en un problema fiscal del cliente.

### Escenario B: Evangelista como consultoría por proyecto (sin personal en instalaciones)

Si los contratos son por entregables específicos con fechas definidas (Foundation, Architecture) y el trabajo se realiza principalmente en instalaciones de Evangelista o de forma remota, **no aplica REPSE**.

La clave es la distinción entre "poner personas" y "entregar resultados". El modelo de Evangelista (Foundation Fee + Success Fee por resultado) es naturalmente más cercano al Escenario B.

**Recomendación**: Revisar con el área legal de Evangelista que los contratos estén redactados como "contratos de prestación de servicios por resultado" — no como "contratos de suministro de personal".

## IMSS Digital: Implicaciones para análisis de datos de nómina

El IMSS ha digitalizado progresivamente sus procesos. Para proyectos de análisis de datos de RRHH en clientes, considerar:

### SUA (Sistema Único de Autodeterminación)

El SUA genera archivos de texto plano con la determinación mensual de cuotas IMSS. Este archivo es una fuente de datos valiosa para:
- Conciliar número de empleados registrados vs. nómina interna
- Detectar empleados dados de alta en nómina pero no en IMSS (riesgo laboral)
- Detectar empleados en IMSS pero no en nómina (posible nómina paralela)

**Nota de acceso**: El SUA es propiedad del patrón. Evangelista puede solicitar acceso de lectura al SUA como parte del diagnóstico Foundation — no requiere credenciales del IMSS, solo acceso al archivo de texto generado.

### IDSE (IMSS desde su Empresa)

Portal del IMSS para movimientos afiliatorios (altas, bajas, modificaciones de salario). Los datos del IDSE son la fuente oficial de:
- Fecha de ingreso y baja de cada empleado
- Salario Base de Cotización (SBC) registrado
- Tipo de contrato (indeterminado, determinado, obra determinada)

**Caso de uso en Foundation**: Comparar el SBC registrado en IMSS vs. el salario real en nómina. Una diferencia sistemática (SBC < salario real) indica subdeclaración de nómina — un pasivo contingente que el Dictamen debe documentar.

## KPIs de nómina habilitados con datos IMSS+SUA

### KPI: Tasa de Rotación Real
```
Rotacion = (Bajas_IMSS_periodo / Plantilla_Promedio) × 100
```
Diferencia importante: la rotación en IMSS puede ser mayor que la que reporta RRHH, si se están dando bajas ficticias para evadir liquidaciones. Benchmark PyME manufactura México: 15–25% anual. Por encima de 35% indica problema severo.

### KPI: Costo Real de Rotación
```
Costo_Rotacion = N_Bajas × (3 meses_SBC × 1.35_factor_carga)
```
El factor 1.35 incluye: liquidación (3 meses), curva de aprendizaje del reemplazo (2 meses equivalente), costo de reclutamiento. Para una empresa con 100 empleados y 30% de rotación, este costo puede superar $1.5M MXN/año.

### KPI: Ratio Cuotas IMSS / Nómina Bruta
```
Ratio_IMSS = Cuotas_IMSS_pagadas / Nomina_Bruta_periodo
```
Rango normal: 0.22–0.28 (depende del SBC promedio y tabla de cuotas). Por debajo de 0.20 sugiere subdeclaración de nómina. Por encima de 0.30 sugiere errores en el cálculo del SBC.

## Reforma de subcontratación: impacto en clientes del análisis financiero

Para clientes de Evangelista que usaban outsourcing tradicional antes de 2021 y migraron a esquemas de servicios especializados o insourcing, el impacto en los datos financieros es visible:

- **Gasto de nómina**: aumenta (antes estaba oculto en "servicios externos")
- **Gasto en servicios profesionales**: disminuye
- **Número de empleados en IMSS**: aumenta (antes estaban en nómina de la outsourcera)
- **Comparabilidad interanual**: los estados financieros pre/post-2021 no son directamente comparables sin ajuste

Este ajuste debe documentarse en el Dictamen Foundation si el período de análisis cubre los años 2019–2023.

## Wikilinks relacionados

- [[nom-standards]] — NOM-035 sobre factores de riesgo psicosocial en el trabajo
- [[cfdi-40-implications]] — Complemento de nómina en CFDI para conciliación fiscal
- [[coso-risk-assessment]] — Riesgo laboral y contingencias IMSS en evaluación COSO
- [[cost-of-inaction]] — Cuantificar pasivos contingentes por incumplimiento IMSS
