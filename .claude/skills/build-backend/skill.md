---
name: build-backend
description: >
  Desarrolla endpoints FastAPI, agentes, nodos de grafo, y herramientas
  Python para el backend de la EIP. Incluye patrones de FastAPI,
  integración con LangGraph, y conexión a Supabase/Qdrant.
triggers:
  - crea el endpoint
  - agrega el router
  - implementa el agente
  - modifica el grafo
  - genera SQL
---

# Build Backend — Desarrollo Python EIP

## Patrones de FastAPI

### Router nuevo
```python
# src/api/routes/nombre.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import structlog

logger = structlog.get_logger()
router = APIRouter()

class NombreRequest(BaseModel):
    campo: str

@router.post("/nombre/action")
async def action_handler(req: NombreRequest):
    """Descripción en español."""
    try:
        # lógica
        return {"status": "ok", "data": result}
    except Exception as e:
        logger.error("action_failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))
```

### Registrar en server.py
```python
from .routes import nombre
app.include_router(nombre.router, prefix="/api/v1", tags=["Nombre"])
```

## Integración con agentes

Cuando un endpoint necesita IA, usar el grafo RAG via `run_graph()`:
```python
from ..graph.builder import run_graph

result = await run_graph(
    question="prompt específico para el agente",
    context={"service": "foundation", "action": "pricing"}
)
# result.final_response contiene la respuesta
# result.confidence contiene la confianza [0-1]
```
