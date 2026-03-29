"""Generación de embeddings usando Ollama (nomic-embed-text en CPU)."""
import asyncio
import httpx
from src.utils.logger import get_logger
from src.config import settings

logger = get_logger(__name__)

BATCH_SIZE = 10


class Embedder:
    """Genera embeddings usando el modelo nomic-embed-text via Ollama."""

    def __init__(
        self,
        base_url: str = settings.OLLAMA_BASE_URL,
        model: str = settings.EMBED_MODEL,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.model = model

    async def embed_single(self, text: str) -> list[float]:
        """Genera el embedding de un texto individual."""
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{self.base_url}/api/embeddings",
                    json={"model": self.model, "prompt": text},
                )
                response.raise_for_status()
                return response.json()["embedding"]
        except httpx.HTTPError as e:
            logger.error("error_embedding", model=self.model, error=str(e))
            raise

    async def embed_batch(self, texts: list[str]) -> list[list[float]]:
        """
        Genera embeddings para un lote de textos.
        Procesa en batches de BATCH_SIZE para no saturar Ollama.
        """
        results: list[list[float]] = []
        for i in range(0, len(texts), BATCH_SIZE):
            batch = texts[i : i + BATCH_SIZE]
            embeddings = []
            for text in batch:
                emb = await self.embed_single(text)
                embeddings.append(emb)
            results.extend(embeddings)
            if i + BATCH_SIZE < len(texts):
                await asyncio.sleep(0.1)  # pausa breve entre batches

        logger.info("batch_embeddings_generados", total=len(results), model=self.model)
        return results

    async def health_check(self) -> bool:
        """Verifica que Ollama esté disponible y el modelo cargado."""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                response.raise_for_status()
                models = [m["name"] for m in response.json().get("models", [])]
                available = any(self.model in m for m in models)
                if not available:
                    logger.warning("modelo_no_encontrado", model=self.model, disponibles=models)
                return available
        except httpx.HTTPError as e:
            logger.error("ollama_no_disponible", error=str(e))
            return False
