/**
 * Node 5.2 — סטטיסטיקת פרמי-דיראק
 * Explore: פונקציית f(ε) — step מתרכך עם T, slider לμ ו-T
 * Build:   f(ε) = 1/(e^((ε-μ)/kT)+1), עיקרון פאולי
 * Apply:   אלקטרוני מתכת, אנרגיית פרמי
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import NodeLayout from '../../components/NodeLayout'
import ScaffoldedDerivation from '../../components/ScaffoldedDerivation'
import TrapCard from '../../components/TrapCard'
import GlassCard from '../../components/GlassCard'
import { BlockMath, M } from '../../components/MathBlock'
import { UNITS } from '../../data/units'
import type { DerivationStep } from '../../types'

const meta = UNITS[4].nodes[1]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — FD step function
// ══════════════════════════════════════════════════════════════════════
function FermiStep() {
  const [T, setT] = useState(0.1)   // in units of E_F
  const [mu, setMu] = useState(1.0) // in units of E_F

  const W = 300, H = 190, PAD = 30

  const pts = useMemo(() =>
    Array.from({ length: 120 }, (_, i) => {
      const eps = (i / 119) * 2.5
      const x = (eps - mu) / T
      const f = x > 50 ? 0 : x < -50 ? 1 : 1 / (Math.exp(x) + 1)
      return { eps, f }
    }), [T, mu])

  function toX(eps: number) { return PAD + (eps / 2.5) * (W - PAD * 2) }
  function toY(f: number) { return H - PAD - f * (H - PAD * 2) }

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.eps).toFixed(1)} ${toY(p.f).toFixed(1)}`).join(' ')

  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: '#111827' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Axes */}
          <line x1={PAD} y1={H - PAD} x2={W - 5} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <line x1={PAD} y1={5} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <text x={W / 2} y={H - 5} fill="rgba(255,255,255,0.4)" fontSize={8} textAnchor="middle">ε / E_F</text>
          <text x={10} y={H / 2} fill="rgba(255,255,255,0.4)" fontSize={7} textAnchor="middle"
            transform={`rotate(-90,10,${H / 2})`}>f(ε)</text>

          {/* Grid lines */}
          {[0, 0.5, 1.0].map(f => (
            <g key={f}>
              <line x1={PAD} y1={toY(f)} x2={W - 5} y2={toY(f)} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
              <text x={PAD - 2} y={toY(f) + 3} fill="rgba(255,255,255,0.3)" fontSize={7} textAnchor="end">{f}</text>
            </g>
          ))}

          {/* Axis ticks */}
          {[0, 0.5, 1, 1.5, 2, 2.5].map(eps => (
            <text key={eps} x={toX(eps)} y={H - PAD + 10} fill="rgba(255,255,255,0.3)" fontSize={6} textAnchor="middle">{eps}</text>
          ))}

          {/* μ vertical line */}
          <line x1={toX(mu)} y1={5} x2={toX(mu)} y2={H - PAD}
            stroke="#FDE68A" strokeWidth={1.5} strokeDasharray="4,3" />
          <text x={toX(mu) + 4} y={20} fill="#FDE68A" fontSize={8}>μ={mu.toFixed(1)}</text>

          {/* Fill under FD */}
          <path d={pathD + ` L ${toX(2.5)} ${H - PAD} L ${toX(0)} ${H - PAD} Z`}
            fill="rgba(107,141,214,0.15)" />

          {/* FD curve */}
          <motion.path key={`${T}-${mu}`} d={pathD} fill="none" stroke="#6B8DD6" strokeWidth={2.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />

          {/* f(μ) = 0.5 marker */}
          <circle cx={toX(mu)} cy={toY(0.5)} r={4} fill="#f472b6" />
          <text x={toX(mu) + 6} y={toY(0.5) + 4} fill="#f472b6" fontSize={8}>f(μ)=½</text>
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>T = {T.toFixed(2)} E_F/k_B</label>
          <input type="range" min={0.01} max={0.5} step={0.01} value={T}
            onChange={e => setT(Number(e.target.value))} className="w-full mt-1" />
        </div>
        <div>
          <label className="text-xs font-semibold" style={{ color: '#FDE68A' }}>μ = {mu.toFixed(2)} E_F</label>
          <input type="range" min={0.2} max={2} step={0.05} value={mu}
            onChange={e => setMu(Number(e.target.value))} className="w-full mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'f(0)', val: (1/(Math.exp((-mu)/T)+1)).toFixed(3), color: '#6B8DD6' },
          { label: 'f(μ)', val: '0.500', color: '#f472b6' },
          { label: `f(2E_F)`, val: (1/(Math.exp((2-mu)/T)+1)).toFixed(3), color: '#34d399' },
        ].map(item => (
          <GlassCard key={item.label} padding="sm">
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
            <div className="text-sm font-bold mono" style={{ color: item.color }}>{item.val}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — עיקרון האיסור של פאולי',
    content: (
      <div className="space-y-3">
        <p className="text-sm">פרמיונים (אלקטרונים, פרוטונים): כל מצב קוונטי — לכל היותר חלקיק אחד.</p>
        <p className="text-sm">לכן אחוז האכלוס בין 0 ל-1:</p>
        <BlockMath tex="f(\varepsilon) = \frac{\langle n\rangle}{1} \in [0,1]" />
        <p className="text-sm">מחשבים מ-Z_grand של מצב בודד (n=0 או n=1):</p>
        <BlockMath tex="\mathcal{Z} = 1 + e^{-\beta(\varepsilon-\mu)}" />
      </div>
    ),
    interimQuestion: {
      prompt: 'מה ⟨n⟩ (מספר חלקיקים ממוצע) עבור מצב בודד?',
      hint: '⟨n⟩ = (0·1 + 1·e^(-β(ε-μ))) / Z',
      validate: s => s.includes('1/(') || s.includes('FD') || s.includes('e^') || s.includes('e^-'),
      correctAnswer: '⟨n⟩ = e^(-β(ε-μ))/(1+e^(-β(ε-μ))) = f_FD(ε)',
    },
  },
  {
    title: 'שלב 2 — פונקציית FD',
    content: (
      <div className="space-y-3">
        <BlockMath tex="f_{FD}(\varepsilon) = \frac{1}{e^{(\varepsilon-\mu)/k_BT} + 1}" />
        <p className="text-sm">תכונות:</p>
        <ul className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
          <li>• f(μ) = ½ תמיד</li>
          <li>• T=0: f=1 עבור ε{'<'}μ, f=0 עבור ε{'>'}μ — מדרגה חדה</li>
          <li>• T{'>'} 0: רוחב המעבר ≈ 4k_BT</li>
          <li>• T→∞: f→ e^(-β(ε-μ)) — בולצמן!</li>
        </ul>
      </div>
    ),
    interimQuestion: {
      prompt: 'בT=0, מה f(ε=0.9E_F) ו-f(ε=1.1E_F)?',
      hint: 'T=0: מדרגה חדה ב-ε=μ=E_F',
      validate: s => (s.includes('1') && s.includes('0')) || s.includes('מדרגה'),
      correctAnswer: 'f(0.9E_F)=1, f(1.1E_F)=0',
    },
  },
  {
    title: 'שלב 3 — אנרגיית פרמי',
    content: (
      <div className="space-y-3">
        <p className="text-sm">בT=0, כל המצבים עד E_F מאוכלסים:</p>
        <BlockMath tex="E_F = \frac{\hbar^2}{2m}\left(3\pi^2 n\right)^{2/3}" />
        <div className="text-xs rounded-lg p-2 space-y-1" style={{ background: 'var(--accent-soft)' }}>
          <div>נחושת (Cu): E_F ≈ 7 eV, T_F = E_F/k_B ≈ 80,000 K</div>
          <div>בטמפרטורת חדר: T/T_F ≈ 0.003 — אלקטרונים "קפואים"!</div>
        </div>
      </div>
    ),
    interimQuestion: {
      prompt: 'למה אלקטרוני מתכת לא תורמים לקיבול חום בT רגיל?',
      hint: 'T ≪ T_F → רוב האלקטרונים לא יכולים לקבל אנרגיה (פאולי)',
      validate: s => s.includes('פאולי') || s.includes('T_F') || s.includes('קפוא') || s.includes('מלא'),
      correctAnswer: 'כי T ≪ T_F: רק אלקטרונים ב-kT מ-E_F יכולים להתרגש. C_el ∝ T/T_F ≪ 3R/2',
    },
  },
]

export default function Node52({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>פונקציית התפלגות פרמי-דיראק</h3><FermiStep /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>f_FD = 1/(e^((ε-μ)/kT)+1) ועיקרון פאולי</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>FD מול בולצמן — מתי שמשתמשים?</h3>
            <BlockMath tex="f_{FD} \approx e^{-(\varepsilon-\mu)/k_BT} = f_{Boltzmann} \text{ כש } \varepsilon \gg \mu" />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              גבול קלאסי: n·λ³_dB ≪ 1 (גז דליל/חם). לאלקטרוני מתכת: n·λ³ ≫ 1 — דגנרציה חזקה.
            </p>
          </GlassCard>
          <TrapCard
            title="f(E_F) = ½ בכל T?"
            wrongFormula="f(E_F) = \\tfrac{1}{2} \\text{ רק ב-T=0}"
            rightFormula="f(\\mu) = \\tfrac{1}{2} \\text{ תמיד! (הגדרת } \\mu\\text{)}"
            description="f(μ)=½ היא תכונה מתמטית של f_FD — תמיד נכון. אבל μ עצמו תלוי T ויורד עם T."
          />
        </div>
      }
    />
  )
}
