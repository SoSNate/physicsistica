/**
 * Node 1.2 — משוואת המצב הקינטית
 * P = (1/3) n m v²
 *
 * Explore: סימולטור SVG של מולקולות בקופסה
 * Build:   ScaffoldedDerivation — 4 שלבים
 * Apply:   WhatIfExplorer + TrapCard
 */
import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import NodeLayout from '../../components/NodeLayout'
import ScaffoldedDerivation from '../../components/ScaffoldedDerivation'
import TrapCard from '../../components/TrapCard'
import WhatIfExplorer from '../../components/WhatIfExplorer'
import GlassCard from '../../components/GlassCard'
import { BlockMath, M } from '../../components/MathBlock'
import { UNITS } from '../../data/units'
import type { DerivationStep } from '../../types'

const meta = UNITS[0].nodes[1]  // Node 1.2

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — סימולטור מולקולות בקופסה
// ══════════════════════════════════════════════════════════════════════

const N_MOLECULES = 30
const BOX_W = 280
const BOX_H = 200
const R_MOL = 4

interface Molecule { x: number; y: number; vx: number; vy: number }

function initMolecules(speed: number): Molecule[] {
  return Array.from({ length: N_MOLECULES }, () => {
    const angle = Math.random() * Math.PI * 2
    return {
      x: R_MOL + Math.random() * (BOX_W - 2 * R_MOL),
      y: R_MOL + Math.random() * (BOX_H - 2 * R_MOL),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
    }
  })
}

