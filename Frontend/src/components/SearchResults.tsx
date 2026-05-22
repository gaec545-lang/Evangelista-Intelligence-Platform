import Card from './ui/Card';
import Badge from './ui/Badge';
import { motion } from 'framer-motion';
import { FileText, ChevronRight, Hash } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface SearchResult {
  chunk_id?: string;
  document_title?: string;
  section_header?: string;
  content?: string;
  score?: number;
  metadata?: Record<string, unknown>;
}

export function SearchResults({ results }: { results: SearchResult[] }) {
  if (!results.length) return null;

  return (
    <div className="space-y-3">
      {results.map((r, i) => (
        <motion.div
          key={r.chunk_id ?? i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(i * 0.04, 0.25) }}
        >
          <Card className="group" index={i}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <FileText size={16} className="text-content-secondary group-hover:text-primary-500 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-content-primary tracking-tight">{r.document_title ?? 'Documento sin título'}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Hash size={10} className="text-content-secondary/40" />
                    <p className="text-[9px] font-semibold text-content-secondary/60 uppercase tracking-widest">{r.section_header || 'General'}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {r.score != null && (
                  <Badge variant={r.score > 0.8 ? 'success' : 'info'} size="sm">
                    {Math.round(r.score * 100)}%
                  </Badge>
                )}
                <ChevronRight
                  size={14}
                  style={{ color: 'rgba(255,255,255,0.12)' }}
                  className="group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all"
                />
              </div>
            </div>

            <div
              className="relative p-4 rounded-button"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div className="max-h-64 overflow-y-auto custom-scrollbar">
                <MarkdownRenderer content={r.content || ''} />
              </div>
            </div>

            {!!r.metadata?.type && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[9px] font-semibold text-content-secondary/50 uppercase tracking-widest">Metadata:</span>
                <Badge variant="info" size="sm">{String(r.metadata.type)}</Badge>
              </div>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
