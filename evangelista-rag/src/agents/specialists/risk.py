import os
from ..base_agent import BaseAgent, AgentOutput
from ..registry import AgentRegistry
from src.llm.factory import get_llm_client
from src.retrieval.query_engine import QueryEngine
from src.utils.logger import get_logger

logger = get_logger(__name__)

_NO_GO_THRESHOLD = 0.7


class RiskAgent(BaseAgent):
    """Agente especialista en COSO ERM, matrices de riesgo y compliance."""

    def __init__(self):
        super().__init__(
            name="risk",
            prompt_path=os.path.join(os.path.dirname(__file__), "..", "prompts", "risk.yaml"),
        )
        self._llm = get_llm_client()
        self._query_engine = QueryEngine()

    @property
    def domains(self) -> list[str]:
        return ["riesgos", "coso", "compliance", "control_interno", "vetting"]

    @property
    def tools(self) -> list[str]:
        return ["rag_query", "format_table"]

    async def execute(self, task: str, context: list[dict] | None = None) -> AgentOutput:
        logger.info("risk_execute", task=task[:80])

        # Detectar si hay indicación de β en la tarea
        beta_value = _extract_beta(task)
        escalation_needed = beta_value is not None and beta_value > _NO_GO_THRESHOLD
        escalation_reason = f"β={beta_value:.2f} supera el umbral NO-GO ({_NO_GO_THRESHOLD})" if escalation_needed else None

        # RAG retrieval
        rag_results = await self._query_engine.search(
            query=task, agent_name=self.name, final_k=4
        )
        rag_context = self._query_engine.format_context(rag_results)
        sources = [r.document_title for r in rag_results]

        extra_context = ""
        if context:
            for c in context:
                extra_context += f"\n\n{c.get('title', 'Contexto')}:\n{c.get('content', '')}"

        user_prompt = (
            f"Tarea: {task}\n\n"
            f"Conocimiento del vault:\n{rag_context}"
            f"{extra_context}"
        )

        try:
            analysis = await self._llm.generate(
                prompt=user_prompt,
                system_prompt=self.system_prompt,
                temperature=0.2,
                max_tokens=1200,
            )
            confidence = 0.85 if rag_results else 0.55
        except Exception as e:
            logger.error("risk_llm_error", error=str(e))
            analysis = f"Error generando matriz de riesgos: {str(e)}"
            confidence = 0.0

        return AgentOutput(
            agent_name=self.name,
            confidence=confidence,
            analysis=analysis,
            recommendations=[],
            sources_used=sources,
            escalation_needed=escalation_needed,
            escalation_reason=escalation_reason,
            escalation_target="director",
        )


def _extract_beta(text: str) -> float | None:
    """Intenta extraer el valor de β del texto de la tarea."""
    import re
    match = re.search(r'β\s*[=:]\s*([0-9.]+)', text)
    if match:
        return float(match.group(1))
    match = re.search(r'beta\s*[=:]\s*([0-9.]+)', text, re.IGNORECASE)
    if match:
        return float(match.group(1))
    return None


AgentRegistry.register(RiskAgent())
