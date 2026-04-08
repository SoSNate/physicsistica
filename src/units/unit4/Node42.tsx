/**
 * Node 4.2 — פונקציית החלוקה Z
 * Explore: "סולם Z" — כל גדל תרמודינמי כנגזרת של ln Z
 * Build:   Z = Σe^(-βε), ⟨E⟩=-∂lnZ/∂β, F=-kTlnZ
 * Apply:   Z לאוסצילטור הרמוני, Z לגז אידיאלי
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

const meta = UNITS[3].nodes[1]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — "עץ Z" — גדלים תרמודינמיים
// ══════════════════════════════════════════════════════════════════════
const QUANTITIES = [
  { name: 'F (אנרגיה חופשית)', formula: 'F = -k_BT\\ln Z', color: '#f59e0b', desc: 'הגדל המרכזי — כולם יוצאים ממנו' },
  { name: 'E (אנרגיה)', formula: '\\langle E\\rangle = -\\frac{\\partial\\ln Z}{\\partial\\beta}', color: '#6B8DD6', desc: 'נגזרת לפי β=1/kT' },
  { name: 'S (אנטרופיה)', formula: 'S = k_B\\ln Z + k_BT\\frac{\\partial\\ln Z}{\\partial T}', color: '#34d399', desc: 'כניסה מ-F=-kTlnZ' },
  { name: 'P (לחץ)', formula: 'P = k_BT\\frac{\\partial\\ln Z}{\\partial V}', color: '#f472b6', desc: 'נגזרת לפי V' },
  { name: 'Cv (קיבול חום)', formula: 'C_V = k_B\\beta^2\\frac{\\partial^2\\ln Z}{\\partial\\beta^2}', color: '#a78bfa', desc: 'שונות האנרגיה / kT²' },
]

function ZTree() {
  const [active, setActive] = useState(0)
  const W = 300, H = 200

  const leafAngles = [-80, -40, 0, 40, 80]

  return (
    <div className="space-y-3">
      {/* Tree SVG */}
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: '#111827' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Root: ln Z */}
          <circle cx={150} cy={60} r={22} fill="rgba(253,230,138,0.2)" stroke="#FDE68A" strokeWidth={2} />
          <text x={150} y={65} fill="#FDE68A" fontSize={11} textAnchor="middle" fontWeight="bold">ln Z</text>

          {/* Branches to leaves */}
          {QUANTITIES.map((q, i) => {
            const lx = 30 + i * 60
            const ly = 155
            return (
              <g key={i}>
                <line x1={150} y1={82} x2={lx} y2={ly - 18}
                  stroke={active === i ? q.color : 'rgba(255,255,255,0.1)'}
                  strokeWidth={active === i ? 2 : 1}
                />
                <circle cx={lx} cy={ly} r={16} fill={`${q.color}22`}
                  stroke={active === i ? q.color : `${q.color}44`}
                  strokeWidth={active === i ? 2 : 1}
                  onClick={() => setActive(i)} style={{ cursor: 'pointer' }} />
                <text x={lx} y={ly + 4} fill={q.color} fontSize={8} textAnchor="middle"
                  onClick={() => setActive(i)} style={{ cursor: 'pointer' }}>
                  {['F', 'E', 'S', 'P', 'Cv'][i]}
                </text>
              </g>
            )
          })}

          {/* Operator labels on branches */}
          <text x={105} y={115} fill="rgba(253,230,138,0.5)" fontSize={7}>−kT·</text>
          <text x={133} y={108} fill="rgba(107,141,214,0.5)" fontSize={7}>−∂/∂β</text>
          <text x={163} y={108} fill="rgba(52,211,153,0.5)" fontSize={7}>∂/∂T</text>
          <text x={192} y={115} fill="rgba(244,114,182,0.5)" fontSize={7}>∂/∂V</text>
        </svg>
      </div>

      {/* Active quantity detail */}
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard padding="md">
            <div className="font-semibold text-sm mb-2" style={{ color: QUANTITIES[active].color }}>
              {QUANTITIES[active].name}
            </div>
            <BlockMath tex={QUANTITIES[active].formula} />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{QUANTITIES[active].desc}</p>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>לחץ על עלה בעץ לפרטים</p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — F = -kT ln Z',
    content: (
      <div className="space-y-3">
        <p className="text-sm">מ-P(E_i) = e^(-βE_i)/Z, נחשב אנטרופיה:</p>
        <BlockMath tex="S = -k_B\sum_i P_i\ln P_i = k_B(\ln Z + \beta\langle E\rangle)" />
        <p className="text-sm">לכן <M tex="F = \langle E\rangle - TS = -k_BT\ln Z" />.</p>
        <p className="text-sm">כל גדל תרמודינמי = נגזרת של <M tex="\ln Z" />.</p>
      </div>
    ),
    interimQuestion: {
      prompt: 'אם Z גדל ב-10 (שאר דברים קבועים), F ישתנה כיצד?',
      hint: 'F = -kTlnZ → ΔF = -kT·ln(10)',
      validate: s => s.includes('יר') || s.includes('קטן') || s.includes('decrease') || s.includes('-kT'),
      correctAnswer: 'F יקטן — יותר מצבים = אנרגיה חופשית נמוכה יותר',
    },
  },
  {
    title: 'שלב 2 — Z לאוסצילטור הרמוני',
    content: (
      <div className="space-y-3">
        <p className="text-sm">רמות: <M tex="\varepsilon_n = \hbar\omega(n+\frac{1}{2}),\; n=0,1,2,\ldots" /></p>
        <BlockMath tex="Z = \sum_{n=0}^{\infty} e^{-\beta\hbar\omega(n+1/2)} = \frac{e^{-\beta\hbar\omega/2}}{1 - e^{-\beta\hbar\omega}}" />
        <p className="text-sm">סכום סדרה הנדסית אינסופית:</p>
        <BlockMath tex="\ln Z = -\frac{\beta\hbar\omega}{2} - \ln(1-e^{-\beta\hbar\omega})" />
      </div>
    ),
    interimQuestion: {
      prompt: 'בT→∞ (β→0), מה הקירוב של Z לאוסצילטור הרמוני?',
      hint: 'e^(-x)≈1-x לx קטן. Z ≈ kT/ħω',
      validate: s => s.includes('kT') || s.includes('1/β') || s.includes('קלאסי'),
      correctAnswer: 'Z ≈ k_BT/ħω — גבול קלאסי',
    },
  },
  {
    title: 'שלב 3 — אנרגיה ממוצעת',
    content: (
      <div className="space-y-3">
        <BlockMath tex="\langle E\rangle = -\frac{\partial\ln Z}{\partial\beta} = \frac{\hbar\omega}{2} + \frac{\hbar\omega}{e^{\beta\hbar\omega}-1}" />
        <p className="text-sm">שני גבולות:</p>
        <div className="text-xs space-y-1" style={{ background: 'var(--accent-soft)', borderRadius: 8, padding: 8 }}>
          <div>T→0: <M tex="\langle E\rangle \to \hbar\omega/2" /> (אנרגיית אפס)</div>
          <div>T→∞: <M tex="\langle E\rangle \to k_BT" /> (Equipartition: 2 דרגות חופש)</div>
        </div>
      </div>
    ),
    interimQuestion: {
      prompt: 'מה "אנרגיית האפס" ħω/2? קיים גם בT=0?',
      hint: 'נובע ממכניקת קוונטים — לא ניתן להוסיף אנרגיה זו',
      validate: s => s.includes('כן') || s.includes('קיים') || s.includes('קוונטי') || s.includes('קוונטום'),
      correctAnswer: 'כן — אנרגיה קוונטית שלא ניתן להסיר (עקרון אי-הוודאות)',
    },
  },
]

