"""Route del orquestador: POST /api/v1/analyze."""
from fastapi import APIRouter, HTTPException
from src.api.schemas.requests import AnalyzeRequest, AnalyzeResponse
from src.utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    """Ejecuta el orquestador completo para una tarea y retorna la respuesta sintetizada."""
    logger.info("analyze_request", task=request.task[:80])

    try:
        from src.orchestrator.graph import run_orchestrator
        state = await run_orchestrator(task=request.task, context=request.context)
    except Exception as e:
        logger.error("orchestrator_error", error=str(e))
        raise HTTPException(status_code=500, detail=f"Error en orquestador: {str(e)}")

    subtasks_summary = [
        {
            "id": st.id,
            "agent": st.assigned_agent,
            "status": st.status.value,
            "confidence": st.confidence,
        }
        for st in state.subtasks
    ]

    return AnalyzeResponse(
        status=state.status.value,
        response=state.final_response,
        confidence=state.total_confidence,
        sources=state.sources_used,
        execution_time_ms=state.execution_time_ms,
        errors=state.errors,
        subtasks=subtasks_summary,
    )
