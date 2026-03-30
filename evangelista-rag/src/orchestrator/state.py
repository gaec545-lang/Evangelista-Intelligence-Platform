"""Estado compartido del grafo LangGraph."""
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class TaskStatus(str, Enum):
    PENDING = "pending"
    DECOMPOSED = "decomposed"
    ROUTED = "routed"
    EXECUTING = "executing"
    QUALITY_CHECK = "quality_check"
    RETRY = "retry"
    SYNTHESIZING = "synthesizing"
    COMPLETED = "completed"
    FAILED = "failed"


class SubTask(BaseModel):
    """Subtarea asignada a un agente específico."""
    id: str
    description: str
    assigned_agent: str
    priority: int = 1                       # 1=alta, 2=media, 3=baja
    depends_on: list[str] = Field(default_factory=list)
    status: TaskStatus = TaskStatus.PENDING
    result: Optional[str] = None
    confidence: float = 0.0
    retry_count: int = 0


class OrchestratorState(BaseModel):
    """Estado completo del grafo. Viaja por todos los nodos."""

    # Input
    original_task: str
    context: dict = Field(default_factory=dict)

    # Decomposition
    subtasks: list[SubTask] = Field(default_factory=list)
    execution_plan: str = ""

    # Execution
    agent_outputs: dict[str, str] = Field(default_factory=dict)

    # Quality
    quality_passed: bool = False
    quality_feedback: str = ""
    global_retry_count: int = 0
    max_retries: int = 2

    # Synthesis
    final_response: str = ""
    sources_used: list[str] = Field(default_factory=list)
    total_confidence: float = 0.0

    # Meta
    status: TaskStatus = TaskStatus.PENDING
    errors: list[str] = Field(default_factory=list)
    execution_time_ms: int = 0
