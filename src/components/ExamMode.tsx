/**
 * ExamMode — מצב בחינה
 * • שאלות קשות (difficulty 3) מכל היחידות
 * • טיימר 90 דקות
 * • קלט מספרי עם tolerance ±5%
 * • ציון בסוף
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Timer, CheckCircle, XCircle, GraduationCap } from 'lucide-react'
import { PRACTICE_BANK } from '../data/practiceBank'
import GlassCard from './GlassCard'
import { BlockMath } from './MathBlock'

interface Props { onBack: () => void }

const EXAM_DURATION = 90 * 60  // 90 minutes in seconds
const EXAM_SIZE     = 20

// Numeric tolerance check
function numericCheck(input: string, correct: number, tolerance = 0.05): boolean {
  const val = parseFloat(input.replace(/,/, '.'))
  if (isNaN(val)) return false
  return Math.abs(val - correct) / Math.abs(correct) <= tolerance
}

// Pick hard questions, spread across units
function buildExam(): typeof PRACTICE_BANK {
  const hard = PRACTICE_BANK.filter(q => q.difficulty === 3)
  const medium = PRACTICE_BANK.filter(q => q.difficulty === 2)
  const pool = [...hard, ...medium.slice(0, Math.max(0, EXAM_SIZE - hard.length))]
  // shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, EXAM_SIZE)
}

const UNIT_COLORS: Record<number, string> = {
  1: '#0D9488', 2: '#7C3AED', 3: '#EA580C', 4: '#0369A1', 5: '#BE185D',
}

export default function ExamMode({ onBack }: Props) {
  const [phase, setPhase] = useState<'intro' | 'exam' | 'results'>('intro')
  const [questions]  = useState(buildExam)
  const [current,  setCurrent]  = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [answers,  setAnswers]  = useState<Record<number, boolean>>({})
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Timer
  useEffect(() => {
    if (phase !== 'exam') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); setPhase('results'); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [phase])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  const markAnswer = useCallback((correct: boolean) => {
    setAnswers(prev => ({ ...prev, [current]: correct }))
    setRevealed(false)
    if (current + 1 >= questions.length) {
      clearInterval(timerRef.current!)
      setPhase('results')
    } else {
      setCurrent(c => c + 1)
    }
  }, [current, questions.length])

  // ── Intro ──────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div dir="rtl" className="min-h-screen p-4 pb-8 flex flex-col" style={{ background: 'var(--bg)' }}>
        <button onClick={onBack} aria-label="חזרה"
          className="flex items-center gap-1 text-sm rounded-xl px-3 py-1.5 mb-6 self-start"
          style={{ color: 'var(--text-muted)', background: 'var(--accent-soft)' }}>
          <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} /> חזרה
        </button>

        <div className="flex-1 flex flex-col justify-center gap-5 max-w-sm mx-auto w-full">
          <div className="text-center">
            <GraduationCap size={48} className="mx-auto mb-3" style={{ color: 'var(--accent)' }} />
            <h1 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text)' }}>מצב בחינה</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              מדמה בחינת מועד: {EXAM_SIZE} שאלות · {EXAM_DURATION / 60} דקות
            </p>
          </div>

          <GlassCard padding="md">
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text)' }}>
              {[
                { icon: '📋', text: `${EXAM_SIZE} שאלות מכל 5 יחידות` },
                { icon: '⏱️', text: `${EXAM_DURATION / 60} דקות (כמו בחינה אמיתית)` },
                { icon: '✅', text: 'לאחר כל שאלה: ראה תשובה והערך עצמך' },
                { icon: '📊', text: 'ציון סופי ופירוט לפי יחידה' },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-2">
                  <span>{icon}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{text}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          <button onClick={() => setPhase('exam')}
            className="w-full py-4 rounded-xl font-bold text-base transition-all active:scale-95"
            style={{ background: 'var(--accent)', color: '#fff',
              boxShadow: '0 4px 20px color-mix(in srgb, var(--accent) 35%, transparent)' }}>
            התחל בחינה
          </button>
        </div>
      </div>
    )
  }

  // ── Results ──────────────────────────────────────────────────────────
  if (phase === 'results') {
    const correct = Object.values(answers).filter(Boolean).length
    const total   = Object.keys(answers).length
    const pct     = total ? Math.round((correct / total) * 100) : 0
    const grade   = pct >= 85 ? 'מצוין' : pct >= 70 ? 'טוב' : pct >= 55 ? 'עובר' : 'לא עובר'
    const gradeColor = pct >= 85 ? '#22C55E' : pct >= 70 ? '#3B82F6' : pct >= 55 ? '#F59E0B' : '#EF4444'

    // Per unit breakdown
    const byUnit: Record<number, { c: number; t: number }> = {}
    questions.forEach((q, i) => {
      if (!(q.unitId in byUnit)) byUnit[q.unitId] = { c: 0, t: 0 }
      byUnit[q.unitId].t++
      if (answers[i]) byUnit[q.unitId].c++
    })

    return (
      <div dir="rtl" className="min-h-screen p-4 pb-8" style={{ background: 'var(--bg)' }}>
        <button onClick={onBack} aria-label="חזרה"
          className="flex items-center gap-1 text-sm rounded-xl px-3 py-1.5 mb-5 self-start inline-flex"
          style={{ color: 'var(--text-muted)', background: 'var(--accent-soft)' }}>
          <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} /> חזרה לבית
        </button>

        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4">
          <div className="text-5xl">{pct >= 85 ? '🏆' : pct >= 70 ? '🎉' : pct >= 55 ? '💪' : '📚'}</div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text)' }}>תוצאות בחינה</h1>

          {/* Grade ring */}
          <div className="relative">
            <svg width={120} height={120} viewBox="0 0 120 120">
              <circle cx={60} cy={60} r={50} fill="none" stroke="var(--border)" strokeWidth={8} />
              <circle cx={60} cy={60} r={50} fill="none" stroke={gradeColor} strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 * (1 - pct / 100)}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
              <text x={60} y={55} textAnchor="middle" dominantBaseline="middle"
                fontSize={22} fontWeight="800" fill={gradeColor}>{pct}%</text>
              <text x={60} y={75} textAnchor="middle" fontSize={11} fill="var(--text-muted)">{grade}</text>
            </svg>
          </div>

          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {correct} / {total} שאלות נכונות · זמן שנותר: {formatTime(timeLeft)}
          </div>

          {/* Per unit */}
          <GlassCard padding="md" className="w-full max-w-xs">
            <p className="text-xs font-bold mb-3" style={{ color: 'var(--text-muted)' }}>פירוט לפי יחידה</p>
            <div className="space-y-2">
              {Object.entries(byUnit).map(([uid, { c, t }]) => {
                const color = UNIT_COLORS[Number(uid)]
                const p = Math.round((c / t) * 100)
                return (
                  <div key={uid}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span style={{ color: 'var(--text)' }}>יחידה {uid}</span>
                      <span style={{ color }}>{c}/{t} ({p}%)</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                      <div style={{ width: `${p}%`, background: color, height: '100%', borderRadius: '999px', transition: 'width 0.8s ease' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>

          <div className="flex gap-3 w-full max-w-xs">
            <button onClick={() => { setPhase('intro'); setCurrent(0); setAnswers({}); setTimeLeft(EXAM_DURATION) }}
              className="flex-1 py-3 rounded-xl text-sm font-semibold active:scale-95"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              בחינה חדשה
            </button>
            <button onClick={onBack}
              className="flex-1 py-3 rounded-xl text-sm font-semibold active:scale-95"
              style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }}>
              חזרה לבית
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Active exam ───────────────────────────────────────────────────
  const q = questions[current]
  const color = UNIT_COLORS[q.unitId]
  const pct = (current / questions.length) * 100
  const timeWarning = timeLeft < 10 * 60

  return (
    <div dir="rtl" className="min-h-screen p-4 pb-8" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <button onClick={() => { if (confirm('לצאת מהבחינה?')) { clearInterval(timerRef.current!); setPhase('results') } }}
          aria-label="יציאה מהבחינה"
          className="flex items-center gap-1 text-sm rounded-xl px-3 py-1.5"
          style={{ color: 'var(--text-muted)', background: 'var(--accent-soft)' }}>
          <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} /> יציאה
        </button>
        <div className="flex-1 text-xs font-bold mono" style={{ color: 'var(--text)' }}>
          שאלה {current + 1}/{questions.length}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
          style={{ background: timeWarning ? 'rgba(239,68,68,0.12)' : 'var(--card)',
            border: `1px solid ${timeWarning ? '#EF4444' : 'var(--border)'}` }}>
          <Timer size={13} style={{ color: timeWarning ? '#EF4444' : 'var(--text-muted)' }} />
          <span className="text-xs font-bold mono" style={{ color: timeWarning ? '#EF4444' : 'var(--text)' }}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: 'var(--border)' }}>
        <motion.div className="h-full rounded-full" style={{ background: color }}
          animate={{ width: `${pct}%` }} transition={{ duration: 0.3 }} />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div key={current}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="h-1" style={{ background: color }} />

            {/* Meta */}
            <div className="px-4 pt-3 pb-2 flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                style={{ background: `color-mix(in srgb, ${color} 18%, transparent)`, color }}>
                יחידה {q.unitId}
              </span>
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {'★'.repeat(q.difficulty)}{'☆'.repeat(3 - q.difficulty)}
              </span>
              <span className="text-[10px] mr-auto" style={{ color: 'var(--text-muted)' }}>{q.nodeId}</span>
            </div>

            {/* Prompt */}
            <div className="px-4 pb-4 text-sm font-medium leading-relaxed" style={{ color: 'var(--text)' }}>
              {q.prompt}
            </div>

            {/* Answer area */}
            <AnimatePresence>
              {!revealed ? (
                <div className="px-4 pb-4">
                  <button onClick={() => setRevealed(true)}
                    className="w-full py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
                    style={{ background: `color-mix(in srgb, ${color} 16%, transparent)`, color }}>
                    הצג תשובה
                  </button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="overflow-hidden">
                  <div className="mx-4 mb-4 p-3 rounded-xl text-sm leading-relaxed"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                    {q.answer}
                  </div>
                  <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                    <button onClick={() => markAnswer(false)}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold active:scale-95"
                      style={{ background: 'color-mix(in srgb, #EF4444 16%, transparent)', color: '#EF4444' }}>
                      <XCircle size={16} /> לא ידעתי
                    </button>
                    <button onClick={() => markAnswer(true)}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold active:scale-95"
                      style={{ background: 'color-mix(in srgb, #22C55E 16%, transparent)', color: '#22C55E' }}>
                      <CheckCircle size={16} /> ידעתי
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
