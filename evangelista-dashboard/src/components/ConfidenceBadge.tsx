import Badge from './ui/Badge';

export function ConfidenceBadge({ value, size = 'sm' }: { value: number, size?: 'sm' | 'md' }) {
  const pct = Math.round(value * 100);
  
  const getVariant = (): 'success' | 'warning' | 'danger' => {
    if (pct >= 85) return 'success';
    if (pct >= 65) return 'warning';
    return 'danger';
  };

  const getLabel = () => {
    if (pct >= 85) return 'Precisión Alta';
    if (pct >= 65) return 'Confiable';
    return 'Revisar';
  };

  return (
    <Badge variant={getVariant()} size={size} dot={true}>
      {getLabel()} <span className="ml-1 opacity-60 tabular-nums">{pct}%</span>
    </Badge>
  );
}
