import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  open?: boolean
  isOpen?: boolean // Alias for backward compatibility
  onClose: () => void
  title: string
  children: React.ReactNode
  maxWidth?: string
}

export function Modal({ open, isOpen, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  const isCurrentlyOpen = open || isOpen
  
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isCurrentlyOpen) document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [isCurrentlyOpen, onClose])

  return (
    <AnimatePresence>
      {isCurrentlyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay — fade in */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Content — scale in */}
          <motion.div
            className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-2xl`}
            style={{
              background: '#000000',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            }}

            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
              <h2 className="text-lg font-semibold text-[#F5F5F7] tracking-tight">{title}</h2>
              <motion.button
                onClick={onClose}
                whileTap={{ scale: 0.92 }}
                className="text-[#A1A1A6] hover:text-[#F5F5F7] transition-colors duration-200 rounded-lg p-1 hover:bg-white/[0.05]"
              >
                <X size={18} />
              </motion.button>
            </div>
            {/* Body */}
            <div className="p-6 text-[#F5F5F7]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
