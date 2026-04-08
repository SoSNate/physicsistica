/**
 * Node 2.5 — טמפרטורה שלילית בפרה-מגנט
 * Explore: אנימציה "היפוך אוכלוסין" — רמות אנרגיה עם population bars
 * Build:   E > E_max/2 → ∂S/∂E < 0 → T < 0
 * Apply:   משמעות T שלילי, NMR, לייזרים
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

const meta = UNITS[1].nodes[4]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — היפוך אוכלוסין
// ══════════════════════════════════════════════════════════════════════
function PopulationInversion() {
  const [nUp, setNUp] = useState(5)
  const N = 10
  const nDown = N - nUp
  const E = -(2 * nUp - N)  // in units of μ_B*H

  function logOmega(k: number): number {
    if (k <= 0 || k >= N) return 0
    return N * Math.log(N) - k * Math.log(k) - (N - k) * Math.log(N - k)
  }

  const S = logOmega(nUp)
  const prevS = nUp > 1 ? logOmega(nUp - 1) : 0
  const nextS = nUp < N - 1 ? logOmega(nUp + 1) : 0
  const dSdE = (nextS - prevS) / (-4)  // dN↑ = 1, dE = -2
  const T = dSdE !== 0 ? 1 / dSdE : Infinity

  const region = nUp < N / 2 ? 'positive' : nUp > N / 2 ? 'negative' : 'infinite'

  const regionLabels: Record<string, { label: string; color: string; desc: string }> = {
    positive: { label: 'T > 0', color: '#34d399', desc: 'יותר ספינים למטה — מצב רגיל' },
    negative: { label: 'T < 0', color: '#f472b6', desc: 'יותר ספינים למעלה — היפוך אוכלוסין!' },
    infinite: { label: 'T = ±∞', color: '#FDE68A', desc: 'שיוויון מוחלט — מקסימום אנטרופיה' },
  }
  const reg = regionLabels[region]

  return (
    <div className="space-y-3">
      {/* Energy level diagram */}
      <GlassCard padding="md">
        <div className="flex gap-6 items-center justify-center">
          {/* Energy levels */}
          <div className="flex flex-col gap-4 items-center">
            <div className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>רמות אנרגיה</div>
            {/* High energy level (spin up, anti-aligned) */}
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>+μH ↑</span>
              <div className="h-0.5 w-20" style={{ background: 'var(--border)' }} />
              <div className="flex gap-0.5">
                {Array.from({ length: nUp }, (_, i) => (
                  <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-3 h-3 rounded-full flex items-center justify-center text-[8px]"
                    style={{ background: 'rgba(244,114,182,0.3)', border: '1px solid #f472b6', color: '#f472b6' }}>↑</motion.div>
                ))}
              </div>
              <span className="text-[10px] font-mono w-6" style={{ color: '#f472b6' }}>{nUp}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>−μH ↓</span>
              <div className="h-0.5 w-20" style={{ background: 'var(--border)' }} />
              <div className="flex gap-0.5">
                {Array.from({ length: nDown }, (_, i) => (
                  <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-3 h-3 rounded-full flex items-center justify-center text-[8px]"
                    style={{ background: 'rgba(107,141,214,0.3)', border: '1px solid #6B8DD6', color: '#6B8DD6' }}>↓</motion.div>
                ))}
              </div>
              <span className="text-[10px] font-mono w-6" style={{ color: '#6B8DD6' }}>{nDown}</span>
            </div>
          </div>

          {/* Population bars */}
          <div className="flex gap-2 items-end h-20">
            <div className="flex flex-col items-center gap-1">
              <motion.div className="w-8 rounded-t"
                style={{ background: '#f472b6', height: `${(nUp / N) * 64}px` }}
                animate={{ height: `${(nUp / N) * 64}px` }} transition={{ duration: 0.3 }} />
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>↑</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <motion.div className="w-8 rounded-t"
                style={{ background: '#6B8DD6', height: `${(nDown / N) * 64}px` }}
                animate={{ height: `${(nDown / N) * 64}px` }} transition={{ duration: 0.3 }} />
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>↓</span>
            </div>
          </div>
        </div>
      </GlassCard>

      <div>
        <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>N↑ = {nUp}</label>
        <input type="range" min={0} max={N} value={nUp} onChange={e => setNUp(Number(e.target.value))} className="w-full mt-1" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={region} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3" style={{ background: `${reg.color}22`, border: `1px solid ${reg.color}` }}>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold" style={{ color: reg.color }}>{reg.label}</span>
            <span className="text-xs" style={{ color: 'var(--text)' }}>{reg.desc}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2 text-center">
            {[
              { l: 'S/k_B', v: S.toFixed(2), c: 'var(--accent)' },
              { l: 'E/μH', v: E.toString(), c: 'var(--warn)' },
              { l: 'T (יח׳)', v: Math.abs(T) > 50 ? (T > 0 ? '+∞' : '-∞') : T.toFixed(1), c: reg.color },
            ].map(item => (
              <div key={item.l} className="rounded-lg p-1.5" style={{ background: 'var(--card)' }}>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.l}</div>
                <div className="text-sm font-bold mono" style={{ color: item.c }}>{item.v}</div>
              </div>
            ))}
          </div>
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
    title: 'שלב 1 — תנאי T<0',
    content: (
      <div className="space-y-3">
        <p className="text-sm">לפרה-מגנט, S עולה עד N↑=N/2 ואז <strong>יורד</strong>:</p>
        <BlockMath tex="\frac{\partial S}{\partial E}\bigg|_{N_\uparrow > N/2} < 0 \Rightarrow T < 0" />
        <p className="text-sm">זה מצריך שרוב הספינים יהיו <em>נגד</em> השדה — מצב אנרגיה גבוה מ-E_max/2.</p>
      </div>
    ),
    interimQuestion: {
      prompt: 'אם T<0, מה קורה כש-E עולה?',
      hint: '1/T < 0 ← S יורד כשE עולה',
      validate: s => s.includes('יורד') || s.includes('פוחתת') || s.includes('decreases'),
      correctAnswer: 'S יורד — מצב "אנטי-תרמי"',
    },
  },
  {
    title: 'שלב 2 — T שלילי "חם" יותר מT חיובי?',
    content: (
      <div className="space-y-3">
        <p className="text-sm">בשיווי-משקל: אנרגיה זורמת מ-T גדול ל-T קטן יחסית ל<strong>סקלת 1/T</strong>:</p>
        <div className="rounded-lg p-2 text-xs space-y-1" style={{ background: 'var(--accent-soft)' }}>
          <div>T=+100 K: 1/T = +0.01</div>
          <div>T=+∞: 1/T = 0</div>
          <div>T=−∞: 1/T = 0 (מהכיוון השני)</div>
          <div style={{ color: '#f472b6' }}>T=−100 K: 1/T = −0.01</div>
        </div>
        <p className="text-sm">לכן T=-100K "חם" יותר מT=+∞ — אנרגיה זורמת מT שלילי לT חיובי!</p>
        <BlockMath tex="-\infty \leftarrow \cdots \leftarrow -T \leftarrow \pm\infty \leftarrow +T \leftarrow \cdots \leftarrow +\infty" />
      </div>
    ),
    interimQuestion: {
      prompt: 'כש-מערכת T<0 נוגעת במערכת T>0, לאיזה כיוון זורמת האנרגיה?',
      hint: 'מ-T שלילי לT חיובי — כי 1/T שלילי < 1/T חיובי',
      validate: s => s.includes('שלילי') || s.includes('מינוס') || s.includes('negative'),
      correctAnswer: 'מT שלילי → לT חיובי',
    },
  },
  {
    title: 'שלב 3 — כיצד מגיעים לT<0?',
    content: (
      <div className="space-y-3">
        <p className="text-sm">נדרש <strong>היפוך אוכלוסין</strong>: לשים יותר ספינים ברמה הגבוהה.</p>
        <p className="text-sm">בניסוי NMR: פולס RF מהפך מגנוטיזציה → מצב T{'<'}0 רגעי.</p>
        <p className="text-sm">בלייזר: משאבה אופטית (optical pumping) יוצרת היפוך → הגברת אור!</p>
        <BlockMath tex="\text{לייזר}: \frac{N_2}{N_1} > 1 \Rightarrow T = \frac{\varepsilon}{k_B\ln(N_1/N_2)} < 0" />
      </div>
    ),
    interimQuestion: {
      prompt: 'מדוע לייזר אי-אפשרי בשיווי-משקל T>0?',
      hint: 'בשיווי-משקל T>0: N_1 > N_2 תמיד (בולצמן)',
      validate: s => s.includes('בולצמן') || s.includes('שיווי') || s.includes('רוב') || s.includes('מטה') || true,
      correctAnswer: 'כי בולצמן: N_2/N_1 = e^(-ΔE/kT) < 1 — תמיד יותר ב-N_1',
    },
  },
]

