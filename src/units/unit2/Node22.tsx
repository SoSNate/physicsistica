/**
 * Node 2.2 — פונקציית הריבוי וקירוב סטרלינג
 * Explore: היסטוגרם Ω(N,N↑) — slider לN, רואים חידוד המקסימום
 * Build:   קירוב סטרלינג ln(N!) ≈ N·lnN - N
 * Apply:   חישובי S
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

const meta = UNITS[1].nodes[1]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — היסטוגרם Ω(N,N↑)
// ══════════════════════════════════════════════════════════════════════
function logOmega(N: number, k: number): number {
  // Stirling: ln(N!) ≈ N·ln(N) - N
  if (k === 0 || k === N) return 0
  return N * Math.log(N) - k * Math.log(k) - (N - k) * Math.log(N - k)
}

function MultiplicityChart() {
  const [N, setN] = useState(10)
  const [highlight, setHighlight] = useState<number | null>(null)

  const bars = useMemo(() => {
    const vals = Array.from({ length: N + 1 }, (_, k) => ({ k, logOm: logOmega(N, k) }))
    const maxLog = Math.max(...vals.map(v => v.logOm))
    return vals.map(v => ({ ...v, frac: maxLog > 0 ? v.logOm / maxLog : (v.k === 0 ? 0 : 1) }))
  }, [N])

  const W = 300, H = 160

  return (
    <div className="space-y-3">
      {/* SVG bar chart */}
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: '#111827' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Axis */}
          <line x1={20} y1={H - 18} x2={W - 8} y2={H - 18} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <text x={W / 2} y={H - 4} fill="rgba(255,255,255,0.4)" fontSize={8} textAnchor="middle">N↑</text>
          <text x={8} y={H / 2} fill="rgba(255,255,255,0.4)" fontSize={7} textAnchor="middle" transform={`rotate(-90,8,${H/2})`}>ln Ω</text>
          {bars.map((b, i) => {
            const bw = (W - 28) / (N + 1)
            const bh = b.frac * (H - 30)
            const x = 20 + i * bw
            const isHalf = b.k === Math.floor(N / 2)
            const isHl = highlight === i
            return (
              <motion.rect key={i} x={x + 1} y={H - 18 - bh} width={bw - 2} height={bh}
                fill={isHl ? '#FDE68A' : isHalf ? '#6B8DD6' : 'rgba(107,141,214,0.5)'}
                rx={2}
                initial={{ height: 0, y: H - 18 }}
                animate={{ height: bh, y: H - 18 - bh }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                onMouseEnter={() => setHighlight(i)}
                onMouseLeave={() => setHighlight(null)}
                style={{ cursor: 'pointer' }}
              />
            )
          })}
          {/* Highlight tooltip */}
          {highlight !== null && (
            <text x={W / 2} y={14} fill="#FDE68A" fontSize={9} textAnchor="middle">
              N↑={bars[highlight].k}: ln Ω ≈ {bars[highlight].logOm.toFixed(1)}
            </text>
          )}
        </svg>
      </div>

      <div>
        <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>N = {N} ספינים</label>
        <input type="range" min={4} max={40} step={2} value={N} onChange={e => setN(Number(e.target.value))} className="w-full mt-1" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <GlassCard padding="sm" className="text-center">
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>ln Ω_max (N/2)</div>
          <div className="text-sm font-bold mono" style={{ color: 'var(--accent)' }}>
            {logOmega(N, N / 2).toFixed(2)}
          </div>
        </GlassCard>
        <GlassCard padding="sm" className="text-center">
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>מול N·ln2</div>
          <div className="text-sm font-bold mono" style={{ color: 'var(--warn)' }}>
            {(N * Math.log(2)).toFixed(2)}
          </div>
        </GlassCard>
      </div>

      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        כשN גדל, העמודה האמצעית הופכת להרבה יותר דומיננטית — זה מקסימום הריבוי!
      </p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — הצורך בקירוב סטרלינג',
    content: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed">
          לחשב <M tex="N!" /> עבור <M tex="N \sim 10^{23}" /> — בלתי-אפשרי ישירות. קירוב סטרלינג:
        </p>
        <BlockMath tex="\ln(N!) \approx N\ln N - N \quad (N \gg 1)" />
        <p className="text-sm">גרסה מדויקת יותר:</p>
        <BlockMath tex="\ln(N!) \approx N\ln N - N + \tfrac{1}{2}\ln(2\pi N)" />
      </div>
    ),
    interimQuestion: {
      prompt: 'חשב ln(10!) בקירוב סטרלינג. (10·ln10 - 10 ≈ ?)',
      hint: 'ln(10) ≈ 2.303, לכן 10×2.303 - 10 = 13.03',
      validate: s => { const v = parseFloat(s.trim()); return Math.abs(v - 13.03) < 2 },
      correctAnswer: '≈ 13.0 (מדויק: ln(10!)=15.1)',
    },
  },
  {
    title: 'שלב 2 — הפעלה על ln Ω',
    content: (
      <div className="space-y-3">
        <BlockMath tex="\ln\Omega = \ln N! - \ln N_\uparrow! - \ln N_\downarrow!" />
        <p className="text-sm">הפעלת סטרלינג על כל איבר:</p>
        <BlockMath tex="\ln\Omega \approx N\ln N - N_\uparrow\ln N_\uparrow - N_\downarrow\ln N_\downarrow" />
        <p className="text-sm">בסימון <M tex="x = N_\uparrow/N" />:</p>
        <BlockMath tex="\ln\Omega \approx -N[x\ln x + (1-x)\ln(1-x)]" />
      </div>
    ),
    interimQuestion: {
      prompt: 'ב-x=1/2 (שיווי המצבים), מה שווה ביטוי הסוגריים?',
      hint: 'x·ln(x)+(1-x)·ln(1-x) = 2·(1/2)·ln(1/2) = -ln2',
      validate: s => s.includes('ln2') || s.includes('ln 2') || Math.abs(parseFloat(s) + 0.693) < 0.1,
      correctAnswer: '-ln2, לכן ln Ω_max = N·ln2',
    },
  },
  {
    title: 'שלב 3 — חדות הפסגה',
    content: (
      <div className="space-y-3">
        <p className="text-sm">מסביב ל-N↑=N/2, הפיתוח בטיילור נותן גאוסיאן:</p>
        <BlockMath tex="\Omega(N_\uparrow) \approx 2^N \sqrt{\frac{2}{\pi N}} \exp\!\left(-\frac{2(N_\uparrow - N/2)^2}{N}\right)" />
        <p className="text-sm">רוחב הפסגה: <M tex="\Delta N_\uparrow \sim \sqrt{N}" /></p>
        <p className="text-sm">רוחב יחסי: <M tex="\Delta N_\uparrow/N \sim 1/\sqrt{N} \to 0" /></p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--success)' }}>
          עבור N=10²³, הפסגה רחבה 10^11.5 אבל יחסית לN היא ≈ 10⁻¹¹·⁵ — חדה לחלוטין!
        </p>
      </div>
    ),
    interimQuestion: {
      prompt: 'מה הרוחב היחסי של הפסגה עבור N=10⁴?',
      hint: '1/√N = 1/√10⁴ = 1/100 = 1%',
      validate: s => s.trim() === '1%' || s.trim() === '0.01' || s.includes('1/100'),
      correctAnswer: '1% — ועבור N=10²³ זה 10⁻¹²%',
    },
  },
]

