"""Motor de búsqueda RAG con filtros de seguridad por agente."""
from qdrant_client import QdrantClient
from qdrant_client.models import Filter

from src.models.chunk import SearchResult
from src.ingestion.embedder import Embedder
from src.retrieval.filters import (
    build_agent_filter,
    build_domain_filter,
    build_sector_filter,
    build_type_filter,
    combine_filters,
)
from src.retrieval.reranker import Reranker
from src.utils.logger import get_logger
from src.config import settings
from src.utils.qdrant import get_qdrant_client

logger = get_logger(__name__)


class QueryEngine:
    """
    Motor de búsqueda RAG con filtros de seguridad por agente.
    Cada búsqueda aplica el filtro de agent_access OBLIGATORIAMENTE.
    """

    def __init__(
        self,
        embedder: Embedder | None = None,
        collection: str = settings.QDRANT_COLLECTION,
        reranker_enabled: bool = settings.RERANKER_ENABLED,
    ) -> None:
        self.client = get_qdrant_client()
        self.collection = collection
        self.embedder = embedder or Embedder()
        self.reranker = Reranker(enabled=reranker_enabled)

    async def search(
        self,
        query: str,
        agent_name: str,
        domain_filter: list[str] | None = None,
        sector_filter: list[str] | None = None,
        type_filter: list[str] | None = None,
        top_k: int = settings.RETRIEVAL_TOP_K,
        final_k: int = settings.RETRIEVAL_FINAL_K,
    ) -> list[SearchResult]:
        """
        Busca chunks relevantes con filtros de seguridad por agente.
        El agent_name es OBLIGATORIO — define qué documentos puede ver este agente.
        """
        # 1. Generar embedding de la query
        query_embedding = await self.embedder.embed_single(query)

        # 2. Construir filtro de seguridad (siempre presente)
        filters: list[Filter] = [build_agent_filter(agent_name)]

        if domain_filter:
            filters.append(build_domain_filter(domain_filter))
        if sector_filter:
            filters.append(build_sector_filter(sector_filter))
        if type_filter:
            filters.append(build_type_filter(type_filter))

        combined_filter = combine_filters(*filters)

        # 3. Buscar en Qdrant
        try:
            hits = self.client.search(
                collection_name=self.collection,
                query_vector=query_embedding,
                query_filter=combined_filter,
                limit=top_k,
                with_payload=True,
            )
        except Exception as e:
            logger.error("error_buscando_en_qdrant", error=str(e))
            return []

        results = [
            SearchResult(
                chunk_id=hit.payload.get("chunk_id", ""),
                document_id=hit.payload.get("document_id", ""),
                document_title=hit.payload.get("document_title", ""),
                section_header=hit.payload.get("section_header", ""),
                content=hit.payload.get("content", ""),
                score=hit.score,
                metadata={k: v for k, v in hit.payload.items() if k != "content"},
            )
            for hit in hits
        ]

        # 4. Reranking opcional
        final_results = self.reranker.rerank(query, results, final_k)

        logger.info(
            "busqueda_completada",
            query=query[:80],
            agent=agent_name,
            resultados=len(final_results),
        )
        return final_results

    def format_context(self, results: list[SearchResult]) -> str:
        """Formatea los resultados como contexto para el LLM."""
        if not results:
            return "No se encontraron documentos relevantes en la base de conocimiento."

        parts = []
        for i, r in enumerate(results, 1):
            parts.append(
                f"[Fuente {i}] {r.document_title} — {r.section_header}\n"
                f"(Tipo: {r.metadata.get('type', 'N/A')} | Score: {r.score:.3f})\n\n"
                f"{r.content}"
            )
        return "\n\n---\n\n".join(parts)
