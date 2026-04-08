/**
 * Node 2.3 — ההגדרה הסטטיסטית של האנטרופיה
 * Explore: ויזואליזציה S = k_B ln Ω — הצגת "מרחב הפאזות" של הפרה-מגנט
 * Build:   הגדרת בולצמן S = k_B ln Ω
 * Apply:   קישור לתרמודינמיקה קלאסית
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

const meta = UNITS[1].nodes[2]
const kB = 1.38e-23

function logOmega(N: number, k: number): number {
  if (k <= 0 || k >= N) return 0
  return N * Math.log(N) - k * Math.log(k) - (N - k) * Math.log(N - k)
}

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — עקומת S(N↑) לפרה-מגנט
// ══════════════════════════════════════════════════════════════════════
function EntropyCurve() {
  const [N, setN] = useState(20)
  const [hover, setHover] = useState<number | null>(null)

  const W = 300, H = 170, PAD = 28

  const pts = useMemo(() =>
    Array.from({ length: N + 1 }, (_, k) => ({
      k,
      S: logOmega(N, k) * kB * 1e23,   // in units of 10^-23 J/K for display
      frac: k / N,
    })), [N])

  const maxS = Math.max(...pts.map(p => p.S))

  function toX(k: number) { return PAD + (k / N) * (W - PAD * 2) }
  function toY(S: number) { return H - PAD - (S / (maxS || 1)) * (H - PAD * 2) }

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.k).toFixed(1)} ${toY(p.S).toFixed(1)}`).join(' ')

  const hlPt = hover !== null ? pts[hover] : null

  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: '#111827' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}
          onMouseMove={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            const xFrac = (e.clientX - rect.left) / rect.width
            const k = Math.round(xFrac * N)
            setHover(Math.max(0, Math.min(N, k)))
          }}
          onMouseLeave={() => setHover(null)}>

          {/* Axes */}
          <line x1={PAD} y1={H - PAD} x2={W - 8} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <line x1={PAD} y1={8} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />

          {/* Labels */}
          <text x={W / 2} y={H - 6} fill="rgba(255,255,255,0.4)" fontSize={8} textAnchor="middle">N↑</text>
          <text x={8} y={H / 2} fill="rgba(255,255,255,0.4)" fontSize={7} textAnchor="middle"
            transform={`rotate(-90,8,${H / 2})`}>S / k_B</text>

          {/* Axis ticks */}
          {[0, 0.25, 0.5, 0.75, 1].map(f => (
            <text key={f} x={toX(f * N)} y={H - PAD + 10} fill="rgba(255,255,255,0.3)" fontSize={7} textAnchor="middle">
              {Math.round(f * N)}
            </text>
          ))}

          {/* Fill */}
          <path d={pathD + ` L ${toX(N)} ${H - PAD} L ${toX(0)} ${H - PAD} Z`}
            fill="rgba(107,141,214,0.12)" />

          {/* Curve */}
          <motion.path d={pathD} fill="none" stroke="#6B8DD6" strokeWidth={2.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />

          {/* Max marker */}
          <circle cx={toX(N / 2)} cy={toY(maxS)} r={4} fill="#FDE68A" />
          <text x={toX(N / 2) + 6} y={toY(maxS) - 4} fill="#FDE68A" fontSize={8}>S_max</text>

          {/* Hover point */}
          {hlPt && (
            <>
              <line x1={toX(hlPt.k)} y1={H - PAD} x2={toX(hlPt.k)} y2={toY(hlPt.S)}
                stroke="rgba(255,255,255,0.3)" strokeDasharray="3,3" strokeWidth={1} />
              <circle cx={toX(hlPt.k)} cy={toY(hlPt.S)} r={4} fill="#f472b6" />
              <text x={toX(hlPt.k) < W * 0.7 ? toX(hlPt.k) + 6 : toX(hlPt.k) - 6}
                y={toY(hlPt.S) - 5} fill="#f472b6" fontSize={8}
                textAnchor={toX(hlPt.k) < W * 0.7 ? 'start' : 'end'}>
                N↑={hlPt.k}: S≈{hlPt.S.toFixed(1)}k_B
              </text>
            </>
          )}
        </svg>
      </div>

      <div>
        <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>N = {N} ספינים</label>
        <input type="range" min={6} max={50} step={2} value={N}
          onChange={e => setN(Number(e.target.value))} className="w-full mt-1" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <GlassCard padding="sm" className="text-center">
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>S_max / k_B</div>
          <div className="text-base font-bold mono" style={{ color: 'var(--accent)' }}>{(N * Math.log(2)).toFixed(2)}</div>
        </GlassCard>
        <GlassCard padding="sm" className="text-center">
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>= N·ln2</div>
          <div className="text-base font-bold mono" style={{ color: 'var(--warn)' }}>{(N * 0.693).toFixed(2)}</div>
        </GlassCard>
      </div>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        רחף עם העכבר על הגרף לראות S בכל N↑. S מקסימלי כש-N↑=N/2 — שיווי-משקל.
      </p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — הגדרת בולצמן',
    content: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed">
          בולצמן הציע: האנטרופיה היא מדד ל"אי-סדר" — לוגריתם מספר המיקרו-מצבים:
        </p>
        <BlockMath tex="S = k_B \ln\Omega" />
        <p className="text-sm">יחידות: <M tex="k_B = 1.38\times10^{-23}" /> J/K (אותן יחידות כמו בתרמודינמיקה!).</p>
        <p className="text-sm">מדוע לוגריתם? כי אנטרופיה אדיטיבית: שתי מערכות בלתי-תלויות:</p>
        <BlockMath tex="S_{total} = k_B\ln(\Omega_1\Omega_2) = S_1 + S_2" />
      </div>
    ),
    interimQuestion: {
      prompt: 'עבור מצב עם Ω=1 (סדר מוחלט), מה S?',
      hint: 'ln(1) = 0',
      validate: s => s.trim() === '0' || s.includes('אפס') || s.includes('zero'),
      correctAnswer: 'S = k_B·ln(1) = 0',
    },
  },
  {
    title: 'שלב 2 — S של הפרה-מגנט',
    content: (
      <div className="space-y-3">
        <p className="text-sm">הפעלת סטרלינג על <M tex="\ln\Omega(N, N_\uparrow)" />:</p>
        <BlockMath tex="S = -Nk_B\!\left[\frac{N_\uparrow}{N}\ln\frac{N_\uparrow}{N} + \frac{N_\downarrow}{N}\ln\frac{N_\downarrow}{N}\right]" />
        <p className="text-sm">זה <strong>אנטרופיית שאנון</strong> — אותה צורה בתורת המידע!</p>
        <p className="text-sm">מקסימום ב-N↑=N/2: <M tex="S_{max} = Nk_B\ln 2" /></p>
      </div>
    ),
    interimQuestion: {
      prompt: 'עבור N=1 mol (N_A≈6×10²³), מה S_max בJ/K?',
      hint: 'S_max = N·k_B·ln2 = n·R·ln2 (R=8.314 J/mol·K)',
      validate: s => { const v = parseFloat(s.replace(/[^\d.]/g, '')); return v > 5 && v < 6.5 },
      correctAnswer: '≈ 5.76 J/K = R·ln2',
    },
  },
  {
    title: 'שלב 3 — קישור לחוק השני',
    content: (
      <div className="space-y-3">
        <p className="text-sm">מדוע האנטרופיה רק עולה? כי מצבי שיווי-משקל = מקסימום Ω = מקסימום S.</p>
        <BlockMath tex="\Delta S_{universe} \geq 0" />
        <p className="text-sm">מיקרוסקופית: מערכת "נופלת" למקסימום Ω — לא כי יש לה "רצון", אלא כי יש הכי הרבה מיקרו-מצבים שם!</p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--success)' }}>
          ✓ החוק השני הוא <em>סטטיסטיקה</em>, לא חוק פיזיקלי עמוק.
        </p>
      </div>
    ),
    interimQuestion: {
      prompt: 'האם ייתכן שאנטרופיית מערכת מבודדת תרד?',
      hint: 'עיקרונית כן, מעשית — הסתברות אפסית',
      validate: s => s.includes('עקרונית') || s.includes('אפשרי') || s.includes('הסתברות') || s.includes('כן'),
      correctAnswer: 'כן — עקרונית אפשרי, אך הסתברותו בלתי-אפסית בלבד עבור N קטן',
    },
  },
]

