/**
 * Node 5.5 — עיבוי בוז-איינשטיין
 * Explore: N₀/N vs T/T_c — קפיצת עיבוי אנימטיבית
 * Build:   T_c מתנאי μ→0, N₀/N = 1-(T/T_c)³
 * Apply:   He-4, גז אטומים קפוא (Rb, Na), ניסויי BEC
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NodeLayout from '../../components/NodeLayout'
import ScaffoldedDerivation from '../../components/ScaffoldedDerivation'
import TrapCard from '../../components/TrapCard'
import GlassCard from '../../components/GlassCard'
import { BlockMath, M } from '../../components/MathBlock'
import { UNITS } from '../../data/units'
import type { DerivationStep } from '../../types'

const meta = UNITS[4].nodes[4]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — BEC condensate fraction
// ══════════════════════════════════════════════════════════════════════
function BECPlot() {
  const [T, setT] = useState(0.5) // T/T_c

  const W = 300, H = 200, PAD = 32

  // N0/N = 1 - (T/Tc)^3 for T < Tc, 0 for T >= Tc
  function condensateFraction(t: number) {
    if (t >= 1) return 0
    return 1 - Math.pow(t, 3)
  }

  const pts = useMemo(() =>
    Array.from({ length: 120 }, (_, i) => {
      const t = (i / 119) * 1.5
      return { t, n0: condensateFraction(t) }
    }), [])

  function toX(t: number) { return PAD + (t / 1.5) * (W - PAD * 2) }
  function toY(n: number) { return H - PAD - n * (H - PAD * 2) }

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.t).toFixed(1)} ${toY(p.n0).toFixed(1)}`).join(' ')

  const currentN0 = condensateFraction(T)
  const isCondensed = T < 1

  // Particle visualization
  const numParticles = 40
  const condensedCount = Math.round(currentN0 * numParticles)

  const particles = useMemo(() =>
    Array.from({ length: numParticles }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 260,
      y: 10 + Math.random() * 100,
    })), [])

  return (
    <div className="space-y-3">
      {/* Particle visualization */}
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: '#0d1117', height: 120 }}>
        <svg width="100%" height="100%" viewBox="0 0 280 120">
          <text x={140} y={14} fill="rgba(255,255,255,0.3)" fontSize={9} textAnchor="middle">
            {isCondensed ? `עיבוי BEC: ${(currentN0 * 100).toFixed(0)}% במצב היסוד` : 'גז רגיל — כל המצבים מפוזרים'}
          </text>
          {particles.map((p, i) => {
            const isInGround = i < condensedCount
            return (
              <motion.circle
                key={p.id}
                r={isInGround ? 5 : 3}
                fill={isInGround ? '#a78bfa' : 'rgba(107,141,214,0.4)'}
                stroke={isInGround ? 'rgba(167,139,250,0.8)' : 'none'}
                strokeWidth={1}
                animate={{
                  cx: isInGround ? 140 + (i % 8 - 3.5) * 14 : p.x,
                  cy: isInGround ? 75 + Math.floor(i / 8) * 14 - 10 : p.y,
                  opacity: 1,
                }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 60 }}
              />
            )
          })}

          {isCondensed && condensedCount > 3 && (
            <motion.rect
              x={100} y={55} width={80} height={50}
              rx={6}
              fill="rgba(167,139,250,0.1)"
              stroke="rgba(167,139,250,0.4)"
              strokeWidth={1}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
            />
          )}
        </svg>
      </div>

      {/* N0/N curve */}
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: '#111827' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          <line x1={PAD} y1={H - PAD} x2={W - 5} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <line x1={PAD} y1={5} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <text x={W / 2} y={H - 5} fill="rgba(255,255,255,0.4)" fontSize={8} textAnchor="middle">T / T_c</text>
          <text x={8} y={H / 2} fill="rgba(255,255,255,0.4)" fontSize={7} textAnchor="middle"
            transform={`rotate(-90,8,${H / 2})`}>N₀/N</text>

          {[0, 0.25, 0.5, 0.75, 1.0].map(v => (
            <g key={v}>
              <line x1={PAD} y1={toY(v)} x2={W - 5} y2={toY(v)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              <text x={PAD - 2} y={toY(v) + 3} fill="rgba(255,255,255,0.25)" fontSize={6} textAnchor="end">{v}</text>
            </g>
          ))}
          {[0, 0.5, 1.0, 1.5].map(v => (
            <text key={v} x={toX(v)} y={H - PAD + 10} fill="rgba(255,255,255,0.3)" fontSize={6} textAnchor="middle">{v}</text>
          ))}

          {/* T_c marker */}
          <line x1={toX(1)} y1={5} x2={toX(1)} y2={H - PAD} stroke="#FDE68A" strokeWidth={1} strokeDasharray="4,3" />
          <text x={toX(1) + 3} y={25} fill="#FDE68A" fontSize={8}>T_c</text>

          {/* Fill */}
          <path d={pathD + ` L ${toX(0)} ${H - PAD} Z`} fill="rgba(167,139,250,0.12)" />

          {/* Curve */}
          <motion.path d={pathD} fill="none" stroke="#a78bfa" strokeWidth={2.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} />

          {/* Current T point */}
          <circle cx={toX(T)} cy={toY(currentN0)} r={5} fill="#FDE68A" />
          <text x={toX(T) + 7} y={toY(currentN0) - 4} fill="#FDE68A" fontSize={8}>
            N₀/N={( currentN0 * 100).toFixed(0)}%
          </text>
        </svg>
      </div>

      <div>
        <label className="text-xs font-semibold" style={{ color: isCondensed ? '#a78bfa' : 'var(--text-muted)' }}>
          T/T_c = {T.toFixed(2)} — {isCondensed ? '🌀 BEC!' : 'גז רגיל'}
        </label>
        <input type="range" min={0.0} max={1.5} step={0.02} value={T}
          onChange={e => setT(Number(e.target.value))} className="w-full mt-1" />
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — תנאי ל-BEC: μ→0',
    content: (
      <div className="space-y-3">
        <p className="text-sm">לבוזונים: f_BE = 1/(e^((ε-μ)/kT)-1). עבור ε_0=0 (מצב היסוד):</p>
        <BlockMath tex="\langle n_0\rangle = \frac{1}{e^{-\mu/k_BT} - 1} \xrightarrow{\mu\to 0^-} \infty" />
        <p className="text-sm">מתחת ל-T_c, μ=0 ומצב היסוד מאוכלס מקרוסקופית.</p>
        <p className="text-sm">N כולל: N = N₀ + N_excited</p>
      </div>
    ),
    interimQuestion: {
      prompt: 'למה μ חייב להיות שלילי בT>T_c? (עבור גז בוזוני רגיל)',
      hint: 'f_BE = 1/(e^x - 1), x=(ε-μ)/kT. כדי שf≥0 לכל ε≥0, צריך...',
      validate: s => s.includes('שלילי') || s.includes('μ<0') || s.includes('x>0') || s.includes('מתבדר'),
      correctAnswer: 'μ<0 כדי ש-x=(ε-μ)/kT>0 לכל ε≥0 → f_BE מוגדרת ואי-שלילית',
    },
  },
  {
    title: 'שלב 2 — T_c ו-N₀/N',
    content: (
      <div className="space-y-3">
        <p className="text-sm">אינטגרל על המצבים המעוררים (μ=0):</p>
        <BlockMath tex="N_{ex}(T) = V\!\int_0^\infty \frac{g(\varepsilon)}{e^{\varepsilon/k_BT}-1}\,d\varepsilon \propto T^{3/2}" />
        <p className="text-sm">T_c: כל החלקיקים עדיין יכולים להיות מעוררים:</p>
        <BlockMath tex="k_BT_c = \frac{2\pi\hbar^2}{m}\left(\frac{n}{2.612}\right)^{2/3}" />
        <p className="text-sm">לT {'<'} T_c:</p>
        <BlockMath tex="\frac{N_0}{N} = 1 - \left(\frac{T}{T_c}\right)^{3/2}" />
      </div>
    ),
    interimQuestion: {
      prompt: 'בT=0, מה N₀/N? בT=T_c/2, מה N₀/N בקירוב?',
      hint: 'T=0: כולם בתחתית. T=T_c/2: 1-(1/2)^(3/2)',
      validate: s => (s.includes('1') && s.includes('0')) || s.includes('0.65') || s.includes('65%'),
      correctAnswer: 'T=0: N₀/N=1. T=T_c/2: N₀/N=1-(0.5)^1.5 ≈ 0.65',
    },
  },
]

