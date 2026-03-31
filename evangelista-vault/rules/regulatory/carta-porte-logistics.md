---
id: carta-porte-logistics
title: "Complemento Carta Porte: Implicaciones para Empresas con Logística Propia"
type: regulatory_reference
agent_access: [financial, data_engineer, process]
tags: [regulatorio, carta-porte, sat, logistica, transporte, cfdi, datos]
sector: [manufactura, retail, logistica]
dominios: [compliance, datos, logistica]
version: "1.0"
author: evangelista
---

# Complemento Carta Porte: Implicaciones para Empresas con Logística Propia

## Marco regulatorio

El **Complemento Carta Porte** (CCP) es un nodo adicional que se incorpora al CFDI de traslado (tipo T) o al CFDI de ingreso (tipo I) cuando se transporta mercancía en territorio nacional. Se volvió **obligatorio el 1 de enero de 2022** para:

- Empresas con flotilla propia que trasladan sus mercancías
- Empresas que contratan servicios de transporte de carga
- Cualquier movimiento de mercancía de más de 100 kg entre localidades diferentes

La base legal es el artículo 29-A del Código Fiscal de la Federación y la Regla 2.7.1.34 de la RMF 2022.

## Empresas que deben cumplir (relevancia para proyectos Evangelista)

### Manufactura con distribución propia

Una empresa textilera en Puebla que produce y entrega a sus clientes en CDMX, Guadalajara y Monterrey debe emitir un CFDI de traslado con complemento Carta Porte para cada viaje. Sin este complemento, el transportista puede ser multado y la mercancía puede ser retenida en los puntos de verificación de la SCT.

**Impacto en datos**: Cada traslado genera un UUID único. Este UUID es la llave que conecta el movimiento físico de mercancía con el registro financiero. Sin integrarlo al DW, la empresa tiene un punto ciego en su cadena de suministro.

### Retail con flotilla propia

Cadenas de tiendas que abastecen sus sucursales desde un CEDIS (Centro de Distribución) central necesitan Carta Porte para los trasladados internos — aunque sean entre establecimientos del mismo RFC.

**Red flag común**: Tiendas que usan la flotilla para surtido de sucursales sin emitir Carta Porte porque "es entre nosotros mismos". Esto es incorrecto — el SAT exige el complemento en traslados entre establecimientos de la misma empresa también.

### Empresas que contratan transporte externo

Si la empresa contrata a un transportista externo (FLETE), es el transportista quien emite el CFDI de ingreso con Carta Porte. La empresa receptora debe conservar ese CFDI como soporte de sus deducciones de flete.

**Implicación para auditoría**: Si los gastos de flete en el estado de resultados no tienen CFDIs de ingreso correspondientes con Carta Porte válida, el SAT puede rechazar la deducción. Ver [[cfdi-40-implications]].

## Campos del Complemento Carta Porte relevantes para el DW

| Campo | Descripción | Uso analítico |
|---|---|---|
| `UbicacionOrigen` | Dirección y municipio de origen | Calcular rutas y distancias reales |
| `UbicacionDestino` | Dirección y municipio de destino | Análisis de cobertura geográfica |
| `TotalDistRec` | Distancia total recorrida (km) | Costo por km vs costo logístico real |
| `PesoBrutoTotal` | Peso total de la mercancía | Eficiencia de carga por viaje |
| `NumTotalMercancias` | Número de mercancías transportadas | Órdenes por viaje |
| `CveMaterialPeligroso` | Clave si aplica (NOM-002-SCT) | Flag de mercancía peligrosa |
| `IdentificacionVehicular` | Placa y tipo de vehículo | Análisis de utilización de flotilla |
| `RfcOperador` | RFC del conductor | Trazabilidad por conductor |

## KPIs que se habilitan con Carta Porte en el DW

Una vez integrado el flujo de Carta Porte al Data Warehouse, se pueden calcular:

### KPI 1: Costo Real por Km
```
Costo_x_Km = Gasto_Total_Transporte / Σ(TotalDistRec)
```
Benchmark para flota propia ligera en México: $12–$18 MXN/km. Por encima de $20 MXN/km indica ineficiencia operativa o subutilización de la flota.

### KPI 2: Tasa de Utilización de Carga
```
Util_Carga = PesoBrutoTotal_Real / Capacidad_Nominal_Vehiculo
```
Benchmark: >75% en rutas regulares. Por debajo indica que se hacen viajes parcialmente vacíos — oportunidad de consolidación de rutas.

### KPI 3: OTIF por Carta Porte
Cruzando la fecha de `UbicacionDestino` (llegada programada en el CCP) contra la fecha real de recepción en el sistema de almacén, se obtiene el OTIF (On Time In Full) verificable con sustento fiscal.

Ver [[playbook-logistica]] para benchmarks adicionales del sector.

## Pipeline de integración recomendado

```
SAT API (descarga masiva)
  → Parseo XML (nodo ComplementoCartaPorte)
  → Staging tabla: stg_carta_porte
  → Transformaciones: geocodificación de origen/destino, join con dim_vehiculo
  → DW tabla: fact_traslados
  → Dashboard: Mapa de rutas + KPI flota
```

**Frecuencia de actualización**: diaria — los CFDIs están disponibles en el portal SAT con latencia de ~2 horas.

## Sanciones por incumplimiento

El SAT y la SCT aplican estas sanciones:

| Infracción | Multa |
|---|---|
| Transportar sin Carta Porte | $3,350 – $33,500 MXN por viaje |
| Datos incorrectos en el CCP | $1,070 – $10,700 MXN |
| No conservar el CFDI de traslado | $19,700 – $93,600 MXN |

Para una empresa con 50 viajes/mes sin cumplimiento, la exposición acumulada puede superar $2M MXN anuales — dato útil para cuantificar el riesgo en el Dictamen Foundation.

## Wikilinks relacionados

- [[cfdi-40-implications]] — Marco general del CFDI 4.0
- [[nom-standards]] — NOM-002-SCT para materiales y residuos peligrosos
- [[playbook-logistica]] — Playbook completo para empresas de logística
- [[coso-risk-assessment]] — Integrar riesgo de incumplimiento en evaluación COSO
