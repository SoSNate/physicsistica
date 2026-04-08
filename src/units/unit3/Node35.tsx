/**
 * Node 3.5 — מעברי פאזה
 * Explore: דיאגרמת P-T אינטראקטיבית (מוצק/נוזל/גז) + קו הטמפרטורה
 * Build:   תנאי שיווי-משקל G₁=G₂
 * Apply:   נקודה משולשת, נקודה קריטית
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

const meta = UNITS[2].nodes[4]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — דיאגרמת P-T
// ══════════════════════════════════════════════════════════════════════
function PhaseDiagram() {
  const [cursor, setCursor] = useState({ x: 180, y: 110 })

  const W = 300, H = 200, PAD = 28

  // Approximate phase boundaries (in SVG coords)
  // Melting curve: steep line from triple to upper left
  // Vapor pressure: from triple to critical point
  const tripleX = 95, tripleY = 140
  const critX = 230, critY = 70

  function getPhase(x: number, y: number): string {
    // Simple heuristic based on position
    if (y < tripleY - 30 && x < tripleX + (tripleY - y) * 0.1) return 'solid'
    if (x < tripleX && y < tripleY) return 'solid'
    if (y < tripleY && x > tripleX + (tripleY - y) * 0.3 && x < critX) {
      const onCurve = tripleY - (x - tripleX) * (tripleY - critY) / (critX - tripleX)
      if (y < onCurve - 10) return 'liquid'
    }
    if (x > critX || (y < tripleY && x > critX - 30)) return 'supercritical'
    return 'gas'
  }

  const PHASE_COLORS: Record<string, string> = {
    solid: '#60a5fa',
    liquid: '#34d399',
    gas: '#FDE68A',
    supercritical: '#f472b6',
  }

  const phase = getPhase(cursor.x - PAD, cursor.y - PAD)

  const PHASE_LABELS: Record<string, string> = {
    solid: 'מוצק',
    liquid: 'נוזל',
    gas: 'גז',
    supercritical: 'על-קריטי',
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: '#111827' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}
          onMouseMove={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            setCursor({
              x: (e.clientX - rect.left) / rect.width * W,
              y: (e.clientY - rect.top) / rect.height * H,
            })
          }}>

          {/* Phase regions (colored) */}
          {/* Solid region */}
          <polygon points={`${PAD},${H - PAD} ${PAD},${PAD} ${tripleX + PAD - 20},${PAD} ${tripleX + PAD},${tripleY + PAD} `}
            fill="rgba(96,165,250,0.1)" />
          {/* Liquid region */}
          <polygon points={`${tripleX + PAD},${tripleY + PAD} ${tripleX + PAD - 20},${PAD} ${critX + PAD},${critY + PAD}`}
            fill="rgba(52,211,153,0.1)" />
          {/* Gas region */}
          <polygon points={`${tripleX + PAD},${tripleY + PAD} ${critX + PAD},${critY + PAD} ${W - PAD},${H - PAD} ${PAD},${H - PAD}`}
            fill="rgba(253,230,138,0.1)" />

          {/* Phase boundary lines */}
          {/* Melting curve */}
          <line x1={tripleX + PAD} y1={tripleY + PAD} x2={tripleX + PAD - 25} y2={PAD + 5}
            stroke="#60a5fa" strokeWidth={2} />
          {/* Sublimation curve */}
          <path d={`M ${PAD} ${H - PAD - 20} Q ${tripleX + PAD - 30} ${tripleY + PAD + 15} ${tripleX + PAD} ${tripleY + PAD}`}
            fill="none" stroke="#FDE68A" strokeWidth={2} />
          {/* Vapor pressure / boiling curve */}
          <path d={`M ${tripleX + PAD} ${tripleY + PAD} Q ${(tripleX + critX) / 2 + PAD} ${(tripleY + critY) / 2 + PAD - 20} ${critX + PAD} ${critY + PAD}`}
            fill="none" stroke="#34d399" strokeWidth={2} />

          {/* Triple point */}
          <circle cx={tripleX + PAD} cy={tripleY + PAD} r={5} fill="#fff" />
          <text x={tripleX + PAD - 12} y={tripleY + PAD + 16} fill="rgba(255,255,255,0.7)" fontSize={8}>נקודה משולשת</text>

          {/* Critical point */}
          <circle cx={critX + PAD} cy={critY + PAD} r={5} fill="#f472b6" />
          <text x={critX + PAD + 6} y={critY + PAD + 4} fill="#f472b6" fontSize={8}>קריטי</text>

          {/* Axes */}
          <line x1={PAD} y1={H - PAD} x2={W - 5} y2={H - PAD} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
          <line x1={PAD} y1={5} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
          <text x={W / 2} y={H - 5} fill="rgba(255,255,255,0.4)" fontSize={9} textAnchor="middle">T</text>
          <text x={10} y={H / 2} fill="rgba(255,255,255,0.4)" fontSize={9} textAnchor="middle" transform={`rotate(-90,10,${H/2})`}>P</text>

          {/* Phase labels */}
          <text x={PAD + 20} y={H / 2 - 10} fill="rgba(96,165,250,0.6)" fontSize={11} fontWeight="bold">מוצק</text>
          <text x={tripleX + PAD + 35} y={critY + PAD + 30} fill="rgba(52,211,153,0.6)" fontSize={11} fontWeight="bold">נוזל</text>
          <text x={tripleX + PAD + 50} y={tripleY + PAD + 40} fill="rgba(253,230,138,0.6)" fontSize={11} fontWeight="bold">גז</text>

          {/* Cursor */}
          <circle cx={cursor.x} cy={cursor.y} r={6} fill={PHASE_COLORS[phase]} opacity={0.8} />
          <text x={cursor.x + 10} y={cursor.y - 5} fill={PHASE_COLORS[phase]} fontSize={9}>
            {PHASE_LABELS[phase]}
          </text>
        </svg>
      </div>

      <div className="rounded-xl p-3 text-center" style={{ background: `${PHASE_COLORS[phase]}22`, border: `1px solid ${PHASE_COLORS[phase]}` }}>
        <span className="text-sm font-bold" style={{ color: PHASE_COLORS[phase] }}>
          פאזה נוכחית: {PHASE_LABELS[phase]}
        </span>
      </div>

      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        הזז את העכבר על הדיאגרמה לראות באיזו פאזה נמצאים
      </p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — תנאי שיווי-משקל בין פאזות',
    content: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed">
          בT,P קבועים — פאזה שיציבה = אנרגיית גיבס נמוכה יותר. בנקודת מעבר:
        </p>
        <BlockMath tex="G_1(T,P) = G_2(T,P)" />
        <p className="text-sm">שקול: <M tex="\mu_1 = \mu_2" /> (פוטנציאל כימי שווה)</p>
        <p className="text-sm">כשT,P משתנים קצת אבל נשארים על הקו:</p>
        <BlockMath tex="dG_1 = dG_2 \Rightarrow -S_1 dT + V_1 dP = -S_2 dT + V_2 dP" />
      </div>
    ),
    interimQuestion: {
      prompt: 'מה מבדיל בין שתי פאזות בנקודת המעבר? (G שוות, אבל...)',
      hint: 'S ו-V שונים — נגזרות ראשונות של G',
      validate: s => s.includes('S') || s.includes('V') || s.includes('אנטרופיה') || s.includes('נפח'),
      correctAnswer: 'S ו-V שונים — G שוות אבל נגזרותיהן שונות',
    },
  },
  {
    title: 'שלב 2 — מסגרת מעבר פאזה ראשון/שני',
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg p-2" style={{ background: 'var(--accent-soft)' }}>
            <div className="font-semibold" style={{ color: 'var(--accent)' }}>מסדר ראשון (רוב המעברים)</div>
            <div style={{ color: 'var(--text-muted)' }}>ΔS ≠ 0 (חום סמוי L = T·ΔS)</div>
            <div style={{ color: 'var(--text-muted)' }}>ΔV ≠ 0</div>
            <div style={{ color: 'var(--text-muted)' }}>דוגמה: קרח↔מים</div>
          </div>
          <div className="rounded-lg p-2" style={{ background: 'var(--warn-soft)' }}>
            <div className="font-semibold" style={{ color: 'var(--warn)' }}>מסדר שני (רציף)</div>
            <div style={{ color: 'var(--text-muted)' }}>ΔS = 0, ΔV = 0</div>
            <div style={{ color: 'var(--text-muted)' }}>Cv מתפצץ בT_c</div>
            <div style={{ color: 'var(--text-muted)' }}>דוגמה: פרומגנט</div>
          </div>
        </div>
      </div>
    ),
    interimQuestion: {
      prompt: 'מה "חום סמוי"? האם מים ב-100°C וקיטור ב-100°C בעלי אותה T?',
      hint: 'L = T·ΔS — אנרגיה הנדרשת לשינוי פאזה ב-T קבוע',
      validate: s => s.includes('כן') || s.includes('same') || s.includes('שווה') || s.includes('100'),
      correctAnswer: 'כן — T זהה! החום מוצא לשינוי מבנה (שבירת קשרים) ולא לחימום',
    },
  },
]

