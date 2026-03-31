"""FastAPI app principal — Evangelista Intelligence Platform."""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.utils.logger import get_logger
from src.utils.qdrant import close_qdrant_client

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: registrar agentes y verificar servicios. Shutdown: cleanup."""
    logger.info("api_startup")

    # Importar especialistas para disparar auto-registro
    import src.agents.specialists.financial      # noqa: F401
    import src.agents.specialists.process        # noqa: F401
    import src.agents.specialists.data_engineer  # noqa: F401
    import src.agents.specialists.analyst        # noqa: F401  # type: ignore[import]
    import src.agents.specialists.risk           # noqa: F401  # type: ignore[import]

    from src.agents.registry import AgentRegistry
    agents = AgentRegistry.list_agents()
    logger.info("agents_registered", agents=agents)

    yield

    logger.info("api_shutdown")
    close_qdrant_client()


app = FastAPI(
    title="Evangelista Intelligence Platform",
    version="1.0.0",
    description="Orquestador de agentes especialistas para consultoría estratégica.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware de logging
from src.api.middleware.logging import RequestLoggingMiddleware
app.add_middleware(RequestLoggingMiddleware)

# Routes
from src.api.routes import health, orchestrator, agents, knowledge
from src.api.routes import proposals  # type: ignore[attr-defined]

app.include_router(health.router, tags=["Health"])
app.include_router(orchestrator.router, prefix="/api/v1", tags=["Orchestrator"])
app.include_router(agents.router, prefix="/api/v1", tags=["Agents"])
app.include_router(knowledge.router, prefix="/api/v1", tags=["Knowledge"])
app.include_router(proposals.router, prefix="/api/v1", tags=["Proposals"])
