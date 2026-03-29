---
tags: 
  - playbook
  - coo
  - supply-chain
  - risk-management
  - logistics
  - enterprise
aliases: 
  - Resiliencia Logística
  - Gestión de Riesgos Cadena de Suministro
  - Supply Chain Resilience
nivel_de_complejidad: avanzado-enterprise
dependencias: 
  - formulas/financial/cost-of-inaction.md
  - formulas/statistical/monte-carlo-simplified.md
  - frameworks/coso-erm/coso-risk-framework.md
  - playbooks/manufactura/playbook-manufactura.md
status: activo
---

# Playbook: Supply Chain Resilience & Risk Mitigation

## 1. Tesis del Playbook (Diagnóstico del Dolor)
Transforma la gestión de la cadena de suministro de un estado "Reactivo" a uno "Predictivo". Ante las vulnerabilidades logísticas endémicas (ej. la inseguridad y bloqueos en el corredor Puebla-Veracruz) o el colapso de proveedores únicos, las empresas sufren paros de producción que destruyen el EBITDA. 

La mayoría de los clientes abordan esto desde la intuición. Este protocolo se ancla en el [[coso-risk-framework]] para cuantificar la probabilidad de disrupción y diseña estrategias de redundancia matemática antes de que ocurra la pérdida. Es un complemento de ejecución directa para el [[playbook-manufactura]] y el [[playbook-textiles]].

## 2. Cuantificación del Impacto (Métricas de Control)
Para justificar la intervención operativa, el CFO/COO debe medir:
* **Time to Recover (TTR):** Tiempo proyectado (en horas/días) para restaurar el 100% de la capacidad operativa tras la falla de un nodo logístico o proveedor clave.
* **Time to Survive (TTS):** Duración máxima que la operación puede sostenerse utilizando únicamente inventarios de seguridad (Buffers) antes del colapso de la línea de producción.
* **Costo de Inacción (COI) por Interrupción:** Impacto financiero directo. Se calcula inyectando el riesgo logístico en la fórmula central de [[cost-of-inaction]] (Pérdida de ventas + Penalizaciones contractuales + Costos fijos inoperantes).

## 3. Algoritmo de Ejecución (El Despliegue Operativo)

### FASE 1: Mapeo de Nodos Críticos (Discovery)
1. Auditar las rutas logísticas y el listado de proveedores (*Bill of Materials*).
2. Identificar nodos con *Single Source of Failure* (proveedores únicos sin alternativa inmediata).
3. Evaluar el historial de mermas y retrasos (Ver lecciones aprendidas en el [[caso-textiles-atoyac]]).

### FASE 2: Pruebas de Estrés (Stress Testing)
1. Someter la cadena a escenarios de interrupción severa.
2. **Regla de Sobrevivencia:** Si el TTR (Tiempo de Recuperación) es estrictamente mayor que el TTS (Tiempo de Supervivencia), la empresa está en riesgo de paro técnico inminente. El cliente está operando en "números rojos" logísticos.

### FASE 3: Arquitectura de Redundancia y Mitigación
1. **Dual-Sourcing Geográfico:** Calificar y mantener activas fuentes de suministro alternativas en geografías de menor riesgo (*Nearshoring*), justificando financieramente que el incremento en costo unitario es menor al impacto de un paro total.
2. **Inventory Buffering Dinámico:** Abandonar el cálculo de inventario estático (promedios históricos). Ajustar los niveles de inventario de seguridad utilizando proyecciones estocásticas documentadas en [[monte-carlo-simplified]], ponderando la volatilidad de la demanda y el riesgo latente de la ruta.

### FASE 4: Monitoreo de Control (Integración con BI)
El equipo de datos debe implementar alertas automáticas (Data Observability) en el ecosistema de Power BI. Si los niveles de inventario de seguridad en insumos críticos caen por debajo del umbral de mitigación (TTS < TTR), el sistema emite una alerta directa al COO del cliente, cerrando la brecha entre el análisis de riesgo y la ejecución.

## 4. Palancas de Negociación Comercial (Para el CEO)
* **Objeción del Cliente:** *"Tener inventario de seguridad o proveedores de respaldo inmoviliza mi capital de trabajo. Es muy caro."*
* **Contra-argumento Evangelista:** *"Inmovilizar capital es estratégico; detener una línea de producción es letal. Estamos cambiando una pérdida no controlada e incuantificable por una prima de seguro calculada. Miremos el Costo de Inacción de perder un solo día de facturación frente a tu cliente más grande."*
