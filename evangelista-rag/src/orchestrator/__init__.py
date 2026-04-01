"""
DEPRECATED: Usar src.graph en su lugar.
Este módulo existe solo para backward compatibility con la API existente.
"""
import warnings
from typing import Any, Dict
from src.graph.builder import run_graph

class Orchestrator:
    """Wrapper para el nuevo motor de Advanced RAG basado en grafos."""
    
    async def process(self, question: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Procesa una pregunta usando el flujo del grafo."""
        final_state = await run_graph(question, context=context)

        return {
            "answer": final_state.final_response or "Error en el procesamiento del grafo.",
            "confidence": final_state.confidence,
            "sources": final_state.generation_sources,
            "trace": final_state.mermaid_log,
            "route": final_state.route or "unknown",
        }

def _warn():
    warnings.warn(
        "src.orchestrator está deprecado. Usar src.graph en su lugar.",
        DeprecationWarning, stacklevel=3
    )

# Re-exportar desde graph/
from src.graph.state import GraphState as OrchestratorState
from src.graph.builder import build_graph, run_graph as run_orchestrator

# Mapeo de estados para retrocompatibilidad
TaskStatus = Any # Placeholder si es necesario
SubTask = Any # Placeholder si es necesario

__all__ = ["run_orchestrator", "OrchestratorState"]