export default function Node23({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>עקומת האנטרופיה של פרה-מגנט</h3><EntropyCurve /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>S = k_B ln Ω — הגדרת בולצמן ומשמעותה</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>ביטויי האנטרופיה</h3>
            <div className="space-y-2 text-sm">
              {[
                { label: 'בולצמן', eq: 'S = k_B \\ln\\Omega', note: 'מיקרוסקופי' },
                { label: 'גיבס', eq: 'S = -k_B \\sum p_i \\ln p_i', note: 'ממוצע על מצבים' },
                { label: 'שאנון', eq: 'H = -\\sum p_i \\log_2 p_i', note: 'תורת מידע (ביטים)' },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'var(--accent-soft)' }}>
                  <span className="text-xs font-semibold w-12" style={{ color: 'var(--accent)' }}>{row.label}</span>
                  <BlockMath tex={row.eq} />
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{row.note}</span>
                </div>
              ))}
            </div>
          </GlassCard>
          <TrapCard
            title="S = 0 = מצב קפוא?"
            wrongFormula="S=0 \Rightarrow T=0"
            rightFormula="S=0 \Rightarrow \Omega=1 \text{ (מצב ייחודי)}"
            description="S=0 פירושו רק מיקרו-מצב אחד אפשרי. זה קורה בT=0 עבור רוב המערכות (משפט נרנסט), אבל לא בהכרח!"
          />
        </div>
      }
    />
  )
}