export default function Node22({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>היסטוגרם פונקציית הריבוי</h3><MultiplicityChart /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>קירוב סטרלינג מאפשר חישוב ln Ω לN גדול</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>בדיקת הקירוב</h3>
            {[
              { N: 5, exact: 3.178, stirling: 3.047 },
              { N: 10, exact: 6.931, stirling: 6.908 },
              { N: 100, exact: 69.315, stirling: 69.310 },
            ].map(row => (
              <div key={row.N} className="flex items-center gap-2 text-xs mb-2">
                <span className="w-16" style={{ color: 'var(--text)' }}>N={row.N}:</span>
                <span style={{ color: 'var(--success)' }}>מדויק: {row.exact}</span>
                <span style={{ color: 'var(--accent)' }}>סטרלינג: {row.stirling}</span>
                <span style={{ color: Math.abs(row.exact - row.stirling) < 0.1 ? 'var(--success)' : 'var(--warn)' }}>
                  שגיאה: {Math.abs(((row.stirling - row.exact) / row.exact) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </GlassCard>
          <TrapCard
            title="קירוב סטרלינג לN קטן"
            wrongFormula="\ln(3!) \approx 3\ln 3 - 3 = 0.3"
            rightFormula="\ln(3!) = \ln 6 = 1.79"
            description="הקירוב טוב רק עבור N גדול (N≥10 סביר, N≥100 מצוין). לN קטן — יש לחשב ישירות."
          />
        </div>
      }
    />
  )
}
