import os
from src.agents.base_agent import BaseAgent, AgentOutput
from src.agents.registry import AgentRegistry

class DataEngineerAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="data_engineer",
            prompt_path=os.path.join(os.path.dirname(__file__), "..", "prompts", "data_engineer.yaml")
        )
        # Initialize LLM client, query engine if needed

    @property
    def domains(self) -> list[str]:
        return ["datos", "inventarios", "produccion"]

    @property
    def tools(self) -> list[str]:
        return ["rag_query", "generate_sql", "generate_python", "format_table"]

# Auto‑register the agent
AgentRegistry.register(DataEngineerAgent())
