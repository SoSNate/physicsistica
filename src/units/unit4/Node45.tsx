/**
 * Node 4.5 — מודל מוצק: איינשטיין ודביי
 * Explore: עקומת Cv vs T³ (דביי) ועקומת איינשטיין — השוואה
 * Build:   Z אוסצילטורים, Cv → T³ בT נמוך
 * Apply:   ננסים לבנים, חישובי Θ_D
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

const meta = UNITS[3].nodes[4]
const R = 8.314

function cvEinstein(T: number, thetaE: number): number {
  if (T < 1) return 0
  const x = thetaE / T
  return R * x * x * Math.exp(x) / Math.pow(Math.exp(x) - 1, 2)
}

function cvDebye(T: number, thetaD: number): number {
  if (T < 1) return 0
  if (T > thetaD * 2) return 3 * R
  const t = T / thetaD
  // Approximate: low-T limit T³ law
  if (t < 0.1) return 234 * R * t * t * t
  // Higher T: use Padé-like interpolation
  const x = thetaD / T
  const nBE = (ex: number) => 1 / (Math.exp(ex) - 1)
  let sum = 0, n = 100
  for (let i = 1; i <= n; i++) {
    const xi = x * i / n
    sum += xi * xi * Math.exp(xi) / Math.pow(Math.exp(xi) - 1, 2) / (n)
  }
  return R * 3 * sum * x * 3
}

// ══════════════════════════════════════════════════════════════════════
// EXPLORE
// ══════════════════════════════════════════════════════════════════════
function DebyeEinsteinPlot() {
  const [material, setMaterial] = useState(0)
  const [showT3, setShowT3] = useState(false)

  const materials = [
    { name: 'יהלום', thetaD: 2230, thetaE: 1450, color: '#6B8DD6' },
    { name: 'ברזל (Fe)', thetaD: 470, thetaE: 310, color: '#f59e0b' },
    { name: 'עופרת (Pb)', thetaD: 105, thetaE: 70, color: '#34d399' },
  ]

  const { thetaD, thetaE, color } = materials[material]
  const W = 300, H = 180, PAD = 30
  const Tmax = Math.min(thetaD * 2, 1200)

  const debPts = Array.from({ length: 80 }, (_, i) => {
    const T = 5 + (i / 79) * Tmax
    return { T, cv: cvDebye(T, thetaD) / R }
  })

  const einPts = Array.from({ length: 80 }, (_, i) => {
    const T = 5 + (i / 79) * Tmax
    return { T, cv: cvEinstein(T, thetaE) / R }
  })

  const t3Pts = showT3 ? Array.from({ length: 40 }, (_, i) => {
    const T = 5 + (i / 39) * Tmax * 0.3
    return { T, cv: 234 * Math.pow(T / thetaD, 3) }
  }) : []

  function toX(T: number) { return PAD + (T / Tmax) * (W - PAD * 2) }
  function toY(cv: number) { return H - PAD - Math.min(cv / 3, 1) * (H - PAD * 2) }

  const debPath = debPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.T).toFixed(1)} ${toY(p.cv).toFixed(1)}`).join(' ')
  const einPath = einPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.T).toFixed(1)} ${toY(p.cv).toFixed(1)}`).join(' ')
  const t3Path = t3Pts.length ? t3Pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.T).toFixed(1)} ${toY(p.cv).toFixed(1)}`).join(' ') : ''

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">
        {materials.map((m, i) => (
          <button key={i} onClick={() => setMaterial(i)}
            className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: material === i ? `${m.color}33` : 'var(--accent-soft)', border: `1px solid ${material === i ? m.color : 'transparent'}`, color: m.color }}>
            {m.name}
          </button>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: '#111827' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          <line x1={PAD} y1={H - PAD} x2={W - 5} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <line x1={PAD} y1={5} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <text x={W / 2} y={H - 5} fill="rgba(255,255,255,0.4)" fontSize={8} textAnchor="middle">T (K)</text>
          <text x={10} y={H / 2} fill="rgba(255,255,255,0.4)" fontSize={7} textAnchor="middle"
            transform={`rotate(-90,10,${H/2})`}>Cv/R</text>

          {/* Dulong-Petit limit */}
          <line x1={PAD} y1={toY(3)} x2={W - 5} y2={toY(3)} stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="4,4" />
          <text x={W - 6} y={toY(3) - 3} fill="rgba(255,255,255,0.3)" fontSize={7} textAnchor="end">3R</text>

          {/* Debye curve */}
          <motion.path key={`deb-${material}`} d={debPath} fill="none" stroke={color} strokeWidth={2.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />

          {/* Einstein curve */}
          <motion.path key={`ein-${material}`} d={einPath} fill="none" stroke={color} strokeWidth={1.5}
            strokeDasharray="6,3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.2 }} />

          {/* T³ law */}
          {t3Path && (
            <path d={t3Path} fill="none" stroke="#FDE68A" strokeWidth={1.5} strokeDasharray="2,2" />
          )}

          {/* Legend */}
          <g>
            <line x1={W - 90} y1={15} x2={W - 75} y2={15} stroke={color} strokeWidth={2.5} />
            <text x={W - 72} y={18} fill={color} fontSize={7}>דביי</text>
            <line x1={W - 90} y1={28} x2={W - 75} y2={28} stroke={color} strokeWidth={1.5} strokeDasharray="6,3" />
            <text x={W - 72} y={31} fill={color} fontSize={7}>איינשטיין</text>
            {showT3 && (
              <>
                <line x1={W - 90} y1={41} x2={W - 75} y2={41} stroke="#FDE68A" strokeWidth={1.5} strokeDasharray="2,2" />
                <text x={W - 72} y={44} fill="#FDE68A" fontSize={7}>T³</text>
              </>
            )}
          </g>
        </svg>
      </div>

      <label className="flex items-center gap-2 text-xs cursor-pointer">
        <input type="checkbox" checked={showT3} onChange={e => setShowT3(e.target.checked)} />
        <span style={{ color: 'var(--text)' }}>הצג חוק T³ (קירוב דביי לT נמוך)</span>
      </label>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — מודל איינשטיין',
    content: (
      <div className="space-y-3">
        <p className="text-sm">מוצק = N אוסצילטורים הרמוניים זהים, תדר ω_E:</p>
        <BlockMath tex="Z = z_{HO}^{3N},\quad \langle E\rangle = 3N\hbar\omega_E\!\left(\frac{1}{2} + \frac{1}{e^{\beta\hbar\omega_E}-1}\right)" />
        <BlockMath tex="C_V = 3Nk_B\!\left(\frac{\Theta_E}{T}\right)^{\!2}\frac{e^{\Theta_E/T}}{(e^{\Theta_E/T}-1)^2}" />
        <p className="text-sm">בT גבוה: C_V → 3R (Dulong-Petit). בT נמוך: C_V ~ e^(-Θ_E/T) — יורד מהיר מדי!</p>
      </div>
    ),
    interimQuestion: {
      prompt: 'בגבול T→∞, מה C_V לפי Dulong-Petit?',
      hint: '3N אוסצילטורים, 2 דרגות חופש כל אחד, (1/2)kT כל אחת',
      validate: s => s.includes('3R') || s.includes('3Nk') || s.includes('25'),
      correctAnswer: 'C_V = 3Nk_B = 3R ≈ 24.9 J/mol·K',
    },
  },
  {
    title: 'שלב 2 — מודל דביי: ספקטרום רציף',
    content: (
      <div className="space-y-3">
        <p className="text-sm">דביי: לא תדר יחיד, אלא ספקטרום רציף עד ω_D:</p>
        <BlockMath tex="g(\omega) = \frac{9N\omega^2}{\omega_D^3},\quad 0 \leq \omega \leq \omega_D" />
        <p className="text-sm">לT נמוך (T ≪ Θ_D = ħω_D/k_B):</p>
        <BlockMath tex="C_V \approx \frac{12\pi^4 Nk_B}{5}\left(\frac{T}{\Theta_D}\right)^{\!\!3} \propto T^3" />
      </div>
    ),
    interimQuestion: {
      prompt: 'אם נמדוד C_V בT מאוד נמוך ונרשום ln(C_V) vs ln(T), מה השיפוע?',
      hint: 'C_V ∝ T³ → ln(C_V) = 3·ln(T) + const',
      validate: s => s.trim() === '3' || s.includes('שלוש') || s.includes('3'),
      correctAnswer: 'שיפוע = 3 (חוק T³)',
    },
  },
]

