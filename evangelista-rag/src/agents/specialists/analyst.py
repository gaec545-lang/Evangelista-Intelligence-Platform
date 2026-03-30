import os
from ..base_agent import BaseAgent, AgentOutput
from ..registry import AgentRegistry
from src.llm.factory import get_llm_client
from src.retrieval.query_engine import QueryEngine
from src.utils.logger import get_logger

logger = get_logger(__name__)


class AnalystAgent(BaseAgent):
    """Agente especialista en KPIs, benchmarks y métricas sectoriales."""

    def __init__(self):
        super().__init__(
            name="analyst",
            prompt_path=os.path.join(os.path.dirname(__file__), "..", "prompts", "analyst.yaml"),
        )
        self._llm = get_llm_client()
        self._query_engine = QueryEngine()

    @property
    def domains(self) -> list[str]:
        return ["kpis", "métricas", "benchmarks", "bi", "reportes"]

    @property
    def tools(self) -> list[str]:
        return ["rag_query", "format_table"]

    async def execute(self, task: str, context: list[dict] | None = None) -> AgentOutput:
        logger.info("analyst_execute", task=task[:80])

        # RAG retrieval
        rag_results = await self._query_engine.search(
            query=task, agent_name=self.name, final_k=4
        )
        rag_context = self._query_engine.format_context(rag_results)
        sources = [r.document_title for r in rag_results]

        # Contexto adicional inyectado (de subtareas previas)
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
            logger.error("analyst_llm_error", error=str(e))
            analysis = f"Error generando análisis de KPIs: {str(e)}"
            confidence = 0.0

        return AgentOutput(
            agent_name=self.name,
            confidence=confidence,
            analysis=analysis,
            recommendations=[],
            sources_used=sources,
            escalation_needed=False,
        )


AgentRegistry.register(AnalystAgent())
