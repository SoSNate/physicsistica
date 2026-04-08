/**
 * Node 4.1 — הצבר הקנוני ופקטור בולצמן
 * Explore: רמות אנרגיה דיסקרטיות + משקלי בולצמן אינטראקטיביים
 * Build:   מיקרו-קנוני → קנוני: e^(-E/kT)
 * Apply:   רמות דו-ערכיות, הרמוני
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

const meta = UNITS[3].nodes[0]
const kB = 1.38e-23

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — רמות אנרגיה + משקלי בולצמן
// ══════════════════════════════════════════════════════════════════════
const LEVELS = [0, 1, 2, 3, 4, 5]  // in units of ε

function BoltzmannLevels() {
  const [T, setT] = useState(1)   // in units of ε/k_B
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null)

  const weights = LEVELS.map(n => Math.exp(-n / T))
  const Z = weights.reduce((a, b) => a + b, 0)
  const probs = weights.map(w => w / Z)

  const maxW = weights[0]

  return (
    <div className="space-y-3">
      {/* Energy levels diagram */}
      <div className="rounded-xl p-4 space-y-2" style={{ background: '#111827', minHeight: 220 }}>
        <div className="text-[10px] text-right" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Z = {Z.toFixed(3)}
        </div>
        {LEVELS.slice().reverse().map(n => {
          const prob = probs[n]
          const barW = (weights[n] / maxW) * 100
          return (
            <div key={n} className="flex items-center gap-2"
              onMouseEnter={() => setHoveredLevel(n)}
              onMouseLeave={() => setHoveredLevel(null)}>
              {/* Level label */}
              <span className="text-[10px] w-10 text-right mono" style={{ color: 'rgba(255,255,255,0.4)' }}>
                ε_{n}={n}
              </span>
              {/* Level line + population bar */}
              <div className="flex-1 relative h-6">
                <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                  <div className="w-full h-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
                </div>
                <motion.div
                  className="absolute top-1 bottom-1 left-0 rounded-r"
                  style={{ background: `rgba(107,141,214,${0.3 + prob * 0.7})` }}
                  animate={{ width: `${barW}%` }}
                  transition={{ duration: 0.4 }}
                />
                {hoveredLevel === n && (
                  <div className="absolute left-1 top-0.5 text-[9px]" style={{ color: '#FDE68A' }}>
                    p = {(prob * 100).toFixed(1)}% | e^(-{n}/{T.toFixed(1)})
                  </div>
                )}
              </div>
              <span className="text-[10px] w-12 mono" style={{ color: '#6B8DD6' }}>
                {(prob * 100).toFixed(1)}%
              </span>
            </div>
          )
        })}
      </div>

      {/* T slider */}
      <div>
        <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
          T = {T.toFixed(2)} (יח' ε/k_B)
        </label>
        <input type="range" min={0.1} max={5} step={0.05} value={T}
          onChange={e => setT(Number(e.target.value))} className="w-full mt-1" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <GlassCard padding="sm" className="text-center">
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>⟨E⟩ / ε</div>
          <div className="text-sm font-bold mono" style={{ color: 'var(--accent)' }}>
            {probs.reduce((s, p, i) => s + p * i, 0).toFixed(2)}
          </div>
        </GlassCard>
        <GlassCard padding="sm" className="text-center">
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>T→∞: p_n → ?</div>
          <div className="text-xs font-bold" style={{ color: 'var(--warn)' }}>
            {T > 4 ? `≈ 1/${LEVELS.length} = ${(100/LEVELS.length).toFixed(0)}%` : '...'}
          </div>
        </GlassCard>
      </div>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        בT נמוך: רק מצב הבסיס אוכלס. בT גבוה: כל הרמות שוות.
      </p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — מ-מיקרוקנוני לקנוני',
    content: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed">
          מערכת קטנה S בטמפרטורה T (מגע עם מאגר ענק). מה הסתברות למצוא S ב-אנרגיה E_i?
        </p>
        <p className="text-sm">מאגר עם אנרגיה E_tot - E_i, ריבוי:</p>
        <BlockMath tex="P(E_i) \propto \Omega_{bath}(E_{tot} - E_i) = e^{S_{bath}/k_B}" />
        <BlockMath tex="S_{bath} \approx S_0 - \frac{E_i}{T} \Rightarrow P(E_i) \propto e^{-E_i/k_BT}" />
      </div>
    ),
    interimQuestion: {
      prompt: 'מדוע הקירוב S_bath ≈ S₀ - E_i/T תקף?',
      hint: '∂S/∂E = 1/T, קירוב לינארי כשE_i ≪ E_total',
      validate: s => s.includes('קטן') || s.includes('לינ') || s.includes('∂S') || s.includes('גדול'),
      correctAnswer: 'כי E_i ≪ E_total — פיתוח טיילור ראשון',
    },
  },
  {
    title: 'שלב 2 — גורם בולצמן והסתברות',
    content: (
      <div className="space-y-3">
        <p className="text-sm">לאחר נרמול:</p>
        <BlockMath tex="P(E_i) = \frac{e^{-\beta E_i}}{Z}, \quad \beta = \frac{1}{k_BT}" />
        <BlockMath tex="Z = \sum_i e^{-\beta E_i} \quad \text{(פונקציית חלוקה)}" />
        <p className="text-sm">הסתברות גבוהה יותר ← אנרגיה נמוכה יותר. המקדם e^(-βE) נקרא <strong>גורם בולצמן</strong>.</p>
      </div>
    ),
    interimQuestion: {
      prompt: 'מה היחס P(E₁)/P(E₀) עבור E₁-E₀=kT?',
      hint: 'P(E₁)/P(E₀) = e^(-β·ΔE) = e^(-ΔE/kT)',
      validate: s => s.includes('e^-1') || s.includes('e⁻¹') || s.includes('1/e') || s.trim() === '1/e' || s.includes('0.37'),
      correctAnswer: 'e⁻¹ ≈ 0.37',
    },
  },
  {
    title: 'שלב 3 — אנרגיה ממוצעת',
    content: (
      <div className="space-y-3">
        <p className="text-sm">ממוצע קנוני:</p>
        <BlockMath tex="\langle E \rangle = \sum_i E_i P(E_i) = -\frac{\partial \ln Z}{\partial \beta}" />
        <p className="text-sm">אנטרופיה:</p>
        <BlockMath tex="F = -k_BT\ln Z, \quad S = -\left(\frac{\partial F}{\partial T}\right)_V" />
        <p className="text-sm leading-relaxed" style={{ color: 'var(--success)' }}>
          ✓ כל התרמודינמיקה נובעת מZ!
        </p>
      </div>
    ),
    interimQuestion: {
      prompt: 'עבור מערכת דו-רמתית (ε₀=0, ε₁=ε), מה Z?',
      hint: 'Z = e^0 + e^(-βε) = 1 + e^(-ε/kT)',
      validate: s => s.includes('1 + e') || s.includes('1+e') || s.includes('e^(-β') || s.includes('e^-β'),
      correctAnswer: 'Z = 1 + e^(-βε)',
    },
  },
]

export default function Node41({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>רמות אנרגיה ומשקלי בולצמן</h3><BoltzmannLevels /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>גזירת גורם בולצמן e^(-E/kT) מהצבר המיקרוקנוני</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>מערכת דו-רמתית (פרה-מגנט)</h3>
            <BlockMath tex="Z = 2\cosh(\beta\mu_B\mathcal{H})" />
            <BlockMath tex="\langle M \rangle = \mu_B\tanh(\beta\mu_B\mathcal{H})" />
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              בT נמוך (β גדול): tanh→1, מגנוטיזציה מלאה. בT גבוה: tanh≈βμH, חוק קירי.
            </p>
          </GlassCard>
          <TrapCard
            title="Z = מספר מצבים?"
            wrongFormula="Z = \\text{מספר המצבים האפשריים}"
            rightFormula="Z = \\sum_i e^{-\\beta E_i} \\text{ — ממוצע משוקלל}"
            description="Z שווה למספר המצבים רק בT→∞. בכלליות Z תלוי ב-T ומשקלל כל מצב לפי בולצמן."
          />
        </div>
      }
    />
  )
}
