import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Target, RotateCcw } from 'lucide-react'
import { usePracticeSession } from '../hooks/usePracticeSession'
import PracticeCard from './PracticeCard'
import { UNITS } from '../data/units'
import type { PracticeConfidence } from '../types'

interface Props {
  onBack: () => void
}

const UNIT_COLORS: Record<number, string> = {
  1: '#0D9488',
  2: '#7C3AED',
  3: '#EA580C',
  4: '#0369A1',
  5: '#BE185D',
}

export default function PracticeMode({ onBack }: Props) {
  const [unitFilter, setUnitFilter] = useState<number | null>(null)
  const [started, setStarted] = useState(false)

  const session = usePracticeSession(unitFilter)

  function handleAnswer(c: PracticeConfidence) {
    session.recordAnswer(c)
  }

  // ── Unit selector (pre-session) ──────────────────────────────────
  if (!started) {
    return (
      <div dir="rtl" className="min-h-screen p-4 pb-8" style={{ background: 'var(--bg)' }}>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack}
            className="flex items-center gap-1 text-sm rounded-xl px-3 py-1.5 transition-all"
            style={{ color: 'var(--text-muted)', background: 'var(--accent-soft)' }}>
            <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} />
            חזרה
          </button>
          <div className="flex items-center gap-2">
            <Target size={18} style={{ color: 'var(--accent)' }} />
            <h1 className="font-extrabold text-xl" style={{ color: 'var(--text)' }}>תרגול אקראי</h1>
          </div>
        </div>

        <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
          בחר יחידה לתרגול ממוקד, או תרגל שאלות מכל החומר.
        </p>

        {/* Unit filter buttons */}
        <div className="space-y-2 mb-6">
          <button
            onClick={() => setUnitFilter(null)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
            style={{
              background: unitFilter === null ? 'var(--accent)' : 'var(--card)',
              color: unitFilter === null ? '#fff' : 'var(--text)',
              border: '1px solid var(--border)',
            }}
          >
            <span className="text-xl">🎲</span>
            כל היחידות
          </button>

          {UNITS.map(unit => {
            const color = UNIT_COLORS[unit.id]
            const active = unitFilter === unit.id
            return (
              <button
                key={unit.id}
                onClick={() => setUnitFilter(unit.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
                style={{
                  background: active
                    ? `color-mix(in srgb, ${color} 18%, transparent)`
                    : 'var(--card)',
                  color: active ? color : 'var(--text)',
                  border: `1px solid ${active ? color : 'var(--border)'}`,
                }}
              >
                <span className="text-xl">{unit.icon}</span>
                <span className="flex-1 text-right">
                  <span className="text-[11px] mr-2 opacity-60">יחידה {unit.id}</span>
                  {unit.title}
                </span>
              </button>
            )
          })}
        </div>

        <button
          onClick={() => setStarted(true)}
          className="w-full py-3.5 rounded-xl text-sm font-bold transition-all active:scale-95"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          התחל תרגול — 10 שאלות
        </button>

        <p className="text-[11px] text-center mt-3" style={{ color: 'var(--text-muted)' }}>
          השאלות נבחרות לפי אלגוריתם ח·ז·ר — שאלות שפספסת חוזרות מהר יותר
        </p>
      </div>
    )
  }

  // ── Session done ─────────────────────────────────────────────────
  if (session.sessionDone) {
    const { knew, unsure, missed, total } = session.sessionProgress
    const pctKnew = Math.round((knew / total) * 100)

    return (
      <div dir="rtl" className="min-h-screen p-4 pb-8 flex flex-col" style={{ background: 'var(--bg)' }}>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack}
            className="flex items-center gap-1 text-sm rounded-xl px-3 py-1.5"
            style={{ color: 'var(--text-muted)', background: 'var(--accent-soft)' }}>
            <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} />
            חזרה
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-5">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl"
          >
            {pctKnew >= 80 ? '🎉' : pctKnew >= 50 ? '💪' : '📚'}
          </motion.div>

          <h2 className="font-extrabold text-2xl" style={{ color: 'var(--text)' }}>
            סיכום סשן
          </h2>

          <div className="w-full max-w-xs rounded-2xl overflow-hidden"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="p-4 space-y-3">
              <ResultRow label="ידעתי ✓" value={knew} total={total} color="#22C55E" />
              <ResultRow label="לא בטוח ±" value={unsure} total={total} color="#F59E0B" />
              <ResultRow label="לא ידעתי ✗" value={missed} total={total} color="#EF4444" />
            </div>
            <div className="px-4 pb-4">
              <div className="h-2 rounded-full overflow-hidden flex" style={{ background: 'var(--border)' }}>
                <div className="h-full transition-all" style={{ width: `${(knew/total)*100}%`, background: '#22C55E' }} />
                <div className="h-full transition-all" style={{ width: `${(unsure/total)*100}%`, background: '#F59E0B' }} />
                <div className="h-full transition-all" style={{ width: `${(missed/total)*100}%`, background: '#EF4444' }} />
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full max-w-xs">
            <button
              onClick={() => { session.restartSession(); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              <RotateCcw size={14} />
              סשן נוסף
            </button>
            <button
              onClick={() => { session.restartSession(); setStarted(false); }}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }}
            >
              שנה יחידה
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Active session ────────────────────────────────────────────────
  const { total, knew, unsure, missed } = session.sessionProgress
  const answered = knew + unsure + missed
  const progressPct = (answered / session.sessionSize) * 100

  return (
    <div dir="rtl" className="min-h-screen p-4 pb-8" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack}
          className="flex items-center gap-1 text-sm rounded-xl px-3 py-1.5"
          style={{ color: 'var(--text-muted)', background: 'var(--accent-soft)' }}>
          <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} />
          חזרה
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Target size={15} style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>תרגול</span>
          {unitFilter && (
            <span className="text-[11px] px-2 py-0.5 rounded-md"
              style={{ background: `color-mix(in srgb, ${UNIT_COLORS[unitFilter]} 18%, transparent)`, color: UNIT_COLORS[unitFilter] }}>
              יחידה {unitFilter}
            </span>
          )}
        </div>
        <span className="text-xs font-bold mono" style={{ color: 'var(--accent)', direction: 'ltr' }}>
          {answered}/{session.sessionSize}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full overflow-hidden mb-5" style={{ background: 'var(--border)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'var(--accent)' }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Mini stats */}
      <div className="flex gap-2 mb-4 text-[11px] font-semibold">
        <span style={{ color: '#22C55E' }}>✓ {knew}</span>
        <span style={{ color: '#F59E0B' }}>± {unsure}</span>
        <span style={{ color: '#EF4444' }}>✗ {missed}</span>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <PracticeCard
          key={session.currentQuestion.id + '-' + total}
          question={session.currentQuestion}
          onAnswer={handleAnswer}
        />
      </AnimatePresence>
    </div>
  )
}

function ResultRow({ label, value, total, color }: {
  label: string; value: number; total: number; color: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold w-24 text-right" style={{ color }}>{label}</span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <div className="h-full rounded-full transition-all"
          style={{ width: `${(value / total) * 100}%`, background: color }} />
      </div>
      <span className="text-xs font-bold w-6 text-center" style={{ color }}>{value}</span>
    </div>
  )
}
