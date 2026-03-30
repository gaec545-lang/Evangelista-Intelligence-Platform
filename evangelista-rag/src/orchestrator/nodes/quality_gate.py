"""Nodo quality_gate: valida calidad de outputs y decide retry vs síntesis."""
from src.orchestrator.state import OrchestratorState, TaskStatus
from src.utils.logger import get_logger

logger = get_logger(__name__)

# Patrones prohibidos por Regla G-06
_G06_PATTERNS = [
    "Γ =", "α =", "β =",
    "Motor de Precios", "Scoping Calculator",
    "Factor Gamma =", "Factor Alpha =", "Factor Beta =",
]


async def quality_check(state: OrchestratorState) -> dict:
    """Valida calidad. Retorna RETRY, SYNTHESIZING o FAILED."""
    subtasks = state.subtasks
    completed = [st for st in subtasks if st.status == TaskStatus.COMPLETED]
    failed = [st for st in subtasks if st.status == TaskStatus.FAILED]

    quality_feedback = state.quality_feedback or ""
    errors = list(state.errors)

    if not completed:
        logger.warning("quality_gate_no_completed")
        return {
            "quality_passed": False,
            "quality_feedback": "Ninguna subtarea completó exitosamente.",
            "status": TaskStatus.FAILED,
        }

    avg_confidence = sum(st.confidence for st in completed) / len(completed)

    # Regla G-06: detectar fórmulas internas filtradas
    for st in completed:
        if st.result:
            violations = [p for p in _G06_PATTERNS if p in st.result]
            if violations:
                quality_feedback += (
                    f" ALERTA G-06: Output de '{st.assigned_agent}' contiene "
                    f"fórmulas internas: {violations}."
                )
                logger.warning("g06_violation", agent=st.assigned_agent, patterns=violations)

    if failed:
        quality_feedback += (
            f" {len(failed)} subtarea(s) fallaron: "
            f"{[st.assigned_agent for st in failed]}."
        )

    # Decidir: retry o proceder
    if avg_confidence < 0.6 and state.global_retry_count < state.max_retries:
        new_retry = state.global_retry_count + 1
        feedback = (
            f"Confianza promedio {avg_confidence:.2f} < 0.6. "
            f"Reintento {new_retry}/{state.max_retries}."
        ) + quality_feedback

        # Resetear subtareas completadas para reintento
        reset_subtasks = []
        for st in subtasks:
            if st.status == TaskStatus.COMPLETED:
                reset_subtasks.append(st.model_copy(update={"status": TaskStatus.ROUTED, "retry_count": st.retry_count + 1}))
            else:
                reset_subtasks.append(st)

        logger.info("quality_gate_retry", attempt=new_retry, confidence=avg_confidence)
        return {
            "quality_passed": False,
            "quality_feedback": feedback,
            "global_retry_count": new_retry,
            "total_confidence": avg_confidence,
            "status": TaskStatus.RETRY,
            "subtasks": reset_subtasks,
        }

    logger.info("quality_gate_passed", confidence=avg_confidence, failed_count=len(failed))
    return {
        "quality_passed": True,
        "quality_feedback": quality_feedback,
        "total_confidence": avg_confidence,
        "errors": errors,
        "status": TaskStatus.SYNTHESIZING,
    }
