import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Eye, Wrench, Zap, CheckCircle, ChevronRight, RotateCcw } from 'lucide-react'
import type { PhaseId, NodeMeta, NodeType } from '../types'
import { useNodeProgress } from '../hooks/useNodeProgress'
import { UNITS } from '../data/units'
import Confetti from './Confetti'

interface NodeLayoutProps {
  meta: NodeMeta
  explore: ReactNode
  build: ReactNode
  apply: ReactNode
  onBack: () => void
}

const PHASES: { id: PhaseId; label: string; sublabel: string; icon: typeof Eye; color: string }[] = [
  { id: 'explore', label: 'חקור',  sublabel: 'הבן את הפנומנון', icon: Eye,    color: 'var(--teal)' },
  { id: 'build',   label: 'בנה',   sublabel: 'גזור צעד אחרי צעד', icon: Wrench, color: 'var(--accent)' },
  { id: 'apply',   label: 'יישם',  sublabel: 'מה קורה אם...?',   icon: Zap,    color: 'var(--warn)' },
]

const TYPE_LABELS: Record<NodeType, string> = {
  Concept: 'מושג', Theorem: 'הוכחה', Procedure: 'אלגוריתם', Application: 'יישום',
}
const TYPE_COLORS: Record<NodeType, string> = {
  Concept: 'var(--teal)', Theorem: 'var(--accent)', Procedure: 'var(--warn)', Application: 'var(--success)',
}

