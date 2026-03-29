"""Modelos de datos del pipeline RAG."""
from .document import VaultDocument
from .chunk import Chunk, SearchResult

__all__ = ["VaultDocument", "Chunk", "SearchResult"]
