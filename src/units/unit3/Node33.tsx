/**
 * Node 3.3 — פוטנציאלים תרמודינמיים
 * Explore: ויזואליזציה גיאומטרית של התמרת לז'נדר — U→F→G→H
 * Build:   F=U-TS, H=U+PV, G=U-TS+PV
 * Apply:   ייעול — איזה פוטנציאל לכל תנאי שפה
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

const meta = UNITS[2].nodes[2]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — מפת הפוטנציאלים
// ══════════════════════════════════════════════════════════════════════
const POTENTIALS = [
  { id: 'U', name: 'U (אנרגיה פנימית)', vars: 'S, V', eq: 'dU = TdS - PdV', color: '#f59e0b', x: 140, y: 40 },
  { id: 'F', name: 'F = U − TS (אנרגיה חופשית)', vars: 'T, V', eq: 'dF = -SdT - PdV', color: '#6B8DD6', x: 60, y: 120 },
  { id: 'H', name: 'H = U + PV (אנטלפיה)', vars: 'S, P', eq: 'dH = TdS + VdP', color: '#34d399', x: 220, y: 120 },
  { id: 'G', name: 'G = U − TS + PV (גיבס)', vars: 'T, P', eq: 'dG = -SdT + VdP', color: '#f472b6', x: 140, y: 200 },
]

const TRANSFORMS = [
  { from: 'U', to: 'F', label: '−TS', desc: 'החלפת S ב-T' },
  { from: 'U', to: 'H', label: '+PV', desc: 'החלפת V ב-P' },
  { from: 'F', to: 'G', label: '+PV', desc: 'החלפת V ב-P' },
  { from: 'H', to: 'G', label: '−TS', desc: 'החלפת S ב-T' },
]

function PotentialMap() {
  const [active, setActive] = useState<string>('U')
  const pot = POTENTIALS.find(p => p.id === active)!

  const W = 300, H = 260

  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: '#111827' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Connection lines */}
          {TRANSFORMS.map((t, i) => {
            const from = POTENTIALS.find(p => p.id === t.from)!
            const to = POTENTIALS.find(p => p.id === t.to)!
            const mx = (from.x + to.x) / 2
            const my = (from.y + to.y) / 2
            return (
              <g key={i}>
                <line x1={from.x} y1={from.y + 12} x2={to.x} y2={to.y - 12}
                  stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                <rect x={mx - 18} y={my - 9} width={36} height={14} rx={4} fill="#1e293b" />
                <text x={mx} y={my + 2} fill="rgba(255,255,255,0.5)" fontSize={9} textAnchor="middle">{t.label}</text>
              </g>
            )
          })}

          {/* Potential nodes */}
          {POTENTIALS.map(p => (
            <g key={p.id} onClick={() => setActive(p.id)} style={{ cursor: 'pointer' }}>
              <circle cx={p.x} cy={p.y} r={active === p.id ? 22 : 18}
                fill={active === p.id ? `${p.color}33` : `${p.color}11`}
                stroke={p.color} strokeWidth={active === p.id ? 2.5 : 1.5} />
              <text x={p.x} y={p.y + 4} fill={p.color} fontSize={12} textAnchor="middle" fontWeight="bold">{p.id}</text>
            </g>
          ))}

          {/* Labels */}
          {POTENTIALS.map(p => (
            <text key={`lbl-${p.id}`} x={p.x} y={p.y + 36}
              fill="rgba(255,255,255,0.4)" fontSize={7} textAnchor="middle">{p.vars}</text>
          ))}
        </svg>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard padding="md">
            <div className="font-semibold text-sm mb-2" style={{ color: pot.color }}>{pot.name}</div>
            <BlockMath tex={pot.eq} />
            <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              משתנים טבעיים: {pot.vars}
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>לחץ על כל פוטנציאל לראות את המשוואה שלו</p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — מהי התמרת לז\'נדר?',
    content: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed">
          נתון פונקציה f(x). התמרת לז'נדר מחליפה x כמשתנה עצמאי ב-p=df/dx:
        </p>
        <BlockMath tex="g(p) = f(x) - p\cdot x \quad\text{כאשר } p = \frac{df}{dx}" />
        <p className="text-sm">בתרמודינמיקה: T=∂U/∂S, P=-∂U/∂V. לכן F=U-TS מחליף S ב-T.</p>
      </div>
    ),
    interimQuestion: {
      prompt: 'מדוע מחברים -TS ולא +TS ב-F = U - TS?',
      hint: 'F(T,V) — נגזרת ∂F/∂T = -S',
      validate: s => s.includes('-S') || s.includes('מינוס') || s.includes('שלילי') || s.includes('∂F'),
      correctAnswer: 'כי דרוש ∂F/∂T = -S — הסימן השלילי',
    },
  },
  {
    title: 'שלב 2 — ארבעת הפוטנציאלים',
    content: (
      <div className="space-y-2">
        {[
          { p: 'U(S,V)', eq: 'dU = T\\,dS - P\\,dV', use: 'מבודד (S,V קבועים)' },
          { p: 'F(T,V) = U-TS', eq: 'dF = -S\\,dT - P\\,dV', use: 'T,V קבועים (מיכל קשיח+תרמוסטט)' },
          { p: 'H(S,P) = U+PV', eq: 'dH = T\\,dS + V\\,dP', use: 'P קבוע, ללא חום (אדיאבטי)' },
          { p: 'G(T,P) = U-TS+PV', eq: 'dG = -S\\,dT + V\\,dP', use: 'T,P קבועים (תנאי מעבדה)' },
        ].map(row => (
          <div key={row.p} className="rounded-lg p-2" style={{ background: 'var(--accent-soft)' }}>
            <div className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>{row.p}</div>
            <BlockMath tex={row.eq} />
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>טבעי ל: {row.use}</div>
          </div>
        ))}
      </div>
    ),
    interimQuestion: {
      prompt: 'בתגובה כימית בלחץ ובטמפרטורה קבועים, איזה פוטנציאל מינימלי בשיווי-משקל?',
      hint: 'T קבוע + P קבוע ← ?',
      validate: s => s.trim().toUpperCase() === 'G' || s.includes('גיבס'),
      correctAnswer: 'G — אנרגיית גיבס',
    },
  },
  {
    title: 'שלב 3 — יחסי קוואזי-סטטיים',
    content: (
      <div className="space-y-3">
        <p className="text-sm">מ-dF = -SdT - PdV, נגזרות ישירות:</p>
        <BlockMath tex="S = -\!\left(\frac{\partial F}{\partial T}\right)_{\!V}, \quad P = -\!\left(\frac{\partial F}{\partial V}\right)_{\!T}" />
        <p className="text-sm">וגם אנרגיה חופשית מינימלית בשיווי-משקל:</p>
        <BlockMath tex="(dF)_{T,V} \leq 0" />
      </div>
    ),
    interimQuestion: {
      prompt: 'מה נגזרת G לפי T בלחץ קבוע? (ראה dG = -SdT + VdP)',
      hint: 'קרא ישירות מ-dG',
      validate: s => s.includes('-S') || s.includes('מינוס S') || s.includes('−S'),
      correctAnswer: '(∂G/∂T)_P = -S',
    },
  },
]

