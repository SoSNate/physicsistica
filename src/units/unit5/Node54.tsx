/**
 * Node 5.4 — גז אלקטרונים מנוון
 * Explore: ים פרמי — ספירת מצבים עד k_F, E_F slider עם N readout
 * Build:   N = 2·(4/3)πk_F³/(2π)³·V → k_F, E_F, אנרגיה כוללת ב-T=0
 * Apply:   לחץ ננסים לבנים, silon E_F of Cu
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

const meta = UNITS[4].nodes[3]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — ים פרמי (2D projection)
// ══════════════════════════════════════════════════════════════════════
function FermiSea() {
  const [kF, setKF] = useState(3) // in units of π/L

  const W = 280, H = 280, CX = W / 2, CY = H / 2
  const scale = 22 // pixels per unit

  // k-space points inside Fermi sphere (2D slice)
  const filledPoints = useMemo(() => {
    const pts: { kx: number; ky: number; r: number }[] = []
    const maxK = Math.ceil(kF) + 1
    for (let kx = -maxK; kx <= maxK; kx++) {
      for (let ky = -maxK; ky <= maxK; ky++) {
        const r = Math.sqrt(kx * kx + ky * ky)
        pts.push({ kx, ky, r })
      }
    }
    return pts
  }, [kF])

  const filled = filledPoints.filter(p => p.r <= kF)
  const nearby = filledPoints.filter(p => p.r > kF && p.r <= kF + 0.7)

  // Density of states N(k)
  const N_total = (4 / 3) * Math.PI * Math.pow(kF, 3) * 2 // 2 for spin
  const N_2d = filled.length * 2 // approximate

  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border mx-auto" style={{ borderColor: 'var(--border)', background: '#0d1117', maxWidth: W }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Grid lines */}
          {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map(k => (
            <g key={k}>
              <line x1={CX + k * scale} y1={0} x2={CX + k * scale} y2={H} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
              <line x1={0} y1={CY + k * scale} x2={W} y2={CY + k * scale} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
            </g>
          ))}

          {/* Axes */}
          <line x1={CX} y1={10} x2={CX} y2={H - 10} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
          <line x1={10} y1={CY} x2={W - 10} y2={CY} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
          <text x={W - 8} y={CY - 4} fill="rgba(255,255,255,0.3)" fontSize={9}>k_x</text>
          <text x={CX + 4} y={14} fill="rgba(255,255,255,0.3)" fontSize={9}>k_y</text>

          {/* k=0 label */}
          <text x={CX + 3} y={CY - 3} fill="rgba(255,255,255,0.2)" fontSize={7}>0</text>

          {/* Fermi circle */}
          <circle cx={CX} cy={CY} r={kF * scale}
            fill="none" stroke="#FDE68A" strokeWidth={1.5} strokeDasharray="6,3" />
          <text x={CX + kF * scale + 3} y={CY - 4} fill="#FDE68A" fontSize={8}>k_F</text>

          {/* Surface states (near Fermi) */}
          {nearby.map((p, i) => (
            <circle key={`near-${i}`}
              cx={CX + p.kx * scale} cy={CY - p.ky * scale}
              r={3.5} fill="rgba(244,114,182,0.3)" stroke="rgba(244,114,182,0.5)" strokeWidth={0.5} />
          ))}

          {/* Filled states */}
          {filled.map((p, i) => (
            <motion.circle key={`f-${i}`}
              cx={CX + p.kx * scale} cy={CY - p.ky * scale}
              r={4}
              fill={`rgba(107,141,214,${0.4 + (1 - p.r / kF) * 0.5})`}
              stroke="rgba(107,141,214,0.6)" strokeWidth={0.5}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: i * 0.003 }}
            />
          ))}

          {/* Center */}
          <circle cx={CX} cy={CY} r={3} fill="#FDE68A" />
        </svg>
      </div>

      <div>
        <label className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
          k_F = {kF} × π/L | מצבים מאוכלסים: {filled.length * 2} (כולל ספין)
        </label>
        <input type="range" min={1} max={5} step={0.5} value={kF}
          onChange={e => setKF(Number(e.target.value))} className="w-full mt-1" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <GlassCard padding="sm" className="text-center">
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>k_F (3D)</div>
          <div className="text-sm font-bold mono" style={{ color: 'var(--accent)' }}>
            (3π²n)^(1/3)
          </div>
        </GlassCard>
        <GlassCard padding="sm" className="text-center">
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>E_F = ℏ²k_F²/2m</div>
          <div className="text-sm font-bold mono" style={{ color: '#FDE68A' }}>
            ∝ n^(2/3)
          </div>
        </GlassCard>
      </div>

      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        כחול = מצבים מאוכלסים (T=0). ורוד = מצבים על משטח פרמי — בT{'>'} 0 הם קופצים מעל k_F.
      </p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — ספירת מצבים במרחב k',
    content: (
      <div className="space-y-3">
        <p className="text-sm">בתיבה V=L³, ערכי k מוגדרים: k = (2π/L)×(nx,ny,nz).</p>
        <p className="text-sm">צפיפות מצבים במרחב k:</p>
        <BlockMath tex="\frac{V}{(2\pi)^3} \text{ מצבים לכל יחידת נפח-}k" />
        <p className="text-sm">ב-T=0 כל הכדור עד k_F מאוכלס (ספין 2):</p>
        <BlockMath tex="N = 2 \cdot \frac{V}{(2\pi)^3} \cdot \frac{4}{3}\pi k_F^3" />
      </div>
    ),
    interimQuestion: {
      prompt: 'בידוד: מה k_F מבחינת ריכוז n=N/V?',
      hint: 'פתור עבור k_F: N/V = k_F³/(3π²)',
      validate: s => s.includes('3π²') || s.includes('(3π') || s.includes('1/3') || s.includes('n^'),
      correctAnswer: 'k_F = (3π²n)^(1/3)',
    },
  },
  {
    title: 'שלב 2 — אנרגיית פרמי ואנרגיה כוללת',
    content: (
      <div className="space-y-3">
        <BlockMath tex="E_F = \frac{\hbar^2 k_F^2}{2m} = \frac{\hbar^2}{2m}(3\pi^2 n)^{2/3}" />
        <p className="text-sm">אנרגיה כוללת ב-T=0 (כל האלקטרונים עד E_F):</p>
        <BlockMath tex="U_0 = \int_0^{E_F} \varepsilon\, g(\varepsilon)\,d\varepsilon = \frac{3}{5}NE_F" />
        <p className="text-sm text-xs" style={{ color: 'var(--text-muted)' }}>
          ממוצע = (3/5)E_F, לא E_F — ממוצע על הכדור
        </p>
      </div>
    ),
    interimQuestion: {
      prompt: 'מה לחץ גז אלקטרונים ב-T=0? (השתמש ב-P = -∂U/∂V|_S)',
      hint: 'U₀ = (3/5)NE_F ∝ n^(2/3)·N ∝ V^(-2/3)·N → ∂U/∂V',
      validate: s => s.includes('2/5') || s.includes('nE_F') || s.includes('2U') || s.includes('P='),
      correctAnswer: 'P = (2/3)·U₀/V = (2/5)·nE_F — לחץ קוונטי ב-T=0!',
    },
  },
  {
    title: 'שלב 3 — ננסים לבנים: לחץ פרמי מול כבידה',
    content: (
      <div className="space-y-3">
        <p className="text-sm">בננס לבן: כבידה מתכווצת, לחץ פרמי מנגד.</p>
        <BlockMath tex="P_{Fermi} = \frac{2}{5}n_e E_F \propto n_e^{5/3} \propto R^{-5}" />
        <BlockMath tex="P_{grav} \propto R^{-4}" />
        <div className="rounded-lg p-2 text-xs" style={{ background: 'var(--accent-soft)' }}>
          <div>שיווי משקל: P_Fermi = P_grav → R ∝ M^(-1/3)</div>
          <div className="mt-1" style={{ color: 'var(--warn)' }}>מסה גבוהה מדי → R→0 → קריסה! (גבול צ'נדרסקר ≈ 1.4M☉)</div>
        </div>
      </div>
    ),
    interimQuestion: {
      prompt: 'למה ננס לבן לא קורס למרות שT≈0 (מבחינה תרמית)?',
      hint: 'אנרגיית פרמי אינה תרמית — היא קינטית קוונטית (פאולי)',
      validate: s => s.includes('פאולי') || s.includes('קוונטי') || s.includes('E_F') || s.includes('פרמי'),
      correctAnswer: 'הלחץ הקוונטי (Pauli exclusion) אינו תרמי — קיים גם ב-T=0',
    },
  },
]

