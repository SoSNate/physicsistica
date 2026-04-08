/**
 * Node 2.1 — מיקרו-מצבים ומקרו-מצבים בפרה-מגנט
 * Explore: רשת ספינים — לחץ לעשות flip, ספירת מיקרו-מצבים
 * Build:   הגדרות מיקרו/מקרו-מצב, Ω(N,N↑)
 * Apply:   שאלות מחשבה
 */
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import NodeLayout from '../../components/NodeLayout'
import ScaffoldedDerivation from '../../components/ScaffoldedDerivation'
import TrapCard from '../../components/TrapCard'
import GlassCard from '../../components/GlassCard'
import { BlockMath, M } from '../../components/MathBlock'
import { UNITS } from '../../data/units'
import type { DerivationStep } from '../../types'

const meta = UNITS[1].nodes[0]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — רשת ספינים אינטראקטיבית
// ══════════════════════════════════════════════════════════════════════
const GRID_N = 16 // 4×4 grid

function factorial(n: number): number {
  if (n <= 1) return 1
  let r = 1; for (let i = 2; i <= n; i++) r *= i; return r
}

function omega(N: number, nUp: number): number {
  if (nUp < 0 || nUp > N) return 0
  return factorial(N) / (factorial(nUp) * factorial(N - nUp))
}

function SpinGrid() {
  const [spins, setSpins] = useState<boolean[]>(() =>
    Array.from({ length: GRID_N }, (_, i) => i < GRID_N / 2)
  )
  const [showMicro, setShowMicro] = useState(false)

  function toggleSpin(i: number) {
    setSpins(s => s.map((v, j) => j === i ? !v : v))
  }

  function randomize() {
    setSpins(Array.from({ length: GRID_N }, () => Math.random() > 0.5))
  }

  function allUp() { setSpins(Array(GRID_N).fill(true)) }
  function allDown() { setSpins(Array(GRID_N).fill(false)) }

  const nUp = spins.filter(Boolean).length
  const nDown = GRID_N - nUp
  const Omega = omega(GRID_N, nUp)
  const macroLabel = nUp === GRID_N ? 'כל הספינים למעלה' :
    nUp === 0 ? 'כל הספינים למטה' :
    nUp === GRID_N / 2 ? 'המקרו-מצב הסבירי ביותר!' :
    `N↑=${nUp}, N↓=${nDown}`

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={randomize} className="flex-1 py-1.5 text-xs rounded-lg font-medium" style={{ background: 'var(--accent)', color: '#fff' }}>אקראי</button>
        <button onClick={allUp} className="flex-1 py-1.5 text-xs rounded-lg font-medium" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>כולם ↑</button>
        <button onClick={allDown} className="flex-1 py-1.5 text-xs rounded-lg font-medium" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>כולם ↓</button>
      </div>

      {/* Spin grid */}
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(4, 1fr)` }}>
        {spins.map((up, i) => (
          <motion.button
            key={i}
            onClick={() => toggleSpin(i)}
            whileTap={{ scale: 0.85 }}
            animate={{ rotateX: up ? 0 : 180 }}
            className="aspect-square rounded-xl flex items-center justify-center text-xl font-bold transition-colors"
            style={{
              background: up ? 'rgba(107,141,214,0.2)' : 'rgba(244,114,182,0.2)',
              border: `2px solid ${up ? '#6B8DD6' : '#f472b6'}`,
              color: up ? '#6B8DD6' : '#f472b6',
            }}
          >
            {up ? '↑' : '↓'}
          </motion.button>
        ))}
      </div>

      {/* Macro state info */}
      <GlassCard padding="sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold" style={{ color: 'var(--text)' }}>מקרו-מצב: {macroLabel}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>N↑={nUp} , N↓={nDown}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>מיקרו-מצבים</div>
            <div className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{Omega.toLocaleString()}</div>
          </div>
        </div>
        {/* Omega bar */}
        <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <motion.div className="h-full rounded-full" style={{ background: 'var(--accent)' }}
            animate={{ width: `${(Omega / omega(GRID_N, GRID_N / 2)) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
        <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
          שבר מהמקסימום (N↑=8): {((Omega / omega(GRID_N, GRID_N / 2)) * 100).toFixed(1)}%
        </div>
      </GlassCard>

      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        לחץ על כל ספין להפוך אותו. שים לב: N↑=8 מייצג הרבה יותר מיקרו-מצבים מ-N↑=16.
      </p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — הגדרות: מיקרו ומקרו',
    content: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed"><strong>מיקרו-מצב:</strong> פירוט מלא — איזה ספין למעלה, איזה למטה. <M tex="2^N" /> מצבים אפשריים.</p>
        <p className="text-sm"><strong>מקרו-מצב:</strong> רק <M tex="N_\uparrow" /> (ו-<M tex="N_\downarrow = N - N_\uparrow" />). לא מעניין אותנו מי-בדיוק.</p>
        <BlockMath tex="\Omega(N, N_\uparrow) = \binom{N}{N_\uparrow} = \frac{N!}{N_\uparrow!\, N_\downarrow!}" />
      </div>
    ),
    interimQuestion: {
      prompt: 'עבור N=4, כמה מיקרו-מצבים יש בסה"כ? (כולל כולם)',
      hint: '2^N',
      validate: s => s.trim() === '16',
      correctAnswer: '16 = 2⁴',
    },
  },
  {
    title: 'שלב 2 — אנרגיה כפונקציה של N↑',
    content: (
      <div className="space-y-3">
        <p className="text-sm">כל ספין בשדה <M tex="\mathcal{H}" />: אנרגיה <M tex="-\mu_B\mathcal{H}" /> (למעלה) או <M tex="+\mu_B\mathcal{H}" /> (למטה).</p>
        <BlockMath tex="E = -\mu_B\mathcal{H}(N_\uparrow - N_\downarrow) = -\mu_B\mathcal{H}(2N_\uparrow - N)" />
        <p className="text-sm">לכן <M tex="N_\uparrow" /> ו-<M tex="E" /> שקולים — ידיעת אחד קובע את השני.</p>
      </div>
    ),
    interimQuestion: {
      prompt: 'אם כל הספינים מקבילים לשדה (N↑=N), מה הסימן של E?',
      hint: 'E = -μ_B·H·(N-0) = -μ_B·H·N',
      validate: s => s.includes('שלילי') || s.includes('מינוס') || s.includes('-') || s.includes('negative'),
      correctAnswer: 'שלילי — מצב אנרגיה מינימלית',
    },
  },
  {
    title: 'שלב 3 — מדוע Ω מקסימלי ב-N↑=N/2?',
    content: (
      <div className="space-y-3">
        <p className="text-sm">מקסימום של <M tex="\binom{N}{N_\uparrow}" /> בנקודה <M tex="N_\uparrow = N/2" /> (ריבוי שוויוני).</p>
        <p className="text-sm">עבור N גדול, המקסימום חד מאוד. קירוב סטרלינג:</p>
        <BlockMath tex="\ln\Omega_{max} = N\ln 2" />
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          זה המצב הסטטיסטי הסביר ביותר — שיווי-משקל תרמי!
        </p>
      </div>
    ),
    interimQuestion: {
      prompt: 'עבור N=100, מה Ω_max בקירוב? (כ-2^N)',
      hint: 'Ω_max ≈ 2^N / √(πN/2)',
      validate: s => s.includes('2^100') || s.toLowerCase().includes('2^n') || s.includes('גדול'),
      correctAnswer: 'Ω_max ≈ 2^100 ≈ 10^30 — מספר עצום!',
    },
  },
]