export default function Node33({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>מפת הפוטנציאלים התרמודינמיים</h3><PotentialMap /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>התמרת לז'נדר: מ-U(S,V) לF,H,G</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>איזה פוטנציאל לאיזה מצב?</h3>
            <div className="space-y-1.5 text-xs">
              {[
                { cond: 'S,V קבועים (מבודד)', pot: 'U minimal', color: '#f59e0b' },
                { cond: 'T,V קבועים (מיכל קשיח + תרמוסטט)', pot: 'F minimal', color: '#6B8DD6' },
                { cond: 'S,P קבועים (אדיאבטי + לחץ חיצוני)', pot: 'H minimal', color: '#34d399' },
                { cond: 'T,P קבועים (מעבדה רגילה)', pot: 'G minimal', color: '#f472b6' },
              ].map(r => (
                <div key={r.cond} className="flex items-center gap-2 rounded-lg p-2" style={{ background: 'var(--accent-soft)' }}>
                  <span className="flex-1" style={{ color: 'var(--text-muted)' }}>{r.cond}</span>
                  <span className="font-bold" style={{ color: r.color }}>{r.pot}</span>
                </div>
              ))}
            </div>
          </GlassCard>
          <TrapCard
            title="U מינימלי = שיווי-משקל תמיד?"
            wrongFormula="\min U \Leftrightarrow \text{שיווי-משקל}"
            rightFormula="\text{תלוי בתנאי שפה: } \min F \text{ אם T,V const}"
            description="U מינימלי נכון רק עבור S,V קבועים (מערכת מבודדת). בתנאים אחרים — פוטנציאל שונה מינימלי!"
          />
        </div>
      }
    />
  )
}
