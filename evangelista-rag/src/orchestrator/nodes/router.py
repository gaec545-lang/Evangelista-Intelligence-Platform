"""Nodo router: valida asignaciones y detecta ciclos de dependencias."""
from src.orchestrator.state import OrchestratorState, TaskStatus
from src.utils.logger import get_logger

logger = get_logger(__name__)

# Mapa de dominios a agentes como fallback
_DOMAIN_FALLBACK = {
    "finanzas": "financial",
    "pricing": "financial",
    "riesgos": "financial",
    "procesos": "process",
    "produccion": "process",
    "logistica": "process",
    "calidad": "process",
    "datos": "data_engineer",
    "inventarios": "data_engineer",
    "etl": "data_engineer",
}


def _has_cycle(subtasks) -> bool:
    """Detecta ciclos en el grafo de dependencias con DFS."""
    ids = {st.id for st in subtasks}
    deps = {st.id: set(st.depends_on) & ids for st in subtasks}
    visited, in_stack = set(), set()

    def dfs(node):
        visited.add(node)
        in_stack.add(node)
        for neighbor in deps.get(node, []):
            if neighbor not in visited:
                if dfs(neighbor):
                    return True
            elif neighbor in in_stack:
                return True
        in_stack.discard(node)
        return False

    return any(dfs(node) for node in ids if node not in visited)


async def route(state: OrchestratorState) -> dict:
    """Valida asignaciones y determina orden de ejecución."""
    from src.agents.registry import AgentRegistry

    errors = list(state.errors)
    subtasks = [st.model_copy() for st in state.subtasks]
    available = AgentRegistry.list_agents()

    for st in subtasks:
        if st.assigned_agent not in available:
            # Intentar reasignar por palabras clave en la descripción
            desc_lower = st.description.lower()
            fallback = next(
                (agent for kw, agent in _DOMAIN_FALLBACK.items() if kw in desc_lower and agent in available),
                available[0] if available else None,
            )
            if fallback:
                errors.append(
                    f"Agente '{st.assigned_agent}' no existe. Reasignado a '{fallback}'."
                )
                st.assigned_agent = fallback
            else:
                errors.append(f"Agente '{st.assigned_agent}' no existe y no hay fallback.")
                st.status = TaskStatus.FAILED
                continue

        st.status = TaskStatus.ROUTED

    if _has_cycle(subtasks):
        errors.append("Se detectó un ciclo en las dependencias. Eliminando depends_on.")
        for st in subtasks:
            st.depends_on = []

    logger.info("routing_complete", routed=[st.id for st in subtasks if st.status == TaskStatus.ROUTED])

    return {
        "subtasks": subtasks,
        "status": TaskStatus.ROUTED,
        "errors": errors,
    }
