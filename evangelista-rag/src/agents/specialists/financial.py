import os
from src.agents.base_agent import BaseAgent, AgentOutput
from src.agents.registry import AgentRegistry

class FinancialAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="financial",
            prompt_path=os.path.join(os.path.dirname(__file__), "..", "prompts", "financial.yaml")
        )
        # Here you could initialize LLM client, query engine, etc.

    @property
    def domains(self) -> list[str]:
        return ["finanzas", "pricing", "riesgos"]

    @property
    def tools(self) -> list[str]:
        return ["rag_query", "calculate", "format_table"]



# Auto‑register the agent
AgentRegistry.register(FinancialAgent())
