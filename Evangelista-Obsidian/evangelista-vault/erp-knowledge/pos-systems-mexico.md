---
id: "EVK-ERP-007"
title: "Sistemas POS en México — Conexión y Extracción de Ventas"
type: technical-guide
version: "1.0"
domain: ["pos", "retail", "data-extraction"]
sector: ["retail", "restaurant"]
agent_access: [data_eng]
confidence: high
source: evangelista-it
last_validated: 2026-03-30
parent: ""
related: ["erp-knowledge/pos-systems-mexico"]
depends_on: []
tags: ["pos", "microsip", "softrestaurant", "bind", "api", "csv"]
status: active
last_ingested: null
chunk_count: null
---

# Sistemas POS en México — Conexión y Extracción de Ventas

## Introducción
En retail y restaurantes, el POS (Point of Sale) es la fuente primaria de datos, a menudo más real que la facturación contable (que puede no incluir "ventas de mostrador" no facturadas).

## Panorama del Mercado Mexicano

| Sistema | Sector Dominante | Tipo de Conexión |
|---------|------------------|------------------|
| **Microsip** | Retail General | SQL Server (Directo) |
| **SoftRestaurant** | Alimentos y Bebidas | SQL Server / DBF (Versiones viejas) |
| **Bind ERP** | E-commerce / Cloud | API REST (JSON) |
| **Desarrollo Propio** | Varios | Bases de datos "Caja Negra" (MySQL/SQLite) |

## Estrategias de Extracción

### 1. Acceso Directo (SQL Server/MySQL)
Si el POS es local, el `data_eng` debe solicitar acceso de solo lectura a la base de datos.
- **Trampa**: Muchos POS usan un esquema de "Folios por Sucursal". Un query global de `SELECT SUM(Total)` puede fallar si no se segmenta por ID de sucursal.

### 2. Extracción vía API (SaaS como Bind o Shopify)
La mejor opción para la arquitectura de Evangelista. Permite sincronización en tiempo real con Sentinel.
- **Protocolo**: OAuth2 o API Key. Limitar llamadas para evitar "Rate Limiting".

### 3. La "Tragedia del CSV"
Sistemas antiguos (o cerrados) que solo permiten exportar archivos CSV manualmente.
- **Acción Architecture**: Crear un "Bot de Ingestión" que vigila una carpeta compartida y procesa los CSVs apenas son exportados por el cajero al final del turno.

## Datos Vitales para el Análisis
Para que un agente `financial` o `data_eng` genere valor, el POS debe entregar mínimo:
- Timestamp exacto (no solo fecha).
- Método de pago (Efectivo, Tarjeta, Transferencia).
- ID de Cajero (para auditoría de prevención de pérdidas).
- Descuentos aplicados (identificar abusos de personal).

## Resumen para Agentes
El POS es el detector de mentiras del negocio. Si el POS dice que se vendieron 100 cocas y el inventario solo bajó 80, tenemos un problema grave de control o robo que el ERP contable nunca detectará.
