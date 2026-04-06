import { CheckCircle, Circle, Clock } from 'lucide-react';

interface Step {
  label: string;
  completed: boolean;
  active: boolean;
  date?: string;
}

interface StatusStepperProps {
  steps: Step[];
}

export default function StatusStepper({ steps }: StatusStepperProps) {
  return (
    <div className="flex items-start gap-0">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-start">
          {/* Step node */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                step.completed
                  ? 'bg-primary-500 text-canvas'
                  : step.active
                    ? 'bg-primary-500/10 border-2 border-primary-500 text-primary-500'
                    : 'bg-white/[0.03] text-content-secondary'
              }`}
            >
              {step.completed ? (
                <CheckCircle size={18} />
              ) : step.active ? (
                <Clock size={18} className="animate-pulse" />
              ) : (
                <Circle size={16} />
              )}
            </div>
            <span
              className={`text-xs font-medium text-center w-24 ${
                step.completed
                  ? 'text-content-primary'
                  : step.active
                    ? 'text-primary-500'
                    : 'text-content-secondary'
              }`}
            >
              {step.label}
            </span>
            {step.date && (
              <span className="text-[10px] text-content-secondary text-center">
                {new Date(step.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
              </span>
            )}
          </div>

          {/* Connector line */}
          {i < steps.length - 1 && (
            <div
              className={`w-16 h-0.5 mt-5 ${
                steps[i + 1].completed ? 'bg-primary-500' : 'bg-white/[0.06]'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
