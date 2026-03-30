---
id: playbook-construccion
title: "Playbook Sector Construcción — Evangelista & Co."
type: playbook
agent_access: [process, financial, data_engineer]
tags: [construccion, obra, proyectos, presupuesto, avance-obra, mro]
sector: [construccion]
dominios: [procesos, finanzas, datos]
version: "1.0"
author: evangelista
---

# Playbook Sector Construcción

## Perfil Típico del Cliente Constructor

**Características comunes:**
- Constructora o desarrolladora con 2-15 proyectos simultáneos
- Control de obras en Excel o sistemas propietarios sin integración
- Alta variabilidad de costos (materiales, mano de obra, subcontratistas)
- Presupuestos vs. real difíciles de conciliar en tiempo real
- Alta dependencia de personas clave (el residente de obra "sabe todo")

**Síntomas críticos:**
- "Nos enteramos de que un proyecto está en pérdida cuando ya es tarde"
- "El estimado inicial y el costo final nunca coinciden"
- "Tenemos 8 proyectos y no sabemos cuál es el más rentable"
- "Las órdenes de cambio no se registran formalmente y terminan peleadas con el cliente"

## Hallazgos Frecuentes en Foundation Construcción

### 1. Gestión de Presupuesto en Excel sin Control de Versiones
**Manifestación:** El presupuesto se modifica directamente sin mantener el baseline original. Cuando el proyecto termina, es imposible hacer análisis de varianza.
**Impacto:** Incapacidad de aprender de proyectos pasados para cotizar mejor los futuros.
**Costo de aprendizaje perdido:** Estimado en 3-8% del valor del contrato por cotizaciones imprecisas.

### 2. Control de Avance de Obra Manual y Subjetivo
**Manifestación:** El porcentaje de avance lo reporta el residente sin metodología. "Dice" 60% pero el costeo real muestra 75% del presupuesto consumido.
**Indicador clave:** Índice de Desempeño de Costo (CPI) = Valor Ganado / Costo Real. CPI < 0.85 es señal de alerta.

### 3. Órdenes de Cambio No Formalizadas
**Manifestación:** El cliente pide cambios verbalmente, se ejecutan, pero no se documentan formalmente. Al cerrar obra hay disputas de cobro.
**Costo típico:** 5-15% del valor del contrato en cambios no facturados.

### 4. Gestión de MRO (Mantenimiento, Reparación y Operación) sin Control
**Manifestación:** Herramientas, equipos y materiales menores se compran sin requisición formal, se pierden o se roban.
**Costo:** 2-4% del presupuesto en MRO no justificado.

## KPIs Clave Sector Construcción

| KPI | Fórmula | Meta | Frecuencia |
|---|---|---|---|
| CPI (Índice de Desempeño de Costo) | Valor Ganado / Costo Real | ≥ 0.95 | Semanal por obra |
| SPI (Índice de Desempeño de Cronograma) | Valor Ganado / Valor Planeado | ≥ 0.90 | Semanal por obra |
| Margen bruto por proyecto | (Ingreso - Costo directo) / Ingreso | > 18% para obra civil | Por corte |
| Órdenes de cambio formalizadas | OC aprobadas / OC ejecutadas | 100% | Por evento |
| Rotación de cuentas por cobrar | Ventas / Cartera promedio | < 45 días | Mensual |

## Metodología de Earned Value para PyME Constructora

El Earned Value Management (EVM) es la herramienta estándar para control de proyectos, adaptada para constructoras medianas:

### Las 3 curvas S:
1. **BCWS (Costo Presupuestado del Trabajo Planeado):** Lo que debíamos haber gastado según cronograma
2. **BCWP (Costo Presupuestado del Trabajo Realizado):** Lo que gastamos según lo que avanzamos (Valor Ganado)
3. **ACWP (Costo Real del Trabajo Realizado):** Lo que realmente gastamos

### Análisis de Varianzas:
- **Varianza de Costo (CV) = BCWP - ACWP** → Negativo = sobre-costo
- **Varianza de Cronograma (SV) = BCWP - BCWS** → Negativo = retraso

## Arquitectura de Datos para Constructora

```
Fact_Avance_Obra
├── dim_tiempo (semana, mes)
├── dim_proyecto (nombre, cliente, tipo, contrato)
├── dim_partida (capítulo, subpartida, unidad)
├── dim_responsable (residente, supervisor)
└── métricas: presupuesto_baseline, costo_real, avance_pct,
            valor_ganado, estimado_al_terminar

Fact_Compras_Obra
├── dim_tiempo
├── dim_proyecto
├── dim_proveedor
├── dim_material
└── métricas: cantidad_pedida, precio_unitario, total,
            vs_presupuesto_unitario
```

## Factor de Complejidad en Construcción

Para constructora con 4 obras simultáneas y 1 ERP financiero:
- Γ = 1 + (0.5 × 4 obras como "sucursales") + (0.2 × 1) = **3.2**

Cada obra activa se trata como una sucursal independiente para el cálculo del Factor Γ.
