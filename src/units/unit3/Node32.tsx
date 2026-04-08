/**
 * Node 3.2 — מנועי חום ומעגל קרנו
 * Explore: מעגל PV קרנו אנימטי — 4 שלבים עם צבעים ואנרגיות
 * Build:   η = 1 - T_C/T_H — גזירת נצילות קרנו
 * Apply:   עקרון קרנו, חוק שני
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NodeLayout from '../../components/NodeLayout'
import ScaffoldedDerivation from '../../components/ScaffoldedDerivation'
import TrapCard from '../../components/TrapCard'
import GlassCard from '../../components/GlassCard'
import { BlockMath, M } from '../../components/MathBlock'
import { UNITS } from '../../data/units'
import type { DerivationStep } from '../../types'

const meta = UNITS[2].nodes[1]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — מעגל קרנו אנימטי
// ══════════════════════════════════════════════════════════════════════
const STAGES = [
  { id: 0, name: '1→2 איזו-תרמי חם', color: '#f59e0b', desc: 'T_H קבוע, גז מתפשט, Q_H נספג', dQ: '+Q_H', dW: '-W₁₂' },
  { id: 1, name: '2→3 אדיאבטי', color: '#6B8DD6', desc: 'Q=0, גז מתפשט, T יורד מT_H לT_C', dQ: '0', dW: '-W₂₃' },
  { id: 2, name: '3→4 איזו-תרמי קר', color: '#60a5fa', desc: 'T_C קבוע, גז נדחס, Q_C מופלט', dQ: '-Q_C', dW: '+W₃₄' },
  { id: 3, name: '4→1 אדיאבטי', color: '#a78bfa', desc: 'Q=0, גז נדחס, T עולה מT_C לT_H', dQ: '0', dW: '+W₄₁' },
]

function CarnotDiagram({ TH, TC }: { TH: number; TC: number }) {
  const [step, setStep] = useState<number | null>(null)
  const W = 280, H = 180, PAD = 30

  // Rough Carnot cycle coordinates (log-scale P vs V)
  const pts = [
    { x: 60, y: 30 },   // 1: high P, low V (hot isotherm start)
    { x: 140, y: 60 },  // 2: lower P, higher V (hot isotherm end)
    { x: 220, y: 120 }, // 3: low P, high V (cold isotherm start)
    { x: 100, y: 130 }, // 4: medium P, lower V (cold isotherm end)
  ]

  const COLORS = ['#f59e0b', '#6B8DD6', '#60a5fa', '#a78bfa']

  function curvedPath(from: typeof pts[0], to: typeof pts[0], concave: boolean) {
    const mx = (from.x + to.x) / 2
    const my = (from.y + to.y) / 2 + (concave ? -20 : 20)
    return `M ${from.x + PAD} ${from.y + PAD} Q ${mx + PAD} ${my + PAD} ${to.x + PAD} ${to.y + PAD}`
  }

  const segments = [
    curvedPath(pts[0], pts[1], true),   // 1→2 hot isotherm
    curvedPath(pts[1], pts[2], false),  // 2→3 adiabat
    curvedPath(pts[2], pts[3], false),  // 3→4 cold isotherm
    curvedPath(pts[3], pts[0], true),   // 4→1 adiabat
  ]

  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: '#111827' }}>
        <svg width="100%" viewBox={`0 0 ${W + PAD} ${H + PAD}`}>
          {/* Axes */}
          <line x1={PAD} y1={H + PAD - 10} x2={W + PAD - 5} y2={H + PAD - 10} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <line x1={PAD} y1={5} x2={PAD} y2={H + PAD - 10} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <text x={W / 2 + PAD} y={H + PAD + 5} fill="rgba(255,255,255,0.4)" fontSize={8} textAnchor="middle">V</text>
          <text x={10} y={H / 2 + PAD} fill="rgba(255,255,255,0.4)" fontSize={8} textAnchor="middle" transform={`rotate(-90,10,${H/2+PAD})`}>P</text>

          {/* T_H and T_C isotherm labels */}
          <text x={W + PAD - 5} y={pts[0].y + PAD - 2} fill="#f59e0b" fontSize={8} textAnchor="end">T_H={TH}K</text>
          <text x={W + PAD - 5} y={pts[2].y + PAD + 10} fill="#60a5fa" fontSize={8} textAnchor="end">T_C={TC}K</text>

          {/* Cycle paths */}
          {segments.map((d, i) => (
            <motion.path key={i} d={d} fill="none"
              stroke={step === null || step === i ? COLORS[i] : 'rgba(255,255,255,0.1)'}
              strokeWidth={step === i ? 3 : 2}
              strokeDasharray={step !== null && step !== i ? '4,3' : ''}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            />
          ))}

          {/* Arrows in middle of each segment */}
          {pts.map((p, i) => {
            const next = pts[(i + 1) % 4]
            const mx = (p.x + next.x) / 2 + PAD
            const my = (p.y + next.y) / 2 + PAD
            return (
              <text key={i} x={mx} y={my} fill={COLORS[i]} fontSize={10} textAnchor="middle"
                opacity={step === null || step === i ? 1 : 0.2}>
                {i === 0 || i === 1 ? '→' : '←'}
              </text>
            )
          })}

          {/* Corner points */}
          {pts.map((p, i) => (
            <circle key={i} cx={p.x + PAD} cy={p.y + PAD} r={4} fill={COLORS[i]} />
          ))}

          {/* W net shading */}
          <text x={150 + PAD / 2} y={90 + PAD / 2} fill="rgba(255,255,255,0.2)" fontSize={9} textAnchor="middle">W_net</text>
        </svg>
      </div>

      {/* Stage selector */}
      <div className="grid grid-cols-2 gap-1.5">
        {STAGES.map((s, i) => (
          <button key={i}
            onClick={() => setStep(step === i ? null : i)}
            className="rounded-lg p-2 text-right transition-all"
            style={{ background: step === i ? `${s.color}33` : 'var(--accent-soft)', border: `1px solid ${step === i ? s.color : 'transparent'}` }}>
            <div className="text-[10px] font-semibold" style={{ color: s.color }}>{s.name}</div>
            <div className="text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.desc}</div>
          </button>
        ))}
      </div>

      {/* Efficiency */}
      <div className="rounded-xl p-3 text-center" style={{ background: 'var(--accent-soft)' }}>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>נצילות קרנו</div>
        <div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>
          η = {(1 - TC / TH) * 100 | 0}%
        </div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>= 1 - T_C/T_H = 1 - {TC}/{TH}</div>
      </div>
    </div>
  )
}

