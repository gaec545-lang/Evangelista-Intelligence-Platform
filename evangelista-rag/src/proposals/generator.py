"""Motor de generación de propuestas Foundation y Architecture."""
import math
import os
from datetime import datetime
from jinja2 import Environment, FileSystemLoader
from src.utils.logger import get_logger

logger = get_logger(__name__)

_TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "templates")


def _get_jinja_env() -> Environment:
    return Environment(
        loader=FileSystemLoader(_TEMPLATES_DIR),
        autoescape=False,
        trim_blocks=True,
        lstrip_blocks=True,
    )


def _calc_factors(client_data: dict) -> dict:
    """Calcula Factor Γ, α, β a partir de los datos del cliente."""
    sucursales = int(client_data.get("sucursales", 1))
    erps = int(client_data.get("sistemas_erp", 1))
    registros = int(client_data.get("registros", 100_000))
    beta = float(client_data.get("beta", 0.3))

    gamma = 1 + (0.5 * sucursales) + (0.2 * erps)
    alpha = math.log10(max(registros, 1)) - 4
    alpha = max(0.0, round(alpha, 2))

    return {"gamma": round(gamma, 2), "alpha": alpha, "beta": beta}


def _calc_foundation_fee(client_data: dict, alpha: float, beta: float) -> float:
    """Calcula el Foundation Fee según fórmula interna."""
    base = 35_000.0
    fee = base * (1 + alpha + beta)
    city = client_data.get("city", "Puebla")
    if city.strip().upper() not in ("PUEBLA", "PUE"):
        fee += 8_000  # Viáticos CDMX / fuera de Puebla
    return round(fee, -2)  # Redondear a centenas


def _calc_setup_fee(gamma: float) -> float:
    """Setup Fee = 80,000 × Γ (Architecture)."""
    return round(80_000 * gamma, -2)


def _calc_success_fee(setup_fee: float) -> float:
    """Success Fee = 25% del Setup Fee."""
    return round(setup_fee * 0.25, -2)


class ProposalGenerator:
    """Genera propuestas Foundation y Architecture en Markdown."""

    def __init__(self):
        self._env = _get_jinja_env()

    async def generate_foundation(self, client_data: dict) -> str:
        """
        Genera propuesta Foundation completa.

        Args:
            client_data: dict con keys: name, sector, sucursales, sistemas_erp,
                         registros, city, contact_name, erp_type, beta (opcional)
        """
        factors = _calc_factors(client_data)
        foundation_fee = _calc_foundation_fee(client_data, factors["alpha"], factors["beta"])

        # Ejecutar agentes para enriquecer la propuesta
        financial_analysis = ""
        typical_findings = ""

        try:
            from src.agents.registry import AgentRegistry
            import src.agents.specialists.financial  # noqa: F401
            import src.agents.specialists.process    # noqa: F401

            fin_agent = AgentRegistry.get("financial")
            fin_result = await fin_agent.execute(
                f"Calcula el ROI proyectado para una empresa de {client_data.get('sector', 'manufactura')} "
                f"con Factor Γ={factors['gamma']:.2f}. Foundation Fee: ${foundation_fee:,.0f} MXN. "
                f"Incluye tiempo de recuperación de inversión y ahorro operativo estimado."
            )
            financial_analysis = fin_result.analysis

            proc_agent = AgentRegistry.get("process")
            proc_result = await proc_agent.execute(
                f"¿Cuáles son los 3-5 hallazgos más frecuentes en The Foundation para el sector "
                f"{client_data.get('sector', 'manufactura')}? Describe brevemente cada uno."
            )
            typical_findings = proc_result.analysis
        except Exception as e:
            logger.warning("proposal_agent_enrichment_failed", error=str(e))
            financial_analysis = "Análisis financiero no disponible (backend sin conexión al LLM)."
            typical_findings = "Hallazgos típicos no disponibles."

        template = self._env.get_template("foundation.md.jinja2")
        return template.render(
            client=client_data,
            gamma=factors["gamma"],
            alpha=factors["alpha"],
            beta=factors["beta"],
            foundation_fee=foundation_fee,
            financial_analysis=financial_analysis,
            typical_findings=typical_findings,
            date=datetime.now().strftime("%d/%m/%Y"),
        )

    async def generate_architecture(self, client_data: dict, dictamen_hallazgos: list) -> str:
        """
        Genera propuesta Architecture basada en hallazgos del Dictamen.

        Args:
            client_data: dict con datos del cliente
            dictamen_hallazgos: lista de hallazgos del Dictamen Foundation
        """
        factors = _calc_factors(client_data)
        setup_fee = _calc_setup_fee(factors["gamma"])
        success_fee = _calc_success_fee(setup_fee)

        financial_analysis = ""
        try:
            from src.agents.registry import AgentRegistry
            import src.agents.specialists.financial  # noqa: F401
            fin_agent = AgentRegistry.get("financial")
            fin_result = await fin_agent.execute(
                f"Analiza el ROI de un proyecto Architecture para {client_data.get('sector', 'manufactura')} "
                f"con Setup Fee=${setup_fee:,.0f} MXN, Success Fee=${success_fee:,.0f} MXN, Γ={factors['gamma']:.2f}. "
                f"Hallazgos a resolver: {', '.join(dictamen_hallazgos[:3]) if dictamen_hallazgos else 'optimización de procesos'}."
            )
            financial_analysis = fin_result.analysis
        except Exception as e:
            logger.warning("proposal_architecture_agent_failed", error=str(e))
            financial_analysis = "Análisis financiero no disponible."

        # Cronograma por Γ: semanas = ceil(8 * gamma)
        semanas = math.ceil(8 * factors["gamma"])

        template = self._env.get_template("architecture.md.jinja2")
        return template.render(
            client=client_data,
            gamma=factors["gamma"],
            setup_fee=setup_fee,
            success_fee=success_fee,
            total_fee=setup_fee + success_fee,
            semanas=semanas,
            hallazgos=dictamen_hallazgos,
            financial_analysis=financial_analysis,
            date=datetime.now().strftime("%d/%m/%Y"),
        )
