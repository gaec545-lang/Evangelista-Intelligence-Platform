import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface VettingCheckProps {
  label: string;
  passed: boolean | null;
  value?: string;
  onToggle?: (passed: boolean) => void;
}

export function VettingCheck({ label, passed, value, onToggle }: VettingCheckProps) {
  return (
    <div
      className={`p-5 rounded-xl border-2 transition-all ${
        passed === true
          ? 'border-primary-500/30 bg-primary-500/5'
          : passed === false
            ? 'border-danger/30 bg-danger/5'
            : 'border-white/[0.06] bg-canvas-elevated'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-content-primary">{label}</p>
        {passed === true && <CheckCircle size={20} className="text-primary-500" />}
        {passed === false && <XCircle size={20} className="text-danger" />}
        {passed === null && <AlertTriangle size={20} className="text-content-secondary" />}
      </div>
      {value && (
        <p className="text-2xl font-bold mb-2 text-content-primary">{value}</p>
      )}
      {passed === null && onToggle && (
        <div className="flex gap-2">
          <button
            onClick={() => onToggle(true)}
            className="flex-1 py-2 rounded-lg bg-primary-500/10 text-primary-500 font-semibold text-sm hover:bg-primary-500/20 transition-colors border border-primary-500/20"
          >
            Cumple
          </button>
          <button
            onClick={() => onToggle(false)}
            className="flex-1 py-2 rounded-lg bg-danger/10 text-danger font-semibold text-sm hover:bg-danger/20 transition-colors border border-danger/20"
          >
            No cumple
          </button>
        </div>
      )}
    </div>
  );
}