export default function Node42({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>עץ פונקציית החלוקה Z</h3><ZTree /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>F = -kT ln Z וכל הנגזרות</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>Z לסוגי מערכות</h3>
            <div className="space-y-2 text-xs">
              {[
                { sys: 'גז אידיאלי חד-אטומי', Z: 'Z_1 = V(2\\pi mk_BT/h^2)^{3/2}', note: 'נפח מרחב הפאזות' },
                { sys: 'דו-ספין', Z: 'Z = 2\\cosh(\\beta\\mu H)', note: 'פרה-מגנט' },
                { sys: 'N חלקיקים בלתי-תלויים', Z: 'Z_N = (Z_1)^N/N!', note: 'חלק ב-N! — גיבס!' },
              ].map(row => (
                <div key={row.sys} className="rounded-lg p-2" style={{ background: 'var(--accent-soft)' }}>
                  <div className="font-semibold" style={{ color: 'var(--accent)' }}>{row.sys}</div>
                  <BlockMath tex={row.Z} />
                  <div style={{ color: 'var(--text-muted)' }}>{row.note}</div>
                </div>
              ))}
            </div>
          </GlassCard>
          <TrapCard
            title="Z_N = (Z_1)^N ← מתי נכון?"
            wrongFormula="Z_N = Z_1^N \\text{ תמיד}"
            rightFormula="Z_N = Z_1^N/N! \\text{ לחלקיקים בלתי-מובחנים}"
            description="אם החלקיקים מובחנים (כמו ספינים על רשת) — Z_N=(Z_1)^N. לגז (חלקיקים מסתובבים) — חלק ב-N! למנוע כפילות."
          />
        </div>
      }
    />
  )
}
