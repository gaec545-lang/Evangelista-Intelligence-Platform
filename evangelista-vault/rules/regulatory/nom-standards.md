---
id: nom-standards
title: "NOMs Relevantes para Manufactura y Datos — México"
type: regulatory
agent_access: [risk, process, data_engineer]
tags: [nom, normatividad, stps, sat, compliance, manufactura]
sector: [manufactura, logistica, construccion, retail]
dominios: [riesgos, compliance, procesos]
version: "1.0"
author: evangelista
---

# Normas Oficiales Mexicanas Relevantes para Manufactura

## Por qué importan las NOMs en el contexto de Evangelista

Durante The Foundation, Evangelista evalúa el nivel de cumplimiento regulatorio como parte del componente de riesgo (factor β). Las NOMs incumplidas representan:
1. **Riesgo financiero:** Multas STPS de $5K-$500K MXN por incumplimiento
2. **Riesgo operativo:** Suspensión de actividades en caso de accidente con lesionados
3. **Riesgo de datos:** Algunas NOMs requieren registros documentados que deben ser incluidos en el sistema de datos

## NOMs de Seguridad e Higiene (STPS)

### NOM-035-STPS-2018 — Factores de Riesgo Psicosocial
**¿Qué requiere?**
- Identificar y evaluar factores de riesgo psicosocial (estrés laboral, acoso, jornadas extensas)
- Para empresas con 16+ trabajadores: aplicar cuestionario, analizar resultados, implementar medidas
- Para empresas con 51+ trabajadores: programa de intervención documentado

**Relevancia para datos:** Los resultados de las evaluaciones deben almacenarse por 5 años. Esto requiere un sistema de registro (no Excel) para empresas con varias plantas.

**Frecuencia de aplicación:** Anual

**Multa por incumplimiento:** $5,200 - $52,000 MXN (según número de trabajadores y gravedad)

### NOM-036-STPS-2018 — Factores de Riesgo Ergonómico
**¿Qué requiere?**
- Identificar y evaluar tareas con movimientos repetitivos, posturas forzadas, manejo manual de cargas
- Programa de prevención de trastornos musculo-esqueléticos

**Relevancia para manufactura textil:** Alta — operadoras de máquinas de coser tienen alto riesgo de lesiones de muñeca y espalda.

### NOM-001-STPS-2008 — Edificios, Locales, Instalaciones y Áreas
**Requisitos básicos** de seguridad en instalaciones manufactureras: pasillos libres, señalización, extinguidores, salidas de emergencia.

**Check durante Foundation:** Verificar que los datos de layout de planta están actualizados y que existe registro de inspecciones periódicas.

### NOM-019-STPS-2011 — Comisiones de Seguridad e Higiene
**Requiere:** Constitución y funcionamiento de Comisión de Seguridad con actas mensuales.
**Relevancia de datos:** Las actas deben ser resguardadas. Integrar en el sistema documental.

## NOMs Ambientales (SEMARNAT)

### NOM-161-SEMARNAT-2011 — Residuos de Manejo Especial
Para empresas que generan residuos industriales (solventes, tintas, aceites, metales pesados):
- Registro como generador
- Plan de manejo
- Manifiestos de transporte y disposición final

**Relevancia para textilera:** Los tintes sintéticos y solventes de limpieza son residuos de manejo especial. El incumplimiento puede provocar clausura.

## NOMs Fiscales (SAT)

### CFDI 4.0 — Comprobante Fiscal Digital
**Requerimientos de datos críticos desde 2022:**
- RFC del receptor obligatorio (adiós facturas a "público en general" para B2B)
- Código postal del emisor y receptor
- Régimen fiscal del receptor
- Uso del CFDI (catálogo SAT)

**Impacto en sistemas:** El ERP o sistema de facturación debe estar actualizado a CFDI 4.0. Las empresas con sistemas legacy tienen alto riesgo de emitir CFDIs inválidos.

**Consecuencia:** SAT puede rechazar deducción de gastos + multas de 55-75% del monto del comprobante incorrecto.

### Complemento de Carta Porte
Para transportistas y empresas que mueven mercancía entre estados:
- Obligatorio desde enero 2022
- Describe origen, destino, mercancía, unidad de transporte
- Se integra al CFDI de traslado

**Relevancia para logística:** Una empresa de transporte sin Carta Porte correcta puede ser detenida en cualquier punto de verificación federal.

## Evaluación de Cumplimiento en Foundation

### Checklist de Riesgo Regulatorio

| NOM/Regulación | Aplica a | Nivel de Riesgo si Incumple |
|---|---|---|
| NOM-035-STPS | Todas con 16+ trabajadores | Medio |
| NOM-036-STPS | Manufactura con trabajos repetitivos | Medio-Alto |
| CFDI 4.0 | Todas las empresas | Alto |
| Carta Porte | Logística / traslados foráneos | Alto |
| NOM-161-SEMARNAT | Manufactura con residuos especiales | Alto |
| IMSS — IDSE | Todas con empleados | Crítico |

### Cómo suma al factor β

| Hallazgo | Incremento en β |
|---|---|
| CFDI 4.0 desactualizado | +0.15 |
| Sin registros NOM-035 | +0.05 |
| Sin Carta Porte (transportista) | +0.20 |
| Residuos especiales sin registro | +0.15 |
| IMSS con discrepancias | +0.25 |

Un cliente con 3 incumplimientos regulatorios puede acumular β > 0.6 solo por este rubro, acercándose al umbral de NO-GO.
