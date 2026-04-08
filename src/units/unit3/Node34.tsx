/**
 * Node 3.4 — קשרי מקסוול
 * Explore: "קוביית" קשרי מקסוול אינטראקטיבית
 * Build:   גזירה מ-dF, dG
 * Apply:   שימוש בקשרי מקסוול לחישוב ∂S/∂P
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

const meta = UNITS[2].nodes[3]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — טבלת קשרי מקסוול
// ══════════════════════════════════════════════════════════════════════
const MAXWELL_RELATIONS = [
  {
    from: 'U', color: '#f59e0b',
    rel: '\\left(\\frac{\\partial T}{\\partial V}\\right)_S = -\\left(\\frac{\\partial P}{\\partial S}\\right)_V',
    derivation: 'מ-dU=TdS-PdV: ∂²U/∂V∂S = ∂²U/∂S∂V',
  },
  {
    from: 'F', color: '#6B8DD6',
    rel: '\\left(\\frac{\\partial S}{\\partial V}\\right)_T = \\left(\\frac{\\partial P}{\\partial T}\\right)_V',
    derivation: 'מ-dF=-SdT-PdV: ∂²F/∂V∂T = ∂²F/∂T∂V',
  },
  {
    from: 'H', color: '#34d399',
    rel: '\\left(\\frac{\\partial T}{\\partial P}\\right)_S = \\left(\\frac{\\partial V}{\\partial S}\\right)_P',
    derivation: 'מ-dH=TdS+VdP: ∂²H/∂P∂S = ∂²H/∂S∂P',
  },
  {
    from: 'G', color: '#f472b6',
    rel: '-\\left(\\frac{\\partial S}{\\partial P}\\right)_T = \\left(\\frac{\\partial V}{\\partial T}\\right)_P',
    derivation: 'מ-dG=-SdT+VdP: ∂²G/∂P∂T = ∂²G/∂T∂P',
  },
]

function MaxwellTable() {
  const [active, setActive] = useState(0)

  return (
    <div className="space-y-3">
      {/* Selector */}
      <div className="grid grid-cols-4 gap-1.5">
        {MAXWELL_RELATIONS.map((r, i) => (
          <button key={i} onClick={() => setActive(i)}
            className="py-2 rounded-lg text-sm font-bold transition-all"
            style={{
              background: active === i ? `${r.color}33` : 'var(--accent-soft)',
              border: `2px solid ${active === i ? r.color : 'transparent'}`,
              color: r.color,
            }}>
            {r.from}
          </button>
        ))}
      </div>

      {/* Active relation */}
      <motion.div key={active} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
        <GlassCard padding="md">
          <div className="text-xs font-semibold mb-2" style={{ color: MAXWELL_RELATIONS[active].color }}>
            קשר מקסוול מ-{MAXWELL_RELATIONS[active].from}:
          </div>
          <BlockMath tex={MAXWELL_RELATIONS[active].rel} />
          <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            {MAXWELL_RELATIONS[active].derivation}
          </div>
        </GlassCard>
      </motion.div>

      {/* Checkerboard visual */}
      <div className="rounded-xl p-3" style={{ background: 'var(--accent-soft)' }}>
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text)' }}>תזכיר — המשתנים הצמודים</div>
        <div className="grid grid-cols-4 gap-1 text-center text-xs">
          {[
            { v: 'T', p: 'S', c: '#f59e0b' }, { v: 'P', p: 'V', c: '#6B8DD6' },
            { v: 'μ', p: 'N', c: '#34d399' }, { v: 'H', p: '?', c: '#f472b6' },
          ].map(item => (
            <div key={item.v} className="rounded-lg p-1.5" style={{ border: `1px solid ${item.c}30` }}>
              <div style={{ color: item.c }}>{item.v}</div>
              <div style={{ color: 'var(--text-muted)' }}>↕</div>
              <div style={{ color: item.c }}>{item.p}</div>
            </div>
          ))}
        </div>
        <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>
          כל זוג צמוד (x,y): ∂²Φ/∂x∂y = ∂²Φ/∂y∂x
        </p>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — עקרון שוויון נגזרות מעורבות',
    content: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed">
          לפונקציה חלקה: <M tex="\frac{\partial^2 f}{\partial x \partial y} = \frac{\partial^2 f}{\partial y \partial x}" />
        </p>
        <p className="text-sm">עבור F(T,V): <M tex="dF = -SdT - PdV" /></p>
        <p className="text-sm">לכן: <M tex="\frac{\partial}{\partial V}\!\left(-S\right)_T = \frac{\partial}{\partial T}\!\left(-P\right)_V" /></p>
        <BlockMath tex="\boxed{\left(\frac{\partial S}{\partial V}\right)_T = \left(\frac{\partial P}{\partial T}\right)_V}" />
      </div>
    ),
    interimQuestion: {
      prompt: 'מדוע נגזרות מעורבות שוות? מה הנחה מתמטית זו?',
      hint: 'משפט קלאירו — לפונקציות חלקות מסדר שני',
      validate: s => s.includes('חלק') || s.includes('קלאירו') || s.includes('Clairaut') || s.includes('מעורב'),
      correctAnswer: 'פונקציה חלקה — משפט קלאירו',
    },
  },
  {
    title: 'שלב 2 — שימוש: (∂S/∂P)_T',
    content: (
      <div className="space-y-3">
        <p className="text-sm">מקשר G: <M tex="\left(\frac{\partial S}{\partial P}\right)_T = -\left(\frac{\partial V}{\partial T}\right)_P" /></p>
        <p className="text-sm">עבור גז אידיאלי, <M tex="V = nRT/P" />:</p>
        <BlockMath tex="\left(\frac{\partial V}{\partial T}\right)_P = \frac{nR}{P}" />
        <p className="text-sm">לכן: <M tex="\left(\frac{\partial S}{\partial P}\right)_T = -\frac{nR}{P}" /></p>
        <p className="text-sm">S <em>יורד</em> כשP עולה (בT קבוע) — הגיוני! לחץ מצמצם את מרחב הפאזות.</p>
      </div>
    ),
    interimQuestion: {
      prompt: 'עבור גז אידיאלי, כש-P מוכפל ב-2 (T קבוע), S משתנה ב-?',
      hint: 'ΔS = ∫(∂S/∂P)dP = -nR∫dP/P = -nR·ln(2)',
      validate: s => s.includes('nR·ln2') || s.includes('nRln2') || s.includes('-nR ln2') || s.includes('ln 2'),
      correctAnswer: 'ΔS = -nR·ln(2) < 0',
    },
  },
]