function GasSim({ speed }: { speed: number }) {
  const molsRef   = useRef<Molecule[]>(initMolecules(speed))
  const frameRef  = useRef<number>(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pressureRef = useRef<number[]>([])
  const [pressure, setPressure] = useState(0)

  // Cache CSS vars — read once at mount and on theme change (class toggle on <html>)
  const colorsRef = useRef({ card: '#242938', accent: '#6B8DD6' })
  useEffect(() => {
    function readColors() {
      const s = getComputedStyle(document.documentElement)
      colorsRef.current = {
        card:   s.getPropertyValue('--card').trim()   || '#242938',
        accent: s.getPropertyValue('--accent').trim() || '#6B8DD6',
      }
    }
    readColors()
    const obs = new MutationObserver(readColors)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  // Re-init when speed changes (rescale velocities)
  useEffect(() => {
    molsRef.current = molsRef.current.map(m => {
      const norm = Math.sqrt(m.vx ** 2 + m.vy ** 2) || 1
      return { ...m, vx: (m.vx / norm) * speed, vy: (m.vy / norm) * speed }
    })
  }, [speed])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let impulseThisFrame = 0

    function tick() {
      // Read cached colors once per frame — zero layout recalculations
      const { card, accent } = colorsRef.current

      ctx.clearRect(0, 0, BOX_W, BOX_H)

      // Background
      ctx.fillStyle = card
      ctx.fillRect(0, 0, BOX_W, BOX_H)

      // Walls
      ctx.strokeStyle = accent
      ctx.lineWidth = 1.5
      ctx.strokeRect(1, 1, BOX_W - 2, BOX_H - 2)

      // Set molecule style once before the loop
      const fillColor  = accent + '99'
      ctx.lineWidth = 1

      molsRef.current = molsRef.current.map(m => {
        let { x, y, vx, vy } = m

        x += vx
        y += vy

        // Wall collisions — collect impulse on right wall (x ≈ BOX_W)
        if (x + R_MOL >= BOX_W) { vx = -Math.abs(vx); x = BOX_W - R_MOL; impulseThisFrame += 2 * Math.abs(vx) }
        if (x - R_MOL <= 0)     { vx =  Math.abs(vx); x = R_MOL }
        if (y + R_MOL >= BOX_H) { vy = -Math.abs(vy); y = BOX_H - R_MOL }
        if (y - R_MOL <= 0)     { vy =  Math.abs(vy); y = R_MOL }

        // Draw molecule — use pre-cached colors, no getComputedStyle inside loop
        ctx.beginPath()
        ctx.arc(x, y, R_MOL, 0, Math.PI * 2)
        ctx.fillStyle = fillColor
        ctx.fill()
        ctx.strokeStyle = accent
        ctx.stroke()

        return { x, y, vx, vy }
      })

      // Update pressure display every 30 frames
      pressureRef.current.push(impulseThisFrame)
      if (pressureRef.current.length > 30) pressureRef.current.shift()
      const avgImpulse = pressureRef.current.reduce((a, b) => a + b, 0) / pressureRef.current.length
      impulseThisFrame = 0

      // Normalize to 0–100 for display
      setPressure(Math.min(100, avgImpulse * 0.8))

      frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={BOX_W}
        height={BOX_H}
        className="rounded-xl w-full"
        style={{ border: '1px solid var(--border)', display: 'block' }}
      />
      <div className="flex items-center gap-3">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>לחץ בדופן:</span>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <motion.div
            className="h-full rounded-full"
            animate={{ width: `${pressure}%` }}
            transition={{ duration: 0.1 }}
            style={{ background: 'var(--accent)' }}
          />
        </div>
        <span className="text-xs font-bold mono" style={{ color: 'var(--accent)', direction: 'ltr' }}>
          {pressure.toFixed(0)}
        </span>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// EXPLORE phase
// ══════════════════════════════════════════════════════════════════════
function ExplorePhase() {
  const [speed, setSpeed] = useState(2)

  return (
    <div className="space-y-4">
      <GlassCard padding="md">
        <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text)' }}>
          מולקולות גז בקופסה
        </h3>
        <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
          לפניך סימולטור של גז אידיאלי. שנה את מהירות המולקולות וצפה כיצד הלחץ על הדופן משתנה.
          <br />
          לפני שממשיכים — <strong style={{ color: 'var(--accent)' }}>מה לדעתך קובע את הלחץ?</strong>
        </p>
        <GasSim speed={speed} />
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
            <span>מהירות מולקולות</span>
            <span className="mono" style={{ direction: 'ltr' }}>v = {speed.toFixed(1)} יח׳</span>
          </div>
          <input
            type="range" min={0.5} max={5} step={0.1} value={speed}
            onChange={e => setSpeed(parseFloat(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--teal) ${((speed - 0.5) / 4.5) * 100}%, var(--border) 0%)`,
              direction: 'ltr',
            }}
          />
        </div>
      </GlassCard>

      <GlassCard padding="md" style={{ background: 'var(--accent-soft)', border: '1px solid var(--border)' }}>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
          <strong>שים לב:</strong> כאשר מכפילים את המהירות, הלחץ עולה פי 4 (לא פי 2).
          זה כבר רמז לכך שהלחץ תלוי ב-<M tex="v^2" /> ולא ב-<M tex="v" />.
          <br />
          בשלב הבא נגזור את הנוסחה המדויקת.
        </p>
      </GlassCard>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD phase — ScaffoldedDerivation
// ══════════════════════════════════════════════════════════════════════
const DERIVATION_STEPS: DerivationStep[] = [
  {
    title: 'שלב 1: כוח ממולקולה בודדת על דופן ימין',
    content: (
      <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
        <p>
          נניח מולקולה בעלת מסה <M tex="m" /> הנעה בכיוון ה-<M tex="x" /> עם מהירות <M tex="v_x" />.
          היא פוגעת בדופן הימנית ומוחזרת (התנגשות אלסטית).
        </p>
        <p>שינוי התנע של המולקולה בהתנגשות:</p>
        <BlockMath tex="\Delta p_x = m v_x - m(-v_x) = 2m v_x" />
        <p>
          לפי חוק ניוטון השלישי, הדופן קיבלה תנע שווה ומנוגד: <M tex="\Delta p_{\text{דופן}} = 2mv_x" />.
        </p>
        <p>
          הזמן בין שתי התנגשויות עוקבות (הלוך ושוב במרחק <M tex="L" />):
        </p>
        <BlockMath tex="\Delta t = \frac{2L}{v_x}" />
        <p>הכוח הממוצע שמולקולה אחת מפעילה על הדופן:</p>
        <BlockMath tex="F_1 = \frac{\Delta p}{\Delta t} = \frac{2mv_x}{2L/v_x} = \frac{mv_x^2}{L}" />
      </div>
    ),
    interimQuestion: {
      prompt: 'אם מהירות המולקולה גדלה פי 2, הכוח על הדופן גדל פי כמה?',
      hint: 'שים לב לנוסחה F₁ = mv²ₓ/L — מה קורה כש-vₓ מוכפל ב-2?',
      validate: s => /^4$/.test(s.trim()),
      correctAnswer: '4 (כי F₁ ∝ vₓ²)',
    },
  },
  {
    title: 'שלב 2: סיכום על כל N המולקולות',
    content: (
      <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
        <p>
          יש <M tex="N" /> מולקולות בקופסה. הכוח הכולל על הדופן:
        </p>
        <BlockMath tex="F = \sum_{i=1}^{N} \frac{m v_{xi}^2}{L} = \frac{m}{L} \sum_{i=1}^{N} v_{xi}^2" />
        <p>
          מגדירים את <strong>ממוצע ריבוע המהירות ב-x</strong>:
        </p>
        <BlockMath tex="\overline{v_x^2} = \frac{1}{N} \sum_{i=1}^{N} v_{xi}^2" />
        <p>לכן:</p>
        <BlockMath tex="F = \frac{Nm\,\overline{v_x^2}}{L}" />
        <p>
          בגז אידיאלי אין כיוון מועדף, לכן בממוצע:{' '}
          <M tex="\overline{v_x^2} = \overline{v_y^2} = \overline{v_z^2}" />.
          מכיוון ש-<M tex="v^2 = v_x^2 + v_y^2 + v_z^2" />, נקבל:
        </p>
        <BlockMath tex="\overline{v_x^2} = \frac{1}{3}\,\overline{v^2}" />
      </div>
    ),
    interimQuestion: {
      prompt: 'מדוע בגז אידיאלי נכון ש- v̄²ₓ = v̄²/3 ולא v̄²ₓ = v̄²?',
      hint: 'הגז הוא איזוטרופי — כל הכיוונים שקולים. v² = v²ₓ + v²ᵧ + v²_z',
      validate: s => s.includes('3') || s.includes('כיוון') || s.includes('איזוטרופ') || s.includes('שקול'),
      correctAnswer: 'כי v² = v²ₓ + v²ᵧ + v²_z, ומכיוון שכל כיוון שקול, כל אחד תורם שליש.',
    },
  },
  {
    title: 'שלב 3: הגדרת לחץ והחלפה',
    content: (
      <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
        <p>
          לחץ = כוח לחלק לשטח. שטח הדופן: <M tex="A = L^2" />. נפח הקופסה: <M tex="V = L^3" />.
        </p>
        <BlockMath tex="P = \frac{F}{A} = \frac{Nm\,\overline{v_x^2}}{L \cdot L^2} = \frac{Nm\,\overline{v_x^2}}{V}" />
        <p>
          מציבים <M tex="\overline{v_x^2} = \tfrac{1}{3}\overline{v^2}" />:
        </p>
        <BlockMath tex="P = \frac{Nm}{3V}\,\overline{v^2}" />
        <p>
          נגדיר <strong>צפיפות מספר</strong> <M tex="n = N/V" /> (מולקולות למ"ק):
        </p>
        <BlockMath tex="\boxed{P = \frac{1}{3}\,n\,m\,\overline{v^2}}" />
      </div>
    ),
    interimQuestion: {
      prompt: 'מה ממד (units) של כל גורם בנוסחה P = ⅓ n m v̄²? האם הממדים מסתדרים ל-Pa?',
      hint: '[n] = m⁻³, [m] = kg, [v̄²] = m²/s². כפל את כולם יחד.',
      validate: s => s.includes('Pa') || s.includes('פסקל') || s.includes('N/m') || s.includes('kg') || s.includes('כן'),
      correctAnswer: 'n·m·v² = (1/m³)·kg·(m²/s²) = kg/(m·s²) = N/m² = Pa ✓',
    },
  },
  {
    title: 'שלב 4: קישור לאנרגיה קינטית ולמשוואת הגז האידיאלי',
    content: (
      <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
        <p>
          האנרגיה הקינטית הממוצעת של מולקולה: <M tex="\bar{\varepsilon} = \tfrac{1}{2}m\overline{v^2}" />.
        </p>
        <p>לכן:</p>
        <BlockMath tex="P = \frac{1}{3}n m\,\overline{v^2} = \frac{2}{3}n\bar{\varepsilon}" />
        <p>
          ממשוואת הגז האידיאלי <M tex="PV = Nk_BT" />, מקבלים <M tex="P = nk_BT" />.
          בהשוואה:
        </p>
        <BlockMath tex="\frac{2}{3}n\bar{\varepsilon} = nk_BT \quad \Rightarrow \quad \bar{\varepsilon} = \frac{3}{2}k_BT" />
        <p>
          <strong style={{ color: 'var(--teal)' }}>מסקנה עמוקה:</strong> הטמפרטורה היא בדיוק מדד לאנרגיה הקינטית הממוצעת.
          זה הקישור בין המיקרו למאקרו!
        </p>
      </div>
    ),
  },
]

function BuildPhase() {
  return (
    <div className="space-y-4">
      <GlassCard padding="sm" style={{ background: 'var(--accent-soft)' }}>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>
          <strong>מטרה:</strong> לגזור את הנוסחה <M tex="P = \tfrac{1}{3}nm\overline{v^2}" /> מעקרונות מכניים ראשוניים.
          כל שלב נפתח רק לאחר שתענה על שאלת-ביניים קצרה.
        </p>
      </GlassCard>
      <ScaffoldedDerivation steps={DERIVATION_STEPS} />
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// APPLY phase — WhatIf + TrapCard
// ══════════════════════════════════════════════════════════════════════
function ApplyPhase() {
  return (
    <div className="space-y-5">

      <WhatIfExplorer
        title="שנה פרמטרים — ראה איך הלחץ מגיב"
        description="הנוסחה P = ⅓nmv̄². שחק עם הפרמטרים וצפה כיצד הלחץ משתנה."
        params={[
          {
            key: 'n',
            label: 'צפיפות מספר',
            symbol: 'n',
            unit: 'יח׳',
            min: 0.5,
            max: 5,
            step: 0.1,
            defaultValue: 1,
          },
          {
            key: 'v2',
            label: 'ממוצע ריבוע המהירות',
            symbol: '\\overline{v^2}',
            unit: 'יח׳²',
            min: 1,
            max: 16,
            step: 0.5,
            defaultValue: 4,
            criticalPoints: [{ value: 9, label: '×2.25 לחץ' }],
          },
          {
            key: 'm',
            label: 'מסה מולקולרית',
            symbol: 'm',
            unit: 'יח׳',
            min: 0.5,
            max: 4,
            step: 0.1,
            defaultValue: 1,
          },
        ]}
        renderFormula={({ n, v2, m }) => {
          const P = (1 / 3) * n * m * v2
          return `P = \\frac{1}{3} \\cdot ${n.toFixed(1)} \\cdot ${m.toFixed(1)} \\cdot ${v2.toFixed(1)} = ${P.toFixed(2)} \\text{ יח׳}`
        }}
        questions={[
          {
            prompt: 'מה קורה ללחץ אם נכפיל את הטמפרטורה (כלומר נכפיל את v̄² פי 2)?',
            answer: ({ v2 }) => {
              const ratio = 2
              return `הלחץ גדל פי ${ratio} — כי P ∝ v̄². כפלנו את v̄² מ-${v2.toFixed(1)} ל-${(v2 * 2).toFixed(1)}, הלחץ הוכפל.`
            },
          },
          {
            prompt: 'מה קורה ללחץ אם נחצה את הנפח (כלומר נכפיל n פי 2)?',
            answer: () => 'הלחץ גדל פי 2 — זה בדיוק חוק בויל! P ∝ n = N/V, כלומר P ∝ 1/V.',
          },
          {
            prompt: 'האם גז הליום (מסה קטנה) ייצר לחץ שונה מגז קסנון (מסה גדולה) בטמפרטורה זהה?',
            answer: () =>
              'בטמפרטורה זהה, ε̄ = ³⁄₂k_BT קבוע — אך He מהיר יותר מ-Xe. הלחץ שווה כי P = ²⁄₃nε̄ תלוי רק בצפיפות ובטמפרטורה, לא במסה!',
          },
        ]}
      />

      <TrapCard
        title="בלבול בין v̄² לבין (v̄)²"
        description={
          <div className="space-y-2 text-sm" style={{ color: 'var(--text)' }}>
            <p>
              שגיאה נפוצה מאוד: לכתוב <M tex="P = \tfrac{1}{3}nm\bar{v}^2" /> במקום{' '}
              <M tex="P = \tfrac{1}{3}nm\overline{v^2}" />.
            </p>
            <p>
              <strong>ההבדל:</strong> <M tex="\overline{v^2}" /> הוא ממוצע ריבוע המהירויות.
              <M tex="\bar{v}^2 = (\overline{v})^2" /> הוא ריבוע הממוצע.
              לפי אי-שוויון ג׳נסן: <M tex="\overline{v^2} \geq (\bar{v})^2" />.
            </p>
            <p>
              בהתפלגות מקסוול: <M tex="\sqrt{\overline{v^2}} = v_{rms} \neq \bar{v}" />.
              ה-<M tex="v_{rms}" /> גדול יותר בכ-8%.
            </p>
          </div>
        }
        wrongFormula="P = \\frac{1}{3}nm\\bar{v}^2"
        rightFormula="P = \\frac{1}{3}nm\\overline{v^2}"
        examExample={
          <div className="text-xs space-y-1" style={{ color: 'var(--text)' }}>
            <p><strong>שאלת מבחן טיפוסית (האו"פ):</strong></p>
            <p>
              "גז אידיאלי בטמפרטורה T. בטא את הלחץ במונחי <M tex="k_B" />, <M tex="T" />,
              ו-<M tex="n" />. אילו כמויות פיזיקליות של מולקולה בודדת מופיעות?"
            </p>
            <p style={{ color: 'var(--success)' }}>
              <strong>תשובה נכונה:</strong> P = nk_BT. הלחץ תלוי ב-<M tex="\overline{v^2}" />
              דרך <M tex="\varepsilon = \tfrac{3}{2}k_BT" />.
            </p>
          </div>
        }
      />

    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// Main export
// ══════════════════════════════════════════════════════════════════════
export default function Node12({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout
      meta={meta}
      explore={<ExplorePhase />}
      build={<BuildPhase />}
      apply={<ApplyPhase />}
      onBack={onBack}
    />
  )
}