export default function Node25({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>היפוך אוכלוסין וטמפרטורה שלילית</h3><PopulationInversion /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>תנאי T{'<'}0 ויישומים (NMR, לייזרים)</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>יישומים אמיתיים של T{'<'}0</h3>
            <div className="space-y-2">
              {[
                { title: 'NMR ו-MRI', desc: 'פולסי RF מייצרים היפוך אוכלוסין רגעי — בסיס להדמיה רפואית.' },
                { title: 'לייזרים', desc: 'היפוך אוכלוסין ← הגברה מגורה ← פליטת אור קוהרנטי.' },
                { title: 'קירור לייזרי', desc: 'מניפולציה של T במרחב מהירויות — T≈μK לאטומים קרים.' },
              ].map((item, i) => (
                <div key={i} className="rounded-lg p-2" style={{ background: 'var(--accent-soft)' }}>
                  <div className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>{item.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </GlassCard>
          <TrapCard
            title="T<0 = קר יותר מ-0K?"
            wrongFormula="T = -100K < T = +1K"
            rightFormula="\frac{1}{T=-100} = -0.01 < \frac{1}{T=+1} = +1"
            description="בסקלת 1/T: T שלילי 'חם' יותר מ-T חיובי כלשהו! הסדר הנכון: 0K (הכי קר) → +∞ → -∞ → ... → T שלילי."
          />
        </div>
      }
    />
  )
}
