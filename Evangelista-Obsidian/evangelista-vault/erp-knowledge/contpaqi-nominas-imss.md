---
id: "EVK-ERP-004"
title: "CONTPAQi Nóminas e IMSS — Auditoría de Capital Humano"
type: technical-guide
version: "1.0"
domain: ["erp", "contpaqi", "hr", "audit"]
sector: ["general"]
agent_access: [data_eng, hr]
confidence: high
source: evangelista-it
last_validated: 2026-03-30
parent: "contpaqi-structure"
related: ["contpaqi-structure"]
depends_on: []
tags: ["contpaqi-nominas", "imss", "idse", "payroll-audit"]
status: active
last_ingested: null
chunk_count: null
---

# CONTPAQi Nóminas e IMSS — Auditoría de Capital Humano

## Introducción
La nómina es a menudo el gasto más grande y menos auditado en una PyME mexicana. CONTPAQi Nóminas es el sistema estándar para gestionar este flujo y su conexión con el IMSS (IDSE/SUA).

## Estructura de Datos de Nómina

| Nombre de Tabla | Contenido | Relevancia en Auditoría |
|-----------------|-----------|-------------------------|
| **nom10001** | Catálogo de Empleados | Datos personales, RFC, CURP y Salario Diario Integrado (SDI). |
| **nom10007** | Movimientos de Nómina | Detalle de percepciones y deducciones por empleado/periodo. |
| **nom10032** | Incidencias | Faltas, retardos, vacaciones y permisos. |
| **nom10002** | Periodos | Definición de fechas de corte y tipos de nómina (quincenal, semanal). |

## El Triángulo de la Verdad (Auditoría Cruza)

Un dictamen forense de Evangelista en el área de RH debe cruzar tres fuentes:
1. **CONTPAQi Nóminas**: Lo que la empresa dice que paga.
2. **XML de Nómina (SAT)**: Lo que la empresa timbró oficialmente.
3. **IDSE/SUA (IMSS)**: El salario base de cotización reportado.

**Hallazgo típico**: Diferencias entre el SDI reportado al IMSS vs. el realmente pagado (Riesgo de capitales constitutivos y multas catastróficas).

## Conexión con IMSS/IDSE
CONTPAQi Nóminas automatiza el envío de movimientos al IMSS. El `data_eng` debe buscar en la base de datos los acuses de recibo del IDSE para validar que las "altas y bajas" se realizaron en tiempo legal (máximo 5 días hábiles).

## Trampas y Alertas

### 1. Nómina Operativa vs Fiscal
Empresas que pagan un sueldo "en libros" y un "bono" adicional por fuera.
- **Detección**: Buscar transferencias bancarias recurrentes a empleados que no coinciden con los netos de la tabla `nom10007`.

### 2. Empleados Fantasma
- **Query**: Buscar empleados sin registro de asistencia o con fechas de ingreso posteriores al último timbrado de nómina.

## Resumen para Agentes
Cuando el agente `hr` analice la rotación de personal, el `data_eng` debe proporcionar un reporte de permanencia cruzando la tabla de empleados con la tabla de incidencias para identificar departamentos con "fuga de talento" por mala gestión de clima laboral.