export default function Node34({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>ארבעת קשרי מקסוול</h3><MaxwellTable /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>גזירה מ-שוויון נגזרות מעורבות</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>למה קשרי מקסוול שימושיים?</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              קשה למדוד ∂S/∂P ישירות (אנטרופיה אינה מדידה), אבל קל למדוד ∂V/∂T (קצב התפשטות). קשרי מקסוול מחברים בין גדלים שניתן למדוד לגדלים שקשה.
            </p>
            <BlockMath tex="\underbrace{\left(\frac{\partial S}{\partial P}\right)_T}_{\text{קשה למדידה}} = -\underbrace{\left(\frac{\partial V}{\partial T}\right)_P}_{\text{קל למדידה}}" />
          </GlassCard>
          <TrapCard
            title="קשרי מקסוול = זהויות, לא משוואות תנועה"
            wrongFormula="\\text{קשרי מקסוול נכונים רק בשיווי-משקל}"
            rightFormula="\\text{הם זהויות מתמטיות — נכונים כל עוד } F,G \\text{ מוגדרים}"
            description="קשרי מקסוול הם תוצאה מתמטית טהורה ממשפט קלאירו. הם תקפים בכל מצב שבו הפוטנציאל התרמודינמי חלק."
          />
        </div>
      }
    />
  )
}
