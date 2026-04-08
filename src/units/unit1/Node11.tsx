/**
 * Node 1.1 — מודל הגז האידיאלי ומושג הלחץ
 * Explore: מולקולה בודדת נוגחת בדופן — אנימציה + הדגמת ΔP
 * Build:   הגדרת לחץ: P = F/A, כוח = שיעור שינוי תנע
 * Apply:   מה משפיע על לחץ — שאלות מחשבה
 */
import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import NodeLayout from '../../components/NodeLayout'
import ScaffoldedDerivation from '../../components/ScaffoldedDerivation'
import TrapCard from '../../components/TrapCard'
import GlassCard from '../../components/GlassCard'
import { BlockMath, M } from '../../components/MathBlock'
import { UNITS } from '../../data/units'
import type { DerivationStep } from '../../types'

const meta = UNITS[0].nodes[0]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — מולקולה בודדת נוגחת בדופן
// ══════════════════════════════════════════════════════════════════════
function SingleMolSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({ x: 60, y: 80, vx: 2.5, vy: 1.8, flash: 0 })
  const frameRef = useRef(0)
  const [impulse, setImpulse] = useState(0)
  const [hits, setHits] = useState(0)

  const W = 280, H = 180, R = 8

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let hitCount = 0

    function draw() {
      const s = stateRef.current
      s.x += s.vx
      s.y += s.vy

      let didHit = false
      if (s.x - R <= 0) { s.vx = Math.abs(s.vx); didHit = true; s.flash = 8 }
      if (s.x + R >= W) { s.vx = -Math.abs(s.vx); didHit = true; s.flash = 8 }
      if (s.y - R <= 0) { s.vy = Math.abs(s.vy) }
      if (s.y + R >= H) { s.vy = -Math.abs(s.vy) }

      if (didHit) {
        hitCount++
        setImpulse(Math.round(2 * Math.abs(s.vx) * 10))
        setHits(hitCount)
      }
      if (s.flash > 0) s.flash--

      // Background
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--card').trim() || '#1a2035'
      ctx.fillRect(0, 0, W, H)

      // Walls
      ctx.strokeStyle = s.flash > 0 && (s.x - R <= 0 || s.x + R >= W)
        ? `rgba(251,191,36,${s.flash / 8})`
        : 'rgba(99,130,200,0.4)'
      ctx.lineWidth = 3
      ctx.strokeRect(1.5, 1.5, W - 3, H - 3)

      // Velocity vector
      ctx.strokeStyle = 'rgba(94,234,212,0.5)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(s.x + s.vx * 10, s.y + s.vy * 10)
      ctx.stroke()

      // Molecule
      const grad = ctx.createRadialGradient(s.x - 2, s.y - 2, 1, s.x, s.y, R)
      grad.addColorStop(0, '#a5f3fc')
      grad.addColorStop(1, '#0891b2')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(s.x, s.y, R, 0, Math.PI * 2)
      ctx.fill()

      // Flash effect on wall
      if (s.flash > 0) {
        const wallX = s.x < W / 2 ? 0 : W
        const grad2 = ctx.createRadialGradient(wallX, s.y, 0, wallX, s.y, 40)
        grad2.addColorStop(0, `rgba(251,191,36,${s.flash / 16})`)
        grad2.addColorStop(1, 'transparent')
        ctx.fillStyle = grad2
        ctx.fillRect(0, 0, W, H)
      }

      frameRef.current = requestAnimationFrame(draw)
    }
    frameRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} width={W} height={H}
        className="w-full rounded-xl border" style={{ borderColor: 'var(--border)', maxWidth: W }} />
      <div className="grid grid-cols-2 gap-2">
        <GlassCard padding="sm" className="text-center">
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>שינוי תנע בהתנגשות</div>
          <div className="text-lg font-bold font-mono mt-0.5" style={{ color: 'var(--accent)' }}>
            Δp = {impulse}
          </div>
        </GlassCard>
        <GlassCard padding="sm" className="text-center">
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>מספר התנגשויות</div>
          <div className="text-lg font-bold font-mono mt-0.5" style={{ color: 'var(--teal)' }}>
            {hits}
          </div>
        </GlassCard>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        שים לב: בכל פגיעה בדופן האנכית, המולקולה מחזירה <M tex="\Delta p = 2mv_x" /> לדופן. הדבר יוצר כוח.
      </p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — מה זה לחץ מיקרוסקופית?',
    content: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed">
          לחץ מאקרוסקופי נובע מהכוח שמולקולות מפעילות על הדפנות. כוח = שיעור שינוי תנע:
        </p>
        <BlockMath tex="F = \frac{\Delta p}{\Delta t}" />
        <p className="text-sm">מולקולה עם מהירות <M tex="v_x" /> ומסה <M tex="m" /> נוגחת בדופן ומוחזרת:</p>
        <BlockMath tex="\Delta p = 2mv_x" />
      </div>
    ),
    interimQuestion: {
      prompt: 'אם מהירות המולקולה בכיוון x מוכפלת פי 2, שינוי התנע יגדל פי כמה?',
      hint: 'Δp = 2mv_x — תלות לינארית במהירות',
      validate: (s) => s.trim() === '2',
      correctAnswer: '2',
    },
  },
  {
    title: 'שלב 2 — תדירות ההתנגשויות',
    content: (
      <div className="space-y-3">
        <p className="text-sm">בקופסה באורך <M tex="L" />, המולקולה עוברת מסע הלוך ושוב:</p>
        <BlockMath tex="\Delta t = \frac{2L}{v_x}" />
        <p className="text-sm">הכוח הממוצע שמפעילה מולקולה אחת:</p>
        <BlockMath tex="F_1 = \frac{\Delta p}{\Delta t} = \frac{2mv_x}{2L/v_x} = \frac{mv_x^2}{L}" />
      </div>
    ),
    interimQuestion: {
      prompt: 'אם נגדיל את אורך הקופסה L פי 2, הכוח של מולקולה בודדת ישתנה פי כמה?',
      hint: 'F₁ = mv²ₓ/L — כוח הפוך ל-L',
      validate: (s) => s.trim() === '0.5' || s.trim() === '1/2',
      correctAnswer: '½ (יחצה)',
    },
  },
  {
    title: 'שלב 3 — מ-N מולקולות ללחץ',
    content: (
      <div className="space-y-3">
        <p className="text-sm">סכום הכוחות של כל N מולקולות, חלקי שטח הפנים A:</p>
        <BlockMath tex="P = \frac{F_{total}}{A} = \frac{m \sum v_{xi}^2}{LA}" />
        <p className="text-sm">הנפח <M tex="V = LA" />, וממוצע: <M tex="\langle v_x^2 \rangle = \frac{1}{N}\sum v_{xi}^2" /></p>
        <BlockMath tex="\boxed{P = \frac{Nm\langle v_x^2 \rangle}{V}}" />
      </div>
    ),
    interimQuestion: {
      prompt: 'אם נכפיל את מספר המולקולות N פי 3 (בנפח קבוע), מה יקרה ללחץ?',
      hint: 'P ∝ N/V — תלות לינארית',
      validate: (s) => s.trim() === '3' || s.toLowerCase().includes('3'),
      correctAnswer: 'יגדל פי 3',
    },
  },
  {
    title: 'שלב 4 — חוק בויל נובע ישירות',
    content: (
      <div className="space-y-3">
        <p className="text-sm">בטמפרטורה קבועה, אנרגיה קינטית ממוצעת קבועה, לכן:</p>
        <BlockMath tex="PV = Nm\langle v_x^2 \rangle = \text{const}" />
        <p className="text-sm leading-relaxed" style={{ color: 'var(--success)' }}>
          ✓ חוק בויל <M tex="PV = \text{const}" /> יוצא ישירות מהמודל הקינטי!
        </p>
        <BlockMath tex="PV = NkT \quad \Leftrightarrow \quad m\langle v_x^2\rangle = kT" />
      </div>
    ),
    interimQuestion: {
      prompt: 'בגז עם N מולקולות בנפח V בטמפרטורה T, מה שווה PV?',
      hint: 'זה המשוואת מצב של גז אידיאלי',
      validate: (s) => s.replace(/\s/g, '').toLowerCase().includes('nkt'),
      correctAnswer: 'PV = NkT',
    },
  },
]

