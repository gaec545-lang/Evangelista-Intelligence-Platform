"""Modelo de documento parseado del Obsidian Vault."""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date


class VaultDocument(BaseModel):
    """Documento .md parseado del vault con su frontmatter YAML completo."""

    # Campos del frontmatter YAML
    id: str
    title: str
    type: str
    version: str = "1.0"
    domain: list[str] = Field(default_factory=list)
    sector: list[str] = Field(default_factory=list)
    agent_access: list[str] = Field(default_factory=list)
    confidence: str = "medium"
    source: str = "evangelista"
    last_validated: Optional[date] = None
    parent: Optional[str] = None
    related: list[str] = Field(default_factory=list)
    depends_on: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    status: str = "active"

    # Campos calculados por el parser
    file_path: str
    file_hash: str
    raw_content: str
