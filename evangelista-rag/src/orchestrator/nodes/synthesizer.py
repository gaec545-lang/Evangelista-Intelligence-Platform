"""Nodo synthesizer: combina outputs de agentes en respuesta final coherente."""
import os
import yaml
from src.orchestrator.state import OrchestratorState, TaskStatus
from src.llm.factory import get_llm_client
from src.utils.logger import get_logger

logger = get_logger(__name__)

_PROMPT_PATH = os.path.join(os.path.dirname(__file__), "..", "prompts", "synthesizer.yaml")


def _load_system_prompt() -> str:
    with open(_PROMPT_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f).get("system_prompt", "")


async def synthesize(state: OrchestratorState) -> dict:
    """Sintetiza todos los outputs de agentes en una respuesta final."""
    logger.info("synthesizing", outputs_count=len(state.agent_outputs))

    completed = [st for st in state.subtasks if st.status == TaskStatus.COMPLETED]
    failed = [st for st in state.subtasks if st.status == TaskStatus.FAILED]

    # Si no hay nada que sintetizar, generar mensaje de error
    if not completed and not state.agent_outputs:
        error_msg = (
            "**No fue posible completar el análisis.**\n\n"
            "No se obtuvieron resultados de ningún agente especialista.\n\n"
            f"**Errores registrados:**\n" + "\n".join(f"- {e}" for e in state.errors)
            if state.errors else "Sin detalles de error."
        )
        return {
            "final_response": error_msg,
            "status": TaskStatus.COMPLETED,
        }

    # Construir el prompt de síntesis con todos los outputs
    outputs_text = ""
    for i, (subtask_id, output) in enumerate(state.agent_outputs.items(), 1):
        # Encontrar la subtarea para obtener el nombre del agente
        st = next((s for s in state.subtasks if s.id == subtask_id), None)
        agent_name = st.assigned_agent if st else "desconocido"
        outputs_text += f"\n\n--- OUTPUT AGENTE: {agent_name.upper()} (subtask {subtask_id}) ---\n{output}"

    if failed:
        failed_info = "\n\n--- SUBTAREAS FALLIDAS ---\n" + "\n".join(
            f"- Agente {st.assigned_agent}: sin resultado" for st in failed
        )
        outputs_text += failed_info

    if state.errors:
        errors_info = "\n\n--- ERRORES Y ESCALACIONES ---\n" + "\n".join(f"- {e}" for e in state.errors)
        outputs_text += errors_info

    user_prompt = (
        f"Tarea original del cliente:\n{state.original_task}\n\n"
        f"Outputs de los agentes especialistas:{outputs_text}\n\n"
        "Sintetiza una respuesta ejecutiva unificada siguiendo las reglas indicadas."
    )

    system_prompt = _load_system_prompt()
    llm = get_llm_client()

    try:
        final_response = await llm.generate(
            prompt=user_prompt,
            system_prompt=system_prompt,
            temperature=0.3,
            max_tokens=1500,
        )
        logger.info("synthesis_complete", response_len=len(final_response))
    except Exception as e:
        logger.error("synthesis_error", error=str(e))
        # Fallback: concatenar outputs directamente
        final_response = (
            f"**Análisis de:** {state.original_task}\n\n"
            + outputs_text
            + f"\n\n*(Síntesis automática no disponible: {str(e)})*"
        )

    # Recopilar fuentes de todos los agentes
    all_sources = list(state.sources_used)

    return {
        "final_response": final_response,
        "sources_used": all_sources,
        "status": TaskStatus.COMPLETED,
    }
