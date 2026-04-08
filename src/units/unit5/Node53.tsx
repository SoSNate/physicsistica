/**
 * Node 5.3 — סטטיסטיקת בוז-איינשטיין
 * Explore: f_BE(ε) — ריבוי אכלוס, השוואה ל-FD ולקלאסי
 * Build:   Z_BE = 1/(1-e^(-β(ε-μ))), ⟨n⟩ = 1/(e^((ε-μ)/kT)-1)
 * Apply:   פוטונים, פונונים, He-4
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

const meta = UNITS[4].nodes[2]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — השוואת BE / FD / בולצמן
// ══════════════════════════════════════════════════════════════════════
function BEComparison() {
  const [T, setT] = useState(0.3)
  const [mu, setMu] = useState(-0.5) // must be < 0 for BE

  const W = 300, H = 200, PAD = 32

  const eps = useMemo(() => Array.from({ length: 150 }, (_, i) => (i / 149) * 3), [])

  function fBE(e: number) {
    const x = (e - mu) / T
    if (x < 0.001) return 50 // diverges
    if (x > 50) return 0
    return 1 / (Math.exp(x) - 1)
  }
  function fFD(e: number) {
    const x = (e - mu) / T
    if (x > 50) return 0; if (x < -50) return 1
    return 1 / (Math.exp(x) + 1)
  }
  function fBoltz(e: number) {
    const x = (e - mu) / T
    if (x > 50) return 0
    return Math.exp(-x)
  }

  const maxY = 4

  function toX(e: number) { return PAD + (e / 3) * (W - PAD * 2) }
  function toY(f: number) { return H - PAD - Math.min(f / maxY, 1) * (H - PAD * 2) }

  function makePath(fn: (e: number) => number) {
    return eps.map((e, i) => {
      const f = fn(e)
      if (f > maxY * 1.2) return null
      return `${i === 0 || eps[i - 1] !== undefined && fn(eps[i - 1]) > maxY * 1.2 ? 'M' : 'L'} ${toX(e).toFixed(1)} ${toY(Math.min(f, maxY * 1.1)).toFixed(1)}`
    }).filter(Boolean).join(' ')
  }

  const bePath = makePath(fBE)
  const fdPath = makePath(fFD)
  const boltzPath = makePath(fBoltz)

  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: '#111827' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Axes */}
          <line x1={PAD} y1={H - PAD} x2={W - 5} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <line x1={PAD} y1={5} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <text x={W / 2} y={H - 5} fill="rgba(255,255,255,0.4)" fontSize={8} textAnchor="middle">ε / E_F</text>

          {/* Grid */}
          {[0, 1, 2, 3, 4].map(v => (
            <g key={v}>
              <line x1={PAD} y1={toY(v)} x2={W - 5} y2={toY(v)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              <text x={PAD - 2} y={toY(v) + 3} fill="rgba(255,255,255,0.25)" fontSize={6} textAnchor="end">{v}</text>
            </g>
          ))}

          {/* ε ticks */}
          {[0, 0.5, 1, 1.5, 2, 2.5, 3].map(v => (
            <text key={v} x={toX(v)} y={H - PAD + 10} fill="rgba(255,255,255,0.3)" fontSize={6} textAnchor="middle">{v}</text>
          ))}

          {/* μ line */}
          <line x1={toX(mu < 0 ? 0 : mu)} y1={5} x2={toX(mu < 0 ? 0 : mu)} y2={H - PAD}
            stroke="#FDE68A" strokeWidth={1} strokeDasharray="4,3" opacity={mu >= 0 ? 1 : 0} />

          {/* Curves */}
          <path d={boltzPath} fill="none" stroke="#9CA3AF" strokeWidth={1.5} strokeDasharray="5,3" />
          <path d={fdPath} fill="none" stroke="#6B8DD6" strokeWidth={1.5} strokeDasharray="4,2" />
          <motion.path key={`${T}-${mu}`} d={bePath} fill="none" stroke="#a78bfa" strokeWidth={2.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />

          {/* Legend */}
          <rect x={W - 80} y={8} width={72} height={48} fill="rgba(0,0,0,0.5)" rx={4} />
          <line x1={W - 75} y1={18} x2={W - 62} y2={18} stroke="#a78bfa" strokeWidth={2.5} />
          <text x={W - 59} y={21} fill="#a78bfa" fontSize={7}>בוז-איינשטיין</text>
          <line x1={W - 75} y1={30} x2={W - 62} y2={30} stroke="#6B8DD6" strokeWidth={1.5} strokeDasharray="4,2" />
          <text x={W - 59} y={33} fill="#6B8DD6" fontSize={7}>פרמי-דיראק</text>
          <line x1={W - 75} y1={42} x2={W - 62} y2={42} stroke="#9CA3AF" strokeWidth={1.5} strokeDasharray="5,3" />
          <text x={W - 59} y={45} fill="#9CA3AF" fontSize={7}>בולצמן</text>
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>T = {T.toFixed(2)} E_F/k_B</label>
          <input type="range" min={0.05} max={1} step={0.05} value={T}
            onChange={e => setT(Number(e.target.value))} className="w-full mt-1" />
        </div>
        <div>
          <label className="text-xs font-semibold" style={{ color: '#FDE68A' }}>μ = {mu.toFixed(2)} E_F (μ{'<'}0)</label>
          <input type="range" min={-2} max={-0.05} step={0.05} value={mu}
            onChange={e => setMu(Number(e.target.value))} className="w-full mt-1" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        {[
          { label: 'BE(ε=0)', val: fBE(0.01) > 20 ? '→∞' : fBE(0.01).toFixed(2), color: '#a78bfa' },
          { label: 'FD(ε=0)', val: fFD(0.01).toFixed(3), color: '#6B8DD6' },
          { label: 'Boltz(ε=0)', val: fBoltz(0.01).toFixed(3), color: '#9CA3AF' },
        ].map(item => (
          <GlassCard key={item.label} padding="sm">
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
            <div className="font-bold mono" style={{ color: item.color }}>{item.val}</div>
          </GlassCard>
        ))}
      </div>

      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        BE: ⟨n⟩ יכול להיות {'>'} 1! בוזונים אוהבים להצטופף ← "בונוס אכלוס"
      </p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — Z לבוזון יחיד: ריבוי אכלוס',
    content: (
      <div className="space-y-3">
        <p className="text-sm">בוזונים: n = 0, 1, 2, ... (ללא הגבלה). הצבר גרנד-קנוני:</p>
        <BlockMath tex="\mathcal{Z} = \sum_{n=0}^{\infty} e^{-n\beta(\varepsilon-\mu)}" />
        <p className="text-sm">זהו טור הנדסי עם יחס <M tex="r = e^{-\beta(\varepsilon-\mu)}" />:</p>
        <BlockMath tex="\mathcal{Z} = \frac{1}{1 - e^{-\beta(\varepsilon-\mu)}} \quad \text{(עבור } \varepsilon > \mu\text{)}" />
        <p className="text-sm text-amber-300">תנאי קיום: μ {'<'} ε — אחרת הטור מתבדר!</p>
      </div>
    ),
    interimQuestion: {
      prompt: 'למה חייב μ < ε_min? מה קורה אם μ=ε?',
      hint: 'r=e^(-β(ε-μ)): כש ε→μ, r→1 — הטור ∑rⁿ לא מתכנס',
      validate: s => s.includes('∞') || s.includes('מתבדר') || s.includes('לא מתכנס') || s.includes('r=1'),
      correctAnswer: 'r→1 ⟹ Σrⁿ→∞. לבוזונים μ<0 תמיד (אם E_min=0)',
    },
  },
  {
    title: 'שלב 2 — פונקציית התפלגות BE',
    content: (
      <div className="space-y-3">
        <p className="text-sm">מספר חלקיקים ממוצע:</p>
        <BlockMath tex="\langle n\rangle = -\frac{\partial \ln\mathcal{Z}}{\partial(\beta\varepsilon)} = \frac{1}{e^{(\varepsilon-\mu)/k_BT} - 1}" />
        <p className="text-sm">הבדל קריטי מ-FD:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg p-2" style={{ background: 'rgba(107,141,214,0.15)' }}>
            <div style={{ color: '#6B8DD6' }}>FD: +1 במכנה</div>
            <div style={{ color: 'var(--text-muted)' }}>⟨n⟩ ≤ 1 תמיד</div>
          </div>
          <div className="rounded-lg p-2" style={{ background: 'rgba(167,139,250,0.15)' }}>
            <div style={{ color: '#a78bfa' }}>BE: −1 במכנה</div>
            <div style={{ color: 'var(--text-muted)' }}>⟨n⟩ יכול → ∞</div>
          </div>
        </div>
      </div>
    ),
    interimQuestion: {
      prompt: 'בגבול T→∞ (ε-μ ≫ kT), איזו פונקציה הן שתיהן מתקרבות אליה?',
      hint: 'e^x >> 1 → התוספת ±1 זניחה',
      validate: s => s.includes('בולצמן') || s.includes('Boltzmann') || s.includes('e^-') || s.includes('קלאסי'),
      correctAnswer: 'שתיהן → e^(-(ε-μ)/kT) — בגבול הקלאסי',
    },
  },
  {
    title: 'שלב 3 — יישום: פוטונים ופונונים (μ=0)',
    content: (
      <div className="space-y-3">
        <p className="text-sm">פוטונים ופונונים: N לא שמור → μ=0 תמיד.</p>
        <BlockMath tex="\langle n(\omega)\rangle = \frac{1}{e^{\hbar\omega/k_BT} - 1}" />
        <div className="rounded-lg p-2 text-xs space-y-1" style={{ background: 'var(--accent-soft)' }}>
          <div>זוהי <strong>פונקצית פלאנק</strong> שגזרנו ביחידה 4.6!</div>
          <div>He-4 (עם חומר): μ {'<'} 0 בT גבוה → μ→0 ב-T_BEC</div>
        </div>
      </div>
    ),
    interimQuestion: {
      prompt: 'למה לא שואלים מה ⟨n⟩ בT=0 לפוטונים?',
      hint: 'T=0: kT=0, e^(ħω/kT)→∞ → ⟨n⟩→0. אין פוטונים בT=0.',
      validate: s => s.includes('0') || s.includes('אפס') || s.includes('אין') || true,
      correctAnswer: '⟨n⟩=0 לכל ω>0: אין פוטונים תרמיים ב-T=0',
    },
  },
]

