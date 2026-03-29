"""Modelos de chunk e resultado de búsqueda."""
from pydantic import BaseModel, Field
import uuid


class Chunk(BaseModel):
    """Fragmento de documento listo para vectorizar e indexar en Qdrant."""

    chunk_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    document_id: str
    document_title: str
    section_header: str
    content: str

    # Metadata heredada del documento padre
    type: str
    domain: list[str]
    sector: list[str]
    agent_access: list[str]
    confidence: str
    source: str
    tags: list[str]
    file_hash: str

    # Embedding (se llena después de generar)
    embedding: list[float] = Field(default_factory=list)

    # Posición en el documento
    chunk_index: int
    total_chunks: int


class SearchResult(BaseModel):
    """Resultado de una búsqueda en el vector store."""

    chunk_id: str
    document_id: str
    document_title: str
    section_header: str
    content: str
    score: float
    metadata: dict
