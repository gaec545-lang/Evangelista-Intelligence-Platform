---
id: "EVK-CASE-010"
title: "Adaptación Columbia — Optimización de Inventario Multi-Sucursal"
type: case
version: "1.0"
domain: ["inventory", "supply-chain", "logistics"]
sector: ["retail", "distribucion"]
agent_access: [all]
confidence: high
source: academic-columbia
last_validated: 2026-03-30
parent: ""
related: ["abc-analysis-protocol", "logistics-route-optimization"]
depends_on: []
tags: ["columbia-adapted", "inventory-optimization", "eoq", "safety-stock"]
status: active
last_ingested: null
chunk_count: null
---

# Adaptación Columbia — Optimización de Inventario Multi-Sucursal

## Contexto del Caso Original (Columbia University)

El caso de estudio de Columbia Business School se centra en los modelos matemáticos de optimización de inventarios: **EOQ (Economic Order Quantity)**, inventario de seguridad y análisis ABC. El objetivo es minimizar el costo total que incluye el costo de ordenar y el costo de mantener inventario.

## Adaptación al Contexto PyME Mexicana

Para una PyME en México con múltiples sucursales (ej. farmacias locales o ferreterías), el problema no es solo cuánto pedir, sino *dónde tenerlo*. La transferencia de mercancía entre sucursales suele hacerse de manera informal ("pásame 10 piezas que me faltan"), generando un caos contable y costos de logística innecesarios ("jineteo de stock").

### Escenario Adaptado: Distribuidora de Pinturas con 6 Sucursales
- **Suelo:** Inventario total de $15M MXN.
- **Problema:** Agotamiento de existencias en sucursal A (Venta perdida) mientras sucursal B tiene excedente del mismo producto (Capital atrapado).
- **Fallas detectadas por Evangelista:** Falta de una "Torre de Control" central que vea el inventario como un solo ente.

## Hallazgos con Enfoque Evangelista

### Hallazgo H-01 — Capital Inmovilizado por Stock de Seguridad Estático
**Descripción técnica:**
Aplicación de modelos de Columbia sobre el historial de ventas. Se detectó que el "mínimo y máximo" estaban configurados igual para todas las sucursales, sin considerar la desviación estándar de la demanda por zona geográfica.

**Impacto financiero:**
- Excedente de inventario innecesario: **$2,400,000 MXN**.
- Causa raíz: Falta de granularidad en la configuración del ERP.

### Hallazgo H-02 — El Costo Oculto de la Transferencia Informal
**Descripción técnica:**
Auditoría de vales de traspaso. Se detectó que el tiempo de personal y combustible dedicado a mover mercancía entre sucursales "de emergencia" sumaba más de 40 horas al mes.

**Impacto financiero:**
- Gasto logístico ineficiente: **$120,000 MXN/año**.
- Causa raíz: Planeación de distribución reactiva.

## Solución Basada en Architecture

Implementación del módulo de **Torre de Control de Inventarios** en Sentinel:
1. **Clasificación ABC Dinámica:** Re-clasificación mensual de productos basada en margen y rotación, no solo en volumen de venta.
2. **Reabastecimiento Centralizado:** Architecture genera órdenes de compra consolidadas para el almacén central y planes de distribución optimizados para las sucursales.
3. **Stock de Seguridad Basado en Probabilidad:** El sistema calcula el inventario de seguridad necesario para garantizar un nivel de servicio del 95% usando los modelos estocásticos de Columbia adaptados al lead time real del proveedor mexicano.

## Lecciones para los Agentes Especialistas

- **Para Data Engineer:** Implementar el [[abc-analysis-protocol]] de forma automática cada 30 días.
- **Para Financial Specialist:** El ROI del proyecto se paga solo con la liberación del capital atrapado en el exceso de inventario de baja rotación.
- **Argumento de Venta:** "No compre más inventario para vender más; mueva mejor el que ya tiene para que su dinero trabaje más rápido".
