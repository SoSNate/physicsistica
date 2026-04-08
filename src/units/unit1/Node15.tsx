/**
 * Node 1.5 — התפלגות המהירויות של מקסוול
 * Explore: עקומת f(v) אינטראקטיבית — הזזת T מזיזה את העקומה + v_mp, v̄, v_rms
 * Build:   גזירת f(v) = 4π(m/2πkT)^(3/2) v² exp(-mv²/2kT)
 * Apply:   השוואת גזים שונים, שאלות מלכוד
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

const meta = UNITS[0].nodes[4]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — עקומת מקסוול אינטראקטיבית (SVG)
// ══════════════════════════════════════════════════════════════════════

const GAS_MASSES: Record<string, number> = {
  'He (הליום)': 4e-3 / 6.022e23,
  'N₂ (חנקן)': 28e-3 / 6.022e23,
  'O₂ (חמצן)': 32e-3 / 6.022e23,
  'Ar (ארגון)': 40e-3 / 6.022e23,
}
const kB = 1.38e-23

function maxwellF(v: number, T: number, m: number): number {
  const a = 4 * Math.PI * Math.pow(m / (2 * Math.PI * kB * T), 1.5)
  return a * v * v * Math.exp(-m * v * v / (2 * kB * T))
}

function MaxwellPlot() {
  const [T, setT] = useState(300)
  const [gas, setGas] = useState('N₂ (חנקן)')
  const m = GAS_MASSES[gas]

  const W = 300, H = 180, VMAX = 3000, NPTS = 200

  const { points, vmp, vmean, vrms, fmax } = useMemo(() => {
    const pts: { v: number; f: number }[] = []
    let fm = 0
    for (let i = 0; i <= NPTS; i++) {
      const v = (i / NPTS) * VMAX
      const f = maxwellF(v, T, m)
      pts.push({ v, f })
      if (f > fm) fm = f
    }
    const vmp = Math.sqrt(2 * kB * T / m)
    const vmean = Math.sqrt(8 * kB * T / (Math.PI * m))
    const vrms = Math.sqrt(3 * kB * T / m)
    return { points: pts, vmp, vmean, vrms, fmax: fm }
  }, [T, m])

  function toX(v: number) { return (v / VMAX) * (W - 40) + 20 }
  function toY(f: number) { return H - 20 - (f / (fmax * 1.1)) * (H - 30) }

  const pathD = points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${toX(p.v).toFixed(1)} ${toY(p.f).toFixed(1)}`
  ).join(' ')

  return (
    <div className="space-y-3">
      {/* Gas selector */}
      <div className="flex flex-wrap gap-1.5">
        {Object.keys(GAS_MASSES).map(g => (
          <button key={g} onClick={() => setGas(g)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all"
            style={{ background: gas === g ? 'var(--accent)' : 'var(--accent-soft)', color: gas === g ? '#fff' : 'var(--accent)' }}>
            {g}
          </button>
        ))}
      </div>

      {/* SVG plot */}
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: '#111827' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Axes */}
          <line x1={20} y1={H - 20} x2={W - 10} y2={H - 20} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <line x1={20} y1={10} x2={20} y2={H - 20} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          {/* Axis labels */}
          <text x={W / 2} y={H - 4} fill="rgba(255,255,255,0.4)" fontSize={8} textAnchor="middle">v (m/s)</text>
          <text x={8} y={H / 2} fill="rgba(255,255,255,0.4)" fontSize={8} textAnchor="middle" transform={`rotate(-90, 8, ${H / 2})`}>f(v)</text>
          {/* Speed tick labels */}
          {[0, 500, 1000, 1500, 2000, 2500, 3000].map(v => (
            <text key={v} x={toX(v)} y={H - 8} fill="rgba(255,255,255,0.3)" fontSize={6} textAnchor="middle">{v}</text>
          ))}

          {/* Filled area under curve */}
          <motion.path
            key={`${T}-${gas}`}
            d={pathD + ` L ${toX(VMAX)} ${H - 20} L ${toX(0)} ${H - 20} Z`}
            fill="rgba(107,141,214,0.15)"
            stroke="none"
          />

          {/* Main curve */}
          <motion.path
            key={`curve-${T}-${gas}`}
            d={pathD}
            fill="none"
            stroke="#6B8DD6"
            strokeWidth={2.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* v_mp line */}
          <line x1={toX(vmp)} y1={toY(maxwellF(vmp, T, m))} x2={toX(vmp)} y2={H - 20}
            stroke="#FDE68A" strokeWidth={1.5} strokeDasharray="4,3" />
          <text x={toX(vmp)} y={toY(maxwellF(vmp, T, m)) - 4} fill="#FDE68A" fontSize={7} textAnchor="middle">v_mp</text>

          {/* v_mean line */}
          <line x1={toX(vmean)} y1={toY(maxwellF(vmean, T, m)) + 4} x2={toX(vmean)} y2={H - 20}
            stroke="#34d399" strokeWidth={1.5} strokeDasharray="4,3" />
          <text x={toX(vmean) + 10} y={toY(maxwellF(vmean, T, m))} fill="#34d399" fontSize={7}>v̄</text>

          {/* v_rms line */}
          <line x1={toX(vrms)} y1={toY(maxwellF(vrms, T, m)) + 8} x2={toX(vrms)} y2={H - 20}
            stroke="#f472b6" strokeWidth={1.5} strokeDasharray="4,3" />
          <text x={toX(vrms) + 10} y={toY(maxwellF(vrms, T, m)) + 4} fill="#f472b6" fontSize={7}>v_rms</text>
        </svg>
      </div>

      {/* T slider */}
      <div>
        <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>T = {T} K</label>
        <input type="range" min={100} max={2000} step={50} value={T}
          onChange={e => setT(Number(e.target.value))} className="w-full mt-1" />
      </div>

      {/* Speed values */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'v_mp', val: Math.round(vmp), color: '#FDE68A' },
          { label: 'v̄', val: Math.round(vmean), color: '#34d399' },
          { label: 'v_rms', val: Math.round(vrms), color: '#f472b6' },
        ].map(({ label, val, color }) => (
          <GlassCard key={label} padding="sm">
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{label}</div>
            <div className="text-sm font-bold mono" style={{ color }}>{val} m/s</div>
          </GlassCard>
        ))}
      </div>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        הגדלת T מזיזה את העקומה ימינה ומשטחת אותה — שטח מתחת לעקומה שמור = 1
      </p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — התפלגות מהירות ב-x בלבד',
    content: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed">
          נתחיל מהתפלגות גאוסיאנית חד-ממדית (מקסוול הוכיח זאת מטיעוני סימטריה):
        </p>
        <BlockMath tex="f(v_x) = \sqrt{\frac{m}{2\pi k_BT}} \exp\!\left(-\frac{mv_x^2}{2k_BT}\right)" />
        <p className="text-sm">הנרמול: <M tex="\int_{-\infty}^{+\infty} f(v_x)\,dv_x = 1" /></p>
      </div>
    ),
    interimQuestion: {
      prompt: 'איזה סוג פונקציה היא f(v_x)?',
      hint: 'היא פונקציה זוגית, ממוקדת סביב 0, יורדת מהר עם v_x',
      validate: s => ['גאוס', 'גאוסי', 'gaussian', 'פעמון', 'bell'].some(w => s.toLowerCase().includes(w)),
      correctAnswer: 'גאוסיאנית (פעמון)',
    },
  },
  {
    title: 'שלב 2 — מ-3 ממדים לסקלר',
    content: (
      <div className="space-y-3">
        <p className="text-sm">כיוונים בלתי-תלויים → מכפלה:</p>
        <BlockMath tex="f(\mathbf{v}) = f(v_x)f(v_y)f(v_z) \propto e^{-mv^2/2k_BT}" />
        <p className="text-sm">עוברים לקואורדינטות כדוריות. מספר המצבים ב-<M tex="[v, v+dv]" />:</p>
        <BlockMath tex="g(v)\,dv = 4\pi v^2 f(\mathbf{v})\,dv" />
      </div>
    ),
    interimQuestion: {
      prompt: 'למה מוכפלים ב-4πv²? מה הגורם הזה מייצג?',
      hint: 'זהו שטח פני כדור ברדיוס v במרחב המהירויות',
      validate: s => s.includes('כדור') || s.includes('שטח') || s.includes('shell') || s.includes('sphere'),
      correctAnswer: 'שטח פני כדור במרחב המהירויות — מספר המצבים עם מהירות v',
    },
  },
  {
    title: 'שלב 3 — הנוסחה הסופית',
    content: (
      <div className="space-y-3">
        <BlockMath tex="f(v) = 4\pi\!\left(\frac{m}{2\pi k_BT}\right)^{\!\!3/2} v^2 \exp\!\left(-\frac{mv^2}{2k_BT}\right)" />
        <p className="text-sm">שלוש מהירויות אופייניות:</p>
        <div className="rounded-lg p-2 space-y-1 text-sm" style={{ background: 'var(--accent-soft)' }}>
          <div><M tex="v_{mp} = \sqrt{\frac{2k_BT}{m}}" /> — שיא העקומה</div>
          <div><M tex="\bar{v} = \sqrt{\frac{8k_BT}{\pi m}}" /> — ממוצע אריתמטי</div>
          <div><M tex="v_{rms} = \sqrt{\frac{3k_BT}{m}}" /> — שורש ממוצע ריבועי</div>
        </div>
      </div>
    ),
    interimQuestion: {
      prompt: 'מה הסדר הנכון מקטן לגדול: v_mp, v̄, v_rms?',
      hint: 'הסתכל על המקדמים: √2, √(8/π)≈1.60, √3',
      validate: s => s.replace(/\s/g,'').includes('v_mp') && s.indexOf('mp') < s.indexOf('rms'),
      correctAnswer: 'v_mp < v̄ < v_rms',
    },
  },
]

