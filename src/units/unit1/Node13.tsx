/**
 * Node 1.3 — טמפרטורה ואנרגיה קינטית
 * Explore: היסטוגרם אנרגיה קינטית חי + "מד-חום" ויזואלי
 * Build:   T = (2/3)(ε̄/k_B) — גזירה מ-PV=NkT
 * Apply:   WhatIfExplorer — T משפיע על v_rms
 */
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import NodeLayout from '../../components/NodeLayout'
import ScaffoldedDerivation from '../../components/ScaffoldedDerivation'
import WhatIfExplorer from '../../components/WhatIfExplorer'
import TrapCard from '../../components/TrapCard'
import GlassCard from '../../components/GlassCard'
import { BlockMath, M } from '../../components/MathBlock'
import { UNITS } from '../../data/units'
import type { DerivationStep } from '../../types'

const meta = UNITS[0].nodes[2]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — סימולטור טמפרטורה
// ══════════════════════════════════════════════════════════════════════
function ThermometerSim() {
  const [T, setT] = useState(300)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef(0)
  const molsRef = useRef<{ x: number; y: number; vx: number; vy: number }[]>([])

  const W = 280, H = 160, N = 25, R = 4

  function resetMols(temp: number) {
    const spd = Math.sqrt(temp / 300) * 2.2
    molsRef.current = Array.from({ length: N }, () => {
      const a = Math.random() * Math.PI * 2
      return { x: R + Math.random() * (W - 2 * R), y: R + Math.random() * (H - 2 * R), vx: Math.cos(a) * spd, vy: Math.sin(a) * spd }
    })
  }

  useEffect(() => { resetMols(T) }, [])

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    function draw() {
      molsRef.current.forEach(m => {
        m.x += m.vx; m.y += m.vy
        if (m.x - R <= 0 || m.x + R >= W) m.vx *= -1
        if (m.y - R <= 0 || m.y + R >= H) m.vy *= -1
      })
      ctx.fillStyle = '#1a2035'; ctx.fillRect(0, 0, W, H)

      // color by temperature
      const r = Math.min(255, Math.round((T / 1000) * 255))
      const b = Math.max(0, 255 - Math.round((T / 500) * 255))
      molsRef.current.forEach(m => {
        const g2 = ctx.createRadialGradient(m.x - 1, m.y - 1, 0, m.x, m.y, R)
        g2.addColorStop(0, `rgba(${r + 100}, 200, ${b + 100}, 1)`)
        g2.addColorStop(1, `rgba(${r}, 100, ${b}, 0.8)`)
        ctx.fillStyle = g2
        ctx.beginPath(); ctx.arc(m.x, m.y, R, 0, Math.PI * 2); ctx.fill()
      })
      animRef.current = requestAnimationFrame(draw)
    }
    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [T])

  const vrms = Math.round(Math.sqrt(T / 300) * 480)
  const ke = Math.round((3 / 2) * 1.38e-23 * T * 1e23) / 100

  return (
    <div className="space-y-3">
      <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-xl border" style={{ borderColor: 'var(--border)' }} />

      {/* Thermometer visual */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>1000K</span>
          <div className="relative w-5 h-28 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <motion.div className="absolute bottom-0 w-full rounded-full"
              animate={{ height: `${(T / 1000) * 100}%`, background: `rgb(${Math.round(T / 4)},80,${200 - Math.round(T / 5)})` }}
              transition={{ duration: 0.4 }} />
          </div>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>0K</span>
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>טמפרטורה: {T} K</label>
            <input type="range" min={50} max={1000} value={T}
              onChange={e => { const v = Number(e.target.value); setT(v); resetMols(v) }}
              className="w-full mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg p-2 text-center" style={{ background: 'var(--accent-soft)' }}>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>v_rms</div>
              <div className="text-sm font-bold mono" style={{ color: 'var(--accent)' }}>{vrms} m/s</div>
            </div>
            <div className="rounded-lg p-2 text-center" style={{ background: 'var(--warn-soft)' }}>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>⟨ε⟩ (×10⁻²³ J)</div>
              <div className="text-sm font-bold mono" style={{ color: 'var(--warn)' }}>{ke}</div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        שים לב: הכפלת T → הכפלת ⟨ε⟩, אבל v_rms גדל רק ב-√2!
      </p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — חיבור PV=NkT לאנרגיה קינטית',
    content: (
      <div className="space-y-3">
        <p className="text-sm">מ-Node 1.2 ידענו: <M tex="P = \frac{Nm\langle v^2 \rangle}{3V}" /></p>
        <p className="text-sm">ומשוואת מצב גז אידיאלי: <M tex="PV = NkT" /></p>
        <p className="text-sm">נשווה:</p>
        <BlockMath tex="\frac{Nm\langle v^2 \rangle}{3} = NkT" />
      </div>
    ),
    interimQuestion: {
      prompt: 'אחרי הפשטה, מה יוצא? (בטא = 1/kT)',
      hint: 'm⟨v²⟩/3 = kT → m⟨v²⟩ = 3kT',
      validate: s => s.replace(/\s/g,'').includes('3kT') || s.replace(/\s/g,'').includes('3kt'),
      correctAnswer: 'm⟨v²⟩ = 3kT',
    },
  },
  {
    title: 'שלב 2 — הגדרת אנרגיה קינטית ממוצעת',
    content: (
      <div className="space-y-3">
        <p className="text-sm">אנרגיה קינטית של מולקולה: <M tex="\varepsilon = \frac{1}{2}mv^2" /></p>
        <p className="text-sm">לכן אנרגיה קינטית ממוצעת:</p>
        <BlockMath tex="\langle\varepsilon\rangle = \frac{1}{2}m\langle v^2\rangle" />
        <p className="text-sm">נציב: <M tex="\frac{1}{2}m\langle v^2\rangle = \frac{3}{2}kT" /></p>
      </div>
    ),
    interimQuestion: {
      prompt: 'מה האנרגיה הקינטית הממוצעת של מולקולה בטמפרטורה T?',
      hint: 'ε̄ = (3/2)kT — שלוש דרגות חופש',
      validate: s => s.replace(/\s/g,'').includes('3/2') || s.replace(/\s/g,'').includes('1.5'),
      correctAnswer: '⟨ε⟩ = (3/2)k_BT',
    },
  },
  {
    title: 'שלב 3 — מהירות RMS',
    content: (
      <div className="space-y-3">
        <p className="text-sm">מ-⟨ε⟩ = (3/2)kT, נפתח עבור <M tex="v_{rms}" />:</p>
        <BlockMath tex="v_{rms} = \sqrt{\langle v^2\rangle} = \sqrt{\frac{3kT}{m}}" />
        <p className="text-sm leading-relaxed">
          עבור חנקן (N₂, <M tex="m = 28\text{ u}" />) ב-T=300K:
        </p>
        <BlockMath tex="v_{rms} \approx 517 \text{ m/s}" />
      </div>
    ),
    interimQuestion: {
      prompt: 'אם T מוכפל ב-4, v_rms מוכפל פי כמה?',
      hint: 'v_rms ∝ √T',
      validate: s => s.trim() === '2',
      correctAnswer: '2 (כי √4 = 2)',
    },
  },
]

