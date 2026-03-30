"""Nodo decomposer: descompone la tarea original en subtareas atómicas."""
import json
import os
import re
from src.orchestrator.state import OrchestratorState, SubTask, TaskStatus
from src.llm.factory import get_llm_client
from src.utils.logger import get_logger

logger = get_logger(__name__)

_PROMPT_PATH = os.path.join(os.path.dirname(__file__), "..", "prompts", "decomposer.yaml")


def _load_system_prompt() -> str:
    import yaml
    with open(_PROMPT_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f).get("system_prompt", "")


async def decompose(state: OrchestratorState) -> dict:
    """Descompone la tarea en subtareas. Retorna campos actualizados del estado."""
    logger.info("decomposing_task", task=state.original_task[:80])

    system_prompt = _load_system_prompt()
    llm = get_llm_client()

    user_prompt = f"Tarea a descomponer:\n\n{state.original_task}"
    if state.context:
        ctx_str = json.dumps(state.context, ensure_ascii=False)
        user_prompt += f"\n\nContexto adicional:\n{ctx_str}"

    try:
        raw = await llm.generate(
            prompt=user_prompt,
            system_prompt=system_prompt,
            temperature=0.1,
            max_tokens=1000,
        )

        # Limpiar posibles bloques markdown en la respuesta
        raw = raw.strip()
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)

        data = json.loads(raw)

        subtasks = [
            SubTask(
                id=st["id"],
                description=st["description"],
                assigned_agent=st["assigned_agent"],
                priority=st.get("priority", 1),
                depends_on=st.get("depends_on", []),
                status=TaskStatus.PENDING,
            )
            for st in data.get("subtasks", [])
        ]

        logger.info("task_decomposed", subtask_count=len(subtasks))

        return {
            "subtasks": subtasks,
            "execution_plan": data.get("execution_plan", ""),
            "status": TaskStatus.DECOMPOSED,
        }

    except (json.JSONDecodeError, KeyError) as e:
        logger.error("decompose_parse_error", error=str(e), raw=raw[:200] if 'raw' in dir() else "")
        # Fallback: una sola subtarea al agente financial
        fallback = SubTask(
            id="st-1",
            description=state.original_task,
            assigned_agent="financial",
            priority=1,
        )
        return {
            "subtasks": [fallback],
            "execution_plan": "Fallback: tarea asignada al agente financiero por error de parsing.",
            "errors": state.errors + [f"Error al parsear decomposición: {str(e)}"],
            "status": TaskStatus.DECOMPOSED,
        }

    except Exception as e:
        logger.error("decompose_error", error=str(e))
        return {
            "errors": state.errors + [f"Error en decomposer: {str(e)}"],
            "status": TaskStatus.FAILED,
        }
