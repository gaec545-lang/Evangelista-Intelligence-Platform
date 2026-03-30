---
id: coso-control-activities
title: "COSO ERM — Actividades de Control"
type: framework
agent_access: [risk, process]
tags: [coso, control_interno, actividades_control, preventivo, detectivo]
sector: [todos]
dominios: [riesgos, procesos, compliance]
version: "1.0"
author: evangelista
---

# COSO ERM — Actividades de Control

## Componente 3: Actividades de Control

Las actividades de control son las acciones establecidas a través de políticas y procedimientos que ayudan a asegurar que las directivas de la administración para mitigar riesgos sean llevadas a cabo.

## Tipos de Controles

### Por Naturaleza

#### Controles Preventivos
Diseñados para evitar que ocurran errores o irregularidades **antes** de que sucedan.

**Ejemplos en manufactura:**
- Autorización dual para órdenes de compra > $100K MXN
- Segregación de funciones: quien aprueba no puede emitir el cheque
- Límites de acceso en ERP por rol (SAP authorization objects)
- Checklist pre-producción obligatorio para cambio de línea

**Ejemplos en datos:**
- Validaciones en punto de captura (rangos, formatos, duplicados)
- Reglas de negocio en ETL antes de cargar al DW
- Control de versiones en modelos dimensionales

#### Controles Detectivos
Diseñados para identificar y corregir errores o irregularidades **después** de que ocurren.

**Ejemplos:**
- Conciliación de inventario físico vs. sistema (mensual)
- Análisis de Benford sobre montos de facturación
- Alertas automáticas en dashboard de KPIs (desviación > 15%)
- Revisión de log de accesos críticos en ERP

#### Controles Correctivos
Diseñados para corregir situaciones no deseadas una vez detectadas.

**Ejemplos:**
- Procedimiento de ajuste de inventario con aprobación gerencial
- Protocolo de reversión de transacciones en ERP
- Plan de contingencia para falla del sistema crítico

### Por Mecanismo

#### Controles Manuales
Requieren intervención humana. Mayor riesgo de error pero mayor flexibilidad.
- Firma de documentos
- Revisión visual de reportes
- Conteo físico de inventario

#### Controles Automatizados
Ejecutados por sistemas sin intervención humana. Más confiables pero requieren mantenimiento.
- Reglas de validación en ERP
- Alertas automáticas en BI
- Segregación de funciones por sistema (acceso basado en roles)

#### Controles Semimanuales (Híbridos)
Combinan sistema y revisión humana.
- Reporte generado automáticamente + revisión y firma del gerente
- Dashboard con alertas + plan de acción documentado

## Framework de Controles por Proceso en PyME

### Proceso: Compras
| Riesgo | Control | Tipo | Frecuencia |
|---|---|---|---|
| Fraude en compras | Autorización dual > umbral | Preventivo | Por transacción |
| Proveedor no calificado | Registro de proveedores aprobados | Preventivo | Al dar de alta |
| Precio de mercado | Cotización mínima 3 proveedores | Preventivo | Por compra |
| Recepción incorrecta | Contra-recibo con verificación | Detectivo | Por entrega |

### Proceso: Ventas / Facturación
| Riesgo | Control | Tipo | Frecuencia |
|---|---|---|---|
| CFDI incorrecto | Validación automática pre-emisión | Preventivo | Por factura |
| Cliente sin crédito | Límite de crédito en ERP | Preventivo | Por pedido |
| Devolución sin autorización | Flujo de aprobación en sistema | Preventivo | Por devolución |
| Descuento excesivo | Límite de descuento por rol | Preventivo | Por pedido |

### Proceso: Inventarios
| Riesgo | Control | Tipo | Frecuencia |
|---|---|---|---|
| Merma no detectada | Conteo cíclico programado | Detectivo | Semanal/mensual |
| Obsolescencia | Reporte de rotación por SKU | Detectivo | Mensual |
| Robo hormiga | Control de acceso físico + cámeras | Preventivo | Continuo |
| Error de captura | Validación de cantidades en sistema | Preventivo | Por transacción |

## Puntos de Control COSO en The Foundation

Durante The Foundation, Evangelista evalúa la **madurez de controles** en 4 niveles:

1. **Inexistente (0):** No hay controles documentados ni aplicados
2. **Informal (1):** Controles existen pero no están documentados, dependen de personas
3. **Definido (2):** Controles documentados en políticas o procedimientos
4. **Monitoreado (3):** Controles medidos, con evidencia y mejora continua

**Objetivo de Architecture:** llevar procesos críticos de nivel 1-2 a nivel 3.
