# -*- coding: utf-8 -*-
"""Agents package initialization.
Imports specialist agents to ensure they are auto‑registered with AgentRegistry.
"""
from src.agents.registry import AgentRegistry
from src.agents.specialists import financial, process, data_engineer  # noqa: F401

__all__ = ["AgentRegistry"]
