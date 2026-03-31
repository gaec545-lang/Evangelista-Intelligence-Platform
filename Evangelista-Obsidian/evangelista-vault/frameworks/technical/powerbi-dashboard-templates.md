---
id: "EVK-TECH-007"
title: "Dashboard Templates — Estructura Visual Evangelista"
type: technical-framework
version: "1.0"
domain: ["ui-ux", "power-bi", "dashboard-design"]
sector: ["general"]
agent_access: [data_eng, analyst]
confidence: high
source: evangelista-architecture
last_validated: 2026-03-30
parent: ""
related: ["powerbi-dax-patterns", "star-schema-ventas"]
depends_on: []
tags: ["visual-design", "dashboard-layouts", "ux", "mexico"]
status: active
last_ingested: null
chunk_count: null
---

# Dashboard Templates — Estructura Visual Evangelista

## Introducción
El impacto de un dictamen forense de Evangelista depende de su legibilidad. El diseño visual debe ser premium, profesional y orientado a la acción inmediata.

## Paleta de Colores EIP (Standard)
- **Primario**: `#002B5B` (Azul Profundo - Confianza)
- **Secundario**: `#2D8CFF` (Azul Brillante - Interactividad)
- **Alerta**: `#E63946` (Rojo - Urgente)
- **Éxito**: `#2A9D8F` (Verde - Meta cumplida)
- **Fondo**: `#F8F9FA` (Gris Neutro)

## Los 3 Tableros Obligatorios

### 1. El Tablero Gerencial (The Pulse)
- **Target**: Dueño / DG.
- **Layout**: 4 Cards superiores (Venta Mes, Margen %, Merma %, Cash in Hand).
- **Gráfico**: Tendencia de venta YoY (Año contra Año).
- **Insight**: "Semáforo General de Salud del Negocio".

### 2. El Tablero Operativo (The Radar)
- **Target**: Gerente de Planta / Operaciones.
- **Layout**: Mapa de Sucursales, Tabla de SKUs con mayor desvío de costo.
- **Gráfico**: OEE por línea de producción.
- **Insight**: "Dónde están las fugas hoy mismo".

### 3. El Tablero Financiero (The Blueprint)
- **Target**: CFO / Contador.
- **Layout**: P&L simplificado, Comparativo Presupuesto vs Real.
- **Gráfico**: Proyección de flujo de caja (Cash Flow Forecast).
- **Insight**: "Cuánto dinero tendremos a fin de mes".

## Reglas de UX para Evangelista
1. **Never More than 5 Slicers**: Demasiados filtros confunden al usuario.
2. **The 3-Second Rule**: El usuario debe entender el problema principal de la página en menos de 3 segundos.
3. **Drill-Through Mandatory**: Cada gráfico debe permitir ver el detalle de los datos origen al hacer clic derecho.

## Resumen para Agentes
Un dashboard de Evangelista no es un dibujo; es una herramienta de mando. El Ágente `analyst` debe asegurar que los colores de alerta coincidan con los umbrales definidos en el [[powerbi-dax-patterns]].
