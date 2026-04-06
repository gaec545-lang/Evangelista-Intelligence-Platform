import { api } from './api';

// Cada función corresponde a un BOTÓN en la war room.
// El consultor ve el botón. El agente trabaja invisible.

export const agentActions = {

  // === FOUNDATION ===

  async calcularPricing(datos: {
    sucursales: number;
    sistemas_erp: number;
    registros: number;
    fuentes_manuales: number;
    fuentes_rotas: number;
    fuentes_total: number;
    requiere_viaticos: boolean;
  }) {
    // Invoca FinancialAgent via grafo RAG
    const prompt = `Calcula el pricing Foundation para un cliente con:
- ${datos.sucursales} sucursales/plantas
- ${datos.sistemas_erp} sistemas ERP
- ${datos.registros} registros estimados
- ${datos.fuentes_manuales} fuentes manuales, ${datos.fuentes_rotas} fuentes con integridad comprometida, ${datos.fuentes_total} fuentes totales
- Viáticos: ${datos.requiere_viaticos ? 'Sí (fuera de Puebla)' : 'No'}

Calcula Factor Γ, Factor α, Factor β, y el Foundation Fee desglosado.`;

    return api.analyze({ task: prompt, context: { service: 'foundation', action: 'pricing' } });
  },

  async generarDictamen(engagement: {
    cliente_nombre: string;
    sector: string;
    nodo_critico: string;
    hallazgos: Array<{ id: string; nombre: string; costo_anual: number; criticidad: string; metodo_deteccion: string; descripcion: string }>;
    total_impacto: number;
    factor_gamma: number;
  }) {
    const hallazgosList = engagement.hallazgos.map(h => 
      `- ${h.id}: ${h.nombre} | Costo: $${h.costo_anual.toLocaleString()} MXN | Criticidad: ${h.criticidad} | Método: ${h.metodo_deteccion} | ${h.descripcion}`
    ).join('\n');

    const prompt = `Genera un Dictamen Forense completo para:
Cliente: ${engagement.cliente_nombre}
Sector: ${engagement.sector}
Nodo crítico: ${engagement.nodo_critico}
Factor Γ: ${engagement.factor_gamma}

Hallazgos identificados:
${hallazgosList}

Impacto total anual: $${engagement.total_impacto.toLocaleString()} MXN

Genera el dictamen siguiendo el protocolo ALCOA+ de Evangelista & Co. con:
1. Resumen ejecutivo para DG y CFO
2. Tabla resumen de hallazgos con criticidad
3. Detalle técnico de cada hallazgo
4. Vetting Gate: evaluación GO/NO-GO
5. Recomendaciones si procede Architecture`;

    return api.analyze({ task: prompt, context: { service: 'foundation', action: 'dictamen' } });
  },

  async generarPropuestaFoundation(engagement: {
    cliente_nombre: string;
    sector: string;
    nodo_critico: string;
    factor_gamma: number;
    foundation_fee: number;
  }) {
    const prompt = `Genera la propuesta comercial Foundation para:
Cliente: ${engagement.cliente_nombre}
Sector: ${engagement.sector}
Nodo crítico: ${engagement.nodo_critico}
Factor Γ: ${engagement.factor_gamma}
Foundation Fee: $${engagement.foundation_fee.toLocaleString()} MXN

Usa el formato oficial de Evangelista & Co. Incluye: contexto, metodología ALCOA+, alcance, entregables, inversión desglosada, condiciones, y siguiente paso.`;

    return api.analyze({ task: prompt, context: { service: 'foundation', action: 'proposal' } });
  },

  // === ARCHITECTURE ===

  async generarModeloDimensional(datos: {
    cliente_nombre: string;
    sector: string;
    nodo_critico: string;
    erp_type: string;
    hallazgos: string[];
  }) {
    const prompt = `Diseña el modelo dimensional (esquema estrella) para:
Cliente: ${datos.cliente_nombre} (${datos.sector})
ERP: ${datos.erp_type}
Nodo crítico: ${datos.nodo_critico}
Hallazgos a resolver: ${datos.hallazgos.join(', ')}

Genera: Fact tables, Dimension tables, columnas clave, y el script DDL para SQL Server.`;

    return api.analyze({ task: prompt, context: { service: 'architecture', action: 'model' } });
  },

  async generarETL(datos: {
    erp_type: string;
    fact_tables: string[];
    dim_tables: string[];
  }) {
    const prompt = `Genera los scripts ETL para extraer datos de ${datos.erp_type} hacia un Data Warehouse con:
Facts: ${datos.fact_tables.join(', ')}
Dimensions: ${datos.dim_tables.join(', ')}

Genera scripts SQL de extracción, transformación y carga. Incluir manejo de errores y logging.`;

    return api.analyze({ task: prompt, context: { service: 'architecture', action: 'etl' } });
  },

  async generarPropuestaArchitecture(engagement: {
    cliente_nombre: string;
    factor_gamma: number;
    setup_fee: number;
    hallazgos_resumen: string;
    total_ahorro: number;
  }) {
    const prompt = `Genera la propuesta comercial Architecture para:
Cliente: ${engagement.cliente_nombre}
Factor Γ: ${engagement.factor_gamma}
Setup Fee: $${engagement.setup_fee.toLocaleString()} MXN
Resumen de hallazgos del Dictamen: ${engagement.hallazgos_resumen}
Ahorro anual proyectado: $${engagement.total_ahorro.toLocaleString()} MXN

Calcula ROI, punto de equilibrio, desglose de tramos (70/30), y timeline por Γ. Usa formato oficial Evangelista.`;

    return api.analyze({ task: prompt, context: { service: 'architecture', action: 'proposal' } });
  },

  // === SENTINEL ===

  async generarAgendaJunta(datos: {
    cliente_nombre: string;
    kpis: Array<{ nombre: string; meta: number; actual: number; tendencia: string }>;
    alertas_activas: number;
  }) {
    const kpiList = datos.kpis.map(k => 
      `- ${k.nombre}: actual=${k.actual}, meta=${k.meta}, tendencia=${k.tendencia}`
    ).join('\n');

    const prompt = `Genera la agenda de Junta de Consejo mensual para:
Cliente: ${datos.cliente_nombre}
KPIs monitoreados:
${kpiList}
Alertas activas: ${datos.alertas_activas}

Incluir: análisis de tendencias, alertas que requieren atención, recomendaciones estratégicas, y acciones propuestas para el próximo mes.`;

    return api.analyze({ task: prompt, context: { service: 'sentinel', action: 'junta' } });
  },

  async generarReporteMensual(datos: {
    cliente_nombre: string;
    mes: string;
    kpis: Array<{ nombre: string; meta: number; actual: number }>;
  }) {
    const prompt = `Genera el Reporte Mensual Sentinel para:
Cliente: ${datos.cliente_nombre}
Período: ${datos.mes}
KPIs: ${JSON.stringify(datos.kpis)}

Formato: Resumen ejecutivo, KPIs vs meta con análisis, tendencias, alertas, recomendaciones tácticas.`;

    return api.analyze({ task: prompt, context: { service: 'sentinel', action: 'report' } });
  },

  async ejecutarMonteCarlo(datos: {
    client_id: string;
    variables: Record<string, number>;
    escenarios: number;
  }) {
    // Llama al endpoint de Monte Carlo del backend
    const res = await fetch(((import.meta as any).env?.VITE_API_URL || 'http://localhost:8000') + '/api/v1/monte-carlo/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: datos.client_id,
        variables: datos.variables,
        num_scenarios: datos.escenarios,
      })
    });
    return res.json();
  },
};
