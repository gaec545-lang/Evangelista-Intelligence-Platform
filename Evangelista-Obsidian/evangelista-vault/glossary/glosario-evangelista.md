---
id: "EVK-GLOS-001"
title: "Glosario Evangelista & Co. — Terminología Interna y Técnica"
type: glossary
version: "1.0"
domain: [finanzas, procesos, datos, riesgos]
sector: [manufactura, textiles, retail, logistica, alimentos, construccion]
agent_access: [all]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: ""
related: ["evangelista-rules", "factor-gamma-system", "alcoa-protocol"]
depends_on: []
tags: [foundation, architecture, sentinel]
status: active
last_ingested: null
chunk_count: null
---

# Glosario Evangelista & Co. — Terminología Interna y Técnica

## Términos de Servicio

**Foundation**
: El primer servicio de Evangelista. Un Dictamen Forense de 10 días hábiles que identifica y cuantifica los costos ocultos en la operación de una PyME. Precio base $35,000 MXN + variables. Resultado: Hallazgos ALCOA+ con impacto financiero monetizado.

**Architecture**
: El segundo servicio. Construcción de un Data Warehouse + ETL automatizado + dashboards Power BI que resuelven los problemas identificados en Foundation. Precio: $180,000 MXN × Γ (Setup Fee) + Success Fee (15% del ahorro medido).

**Sentinel**
: El tercer servicio. Monitoreo continuo post-Architecture con alertas automáticas sobre los KPIs críticos del cliente. Contrato recurrente mensual.

**MEC (Motor de Evaluación y Cotización)**
: El sistema algorítmico interno de Evangelista para calcular precios de Foundation y Architecture. Incluye los factores α, β y Γ. Confidencial — no se revela al cliente (Regla G-06).

## Roles Internos

**CEO**
: En Evangelista, el CEO tiene rol comercial (gestión de prospectos y clientes) y de análisis financiero (monetización de hallazgos). Es el único punto de contacto con el cliente durante todo el proceso.

**CTO**
: Rol técnico. Responsable del análisis de datos (Foundation Fase A), diseño del Data Warehouse, desarrollo de ETLs, y administración de Power BI. Opera exclusivamente en modo Read-Only sobre los sistemas del cliente.

**CFO/CQA**
: Rol dual: gestión financiera interna + Control de Calidad (QA) de los entregables. Firma el Certificado ALCOA+ antes de cada Cita 3. Sin esta firma, el Dictamen no se presenta.

## Términos Metodológicos

**ALCOA+**
: Estándar de integridad de datos: Attributable, Legible, Contemporaneous, Original, Accurate + Complete, Consistent, Enduring, Available. Todos los hallazgos del Dictamen deben cumplir los 9 criterios. Ver [[alcoa-protocol]].

**Bitácora Forense**
: Registro cronológico de todas las acciones del CTO durante el análisis. Cada entrada incluye: timestamp, acción realizada, hash del dataset en ese momento. Es la evidencia de que el análisis fue contemporáneo y no alterado a posteriori.

**Dictamen Forense**
: El documento entregable de Foundation. Incluye: perfil del cliente, metodología, hallazgos (máximo 8), impacto financiero total, y recomendaciones. Existe en versión interna (con fórmulas) y versión cliente (sin fórmulas, Regla G-06).

**Certificado ALCOA+**
: Documento firmado por el CFO/CQA que certifica que todos los hallazgos del Dictamen cumplen el estándar ALCOA+. Obligatorio antes de Cita 3 (Regla G-05).

**Vetting Gate**
: El proceso de decisión Go/No-Go entre Foundation y Architecture. Requiere que 4 criterios estén en verde: β < 0.7, α ≥ 0.0, Γ < 3.0, Sponsor con autoridad real. Decisión por consenso CEO + CTO (Regla G-03).

**Delivery Handshake**
: Documento de aceptación formal de entrega de Architecture, firmado por el cliente. Activa el cronómetro de 90 días para la medición del Success Fee.

## Factores del Motor de Precios

**Factor Γ (Gamma)**
: Γ = 1 + (0.5 × Sucursales) + (0.2 × ERPs). Multiplicador de complejidad que escala el Setup Fee de Architecture. Ver [[factor-gamma-system]].

**Factor α (Alpha)**
: α = log₁₀(Registros) - 4. Indicador de volumen de datos. Escala el precio de Foundation. Si α < 0, hay insuficientes datos para análisis estadístico robusto.

**Factor β (Beta)**
: β = Σ(F_manual × 0.2 + F_roto × 0.5) / N_fuentes. Indicador de entropía (desorden) de los datos. Si β > 0.7, el proyecto es técnicamente inviable.

**Protocolo Omega**
: Protocolo especial para proyectos con Γ > 3.0. Requiere Foundation extendida (15 días), reunión adicional de Scoping con CTO presente, y contrato customizado con cláusulas de change order.

## Términos del Proceso de Venta

**Cita 1** — Scoping: Primera reunión con el cliente. Objetivo: calcular α, β, Γ y confirmar si hay un problema real que Foundation puede diagnosticar. Dura 60-90 minutos. Resultado: propuesta de Foundation firmada o decisión de no seguir.

**Cita 2** — Inmersión: Visita presencial a las instalaciones del cliente. El CTO obtiene acceso al ERP y realiza el análisis en sitio. Dura 1 día completo (8 horas).

**Cita 3** — Dictamen: Presentación del Dictamen Forense al Sponsor. Duración: 90-120 minutos. Solo ocurre si el Certificado ALCOA+ está firmado (Regla G-05).

**Cita 4** — Architecture: Presentación de la propuesta Architecture con el modelo financiero (ROI, punto de equilibrio, Success Fee). Solo ocurre si el Vetting Gate está en verde (Regla G-08).

**Cita 4bis**: Variante de Cita 4 cuando hay un segundo decisor que no estuvo en Cita 4. Misma presentación, con el decisor adicional presente.

## Términos Técnicos

**Data Warehouse (DW)**
: Base de datos relacional (SQL Server) con modelo dimensional donde se consolidan los datos del cliente. Es la Fuente Única de Verdad del proyecto Architecture.

**ETL**
: Extract, Transform, Load. Proceso automatizado que extrae datos del ERP del cliente, los transforma al modelo dimensional, y los carga en el Data Warehouse. Se ejecuta automáticamente según un schedule (típicamente nocturno).

**Snapshot Día Cero**
: Copia de los datos del cliente en el momento exacto de inicio del proyecto. Incluye hash MD5 como evidencia ALCOA+ de integridad. Es la línea base para el cálculo del Success Fee.

**Fuente Única de Verdad (Single Source of Truth)**
: Principio arquitectónico del [[data-mesh-over-erp]]. Los datos del DW son el único origen autorizado para reportería y decisiones. Elimina los conflictos entre diferentes versiones del "mismo" dato en diferentes áreas.

**Read-Only Absoluto**
: Restricción de acceso técnica que garantiza que el CTO solo puede leer datos del cliente, nunca modificarlos. Implementación técnica de la Regla G-02.
