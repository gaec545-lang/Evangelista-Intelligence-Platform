---
tags: [framework, cfo, finance, unit-economics, pricing, enterprise]
aliases: [Economía Unitaria, Margen de Contribución, LTV/CAC]
nivel_de_complejidad: estratégico
sector_aplicable: agnóstico
dependencias: ["[[foundation-pricing]]", "[[roi-npv-irr]]", "[[cost-of-inaction]]"]
status: activo
---

# Framework: Unit Economics & Profitability (El Motor Financiero)

## 1. Tesis del Framework (Diagnóstico del Dolor)
Destruye la ilusión del crecimiento subsidiado. El error más común en la dirección general es escalar las operaciones basándose únicamente en el volumen de ventas brutas, ocultando ineficiencias graves. 

Este protocolo aísla la unidad transaccional más pequeña de la empresa (una orden, un flete, una suscripción) y audita su viabilidad financiera real descontando absolutamente todos los costos ocultos. **Si el margen de la unidad base es negativo, escalar el negocio únicamente acelera la quiebra.**

## 2. Cuantificación del Impacto (Métricas de Control)
El CFO debe extraer y monitorear estos tres indicadores de salud financiera:
* **Margen de Contribución por Unidad (CM3):** Ingreso neto por unidad restando los costos variables directos, costos de adquisición y costos de fricción.
* **Ratio LTV/CAC (Customer Lifetime Value vs. Customer Acquisition Cost):** Mide la eficiencia de la inversión comercial. El umbral mínimo de viabilidad es 3:1 (El cliente debe dejar tres veces más dinero del que costó adquirirlo). 
* **Payback Period:** Meses requeridos para que el margen generado por un cliente recupere su costo de adquisición (CAC). Umbral de riesgo: Debe ser menor a 12 meses.

## 3. Algoritmo de Ejecución (El Despliegue de Auditoría)

### FASE 1: Aislamiento de la Unidad (Unit Definition)
1. Exigir al cliente que defina su unidad transaccional base. (Ej. SaaS: Usuario/Licencia; Logística: Flete; Manufactura: Lote de producción).
2. Separar implacablemente los costos fijos (OpEx estructural como renta y salarios administrativos) de los costos estrictamente variables.

### FASE 2: Depuración de Costos (Cascada CM)
Aplicar la siguiente cascada matemática sobre los datos históricos extraídos del ERP del cliente:
* **CM1 (Margen Bruto):** Ingreso Neto por Unidad - Costo Directo de Producción/Servicio (COGS).
* **CM2 (Margen de Adquisición):** CM1 - Costos prorrateados de Marketing y Ventas (CAC).
* **CM3 (Margen Operativo Real):** CM2 - Costos de Fricción (Mermas, Devoluciones, Fraude, Seguros). *Este es el único número que importa.*

### FASE 3: Diagnóstico y Veto Estratégico (Control CQA)
1. **Si CM3 es negativo:** El CFO/Centinela de Evangelista & Co. ejerce poder de veto. Se ordena al cliente detener inmediatamente toda inversión en adquisición y crecimiento comercial.
2. **Reestructuración:** Se redirige el capital hacia la optimización de procesos (Lean Six Sigma) para reducir mermas operativas o se aplica una reestructuración de precios apoyada en [[foundation-pricing]].

### FASE 4: Automatización (Integración con The Sentinel)
El cálculo no puede vivir en un Excel estático mensual. Se debe diseñar un pipeline de datos (conectando el ERP a Power BI) para que el Director General monitoree el LTV/CAC y el CM3 en tiempo real, conectando este análisis con el [[cost-of-inaction]] y el [[roi-npv-irr]] para justificar cambios operativos.

## 4. Palancas de Negociación Comercial (Para el CEO)
* **Objeción del Cliente:** *"Ahorita no me importa la rentabilidad, mi estrategia es capturar cuota de mercado bajando precios, luego subimos el margen."*
* **Contra-argumento Evangelista:** *"Crecer con un CM3 negativo no es ganar mercado, es comprar clientes con el dinero de tus inversores. Cada venta nueva te acerca a la insolvencia. Vamos a conectar tus datos para ver cuánto te cuesta realmente cada cliente nuevo; si el Payback Period supera los 12 meses, estás financiando a tus clientes, no construyendo una empresa."*