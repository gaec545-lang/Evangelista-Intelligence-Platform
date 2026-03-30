"""Definición y compilación del grafo LangGraph del orquestador."""
import time
from langgraph.graph import StateGraph, END
from src.orchestrator.state import OrchestratorState, TaskStatus
from src.orchestrator.nodes.decomposer import decompose
from src.orchestrator.nodes.router import route
from src.orchestrator.nodes.executor import execute
from src.orchestrator.nodes.quality_gate import quality_check
from src.orchestrator.nodes.synthesizer import synthesize
from src.utils.logger import get_logger

logger = get_logger(__name__)


def _after_quality(state: OrchestratorState) -> str:
    """Decisión condicional post quality_gate."""
    if state.status == TaskStatus.RETRY:
        return "execute"
    return "synthesize"


def build_graph():
    """Construye y compila el grafo del orquestador."""
    graph = StateGraph(OrchestratorState)

    graph.add_node("decompose", decompose)
    graph.add_node("route", route)
    graph.add_node("execute", execute)
    graph.add_node("quality_gate", quality_check)
    graph.add_node("synthesize", synthesize)

    graph.set_entry_point("decompose")
    graph.add_edge("decompose", "route")
    graph.add_edge("route", "execute")
    graph.add_edge("execute", "quality_gate")

    graph.add_conditional_edges(
        "quality_gate",
        _after_quality,
        {
            "execute": "execute",
            "synthesize": "synthesize",
        },
    )

    graph.add_edge("synthesize", END)

    return graph.compile()


# Instancia global compilada
orchestrator = build_graph()


async def run_orchestrator(task: str, context: dict = None) -> OrchestratorState:
    """Punto de entrada principal. Ejecuta el grafo completo y retorna el estado final."""
    logger.info("orchestrator_start", task=task[:80])
    start = time.time()

    initial_state = OrchestratorState(
        original_task=task,
        context=context or {},
    )

    final_state = await orchestrator.ainvoke(initial_state)

    # LangGraph puede retornar un dict; normalizamos a OrchestratorState
    if isinstance(final_state, dict):
        final_state = OrchestratorState(**final_state)

    final_state.execution_time_ms = int((time.time() - start) * 1000)
    if final_state.status != TaskStatus.FAILED:
        final_state.status = TaskStatus.COMPLETED

    logger.info(
        "orchestrator_complete",
        status=final_state.status,
        confidence=final_state.total_confidence,
        time_ms=final_state.execution_time_ms,
    )
    return final_state
