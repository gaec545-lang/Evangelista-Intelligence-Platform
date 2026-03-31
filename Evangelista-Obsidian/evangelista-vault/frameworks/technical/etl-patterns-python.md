---
id: "EVK-TECH-005"
title: "Patrones ETL con Python — Extracción y Transformación"
type: technical-framework
version: "1.0"
domain: ["python", "etl", "data-engineering", "pandas"]
sector: ["general"]
agent_access: [data_eng]
confidence: high
source: evangelista-architecture
last_validated: 2026-03-30
parent: ""
related: ["contpaqi-structure", "excel-as-erp"]
depends_on: []
tags: ["python-etl", "odbc", "pandas", "logging", "error-handling"]
status: active
last_ingested: null
chunk_count: null
---

# Patrones ETL con Python — Extracción y Transformación

## Introducción
El Agente Data Engineer debe estandarizar sus scripts de extracción usando estos 5 patrones probados para PyMEs mexicanas.

## 1. Extracción ODBC (SAP Business One / CONTPAQi)
```python
import pyodbc
import pandas as pd

def extract_from_sql(query, dsn_name):
    conn = pyodbc.connect(f'DSN={dsn_name};UID=user;PWD=pass')
    df = pd.read_sql(query, conn)
    conn.close()
    return df
```

## 2. Lectura Masiva de Excel con Validación
```python
import os
import pandas as pd

def load_excel_batch(folder_path, mandatory_cols):
    all_data = []
    for file in os.listdir(folder_path):
        if file.endswith(".xlsx"):
            df = pd.read_excel(os.path.join(folder_path, file))
            if all(col in df.columns for col in mandatory_cols):
                all_data.append(df)
    return pd.concat(all_data)
```

## 3. Deduplicación por Fuzzy Matching (Proveedores)
```python
from thefuzz import process

def deduplicate_vendors(vendor_list, threshold=90):
    unique_vendors = []
    for vendor in vendor_list:
        match = process.extractOne(vendor, unique_vendors)
        if not match or match[1] < threshold:
            unique_vendors.append(vendor)
    return unique_vendors
```

## 4. Carga Incremental (Delta Load)
```python
def get_incremental_data(source_df, target_max_date):
    # Solo registros con fecha mayor a la última carga exitosa
    return source_df[source_df['UpdateDate'] > target_max_date]
```

## 5. Manejo de Errores y Logging
```python
import logging

logging.basicConfig(filename='etl_vanguard.log', level=logging.INFO)

try:
    # Proceso ETL aquí
    logging.info("Extracción exitosa: 5000 registros.")
except Exception as e:
    logging.error(f"Falla en ETL: {str(e)}")
```

## Resumen para Agentes
Estos patrones aseguran que la ingesta de datos sea resiliente y auditable. El Agente `data_eng` debe priorizar la carga incremental para evitar saturar el ancho de banda de la PyME.