// ══════════════════════════════════════════════════════════════════════
// APPLY
// ══════════════════════════════════════════════════════════════════════
function ApplySection() {
  const [sel, setSel] = useState<number | null>(null)
  const qs = [
    { q: 'N=2 ספינים. לאיזה מקרו-מצב יש הכי הרבה מיקרו-מצבים?', a: 'N↑=1: יש 2 מיקרו-מצבים (↑↓ או ↓↑). N↑=0 ו-N↑=2 יש רק 1 כל אחד.' },
    { q: 'מדוע שיווי-משקל = המצב הסביר ביותר מבחינה סטטיסטית?', a: 'כי רוב הזמן המערכת "מבקרת" במיקרו-מצבים של המקרו-מצב הנפוץ ביותר. זה הבסיס לחוק השני.' },
    { q: 'האם ייתכן שמערכת בשיווי-משקל תעבור פתאום למצב N↑=N?', a: 'כן — אבל ההסתברות היא (1/2)^N. עבור N=10²³ זה בפועל בלתי-אפשרי.' },
  ]
  return (
    <div className="space-y-3">
      {qs.map((item, i) => (
        <GlassCard key={i} padding="md">
          <p className="text-sm mb-2" style={{ color: 'var(--text)' }}>{item.q}</p>
          {sel === i ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs leading-relaxed" style={{ color: 'var(--success)' }}>{item.a}</motion.p>
          ) : (
            <button onClick={() => setSel(i)} className="text-xs px-3 py-1 rounded-lg" style={{ background: 'var(--accent)', color: '#fff' }}>גלה</button>
          )}
        </GlassCard>
      ))}
      <TrapCard
        title="מיקרו-מצב = מקרו-מצב?"
        wrongFormula="N_\uparrow = 8 \Rightarrow \text{מיקרו-מצב אחד}"
        rightFormula="\Omega(16,8) = \binom{16}{8} = 12870 \text{ מיקרו-מצבים}"
        description="מקרו-מצב הוא כמה ספינים למעלה, לא אילו. לכל מקרו-מצב יש Ω מיקרו-מצבים."
      />
    </div>
  )
}

export default function Node21({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>רשת ספינים — לחץ להפוך!</h3><SpinGrid /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>הגדרות מדויקות של מיקרו ומקרו מצבים בפרה-מגנט</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={<ApplySection />}
    />
  )
}
