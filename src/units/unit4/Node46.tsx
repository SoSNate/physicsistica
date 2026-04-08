/**
 * Node 4.6 — קרינת גוף שחור וגז פוטונים
 * Explore: ספקטרום פלאנק אנימטי — T slider, שיא סטפן-וין
 * Build:   Z לפוטונים (בוזונים לא-שמורים), ρ(ω), E_total ∝ T⁴
 * Apply:   חוק סטפן-בולצמן, ספינת פוטוני CMBR
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

const meta = UNITS[3].nodes[5]
const h = 6.626e-34, c = 3e8, kB = 1.38e-23

function planck(nu: number, T: number): number {
  if (nu < 1e10) return 0
  const x = h * nu / (kB * T)
  if (x > 50) return 0
  return (2 * h * nu * nu * nu / (c * c)) / (Math.exp(x) - 1)
}

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — ספקטרום פלאנק
// ══════════════════════════════════════════════════════════════════════
function PlanckSpectrum() {
  const [T, setT] = useState(5778)  // Sun

  const W = 300, H = 180, PAD = 28
  const nuMax = 3e14  // 300 THz

  const { pts, pMax, nuPeak } = useMemo(() => {
    const ps = Array.from({ length: 120 }, (_, i) => {
      const nu = (i / 119) * nuMax
      return { nu, I: planck(nu, T) }
    })
    const pm = Math.max(...ps.map(p => p.I))
    const np = ps.reduce((best, p) => p.I > best.I ? p : best, ps[0]).nu
    return { pts: ps, pMax: pm, nuPeak: np }
  }, [T])

  // Color at peak frequency
  const peakWl = c / nuPeak  // meters
  const peakNm = Math.round(peakWl * 1e9)
  let peakColor = '#ffffff'
  if (peakNm < 380) peakColor = '#8B5CF6'
  else if (peakNm < 450) peakColor = '#4F46E5'
  else if (peakNm < 495) peakColor = '#3B82F6'
  else if (peakNm < 570) peakColor = '#10B981'
  else if (peakNm < 620) peakColor = '#F59E0B'
  else if (peakNm < 750) peakColor = '#EF4444'
  else peakColor = '#7C3AED'

  function toX(nu: number) { return PAD + (nu / nuMax) * (W - PAD * 2) }
  function toY(I: number) { return H - PAD - (I / (pMax * 1.1)) * (H - PAD * 2) }

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.nu).toFixed(1)} ${toY(p.I).toFixed(1)}`).join(' ')

  // Visible range (400-700nm → 430-750 THz)
  const visStart = toX(c / 700e-9)
  const visEnd = toX(c / 400e-9)

  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: '#111827' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Visible range shading */}
          <defs>
            <linearGradient id="visGrad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3" />
              <stop offset="25%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#10B981" stopOpacity="0.3" />
              <stop offset="75%" stopColor="#F59E0B" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <rect x={visStart} y={PAD} width={visEnd - visStart} height={H - PAD * 2}
            fill="url(#visGrad)" />
          <text x={(visStart + visEnd) / 2} y={H - PAD - 5} fill="rgba(255,255,255,0.4)" fontSize={7} textAnchor="middle">נראה</text>

          {/* Axes */}
          <line x1={PAD} y1={H - PAD} x2={W - 5} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <line x1={PAD} y1={5} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <text x={W / 2} y={H - 5} fill="rgba(255,255,255,0.4)" fontSize={8} textAnchor="middle">ν (THz)</text>

          {/* Frequency labels */}
          {[0, 50, 100, 150, 200, 250, 300].map(tf => (
            <text key={tf} x={toX(tf * 1e12)} y={H - PAD + 10} fill="rgba(255,255,255,0.3)" fontSize={6} textAnchor="middle">{tf}</text>
          ))}

          {/* Spectrum fill */}
          <path d={pathD + ` L ${toX(nuMax)} ${H - PAD} L ${toX(0)} ${H - PAD} Z`} fill={`${peakColor}22`} />

          {/* Spectrum curve */}
          <motion.path key={T} d={pathD} fill="none" stroke={peakColor} strokeWidth={2.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />

          {/* Peak marker */}
          {nuPeak > 0 && (
            <>
              <line x1={toX(nuPeak)} y1={toY(pMax)} x2={toX(nuPeak)} y2={H - PAD}
                stroke="#FDE68A" strokeWidth={1.5} strokeDasharray="3,3" />
              <text x={toX(nuPeak) + 4} y={toY(pMax) - 4} fill="#FDE68A" fontSize={8}>
                λ_peak={peakNm}nm
              </text>
            </>
          )}
        </svg>
      </div>

      <div>
        <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>T = {T.toLocaleString()} K</label>
        <input type="range" min={500} max={30000} step={100} value={T}
          onChange={e => setT(Number(e.target.value))} className="w-full mt-1" />
      </div>

      {/* Presets */}
      <div className="flex gap-1.5 flex-wrap">
        {[
          { label: 'CMBR (2.7K)', T: 2.7, note: '~2mm' },
          { label: 'אדם (310K)', T: 310 },
          { label: 'שמש (5778K)', T: 5778 },
          { label: 'כוכב כחול (30kK)', T: 30000 },
        ].map(preset => (
          <button key={preset.label} onClick={() => setT(preset.T < 100 ? 300 : preset.T)}
            className="px-2 py-1 rounded-lg text-[10px] font-medium"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            {preset.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <GlassCard padding="sm" className="text-center">
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>λ_peak (וין)</div>
          <div className="text-sm font-bold mono" style={{ color: peakColor }}>{peakNm} nm</div>
        </GlassCard>
        <GlassCard padding="sm" className="text-center">
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>I_total ∝ T⁴</div>
          <div className="text-sm font-bold mono" style={{ color: 'var(--accent)' }}>
            {(5.67e-8 * T ** 4 / 1e6).toFixed(1)} MW/m²
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — פוטונים: בוזונים ללא שמירת מספר',
    content: (
      <div className="space-y-3">
        <p className="text-sm">לפוטונים, N אינו שמור (ניתן לבצע קרינה). לכן μ=0.</p>
        <p className="text-sm">מספר פוטונים בתדר ν בטמפרטורה T:</p>
        <BlockMath tex="\bar{n}(\nu) = \frac{1}{e^{h\nu/k_BT} - 1}" />
        <p className="text-sm">צפיפות אנרגיה ספקטרלית (עצמות ε=hν):</p>
        <BlockMath tex="u(\nu,T) = \frac{8\pi h\nu^3}{c^3}\frac{1}{e^{h\nu/k_BT}-1}" />
      </div>
    ),
    interimQuestion: {
      prompt: 'בגבול hν ≪ kT (אינפרא-אדום קלאסי), מה הקירוב?',
      hint: 'e^x ≈ 1+x לx קטן → 1/(e^x-1) ≈ 1/x = kT/hν',
      validate: s => s.includes('kT') || s.includes('קלאסי') || s.includes('Rayleigh'),
      correctAnswer: 'u(ν) ≈ (8πν²/c³)·kT — חוק Rayleigh-Jeans',
    },
  },
  {
    title: 'שלב 2 — אנרגיה כוללת וחוק T⁴',
    content: (
      <div className="space-y-3">
        <p className="text-sm">אינטגרציה על כל התדרים:</p>
        <BlockMath tex="U = \int_0^\infty u(\nu,T)\,d\nu = \frac{8\pi^5 k_B^4}{15 h^3 c^3}\,T^4 \propto T^4" />
        <p className="text-sm">הוצאת קרינה (חוק סטפן-בולצמן):</p>
        <BlockMath tex="P = \sigma T^4, \quad \sigma = 5.67\times 10^{-8}\;\text{W m}^{-2}\text{K}^{-4}" />
      </div>
    ),
    interimQuestion: {
      prompt: 'השמש (T=5778K) פולטת כמה W/m² ממשטחה?',
      hint: 'P = σT⁴ = 5.67×10⁻⁸ × 5778⁴',
      validate: s => { const v = parseFloat(s.replace(/[^\d.]/g, '')); return v > 5e7 && v < 7e7 },
      correctAnswer: '≈ 6.3×10⁷ W/m²',
    },
  },
  {
    title: 'שלב 3 — חוק תזוזת וין',
    content: (
      <div className="space-y-3">
        <p className="text-sm">מקסימום ספקטרום — גזירה ∂u/∂ν=0:</p>
        <BlockMath tex="\lambda_{max} T = b = 2.898\times 10^{-3}\;\text{m}\cdot\text{K}" />
        <div className="rounded-lg p-2 text-xs space-y-1" style={{ background: 'var(--accent-soft)' }}>
          <div>שמש: λ_max = 2.898/5778 nm = 501 nm ← ירוק!</div>
          <div>גוף אדם: λ_max = 2.898/310 nm ≈ 9350 nm ← IR</div>
          <div>CMBR: λ_max = 2.898/2.7 mm ≈ 1.07 mm ← מיקרוגל</div>
        </div>
      </div>
    ),
    interimQuestion: {
      prompt: 'כוכב עם λ_max=200nm (UV). מה טמפרטורתו?',
      hint: 'T = b/λ_max = 2.898×10⁻³/200×10⁻⁹',
      validate: s => { const v = parseFloat(s.replace(/[^\d.]/g, '')); return v > 13000 && v < 16000 },
      correctAnswer: '≈ 14,500 K — כוכב לוהט!',
    },
  },
]

export default function Node46({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>ספקטרום קרינת גוף שחור</h3><PlanckSpectrum /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>פוטונים כגז בוזונים: נוסחת פלאנק, T⁴, וין</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>כישלון הפיזיקה הקלאסית</h3>
            <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-muted)' }}>
              Rayleigh-Jeans: u(ν) ∝ ν²·kT — מסכים בIR אבל מתפוצץ ב-UV ("קטסטרופת UV")!
            </p>
            <BlockMath tex="U_{RJ} = \int_0^\infty \frac{8\pi\nu^2}{c^3}k_BT\,d\nu = \infty" />
            <p className="text-xs mt-2" style={{ color: 'var(--success)' }}>
              ✓ פלאנק פתר: הקוונטיזציה hν גורמת לגזירה אפסונית בתדרים גבוהים.
            </p>
          </GlassCard>
          <TrapCard
            title="גוף שחור = גוף שחור?"
            wrongFormula="\\text{גוף שחור = פחם}"
            rightFormula="\\text{גוף שחור = ספג כל הקרינה (ε=1)}"
            description="גוף שחור הוא מושג תרמודינמי — מושלם בספיגה ובפליטה. השמש קרובה מאוד לגוף שחור (ε≈0.98)."
          />
        </div>
      }
    />
  )
}
