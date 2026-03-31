---
id: "EVK-PLAY-003"
title: "Playbook Ferretería — Gestión de Inventario Masivo y Rotación"
type: playbook
version: "1.0"
domain: ["retail", "inventory", "hardware-store"]
sector: ["retail", "ferretería"]
agent_access: [financial, process, data_eng]
confidence: high
source: evangelista-methodology
last_validated: 2026-03-30
parent: ""
related: ["star-schema-ventas", "star-schema-inventario", "patron-inventario-fantasma"]
depends_on: []
tags: ["ferretería", "gmroi", "dead-stock", "puebla"]
status: active
last_ingested: null
chunk_count: null
---

# Playbook Ferretería — Gestión de Inventario Masivo y Rotación

## Perfil del Cliente Típico (Evangelista Target)
- **Tamaño**: 3 a 10 sucursales (PyME en crecimiento).
- **Catálogo**: 8,000 a 25,000 SKUs activos.
- **Sistema**: POS local (Microsip/Softbit) + CONTPAQi Contabilidad.
- **Factor Γ (Vibración)**: 2.5 - 4.0 (Alta complejidad operativa por volumen de piezas pequeñas).

## El "Dolor" Principal
"Tenemos mucho dinero invertido en mercancía, pero no tenemos lo que el cliente busca hoy y las sucursales reportan faltantes que el sistema dice que sí hay."

## Hallazgos Frecuentes en Auditoría Foundation

### 1. SKUs Zombi (Mercancía Muerta)
- **Definición**: Artículos con stock > 0 que no han tenido una sola venta en los últimos 6 meses.
- **Impacto**: Generalmente representa entre el **20% y 30% del valor total del inventario**.
- **Acción**: Liquidación forzada para liberar flujo de caja.

### 2. Margen Negativo en Productos "Gancho"
- **Definición**: Productos como cemento o varilla vendidos por debajo del costo real (incluyendo flete) bajo la premisa de "atraer clientes".
- **Fuga**: Sin un modelo dimensional, la empresa no sabe cuánto pierde realmente en el "gancho" vs cuánto gana en el "complemento" (ej. adhesivos, herramientas).

### 3. Robo Hormiga (Shrinkage)
- Concentrado en tornillería, herramienta manual pequeña y consumibles.
- **Detección**: Comparativa `OnHand` vs Conteo Cíclico Semanal en SKUs clase A.

## Modelo Dimensional y Datos (Architecture)
El Agente `data_eng` debe implementar obligatoriamente:
- [[star-schema-ventas]]: Para medir margen por categoría.
- [[star-schema-inventario]]: Para calcular la edad del inventario por sucursal.

## KPIs Críticos para el Dashboard Sentinel
1. **GMROI (Gross Margin Return on Investment)**: `(Margen Bruto / Inventario Promedio)`. Indica cuántos pesos de utilidad genera cada peso invertido en stock.
2. **Rotación por Categoría**: Identificar si Plomería rota más rápido que Iluminación.
3. **Shrinkage Rate por Sucursal**: Detectar anomalías en el control de confianza de los gerentes de tienda.

## Resumen para Agentes
La ferretería no se gana en la venta, se gana en la **compra y la rotación**. El especialista financiero debe priorizar la reducción del catálogo zombi antes de sugerir cualquier crédito para expansión.
