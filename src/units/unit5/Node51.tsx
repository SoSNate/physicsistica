/**
 * Node 5.1 — הצבר הגרנד-קנוני
 * Explore: μ slider — רמות אנרגיה עם occupation כפונקציה של μ
 * Build:   Z_grand = Σ e^(-β(E-μN)), פוטנציאל כימי
 * Apply:   μ כ"מחיר" הוספת חלקיק
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import NodeLayout from '../../components/NodeLayout'
import ScaffoldedDerivation from '../../components/ScaffoldedDerivation'
import TrapCard from '../../components/TrapCard'
import GlassCard from '../../components/GlassCard'
import { BlockMath, M } from '../../components/MathBlock'
import { UNITS } from '../../data/units'
import type { DerivationStep } from '../../types'

const meta = UNITS[4].nodes[0]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — μ slider ורמות אנרגיה
// ══════════════════════════════════════════════════════════════════════
function ChemPotViz() {
  const [mu, setMu] = useState(2.5)   // in units of ε
  const [T, setT] = useState(1.0)     // in units of ε/kB

  const levels = [0, 1, 2, 3, 4, 5, 6]

  // Grand canonical occupation (Bose-like with no constraint, for visualization)
  function nAvg(eps: number): number {
    // For fermions: f(ε) = 1/(e^((ε-μ)/kT)+1)
    const x = (eps - mu) / T
    return 1 / (Math.exp(x) + 1)
  }

  const totalN = levels.reduce((s, eps) => s + nAvg(eps), 0)

  return (
    <div className="space-y-3">
      {/* Levels */}
      <div className="rounded-xl p-3 space-y-2" style={{ background: '#111827' }}>
        <div className="flex items-center justify-between text-[10px] mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span>ε/ε₀</span>
          <span>f(ε) — אחוז אכלוס</span>
          <span>⟨n⟩</span>
        </div>
        {levels.map(eps => {
          const occ = nAvg(eps)
          const isAboveMu = eps > mu
          const isNearMu = Math.abs(eps - mu) < 0.7
          return (
            <div key={eps} className="flex items-center gap-2">
              <span className="text-[10px] w-4 mono" style={{ color: 'rgba(255,255,255,0.5)' }}>{eps}</span>
              <div className="flex-1 h-4 rounded relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <motion.div className="absolute inset-y-0 left-0 rounded"
                  style={{ background: isNearMu ? '#FDE68A' : isAboveMu ? 'rgba(244,114,182,0.5)' : 'rgba(107,141,214,0.7)' }}
                  animate={{ width: `${occ * 100}%` }} transition={{ duration: 0.3 }} />
                <span className="absolute inset-0 flex items-center justify-center text-[9px]" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {(occ * 100).toFixed(0)}%
                </span>
              </div>
              <span className="text-[10px] w-8 mono" style={{ color: isNearMu ? '#FDE68A' : 'rgba(255,255,255,0.5)' }}>
                {occ.toFixed(2)}
              </span>
            </div>
          )
        })}
        {/* μ marker */}
        <div className="mt-1 flex items-center gap-2">
          <div className="flex-1 h-px" style={{ background: '#FDE68A' }} />
          <span className="text-[10px]" style={{ color: '#FDE68A' }}>μ = {mu.toFixed(1)}</span>
          <div className="flex-1 h-px" style={{ background: '#FDE68A' }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-semibold" style={{ color: '#FDE68A' }}>μ = {mu.toFixed(1)} ε₀</label>
          <input type="range" min={-1} max={7} step={0.1} value={mu} onChange={e => setMu(Number(e.target.value))} className="w-full mt-1" />
        </div>
        <div>
          <label className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>T = {T.toFixed(1)} ε₀/k_B</label>
          <input type="range" min={0.1} max={3} step={0.1} value={T} onChange={e => setT(Number(e.target.value))} className="w-full mt-1" />
        </div>
      </div>

      <GlassCard padding="sm" className="text-center">
        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>⟨N⟩ הכולל</div>
        <div className="text-base font-bold mono" style={{ color: 'var(--accent)' }}>{totalN.toFixed(2)}</div>
      </GlassCard>

      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        μ עולה ← יותר חלקיקים. הקו הצהוב מסמן את μ — רמות מתחתיו מאוכלסות יותר.
      </p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — הצבר גרנד-קנוני',
    content: (
      <div className="space-y-3">
        <p className="text-sm">מאגר מחליף גם אנרגיה וגם חלקיקים. הסתברות:</p>
        <BlockMath tex="P(E_i, N_i) \propto e^{-\beta(E_i - \mu N_i)}" />
        <p className="text-sm">פונקציית חלוקה גרנד-קנונית:</p>
        <BlockMath tex="\mathcal{Z} = \sum_{N=0}^\infty\sum_i e^{-\beta(E_i^{(N)} - \mu N)}" />
        <p className="text-sm">פוטנציאל כימי μ: לגרזן = "מחיר" להוספת חלקיק אחד.</p>
      </div>
    ),
    interimQuestion: {
      prompt: 'מה משמעות μ>0 לעומת μ<0?',
      hint: 'μ גבוה ← הוספת חלקיק מורידה אנרגיה חופשית',
      validate: s => s.includes('הוסף') || s.includes('מחיר') || s.includes('אנרגי') || true,
      correctAnswer: 'μ>0: הוספת חלקיק "מועילה" — גז צפוף/קר. μ<0: הוספה "עולה" — גז דליל/חם.',
    },
  },
  {
    title: 'שלב 2 — פוטנציאל כימי כמשחרר',
    content: (
      <div className="space-y-3">
        <p className="text-sm">הגדרה תרמודינמית:</p>
        <BlockMath tex="\mu = \left(\frac{\partial G}{\partial N}\right)_{T,P} = \left(\frac{\partial F}{\partial N}\right)_{T,V}" />
        <p className="text-sm">לגז אידיאלי קלאסי:</p>
        <BlockMath tex="\mu = k_BT\ln\frac{N}{V}\left(\frac{h^2}{2\pi mk_BT}\right)^{3/2}" />
        <p className="text-sm">בT קטן או n גדול, μ עולה ולבסוף μ→0 ← דגנרציה קוונטית!</p>
      </div>
    ),
    interimQuestion: {
      prompt: 'מה קורה ל-μ כשT→∞ (ריכוז קבוע)?',
      hint: 'μ = kT·ln(n·λ³) , λ = de Broglie ∝ 1/√T → 0',
      validate: s => s.includes('שלי') || s.includes('∞') || s.includes('-∞') || s.includes('מינוס'),
      correctAnswer: 'μ → -∞ (גז קלאסי דליל)',
    },
  },
]

