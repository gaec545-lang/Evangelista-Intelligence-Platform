import { useEffect, useRef, useState } from 'react';

interface GraphVisualizerProps {
  mermaid: string;
  title?: string;
  nodeHistory?: string[];
  className?: string;
}

export default function GraphVisualizer({ mermaid, title, nodeHistory, className }: GraphVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !mermaid) return;

    // Carga dinámica de Mermaid.js desde CDN para evitar problemas de bundling
    import('https://esm.sh/mermaid@11/dist/mermaid.esm.min.mjs' as any).then(async (mod) => {
      const mermaidLib = mod.default;
      
      mermaidLib.initialize({
        startOnLoad: false,
        theme: 'base',
        fontFamily: 'system-ui, sans-serif',
        themeVariables: {
          darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
          fontSize: '13px',
          lineColor: '#6B7D5A',
          primaryColor: '#F5F0E8',
          primaryTextColor: '#2C2C2A',
          primaryBorderColor: '#4A5C3A',
          secondaryColor: '#E8E3D8',
          tertiaryColor: '#D4CFC4',
        },
      });

      const id = `mermaid-${Date.now()}`;
      try {
        const { svg } = await mermaidLib.render(id, mermaid);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          setRendered(true);
        }
      } catch (err) {
        console.error('Mermaid render error:', err);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<pre class="text-sm text-red-500 p-4 overflow-auto">${mermaid}</pre>`;
        }
      }
    });
  }, [mermaid]);

  return (
    <div className={`rounded-xl border border-surface-border bg-canvas-elevated overflow-hidden ${className || ''}`}>
      {title && (
        <div className="px-4 py-3 border-b border-[var(--eva-border)] flex items-center justify-between">
          <h3 className="text-sm font-medium text-[var(--eva-charcoal)]">{title}</h3>
          {nodeHistory && (
            <span className="text-xs text-[var(--eva-warm-gray)]">
              {nodeHistory.length} nodos recorridos
            </span>
          )}
        </div>
      )}
      <div 
        ref={containerRef} 
        className={`p-4 flex justify-center transition-opacity duration-300 [&>svg]:max-w-full [&>svg]:h-auto ${rendered ? 'opacity-100' : 'opacity-0'}`} 
      />
      
      {nodeHistory && nodeHistory.length > 0 && (
        <div className="px-4 py-2 border-t border-[var(--eva-border)] bg-[var(--eva-cream)]/50">
          <div className="flex flex-wrap gap-1.5">
            {nodeHistory.map((node, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--eva-olive)]/10 text-[var(--eva-olive)] font-medium">
                  {node}
                </span>
                {i < nodeHistory.length - 1 && (
                  <span className="text-[var(--eva-warm-gray)] text-xs">→</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
