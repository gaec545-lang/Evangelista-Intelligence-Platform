---
id: "EVK-FOR-002"
title: "Motor de Precios Architecture — Setup Fee y Milestone Payments"
type: formula
version: "1.0"
domain: [finanzas]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [financial, analyst]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: ""
related: ["foundation-pricing", "success-fee-calc", "factor-gamma-system", "evangelista-rules", "caso-textiles-atoyac"]
depends_on: ["factor-gamma-system"]
tags: [pricing, architecture, finanzas, factor-gamma]
status: active
last_ingested: null
chunk_count: null
---

# Motor de Precios Architecture — Setup Fee y Milestone Payments

## Fórmula Principal del Setup Fee

```
P(Setup) = $180,000 MXN × Γ
```

El Setup Fee es el componente fijo del proyecto Architecture. Cubre el diseño, construcción y entrega del Data Warehouse + dashboards en Power BI + automatizaciones ETL.

## Factor Γ — Multiplicador de Complejidad

```
Γ = 1 + (0.5 × Sucursales) + (0.2 × Sistemas ERP)
```

Donde:
- **Sucursales**: Número de plantas, bodegas, sucursales o puntos de operación con datos independientes
- **Sistemas ERP**: Número de sistemas de gestión activos (SAP, CONTPAQi, sistema propio, etc.)

El Factor Γ es el multiplicador de complejidad organizacional. Ver documento completo en [[factor-gamma-system]].

### Tabla de referencia Γ

| Perfil de empresa | Sucursales | ERPs | Γ calculado | Setup Fee |
|-------------------|------------|------|-------------|-----------|
| PyME simple (1 planta, 1 ERP) | 0 | 1 | 1.2 | $216,000 MXN |
| PyME con bodega central | 1 | 1 | 1.7 | $306,000 MXN |
| Empresa mediana (2 plantas) | 2 | 1 | 2.2 | $396,000 MXN |
| Multi-planta (3 plantas, 1 ERP) | 3 | 1 | 2.7 | **$486,000 MXN** ← Caso Atoyac |
| Compleja (3 plantas, 2 ERPs) | 3 | 2 | 2.9 | $522,000 MXN |
| Protocolo Omega (Γ > 3.0) | 4+ | 2+ | > 3.0 | Cotización especial |

## Estructura de Pagos

### Modalidad Estándar: 70/30

```
Tramo A (70%) — Al firmar el Contrato Maestro
Tramo B (30%) — Al entregar y firmar el Delivery Handshake
```

**Ejemplo Textiles Atoyac (Γ = 2.7, Setup = $486,000 MXN):**

| Tramo | Porcentaje | Monto sin IVA | IVA (16%) | Total con IVA |
|-------|------------|---------------|-----------|---------------|
| Tramo A | 70% | $340,200 MXN | $54,432 MXN | $394,632 MXN |
| Tramo B | 30% | $145,800 MXN | $23,328 MXN | $169,128 MXN |
| **Total** | **100%** | **$486,000 MXN** | **$77,760 MXN** | **$563,760 MXN** |

### Modalidad Alternativa: Milestone Payment 60/40

```
Tramo A (60%) — Al firmar
Tramo B (40%) — Al entregar módulo X (hito acordado)
```

> [!WARNING] Milestone Payment es herramienta de cierre de último recurso
> El Milestone Payment (60/40) solo se ofrece cuando el cliente tiene restricción real de flujo de caja y el CEO tiene alta certeza de cierre. **Nunca se ofrece proactivamente**. Ofrecerlo sin que el cliente lo solicite devalúa el producto y señala inseguridad comercial.

## Tiempos de Entrega por Γ

| Rango de Γ | Semanas de implementación | Descripción |
|------------|--------------------------|-------------|
| 1.0 – 1.5 | 6 – 7 semanas | Empresa simple, 1 planta, datos ordenados |
| 1.5 – 2.0 | 7 – 9 semanas | 1-2 plantas, datos mixtos |
| 2.0 – 3.0 | 9 – 12 semanas | Multi-planta, integraciones múltiples |
| > 3.0 | Protocolo Omega | Requiere evaluación especial y contrato customizado |

### Protocolo Omega (Γ > 3.0)

Cuando el Factor Γ supera 3.0, el proyecto sale del alcance estándar de Architecture. El CEO activa el Protocolo Omega que incluye:
1. Extensión de Foundation a 15 días hábiles (en lugar de 10)
2. Reunión adicional de Scoping con CTO presente
3. Cotización customizada con desglose por módulo
4. Contrato con cláusulas de cambio de alcance (change order protocol)
5. Timeline negociado semana a semana con hitos parciales

## Componentes incluidos en el Setup Fee

| Componente | Descripción |
|------------|-------------|
| **Data Warehouse** | SQL Server con modelo dimensional (Fact + Dimension tables) |
| **ETL Automatizado** | Scripts de extracción, transformación y carga desde ERP(s) |
| **Power BI Service** | Dashboards operativos y ejecutivos publicados en la nube |
| **Documentación** | Manual técnico del DW + guía de usuario de Power BI |
| **Capacitación** | 4 horas de entrenamiento al equipo operativo del cliente |
| **QA Testing** | Validación de datos vs. ERP fuente (protocolo ALCOA+) |

## Comunicación del Precio al Cliente

El CEO presenta el precio en Cita 4 después de mostrar el ROI y el modelo financiero. La secuencia es:

1. Mostrar el ROI (ejemplo: 213% a 12 meses)
2. Mostrar el punto de equilibrio (ejemplo: ~4 meses)
3. Presentar el Setup Fee en el contexto del ahorro generado:

> "La inversión es de $486,000 MXN más IVA. El sistema detectó un ahorro potencial de $3.16M MXN anuales. El ROI es 213% en 12 meses y usted recupera la inversión en aproximadamente 4 meses. ¿Cuándo quieren empezar?"

La cifra de Γ y la fórmula completa **nunca se comparten** con el cliente (Regla G-06).
