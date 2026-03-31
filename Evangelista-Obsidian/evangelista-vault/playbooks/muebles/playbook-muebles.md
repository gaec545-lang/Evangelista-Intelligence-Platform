---
id: "EVK-PLAY-004"
title: "Playbook Muebles y Talleres — Costeo Real y Eficiencia de Taller"
type: playbook
version: "1.0"
domain: ["operations", "manufacturing", "wood-industry"]
sector: ["manufactura", "muebles"]
agent_access: [financial, process]
confidence: high
source: evangelista-methodology
last_validated: 2026-03-30
parent: ""
related: ["lean-manufacturing-vsm", "patron-reprocesos"]
depends_on: []
tags: ["muebles", "taller", "costeo-real", "bom-accuracy"]
status: active
last_ingested: null
chunk_count: null
---

# Playbook Muebles y Talleres — Costeo Real y Eficiencia de Taller

## Perfil del Cliente Típico (Evangelista Target)
- **Tamaño**: 1 a 3 talleres/plantas pequeñas.
- **Operación**: Producción bajo pedido (Make-to-Order) o series cortas de diseño.
- **Sistema**: Sin ERP formal; control basado en Excel y libretas de taller.
- **Factor Γ (Vibración)**: 1.2 - 1.8 (Baja complejidad técnica, alta dependencia del juicio humano/maestro artesano).

## El "Dolor" Principal
"No sé cuánto me cuesta realmente producir cada pieza. Al final del mes hay dinero, pero no sé si gané en la silla Luis XV o si la mesa de comedor se llevó toda la utilidad."

## Hallazgos Frecuentes en Auditoría Foundation

### 1. Pricing por "Feeling" (Intuición)
- **Definición**: El dueño asigna precios basados en lo que hace la competencia o en un cálculo "mental" de materiales.
- **Hallazgo**: Omisión del costo de mano de obra indirecta, depreciación de maquinaria y mermas de madera (aserrín/recortes).

### 2. Bajo Rendimiento de Insumos Críticos
- **Definición**: La materia prima (madera de encino, nogal, etc.) se compra en pies tabla, pero no se rastrea cuántos muebles terminados salen de cada lote.
- **Impacto**: Desperdicios de hasta el 40% en cortes mal optimizados.

### 3. Tiempos de Producción Fantasma
- **Definición**: No existe registro de cuánto tiempo pasa un mueble en Carpintería vs Barnizado.
- **Resultado**: Cuellos de botella ocultos que retrasan entregas y aumentan el costo por hora hombre.

## Plan de Acción Architecture

### Fase 1: Estandarización de BOM
El Agente `process` debe crear una receta técnica por modelo, incluyendo:
- Metros lineales de madera (con factor de desperdicio del 15%).
- Horas hombre promedio por proceso.
- Consumibles (herrajes, lacas, lijas).

### Fase 2: Control de Piso (Sentinel Light)
Implementar una bitácora digital simple (Tablet en taller) para registrar el inicio y fin de cada etapa de fabricación por pedido.

## KPIs Críticos para el Dashboard
1. **Margen de Contribución Real**: `Precio Venta - (Materiales Reales + Mano de Obra Real)`.
2. **Eficiencia de Madera**: `Volumen en Producto Terminado / Volumen Comprado`.
3. **Lead Time de Taller**: Días desde que entra el pedido hasta que sale a inspección final.

## Resumen para Agentes
En el sector mueblero, la utilidad se esconde en el **barnizado y el detallado**, que son los procesos donde más tiempo se pierde. El especialista de procesos debe implementar [[lean-manufacturing-vsm]] para visualizar el flujo de materiales y reducir el movimiento innecesario de piezas pesadas.
