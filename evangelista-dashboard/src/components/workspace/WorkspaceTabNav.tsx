import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Target, 
  Calendar, 
  Database, 
  BarChart2, 
  Package, 
  Sparkles,
  CreditCard,
  Trophy
} from 'lucide-react';

export type WorkspaceTab = 'propuesta' | 'scoping' | 'workstreams' | 'contrato' | 'datos' | 'analisis' | 'reportes' | 'entregables' | 'ia' | 'cierre';

interface WorkspaceTabNavProps {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  areaColor?: string;
}

export const TAB_GROUPS = [
  {
    name: 'Planificación',
    tabs: ['propuesta', 'scoping'] as const
  },
  {
    name: 'Operación',
    tabs: ['workstreams', 'contrato', 'datos'] as const
  },
  {
    name: 'Inteligencia',
    tabs: ['analisis', 'reportes', 'ia'] as const
  },
  {
    name: 'Cierre',
    tabs: ['entregables', 'cierre'] as const
  }
];

export const TABS = [
  { id: 'propuesta', label: 'Propuesta', icon: FileText },
  { id: 'scoping', label: 'Scoping', icon: Target },
  { id: 'workstreams', label: 'Workstreams', icon: Calendar },
  { id: 'contrato', label: 'Contrato', icon: CreditCard },
  { id: 'datos', label: 'Datos', icon: Database },
  { id: 'analisis', label: 'Análisis', icon: BarChart2 },
  { id: 'reportes', label: 'Reportes', icon: FileText },
  { id: 'entregables', label: 'Entregables', icon: Package },
  { id: 'ia', label: 'IA Agente', icon: Sparkles },
  { id: 'cierre', label: 'Cierre', icon: Trophy },
] as const;

export default function WorkspaceTabNav({ activeTab, onTabChange, areaColor = '#3e4d32' }: WorkspaceTabNavProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-eva-border sticky top-0 z-20 overflow-hidden">
      <div className="max-w-[1600px] mx-auto overflow-x-auto scrollbar-hide scroll-smooth">
        <div className="flex items-center gap-12 px-10 w-max min-w-full">
          {TAB_GROUPS.map((group) => (
            <div key={group.name} className="flex flex-col py-4 border-r border-eva-border/40 last:border-none pr-10">
              <span className="text-[9px] uppercase tracking-[0.25em] font-black text-eva-txt-faint mb-2.5 opacity-50">
                {group.name}
              </span>
              <div className="flex items-center gap-1">
                {group.tabs.map((tabId) => {
                  const tab = TABS.find(t => t.id === tabId);
                  if (!tab) return null;
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => onTabChange(tab.id as WorkspaceTab)}
                      className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-500 relative group
                        ${isActive 
                          ? 'text-eva-black' 
                          : 'text-eva-txt-faint hover:text-eva-txt-muted'}
                      `}
                    >
                      <Icon className={`w-3.5 h-3.5 transition-colors duration-500 ${isActive ? 'text-eva-olive' : 'opacity-40 group-hover:opacity-100'}`} />
                      <span className="whitespace-nowrap tracking-tight">{tab.label}</span>
                      
                      {isActive && (
                        <motion.div 
                          layoutId="tabUnderline"
                          className="absolute -bottom-[17px] inset-x-0 h-0.5 bg-eva-olive"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
