/**
 * Node 1.4 — חוק חלוקת האנרגיה השווה (Equipartition)
 * Explore: מולקולה דו-אטומית — אנימציה של מוד תנועה (תרגום/סיבוב/ויברציה)
 * Build:   (1/2)kT לכל דרגת חופש
 * Apply:   Cv לגזים שונים
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

const meta = UNITS[0].nodes[3]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — ויזואליזציה של דרגות חופש
// ══════════════════════════════════════════════════════════════════════
type MolType = 'mono' | 'di' | 'poly'

function DOFViz() {
  const [type, setType] = useState<MolType>('mono')
  const [T, setT] = useState(300)

  const configs: Record<MolType, { label: string; dof: number; modes: { name: string; color: string; active: boolean }[] }> = {
    mono: {
      label: 'חד-אטומי (He, Ar)',
      dof: 3,
      modes: [
        { name: 'תנועה ב-x', color: '#6B8DD6', active: true },
        { name: 'תנועה ב-y', color: '#5EEAD4', active: true },
        { name: 'תנועה ב-z', color: '#FDE68A', active: true },
      ],
    },
    di: {
      label: 'דו-אטומי (N₂, O₂) בT נמוך',
      dof: 5,
      modes: [
        { name: 'תנועה ב-x', color: '#6B8DD6', active: true },
        { name: 'תנועה ב-y', color: '#5EEAD4', active: true },
        { name: 'תנועה ב-z', color: '#FDE68A', active: true },
        { name: 'סיבוב סביב ציר 1', color: '#f472b6', active: true },
        { name: 'סיבוב סביב ציר 2', color: '#fb923c', active: true },
      ],
    },
    poly: {
      label: 'רב-אטומי (CO₂, H₂O)',
      dof: 6,
      modes: [
        { name: 'תנועה ב-x', color: '#6B8DD6', active: true },
        { name: 'תנועה ב-y', color: '#5EEAD4', active: true },
        { name: 'תנועה ב-z', color: '#FDE68A', active: true },
        { name: 'סיבוב 1', color: '#f472b6', active: true },
        { name: 'סיבוב 2', color: '#fb923c', active: true },
        { name: 'סיבוב 3', color: '#a78bfa', active: true },
      ],
    },
  }

  const cfg = configs[type]
  const E_avg = (cfg.dof / 2) * 1.38e-23 * T
  const Cv = (cfg.dof / 2) * 8.314  // J/(mol·K)

  return (
    <div className="space-y-4">
      {/* Molecule type selector */}
      <div className="flex gap-2">
        {(['mono', 'di', 'poly'] as MolType[]).map(t => (
          <button key={t} onClick={() => setType(t)}
            className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: type === t ? 'var(--accent)' : 'var(--accent-soft)', color: type === t ? '#fff' : 'var(--accent)' }}>
            {t === 'mono' ? 'חד-אטומי' : t === 'di' ? 'דו-אטומי' : 'רב-אטומי'}
          </button>
        ))}
      </div>

      {/* SVG molecule visualization */}
      <div className="flex justify-center">
        <svg width={200} height={100} viewBox="0 0 200 100">
          {type === 'mono' && (
            <>
              <circle cx={100} cy={50} r={22} fill="#6B8DD6" opacity={0.8} />
              {/* Translation arrows */}
              <motion.line x1={100} y1={50} x2={155} y2={50} stroke="#6B8DD6" strokeWidth={2}
                animate={{ x2: [155, 160, 155] }} transition={{ repeat: Infinity, duration: 1 }} />
              <motion.line x1={100} y1={50} x2={100} y2={5} stroke="#5EEAD4" strokeWidth={2}
                animate={{ y2: [5, 2, 5] }} transition={{ repeat: Infinity, duration: 1.2 }} />
              <text x={160} y={54} fill="#6B8DD6" fontSize={10}>x</text>
              <text x={104} y={8} fill="#5EEAD4" fontSize={10}>y</text>
            </>
          )}
          {type === 'di' && (
            <>
              <motion.circle cx={75} cy={50} r={16} fill="#6B8DD6" opacity={0.8}
                animate={{ cx: [75, 73, 75] }} transition={{ repeat: Infinity, duration: 0.8 }} />
              <motion.circle cx={125} cy={50} r={16} fill="#5EEAD4" opacity={0.8}
                animate={{ cx: [125, 127, 125] }} transition={{ repeat: Infinity, duration: 0.8 }} />
              <line x1={91} y1={50} x2={109} y2={50} stroke="#aaa" strokeWidth={3} />
              {/* Rotation arc */}
              <motion.path d="M 70 30 Q 100 15 130 30" fill="none" stroke="#f472b6" strokeWidth={1.5} strokeDasharray="4,3"
                animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />
              <text x={90} y={13} fill="#f472b6" fontSize={9}>סיבוב</text>
            </>
          )}
          {type === 'poly' && (
            <>
              <circle cx={100} cy={50} r={14} fill="#FDE68A" opacity={0.9} />
              <motion.circle cx={60} cy={40} r={12} fill="#6B8DD6" opacity={0.8}
                animate={{ cx: [60, 58, 60], cy: [40, 38, 40] }} transition={{ repeat: Infinity, duration: 0.9 }} />
              <motion.circle cx={140} cy={40} r={12} fill="#5EEAD4" opacity={0.8}
                animate={{ cx: [140, 142, 140], cy: [40, 38, 40] }} transition={{ repeat: Infinity, duration: 0.9 }} />
              <motion.circle cx={100} cy={80} r={11} fill="#f472b6" opacity={0.8}
                animate={{ cy: [80, 82, 80] }} transition={{ repeat: Infinity, duration: 1.1 }} />
              <line x1={72} y1={44} x2={86} y2={48} stroke="#aaa" strokeWidth={2} />
              <line x1={114} y1={48} x2={128} y2={44} stroke="#aaa" strokeWidth={2} />
              <line x1={100} y1={64} x2={100} y2={69} stroke="#aaa" strokeWidth={2} />
            </>
          )}
        </svg>
      </div>

      {/* DOF bars */}
      <div className="space-y-1.5">
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text)' }}>{cfg.label} — {cfg.dof} דרגות חופש</div>
        <AnimatePresence>
          {cfg.modes.map((mode, i) => (
            <motion.div key={`${type}-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: mode.color }} />
              <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <motion.div className="h-full rounded-full" style={{ background: mode.color }}
                  animate={{ width: `${Math.min(100, 30 + (T / 20))}%` }} transition={{ duration: 0.4 }} />
              </div>
              <span className="text-[10px] w-24 text-left" style={{ color: 'var(--text-muted)' }}>{mode.name}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* T slider */}
      <div>
        <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>T = {T} K</label>
        <input type="range" min={100} max={1000} value={T} onChange={e => setT(Number(e.target.value))} className="w-full mt-1" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <GlassCard padding="sm" className="text-center">
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>⟨E⟩ למולקולה</div>
          <div className="text-xs font-bold mono" style={{ color: 'var(--accent)' }}>{(E_avg * 1e21).toFixed(2)} ×10⁻²¹ J</div>
        </GlassCard>
        <GlassCard padding="sm" className="text-center">
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Cv (J/mol·K)</div>
          <div className="text-xs font-bold mono" style={{ color: 'var(--warn)' }}>{Cv.toFixed(1)}</div>
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
    title: 'שלב 1 — האמירה של Equipartition',
    content: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed">
          בשיווי משקל תרמי, כל דרגת חופש (כל איבר ריבועי בהמילטוניאן) מקבלת בממוצע אנרגיה:
        </p>
        <BlockMath tex="\langle \varepsilon_i \rangle = \frac{1}{2}k_BT" />
        <p className="text-sm">לגז מונואטומי עם 3 דרגות חופש תרגום:</p>
        <BlockMath tex="\langle \varepsilon \rangle = 3 \cdot \frac{1}{2}k_BT = \frac{3}{2}k_BT" />
      </div>
    ),
    interimQuestion: {
      prompt: 'לגז דו-אטומי עם 5 דרגות חופש, מה ⟨ε⟩?',
      hint: '5 דרגות × (1/2)k_BT',
      validate: s => s.replace(/\s/g, '').includes('5/2') || s.replace(/\s/g, '').includes('2.5'),
      correctAnswer: '(5/2)k_BT',
    },
  },
  {
    title: 'שלב 2 — קיבול חום במולה',
    content: (
      <div className="space-y-3">
        <p className="text-sm">אנרגיה פנימית של מול גז: <M tex="U = N_A \cdot f \cdot \frac{1}{2}k_BT = \frac{f}{2}RT" /></p>
        <p className="text-sm">קיבול חום בנפח קבוע:</p>
        <BlockMath tex="C_V = \frac{\partial U}{\partial T}\bigg|_V = \frac{f}{2}R" />
        <div className="rounded-lg p-2 text-xs space-y-1" style={{ background: 'var(--accent-soft)' }}>
          <div>חד-אטומי (f=3): <M tex="C_V = \frac{3}{2}R \approx 12.5" /> J/mol·K</div>
          <div>דו-אטומי (f=5): <M tex="C_V = \frac{5}{2}R \approx 20.8" /> J/mol·K</div>
          <div>רב-אטומי (f=6): <M tex="C_V = 3R \approx 24.9" /> J/mol·K</div>
        </div>
      </div>
    ),
    interimQuestion: {
      prompt: 'מה היחס Cp/Cv (γ) לגז חד-אטומי?',
      hint: 'Cp = Cv + R, ולכן γ = (f/2+1)/(f/2)',
      validate: s => s.trim() === '5/3' || s.trim() === '1.67' || s.trim() === '1.666',
      correctAnswer: 'γ = 5/3 ≈ 1.67',
    },
  },
]

// ══════════════════════════════════════════════════════════════════════
// APPLY
// ══════════════════════════════════════════════════════════════════════
const cvTable = [
  { gas: 'He (חד-אטומי)', f: 3, cv: 12.5, measured: 12.5 },
  { gas: 'N₂ (דו-אטומי)', f: 5, cv: 20.8, measured: 20.8 },
  { gas: 'CO₂ (ליני)', f: 5, cv: 20.8, measured: 28.5 },
  { gas: 'H₂O (זוויתי)', f: 6, cv: 24.9, measured: 27.8 },
]

function ApplySection() {
  return (
    <div className="space-y-4">
      <GlassCard padding="md">
        <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>השוואה: תיאוריה מול מדידה</h3>
        <div className="space-y-2">
          {cvTable.map((row, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="w-24" style={{ color: 'var(--text)' }}>{row.gas}</span>
              <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <div className="h-full rounded-full" style={{ width: `${(row.cv / 30) * 100}%`, background: 'var(--accent)', opacity: 0.6 }} />
              </div>
              <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <div className="h-full rounded-full" style={{ width: `${(row.measured / 30) * 100}%`, background: 'var(--warn)' }} />
              </div>
              <span className="w-10 text-right font-mono" style={{ color: row.cv !== row.measured ? 'var(--danger)' : 'var(--success)' }}>
                {row.measured !== row.cv ? '≠' : '✓'}
              </span>
            </div>
          ))}
          <div className="flex gap-4 text-[10px] mt-1">
            <span className="flex items-center gap-1"><div className="w-3 h-2 rounded" style={{ background: 'var(--accent)' }} />תיאוריה</span>
            <span className="flex items-center gap-1"><div className="w-3 h-2 rounded" style={{ background: 'var(--warn)' }} />מדידה</span>
          </div>
        </div>
        <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          CO₂ גבוה מהצפוי — גם ויברציות מתחילות להיות פעילות בטמפרטורת חדר!
        </p>
      </GlassCard>
      <TrapCard
        title="ויברציות תמיד פעילות?"
        wrongFormula="f_{total} = 3+2+2 = 7 \text{ לדו-אטומי בכל T}"
        rightFormula="f_{eff}(T) \text{ — ויברציות פעילות רק מעל } T_{vib} \approx 1000K"
        description={'באנרגיה נמוכה, הויברציות "קפואות" — עקרון אי-הוודאות של מכניקת קוונטים. זו כשל הפיזיקה הקלאסית!'}
      />
    </div>
  )
}

export default function Node14({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>דרגות חופש — מה מתנועע?</h3><DOFViz /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>חוק חלוקה שווה: כל דרגת חופש מקבלת (1/2)kT</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={<ApplySection />}
    />
  )
}
