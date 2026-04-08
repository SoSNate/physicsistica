import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PracticeQuestion, PracticeConfidence } from '../types'

interface Props {
  question: PracticeQuestion
  onAnswer: (confidence: PracticeConfidence) => void
}

const UNIT_COLORS: Record<number, string> = {
  1: '#0D9488',
  2: '#7C3AED',
  3: '#EA580C',
  4: '#0369A1',
  5: '#BE185D',
}

const TYPE_LABELS: Record<string, string> = {
  numeric:    'חישוב',
  conceptual: 'מושגי',
  visual:     'ויזואלי',
  estimation: 'הערכה',
}

const DIFFICULTY_STARS = (d: 1 | 2 | 3) => '★'.repeat(d) + '☆'.repeat(3 - d)

export default function PracticeCard({ question, onAnswer }: Props) {
  const [thinking, setThinking] = useState(true)
  const [answered, setAnswered] = useState(false)
  const color = UNIT_COLORS[question.unitId] ?? 'var(--accent)'

  // Reset state when question changes
  useEffect(() => {
    setThinking(true)
    setAnswered(false)
  }, [question.id])

  function handleReveal() {
    setThinking(false)
  }

  function handleAnswer(c: PracticeConfidence) {
    if (answered) return
    setAnswered(true)
    setTimeout(() => onAnswer(c), 300)
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      dir="rtl"
      className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {/* Color bar + meta */}
      <div className="h-1.5 w-full" style={{ background: color }} />
      <div className="px-4 pt-3 pb-2 flex items-center gap-2">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md"
          style={{ background: `color-mix(in srgb, ${color} 18%, transparent)`, color }}>
          יחידה {question.unitId}
        </span>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md"
          style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
          {TYPE_LABELS[question.type]}
        </span>
        <span className="text-[10px] mr-auto" style={{ color: 'var(--text-muted)' }}>
          {DIFFICULTY_STARS(question.difficulty)}
        </span>
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          {question.nodeId}
        </span>
      </div>

      {/* Visualization */}
      {question.visualization && (
        <div className="px-4 pb-2">
          {question.visualization()}
        </div>
      )}

      {/* Prompt */}
      <div className="px-4 pb-4 text-sm font-medium leading-relaxed" style={{ color: 'var(--text)' }}>
        {question.prompt}
      </div>

      {/* Reveal / Answer area */}
      <AnimatePresence mode="wait">
        {thinking ? (
          <motion.div
            key="thinking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 pb-4"
          >
            <button
              onClick={handleReveal}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={{ background: `color-mix(in srgb, ${color} 16%, transparent)`, color }}
            >
              הצג תשובה
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="answer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Answer box */}
            <div className="mx-4 mb-4 rounded-xl p-3 text-sm leading-relaxed"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text)' }}>
              {question.answer}
            </div>

            {/* CBL buttons */}
            <div className="px-4 pb-4">
              <p className="text-[11px] text-center mb-2" style={{ color: 'var(--text-muted)' }}>
                כמה ידעת?
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAnswer('missed')}
                  disabled={answered}
                  className="flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
                  style={{ background: 'color-mix(in srgb, #EF4444 16%, transparent)', color: '#EF4444' }}
                >
                  <span className="text-base">✗</span>
                  לא ידעתי
                </button>
                <button
                  onClick={() => handleAnswer('unsure')}
                  disabled={answered}
                  className="flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
                  style={{ background: 'color-mix(in srgb, #F59E0B 16%, transparent)', color: '#F59E0B' }}
                >
                  <span className="text-base">±</span>
                  לא בטוח
                </button>
                <button
                  onClick={() => handleAnswer('knew')}
                  disabled={answered}
                  className="flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
                  style={{ background: 'color-mix(in srgb, #22C55E 16%, transparent)', color: '#22C55E' }}
                >
                  <span className="text-base">✓</span>
                  ידעתי
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
