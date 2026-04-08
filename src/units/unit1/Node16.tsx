/**
 * Node 1.6 — מהלך חופשי ממוצע ותופעות מעבר
 * Explore: אנימציית מהלך אקראי של מולקולה עם התנגשויות — λ משתנה עם n
 * Build:   λ = 1/(√2 · n · σ) , σ = πd²
 * Apply:   תופעות מעבר — ויסקוזיות, מוליכות חום, דיפוזיה
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

const meta = UNITS[0].nodes[5]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — מהלך אקראי עם התנגשויות
// ══════════════════════════════════════════════════════════════════════
function RandomWalkSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const [density, setDensity] = useState(5)
  const [meanFree, setMeanFree] = useState(0)

  const W = 280, H = 200

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!

    // Static background molecules
    const bgMols = Array.from({ length: density * 4 }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: 6,
    }))

    // Tracer molecule state
    let tx = W / 2, ty = H / 2
    let angle = Math.random() * Math.PI * 2
    let speed = 3
    let pathPoints: { x: number; y: number }[] = [{ x: tx, y: ty }]
    let collisions = 0
    let totalDist = 0
    let segDist = 0

    function step() {
      const dx = Math.cos(angle) * speed
      const dy = Math.sin(angle) * speed
      const nx = tx + dx, ny = ty + dy

      // Boundary wrap
      tx = (nx + W) % W
      ty = (ny + H) % H
      segDist += speed

      pathPoints.push({ x: tx, y: ty })
      if (pathPoints.length > 200) pathPoints.shift()

      // Check collision with any background molecule
      let hit = false
      for (const m of bgMols) {
        const dist = Math.hypot(tx - m.x, ty - m.y)
        if (dist < 12) { hit = true; break }
      }

      if (hit) {
        collisions++
        totalDist += segDist
        if (collisions > 1) setMeanFree(Math.round(totalDist / collisions))
        segDist = 0
        angle = Math.random() * Math.PI * 2
      }

      // Draw
      ctx.fillStyle = '#111827'; ctx.fillRect(0, 0, W, H)

      // Background molecules
      bgMols.forEach(m => {
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(107,141,214,0.3)'; ctx.fill()
        ctx.strokeStyle = 'rgba(107,141,214,0.5)'; ctx.lineWidth = 1; ctx.stroke()
        // Collision radius ring
        ctx.beginPath(); ctx.arc(m.x, m.y, 12, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(107,141,214,0.12)'; ctx.lineWidth = 1; ctx.stroke()
      })

      // Path trail
      if (pathPoints.length > 1) {
        ctx.beginPath()
        ctx.moveTo(pathPoints[0].x, pathPoints[0].y)
        for (let i = 1; i < pathPoints.length; i++) {
          const p = pathPoints[i], prev = pathPoints[i - 1]
          if (Math.hypot(p.x - prev.x, p.y - prev.y) < 20) ctx.lineTo(p.x, p.y)
          else ctx.moveTo(p.x, p.y)
        }
        ctx.strokeStyle = 'rgba(94,234,212,0.6)'; ctx.lineWidth = 1.5; ctx.stroke()
      }

      // Tracer molecule
      const g = ctx.createRadialGradient(tx - 2, ty - 2, 0, tx, ty, 7)
      g.addColorStop(0, '#FDE68A'); g.addColorStop(1, '#f59e0b')
      ctx.beginPath(); ctx.arc(tx, ty, 7, 0, Math.PI * 2)
      ctx.fillStyle = g; ctx.fill()

      frameRef.current = requestAnimationFrame(step)
    }
    frameRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameRef.current)
  }, [density])

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} width={W} height={H}
        className="w-full rounded-xl border" style={{ borderColor: 'var(--border)' }} />

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
            צפיפות n = {density} (יח' שרירותיות)
          </label>
          <input type="range" min={2} max={12} value={density}
            onChange={e => setDensity(Number(e.target.value))} className="w-full mt-1" />
        </div>
        <GlassCard padding="sm" className="text-center flex-shrink-0">
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>λ מדוד</div>
          <div className="text-base font-bold mono" style={{ color: 'var(--warn)' }}>{meanFree || '...'}</div>
        </GlassCard>
      </div>

      {/* λ vs n chart */}
      <div className="rounded-lg p-3" style={{ background: 'var(--accent-soft)' }}>
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text)' }}>λ ∝ 1/n</div>
        <div className="flex items-end gap-1 h-10">
          {[2, 4, 6, 8, 10, 12].map(d => (
            <div key={d} className="flex-1 rounded-t transition-all duration-300"
              style={{ height: `${(1 / d) * 80}px`, background: d === density ? 'var(--accent)' : 'var(--border)' }} />
          ))}
        </div>
        <div className="flex gap-1 mt-1">
          {[2, 4, 6, 8, 10, 12].map(d => (
            <div key={d} className="flex-1 text-center text-[9px]" style={{ color: 'var(--text-muted)' }}>{d}</div>
          ))}
        </div>
      </div>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        מולקולה צהובה: מסלול סה"כ. ניתן לראות שככל שn גדל — מרחק בין התנגשויות קטן.
      </p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — שטח חתך ואזור ההתנגשות',
    content: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed">
          מולקולה עם קוטר <M tex="d" /> תתנגש עם מולקולה שוכנת אם מרכזה בתוך גליל רדיוס <M tex="d" />:
        </p>
        <BlockMath tex="\sigma = \pi d^2 \quad \text{(שטח חתך יעיל)}" />
        <p className="text-sm">אם המולקולה נעה עם <M tex="v_{rel}" /> יחסית לכל השאר, נפח הגליל לשנייה הוא <M tex="\sigma v_{rel}" /></p>
      </div>
    ),
    interimQuestion: {
      prompt: 'מה הרדיוס של הגליל הזה? האם הוא d, d/2, או 2d?',
      hint: 'שתי מולקולות נוגעות כש-מרכז למרכז = d, ולא d/2',
      validate: s => s.trim() === 'd' || s.trim().includes('d'),
      correctAnswer: 'רדיוס = d (קוטר מולקולה אחת)',
    },
  },
  {
    title: 'שלב 2 — מהירות יחסית ותדירות התנגשויות',
    content: (
      <div className="space-y-3">
        <p className="text-sm">בגז שבו כולן נעות, המהירות היחסית:</p>
        <BlockMath tex="v_{rel} = \sqrt{2}\,\bar{v}" />
        <p className="text-sm">מספר ההתנגשויות לשנייה:</p>
        <BlockMath tex="Z = n\sigma v_{rel} = \sqrt{2}\,n\sigma\bar{v}" />
        <p className="text-sm">זמן בין התנגשויות: <M tex="\tau = 1/Z" /></p>
      </div>
    ),
    interimQuestion: {
      prompt: 'למה v_rel = √2 · v̄ ולא פשוט v̄?',
      hint: 'כשהמטרות גם נעות, ממוצע מהירות יחסית גדול מ-v̄',
      validate: s => s.includes('√2') || s.includes('sqrt') || s.includes('גם') || s.includes('נעות'),
      correctAnswer: 'כי גם המולקולות האחרות נעות — ממוצע המהירות היחסית = √2 · v̄',
    },
  },
  {
    title: 'שלב 3 — המהלך החופשי הממוצע',
    content: (
      <div className="space-y-3">
        <BlockMath tex="\lambda = \bar{v}\,\tau = \frac{\bar{v}}{Z} = \frac{1}{\sqrt{2}\,n\sigma} = \frac{1}{\sqrt{2}\,n\pi d^2}" />
        <div className="rounded-lg p-2 text-xs space-y-1" style={{ background: 'var(--accent-soft)' }}>
          <div>ב-STP (n = 2.7×10²⁵ m⁻³, d = 3×10⁻¹⁰ m):</div>
          <div style={{ color: 'var(--accent)' }}>λ ≈ 70 nm — קטן פי 200 מ-1 μm אבל גדול פי 200 מ-d!</div>
        </div>
        <p className="text-sm">תלות מפתיעה: <M tex="\lambda \propto \frac{1}{n}" /> — לא תלוי ב-T!</p>
      </div>
    ),
    interimQuestion: {
      prompt: 'אם נחמם את הגז (T עולה) בנפח קבוע, λ ישתנה?',
      hint: 'n = N/V קבוע בנפח קבוע, וגם d קבוע...',
      validate: s => s.includes('לא') || s.toLowerCase().includes('no') || s.includes('קבוע'),
      correctAnswer: 'לא! λ = 1/(√2·n·σ) — לא תלוי ב-T ישירות',
    },
  },
]