export default function Node54({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>ים פרמי — מרחב-k</h3><FermiSea /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>k_F, E_F, U₀=(3/5)NE_F — גז אלקטרונים ב-T=0</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>E_F של מתכות נבחרות</h3>
            <div className="space-y-1.5 text-xs">
              {[
                { metal: 'Li', ef: 4.7, tf: 54600 },
                { metal: 'Na', ef: 3.2, tf: 37100 },
                { metal: 'Cu', ef: 7.0, tf: 81200 },
                { metal: 'Al', ef: 11.7, tf: 135700 },
              ].map(r => (
                <div key={r.metal} className="flex items-center gap-2 rounded-lg p-1.5" style={{ background: 'var(--accent-soft)' }}>
                  <span className="font-bold w-8" style={{ color: 'var(--accent)' }}>{r.metal}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(r.ef / 12) * 100}%`, background: 'var(--accent)' }} />
                  </div>
                  <span className="w-14 text-right mono text-[10px]" style={{ color: 'var(--accent)' }}>{r.ef} eV</span>
                  <span className="w-16 text-right mono text-[10px]" style={{ color: 'var(--text-muted)' }}>T_F={r.tf}K</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>T_F = E_F/k_B ≫ T_room → מתכות תמיד מנוונות</p>
          </GlassCard>
          <TrapCard
            title="⟨E⟩ = E_F לאלקטרון?"
            wrongFormula="\langle\varepsilon\rangle = E_F \text{ (T=0)}"
            rightFormula="\langle\varepsilon\rangle = \tfrac{3}{5}E_F \text{ (T=0)}"
            description="ממוצע על כדור פרמי: אלקטרונים בקרבת k=0 (ε≈0) מורידים את הממוצע ל-(3/5)E_F"
          />
        </div>
      }
    />
  )
}
