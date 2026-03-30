"""Tests del orquestador LangGraph."""
import pytest
from unittest.mock import AsyncMock, patch, MagicMock

from src.orchestrator.state import OrchestratorState, SubTask, TaskStatus


# --- Fixtures ---

@pytest.fixture
def simple_state():
    return OrchestratorState(original_task="Calcula el Setup Fee para 2 sucursales")


@pytest.fixture
def state_with_subtasks():
    return OrchestratorState(
        original_task="Analiza procesos y finanzas",
        subtasks=[
            SubTask(id="st-1", description="Análisis financiero", assigned_agent="financial", status=TaskStatus.ROUTED),
            SubTask(id="st-2", description="Mapeo de procesos", assigned_agent="process", status=TaskStatus.ROUTED),
        ],
    )


# --- Tests del estado ---

class TestOrchestratorState:
    def test_default_status_is_pending(self, simple_state):
        assert simple_state.status == TaskStatus.PENDING

    def test_empty_subtasks_by_default(self, simple_state):
        assert simple_state.subtasks == []

    def test_subtask_depends_on_default_empty(self):
        st = SubTask(id="st-1", description="test", assigned_agent="financial")
        assert st.depends_on == []


# --- Tests del decomposer ---

class TestDecomposer:
    @pytest.mark.asyncio
    async def test_decompose_returns_updated_fields(self, simple_state):
        mock_response = '{"subtasks": [{"id": "st-1", "description": "Calcula Setup Fee", "assigned_agent": "financial", "priority": 1, "depends_on": []}], "execution_plan": "Tarea única financiera"}'

        with patch("src.orchestrator.nodes.decomposer.get_llm_client") as mock_factory:
            mock_llm = AsyncMock()
            mock_llm.generate = AsyncMock(return_value=mock_response)
            mock_factory.return_value = mock_llm

            from src.orchestrator.nodes.decomposer import decompose
            result = await decompose(simple_state)

        assert "subtasks" in result
        assert len(result["subtasks"]) == 1
        assert result["subtasks"][0].assigned_agent == "financial"
        assert result["status"] == TaskStatus.DECOMPOSED

    @pytest.mark.asyncio
    async def test_decompose_fallback_on_invalid_json(self, simple_state):
        with patch("src.orchestrator.nodes.decomposer.get_llm_client") as mock_factory:
            mock_llm = AsyncMock()
            mock_llm.generate = AsyncMock(return_value="esto no es json")
            mock_factory.return_value = mock_llm

            from src.orchestrator.nodes.decomposer import decompose
            result = await decompose(simple_state)

        # Fallback genera una subtarea
        assert len(result["subtasks"]) == 1
        assert result["subtasks"][0].id == "st-1"


# --- Tests del router ---

class TestRouter:
    @pytest.mark.asyncio
    async def test_route_marks_valid_agents_as_routed(self, state_with_subtasks):
        mock_registry = MagicMock()
        mock_registry.list_agents.return_value = ["financial", "process", "data_engineer"]
        mock_registry.get.return_value = MagicMock()

        with patch("src.orchestrator.nodes.router.AgentRegistry", mock_registry):
            from src.orchestrator.nodes.router import route
            result = await route(state_with_subtasks)

        assert result["status"] == TaskStatus.ROUTED
        for st in result["subtasks"]:
            assert st.status == TaskStatus.ROUTED

    @pytest.mark.asyncio
    async def test_route_reassigns_unknown_agent(self):
        state = OrchestratorState(
            original_task="Test",
            subtasks=[
                SubTask(id="st-1", description="análisis de datos", assigned_agent="nonexistent", status=TaskStatus.PENDING),
            ],
        )

        mock_registry = MagicMock()
        mock_registry.list_agents.return_value = ["financial", "process", "data_engineer"]

        with patch("src.orchestrator.nodes.router.AgentRegistry", mock_registry):
            from src.orchestrator.nodes.router import route
            result = await route(state)

        # Debe haber un error registrado sobre la reasignación
        assert len(result["errors"]) > 0


