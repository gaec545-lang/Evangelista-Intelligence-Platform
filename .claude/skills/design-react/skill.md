---
name: design-react
description: >
  Genera componentes React con diseño premium usando Tailwind CSS
  y el design system Eva de Evangelista & Co. Incluye patrones
  visuales, animaciones, y responsive design.
triggers:
  - diseña el componente
  - crea la UI
  - mejora el diseño visual
  - estilo Apple
  - estilo Manus
---

# Design React — Componentes UI Premium

## Cómo usar

Este skill carga automáticamente cuando se necesita crear o mejorar
interfaces de usuario. El Designer agent lo usa como referencia.

## Referencia rápida de patrones

Ver `references/design-patterns.md` para la lista completa de patrones
del design system Eva.

## Ejemplo completo — Stat Card animado
```tsx
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  accent?: 'foundation' | 'architecture' | 'sentinel';
}

export function StatCard({ label, value, change, accent }: StatCardProps) {
  const accentBorder = accent ? `border-l-3 border-eva-${accent}` : '';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-eva-white rounded-card border border-eva-sand/40 shadow-card p-4 ${accentBorder}`}
    >
      {label}
      {value}
      {change && {change}}
    
  );
}
```
