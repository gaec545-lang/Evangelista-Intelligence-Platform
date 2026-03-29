"""Configuración central del pipeline RAG de Evangelista & Co."""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Configuración cargada desde variables de entorno o archivo .env."""

    # Vault
    VAULT_PATH: str = "./evangelista-vault"

    # Qdrant
    # Modo "local" usa archivo en disco (sin Docker). Modo "server" usa host:port.
    QDRANT_MODE: str = "local"
    QDRANT_LOCAL_PATH: str = "./qdrant_storage"
    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: int = 6333
    QDRANT_COLLECTION: str = "evangelista_knowledge"

    # LLM Provider: "groq" | "ollama" | "anthropic"
    LLM_PROVIDER: str = "groq"

    # Groq (dev)
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"

    # Ollama (prod)
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "qwen2.5:32b"
    OLLAMA_EMBED_MODEL: str = "nomic-embed-text"

    # Anthropic (fallback)
    ANTHROPIC_API_KEY: str = ""
    ANTHROPIC_MODEL: str = "claude-sonnet-4-5-20251022"

    # Embeddings
    EMBED_PROVIDER: str = "ollama"
    EMBED_MODEL: str = "nomic-embed-text"
    EMBED_DIMENSIONS: int = 768

    # Chunking
    CHUNK_MIN_LENGTH: int = 100
    CHUNK_MAX_LENGTH: int = 2000
    CHUNK_OVERLAP: int = 0

    # Retrieval
    RETRIEVAL_TOP_K: int = 10
    RETRIEVAL_FINAL_K: int = 5
    RERANKER_ENABLED: bool = False

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache
def get_settings() -> Settings:
    """Retorna la instancia singleton de Settings."""
    return Settings()


settings = get_settings()