function CarnotExplore() {
  const [TH, setTH] = useState(600)
  const [TC, setTC] = useState(300)
  return (
    <div className="space-y-3">
      <CarnotDiagram TH={TH} TC={TC} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold" style={{ color: '#f59e0b' }}>T_H = {TH} K</label>
          <input type="range" min={400} max={1200} step={50} value={TH}
            onChange={e => setTH(Math.max(Number(e.target.value), TC + 50))} className="w-full mt-1" />
        </div>
        <div>
          <label className="text-xs font-semibold" style={{ color: '#60a5fa' }}>T_C = {TC} K</label>
          <input type="range" min={100} max={500} step={50} value={TC}
            onChange={e => setTC(Math.min(Number(e.target.value), TH - 50))} className="w-full mt-1" />
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — הגדרת נצילות',
    content: (
      <div className="space-y-3">
        <p className="text-sm">מנוע חום: סופג Q_H, מפלט Q_C, עושה עבודה W.</p>
        <BlockMath tex="\eta = \frac{W}{Q_H} = \frac{Q_H - Q_C}{Q_H} = 1 - \frac{Q_C}{Q_H}" />
        <p className="text-sm">האם ייתכן η=1? רק אם Q_C=0 — אבל זה סותר את החוק השני!</p>
      </div>
    ),
    interimQuestion: {
      prompt: 'מנוע סופג Q_H=1000J ומפלט Q_C=400J. מה W וη?',
      hint: 'W = Q_H - Q_C, η = W/Q_H',
      validate: s => s.includes('600') && (s.includes('60%') || s.includes('0.6')),
      correctAnswer: 'W=600J, η=60%',
    },
  },
  {
    title: 'שלב 2 — מעגל קרנו ואנטרופיה',
    content: (
      <div className="space-y-3">
        <p className="text-sm">במעגל הפיך, שינוי אנטרופיה מחזורי = 0:</p>
        <BlockMath tex="\oint \frac{\delta Q}{T} = 0 \Rightarrow \frac{Q_H}{T_H} = \frac{Q_C}{T_C}" />
        <p className="text-sm">לכן:</p>
        <BlockMath tex="\frac{Q_C}{Q_H} = \frac{T_C}{T_H} \Rightarrow \eta_{Carnot} = 1 - \frac{T_C}{T_H}" />
      </div>
    ),
    interimQuestion: {
      prompt: 'מנוע קרנו בין T_H=800K ל-T_C=400K. מה הנצילות?',
      hint: 'η = 1 - T_C/T_H = 1 - 400/800',
      validate: s => s.includes('50%') || s.trim() === '0.5' || s.includes('חצי'),
      correctAnswer: 'η = 50%',
    },
  },
  {
    title: 'שלב 3 — עקרון קרנו',
    content: (
      <div className="space-y-3">
        <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>עקרון קרנו:</p>
        <p className="text-sm">כל מנוע חום הפועל בין T_H ו-T_C בלתי-הפיך יהיה בעל נצילות <em>קטנה</em> מנצילות קרנו:</p>
        <BlockMath tex="\eta_{real} \leq \eta_{Carnot} = 1 - \frac{T_C}{T_H}" />
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          לכן: להגדיל T_H או להקטין T_C → נצילות גבוהה יותר. מנוע חום ביולוגי (שרירים) ≈ 25-40%.
        </p>
      </div>
    ),
    interimQuestion: {
      prompt: 'למה לא ניתן לבנות מנוע עם נצילות 100% בין שתי מאגרים חום?',
      hint: 'נדרש Q_C=0 → ΔS_universe = Q_H/T_H - 0 < 0',
      validate: s => s.includes('חוק שני') || s.includes('אנטרופיה') || s.includes('entropy') || s.includes('קר'),
      correctAnswer: 'כי היה סותר החוק השני: ΔS_universe ≥ 0 דורש Q_C > 0',
    },
  },
]