// ══════════════════════════════════════════════════════════════════════
// APPLY
// ══════════════════════════════════════════════════════════════════════
function ApplySection() {
  return (
    <div className="space-y-4">
      <WhatIfExplorer
        title="מהירות RMS לעומת טמפרטורה"
        description="כיצד טמפרטורה משפיעה על v_rms?"
        params={[{ key: 'T', label: 'טמפרטורה T (K)', symbol: 'T', unit: 'K', min: 100, max: 1000, step: 10, defaultValue: 300, criticalPoints: [{ value: 0, label: 'T→0: v_rms→0' }] }]}
        renderFormula={v => `v_{rms} = \\sqrt{\\frac{3k_BT}{m}} = ${Math.round(Math.sqrt(v.T / 300) * 517)} \\text{ m/s (N}_2\\text{)}`}
        questions={[
          { prompt: 'מה קורה ל-v_rms כש-T → 0?', answer: (_v) => 'v_rms → 0. מולקולות עצרות — אפס מוחלט. (בפועל — מכניקת קוונטים משנה את התמונה)' },
          { prompt: 'האם "הגז מתחמם" ו"האנרגיה גדלה" הם אותו דבר?', answer: (_v) => 'כן — T הוא מדד ישיר ל-⟨ε⟩ = (3/2)kT. לא ניתן להפריד ביניהם בגז אידיאלי.' },
        ]}
      />
      <TrapCard
        title="בלבול בין ⟨v²⟩ ו-⟨v⟩²"
        wrongFormula="v_{rms} = \langle v \rangle"
        rightFormula="v_{rms} = \sqrt{\langle v^2 \rangle} \neq \langle v \rangle"
        description="v_rms הוא שורש ממוצע ריבועי — שונה מהמהירות הממוצעת. יחסית: v_mp < v̄ < v_rms"
      />
    </div>
  )
}

export default function Node13({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>טמפרטורה כמדד אנרגיה קינטית</h3><ThermometerSim /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>כיצד T קשור מתמטית לאנרגיה קינטית?</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={<ApplySection />}
    />
  )
}
