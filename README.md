# Evangelista Intelligence Platform (EIP)

Proyecto de consultoría estratégica asistida por IA para PyMEs mexicanas.

## Estructura del Proyecto
- `evangelista-rag/`: Backend FastAPI con orquestador de agentes y RAG.
- `evangelista-dashboard/`: Frontend Vite + React para la interfaz de usuario.
- `Evangelista-Obsidian/evangelista-vault/`: Base de conocimiento unificada (Playbooks, Casos, Benchmarks, Fórmulas, Regulatorios, Ventas) — para uso con Obsidian.
- `evangelista-vault-content/`: (archivado, migrado a Evangelista-Obsidian/evangelista-vault/)

## Configuración para MacBook M2 (Apple Silicon)

### 1. Requisitos Previos
- Python 3.10+ (Recomendado instalar vía `brew install python`).
- Node.js 18+ (Recomendado instalar vía `brew install node`).

### 2. Backend (evangelista-rag)
```bash
cd evangelista-rag
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
*Nota: `fastembed` descargará los modelos localmente en el primer inicio.*

### 3. Frontend (evangelista-dashboard)
```bash
cd evangelista-dashboard
npm install
```

### 4. Ejecución (Local)
1. **Backend**: `uvicorn src.api.server:app --port 8001`
2. **Frontend**: `npm run dev` (Corre en puerto 5174 por defecto).

## Notas de Sincronización
Este repositorio contiene el **Vault** completo (Módulos 1, 2 y 3). Antes de empezar a trabajar en la Mac, asegúrate de correr la ingesta inicial para poblar la base vectorial local:
```bash
cd evangelista-rag
python -m cli.ingest
```

---
*Evangelista & Co — Inteligencia que Transforma el Negocio.*
