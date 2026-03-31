---
id: "EVK-CASE-007"
title: "Caso Muebles Artesanales MX — Manufactura de Lujo Digitalización"
type: case
version: "1.0"
domain: ["craftsmanship", "costing", "process-automation"]
sector: ["muebles", "manufactura-artesanal"]
agent_access: [all]
confidence: high
source: evangelista
last_validated: 2026-03-30
parent: ""
related: ["lean-manufacturing-vsm", "foundation-pricing"]
depends_on: []
tags: ["no-erp", "excel-dependency", "costeo-feeling", "e-commerce"]
status: active
last_ingested: null
chunk_count: null
---

# Caso Muebles Artesanales MX — Manufactura de Lujo Digitalización

## Perfil del Cliente

| Dato | Valor |
|------|-------|
| **Empresa** | Muebles Artesanales de México S.C. |
| **Sector** | Manufactura de Muebles Finos / Carpintería de Autor |
| **Plantas / Sucursales** | 1 Taller + 1 Showroom + Canal E-commerce |
| **ERP** | Ninguno (Gestión basada 100% en Excel) |
| **Facturación aprox.** | $18,000,000 MXN / año |
| **Empleados** | 12 Artesanos + 3 Administrativos |
| **Sponsor** | Dueño y Diseñador Principal |
| **Factor Γ** | 1.4 |

## Nodo Crítico Identificado

El "Techo de la Intuición". El dueño de Muebles Artesanales MX cobraba sus piezas de lujo basándose en un "feeling" de mercado y no en un cálculo de costo real de materiales y mano de obra experta. Si bien el negocio sobrevivía, el dueño estaba atrapado en la operación táctica (revisando tablas, contestando correos) el 40% de su tiempo, lo que impedía el crecimiento del canal e-commerce. El Factor Γ de 1.4 reflejaba una estructura simple pero altamente dependiente de la persona del fundador, creando un cuello de botella sistémico.

## Hallazgos del Dictamen Forense

### Hallazgo H-01 — Costeo de Materiales Inconsistente
**Descripción técnica:**
Análisis de órdenes de trabajo pasadas vs. facturas de proveedores de madera preciosa (Parota y Cedro). Se descubrió que el rendimiento del material por pieza variaba hasta en un 30% entre artesanos, sin que existiera un estándar de corte o aprovechamiento de retazos. El costo real de una mesa de comedor, una vez sumados los pegamentos y acabados, era un 15% mayor al estimado en el Excel de ventas.

**Impacto financiero:**
- Erosión de margen bruto: **$420,000 MXN/año**.
- Causa raíz: Ausencia de una ficha técnica (BOM) estandarizada por producto.

### Hallazgo H-02 — Desperdicio de Potencial Administrativo
**Descripción técnica:**
*Time-Tracking* del Director General durante 2 semanas. Se cuantificaron 22 horas semanales en tareas de "copiar y pegar" datos de ventas de Shopify a Excel para facturación y seguimiento de envíos.

**Impacto financiero:**
- Costo de ineficiencia (Value of Time): **$360,000 MXN/año** (basado en el costo alternativo de diseño y ventas).
- Causa raíz: Falta de integración API entre la plataforma de e-commerce y el sistema administrativo.

## Resumen Financiero

| Hallazgo | Costo Anual ($MXN) | % del Total |
|----------|-------------------|-------------|
| H-01: Inconsistencia en Costeo Material | $420,000 | 53.8% |
| H-02: Tiempo del Dueño en Tareas Manuales | $360,000 | 46.2% |
| **Total** | **$780,000** | **100%** |

## Propuesta Architecture

| Indicador | Valor |
|-----------|-------|
| Factor Γ | 1.4 |
| Setup Fee (sin IVA) | $252,000 MXN |
| Success Fee (estimado) | $120,000 MXN |
| Total Architecture (sin IVA) | $372,000 MXN |
| Total con IVA (16%) | $431,520 MXN |
| **ROI proyectado** | **210%** |
| Punto de equilibrio | 6.5 meses |
| Timeline | 10 semanas |

## Estado y Resultados

Se implementó el protocolo [[lean-manufacturing-vsm]] para simplificar el flujo de trabajo en el taller. Se configuró un tablero en Sentinel que integra las ventas de Shopify automáticamente con un sistema modular de costeo real. A los 3 meses, el dueño recuperó 15 horas semanales de tiempo estratégico, lo que le permitió lanzar una nueva línea de productos que incrementó la facturación del e-commerce en un 18%. El proyecto demostró que incluso con un Factor Γ bajo, la digitalización de la "intuición" genera retornos financieros inmediatos.
