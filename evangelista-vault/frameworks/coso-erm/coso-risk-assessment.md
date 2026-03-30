---
id: coso-risk-assessment
title: "COSO ERM — Evaluación de Riesgos"
type: framework
agent_access: [risk, financial, process]
tags: [coso, riesgos, evaluacion, erm, control_interno]
sector: [todos]
dominios: [riesgos, compliance]
version: "1.0"
author: evangelista
---

# COSO ERM — Evaluación de Riesgos

## Componente 2 del Marco COSO: Evaluación de Riesgos

La evaluación de riesgos es el proceso mediante el cual la organización identifica y analiza los riesgos relevantes para el logro de sus objetivos, formando una base para determinar cómo deben ser manejados.

## Principios de Evaluación de Riesgos (COSO 2017)

### Principio 6 — Especificación de Objetivos Adecuados
La organización especifica objetivos con suficiente claridad para permitir la identificación y evaluación de riesgos relacionados con los objetivos.

**Tipos de objetivos en PyME mexicana:**
- **Operativos:** Eficiencia y efectividad de operaciones (producción, inventarios, logística)
- **De reporte:** Confiabilidad de la información financiera y no financiera
- **De cumplimiento:** Cumplimiento con leyes y regulaciones (SAT, IMSS, STPS, NOM)

### Principio 7 — Identificación y Análisis de Riesgos
La organización identifica los riesgos para el logro de sus objetivos en toda la entidad y los analiza como base para determinar cómo deben administrarse.

**Técnicas de identificación:**
1. **Talleres de riesgo** — Sesiones con gerentes y operadores de proceso
2. **Análisis de procesos** — Mapeo SIPOC + identificación de puntos de falla
3. **Benchmarking sectorial** — Comparar con riesgos típicos del sector
4. **Revisión de incidentes históricos** — Auditorías previas, quejas SAT, accidentes

### Principio 8 — Evaluación de Riesgos de Fraude
La organización considera el potencial de fraude en la evaluación de riesgos para el logro de los objetivos.

**Triángulo del fraude (Cressey):**
- Incentivo/Presión
- Oportunidad (controles débiles)
- Racionalización

### Principio 9 — Identificación y Análisis de Cambios Significativos
La organización identifica y evalúa cambios que podrían impactar significativamente al sistema de control interno.

## Matriz de Evaluación de Riesgos

### Escala de Probabilidad
| Nivel | Descripción | Frecuencia esperada |
|---|---|---|
| 1 | Raro | Menos de 1 vez en 5 años |
| 2 | Poco probable | 1 vez en 2-5 años |
| 3 | Posible | 1 vez por año |
| 4 | Probable | Varias veces al año |
| 5 | Casi cierto | Frecuentemente |

### Escala de Impacto
| Nivel | Descripción | Impacto financiero (PyME) |
|---|---|---|
| 1 | Insignificante | < $50,000 MXN |
| 2 | Menor | $50K - $200K MXN |
| 3 | Moderado | $200K - $1M MXN |
| 4 | Mayor | $1M - $5M MXN |
| 5 | Catastrófico | > $5M MXN o cierre del negocio |

### Mapa de Calor COSO
```
Impacto  5 | 5  10  15  20  25
         4 | 4   8  12  16  20
         3 | 3   6   9  12  15
         2 | 2   4   6   8  10
         1 | 1   2   3   4   5
           +--------------------
             1   2   3   4   5  Probabilidad
```

**Semáforo:**
- **ROJO (16-25):** Requiere atención inmediata de Alta Dirección
- **AMARILLO (8-15):** Requiere plan de mitigación en 90 días
- **VERDE (1-7):** Monitoreo periódico

## Riesgos Frecuentes en PyME Manufacturera Mexicana

### Riesgos Operativos
1. **Concentración de conocimiento** — Un solo operador conoce el proceso crítico (P=4, I=4 = 16, ROJO)
2. **Falla de ERP** — Sistema desactualizado o sin soporte (P=3, I=4 = 12, AMARILLO)
3. **Ruptura de inventario** — Sin mínimos/máximos definidos (P=4, I=3 = 12, AMARILLO)

### Riesgos Financieros
4. **Concentración de clientes** — Un cliente > 60% de ventas (P=2, I=5 = 10, AMARILLO)
5. **Variación de tipo de cambio** — Insumos en USD, ventas en MXN (P=4, I=3 = 12, AMARILLO)

### Riesgos Regulatorios
6. **Discrepancias SAT** — CFDI mal emitidos, DIOT incompleto (P=3, I=4 = 12, AMARILLO)
7. **Incumplimiento NOM** — Especialmente NOM-035-STPS en manufactura (P=3, I=3 = 9, AMARILLO)

## Aplicación en el Vetting Gate de Evangelista

El Vetting Gate usa los factores β y Γ para evaluar la viabilidad de un proyecto antes de cotizar:

- **β (factor de riesgo):** Suma ponderada de riesgos identificados. β > 0.7 = NO-GO automático
- **Γ (factor de complejidad):** 1 + (0.5 × sucursales) + (0.2 × ERPs)

Una empresa con Γ > 3 y β > 0.5 requiere conversación explícita sobre alcance antes de proponer.