// ══════════════════════════════════════════════════════════════════════
// APPLY
// ══════════════════════════════════════════════════════════════════════
const QUESTIONS = [
  {
    q: 'גז בקובייה. מה קורה ללחץ אם נקטין את הנפח לחצי (טמפרטורה קבועה)?',
    a: 'לפי PV = NkT ← P מוכפל ב-2. שטח הפנים קטן, מולקולות פוגעות יותר תכופות.',
  },
  {
    q: 'מה ההבדל בין גז אידיאלי לגז אמיתי?',
    a: 'גז אידיאלי: אין נפח מולקולות, אין כוחות בין-מולקולריים. בגז אמיתי — וואן דר-ואלס מתקן שניהם.',
  },
  {
    q: 'למה לחץ גז בכלי אטום עולה כשמחממים אותו?',
    a: 'T עולה → ⟨v²⟩ עולה → כל פגיעה בדופן חזקה יותר וגם תכופה יותר → P עולה.',
  },
]

function ApplySection() {
  const [revealed, setRevealed] = useState<boolean[]>(QUESTIONS.map(() => false))
  return (
    <div className="space-y-3">
      <GlassCard padding="md">
        <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>שאלות מחשבה</h3>
        <div className="space-y-3">
          {QUESTIONS.map((item, i) => (
            <div key={i} className="rounded-xl p-3 space-y-2" style={{ background: 'var(--accent-soft)', border: '1px solid var(--border)' }}>
              <p className="text-sm" style={{ color: 'var(--text)' }}>{item.q}</p>
              {revealed[i] ? (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs leading-relaxed" style={{ color: 'var(--success)' }}>
                  {item.a}
                </motion.p>
              ) : (
                <button onClick={() => setRevealed(r => r.map((v, j) => j === i ? true : v))}
                  className="text-xs px-3 py-1 rounded-lg" style={{ background: 'var(--accent)', color: '#fff' }}>
                  גלה תשובה
                </button>
              )}
            </div>
          ))}
        </div>
      </GlassCard>
      <TrapCard
        title="בלבול בין כוח ללחץ"
        wrongFormula="F \ \text{גדל} \Rightarrow P \text{ גדל תמיד}"
        rightFormula="P = F/A \text{ — חשוב גם שטח הפנים!}"
        description="לחץ הוא כוח ליחידת שטח. אם הכוח גדל אבל גם השטח גדל באותה מידה, הלחץ לא משתנה."
      />
    </div>
  )
}

export default function Node11({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout
      meta={meta}
      onBack={onBack}
      explore={
        <div className="space-y-4">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>מולקולה בודדת בקופסה</h3>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
              צפה כיצד מולקולה בודדת נוגחת בדפנות וצוברת תנע — הבסיס למושג הלחץ
            </p>
            <SingleMolSim />
          </GlassCard>
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>הנחות המודל</h3>
            <ul className="space-y-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              {['המולקולות נעות ישר ואקראית', 'התנגשויות עם הדפנות הן אלסטיות (ללא אובדן אנרגיה)', 'אין אינטראקציה בין מולקולות', 'נפח המולקולות זניח לעומת נפח הכלי'].map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span style={{ color: 'var(--accent)' }}>•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      }
      build={
        <div className="space-y-4">
          <GlassCard padding="md">
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              כיצד התנגשויות מיקרוסקופיות יוצרות לחץ מאקרוסקופי? עקוב אחרי הגזירה:
            </p>
          </GlassCard>
          <ScaffoldedDerivation steps={STEPS} />
        </div>
      }
      apply={<ApplySection />}
    />
  )
}