# --- Tests del quality_gate ---

class TestQualityGate:
    @pytest.mark.asyncio
    async def test_quality_passes_with_high_confidence(self):
        state = OrchestratorState(
            original_task="test",
            subtasks=[
                SubTask(id="st-1", description="t", assigned_agent="financial",
                        status=TaskStatus.COMPLETED, confidence=0.9),
            ],
            agent_outputs={"st-1": "Análisis completo sin fórmulas internas."},
        )

        from src.orchestrator.nodes.quality_gate import quality_check
        result = await quality_check(state)

        assert result["quality_passed"] is True
        assert result["status"] == TaskStatus.SYNTHESIZING

    @pytest.mark.asyncio
    async def test_quality_retries_with_low_confidence(self):
        state = OrchestratorState(
            original_task="test",
            subtasks=[
                SubTask(id="st-1", description="t", assigned_agent="financial",
                        status=TaskStatus.COMPLETED, confidence=0.3),
            ],
            agent_outputs={"st-1": "Resultado poco confiable"},
            global_retry_count=0,
            max_retries=2,
        )

        from src.orchestrator.nodes.quality_gate import quality_check
        result = await quality_check(state)

        assert result["quality_passed"] is False
        assert result["status"] == TaskStatus.RETRY
        assert result["global_retry_count"] == 1

    @pytest.mark.asyncio
    async def test_quality_fails_with_no_completed(self):
        state = OrchestratorState(
            original_task="test",
            subtasks=[
                SubTask(id="st-1", description="t", assigned_agent="financial",
                        status=TaskStatus.FAILED, confidence=0.0),
            ],
        )

        from src.orchestrator.nodes.quality_gate import quality_check
        result = await quality_check(state)

        assert result["quality_passed"] is False
        assert result["status"] == TaskStatus.FAILED

    @pytest.mark.asyncio
    async def test_g06_violation_detected(self):
        state = OrchestratorState(
            original_task="test",
            subtasks=[
                SubTask(id="st-1", description="t", assigned_agent="financial",
                        status=TaskStatus.COMPLETED, confidence=0.9,
                        result="El precio es Γ = 1.5 para este cliente"),
            ],
            agent_outputs={"st-1": "El precio es Γ = 1.5 para este cliente"},
        )

        from src.orchestrator.nodes.quality_gate import quality_check
        result = await quality_check(state)

        assert "G-06" in result["quality_feedback"]

    @pytest.mark.asyncio
    async def test_max_retries_exceeded_proceeds_to_synthesize(self):
        state = OrchestratorState(
            original_task="test",
            subtasks=[
                SubTask(id="st-1", description="t", assigned_agent="financial",
                        status=TaskStatus.COMPLETED, confidence=0.2),
            ],
            agent_outputs={"st-1": "resultado"},
            global_retry_count=2,
            max_retries=2,
        )

        from src.orchestrator.nodes.quality_gate import quality_check
        result = await quality_check(state)

        # Agotó retries, debe pasar a SYNTHESIZING de todos modos
        assert result["status"] == TaskStatus.SYNTHESIZING


# --- Tests del router — ciclo de dependencias ---

class TestCycleDetection:
    def test_has_cycle_detects_direct_cycle(self):
        from src.orchestrator.nodes.router import _has_cycle

        subtasks = [
            SubTask(id="st-1", description="a", assigned_agent="financial", depends_on=["st-2"]),
            SubTask(id="st-2", description="b", assigned_agent="process", depends_on=["st-1"]),
        ]
        assert _has_cycle(subtasks) is True

    def test_has_cycle_no_cycle(self):
        from src.orchestrator.nodes.router import _has_cycle

        subtasks = [
            SubTask(id="st-1", description="a", assigned_agent="financial", depends_on=[]),
            SubTask(id="st-2", description="b", assigned_agent="process", depends_on=["st-1"]),
        ]
        assert _has_cycle(subtasks) is False