export default function Node45({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>קיבול חום מוצק — דביי vs איינשטיין</h3><DebyeEinsteinPlot /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>C_V ∝ T³ בT נמוך — מדוע?</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>Θ_D לחומרים שונים</h3>
            <div className="space-y-1.5 text-xs">
              {[
                { mat: 'יהלום (C)', td: 2230, hard: 'קשה מאוד' },
                { mat: 'ברזל (Fe)', td: 470, hard: 'מתכת' },
                { mat: 'אלומיניום (Al)', td: 428, hard: 'מתכת קלה' },
                { mat: 'עופרת (Pb)', td: 105, hard: 'רך' },
              ].map(r => (
                <div key={r.mat} className="flex items-center gap-2 p-1.5 rounded-lg" style={{ background: 'var(--accent-soft)' }}>
                  <span className="w-24" style={{ color: 'var(--text)' }}>{r.mat}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(r.td / 2230) * 100}%`, background: 'var(--accent)' }} />
                  </div>
                  <span className="w-12 text-right mono" style={{ color: 'var(--accent)' }}>{r.td}K</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>
              Θ_D גבוה ← חומר קשיח, קישורים חזקים
            </p>
          </GlassCard>
          <TrapCard
            title="T³ תקף לכל T?"
            wrongFormula="C_V = \\alpha T^3 \\text{ לכל T}"
            rightFormula="C_V \\approx \\alpha T^3 \\text{ רק עבור } T \\ll \\Theta_D"
            description="חוק T³ של דביי נכון רק בT≪Θ_D. בT בינוני — חייבים את האינטגרל המלא של דביי. בT גבוה → 3R."
          />
        </div>
      }
    />
  )
}
