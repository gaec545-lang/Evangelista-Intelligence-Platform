import { Project, Hypothesis, Finding, InterviewNote } from './types';

interface ProjectContext {
  project: Project;
  client: { name: string; sector: string };
  hypotheses: Hypothesis[];
  findings: Finding[];
  recentNotes: InterviewNote[];
}

export const buildSystemPrompt = (ctx: ProjectContext): string => {
  const { project, client, hypotheses, findings, recentNotes } = ctx;

  const hypothesesText = hypotheses.length > 0
    ? hypotheses.map(h =>
        `- [${h.id.slice(0,4).toUpperCase()}] ${h.statement} (${h.status}, Framework: ${h.framework_used ?? 'N/A'})` +
        (h.impact_score ? ` — Impacto: $${h.impact_score.toLocaleString('es-MX')} MXN/año` : '')
      ).join('\n')
    : 'Sin hipótesis registradas aún.';

  const findingsText = findings.length > 0
    ? findings.map(f =>
        `- [${f.folio}] ${f.title} — Severidad: ${f.severity}` +
        (f.economic_impact ? ` — Impacto: $${f.economic_impact.toLocaleString('es-MX')} MXN/año` : '')
      ).join('\n')
    : 'Sin hallazgos registrados aún.';

  const notesText = recentNotes.length > 0
    ? recentNotes.slice(0, 2).map(n =>
        `[${n.session_title} — ${new Date(n.captured_at).toLocaleDateString('es-MX')}]\n${n.content.slice(0, 500)}...`
      ).join('\n---\n')
    : 'Sin notas de entrevista registradas.';

  const totalImpact = findings.reduce((sum, f) => sum + (f.economic_impact ?? 0), 0);

  return `
Eres el agente de inteligencia de negocio de Evangelista & Co., una firma de consultoría de inteligencia de datos con sede en Puebla, México.

PROYECTO ACTIVO
───────────────
Nombre: ${project.name}
Cliente: ${client.name}
Sector: ${client.sector ?? 'No especificado'}
Área de análisis: ${project.area}
Estado: ${project.status}
Impacto total cuantificado: $${totalImpact.toLocaleString('es-MX')} MXN/año

HIPÓTESIS REGISTRADAS (${hypotheses.length})
───────────────────────────────────────────
${hypothesesText}

HALLAZGOS FORENSES (${findings.length})
───────────────────────────────────────
${findingsText}

NOTAS DE ENTREVISTA RECIENTES
──────────────────────────────
${notesText}

FRAMEWORKS DISPONIBLES EN EVANGELISTA & CO.
────────────────────────────────────────────
Consultoría: MECE, Issue Trees, COI (Cost of Inaction), Pyramid Principle, Hypothesis-Driven
Datos: ALCOA+, Surgical Data Request, Kimball Dimensional Modeling, Data Contracts
Procesos: Six Sigma (DMAIC), Lean Manufacturing (VSM/Kaizen)
Control: COSO / ERM, Unit Economics
Medición: GQM (Goal-Question-Metric), The Binomio
Vigilancia: Vigilancia Predictiva (Sentinel)

REGLAS DE COMPORTAMIENTO
───────────────
1. Hablas en español de México, tono directo y profesional.
2. Cuando apliques un framework, nómbralo explícitamente.
3. Si calculas un impacto económico, muestra el razonamiento paso a paso.
4. Cuando formules hipótesis, usa estructura MECE: mutuamente excluyentes y colectivamente exhaustivas.
5. No inventes datos — solo usa los que están en el contexto del proyecto.
6. Si el consultor pide preparar una narrativa para el cliente, usa Pyramid Principle (conclusión primero).
7. Eres consciente del protocolo ALCOA+ — cuando hables de evidencia, menciona trazabilidad.
`.trim();
};

export const buildWelcomeMessage = (ctx: ProjectContext): string => {
  const { project, client, hypotheses, findings } = ctx;
  const total = findings.reduce((s, f) => s + (f.economic_impact ?? 0), 0);

  const parts: string[] = [
    `Hola. Soy el agente de inteligencia para el proyecto **${project.name}**.`,
    `Trabajo con el contexto completo de **${client.name}** en el área de **${project.area.replace('_', ' ')}**.`,
  ];

  if (hypotheses.length > 0) {
    const validated = hypotheses.filter(h => h.status === 'validada').length;
    parts.push(`Tengo ${hypotheses.length} hipótesis registradas (${validated} validadas).`);
  }

  if (findings.length > 0) {
    parts.push(`Conozco ${findings.length} hallazgo${findings.length !== 1 ? 's' : ''} con un impacto total de **$${total.toLocaleString('es-MX')} MXN/año**.`);
  }

  parts.push('¿En qué te ayudo? Puedo estructurar hipótesis, calcular impactos, formular argumentos ejecutivos o preparar narrativas para el cliente.');

  return parts.join('\n\n');
};
