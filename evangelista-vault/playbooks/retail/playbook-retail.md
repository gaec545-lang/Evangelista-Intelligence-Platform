---
id: playbook-retail
title: "Playbook Sector Retail — Evangelista & Co."
type: playbook
agent_access: [process, financial, analyst]
tags: [retail, tiendas, pos, inventario, sell-out, shrinkage]
sector: [retail]
dominios: [procesos, finanzas, kpis]
version: "1.0"
author: evangelista
---

# Playbook Sector Retail

## Perfil Típico del Cliente Retail

**Características comunes:**
- 3-15 puntos de venta (tiendas físicas)
- Sistema POS desconectado del ERP o en Excel
- Inventario centralizado con lógica de reabastecimiento manual
- Alta rotación de personal en piso de ventas
- Temporalidades marcadas (Navidad, Buen Fin, regreso a clases)

**Síntomas que indican necesidad de Foundation:**
- "Nunca sabemos cuánto tenemos en cada tienda"
- "El sell-through de temporada es imposible de calcular rápido"
- "Los vendedores dicen que hay stock pero el sistema dice cero"
- "Los reportes de ventas los armamos a mano cada lunes"

## Hallazgos Frecuentes en Foundation Retail

### 1. Desconexión POS-ERP
**Manifestación:** El POS registra ventas pero no descuenta del inventario del ERP en tiempo real. Se hace una conciliación manual semanal o mensual.
**Impacto:** Inventario fantasma, sobre-compras, faltantes en tienda.
**Frecuencia:** 85% de clientes retail en Puebla/CDMX con 3+ tiendas.

### 2. Shrinkage (Merma) sin Medición
**Manifestación:** No existe un proceso formal de conteo cíclico. La diferencia de inventario se "ajusta" al final del período sin análisis de causa.
**Impacto típico:** 2-5% del costo de mercancía vendida.
**En MXN:** Para retailer con CMV=$5M/año → $100K-$250K en merma no gestionada.

### 3. Política de Reabastecimiento por Intuición
**Manifestación:** El comprador decide qué pedir basándose en "experiencia", no en datos de rotación, lead time o punto de reorden.
**Impacto:** Sobrestock en categorías de baja rotación + faltantes en bestselIers.

### 4. Ausencia de Segmentación ABC-XYZ
**Manifestación:** Todos los SKUs reciben el mismo tratamiento operativo.
**Solución Foundation:** Clasificar por valor (ABC) y variabilidad de demanda (XYZ) para priorizar controles.

## KPIs Clave Sector Retail

| KPI | Fórmula | Meta Evangelista | Frecuencia |
|---|---|---|---|
| Sell-Through | Unidades vendidas / Unidades recibidas | > 75% por temporada | Por campaña |
| Rotación de Inventario | CMV / Inventario promedio | 6-12x anual (sector) | Mensual |
| Shrinkage | (Inv. teórico - Inv. físico) / CMV | < 1.5% | Mensual |
| Disponibilidad en anaquel | SKUs con stock / Total SKUs activos | > 95% | Semanal |
| Ticket promedio | Ventas totales / Número de transacciones | Benchmark por categoría | Diario |

## Arquitectura de Datos Recomendada (Architecture)

### Modelo Dimensional Retail
```
Fact_Ventas
├── dim_tiempo (día, semana, mes, temporada)
├── dim_tienda (nombre, zona, m², formato)
├── dim_producto (SKU, categoría, marca, precio)
└── métricas: unidades, importe, costo, margen

Fact_Inventario
├── dim_tiempo
├── dim_tienda
├── dim_producto
└── métricas: stock_inicial, entradas, salidas, ajustes, stock_final

Fact_Reabastecimiento
├── dim_tiempo
├── dim_tienda
├── dim_producto
└── métricas: punto_reorden, cantidad_pedido, lead_time_real
```

## Objeciones Frecuentes en Retail

**"Ya tenemos un sistema de reportes del POS"**
→ "¿Ese sistema les dice qué tiendas tienen el mejor margen por metro cuadrado? ¿O cuáles SKUs tienen 6 meses sin movimiento en una sola tienda mientras se agotan en las demás?"

**"El Foundation es muy caro para nuestro sector"**
→ Calcular CoI con shrinkage + sobrestock. Un retailer con $10M en ventas que reduce shrinkage de 4% a 1.5% ahorra $250K/año. El Foundation se paga en 4 meses.
