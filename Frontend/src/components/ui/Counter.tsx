import { useEffect, useState, useRef } from 'react';

interface CounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function Counter({ 
  target, 
  duration = 800, 
  prefix = '', 
  suffix = '',
  className = ''
}: CounterProps) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Reset for new targets
    startTime.current = null;
    
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      
      const currentCount = Math.round(eased * target);
      setCount(currentCount);

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    rafId.current = requestAnimationFrame(animate);
    
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [target, duration]);

  return (
    <span className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}