export default function NodeLayout({ meta, explore, build, apply, onBack }: NodeLayoutProps) {
  const { progress, setPhase, reset } = useNodeProgress(meta.id)
  const [active, setActive] = useState<PhaseId>(progress.currentPhase)
  const [showConfetti, setShowConfetti] = useState(false)

  const phaseContent: Record<PhaseId, ReactNode> = { explore, build, apply }
  const phaseOrder: PhaseId[] = ['explore', 'build', 'apply']
  const currentIdx = phaseOrder.indexOf(progress.currentPhase)
  const completedPhases: Record<PhaseId, boolean> = {
    explore: currentIdx > 0 || progress.status === 'done',
    build:   currentIdx > 1 || progress.status === 'done',
    apply:   progress.status === 'done',
  }

  // Breadcrumb
  const unit = UNITS.find(u => u.id === meta.unitId)

  function handlePhaseClick(id: PhaseId) {
    const targetIdx = phaseOrder.indexOf(id)
    const curIdx    = phaseOrder.indexOf(progress.currentPhase)
    if (targetIdx <= curIdx || completedPhases[id]) {
      setActive(id)
    } else if (targetIdx === curIdx + 1) {
      setActive(id)
      setPhase(id)
    }
  }

  function advancePhase() {
    const next: PhaseId = active === 'explore' ? 'build' : 'apply'
    setActive(next)
    setPhase(next)
    // Confetti when entering apply (final phase)
    if (next === 'apply') setShowConfetti(true)
  }

  return (
    <div dir="rtl" className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Confetti trigger={showConfetti} onDone={() => setShowConfetti(false)} />

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 px-4 py-3"
        style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-[11px] mb-2" aria-label="breadcrumb"
          style={{ color: 'var(--text-muted)' }}>
          <button onClick={onBack} aria-label="חזרה לרשימת יחידות"
            className="hover:underline transition-all" style={{ color: 'var(--accent)' }}>
            {unit?.icon} {unit?.title ?? `יחידה ${meta.unitId}`}
          </button>
          <ChevronRight size={10} style={{ transform: 'rotate(180deg)' }} />
          <span style={{ color: 'var(--text)' }}>{meta.title}</span>
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={onBack} aria-label="חזרה"
            className="flex items-center gap-1.5 text-sm font-medium rounded-xl px-3 py-1.5 transition-all active:scale-95"
            style={{ color: 'var(--text-muted)', background: 'var(--accent-soft)' }}>
            <ArrowRight size={14} />
            חזרה
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: `color-mix(in srgb, ${TYPE_COLORS[meta.type]} 15%, transparent)`, color: TYPE_COLORS[meta.type] }}>
                {TYPE_LABELS[meta.type]}
              </span>
              {meta.isScaffolded && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'var(--warn-soft)', color: 'var(--warn)' }}>
                  ⚙️ גזירה מורחבת
                </span>
              )}
              {progress.status === 'done' && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>
                  ✓ הושלם
                </span>
              )}
            </div>
            <h1 className="text-base font-bold leading-tight mt-0.5 truncate" style={{ color: 'var(--text)' }}>
              {meta.title}
            </h1>
          </div>

          <button onClick={() => { if (confirm('לאפס את ההתקדמות בצומת זה?')) { reset(); setActive('explore') } }}
            title="איפוס התקדמות" aria-label="איפוס התקדמות"
            className="flex items-center justify-center w-8 h-8 rounded-xl transition-all active:scale-95 hover:opacity-80"
            style={{ color: 'var(--text-muted)', background: 'var(--accent-soft)' }}>
            <RotateCcw size={14} />
          </button>
        </div>
      </header>

      {/* ── Phase tabs ───────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex gap-2" role="tablist" aria-label="שלבי למידה">
          {PHASES.map((ph, idx) => {
            const isActive = active === ph.id
            const isDone   = completedPhases[ph.id]
            const curIdx   = phaseOrder.indexOf(progress.currentPhase)
            const isLocked = idx > curIdx && !isDone
            return (
              <button key={ph.id} role="tab" aria-selected={isActive} aria-label={ph.label}
                onClick={() => !isLocked && handlePhaseClick(ph.id)}
                disabled={isLocked}
                className="flex-1 rounded-xl py-2.5 px-3 text-right transition-all duration-200"
                style={{
                  background: isActive ? `color-mix(in srgb, ${ph.color} 14%, var(--card))` : 'var(--card)',
                  border: `1.5px solid ${isActive ? ph.color : 'var(--border)'}`,
                  opacity: isLocked ? 0.45 : 1,
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  boxShadow: isActive ? `0 0 0 3px color-mix(in srgb, ${ph.color} 18%, transparent)` : 'none',
                }}>
                <div className="flex items-center justify-between">
                  <ph.icon size={15} style={{ color: isActive ? ph.color : 'var(--text-muted)' }} aria-hidden />
                  {isDone && <CheckCircle size={13} style={{ color: 'var(--success)' }} aria-label="הושלם" />}
                </div>
                <div className="mt-1 text-xs font-bold" style={{ color: isActive ? ph.color : 'var(--text)' }}>{ph.label}</div>
                <div className="text-[10px] leading-none mt-0.5" style={{ color: 'var(--text-muted)' }}>{ph.sublabel}</div>
              </button>
            )
          })}
        </div>

        {/* Phase progress bar */}
        <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}
          role="progressbar" aria-valuenow={active === 'explore' ? 33 : active === 'build' ? 66 : 100}
          aria-valuemin={0} aria-valuemax={100}>
          <motion.div className="h-full rounded-full" style={{ background: 'var(--accent)' }}
            animate={{ width: active === 'explore' ? '33%' : active === 'build' ? '66%' : '100%' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }} />
        </div>
      </div>

      {/* ── Phase content ─────────────────────────────────────────────── */}
      <main className="px-4 pb-8 pt-2">
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
            {phaseContent[active]}
          </motion.div>
        </AnimatePresence>

        {active !== 'apply' && (
          <div className="mt-6 flex justify-start">
            <button onClick={advancePhase}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95"
              style={{ background: 'var(--accent)', color: '#fff',
                boxShadow: '0 2px 12px color-mix(in srgb, var(--accent) 35%, transparent)' }}>
              {active === 'explore' ? 'המשך לבנייה' : 'המשך ליישום 🎉'}
              <ChevronRight size={15} style={{ transform: 'rotate(180deg)' }} />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