export default function Node51({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>פוטנציאל כימי ואכלוס רמות</h3><ChemPotViz /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>הצבר גרנד-קנוני: μ כמשתנה שולט על N</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>μ בסוגי מערכות</h3>
            <div className="space-y-1.5 text-xs">
              {[
                { sys: 'גז קלאסי (T גבוה)', mu: 'μ < 0, |μ| גדל עם T', c: 'var(--text-muted)' },
                { sys: 'פרמיון T=0', mu: 'μ = E_F > 0', c: 'var(--accent)' },
                { sys: 'בוזון T<T_c (BEC)', mu: 'μ = 0', c: 'var(--success)' },
                { sys: 'פוטונים (μ=0 תמיד)', mu: 'N לא שמור', c: 'var(--warn)' },
              ].map(r => (
                <div key={r.sys} className="flex items-center gap-2 rounded-lg p-1.5" style={{ background: 'var(--accent-soft)' }}>
                  <span className="flex-1" style={{ color: 'var(--text)' }}>{r.sys}</span>
                  <span style={{ color: r.c }}>{r.mu}</span>
                </div>
              ))}
            </div>
          </GlassCard>
          <TrapCard
            title="μ = אנרגיית החלקיק?"
            wrongFormula="\mu = \varepsilon_{particle}"
            rightFormula="\mu = \left(\frac{\partial F}{\partial N}\right)_{T,V} \text{ — שינוי אנרגיה חופשית}"
            description="μ הוא שינוי אנרגיה חופשית בהוספת חלקיק. עבור גז אידיאלי μ ≠ E_kinetic — הוא כולל גם אנטרופיה."
          />
        </div>
      }
    />
  )
}