export default function Node35({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>דיאגרמת פאזות P-T</h3><PhaseDiagram /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>תנאי שיווי-משקל בין פאזות: G₁=G₂</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>נקודות מיוחדות בדיאגרמה</h3>
            <div className="space-y-2 text-xs">
              {[
                { name: 'נקודה משולשת', desc: 'שלוש פאזות בשיווי-משקל. עבור מים: T=273.16K, P=611Pa.' },
                { name: 'נקודה קריטית', desc: 'גבול קיום ה"נוזל". מעליה — רק "פלואיד על-קריטי". עבור מים: 647K, 218 atm.' },
                { name: 'קו היתוך', desc: 'בדרך-כלל שיפוע חיובי. מים: שיפוע שלילי! (ΔV<0 בהתמצקות).' },
              ].map(item => (
                <div key={item.name} className="rounded-lg p-2" style={{ background: 'var(--accent-soft)' }}>
                  <div className="font-semibold" style={{ color: 'var(--accent)' }}>{item.name}</div>
                  <div style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </GlassCard>
          <TrapCard
            title="מים: קרח צף על מים — חריג!"
            wrongFormula="\\Delta V_{solid\\to liquid} > 0 \\text{ (תמיד)}"
            rightFormula="\\Delta V_{ice\\to water} < 0 \\Rightarrow \\frac{dP}{dT} < 0"
            description="מים חריגים: קרח פחות צפוף ממים נוזלי. קו ההיתוך בדיאגרמת PT הוא בשיפוע שלילי — לחץ מוריד את טמפ' ההיתוך!"
          />
        </div>
      }
    />
  )
}
