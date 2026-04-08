/**
 * Node 4.4 — דרגות חופש פנימיות בגז דו-אטומי
 * Explore: Cv vs T — שלב הפעלה קלאסי/קוונטי עם אנימציה
 * Build:   Z = Z_trans · Z_rot · Z_vib, קיפאון קוונטי
 * Apply:   H₂ מול N₂ מול CO₂
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

const meta = UNITS[3].nodes[3]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — Cv vs T plot
// ══════════════════════════════════════════════════════════════════════
const R = 8.314

function cvDiatomic(T: number, thetaR: number, thetaV: number): number {
  // cv / R
  const trans = 3 / 2
  // Rotational: active above theta_R (~85K for H2, ~2.9K for N2)
  const rot = T > thetaR * 3 ? 1.0 : T > thetaR ? 0.5 : 0
  // Vibrational: active above theta_V (~6300K for H2, ~3350K for N2)
  const betaOmega = thetaV / T
  const vib = betaOmega > 0.1
    ? Math.pow(betaOmega, 2) * Math.exp(betaOmega) / Math.pow(Math.exp(betaOmega) - 1, 2)
    : 1
  return (trans + rot + vib) * R
}

// Molecule presets
const MOLECULES = [
  { name: 'H₂', thetaR: 85, thetaV: 6300, color: '#6B8DD6' },
  { name: 'N₂', thetaR: 2.9, thetaV: 3350, color: '#34d399' },
  { name: 'O₂', thetaR: 2.1, thetaV: 2260, color: '#f59e0b' },
]

function CvPlot() {
  const [mol, setMol] = useState(0)
  const [T, setT] = useState(300)

  const { thetaR, thetaV, color } = MOLECULES[mol]

  const W = 300, H = 180, PAD = 32
  const Tmax = 8000

  const pts = Array.from({ length: 100 }, (_, i) => {
    const t = 50 + (i / 99) * Tmax
    return { T: t, cv: cvDiatomic(t, thetaR, thetaV) / R }
  })

  const cvMax = 7 / 2  // translation + rot + vib

  function toX(t: number) { return PAD + (Math.log(t / 50) / Math.log(Tmax / 50)) * (W - PAD * 2) }
  function toY(cv: number) { return H - PAD - (cv / cvMax) * (H - PAD * 2) }

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.T).toFixed(1)} ${toY(p.cv).toFixed(1)}`).join(' ')

  const currentCv = cvDiatomic(T, thetaR, thetaV)

  return (
    <div className="space-y-3">
      {/* Molecule selector */}
      <div className="flex gap-2">
        {MOLECULES.map((m, i) => (
          <button key={i} onClick={() => setMol(i)}
            className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{ background: mol === i ? `${m.color}33` : 'var(--accent-soft)', border: `2px solid ${mol === i ? m.color : 'transparent'}`, color: m.color }}>
            {m.name}
          </button>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: '#111827' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          <line x1={PAD} y1={H - PAD} x2={W - 5} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <line x1={PAD} y1={5} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <text x={W / 2} y={H - 5} fill="rgba(255,255,255,0.4)" fontSize={8} textAnchor="middle">T (K, סולם לוג)</text>
          <text x={10} y={H / 2} fill="rgba(255,255,255,0.4)" fontSize={7} textAnchor="middle"
            transform={`rotate(-90,10,${H / 2})`}>Cv/R</text>

          {/* Horizontal lines for steps */}
          {[3 / 2, 5 / 2, 7 / 2].map(v => (
            <g key={v}>
              <line x1={PAD} y1={toY(v)} x2={W - 5} y2={toY(v)} stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="4,4" />
              <text x={W - 6} y={toY(v) - 2} fill="rgba(255,255,255,0.3)" fontSize={7} textAnchor="end">{v === 3/2 ? '3/2' : v === 5/2 ? '5/2' : '7/2'}</text>
            </g>
          ))}

          {/* T_R and T_V markers */}
          <line x1={toX(thetaR * 5)} y1={H - PAD} x2={toX(thetaR * 5)} y2={5} stroke={`${color}44`} strokeWidth={1} strokeDasharray="3,3" />
          <text x={toX(thetaR * 5) + 2} y={20} fill={`${color}88`} fontSize={7}>T_rot</text>
          <line x1={toX(thetaV)} y1={H - PAD} x2={toX(thetaV)} y2={5} stroke={`${color}44`} strokeWidth={1} strokeDasharray="3,3" />
          <text x={toX(thetaV) + 2} y={30} fill={`${color}88`} fontSize={7}>T_vib</text>

          {/* Cv curve */}
          <motion.path key={mol} d={pathD} fill="none" stroke={color} strokeWidth={2.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />

          {/* Current T marker */}
          <circle cx={toX(T)} cy={toY(currentCv / R)} r={5} fill="#FDE68A" />
          <text x={toX(T) + 7} y={toY(currentCv / R) - 3} fill="#FDE68A" fontSize={8}>
            {(currentCv / R).toFixed(2)} R
          </text>
        </svg>
      </div>

      <div>
        <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>T = {T} K</label>
        <input type="range" min={50} max={5000} step={50} value={T} onChange={e => setT(Number(e.target.value))} className="w-full mt-1" />
      </div>

      <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
        {[
          { label: 'תרגום', active: true, color: '#6B8DD6' },
          { label: 'סיבוב', active: T > thetaR * 3, color: '#34d399' },
          { label: 'ויברציה', active: T > thetaV * 0.3, color: '#f59e0b' },
        ].map(item => (
          <div key={item.label} className="rounded-lg p-1.5" style={{ background: item.active ? `${item.color}22` : 'var(--accent-soft)', border: `1px solid ${item.active ? item.color : 'transparent'}` }}>
            <div style={{ color: item.active ? item.color : 'var(--text-muted)' }}>{item.label}</div>
            <div style={{ color: 'var(--text-muted)' }}>{item.active ? '✓ פעיל' : '❄ קפוא'}</div>
          </div>
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
    title: 'שלב 1 — פרוקציית Z = Z_trans · Z_rot · Z_vib',
    content: (
      <div className="space-y-3">
        <p className="text-sm">תנועות שונות בלתי-תלויות → Z מכפלה:</p>
        <BlockMath tex="Z = Z_{trans}\cdot Z_{rot}\cdot Z_{vib}" />
        <BlockMath tex="\ln Z = \ln Z_{trans} + \ln Z_{rot} + \ln Z_{vib}" />
        <p className="text-sm">לכן <M tex="F, S, \langle E\rangle" /> מתפרקים לסכומים עצמאיים.</p>
      </div>
    ),
    interimQuestion: {
      prompt: 'מה תנאי ה-"בלתי-תלוי" כדי שZ יהיה מכפלה?',
      hint: 'ה-Hamiltonian הכולל = סכום, e^(-βH_total) = מכפלה',
      validate: s => s.includes('בלתי-תלוי') || s.includes('ה-H') || s.includes('מכפלה') || s.includes('סכום'),
      correctAnswer: 'H = H_trans + H_rot + H_vib (Hamiltonian סכום)',
    },
  },
  {
    title: 'שלב 2 — קיפאון קוונטי של סיבובים',
    content: (
      <div className="space-y-3">
        <p className="text-sm">רמות הסיבוב: <M tex="\varepsilon_l = \hbar^2 l(l+1)/2I, \; l=0,1,2,\ldots" /></p>
        <p className="text-sm">טמפרטורה אופיינית: <M tex="\Theta_R = \hbar^2/2Ik_B" /></p>
        <div className="rounded-lg p-2 text-xs space-y-1" style={{ background: 'var(--accent-soft)' }}>
          <div>H₂: Θ_R ≈ 85K — קיפאון בחדר!</div>
          <div>N₂: Θ_R ≈ 2.9K — פעיל בחדר</div>
          <div>ω₀(H₂) גדול כי I קטן (אטומים קלים)</div>
        </div>
      </div>
    ),
    interimQuestion: {
      prompt: 'למה לH₂ יש Θ_R גבוה יותר מN₂?',
      hint: 'Θ_R = ħ²/2Ik_B — I = μd², H₂ קל יותר ורחוק יותר יחסית',
      validate: s => s.includes('I') || s.includes('מסה') || s.includes('קל') || s.includes('מומנט'),
      correctAnswer: 'I(H₂) קטן יותר → Θ_R גדול יותר',
    },
  },
]

export default function Node44({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>Cv vs T — הפעלת דרגות חופש</h3><CvPlot /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>Z = Z_trans·Z_rot·Z_vib וקיפאון קוונטי</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>Θ_R ו-Θ_V לגזים שונים</h3>
            <div className="space-y-1.5 text-xs">
              {[
                { gas: 'H₂', tr: 85, tv: 6300, comment: 'קיפאון סיבוב בחדר!' },
                { gas: 'N₂', tr: 2.9, tv: 3350, comment: 'רוטציה פעילה, ויבר. קפואה' },
                { gas: 'O₂', tr: 2.1, tv: 2260, comment: 'דומה לN₂' },
                { gas: 'Cl₂', tr: 0.35, tv: 810, comment: 'שניהם כמעט פעילים בחדר' },
              ].map(r => (
                <div key={r.gas} className="flex items-center gap-2 rounded-lg p-1.5" style={{ background: 'var(--accent-soft)' }}>
                  <span className="font-bold w-8" style={{ color: 'var(--accent)' }}>{r.gas}</span>
                  <span style={{ color: 'var(--text-muted)' }}>Θ_R={r.tr}K, Θ_V={r.tv}K</span>
                  <span className="mr-auto text-[10px]" style={{ color: 'var(--warn)' }}>{r.comment}</span>
                </div>
              ))}
            </div>
          </GlassCard>
          <TrapCard
            title="Cv = (f/2)R בכל T?"
            wrongFormula="C_v = \\tfrac{5}{2}R \\text{ לדו-אטומי (תמיד)}"
            rightFormula="C_v(T) = \\tfrac{3}{2}R \\xrightarrow{T>\\Theta_R} \\tfrac{5}{2}R \\xrightarrow{T>\\Theta_V} \\tfrac{7}{2}R"
            description="Equipartition נכון רק בגבול הקלאסי T≫Θ. בטמפרטורות ביניים — Cv תלוי T ויש שלבי הפעלה!"
          />
        </div>
      }
    />
  )
}
