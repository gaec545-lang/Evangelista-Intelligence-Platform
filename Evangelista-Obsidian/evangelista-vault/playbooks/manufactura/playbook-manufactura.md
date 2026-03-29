---
id: "EVK-PLAY-001"
title: "Playbook Manufactura — Guía de Engagement para el Sector"
type: playbook
version: "1.0"
domain: [procesos, finanzas, produccion]
sector: [manufactura]
agent_access: [analyst, pm, process, financial, all]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: ""
related: ["playbook-textiles", "factor-gamma-system", "dmaic-define", "evangelista-rules"]
depends_on: []
tags: [manufactura, foundation, architecture, procesos, inventarios]
status: active
last_ingested: null
chunk_count: null
---

# Playbook Manufactura — Guía de Engagement para el Sector

## Perfil del Cliente Típico

| Atributo | Rango / Descripción |
|----------|---------------------|
| **Facturación** | $10M – $100M MXN anuales |
| **Empleados** | 50 – 500 personas |
| **ERP más común** | SAP Business One, CONTPAQi, Aspel, sistema propio |
| **Plantas** | 1 – 3 plantas o puntos de producción |
| **Factor Γ típico** | 1.5 – 2.5 |
| **Sponsor más frecuente** | Dueño (generación 1 o 2), Director General, Director de Operaciones |
| **Madurez digital** | Media-baja (ERP implementado pero subutilizado) |

## Los 2 Dolores Principales del Sector

### Dolor 1: "No sabemos cuánto nos cuesta producir cada unidad"

Este es el dolor más común en manufactura y suele manifestarse como:
- Contradicción entre el costo estándar en el ERP y el costo real al final del mes
- Gerentes de producción que "saben" que los números de costos son incorrectos pero no pueden probarlo
- Decisiones de precio de venta basadas en costos desactualizados (con meses de atraso)

**Hallazgos típicos que Foundation encuentra:**
- Materias primas registradas a costo de compra histórico (no revaluadas por inflación)
- Merma de producción no rastreada sistemáticamente (va a pérdidas generales)
- Tiempo de máquina y mano de obra no asignados correctamente a cada orden de producción
- Desperdicios y rechazos de calidad no contabilizados como costo de producción

### Dolor 2: "El inventario del sistema nunca cuadra con el físico"

Manifestaciones típicas:
- El conteo físico mensual (o semestral) siempre encuentra diferencias vs. el sistema
- Compras de emergencia de materiales que "en teoría" hay en stock
- Inventario de producto terminado que no concuerda con producción registrada

**Hallazgos típicos:**
- Ingresos de almacén sin orden de compra vinculada
- Salidas de producción no registradas al momento (se registran días después)
- Material en proceso (WIP) contabilizado como materia prima o como terminado erróneamente

## Nodos Críticos Más Frecuentes en Manufactura

| Nodo Crítico | Frecuencia | Ahorro Típico |
|--------------|------------|---------------|
| Inventarios (materia prima) | 65% de los casos | $500K – $2M MXN/año |
| Costos de producción | 50% de los casos | $800K – $3M MXN/año |
| Control de merma | 40% de los casos | $300K – $1.5M MXN/año |
| Cartera de clientes | 25% de los casos | $400K – $1.2M MXN/año |

*Nota: Los porcentajes suman > 100% porque un cliente puede tener múltiples nodos problemáticos. Foundation identifica el más crítico y Architecture lo resuelve.*

## KPIs Recomendados para el Sector

### KPIs Operativos

| KPI | Definición | Fuente de Datos |
|-----|------------|-----------------|
| **OEE** (Overall Equipment Effectiveness) | Disponibilidad × Rendimiento × Calidad | ERP + sistema de producción |
| **Costo unitario real vs. estándar** | Desviación entre costo estimado y costo real por SKU | ERP costos |
| **Días de inventario** | (Inventario Promedio / Costo de Ventas) × 365 | ERP inventarios + contabilidad |
| **Tasa de merma** | (Material consumido − Producto terminado) / Material consumido | ERP producción |
| **Tasa de rechazo de calidad** | Unidades rechazadas / Unidades producidas | Sistema QA o ERP |

### KPIs Financieros

| KPI | Definición |
|-----|------------|
| **Margen bruto real** | (Ventas − Costo de Ventas Real) / Ventas |
| **Rotación de inventario** | Costo de Ventas / Inventario Promedio |
| **Ciclo de conversión de efectivo** | Días de Inventario + Días por Cobrar − Días por Pagar |

## Secuencia de Engagement Adaptada a Manufactura

### Cita 1 — Scoping (en planta, si es posible)

- Pedir recorrido por la planta al inicio. Ver el proceso físico ayuda a hacer mejores preguntas.
- Preguntar: "¿Cuándo fue la última vez que el inventario del sistema coincidió exactamente con el físico?" → La respuesta revela la severidad del problema.
- Preguntar: "¿Cuánto creen que pierden en merma mensualmente?" → El cliente normalmente subestima. La diferencia entre su estimado y el número real de Foundation es el argumento de venta más poderoso.
- Calcular Factor Γ en el acto (discretamente, sin mostrar la calculadora): ¿cuántas plantas? ¿cuántos ERPs?

### Cita 2 — Análisis en Planta (Fase A completa antes)

- Llegar con el pre-análisis ya hecho (Fase A: análisis remoto 48h antes)
- Observar el proceso de recepción de almacén en vivo
- Verificar si el almacenista registra en el sistema en el momento o al final del turno (fuente común de retrasos)
- Pedir el último conteo físico y compararlo con el sistema en ese momento → si hay diferencia visible, ese es el hallazgo en tiempo real

### Cita 3 — Dictamen Forense

- El hallazgo de mayor impacto visual para manufactura: tabla comparativa de costos reales vs. estándar por producto
- Mostrar el costo de merma no rastreada en pesos acumulados (18 meses)
- No usar términos como "pérdidas" o "errores" — usar "oportunidades de recuperación" y "costos ocultos"

### Cita 4 — Propuesta Architecture

- El DG de manufactura quiere ver: ROI, punto de equilibrio, y qué van a ver diferente en sus reportes
- Mostrar un mock-up del dashboard de costos de producción vs. estándar
- El Timeline importa: "¿Cuándo estaría listo?" → según Γ, comunicar la ventana de semanas

## Objeciones Frecuentes en Manufactura

| Objeción | Respuesta |
|----------|-----------|
| "Ya tenemos SAP, debería de darnos esos reportes" | "SAP tiene la capacidad técnica, pero necesita que los procesos de captura sean correctos y consistentes. Lo que nosotros hacemos es construir la capa de inteligencia que SAP no construyó solo." |
| "Mi contador ya me da reportes" | "Los reportes contables miden el pasado. Lo que construimos mide el presente y alerta el futuro. Son complementarios, no competidores." |
| "No tenemos presupuesto ahora" | Ver [[objection-price]] |

## Referencias

- **[[caso-textiles-atoyac]]**: Caso de manufactura textil con Factor Γ = 2.7. Referencia principal para propuestas multi-planta.
- **[[factor-gamma-system]]**: Cálculo completo del Factor Γ para manufactura.
- **[[dmaic-define]]**: Framework para definir el problema en términos medibles con el cliente de manufactura.