export default function Node53({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>BE מול FD מול בולצמן</h3><BEComparison /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>f_BE = 1/(e^((ε-μ)/kT)-1) — בוזונים אוהבים להצטופף</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>שוני מהותי: BE כ-"בונוס"</h3>
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
              הסתברות BE = הסתברות קלאסית × (1 + ⟨n⟩). ככל שיש יותר חלקיקים במצב — יותר סביר שחדש יצטרף.
            </p>
            <BlockMath tex="P_{BE}(n+1) = P_{classical}\cdot(1 + \langle n\rangle)" />
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              זוהי "צבירה בוזונית" — ההפך מפאולי. גלי לייזר, סופרפלואיד, BEC — כולם פנומנות BE.
            </p>
          </GlassCard>
          <TrapCard
            title="BE לכל החלקיקים?"
            wrongFormula="f_{BE} \text{ לפרוטונים ונויטרונים}"
            rightFormula="\text{BE: ספין שלם (0,1,2,...), FD: ספין חצי-שלם (½,3/2,...)}"
            description="פרמיונים/בוזונים נקבעים לפי ספין. פרוטון (ספין ½) = פרמיון. He-4 (ספין 0 כולל) = בוזון. He-3 (ספין ½) = פרמיון!"
          />
        </div>
      }
    />
  )
}