// ══════════════════════════════════════════════════════════════════════
// APPLY
// ══════════════════════════════════════════════════════════════════════
const PHENOMENA = [
  {
    name: 'ויסקוזיות', icon: '🌊',
    formula: '\\eta = \\tfrac{1}{3}\\rho\\bar{v}\\lambda',
    desc: 'העברת תנע בין שכבות גז. גדל עם T (בניגוד לנוזלים!)',
    trap: 'ויסקוזיות גז עולה עם T כי v̄ עולה, בשונה מנוזלים שבהם ויסקוזיות יורדת.',
  },
  {
    name: 'מוליכות חום', icon: '🌡️',
    formula: '\\kappa = \\tfrac{1}{3}\\rho c_v \\bar{v}\\lambda',
    desc: 'העברת חום. גם כאן: ∝ v̄·λ, לא תלוי ב-P!',
    trap: 'מוליכות חום של גז בלחצים נמוכים (λ גדול) אינה תלויה בלחץ — נראה מפתיע!',
  },
  {
    name: 'דיפוזיה', icon: '💨',
    formula: 'D = \\tfrac{1}{3}\\bar{v}\\lambda',
    desc: 'ריח מתפשט לפי √t — מהלך אקראי מצטבר.',
    trap: 'מולקולות מהירות אבל דיפוזיה איטית — הן מתנגשות מיד ומשנות כיוון!',
  },
]

