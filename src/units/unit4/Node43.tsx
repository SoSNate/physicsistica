/**
 * Node 4.3 — גז אידיאלי מונואטומי ופרדוקס גיבס
 * Explore: ויזואליזציה של "הרחבת גז" — מובחן vs בלתי-מובחן, ΔS
 * Build:   N! לחלקיקים בלתי-מובחנים → S מקסטנסיבי
 * Apply:   החוק השלישי, אנטרופיית ערבוב
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

const meta = UNITS[3].nodes[2]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — פרדוקס גיבס ויזואלי
// ══════════════════════════════════════════════════════════════════════
function GibbsParadox() {
  const [mode, setMode] = useState<'distinct' | 'identical'>('distinct')
  const [expanded, setExpanded] = useState(false)

  const particles = ['🔴', '🔵', '🟡', '🟢', '🟠', '🟣']

  const leftParticles = particles.slice(0, 3)
  const rightParticles = mode === 'distinct' ? particles.slice(3, 6) : ['🔵', '🔵', '🔵']

  const deltaS = mode === 'distinct' ? '2Nk_B\\ln 2' : '0'

  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-2">
        {(['distinct', 'identical'] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setExpanded(false) }}
            className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: mode === m ? 'var(--accent)' : 'var(--accent-soft)', color: mode === m ? '#fff' : 'var(--accent)' }}>
            {m === 'distinct' ? 'גזים שונים (A+B)' : 'גז אחד (A+A)'}
          </button>
        ))}
      </div>

      {/* Box visualization */}
      <div className="rounded-xl p-4" style={{ background: '#111827' }}>
        <div className="flex items-center gap-2 justify-center">
          {/* Left box */}
          <div className="rounded-lg p-3 text-center min-w-20" style={{ border: '2px solid #6B8DD6', background: 'rgba(107,141,214,0.1)' }}>
            <div className="text-[10px] mb-1" style={{ color: '#6B8DD6' }}>צד שמאל</div>
            <div className="flex flex-wrap gap-1 justify-center">
              {leftParticles.map((p, i) => (
                <motion.span key={i} className="text-lg"
                  animate={expanded ? { x: [0, (i - 1) * 15] } : { x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}>
                  {p}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Separator / arrow */}
          <div className="flex flex-col items-center gap-1">
            <motion.div
              className="text-xl cursor-pointer"
              onClick={() => setExpanded(!expanded)}
              animate={{ rotate: expanded ? 90 : 0 }}
            >
              {expanded ? '⬛' : '▶'}
            </motion.div>
            <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{expanded ? 'מעורב' : 'לחץ'}</span>
          </div>

          {/* Right box */}
          <div className="rounded-lg p-3 text-center min-w-20" style={{ border: '2px solid #34d399', background: 'rgba(52,211,153,0.1)' }}>
            <div className="text-[10px] mb-1" style={{ color: '#34d399' }}>צד ימין</div>
            <div className="flex flex-wrap gap-1 justify-center">
              {rightParticles.map((p, i) => (
                <motion.span key={i} className="text-lg"
                  animate={expanded ? { x: [0, -(i - 1) * 15] } : { x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}>
                  {p}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ΔS result */}
      <AnimatePresence mode="wait">
        <motion.div key={`${mode}-${expanded}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <GlassCard padding="md" className="text-center">
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>שינוי אנטרופיה לאחר ערבוב</div>
            <BlockMath tex={`\\Delta S = ${deltaS}`} />
            {mode === 'identical' && (
              <div className="text-xs mt-1" style={{ color: 'var(--success)' }}>
                ✓ אין שינוי — חלקיקים זהים לא מייצרים אנטרופיה חדשה!
              </div>
            )}
            {mode === 'distinct' && (
              <div className="text-xs mt-1" style={{ color: 'var(--warn)' }}>
                ⚠ אנטרופיית ערבוב 2Nk_Bln2 — אי-הפיכה!
              </div>
            )}
          </GlassCard>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — Z_N ללא גורם N!',
    content: (
      <div className="space-y-3">
        <p className="text-sm">גז N חלקיקים בלתי-תלויים, אם הם מובחנים:</p>
        <BlockMath tex="Z_N^{(classic)} = Z_1^N" />
        <p className="text-sm">אנטרופיה: <M tex="S = Nk_B\ln V + \ldots" /> — לא אקסטנסיבי!</p>
        <p className="text-sm">פרדוקס: הכפלת V ו-N → S גדל יותר מפי 2. זו בעיה פיזיקלית.</p>
      </div>
    ),
    interimQuestion: {
      prompt: 'מה הבעיה עם S לא-אקסטנסיבי?',
      hint: 'S של שתי מערכות זהות צריך לשווה 2S, לא יותר',
      validate: s => s.includes('ערבוב') || s.includes('לא') || s.includes('כפל') || s.includes('זה') || true,
      correctAnswer: 'ΔS>0 בערבוב גז עם עצמו — פרדוקס פיזיקלי',
    },
  },
  {
    title: 'שלב 2 — תיקון גיבס: N!',
    content: (
      <div className="space-y-3">
        <p className="text-sm">חלקיקים בלתי-מובחנים — הפרמוטציות ביניהם לא יוצרות מיקרו-מצבים שונים:</p>
        <BlockMath tex="Z_N = \frac{Z_1^N}{N!}" />
        <p className="text-sm">עם סטרלינג: <M tex="\ln(N!) \approx N\ln N - N" /></p>
        <BlockMath tex="F = -Nk_BT\left[\ln\frac{V}{N}\left(\frac{2\pi mk_BT}{h^2}\right)^{3/2} + \frac{5}{2}\right]" />
        <p className="text-sm">עכשיו S אקסטנסיבי (מכפיל N)!</p>
      </div>
    ),
    interimQuestion: {
      prompt: 'מדוע מחלקים ב-N! ולא ב-2N!?',
      hint: 'N! = מספר הפרמוטציות של N חלקיקים זהים',
      validate: s => s.includes('N!') || s.includes('פרמוט') || s.includes('חלקיקים'),
      correctAnswer: 'כי N! הוא מספר הפרמוטציות של N חלקיקים — כל סדר מחדש הוא "אותו" מיקרו-מצב',
    },
  },
  {
    title: 'שלב 3 — משוואת סאקור-טטרוד',
    content: (
      <div className="space-y-3">
        <p className="text-sm">אנטרופיה של גז אידיאלי מונואטומי:</p>
        <BlockMath tex="S = Nk_B\left[\ln\frac{V}{N} + \frac{3}{2}\ln T + \text{const}\right]" />
        <p className="text-sm">מאפיינים: S ∝ N (אקסטנסיבי), S → -∞ בT → 0 (בניגוד לחוק השלישי — מכניקת קוונטים מתקנת).</p>
        <BlockMath tex="S(2N,2V,T) = 2S(N,V,T) \checkmark" />
      </div>
    ),
    interimQuestion: {
      prompt: 'אם נכפיל N,V ב-2 (T קבוע), S ישתנה פי כמה לפי סאקור-טטרוד?',
      hint: 'S ∝ N·ln(V/N) — V/N קבוע!',
      validate: s => s.trim() === '2' || s.includes('פי 2') || s.includes('מוכפל ב2'),
      correctAnswer: 'פי 2 — אקסטנסיביות!',
    },
  },
]

export default function Node43({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>פרדוקס גיבס — מובחן vs זהה</h3><GibbsParadox /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>תיקון N! ומשוואת סאקור-טטרוד</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>אנטרופיית ערבוב</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              ערבוב N מולקולות A עם N מולקולות B (גזים שונים):
            </p>
            <BlockMath tex="\Delta S_{mix} = -2Nk_B\!\left(x_A\ln x_A + x_B\ln x_B\right)" />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              עבור x_A=x_B=½: ΔS = 2Nk_B ln2 {'>'} 0 — בלתי-הפיכה!
            </p>
          </GlassCard>
          <TrapCard
            title="הערבוב של גז עם עצמו"
            wrongFormula="\\Delta S = 2Nk_B\\ln 2 \\text{ תמיד}"
            rightFormula="\\Delta S = 0 \\text{ לגז עם עצמו (חלקיקים זהים)}"
            description="רק חלקיקים שונים מייצרים אנטרופיית ערבוב. גז A+A — לא ניתן להבחין 'לפני' ו'אחרי' — ΔS=0."
          />
        </div>
      }
    />
  )
}
