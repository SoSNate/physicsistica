/**
 * ExamMode — מדמה בחינת אוניברסיטה פתוחה אמיתית
 * • 4 שאלות מגה עם 3-4 חלקים כל אחת
 * • פיסוק חלקי לפי חלקים
 * • זיהוי מלכודות בדף תוצאות
 * • טיימר 90 דקות (examDoneRef מונע double-transition)
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Timer, CheckCircle, XCircle, GraduationCap,
  BookOpen, AlertTriangle, Lock,
} from 'lucide-react'
import { buildMegaExam, TRAP_META } from '../data/megaExamBank'
import { UNIT_COLOR_MAP } from '../data/units'
import type { MegaQuestion, ExamPartResult } from '../types'
import GlassCard from './GlassCard'

interface Props { onBack: () => void }

const EXAM_DURATION = 90 * 60   // 90 minutes in seconds
const UNIT_COLORS = UNIT_COLOR_MAP

export default function ExamMode({ onBack }: Props) {
  const [phase, setPhase] = useState<'intro' | 'exam' | 'results'>('intro')
  const [questions]  = useState<MegaQuestion[]>(buildMegaExam)
  const [qIdx,     setQIdx]     = useState(0)
  const [partIdx,  setPartIdx]  = useState(0)
  const [revealed, setRevealed] = useState(false)
  // key = `${qIdx}-${partIdx}`, value = 'knew' | 'missed'
  const [answers, setAnswers]   = useState<Record<string, ExamPartResult>>({})
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION)
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  // Single-ownership flag — whichever path fires first wins; the other is no-op
  const examDoneRef = useRef(false)

  // ── Timer (unchanged guard pattern) ─────────────────────────────
  useEffect(() => {
    if (phase !== 'exam') return
    examDoneRef.current = false
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (!examDoneRef.current) {
            examDoneRef.current = true
            setPhase('results')
          }
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [phase])

  const formatTime = (s: number) => {
    const m   = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  // ── Answer a part ────────────────────────────────────────────────
  const markPart = useCallback((result: ExamPartResult) => {
    const key = `${qIdx}-${partIdx}`
    const updatedAnswers = { ...answers, [key]: result }
    setAnswers(updatedAnswers)
    setRevealed(false)

    const q        = questions[qIdx]
    const isLastPart  = partIdx + 1 >= q.parts.length
    const isLastQ     = qIdx + 1 >= questions.length

    if (isLastPart && isLastQ) {
      if (!examDoneRef.current) {
        examDoneRef.current = true
        setPhase('results')
      }
    } else if (isLastPart) {
      setQIdx(qi => qi + 1)
      setPartIdx(0)
    } else {
      setPartIdx(pi => pi + 1)
    }
  }, [qIdx, partIdx, answers, questions])

  // ── Jump to a previously answered part (review) ──────────────────
  const jumpToPart = useCallback((qi: number, pi: number) => {
    const key = `${qi}-${pi}`
    // allow jumping only to answered parts or the current active part
    const isAnswered = key in answers
    const isCurrent  = qi === qIdx && pi === partIdx
    if (isAnswered || isCurrent) {
      setQIdx(qi)
      setPartIdx(pi)
      setRevealed(false)
    }
  }, [answers, qIdx, partIdx])

  // ── Scoring ──────────────────────────────────────────────────────
  function calcScore() {
    let scored = 0
    let total  = 0
    questions.forEach((q, qi) => {
      q.parts.forEach((part, pi) => {
        total += part.points
        const key = `${qi}-${pi}`
        if (answers[key] === 'knew') scored += part.points
      })
    })
    return { scored, total }
  }

  // ── Intro ────────────────────────────────────────────────────────
  if (phase === 'intro') {
    const totalParts = questions.reduce((s, q) => s + q.parts.length, 0)
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
              מדמה בחינת מועד אמיתית — האוניברסיטה הפתוחה
            </p>
          </div>

          <GlassCard padding="md">
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text)' }}>
              {[
                { icon: '📋', text: `${questions.length} שאלות מגה · ${totalParts} חלקים בסה"כ` },
                { icon: '⏱️', text: `${EXAM_DURATION / 60} דקות — כמו בחינה אמיתית` },
                { icon: '📓', text: 'פיתרו על מחברת — רק אחר כך הציגו תשובה' },
                { icon: '🎯', text: 'פיסוק חלקי לפי חלקים, זיהוי מלכודות בתוצאות' },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-2">
                  <span>{icon}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{text}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Question list preview */}
          <div className="space-y-2">
            {questions.map((q, i) => {
              const color = UNIT_COLORS[q.unitId]
              return (
                <div key={q.id} className="flex items-center gap-3 rounded-xl px-3 py-2"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md"
                    style={{ background: `color-mix(in srgb, ${color} 20%, transparent)`, color }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 text-xs" style={{ color: 'var(--text)' }}>{q.source}</div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {q.parts.length} חלקים
                  </div>
                </div>
              )
            })}
          </div>

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

  // ── Results ──────────────────────────────────────────────────────
  if (phase === 'results') {
    const { scored, total } = calcScore()
    const pct       = total ? Math.round((scored / total) * 100) : 0
    const grade     = pct >= 85 ? 'מצוין' : pct >= 70 ? 'טוב' : pct >= 55 ? 'עובר' : 'לא עובר'
    const gradeColor = pct >= 85 ? '#22C55E' : pct >= 70 ? '#3B82F6' : pct >= 55 ? '#F59E0B' : '#EF4444'

    // Traps hit: parts answered 'missed' with a trapId
    const trapsHit = Array.from(new Set(
      Object.entries(answers)
        .filter(([, v]) => v === 'missed')
        .map(([key]) => {
          const [qi, pi] = key.split('-').map(Number)
          return questions[qi]?.parts[pi]?.trapId
        })
        .filter((t): t is string => !!t)
    ))

    // Per-unit breakdown (weighted by points)
    const byUnit: Record<number, { scored: number; total: number }> = {}
    questions.forEach((q, qi) => {
      if (!(q.unitId in byUnit)) byUnit[q.unitId] = { scored: 0, total: 0 }
      q.parts.forEach((part, pi) => {
        byUnit[q.unitId].total += part.points
        if (answers[`${qi}-${pi}`] === 'knew') byUnit[q.unitId].scored += part.points
      })
    })

    return (
      <div dir="rtl" className="min-h-screen p-4 pb-8" style={{ background: 'var(--bg)' }}>
        <button onClick={onBack} aria-label="חזרה"
          className="flex items-center gap-1 text-sm rounded-xl px-3 py-1.5 mb-5 self-start inline-flex"
          style={{ color: 'var(--text-muted)', background: 'var(--accent-soft)' }}>
          <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} /> חזרה לבית
        </button>

        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4 max-w-sm mx-auto">

          <div className="text-5xl">{pct >= 85 ? '🏆' : pct >= 70 ? '🎉' : pct >= 55 ? '💪' : '📚'}</div>
          <h1 className="text-2xl font-extrabold" style={{ color: 'var(--text)' }}>תוצאות בחינה</h1>

          {/* Grade ring */}
          <svg width={130} height={130} viewBox="0 0 130 130">
            <circle cx={65} cy={65} r={54} fill="none" stroke="var(--border)" strokeWidth={9} />
            <circle cx={65} cy={65} r={54} fill="none" stroke={gradeColor} strokeWidth={9}
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 54}
              strokeDashoffset={2 * Math.PI * 54 * (1 - pct / 100)}
              transform="rotate(-90 65 65)"
              style={{ transition: 'stroke-dashoffset 1.2s ease' }}
            />
            <text x={65} y={60} textAnchor="middle" dominantBaseline="middle"
              fontSize={24} fontWeight="800" fill={gradeColor}>{pct}%</text>
            <text x={65} y={80} textAnchor="middle" fontSize={12} fill="var(--text-muted)">{grade}</text>
          </svg>

          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {scored} / {total} נקודות · זמן שנותר: {formatTime(timeLeft)}
          </div>

          {/* Per-unit breakdown */}
          <GlassCard padding="md" className="w-full">
            <p className="text-xs font-bold mb-3" style={{ color: 'var(--text-muted)' }}>פירוט לפי יחידה</p>
            <div className="space-y-2">
              {Object.entries(byUnit).map(([uid, { scored: s, total: t }]) => {
                const color = UNIT_COLORS[Number(uid)]
                const p = t ? Math.round((s / t) * 100) : 0
                return (
                  <div key={uid}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span style={{ color: 'var(--text)' }}>יחידה {uid}</span>
                      <span style={{ color }}>{s}/{t} נק׳ ({p}%)</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                      <div style={{ width: `${p}%`, background: color, height: '100%',
                        borderRadius: 999, transition: 'width 0.8s ease' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassCard>

          {/* Traps hit */}
          {trapsHit.length > 0 && (
            <GlassCard padding="md" className="w-full">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} style={{ color: 'var(--danger)' }} />
                <p className="text-xs font-bold" style={{ color: 'var(--danger)' }}>
                  מלכודות שנפלת בהן
                </p>
              </div>
              <div className="space-y-2">
                {trapsHit.map(trapId => {
                  const meta = TRAP_META[trapId]
                  if (!meta) return null
                  return (
                    <div key={trapId} className="flex items-center justify-between rounded-lg px-2 py-1.5"
                      style={{ background: 'color-mix(in srgb, var(--danger) 10%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--danger) 25%, transparent)' }}>
                      <span className="text-xs" style={{ color: 'var(--text)' }}>⚠️ {meta.label}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                        style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                        Node {meta.nodeId}
                      </span>
                    </div>
                  )
                })}
              </div>
            </GlassCard>
          )}

          <div className="flex gap-3 w-full">
            <button onClick={() => {
              setPhase('intro')
              setQIdx(0)
              setPartIdx(0)
              setAnswers({})
              setTimeLeft(EXAM_DURATION)
              setRevealed(false)
            }}
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

  // ── Active exam ──────────────────────────────────────────────────
  const q       = questions[qIdx]
  const part    = q.parts[partIdx]
  const color   = UNIT_COLORS[q.unitId]
  const timeWarning = timeLeft < 10 * 60

  // Total parts count for progress bar
  const totalPartsAll  = questions.reduce((s, mq) => s + mq.parts.length, 0)
  const answeredSoFar  = Object.keys(answers).length
  const progressPct    = (answeredSoFar / totalPartsAll) * 100

  return (
    <div dir="rtl" className="min-h-screen p-4 pb-8" style={{ background: 'var(--bg)' }}>

      {/* ── Header ── */}
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => { if (confirm('לצאת מהבחינה?')) { clearInterval(timerRef.current!); setPhase('results') } }}
          aria-label="יציאה מהבחינה"
          className="flex items-center gap-1 text-sm rounded-xl px-2.5 py-1.5 flex-shrink-0"
          style={{ color: 'var(--text-muted)', background: 'var(--accent-soft)' }}>
          <ChevronLeft size={13} style={{ transform: 'rotate(180deg)' }} /> יציאה
        </button>
        <div className="flex-1 text-xs font-bold" style={{ color: 'var(--text)' }}>
          שאלה {qIdx + 1}/{questions.length} · חלק {partIdx + 1}/{q.parts.length}
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl flex-shrink-0"
          style={{ background: timeWarning ? 'rgba(239,68,68,0.12)' : 'var(--card)',
            border: `1px solid ${timeWarning ? '#EF4444' : 'var(--border)'}` }}>
          <Timer size={12} style={{ color: timeWarning ? '#EF4444' : 'var(--text-muted)' }} />
          <span className="text-xs font-bold" style={{ color: timeWarning ? '#EF4444' : 'var(--text)' }}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="h-1 rounded-full overflow-hidden mb-3" style={{ background: 'var(--border)' }}>
        <motion.div className="h-full rounded-full" style={{ background: color }}
          animate={{ width: `${progressPct}%` }} transition={{ duration: 0.3 }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={`${qIdx}-${partIdx}`}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}
          className="space-y-3">

          {/* ── Question context card (always visible) ── */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="h-1" style={{ background: color }} />
            <div className="px-4 pt-3 pb-1 flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                style={{ background: `color-mix(in srgb, ${color} 18%, transparent)`, color }}>
                יחידה {q.unitId}
              </span>
              <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                <BookOpen size={10} /> {q.source}
              </span>
            </div>
            <div className="px-4 pb-3">
              {q.context}
            </div>
          </div>

          {/* ── Parts navigation ── */}
          <div className="flex gap-1.5 flex-wrap">
            {q.parts.map((p, pi) => {
              const key      = `${qIdx}-${pi}`
              const result   = answers[key]
              const isCurrent = pi === partIdx
              const isLocked = !result && pi > partIdx

              return (
                <button
                  key={p.id}
                  onClick={() => jumpToPart(qIdx, pi)}
                  disabled={isLocked}
                  aria-label={`חלק ${p.id}`}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
                  style={{
                    background: isCurrent
                      ? `color-mix(in srgb, ${color} 22%, transparent)`
                      : result === 'knew'
                      ? 'color-mix(in srgb, #22C55E 15%, transparent)'
                      : result === 'missed'
                      ? 'color-mix(in srgb, #EF4444 15%, transparent)'
                      : 'var(--bg)',
                    color: isCurrent ? color
                      : result === 'knew' ? '#22C55E'
                      : result === 'missed' ? '#EF4444'
                      : 'var(--text-muted)',
                    border: `1px solid ${isCurrent ? color
                      : result === 'knew' ? '#22C55E'
                      : result === 'missed' ? '#EF4444'
                      : 'var(--border)'}`,
                    opacity: isLocked ? 0.4 : 1,
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                  }}>
                  {isLocked
                    ? <Lock size={9} />
                    : result === 'knew'
                    ? <CheckCircle size={9} />
                    : result === 'missed'
                    ? <XCircle size={9} />
                    : null}
                  {p.id}
                  <span className="text-[9px] opacity-70">{p.points}נק</span>
                </button>
              )
            })}
          </div>

          {/* ── Scratchpad notice ── */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            📓 <span>פתחו מחברת ופתרו על נייר לפני שתמשיכו</span>
          </div>

          {/* ── Current part ── */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="px-4 pt-4 pb-3">
              {part.prompt}
            </div>

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
                  <div className="mx-4 mb-3 p-3 rounded-xl text-sm leading-relaxed"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                    {part.answer}
                  </div>
                  <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                    <button onClick={() => markPart('missed')}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold active:scale-95"
                      style={{ background: 'color-mix(in srgb, #EF4444 16%, transparent)', color: '#EF4444' }}>
                      <XCircle size={15} /> לא ידעתי
                    </button>
                    <button onClick={() => markPart('knew')}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold active:scale-95"
                      style={{ background: 'color-mix(in srgb, #22C55E 16%, transparent)', color: '#22C55E' }}>
                      <CheckCircle size={15} /> ידעתי
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