export default function Node32({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>מעגל קרנו — 4 שלבים</h3><CarnotExplore /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>גזירת נצילות קרנו מתנאי הפיכות</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>מנועים בעולם האמיתי</h3>
            <div className="space-y-1.5 text-xs">
              {[
                { name: 'מנוע קיטור (בנציה)', TH: 600, TC: 300, real: 35 },
                { name: 'תחנת כוח גז', TH: 1000, TC: 300, real: 45 },
                { name: 'תא דלק (Fuel cell)', TH: 0, TC: 0, real: 60, note: 'לא מנוע חום!' },
              ].map(row => (
                <div key={row.name} className="flex items-center gap-2 rounded-lg p-2" style={{ background: 'var(--accent-soft)' }}>
                  <span className="flex-1" style={{ color: 'var(--text)' }}>{row.name}</span>
                  {row.note ? (
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{row.note}</span>
                  ) : (
                    <>
                      <span style={{ color: 'var(--accent)' }}>קרנו: {Math.round((1 - row.TC / row.TH) * 100)}%</span>
                      <span style={{ color: 'var(--warn)' }}>אמיתי: {row.real}%</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
          <TrapCard
            title="קרנו = נצילות מקסימלית?"
            wrongFormula="\eta_{real} \text{ יכול להיות } > \eta_{Carnot}"
            rightFormula="\eta_{real} \leq \eta_{Carnot} = 1 - T_C/T_H"
            description="זה עקרון קרנו — מוכח מהחוק השני. לא ניתן לבנות מנוע יעיל יותר מקרנו בין אותן טמפרטורות."
          />
        </div>
      }
    />
  )
}
