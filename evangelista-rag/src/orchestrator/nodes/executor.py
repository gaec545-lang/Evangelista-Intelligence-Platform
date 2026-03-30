"""Nodo executor: ejecuta agentes en paralelo (independientes) y secuencial (dependientes)."""
import asyncio
from src.orchestrator.state import OrchestratorState, TaskStatus
from src.utils.logger import get_logger

logger = get_logger(__name__)


async def execute(state: OrchestratorState) -> dict:
    """Ejecuta agentes respetando dependencias. Independientes en paralelo."""
    from src.agents.registry import AgentRegistry

    subtasks = [st.model_copy() for st in state.subtasks]
    agent_outputs = dict(state.agent_outputs)
    errors = list(state.errors)
    sources_used = list(state.sources_used)

    routed = [st for st in subtasks if st.status == TaskStatus.ROUTED]

    async def run_subtask(st, extra_context: list[dict] = None):
        agent = AgentRegistry.get(st.assigned_agent)
        ctx = extra_context or []
        try:
            result = await agent.execute(st.description, context=ctx)
            st.result = result.analysis
            st.confidence = result.confidence
            st.status = TaskStatus.COMPLETED
            agent_outputs[st.id] = result.analysis

            for src in result.sources_used:
                if src not in sources_used:
                    sources_used.append(src)

            if result.escalation_needed:
                errors.append(
                    f"Agente {st.assigned_agent} escaló: {result.escalation_reason or 'sin razón'}"
                )
            logger.info(
                "subtask_completed",
                subtask=st.id,
                agent=st.assigned_agent,
                confidence=st.confidence,
            )
        except Exception as e:
            st.status = TaskStatus.FAILED
            errors.append(f"Error ejecutando {st.assigned_agent} (subtask {st.id}): {str(e)}")
            logger.error("subtask_failed", subtask=st.id, agent=st.assigned_agent, error=str(e))

    # Fase 1: subtareas sin dependencias — ejecución paralela
    independent = [st for st in routed if not st.depends_on]
    if independent:
        logger.info("executing_parallel", count=len(independent))
        await asyncio.gather(*[run_subtask(st) for st in independent])

    # Fase 2: subtareas con dependencias — ejecución secuencial con contexto previo
    dependent = sorted(
        [st for st in routed if st.depends_on],
        key=lambda x: x.priority,
    )
    for st in dependent:
        dep_context = [
            {"title": f"Resultado subtarea {dep_id}", "content": agent_outputs[dep_id]}
            for dep_id in st.depends_on
            if dep_id in agent_outputs
        ]
        logger.info("executing_dependent", subtask=st.id, deps=st.depends_on)
        await run_subtask(st, extra_context=dep_context)

    # Sincronizar modificaciones de vuelta al listado original
    subtask_map = {st.id: st for st in subtasks}
    updated_subtasks = [subtask_map.get(st.id, st) for st in state.subtasks]

    return {
        "subtasks": updated_subtasks,
        "agent_outputs": agent_outputs,
        "errors": errors,
        "sources_used": sources_used,
        "status": TaskStatus.QUALITY_CHECK,
    }
