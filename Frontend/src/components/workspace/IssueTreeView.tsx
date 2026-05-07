import React from 'react';
import { motion } from 'framer-motion';
import { Hypothesis } from '../../lib/types';
import { GitCommit, ChevronRight, Target } from 'lucide-react';

interface IssueTreeViewProps {
  hypotheses: Hypothesis[];
}

interface TreeNode extends Hypothesis {
  children: TreeNode[];
}

export default function IssueTreeView({ hypotheses }: IssueTreeViewProps) {
  const buildTree = (list: Hypothesis[]): TreeNode[] => {
    const map = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    list.forEach(h => {
      map.set(h.id, { ...h, children: [] });
    });

    list.forEach(h => {
      const node = map.get(h.id)!;
      if (h.parent_hypothesis_id && map.has(h.parent_hypothesis_id)) {
        map.get(h.parent_hypothesis_id)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const treeData = buildTree(hypotheses);

  const renderNode = (node: TreeNode, depth = 0) => {
    const statusColors: Record<string, string> = {
      planteada:      'bg-white/10 border-white/20 text-white/40',
      en_validacion:  'bg-amber-500/10 border-amber-500/30 text-amber-500',
      validada:       'bg-green-500/10 border-green-500/30 text-green-500',
      refutada:       'bg-red-500/10 border-red-500/30 text-red-500',
    };

    const colorClass = statusColors[node.status] || statusColors.planteada;

    return (
      <div key={node.id} className="relative">
        <div 
          className="flex items-center gap-3 p-3 rounded-lg border transition-all hover:bg-white/5 mb-3"
          style={{ marginLeft: `${depth * 32}px` }}
        >
          {depth > 0 && (
            <div className="absolute left-[-16px] top-0 bottom-4 w-px bg-white/10" />
          )}
          
          <div className={`w-2 h-2 rounded-full shrink-0 ${node.status === 'validada' ? 'bg-green-500' : 'bg-current'}`} />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
               <span className={`text-[8px] px-1 py-0.5 rounded uppercase font-bold tracking-widest ${colorClass}`}>
                  {node.status}
               </span>
               <span className="text-[10px] text-white/20 font-mono">H-{node.id.slice(0,4).toUpperCase()}</span>
            </div>
            <p className="text-xs text-cream truncate">{node.statement}</p>
          </div>
          
          <div className="text-[10px] text-white/20 font-mono">
            {node.impact_score ? `$${(node.impact_score/1000).toFixed(0)}k` : '—'}
          </div>
        </div>
        
        {node.children.map(child => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="p-8 bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-architecture/10 flex items-center justify-center border border-architecture/20">
          <Target className="w-5 h-5 text-architecture" />
        </div>
        <div>
          <h4 className="text-lg font-serif text-cream">Mapa de Hipótesis (Issue Tree)</h4>
          <p className="text-xs text-white/40">Jerarquía estratégica y trazabilidad del diagnóstico.</p>
        </div>
      </div>

      <div className="relative">
        {treeData.length === 0 ? (
          <div className="py-12 text-center text-white/20 italic text-sm">
            No hay hipótesis registradas para construir el árbol.
          </div>
        ) : (
          <div className="space-y-4">
            {treeData.map(root => renderNode(root))}
          </div>
        )}
      </div>
    </div>
  );
}