export default function Node55({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>עיבוי BEC — שבר הקונדנסט</h3><BECPlot /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>BEC: μ→0, N₀/N = 1-(T/T_c)^(3/2)</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>BEC ניסויי</h3>
            <div className="space-y-2 text-xs">
              {[
                { sys: 'He-4 (נוזל)', tc: '2.17 K', note: 'סופרפלואידיות (λ-point)', color: '#a78bfa' },
                { sys: 'Rb-87 (גז, 1995)', tc: '170 nK', note: 'פרס נובל 2001', color: '#34d399' },
                { sys: 'Na-23 (גז)', tc: '2 μK', note: 'Ketterle, MIT', color: '#6B8DD6' },
              ].map(r => (
                <div key={r.sys} className="rounded-lg p-2" style={{ background: 'var(--accent-soft)', borderLeft: `3px solid ${r.color}` }}>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text)' }}>{r.sys}</span>
                    <span className="mono font-bold" style={{ color: r.color }}>{r.tc}</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)' }}>{r.note}</div>
                </div>
              ))}
            </div>
          </GlassCard>
          <TrapCard
            title="BEC = סופרפלואיד?"
            wrongFormula="\text{BEC} \Leftrightarrow \text{סופרפלואידיות}"
            rightFormula="\text{BEC: מעבר פאזה קוונטי. סופרפלואיד: תוצאה אבל לא זהה}"
            description="He-4: BEC+סופרפלואיד. גז אטומים קפואים: BEC אבל לא בהכרח סופרפלואיד מושלם. הקשר עמוק אך לא שוויון."
          />
        </div>
      }
    />
  )
}
