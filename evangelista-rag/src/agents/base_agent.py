from abc import ABC, abstractmethod
import yaml
import json
import re
from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any

@dataclass
class AgentOutput:
    """Standardized output for all agents."""
    agent_name: str
    confidence: float = field(default=0.0)
    analysis: str = ""
    recommendations: List[str] = field(default_factory=list)
    data_points: List[Dict[str, Any]] = field(default_factory=list)
    sources_used: List[str] = field(default_factory=list)
    escalation_needed: bool = False
    escalation_reason: Optional[str] = None
    escalation_target: Optional[str] = None

class BaseAgent(ABC):
    """Base class for all specialist agents."""

    def __init__(self, name: str, prompt_path: str):
        self.name = name
        self.system_prompt = self._load_prompt(prompt_path)

    def _load_prompt(self, path: str) -> str:
        """Load the system prompt from a YAML file."""
        with open(path, "r", encoding="utf-8") as f:
            config = yaml.safe_load(f)
        return config.get("system_prompt", "")

    async def execute(self, task: str, context: Optional[List[dict]] = None) -> AgentOutput:
        """Execute a task with optional RAG context."""
        from src.retrieval.query_engine import QueryEngine
        from src.llm.factory import get_llm_client

        # 1. RAG Retrieval if no context is provided
        if context is None:
            engine = QueryEngine()
            results = await engine.search(query=task, agent_name=self.name)
            context_str = engine.format_context(results)
            sources = [r.document_id for r in results]
        else:
            # Format provided context
            context_str = "\n".join([f"- {c.get('content', '')}" for c in context])
            sources = list(set([c.get('document_id', 'provided_context') for c in context]))

        # 2. Prepare Structured Prompt
        # We append a request for JSON at the end to map to AgentOutput fields
        structured_instruction = (
            "\n\nResponde en el formato Markdown solicitado en tu system prompt, "
            "pero incluye al final un bloque JSON delimitado por ```json ... ``` "
            "con los siguientes campos: 'confidence' (float 0-1), 'analysis' (str), "
            "'recommendations' (list), 'data_points' (list of dicts), 'escalation_needed' (bool)."
        )
        
        llm_prompt = (
            f"TASK: {task}\n\n"
            f"CONTEXTO RAG RELEVANTE:\n{context_str}\n\n"
            f"{structured_instruction}"
        )

        # 3. Call LLM
        client = get_llm_client()
        response_text = await client.generate(
            prompt=llm_prompt,
            system_prompt=self.system_prompt
        )

        # 4. Parse Structured Output
        try:
            json_match = re.search(r"```json\s*(.*?)\s*```", response_text, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group(1))
                return AgentOutput(
                    agent_name=self.name,
                    confidence=data.get("confidence", 0.7),
                    analysis=data.get("analysis", response_text),
                    recommendations=data.get("recommendations", []),
                    data_points=data.get("data_points", []),
                    sources_used=sources,
                    escalation_needed=data.get("escalation_needed", False)
                )
        except Exception:
            # Fallback if JSON parsing fails
            pass

        return AgentOutput(
            agent_name=self.name,
            confidence=0.7,
            analysis=response_text,
            sources_used=sources
        )

    @property
    @abstractmethod
    def domains(self) -> List[str]:
        """Functional domains covered by this agent."""
        ...

    @property
    @abstractmethod
    def tools(self) -> List[str]:
        """Tools available to this agent."""
        ...
