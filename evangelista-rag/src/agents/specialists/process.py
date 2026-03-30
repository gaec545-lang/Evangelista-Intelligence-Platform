import os
from src.agents.base_agent import BaseAgent, AgentOutput
from src.agents.registry import AgentRegistry

class ProcessAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="process",
            prompt_path=os.path.join(os.path.dirname(__file__), "..", "prompts", "process.yaml")
        )
        # Initialize LLM client, query engine if needed

    @property
    def domains(self) -> list[str]:
        return ["procesos", "produccion", "logistica", "calidad"]

    @property
    def tools(self) -> list[str]:
        return ["rag_query", "format_table", "generate_diagram_spec"]

# Auto‑register the agent
AgentRegistry.register(ProcessAgent())