function ApplySection() {
  const [active, setActive] = useState(0)
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {PHENOMENA.map((p, i) => (
          <button key={i} onClick={() => setActive(i)}
            className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
            style={{ background: active === i ? 'var(--accent)' : 'var(--accent-soft)', color: active === i ? '#fff' : 'var(--text)' }}>
            {p.icon} {p.name}
          </button>
        ))}
      </div>
      {(() => {
        const p = PHENOMENA[active]
        return (
          <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard padding="md" className="space-y-3">
              <BlockMath tex={p.formula} />
              <p className="text-sm" style={{ color: 'var(--text)' }}>{p.desc}</p>
              <div className="rounded-lg p-2 text-xs" style={{ background: 'var(--warn-soft)', color: 'var(--warn)' }}>
                💡 {p.trap}
              </div>
            </GlassCard>
          </motion.div>
        )
      })()}
      <TrapCard
        title="מהלך חופשי = מסלול ישר?"
        wrongFormula="\lambda \text{ = מרחק ישר ממקור}"
        rightFormula="\lambda = \bar{v}\tau \text{ — מסלול בין התנגשויות, לא מרחק נסיעה}"
        description="המולקולה נעה בקו ישר רק בין התנגשויות. המרחק הכולל עד שחוזרת לנקודת מוצא ∝ √N (מהלך אקראי)."
      />
    </div>
  )
}

export default function Node16({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={
        <div className="space-y-4">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>מהלך אקראי עם התנגשויות</h3>
            <RandomWalkSim />
          </GlassCard>
        </div>
      }
      build={
        <div className="space-y-4">
          <GlassCard padding="md">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              גזירת המהלך החופשי הממוצע λ
            </p>
          </GlassCard>
          <ScaffoldedDerivation steps={STEPS} />
        </div>
      }
      apply={<ApplySection />}
    />
  )
}
