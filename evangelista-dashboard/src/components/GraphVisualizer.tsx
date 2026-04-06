import { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

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
        securityLevel: 'loose',
        flowchart: {
          htmlLabels: true,
          padding: 12,
        },
        themeVariables: {
          darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
          fontSize: '11px',
          lineColor: '#6B7D5A',
          primaryColor: '#F5F0E8',
          primaryTextColor: '#2C2C2A',
          primaryBorderColor: '#4A5C3A',
          secondaryColor: '#E8E3D8',
          tertiaryColor: '#D4CFC4',
          edgeLabelBackground: '#000',
          edgeLabelColor: '#fff',
        },
      });

      const id = `mermaid-${Date.now()}`;
      try {
        const { svg } = await mermaidLib.render(id, mermaid);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;

          // Inyectar <style> al contenedor — aplica tanto a SVG como a foreignObject HTML
          const style = document.createElement('style');
          style.textContent = `
            .edgeLabel { background: #000 !important; color: #fff !important; }
            .edgeLabel rect { fill: #000 !important; stroke: #333 !important; }
            .edgeLabel text { fill: #fff !important; }
            .edgeLabel .label { background: #000 !important; color: #fff !important; }
            .edgeLabel .label span { background: #000 !important; color: #fff !important; }
            .edgeLabel div { background: #000 !important; color: #fff !important; }
          `;
          containerRef.current.prepend(style);

          const svgEl = containerRef.current.querySelector('svg');
          if (svgEl) {
            // Overwrite fill atributos inline en rects de edge labels (ganan sobre CSS en SVG)
            svgEl.querySelectorAll<Element>('.edgeLabel').forEach((el) => {
              el.querySelectorAll('rect').forEach((r) => {
                r.setAttribute('fill', '#000');
                r.setAttribute('stroke', '#333');
              });
              el.querySelectorAll('text').forEach((t) => {
                t.setAttribute('fill', '#fff');
              });
            });
          }

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
        <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
          <h3 className="text-sm font-medium text-[#F5F5F7]">{title}</h3>
          {nodeHistory && (
            <span className="text-xs text-[#A1A1A6]">
              {nodeHistory.length} nodos recorridos
            </span>
          )}
        </div>
      )}

      {/* Pan & Zoom canvas */}
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={5}
        wheel={{ step: 0.1 }}
        panning={{ disabled: false, velocityDisabled: false }}
        pinch={{ step: 5 }}
        doubleClick={{ disabled: true }}
        limitToBounds={false}
      >
        {({ zoomIn, zoomOut, resetTransform, setTransform }) => (
          <>
            {/* Zoom controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-1.5 py-1 border border-white/10">
              <button
                onClick={() => zoomIn(0.15)}
                className="flex items-center justify-center w-7 h-7 text-white/80 hover:text-white hover:bg-white/10 rounded text-sm"
                title="Zoom in"
              >
                +
              </button>
              <button
                onClick={() => zoomOut(0.15)}
                className="flex items-center justify-center w-7 h-7 text-white/80 hover:text-white hover:bg-white/10 rounded text-sm"
                title="Zoom out"
              >
                −
              </button>
              <button
                onClick={() => { resetTransform(); }}
                className="flex items-center justify-center w-7 h-7 text-white/80 hover:text-white hover:bg-white/10 rounded text-[10px]"
                title="Centrar"
              >
                ⊙
              </button>
            </div>

            <TransformComponent
              wrapperStyle={{
                width: '100%',
                height: '600px',
                overflow: 'hidden',
              }}
            >
              <div
                ref={containerRef}
                className={`p-4 flex justify-center transition-opacity duration-300 [&>svg]:max-w-full [&>svg]:h-auto ${rendered ? 'opacity-100' : 'opacity-0'}`}
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {nodeHistory && nodeHistory.length > 0 && (
        <div className="px-4 py-2 border-t border-[rgba(255,255,255,0.08)] bg-[#0D0D0F]/50">
          <div className="flex flex-wrap gap-1.5">
            {nodeHistory.map((node, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                <span className="px-2 py-0.5 text-xs rounded-full bg-[#95B877]/10 text-[#95B877] font-medium">
                  {node}
                </span>
                {i < nodeHistory.length - 1 && (
                  <span className="text-[#A1A1A6] text-xs">→</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
