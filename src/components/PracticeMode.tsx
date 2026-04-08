/**
 * PracticeMode — main practice screen
 * • Unit filter + difficulty filter
 * • Daily goal ring
 * • Streak counter
 * • Session summary with XP
 * • Stats panel
 * • Badge toast
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Target, RotateCcw, BarChart2, Flame, Zap } from 'lucide-react'
import { usePracticeSession, DAILY_GOAL, BADGE_DEFS } from '../hooks/usePracticeSession'
import PracticeCard from './PracticeCard'
import { UNITS } from '../data/units'
import type { PracticeConfidence } from '../types'

interface Props { onBack: () => void }

const UNIT_COLORS: Record<number, string> = {
  1: '#0D9488', 2: '#7C3AED', 3: '#EA580C', 4: '#0369A1', 5: '#BE185D',
}

type Tab = 'session' | 'stats'

export default function PracticeMode({ onBack }: Props) {
  const [unitFilter, setUnitFilter] = useState<number | null>(null)
  const [diffFilter, setDiffFilter] = useState<1|2|3|null>(null)
  const [started, setStarted]       = useState(false)
  const [tab, setTab]               = useState<Tab>('session')

  const session = usePracticeSession(unitFilter, diffFilter)

  // ── Badge toast ───────────────────────────────────────────────────
  const badgeDef = session.newBadge
    ? BADGE_DEFS.find(b => b.id === session.newBadge!.id)
    : null

  // ── Pre-session selector ──────────────────────────────────────────
  if (!started) {
    const { daily, xp, stats, badges } = session
    const dailyPct = Math.min(daily.answered / DAILY_GOAL, 1)
    const circumference = 2 * Math.PI * 24
    const arc = circumference * (1 - dailyPct)

    return (
      <div dir="rtl" className="min-h-screen p-4 pb-8" style={{ background: 'var(--bg)' }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={onBack} aria-label="חזרה"
            className="flex items-center gap-1 text-sm rounded-xl px-3 py-1.5"
            style={{ color: 'var(--text-muted)', background: 'var(--accent-soft)' }}>
            <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} />
            חזרה
          </button>
          <div className="flex items-center gap-2 flex-1">
            <Target size={18} style={{ color: 'var(--accent)' }} />
            <h1 className="font-extrabold text-xl" style={{ color: 'var(--text)' }}>תרגול</h1>
          </div>
          {/* Tab toggle */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {(['session','stats'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-3 py-1.5 text-xs font-semibold transition-all"
                style={{
                  background: tab === t ? 'var(--accent)' : 'var(--card)',
                  color: tab === t ? '#fff' : 'var(--text-muted)',
                }}>
                {t === 'session' ? '▶ תרגול' : '📊 סטטיסטיקה'}
              </button>
            ))}
          </div>
        </div>

        {tab === 'stats' ? (
          <StatsPanel stats={stats} xp={xp} badges={badges} />
        ) : (
          <>
            {/* Daily goal + streak row */}
            <div className="flex gap-3 mb-5">
              {/* Daily ring */}
              <div className="flex items-center gap-3 flex-1 rounded-2xl p-3"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <svg width={56} height={56} viewBox="0 0 56 56">
                  <circle cx={28} cy={28} r={24} fill="none" stroke="var(--border)" strokeWidth={5} />
                  <circle cx={28} cy={28} r={24} fill="none"
                    stroke={dailyPct >= 1 ? '#22C55E' : 'var(--accent)'}
                    strokeWidth={5} strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={arc}
                    transform="rotate(-90 28 28)"
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                  />
                  <text x={28} y={28} textAnchor="middle" dominantBaseline="central"
                    fontSize={11} fontWeight="bold"
                    fill={dailyPct >= 1 ? '#22C55E' : 'var(--accent)'}>
                    {daily.answered}/{DAILY_GOAL}
                  </text>
                </svg>
                <div>
                  <div className="text-xs font-bold" style={{ color: 'var(--text)' }}>יעד יומי</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {dailyPct >= 1 ? '✅ הושלם!' : `עוד ${DAILY_GOAL - daily.answered} שאלות`}
                  </div>
                </div>
              </div>

              {/* Streak */}
              <div className="flex flex-col items-center justify-center rounded-2xl px-4"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', minWidth: 80 }}>
                <Flame size={20} color={daily.streak > 0 ? '#F97316' : 'var(--text-muted)'} />
                <span className="text-xl font-extrabold" style={{ color: daily.streak > 0 ? '#F97316' : 'var(--text-muted)' }}>
                  {daily.streak}
                </span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>ימים</span>
              </div>

              {/* XP */}
              <div className="flex flex-col items-center justify-center rounded-2xl px-4"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', minWidth: 70 }}>
                <Zap size={18} color="#EAB308" />
                <span className="text-xl font-extrabold" style={{ color: '#EAB308' }}>{xp.total}</span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>XP</span>
              </div>
            </div>

            {/* Unit filter */}
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>יחידה</p>
            <div className="space-y-1.5 mb-4">
              <FilterBtn active={unitFilter === null} color="var(--accent)" onClick={() => setUnitFilter(null)}>
                🎲 כל היחידות
              </FilterBtn>
              {UNITS.map(unit => (
                <FilterBtn key={unit.id} active={unitFilter === unit.id}
                  color={UNIT_COLORS[unit.id]} onClick={() => setUnitFilter(unit.id)}>
                  {unit.icon} יחידה {unit.id} — {unit.title}
                </FilterBtn>
              ))}
            </div>

            {/* Difficulty filter */}
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>רמת קושי</p>
            <div className="flex gap-2 mb-5">
              {([null, 1, 2, 3] as (1|2|3|null)[]).map(d => (
                <button key={String(d)} onClick={() => setDiffFilter(d)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: diffFilter === d ? 'var(--accent)' : 'var(--card)',
                    color: diffFilter === d ? '#fff' : 'var(--text-muted)',
                    border: '1px solid var(--border)',
                  }}>
                  {d === null ? 'הכל' : '★'.repeat(d) + '☆'.repeat(3-d)}
                </button>
              ))}
            </div>

            <button onClick={() => setStarted(true)}
              className="w-full py-3.5 rounded-xl text-sm font-bold transition-all active:scale-95"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              התחל תרגול — 10 שאלות
            </button>
            <p className="text-[11px] text-center mt-2" style={{ color: 'var(--text-muted)' }}>
              SM-2 · שאלות שפספסת חוזרות מהר יותר
            </p>
          </>
        )}
      </div>
    )
  }

  // ── Session done ──────────────────────────────────────────────────
  if (session.sessionDone) {
    const { knew, unsure, missed, total, xpEarned } = session.sessionProgress
    const pct = Math.round((knew / total) * 100)
    return (
      <div dir="rtl" className="min-h-screen p-4 pb-8 flex flex-col" style={{ background: 'var(--bg)' }}>
        <button onClick={onBack} aria-label="חזרה"
          className="flex items-center gap-1 text-sm rounded-xl px-3 py-1.5 mb-6 self-start"
          style={{ color: 'var(--text-muted)', background: 'var(--accent-soft)' }}>
          <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} /> חזרה
        </button>

        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-6xl">
            {pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '💪' : '📚'}
          </motion.div>
          <h2 className="font-extrabold text-2xl" style={{ color: 'var(--text)' }}>סיכום סשן</h2>

          {/* XP earned */}
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.3)' }}>
            <Zap size={16} color="#EAB308" />
            <span className="font-bold text-lg" style={{ color: '#EAB308' }}>+{xpEarned} XP</span>
          </motion.div>

          <div className="w-full max-w-xs rounded-2xl overflow-hidden"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="p-4 space-y-3">
              <ResultRow label="ידעתי ✓" value={knew} total={total} color="#22C55E" />
              <ResultRow label="לא בטוח ±" value={unsure} total={total} color="#F59E0B" />
              <ResultRow label="לא ידעתי ✗" value={missed} total={total} color="#EF4444" />
            </div>
            <div className="px-4 pb-4">
              <div className="h-2 rounded-full overflow-hidden flex" style={{ background: 'var(--border)' }}>
                <div style={{ width: `${(knew/total)*100}%`, background: '#22C55E', height: '100%' }} />
                <div style={{ width: `${(unsure/total)*100}%`, background: '#F59E0B', height: '100%' }} />
                <div style={{ width: `${(missed/total)*100}%`, background: '#EF4444', height: '100%' }} />
              </div>
            </div>
          </div>

          {/* Streak banner */}
          {session.daily.streak > 0 && (
            <div className="flex items-center gap-2 text-sm font-semibold"
              style={{ color: '#F97316' }}>
              <Flame size={16} /> {session.daily.streak} ימי רצף!
            </div>
          )}

          <div className="flex gap-3 w-full max-w-xs">
            <button onClick={session.restartSession}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold active:scale-95"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              <RotateCcw size={14} /> סשן נוסף
            </button>
            <button onClick={() => { session.restartSession(); setStarted(false) }}
              className="flex-1 py-3 rounded-xl text-sm font-semibold active:scale-95"
              style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }}>
              שנה פילטר
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Active session ────────────────────────────────────────────────
  const { total, knew, unsure, missed } = session.sessionProgress
  const progressPct = (session.sessionProgress.total / session.sessionSize) * 100

  return (
    <div dir="rtl" className="min-h-screen p-4 pb-8" style={{ background: 'var(--bg)' }}>
      {/* Badge toast */}
      <AnimatePresence>
        {session.newBadge && badgeDef && (
          <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-4 left-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg"
            style={{ background: 'var(--card)', border: '2px solid #EAB308' }}
            onClick={session.dismissBadge}>
            <span className="text-2xl">{badgeDef.emoji}</span>
            <div>
              <div className="text-xs font-bold" style={{ color: '#EAB308' }}>תג חדש!</div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{badgeDef.label}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <button onClick={onBack} aria-label="חזרה"
          className="flex items-center gap-1 text-sm rounded-xl px-3 py-1.5"
          style={{ color: 'var(--text-muted)', background: 'var(--accent-soft)' }}>
          <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} /> חזרה
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Target size={15} style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>תרגול</span>
          {unitFilter && (
            <span className="text-[11px] px-2 py-0.5 rounded-md"
              style={{ background: `color-mix(in srgb, ${UNIT_COLORS[unitFilter]} 18%, transparent)`, color: UNIT_COLORS[unitFilter] }}>
              יח' {unitFilter}
            </span>
          )}
          {diffFilter && (
            <span className="text-[11px] px-2 py-0.5 rounded-md" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
              {'★'.repeat(diffFilter)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Zap size={13} color="#EAB308" />
          <span className="text-xs font-bold" style={{ color: '#EAB308' }}>+{session.sessionProgress.xpEarned}</span>
          <span className="text-xs font-bold mono" style={{ color: 'var(--accent)' }}>
            {total}/{session.sessionSize}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: 'var(--border)' }}>
        <motion.div className="h-full rounded-full" style={{ background: 'var(--accent)' }}
          animate={{ width: `${progressPct}%` }} transition={{ duration: 0.4, ease: 'easeOut' }} />
      </div>

      {/* Mini stats */}
      <div className="flex gap-3 mb-4 text-xs font-semibold">
        <span style={{ color: '#22C55E' }}>✓ {knew}</span>
        <span style={{ color: '#F59E0B' }}>± {unsure}</span>
        <span style={{ color: '#EF4444' }}>✗ {missed}</span>
      </div>

      <AnimatePresence mode="wait">
        <PracticeCard key={session.currentQuestion.id + '-' + total}
          question={session.currentQuestion} onAnswer={session.recordAnswer} />
      </AnimatePresence>
    </div>
  )
}

// ── Helper components ─────────────────────────────────────────────────
function FilterBtn({ active, color, onClick, children }: {
  active: boolean; color: string; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
      style={{
        background: active ? `color-mix(in srgb, ${color} 18%, transparent)` : 'var(--card)',
        color: active ? color : 'var(--text)',
        border: `1px solid ${active ? color : 'var(--border)'}`,
      }}>
      {children}
    </button>
  )
}

function ResultRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
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

function StatsPanel({ stats, xp, badges }: {
  stats: ReturnType<typeof usePracticeSession>['stats']
  xp: ReturnType<typeof usePracticeSession>['xp']
  badges: ReturnType<typeof usePracticeSession>['badges']
}) {
  return (
    <div className="space-y-4">
      {/* Overview */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'שאלות', val: stats.totalAnswered, color: 'var(--accent)' },
          { label: 'שלטתי', val: stats.masteredCount, color: '#22C55E' },
          { label: 'לחזרה', val: stats.dueCount, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3 text-center"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="text-xl font-extrabold" style={{ color: s.color }}>{s.val}</div>
            <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Per unit */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="px-4 pt-3 pb-1 text-xs font-bold" style={{ color: 'var(--text-muted)' }}>התקדמות לפי יחידה</div>
        <div className="p-3 space-y-2">
          {stats.byUnit.map(({ unitId, total, known }) => {
            const color = UNIT_COLORS[unitId]
            const pct = total ? (known / total) * 100 : 0
            const unit = UNITS.find(u => u.id === unitId)
            return (
              <div key={unitId}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span style={{ color: 'var(--text)' }}>{unit?.icon} יחידה {unitId}</span>
                  <span style={{ color }}>{known}/{total}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Total XP */}
      <div className="flex items-center gap-3 rounded-xl px-4 py-3"
        style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)' }}>
        <Zap size={20} color="#EAB308" />
        <div>
          <div className="font-extrabold text-lg" style={{ color: '#EAB308' }}>{xp.total} XP</div>
          <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>סה"כ נצבר</div>
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div>
          <div className="text-xs font-bold mb-2" style={{ color: 'var(--text-muted)' }}>תגים שנצברו</div>
          <div className="flex flex-wrap gap-2">
            {badges.map(b => {
              const def = BADGE_DEFS.find(bd => bd.id === b.id)
              return def ? (
                <div key={b.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                  style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', color: '#EAB308' }}>
                  {def.emoji} {def.label}
                </div>
              ) : null
            })}
          </div>
        </div>
      )}
      {badges.length === 0 && (
        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          תתחיל לתרגל כדי לצבור תגים 🏅
        </p>
      )}
    </div>
  )
}
