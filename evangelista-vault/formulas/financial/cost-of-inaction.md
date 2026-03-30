---
id: cost-of-inaction
title: "Fórmula del Costo de Inacción"
type: formula
agent_access: [financial, risk]
tags: [costo_inaccion, roi, pricing, decision, venta]
sector: [todos]
dominios: [finanzas, pricing]
version: "1.0"
author: evangelista
---

# Fórmula del Costo de Inacción

## Definición

El Costo de Inacción (CoI) cuantifica **cuánto le cuesta a la empresa NO resolver el problema** durante el período en que posterga la decisión de contratar a Evangelista.

Es la herramienta de cierre más poderosa en la venta consultiva porque cambia el marco de referencia: el cliente deja de comparar "pago vs. no pago" y comienza a comparar "pérdida actual vs. inversión para eliminarla".

## Fórmula General

```
CoI = (Pérdida_Mensual_Actual × Meses_Postergación) + Costo_Oportunidad
```

Donde:
- **Pérdida_Mensual_Actual:** Costo cuantificable del problema hoy
- **Meses_Postergación:** Tiempo estimado antes de resolver el problema sin Evangelista
- **Costo_Oportunidad:** Ingresos o ahorros que se pierden por no actuar

## Desglose por Tipo de Pérdida

### 1. Pérdidas Operativas (más fáciles de cuantificar)
- **Merma de inventario:** % merma × valor inventario mensual
- **Retrabajo:** horas-hombre × costo hora × frecuencia mensual
- **Tiempo de paro:** horas paro × costo hora máquina/planta
- **Pedidos no surtidos:** unidades perdidas × margen unitario

### 2. Pérdidas por Ineficiencia en Datos
- **Tiempo en reportes manuales:** horas/mes × costo hora gerencial × 12
- **Decisiones con datos incorrectos:** estimado como 2-5% del costo de mala decisión
- **Duplicidad de capturas:** horas × personas × costo hora

### 3. Pérdidas por Riesgo no Mitigado
- **Riesgo SAT:** probabilidad de auditoría × multa esperada
- **Riesgo de concentración:** probabilidad de pérdida de cliente clave × margen anual

## Ejemplo de Aplicación: Textilera con 2 Plantas

**Datos del cliente (levantados en Scoping):**
- Merma de inventario: 3.2% sobre $8M MXN en inventario = **$256K MXN/mes**
- Reportes manuales: 4 gerentes × 3 días/mes × $2,500/día = **$30K MXN/mes**
- Pedidos no surtidos por ruptura de stock: 8 eventos/mes × $45K promedio = **$360K MXN/mes**
- Riesgo SAT (discrepancias CFDI): 25% prob × $2M multa = **$500K MXN/año = $41K/mes**

**Total pérdida mensual = $687K MXN**

**Costo de Inacción a 6 meses = $687K × 6 = $4.1M MXN**

**Foundation Fee = ~$89,250 MXN** (ejemplo con Γ=1.9)

**ROI de contratar Evangelista:** $4.1M recuperados vs. $89K invertidos = **4,500% ROI en 6 meses**

## Cómo Presentarlo al Cliente

### Formato conversación de cierre:

> "Entiendo que el Foundation Fee te parece una inversión significativa. Déjame mostrarte otra perspectiva. Basado en lo que me compartiste: la merma actual, los reportes manuales y las rupturas de stock te están costando aproximadamente **$687,000 MXN al mes**. Si tardamos 3 meses en arrancar este proyecto por el proceso de aprobación, eso son **$2 millones que ya no vas a recuperar**. El Foundation vale $89,000. ¿Cuál es realmente la decisión costosa aquí?"

### Reglas de presentación:
1. **Nunca inventar los números** — solo usar datos que el cliente confirmó en la conversación
2. **Ser conservador** — si no estás seguro de un número, usa el menor
3. **Dar el beneficio de la duda** — "esto es solo con la merma y los reportes, sin contar el riesgo fiscal"
4. **No presionar** — presentar los números y dejar que el cliente haga la conclusión

## Integración con el Motor de Precios

El CoI se calcula **antes** de presentar el precio para:
1. Calibrar el Foundation Fee (CoI debe ser al menos 10× el fee)
2. Preparar el argumento de valor
3. Identificar si el proyecto es viable (CoI < Foundation Fee = cliente no tiene problema suficiente)

Si `CoI < 5 × Foundation_Fee`, evaluar si el proyecto es apropiado para Evangelista o si el cliente necesita una solución más pequeña.
