interface FactorCardProps {
  label: string;
  value: number | null;
  threshold: number;
  isGreater: boolean; // true = green if value >= threshold, false = green if value < threshold
  formula: string;
  unit?: string;
}

export function FactorCard({ label, value, threshold, isGreater, formula, unit = '' }: FactorCardProps) {
  const viable = value !== null
    ? isGreater
      ? value >= threshold
      : value < threshold
    : false;

  return (
    <div className={`p-4 rounded-xl border-2 transition-all ${
      viable
        ? 'border-primary-500/30 bg-primary-500/5'
        : value !== null
          ? 'border-danger/30 bg-danger/5'
          : 'border-white/[0.06] bg-white/[0.02]'
    }`}>
      <p className="text-xs font-bold text-primary-500 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-bold mt-2 text-content-primary">
        {value !== null ? `${value.toFixed(2)}${unit}` : '—'}
      </p>
      <p className="text-[10px] text-content-secondary mt-1 font-mono">{formula}</p>
      {value !== null && (
        <p className={`text-xs font-semibold mt-1 ${viable ? 'text-primary-500' : 'text-danger/70'}`}>
          {viable ? 'Viable' : 'Por debajo del umbral'}
        </p>
      )}
    </div>
  );
}
