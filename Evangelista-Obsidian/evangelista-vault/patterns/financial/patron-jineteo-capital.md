---
id: "EVK-PAT-FIN-003"
title: "Patrón de Hallazgo — Jineteo de Capital (Avance Desproporcionado)"
type: pattern
version: "1.0"
domain: ["finance", "cash-flow", "integrity"]
sector: ["construccion", "servicios-por-proyecto"]
agent_access: [data_eng, financial]
confidence: high
source: evangelista-methodology
last_validated: 2026-03-30
parent: ""
related: ["caso-cibrian-arquitectos", "patron-sobrecosto-proyecto"]
depends_on: []
tags: ["cash-kiting", "over-billing", "financial-risk", "puebla"]
status: active
last_ingested: null
chunk_count: null
---

# Patrón de Hallazgo — Jineteo de Capital (Avance Desproporcionado)

## Definición
Consiste en cobrar al cliente facturas por "Avance de Obra" o "Hito de Proyecto" que superan significativamente el avance físico real medido por ingeniería. Esto genera una disposición de efectivo "infundada" que la empresa usa para cubrir otros huecos financieros.

## Cómo Detectar (Protocolo Data Eng)
1. **Ratio de Integridad**: `RI = (% Avance Facturado / % Avance Físico)`.
2. **Red Flag**: Un `RI > 1.30` indica que se ha cobrado un 30% más de lo que se ha trabajado.
3. **Detección en Datos**: Cruzar la tabla de Facturas Emitidas vs tabla de Bitácoras de Obra mediante ID de proyecto.

## Cuantificación del Impacto (Protocolo Financial)
- **Riesgo Fiscal**: Ingresos acumulados cobrados no sustentados por materiales, provocando utilidad inflada y pagos excesivos de ISR.
- **Riesgo Reputacional**: El cliente puede auditar la obra y rescindir el contrato con multas por "fraude de certificación".
- **Caso Referencia**: [[caso-cibrian-arquitectos]].

## Causa Raíz más Común
- **Financiamiento Gratuito**: La empresa usa al cliente A como "banco" para financiar las pérdidas de la obra del cliente B.
- **KPIs Mal Alineados**: El Director Comercial tiene metas de "cobranza", no de "rentabilidad real".

## Solución Architecture / Sentinel
1. **Veto de Facturación**: Sentinel bloquea la generación de facturas de avance si el supervisor de obra (no el comercial) no ha validado el hito físico en el sistema.
2. **Alertas de Cash Loss**: Si el RI es alto, el sistema activa una reserva de caja obligatoria para prevenir la asfixia financiera al final de la obra.

## Wikilinks y Referencias
- Ver [[patron-sobrecosto-proyecto]].
- Caso de referencia: [[caso-cibrian-arquitectos]].
