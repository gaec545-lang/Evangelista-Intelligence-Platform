import { useState, useEffect } from "react";
import { Calendar, Check } from "lucide-react";
import StatusStepper from "./StatusStepper";

const STATUS_CITA_MAP = [
  { done: "cita_1_done", scheduled: "cita_1_scheduled" },
  { done: "cita_2_done", scheduled: "immersion" },
  { done: "cita_3_done", scheduled: "cita_3_scheduled" },
  { done: "cita_4_done", scheduled: "cita_4_scheduled" },
] as const;

const CITA_LABELS = [
  "Cita 1 — Scoping",
  "Cita 2 — Inmersión forense",
  "Cita 3 — Presentación dictamen",
  "Cita 4 — Sesión arquitectura",
];

const DATE_KEYS = [
  "cita_1_date",
  "cita_2_date",
  "cita_3_date",
  "cita_4_date",
] as const;

interface CitaPipelineProps {
  engagement: Record<string, unknown>;
  onUpdate: (updates: Record<string, unknown>) => void;
}

/**
 * Calcula qué citas deberían marcarse como completadas
 * basado en los datos existentes del engagement.
 */
function calculateAutoProgress(engagement: Record<string, unknown>) {
  const status = (engagement.status as string) ?? "";
  const alpha = Number(engagement.factor_alpha ?? 0);
  const beta = Number(engagement.factor_beta ?? 0);
  const gamma = Number(engagement.factor_gamma ?? 0);
  const fee = Number(engagement.foundation_fee ?? 0);
  const registros = Number(engagement.registros_estimados ?? 0);
  const nodeCritico = (engagement.nodo_critico as string) ?? "";
  const hallazgos = (engagement.hallazgos as []) ?? [];
  const hasScopingData = registros > 0 || fee > 0 || gamma !== 0;
  const hasDictamen = hallazgos.length > 0;

  // Auto-progress logic based on data
  let effectiveStatus = status;

  // Si ya guardaste scoping con datos reales -> cita_1_done
  if (hasScopingData && status === "scoping") {
    effectiveStatus = "cita_1_done";
  }

  // Si hay hallazgos -> al menos dictamen_review
  if (hasDictamen && !["cita_2_done", "dictamen_review", "cita_3_scheduled", "cita_3_done", "vetting_gate", "cita_4_scheduled", "cita_4_done", "closed_go", "closed_nogo", "closed_lost"].includes(status)) {
    effectiveStatus = "dictamen_review";
  }

  return effectiveStatus;
}

export default function CitaPipeline({
  engagement,
  onUpdate,
}: CitaPipelineProps) {
  const rawStatus = (engagement.status as string) ?? "";
  const status = calculateAutoProgress(engagement);

  // Auto-advance en el primer render si hay datos de scoping
  const [autoAdvanced, setAutoAdvanced] = useState(false);
  useEffect(() => {
    if (autoAdvanced || rawStatus !== "scoping") return;
    const registros = Number(engagement.registros_estimados ?? 0);
    const fee = Number(engagement.foundation_fee ?? 0);
    const gamma = Number(engagement.factor_gamma ?? 0);
    if (registros > 0 || fee > 0 || gamma !== 0) {
      onUpdate({ status: "cita_1_done", cita_1_date: new Date().toISOString().slice(0, 16) });
      setAutoAdvanced(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const STATUS_ORDER = STATUS_CITA_MAP.flatMap((m) => [m.scheduled, m.done]);
  const statusIndex = STATUS_ORDER.indexOf(status as (typeof STATUS_ORDER)[number]);

  const steps = STATUS_CITA_MAP.map((cita, i) => {
    const doneIndex = STATUS_ORDER.indexOf(cita.done);
    const scheduledIndex = STATUS_ORDER.indexOf(cita.scheduled);
    const completed = statusIndex >= doneIndex;
    const active = statusIndex === scheduledIndex || statusIndex === doneIndex;
    const pending = !completed && !active;
    const dateKey = DATE_KEYS[i];
    const dateVal = (engagement[dateKey] ?? "") as string;
    return {
      label: CITA_LABELS[i],
      completed,
      active,
      pending,
      date: dateVal || undefined,
      citaIndex: i,
    };
  });

  const [pickerOpen, setPickerOpen] = useState<number | null>(null);
  const activeStep = steps.find((s) => s.active) ?? null;

  const handleSchedule = (citaIndex: number, value: string) => {
    onUpdate({ [DATE_KEYS[citaIndex]]: value });
    setPickerOpen(null);
  };

  const handleComplete = (citaIndex: number) => {
    const cita = STATUS_CITA_MAP[citaIndex];
    const updates: Record<string, unknown> = { status: cita.done };
    const existingDate = (engagement[DATE_KEYS[citaIndex]] ?? "") as string;
    if (!existingDate) {
      updates[DATE_KEYS[citaIndex]] = new Date().toISOString().slice(0, 16);
    }
    onUpdate(updates);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/[0.06] bg-canvas-elevated p-4">
        <StatusStepper
          steps={steps.map(({ label, completed, active, date }) => ({
            label, completed, active, date,
          }))}
        />
      </div>

      {activeStep && (
        <div className="rounded-xl border border-primary-500/30 bg-canvas-elevated p-4 transition-all">
          <p className="text-sm font-medium text-content-primary mb-2">{activeStep.label}</p>
          <div className="flex items-center gap-3 flex-wrap">
            {activeStep.date ? (
              <>
                <span className="text-xs text-content-secondary">
                  Agendada:{" "}
                  {new Date(activeStep.date).toLocaleDateString("es-MX", {
                    day: "2-digit", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </span>
                <button
                  onClick={() => handleComplete(activeStep.citaIndex)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold text-canvas hover:bg-primary-500/90 transition-colors"
                >
                  <Check size={14} /> Completar
                </button>
              </>
            ) : pickerOpen === activeStep.citaIndex ? (
              <div className="flex items-center gap-2">
                <input
                  type="datetime-local"
                  className="rounded-lg border border-white/[0.06] bg-white/10 px-2 py-1.5 text-xs text-content-primary focus:outline-none focus:ring-1 focus:ring-primary-500"
                  autoFocus
                  onBlur={(e) => {
                    if (e.target.value) handleSchedule(activeStep.citaIndex, e.target.value);
                    else setPickerOpen(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value) handleSchedule(activeStep.citaIndex, e.currentTarget.value);
                    if (e.key === "Escape") setPickerOpen(null);
                  }}
                />
                <span className="text-[10px] text-content-secondary">Enter to confirm, Esc to cancel</span>
              </div>
            ) : (
              <button
                onClick={() => setPickerOpen(activeStep.citaIndex)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary-500 px-3 py-1.5 text-xs font-semibold text-primary-500 hover:bg-primary-500/10 transition-colors"
              >
                <Calendar size={14} /> Agendar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
