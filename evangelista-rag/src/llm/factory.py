"""Factory de clientes LLM — cambia de provider con 1 variable de entorno."""
from src.llm.base import LLMClient
from src.config import settings
from src.utils.logger import get_logger

logger = get_logger(__name__)


def get_llm_client(provider: str | None = None) -> LLMClient:
    """
    Retorna el cliente LLM configurado según LLM_PROVIDER en .env.
    Cambiar de Groq a Ollama = cambiar 1 variable de entorno.
    """
    resolved = provider or settings.LLM_PROVIDER
    logger.info("creando_llm_client", provider=resolved)

    match resolved:
        case "groq":
            from src.llm.groq_client import GroqClient
            return GroqClient(api_key=settings.GROQ_API_KEY, model=settings.GROQ_MODEL)

        case "ollama":
            from src.llm.ollama_client import OllamaClient
            return OllamaClient(
                base_url=settings.OLLAMA_BASE_URL,
                model=settings.OLLAMA_MODEL,
                embed_model=settings.OLLAMA_EMBED_MODEL,
            )

        case "anthropic":
            from src.llm.anthropic_client import AnthropicClient
            return AnthropicClient(
                api_key=settings.ANTHROPIC_API_KEY,
                model=settings.ANTHROPIC_MODEL,
            )

        case _:
            raise ValueError(
                f"Provider LLM desconocido: '{resolved}'. Opciones: groq, ollama, anthropic"
            )