// ══════════════════════════════════════════════════════════════════════
// APPLY
// ══════════════════════════════════════════════════════════════════════
function ApplySection() {
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false])

  const qs = [
    { q: 'עקומת מקסוול מוזזת ימינה כש-T עולה. האם שטח מתחת לעקומה משתנה?', a: 'לא! שטח = 1 תמיד (נרמול). העקומה משתטחת ומתרחבת, אבל השטח שמור.' },
    { q: 'לאיזה גז יש עקומה צרה יותר — He או N₂ באותה T?', a: 'He (מסה קטנה יותר) — עקומה רחבה יותר! N₂ כבד יותר, v_mp קטן יותר → עקומה צרה ומוזה שמאלה.' },
    { q: 'למה f(v=0) = 0 אבל f(v_x=0) מקסימלי?', a: 'f(v) ∝ v² · exp(…) — גורם v² אנולל ב-0. אבל f(v_x) גאוסי ומקסימלי ב-v_x=0.' },
  ]

  return (
    <div className="space-y-3">
      {qs.map((item, i) => (
        <GlassCard key={i} padding="md">
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>{item.q}</p>
          {revealed[i] ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs leading-relaxed" style={{ color: 'var(--success)' }}>
              {item.a}
            </motion.p>
          ) : (
            <button onClick={() => setRevealed(r => r.map((v, j) => j === i ? true : v))}
              className="text-xs px-3 py-1 rounded-lg" style={{ background: 'var(--accent)', color: '#fff' }}>
              גלה תשובה
            </button>
          )}
        </GlassCard>
      ))}
      <TrapCard
        title="בלבול f(v) עם f(v_x)"
        wrongFormula="f(v)\text{ מקסימלי ב-}v=0"
        rightFormula="f(v) \propto v^2 e^{-mv^2/2kT},\quad f(0)=0"
        description="התפלגות מקסוול-בולצמן f(v) שונה מהתפלגות החד-ממדית f(v_x). הגורם v² מבטל את f(v) באפס."
      />
    </div>
  )
}

export default function Node15({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={
        <div className="space-y-4">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>עקומת התפלגות מקסוול</h3>
            <MaxwellPlot />
          </GlassCard>
        </div>
      }
      build={
        <div className="space-y-4">
          <GlassCard padding="md">
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              כיצד מגיעים לנוסחת מקסוול מטיעוני סטטיסטיקה?
            </p>
          </GlassCard>
          <ScaffoldedDerivation steps={STEPS} />
        </div>
      }
      apply={<ApplySection />}
    />
  )
}
