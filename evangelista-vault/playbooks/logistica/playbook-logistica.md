---
id: playbook-logistica
title: "Playbook Sector Logística — Evangelista & Co."
type: playbook
agent_access: [process, financial, data_engineer]
tags: [logistica, transporte, almacen, wms, tms, cadena-suministro]
sector: [logistica]
dominios: [procesos, datos, kpis]
version: "1.0"
author: evangelista
---

# Playbook Sector Logística

## Perfil Típico del Cliente Logístico

**Características comunes:**
- Operador logístico o empresa con flota propia de 10-80 unidades
- WMS (Warehouse Management System) básico o en Excel
- Múltiples clientes con SLAs contractuales distintos
- Dependencia de datos en tiempo real para compromisos de entrega
- Alta presión por costos (combustible, mano de obra, fletes foráneos)

**Síntomas críticos:**
- "No sabemos en tiempo real dónde están nuestras unidades"
- "Los reportes de cumplimiento de entrega los armamos el día siguiente"
- "Tenemos muchos sistemas (TMS, WMS, ERP) que no hablan entre sí"
- "Los clientes nos reclaman por entregas tardías pero nosotros no tenemos los datos para defendernos"

## Hallazgos Frecuentes en Foundation Logística

### 1. Islas de Información (Silos)
**Manifestación:** TMS, WMS y ERP son sistemas separados sin integración. La información se consolida manualmente en Excel.
**Impacto:** Latencia de datos de 24-48 horas, imposibilidad de tomar decisiones operativas en tiempo real.
**Costo estimado:** 2-4 horas/día de analista a $300/hora = $180K-$360K MXN/año solo en conciliación manual.

### 2. KPIs de Entrega sin Baseline
**Manifestación:** La empresa dice tener "95% de cumplimiento de entrega" pero no puede demostrarlo con datos porque no hay definición unificada de "a tiempo".
**Implicación:** Contratos con clientes en riesgo, posibles penalizaciones no cuantificadas.

### 3. Costeo de Ruta Incorrecto
**Manifestación:** Se cobra el flete basado en tarifa histórica o "experiencia", no en costo real por kilómetro + tiempo + carga.
**Impacto:** Rutas que pierden dinero sin saberlo. En logística regional, 20-30% de rutas son deficitarias.

### 4. Mantenimiento Reactivo de Flota
**Manifestación:** Las unidades se llevan a taller cuando fallan, no por plan preventivo basado en datos.
**Costo:** Paro no planeado de unidad = $8,000-$25,000 MXN/día (flete perdido + multas + reparación emergencia vs. preventivo).

## KPIs Clave Sector Logístico

| KPI | Fórmula | Meta | Frecuencia |
|---|---|---|---|
| OTIF (On Time In Full) | Entregas completas y a tiempo / Total entregas | > 95% | Diario |
| Costo por km | Costo total operación / Km recorridos | Benchmark regional | Mensual |
| Utilización de flota | Horas operativas / Horas disponibles | > 80% | Semanal |
| Tiempo de carga/descarga | Minutos reales vs. estándar | < 110% del estándar | Por operación |
| Fill Rate | Líneas surtidas completas / Líneas pedidas | > 98% | Diario |

## Arquitectura de Datos Recomendada

### Modelo para Operador Logístico
```
Fact_Viajes
├── dim_tiempo
├── dim_unidad (placa, tipo, capacidad, año)
├── dim_operador (nombre, licencia, antigüedad)
├── dim_cliente (nombre, zona, tipo de servicio)
├── dim_ruta (origen, destino, km, tipo de camino)
└── métricas: km_reales, horas_ruta, costo_combustible, costo_total,
            hora_salida_real, hora_llegada_real, incidencias

Fact_Almacen
├── dim_tiempo
├── dim_ubicacion (pasillo, rack, nivel)
├── dim_sku
└── métricas: entradas, salidas, tiempo_en_almacen, picking_time
```

### Integración de Fuentes
- **GPS/Telemática** → Posición en tiempo real, velocidad, paradas
- **TMS** → Manifiestos, rutas planeadas, documentación
- **WMS** → Inventario, picking, despacho
- **Taller** → Mantenimientos, costos de reparación

## Factor Γ Típico en Logística

Un operador logístico con 3 bodegas regionales y 2 ERPs (uno para operaciones, otro contable) tendría:
- Γ = 1 + (0.5 × 3) + (0.2 × 2) = **2.9**
- Foundation Fee estimado: $35,000 × (1 + α + β) con Γ = 2.9

Esto justifica un Foundation de 10-12 semanas por la complejidad de integración.
