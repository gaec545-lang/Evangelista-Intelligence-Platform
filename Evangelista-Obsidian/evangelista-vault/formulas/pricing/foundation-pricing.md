---
id: "EVK-FOR-001"
title: "Motor de Precios Foundation — Fórmula Algorítmica"
type: formula
version: "1.0"
domain: [finanzas]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [financial, analyst]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: ""
related: ["architecture-pricing", "success-fee-calc", "factor-gamma-system", "evangelista-rules"]
depends_on: ["factor-gamma-system"]
tags: [pricing, foundation, finanzas, factor-gamma]
status: active
last_ingested: null
chunk_count: null
---

# Motor de Precios Foundation — Fórmula Algorítmica

## Fórmula Principal

```
P(Foundation) = $35,000 MXN × (1 + αVol + βCaos) + Viáticos + Fuentes Adicionales
```

Esta fórmula es el resultado del Motor de Precios Evangelista. El precio de Foundation **no es negociable ni ajustable por criterio comercial**. Es el output de un algoritmo que el cliente no ve (Regla G-06).

## Variables de la Fórmula

### Precio Base: $35,000 MXN

Cubre:
- Hasta **2 fuentes de datos estándar** (ej. SAP + Excel de producción)
- **1 nodo crítico** de análisis (ej. inventarios)
- Análisis remoto 48h (Fase A) + visita presencial 1 día (Cita 2)
- Dictamen Forense con hasta 5 hallazgos
- Certificado ALCOA+ firmado por CFO/CQA

### Factor α — Volumen de Datos

```
α = log₁₀(Registros Totales) - 4
```

| Registros Totales | α calculado | Incremento sobre base |
|-------------------|-------------|----------------------|
| 10,000 | 0.0 | 0% |
| 100,000 | 1.0 | +10% sobre base |
| 500,000 | 1.7 | +17% sobre base |
| 1,000,000 | 2.0 | +20% sobre base (máx.) |
| > 10,000,000 | 3.0 → cap en 2.5 | +25% sobre base |

El factor α tiene un **techo de 0.25** (25% máximo) para evitar que empresas grandes paguen de forma desproporcionada en Foundation — el precio real de proyectos grandes se captura en [[architecture-pricing]] via el Factor Γ.

### Factor β — Entropía (Nivel de Desorden)

```
β = Σ(F_manual × 0.2 + F_roto × 0.5) / N_fuentes
```

Donde:
- **F_manual**: Número de fuentes que son Excel, CSV manual, o registros en papel
- **F_roto**: Número de fuentes con integridad referencial rota o sin clave primaria definida
- **N_fuentes**: Total de fuentes de datos analizadas

| Rango β | Descripción | Incremento |
|---------|-------------|------------|
| 0.0 - 0.2 | Entorno digital ordenado (ERP bien configurado) | 0% |
| 0.2 - 0.4 | Mezcla ERP + Excel, algunos problemas | +10-20% |
| 0.4 - 0.6 | Caos moderado — múltiples fuentes manuales | +25-40% |
| 0.6 - 0.7 | Caos severo — casi todo manual o roto | +45-50% |
| > 0.7 | **Proyecto inviable** — Foundation no puede completarse | Ver nota |

> [!WARNING] Si β > 0.7
> El proyecto es técnicamente inviable en los plazos estándar de Foundation. El CEO debe comunicar al cliente que se requiere primero un proceso de "Data Rescue" con cotización especial, o declinar el proyecto (Vetting Gate → No-Go).

### Viáticos

| Ubicación del cliente | Viáticos |
|----------------------|----------|
| Zona Metropolitana Puebla | $0 MXN |
| Fuera de Puebla (CDMX, Tlaxcala, etc.) | +$8,000 MXN fijos |
| Viaje de más de 4 horas | Cotización especial |

### Fuentes de Datos Adicionales

Si el proyecto requiere más de 2 fuentes en el nodo crítico:

```
Costo por fuente adicional = +$5,000 MXN por fuente
```

Ejemplo: Foundation con 4 fuentes de datos = $35,000 + ($5,000 × 2) = $45,000 base antes de α y β.

## Ejemplo de Cálculo — Textiles Atoyac

```
Datos de entrada:
- Registros totales: ~200,000 movimientos de inventario en 18 meses
- Fuentes: SAP B1 + Sistema Legacy de etiquetado (2 fuentes = sin cargo extra)
- F_manual = 0 (sin Excel), F_roto = 1 (Legacy sin clave primaria limpia)
- Ubicación: San Martín Texmelucan (zona Puebla, sin viáticos)

Cálculo:
α = log₁₀(200,000) - 4 = 5.3 - 4 = 1.3 → cap 0.25 → α = 0.25 → incremento 8.75%
β = (0 × 0.2 + 1 × 0.5) / 2 = 0.25 → incremento 12.5%

P(Foundation) = $35,000 × (1 + 0.0875 + 0.125) + $0 + $0
P(Foundation) = $35,000 × 1.2125
P(Foundation) = $42,437.50 MXN

→ Redondeado a tarifa estándar: $42,000 MXN + IVA
```

## Regla de SoD (Segregación de Funciones)

> [!CRITICAL] Regla G-06 — El CEO no ajusta precios
> El precio es el output del algoritmo. El CEO **no puede modificarlo** por criterio comercial, empatía con el cliente, o presión de cierre. Esto no es una restricción arbitraria — es una regla de Segregación de Funciones (COSO) que protege la integridad del modelo de negocio.
>
> Si el cliente pide descuento: "El precio lo calcula nuestro sistema de auditoría interna, no yo. Lo que sí puedo hacer es ajustar el alcance si el presupuesto es una restricción real."

## Versión Pública del Precio (Regla G-06)

La versión que el CEO comunica al cliente es:

> "Foundation tiene un costo base de $35,000 MXN más variables según la complejidad técnica de su operación. Una vez que hacemos el diagnóstico en Cita 1, el sistema calcula el precio exacto."

El cliente **nunca ve** la fórmula completa con α/β ni sus valores calculados.
