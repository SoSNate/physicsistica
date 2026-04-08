import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Unlock, ChevronDown, AlertCircle, CheckCircle2, Lightbulb } from 'lucide-react'
import GlassCard from './GlassCard'
import type { DerivationStep } from '../types'

interface Props {
  steps: DerivationStep[]
  onComplete?: () => void
}

type StepState = 'locked' | 'answering' | 'hinting' | 'unlocked'

export default function ScaffoldedDerivation({ steps, onComplete }: Props) {
  const [unlockedUpTo, setUnlockedUpTo] = useState(0)   // index of last unlocked step
  const [answers, setAnswers] = useState<string[]>(() => steps.map(() => ''))
  const [attempts, setAttempts] = useState<number[]>(() => steps.map(() => 0))
  const [states, setStates] = useState<StepState[]>(() =>
    steps.map((_, i) => (i === 0 ? 'unlocked' : 'locked'))
  )
  const [expanded, setExpanded] = useState<boolean[]>(() => steps.map((_, i) => i === 0))
  const [correct, setCorrect] = useState<boolean[]>(() => steps.map(() => false))

  function updateState(idx: number, val: StepState) {
    setStates(prev => prev.map((s, i) => (i === idx ? val : s)))
  }

  function setAnswer(idx: number, val: string) {
    setAnswers(prev => prev.map((a, i) => (i === idx ? val : a)))
  }

  function toggleExpand(idx: number) {
    setExpanded(prev => prev.map((e, i) => (i === idx ? !e : e)))
  }

  function tryAnswer(stepIdx: number) {
    const step = steps[stepIdx]
    if (!step.interimQuestion) return

    const ans = answers[stepIdx].trim()
    const isCorrect = step.interimQuestion.validate(ans)

    if (isCorrect) {
      setCorrect(prev => prev.map((c, i) => (i === stepIdx ? true : c)))
      unlockNext(stepIdx)
    } else {
      const newAttempts = attempts[stepIdx] + 1
      setAttempts(prev => prev.map((a, i) => (i === stepIdx ? newAttempts : a)))
      if (newAttempts >= 2) {
        updateState(stepIdx, 'hinting')
      } else {
        updateState(stepIdx, 'answering')
      }
    }
  }

  function skipWithHint(stepIdx: number) {
    unlockNext(stepIdx)
  }

  function unlockNext(stepIdx: number) {
    const next = stepIdx + 1
    if (next < steps.length) {
      setUnlockedUpTo(next)
      setStates(prev => prev.map((s, i) => {
        if (i === next) return 'unlocked'
        return s
      }))
      setExpanded(prev => prev.map((e, i) => (i === next ? true : e)))
    } else {
      onComplete?.()
    }
  }

  return (
    <div className="space-y-3">
      {steps.map((step, idx) => {
        const state     = states[idx]
        const isLocked  = state === 'locked'
        const isOpen    = expanded[idx] && !isLocked
        const hasQ      = !!step.interimQuestion
        const isHinting = state === 'hinting'
        const isCorrect = correct[idx]

        return (
          <GlassCard
            key={idx}
            padding="none"
            className="overflow-hidden transition-all duration-300"
            style={{
              opacity: isLocked ? 0.45 : 1,
              borderColor: isCorrect ? 'var(--success)' : isLocked ? 'var(--border)' : 'var(--border)',
            }}
          >
            {/* Step header */}
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-right"
              onClick={() => !isLocked && toggleExpand(idx)}
              disabled={isLocked}
            >
              {/* Step number */}
              <span
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: isCorrect ? 'var(--success-soft)' : isLocked ? 'var(--border)' : 'var(--accent-soft)',
                  color: isCorrect ? 'var(--success)' : isLocked ? 'var(--text-muted)' : 'var(--accent)',
                }}
              >
                {isCorrect ? <CheckCircle2 size={14} /> : isLocked ? <Lock size={12} /> : idx + 1}
              </span>

              <div className="flex-1 text-right">
                <div className="font-semibold text-sm" style={{ color: isLocked ? 'var(--text-muted)' : 'var(--text)' }}>
                  {step.title}
                </div>
              </div>

              {!isLocked && (
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={15} style={{ color: 'var(--text-muted)' }} />
                </motion.div>
              )}
              {isLocked && <Lock size={13} style={{ color: 'var(--text-muted)' }} />}
            </button>

            {/* Step content */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-4">
                    {/* Main content */}
                    <div className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                      {step.content}
                    </div>

                    {/* Interim question — shown if there IS a question and the next step is still locked */}
                    {hasQ && !isCorrect && idx === unlockedUpTo && (
                      <div
                        className="rounded-xl p-4 space-y-3"
                        style={{ background: 'var(--accent-soft)', border: '1px solid var(--border)' }}
                      >
                        <div className="flex items-start gap-2">
                          <Unlock size={14} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                          <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                            {step.interimQuestion!.prompt}
                          </p>
                        </div>

                        {/* Hint after 2 failed attempts */}
                        <AnimatePresence>
                          {isHinting && (
                            <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-start gap-2 rounded-lg p-3"
                              style={{ background: 'var(--warn-soft)', border: '1px solid var(--border)' }}
                            >
                              <Lightbulb size={13} style={{ color: 'var(--warn)', flexShrink: 0, marginTop: 2 }} />
                              <p className="text-xs leading-relaxed" style={{ color: 'var(--warn)' }}>
                                <strong>רמז:</strong> {step.interimQuestion!.hint}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={answers[idx]}
                            onChange={e => setAnswer(idx, e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && tryAnswer(idx)}
                            placeholder="הקלד תשובתך..."
                            dir="rtl"
                            className="flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all"
                            style={{
                              background: 'var(--card)',
                              border: `1.5px solid ${attempts[idx] > 0 && !isCorrect ? 'var(--danger)' : 'var(--border)'}`,
                              color: 'var(--text)',
                            }}
                          />
                          <button
                            onClick={() => tryAnswer(idx)}
                            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95"
                            style={{ background: 'var(--accent)', color: '#fff' }}
                          >
                            בדוק
                          </button>
                        </div>

                        {attempts[idx] > 0 && !isCorrect && !isHinting && (
                          <p className="text-xs flex items-center gap-1" style={{ color: 'var(--danger)' }}>
                            <AlertCircle size={11} />
                            נסה שוב — ניסיון {attempts[idx]}/2
                          </p>
                        )}

                        {isHinting && (
                          <button
                            onClick={() => skipWithHint(idx)}
                            className="text-xs underline transition-opacity hover:opacity-70"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            המשך עם הרמז (ללא ניקוד מלא)
                          </button>
                        )}

                        {step.interimQuestion?.correctAnswer && isHinting && (
                          <div
                            className="rounded-lg p-3 text-xs"
                            style={{ background: 'var(--success-soft)', color: 'var(--success)', border: '1px solid var(--border)' }}
                          >
                            <strong>תשובה:</strong> {step.interimQuestion.correctAnswer}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Correct answer indicator */}
                    {isCorrect && (
                      <div
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                        style={{ background: 'var(--success-soft)', color: 'var(--success)' }}
                      >
                        <CheckCircle2 size={14} />
                        מעולה! המשך לשלב הבא
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        )
      })}
    </div>
  )
}
