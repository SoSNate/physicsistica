/**
 * Node 2.4 — טמפרטורה סטטיסטית והחוק השני
 * Explore: עקומת S(E) אינטראקטיבית — גרור לראות שיפוע = 1/T
 * Build:   1/T = ∂S/∂E — הגדרת T מתמטית
 * Apply:   שיווי-משקל = שוויון T
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

const meta = UNITS[1].nodes[3]
const kB = 1.38e-23

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — S(E) עם שיפוע אינטראקטיבי
// ══════════════════════════════════════════════════════════════════════
function SECurve() {
  // Paramagnent: E = -μ_B * H * (2N↑ - N), N↑ ∈ [0,N]
  // S = Nk_B ln2 + k_B * (-N↑ ln N↑/N - N↓ ln N↓/N)
  const N = 40
  const muH = 1  // μ_B * H in arbitrary units

  const [eIdx, setEIdx] = useState(N / 2)  // N↑ index

  function calcS(nUp: number): number {
    if (nUp <= 0 || nUp >= N) return 0
    return -(nUp * Math.log(nUp / N) + (N - nUp) * Math.log((N - nUp) / N))
  }
  function nUpToE(nUp: number): number { return -muH * (2 * nUp - N) }
  function calcT(nUp: number): number | null {
    // dS/dE = (1/2muH) * (dS/dN↑)^-1
    if (nUp <= 0 || nUp >= N) return null
    const dSdNup = Math.log((N - nUp) / nUp)
    if (Math.abs(dSdNup) < 1e-9) return null
    return (2 * muH) / (kB * 1e23 * dSdNup)
  }

  const pts = useMemo(() =>
    Array.from({ length: N - 1 }, (_, i) => ({ nUp: i + 1, E: nUpToE(i + 1), S: calcS(i + 1) })), [])

  const Emin = nUpToE(0), Emax = nUpToE(N)
  const W = 300, H = 175, PAD = 30

  function toX(E: number) { return PAD + ((E - Emin) / (Emax - Emin)) * (W - PAD * 2) }
  function toY(S: number) { return H - PAD - (S / Math.max(...pts.map(p => p.S))) * (H - PAD * 2) }

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.E).toFixed(1)} ${toY(p.S).toFixed(1)}`).join(' ')

  const currentPt = pts[eIdx - 1] || pts[0]
  const T = calcT(eIdx)

  // Tangent line at current point
  function tangentY(E: number, pt: typeof pts[0], dSdE: number) {
    return toY(pt.S) - dSdE * (toX(E) - toX(pt.E)) * (H - PAD * 2) / (Emax - Emin) * 2
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: '#111827' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          <line x1={PAD} y1={H - PAD} x2={W - 8} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <line x1={PAD} y1={8} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <text x={W / 2} y={H - 6} fill="rgba(255,255,255,0.4)" fontSize={8} textAnchor="middle">E (−N→ חיובי, N↑↓ שווים → 0, +N)</text>
          <text x={10} y={H / 2} fill="rgba(255,255,255,0.4)" fontSize={7} textAnchor="middle" transform={`rotate(-90,10,${H / 2})`}>S / k_B</text>

          {/* S(E) curve */}
          <path d={pathD + ` L ${toX(pts[pts.length-1].E)} ${H-PAD} L ${toX(pts[0].E)} ${H-PAD} Z`}
            fill="rgba(107,141,214,0.1)" />
          <motion.path d={pathD} fill="none" stroke="#6B8DD6" strokeWidth={2.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} />

          {/* Tangent line */}
          {currentPt && T !== null && (
            <line
              x1={toX(currentPt.E) - 40} y1={toY(currentPt.S) + 40 / (T > 0 ? Math.abs(T) * 0.4 + 0.1 : -Math.abs(T) * 0.4 - 0.1)}
              x2={toX(currentPt.E) + 40} y2={toY(currentPt.S) - 40 / (T > 0 ? Math.abs(T) * 0.4 + 0.1 : -Math.abs(T) * 0.4 - 0.1)}
              stroke="#FDE68A" strokeWidth={2} />
          )}

          {/* Current point */}
          {currentPt && (
            <circle cx={toX(currentPt.E)} cy={toY(currentPt.S)} r={5} fill="#f472b6" />
          )}

          {/* T label */}
          {T !== null && (
            <text x={W - 10} y={20} fill="#FDE68A" fontSize={9} textAnchor="end">
              T = {T > 100 ? '∞' : T < -100 ? '-∞' : T.toFixed(0)} (יח' שרירותיות)
            </text>
          )}
        </svg>
      </div>

      <div>
        <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
          N↑ = {eIdx} → E = {nUpToE(eIdx).toFixed(1)}
        </label>
        <input type="range" min={1} max={N - 1} value={eIdx}
          onChange={e => setEIdx(Number(e.target.value))} className="w-full mt-1" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'S / k_B', val: currentPt ? currentPt.S.toFixed(2) : '-', color: 'var(--accent)' },
          { label: 'שיפוע ∂S/∂E', val: T !== null ? (1 / (T * 0.1)).toFixed(3) : '-', color: 'var(--warn)' },
          { label: 'T', val: T !== null ? (Math.abs(T) > 50 ? (T > 0 ? '+∞' : '-∞') : T.toFixed(1)) : '-', color: T !== null && T < 0 ? '#f472b6' : 'var(--success)' },
        ].map(item => (
          <GlassCard key={item.label} padding="sm" className="text-center">
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
            <div className="text-sm font-bold mono" style={{ color: item.color }}>{item.val}</div>
          </GlassCard>
        ))}
      </div>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        הקו הצהוב = משיק לעקומה. שיפועו = 1/T. ימין מהמרכז → T שלילי!
      </p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — שיווי-משקל תרמי',
    content: (
      <div className="space-y-3">
        <p className="text-sm">שתי מערכות במגע תרמי חולקות אנרגיה, <M tex="E = E_1 + E_2 = \text{const}" />.</p>
        <p className="text-sm">ריבוי משותף: <M tex="\Omega_{tot} = \Omega_1(E_1)\cdot\Omega_2(E-E_1)" /></p>
        <p className="text-sm">מקסימום: <M tex="\frac{\partial\Omega_{tot}}{\partial E_1} = 0" /></p>
        <BlockMath tex="\frac{\partial\ln\Omega_1}{\partial E_1} = \frac{\partial\ln\Omega_2}{\partial E_2}" />
      </div>
    ),
    interimQuestion: {
      prompt: 'מה תנאי שיווי-המשקל אומר פיזיקלית?',
      hint: 'כשהגודל ∂lnΩ/∂E שווה בשתי המערכות',
      validate: s => s.includes('שיפוע') || s.includes('שווה') || s.includes('זהה') || s.includes('balance'),
      correctAnswer: 'שיפוע S(E) זהה בשתי המערכות',
    },
  },
  {
    title: 'שלב 2 — הגדרת הטמפרטורה',
    content: (
      <div className="space-y-3">
        <p className="text-sm">הגדרה: כמות שממצעת ב-שיווי-משקל תרמי:</p>
        <BlockMath tex="\frac{1}{T} \equiv \frac{\partial S}{\partial E}\bigg|_{V,N}" />
        <p className="text-sm">זה תואם את ההגדרה התרמודינמית <M tex="dU = TdS - PdV" />.</p>
        <div className="rounded-lg p-2 text-xs" style={{ background: 'var(--accent-soft)' }}>
          <div>• T{'>'} 0 ← S עולה עם E (רוב המקרים)</div>
          <div>• T = ∞ ← ∂S/∂E = 0 (פסגת S)</div>
          <div>• T {'<'} 0 ← S יורדת עם E (מיוחד!)</div>
        </div>
      </div>
    ),
    interimQuestion: {
      prompt: 'בנקודה שבה S מקסימלי, מה T?',
      hint: '∂S/∂E = 0 ← 1/T = 0',
      validate: s => s.includes('∞') || s.toLowerCase().includes('inf') || s.includes('אינסוף'),
      correctAnswer: 'T = ∞ (אינסוף)',
    },
  },
  {
    title: 'שלב 3 — לפרה-מגנט',
    content: (
      <div className="space-y-3">
        <p className="text-sm">עבור פרה-מגנט, <M tex="E = -\mu_B\mathcal{H}(2N_\uparrow - N)" />, מחשבים:</p>
        <BlockMath tex="\frac{1}{T} = \frac{\partial S}{\partial E} = \frac{k_B}{2\mu_B\mathcal{H}}\ln\frac{N_\downarrow}{N_\uparrow}" />
        <p className="text-sm">שיווי-משקל בשדה: <M tex="\frac{N_\uparrow}{N_\downarrow} = e^{2\mu_B\mathcal{H}/k_BT}" /></p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--success)' }}>
          ✓ זהו הגורם הקלאסי של בולצמן!
        </p>
      </div>
    ),
    interimQuestion: {
      prompt: 'בשדה H≠0 ובT גבוה מאוד, מה היחס N↑/N↓?',
      hint: 'T→∞ → e^(2μH/kT) → 1',
      validate: s => s.trim() === '1' || s.includes('שווים') || s.includes('½'),
      correctAnswer: '1 — שיוויון מוחלט, ממוגנט אפס',
    },
  },
]

