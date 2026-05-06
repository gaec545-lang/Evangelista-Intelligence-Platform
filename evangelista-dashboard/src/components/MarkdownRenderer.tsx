import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={`markdown-body ${className || ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Headers con estilo Evangelista
          h1: ({ children }) => (
            <h1 className="text-xl font-serif font-medium text-content-primary mt-6 mb-3 pb-2 border-b border-[rgba(255,255,255,0.08)]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-serif font-medium text-content-primary mt-5 mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium text-content-primary mt-4 mb-2">
              {children}
            </h3>
          ),
          
          // Párrafos con espaciado correcto
          p: ({ children }) => (
            <p className="text-sm leading-relaxed text-content-primary mb-3">
              {children}
            </p>
          ),
          
          // Tablas con estilo profesional
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-[rgba(255,255,255,0.08)]">
              <table className="w-full text-sm border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#95B877]/5 border-b border-[rgba(255,255,255,0.08)]">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2.5 text-left text-xs font-bold text-[#95B877] uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 text-sm text-content-primary border-t border-[rgba(255,255,255,0.08)]/50">
              {children}
            </td>
          ),
          
          // Listas
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-5 mb-3 space-y-1 text-sm text-content-primary">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-5 mb-3 space-y-1 text-sm text-content-primary">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          
          // Bloques de código
          pre: ({ children }) => (
            <pre className="my-3 rounded-lg bg-[#F5F5F7] text-[#0D0D0F] p-4 overflow-x-auto text-xs leading-relaxed">
              {children}
            </pre>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 rounded bg-[#95B877]/10 text-[#95B877] text-xs font-mono" {...props}>
                  {children}
                </code>
              );
            }
            return <code className={`${className} font-mono`} {...props}>{children}</code>;
          },
          
          // Blockquotes como callouts
          blockquote: ({ children }) => (
            <blockquote className="my-3 pl-4 border-l-3 border-[#95B877] bg-[#95B877]/5 rounded-r-lg py-2 pr-3 text-sm text-content-primary">
              {children}
            </blockquote>
          ),
          
          // Separadores
          hr: () => (
            <hr className="my-5 border-t border-[rgba(255,255,255,0.08)]" />
          ),
          
          // Negritas y cursivas
          strong: ({ children }) => (
            <strong className="font-bold text-content-primary">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-content-secondary">{children}</em>
          ),
          
          // Links
          a: ({ href, children }) => (
            <a href={href} className="text-[#95B877] underline underline-offset-2 hover:text-[#A8C88A] transition-colors" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
