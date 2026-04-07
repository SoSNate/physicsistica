import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, ChevronDown } from 'lucide-react'
import { BlockMath } from './MathBlock'

interface TrapCardProps {
  title: string
  description: ReactNode
  wrongFormula?: string   // LaTeX — the WRONG version
  rightFormula?: string   // LaTeX — the CORRECT version
  examExample?: ReactNode // Real exam question that exploits this trap
}

export default function TrapCard({
  title,
  description,
  wrongFormula,
  rightFormula,
  examExample,
}: TrapCardProps) {
  const [open, setOpen] = useState(false)
  const [showExam, setShowExam] = useState(false)

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid var(--danger)', background: 'var(--danger-soft)' }}>
      {/* Header */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-right"
        onClick={() => setOpen(o => !o)}
      >
        <span
          className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--danger)', color: '#fff' }}
        >
          <AlertTriangle size={15} />
        </span>
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--danger)', opacity: 0.8 }}>
            מלכודת המרצה
          </div>
          <div className="font-bold text-sm mt-0.5" style={{ color: 'var(--danger)' }}>
            {title}
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={15} style={{ color: 'var(--danger)' }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Description */}
              <div className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                {description}
              </div>

              {/* Wrong vs Right formula comparison */}
              {(wrongFormula || rightFormula) && (
                <div className="grid grid-cols-2 gap-3">
                  {wrongFormula && (
                    <div
                      className="rounded-xl p-3 text-center"
                      style={{ background: 'rgba(185,28,28,0.12)', border: '1px solid var(--danger)' }}
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-2">
                        <X size={12} style={{ color: 'var(--danger)' }} />
                        <span className="text-xs font-bold" style={{ color: 'var(--danger)' }}>שגוי</span>
                      </div>
                      <BlockMath tex={wrongFormula} />
                    </div>
                  )}
                  {rightFormula && (
                    <div
                      className="rounded-xl p-3 text-center"
                      style={{ background: 'var(--success-soft)', border: '1px solid var(--success)' }}
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-2">
                        <span className="text-xs font-bold" style={{ color: 'var(--success)' }}>✓ נכון</span>
                      </div>
                      <BlockMath tex={rightFormula} />
                    </div>
                  )}
                </div>
              )}

              {/* Exam example toggle */}
              {examExample && (
                <div>
                  <button
                    onClick={() => setShowExam(s => !s)}
                    className="text-xs font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-70"
                    style={{ color: 'var(--danger)' }}
                  >
                    <AlertTriangle size={11} />
                    {showExam ? 'הסתר' : 'ראה'} שאלת מבחן אמיתית שמנצלת את המלכודת
                  </button>
                  <AnimatePresence>
                    {showExam && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="mt-2 rounded-xl p-3 text-sm"
                        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                      >
                        {examExample}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