export default function Node24({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>עקומת S(E) — שיפוע = 1/T</h3><SECurve /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>גזירת הגדרת הטמפרטורה הסטטיסטית 1/T = ∂S/∂E</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>שיווי-משקל תרמי מוויזואלי</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              כשמחברים שתי מערכות בטמפרטורות שונות — אנרגיה זורמת עד שהשיפועים (1/T) מתאזנים. מערכת חמה יותר: שיפוע קטן יותר ← אנרגיה עוברת ממנה לקרה.
            </p>
            <BlockMath tex="T_1 > T_2 \Rightarrow \frac{\partial S_1}{\partial E_1} < \frac{\partial S_2}{\partial E_2} \Rightarrow \Delta E: 1 \to 2" />
          </GlassCard>
          <TrapCard
            title="T מוגדר רק ב-שיווי-משקל?"
            wrongFormula="T \text{ קיים תמיד}"
            rightFormula="T = \left(\frac{\partial S}{\partial E}\right)^{-1} \text{ — רק כשS(E) מוגדר}"
            description="T סטטיסטית מוגדרת רק כשהמערכת בשיווי-משקל פנימי (כל המיקרו-מצבים שווי-הסתברות). מערכת בשחרור מהיר — T לא מוגדר!"
          />
        </div>
      }
    />
  )
}
