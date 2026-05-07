import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, User, MapPin, Calendar, ShieldCheck } from 'lucide-react';
import { InterviewNote } from '../../lib/types';
import Card from '../ui/Card';
import MarkdownRenderer from '../MarkdownRenderer';

interface InterviewNoteCardProps {
  note: InterviewNote;
}

const NOTE_TYPE_BADGE: Record<string, { label: string; color: string }> = {
  scoping:      { label: 'Scoping',      color: '#b89a42' }, // Gold
  inmersion:    { label: 'Inmersión',    color: '#b04a30' }, // Foundation
  validacion:   { label: 'Validación',   color: '#3e4d32' }, // Olive
  seguimiento:  { label: 'Seguimiento',  color: '#4f6140' }, // Olive lighter
  cierre:       { label: 'Cierre',       color: '#0d614d' }, // Sentinel
  otro:         { label: 'Otro',         color: '#707060' }, // Muted
};

export default function InterviewNoteCard({ note }: InterviewNoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const typeBadge = NOTE_TYPE_BADGE[note.interview_type || 'otro'] || NOTE_TYPE_BADGE.otro;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="bg-white border-eva-border hover:border-eva-olive hover:shadow-md transition-all overflow-hidden shadow-sm">
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div 
                  className="px-1.5 py-0.5 rounded text-[8px] uppercase tracking-widest font-bold text-white shadow-sm"
                  style={{ background: typeBadge.color }}
                >
                  {typeBadge.label}
                </div>
                <h4 className="text-eva-black font-serif text-lg leading-tight group-hover:text-eva-olive transition-colors">
                  {note.session_title}
                </h4>
              </div>
              <p className="text-[10px] text-eva-txt-faint flex items-center gap-2 font-bold font-mono uppercase tracking-wider">
                <Calendar className="w-3 h-3" />
                {new Date(note.captured_at).toLocaleString('es-MX', { 
                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}
              </p>
            </div>
            
            <div className="px-2 py-1 rounded bg-eva-olive/10 border border-eva-olive/20 flex items-center gap-1.5">
               <ShieldCheck className="w-3 h-3 text-eva-olive" />
               <span className="text-[9px] font-bold text-eva-olive uppercase tracking-widest">ALCOA+</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-xs text-eva-txt-muted font-medium">
              <div className="w-6 h-6 rounded-full bg-eva-beige-2 flex items-center justify-center">
                <User className="w-3 h-3 text-eva-olive" />
              </div>
              <span className="truncate"><b>De:</b> {note.interviewer}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-eva-txt-muted font-medium">
              <div className="w-6 h-6 rounded-full bg-eva-beige-2 flex items-center justify-center">
                <User className="w-3 h-3 text-eva-olive" />
              </div>
              <span className="truncate"><b>A:</b> {note.interviewee}</span>
            </div>
          </div>

          <div className="relative">
            <div className={`text-sm text-eva-txt-mid leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
               {isExpanded ? (
                 <div className="animate-in fade-in duration-500">
                   <MarkdownRenderer content={note.content} />
                 </div>
               ) : (
                 <p className="font-medium opacity-80">{note.content}</p>
               )}
            </div>
            
            {!isExpanded && note.content.length > 200 && (
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}
          </div>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-4 py-2 border-t border-eva-border flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-eva-txt-faint hover:text-eva-olive transition-colors"
          >
            {isExpanded ? (
              <>Cerrar Nota <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>Leer Nota Completa <ChevronDown className="w-3 h-3" /></>
            )}
          </button>
        </div>
        
        {isExpanded && (
          <div className="px-5 py-3 bg-eva-beige-2/30 border-t border-eva-border flex justify-between items-center">
            <div className="flex items-center gap-2 text-[9px] text-eva-txt-faint font-mono font-bold uppercase tracking-wider">
               <MapPin className="w-3 h-3" /> {note.location || 'Oficina'}
            </div>
            <div className="text-[9px] text-eva-txt-faint font-mono truncate max-w-[200px] opacity-60">
               HASH: {note.alcoa_hash}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
