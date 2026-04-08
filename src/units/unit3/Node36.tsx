/**
 * Node 3.6 — משוואת קלאוזיוס-קלפרון
 * Explore: עקומת לחץ-אדים אינטראקטיבית — T slider משנה P_sat
 * Build:   dP/dT = L/(T·ΔV) — גזירה מ-G₁=G₂
 * Apply:   בישול בגובה רב, אוטוקלב
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

const meta = UNITS[2].nodes[5]

// Water: L ≈ 40.7 kJ/mol, T_boil = 373K at 1 atm
const L = 40700   // J/mol
const R = 8.314
const T0 = 373, P0 = 101325

function clausius(T: number): number {
  // ln(P/P0) = -(L/R)(1/T - 1/T0)
  return P0 * Math.exp(-(L / R) * (1 / T - 1 / T0))
}

// ══════════════════════════════════════════════════════════════════════
// EXPLORE
// ══════════════════════════════════════════════════════════════════════
function ClausiusClapeyronPlot() {
  const [T, setT] = useState(373)

  const W = 300, H = 180, PAD = 32

  const pts = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => {
      const t = 270 + i * 1.8
      return { T: t, P: clausius(t) / 1000 }  // kPa
    }), [])

  const Pmax = clausius(540) / 1000

  function toX(t: number) { return PAD + ((t - 270) / 108) * (W - PAD * 2) }
  function toY(p: number) { return H - PAD - (p / Pmax) * (H - PAD * 2) }

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.T).toFixed(1)} ${toY(p.P).toFixed(1)}`).join(' ')

  const Pcurrent = clausius(T) / 1000
  const boilT = T  // for display

  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: '#111827' }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          <line x1={PAD} y1={H - PAD} x2={W - 5} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <line x1={PAD} y1={5} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <text x={W / 2} y={H - 5} fill="rgba(255,255,255,0.4)" fontSize={8} textAnchor="middle">T (K)</text>
          <text x={12} y={H / 2} fill="rgba(255,255,255,0.4)" fontSize={7} textAnchor="middle"
            transform={`rotate(-90,12,${H/2})`}>P_sat (kPa)</text>

          {/* Tick marks */}
          {[280, 300, 320, 340, 360, 380].map(t => (
            <text key={t} x={toX(t)} y={H - PAD + 10} fill="rgba(255,255,255,0.3)" fontSize={6} textAnchor="middle">{t}</text>
          ))}

          {/* Curve fill */}
          <path d={pathD + ` L ${toX(pts[pts.length-1].T)} ${H-PAD} L ${toX(pts[0].T)} ${H-PAD} Z`}
            fill="rgba(52,211,153,0.1)" />

          {/* Curve */}
          <motion.path d={pathD} fill="none" stroke="#34d399" strokeWidth={2.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />

          {/* 1 atm line */}
          <line x1={PAD} y1={toY(101.325)} x2={W - 5} y2={toY(101.325)}
            stroke="#f59e0b" strokeWidth={1} strokeDasharray="4,3" />
          <text x={W - 8} y={toY(101.325) - 3} fill="#f59e0b" fontSize={7} textAnchor="end">1 atm</text>

          {/* Current T marker */}
          <line x1={toX(T)} y1={toY(Pcurrent)} x2={toX(T)} y2={H - PAD}
            stroke="#f472b6" strokeWidth={1.5} strokeDasharray="3,3" />
          <circle cx={toX(T)} cy={toY(Pcurrent)} r={5} fill="#f472b6" />
          <text x={toX(T) + 6} y={toY(Pcurrent) - 5} fill="#f472b6" fontSize={8}>
            {T}K, {Pcurrent.toFixed(1)}kPa
          </text>
        </svg>
      </div>

      <div>
        <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>T = {T} K ({T - 273} °C)</label>
        <input type="range" min={275} max={420} value={T} onChange={e => setT(Number(e.target.value))} className="w-full mt-1" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <GlassCard padding="sm" className="text-center">
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>לחץ אדים P_sat</div>
          <div className="text-base font-bold mono" style={{ color: '#34d399' }}>{Pcurrent.toFixed(1)} kPa</div>
        </GlassCard>
        <GlassCard padding="sm" className="text-center">
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>רתיחה בלחץ זה?</div>
          <div className="text-sm font-bold" style={{ color: Pcurrent >= 101 ? '#f59e0b' : 'var(--accent)' }}>
            {Pcurrent >= 100 ? `${T - 273}°C` : `< 100°C!`}
          </div>
        </GlassCard>
      </div>

      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        הזז ל-T נמוך: ב-80°C (353K) המים רותחים בלחץ ~47 kPa (פחות מחצי אטמוספירה). בג'ומומה (5000m) רותח ב-83°C!
      </p>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — גזירה מ-G₁=G₂',
    content: (
      <div className="space-y-3">
        <p className="text-sm">לאורך קו המעבר: <M tex="G_{liq} = G_{gas}" /></p>
        <p className="text-sm">לכן: <M tex="dG_{liq} = dG_{gas}" /></p>
        <BlockMath tex="-S_l dT + V_l dP = -S_g dT + V_g dP" />
        <p className="text-sm">מסדרים:</p>
        <BlockMath tex="\frac{dP}{dT} = \frac{S_g - S_l}{V_g - V_l} = \frac{\Delta S}{\Delta V}" />
      </div>
    ),
    interimQuestion: {
      prompt: 'מה הקשר בין ΔS ל-L (חום סמוי)?',
      hint: 'L = T·ΔS, כי המעבר קורה בT קבוע',
      validate: s => s.includes('L') && s.includes('T') && (s.includes('=') || s.includes('=')),
      correctAnswer: 'L = T·ΔS, לכן ΔS = L/T',
    },
  },
  {
    title: 'שלב 2 — קירוב גז אידיאלי',
    content: (
      <div className="space-y-3">
        <p className="text-sm">מ-ΔS = L/T ו-ΔV ≈ V_gas = RT/P (גז אידיאלי):</p>
        <BlockMath tex="\frac{dP}{dT} = \frac{L}{T\cdot\frac{RT}{P}} = \frac{LP}{RT^2}" />
        <p className="text-sm">פיצול משתנים ואינטגרציה:</p>
        <BlockMath tex="\frac{d\ln P}{dT} = \frac{L}{RT^2} \Rightarrow \ln\frac{P_2}{P_1} = -\frac{L}{R}\!\left(\frac{1}{T_2}-\frac{1}{T_1}\right)" />
      </div>
    ),
    interimQuestion: {
      prompt: 'עבור מים (L=40.7 kJ/mol), מה P_sat ב-80°C? (P₀=101kPa ב-100°C)',
      hint: 'ln(P/101) = -(40700/8.314)(1/353 - 1/373)',
      validate: s => { const v = parseFloat(s.replace(/[^\d.]/g, '')); return v > 40 && v < 55 },
      correctAnswer: '≈ 47 kPa (≈ 0.46 atm)',
    },
  },
  {
    title: 'שלב 3 — מסקנות',
    content: (
      <div className="space-y-3">
        <p className="text-sm">השיפוע <M tex="dP/dT > 0" /> עבור רתיחה (L {'>'} 0, ΔV {'>'} 0).</p>
        <div className="space-y-1 text-xs rounded-lg p-2" style={{ background: 'var(--accent-soft)' }}>
          <div>🏔️ <strong>גובה רב:</strong> P נמוך → T_boil נמוך → אוכל לא מבושל כהלכה</div>
          <div>🏥 <strong>אוטוקלב:</strong> P גבוה → T_boil {'>'} 121°C → סטריליזציה</div>
          <div>❄️ <strong>קרח תחת לחץ:</strong> מים: dP/dT{'<'}0 → לחץ מוריד T_melt → גלישה על קרח</div>
        </div>
      </div>
    ),
    interimQuestion: {
      prompt: 'אם L שלילי (דוגמת He³ תחת לחץ נמוך), מה כיוון שיפוע קו ההיתוך?',
      hint: 'dP/dT = L/(T·ΔV). L<0 → שיפוע שלילי',
      validate: s => s.includes('שלילי') || s.includes('שמאל') || s.includes('negative') || s.includes('ירד'),
      correctAnswer: 'שיפוע שלילי — כמו מים!',
    },
  },
]

export default function Node36({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>עקומת לחץ-אדים של מים</h3><ClausiusClapeyronPlot /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>גזירת dP/dT = L/(T·ΔV) ממשוואת G₁=G₂</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>קלאוזיוס-קלפרון ביישומים</h3>
            <div className="space-y-2 text-xs">
              {[
                { icon: '🌡️', title: 'T רתיחה vs לחץ', eq: 'T_b \\approx T_0\\left(1 + \\frac{RT_0}{L}\\ln\\frac{P}{P_0}\\right)' },
                { icon: '❄️', title: 'T היתוך vs לחץ (מים)', eq: 'T_m \\approx 273 - \\frac{P - 1}{135} \\text{[K/atm]}' },
              ].map(item => (
                <div key={item.title} className="rounded-lg p-2" style={{ background: 'var(--accent-soft)' }}>
                  <div className="font-semibold mb-1">{item.icon} {item.title}</div>
                  <BlockMath tex={item.eq} />
                </div>
              ))}
            </div>
          </GlassCard>
          <TrapCard
            title="חום סמוי L תלוי ב-T?"
            wrongFormula="L = \\text{const}"
            rightFormula="L(T) \\text{ — משתנה! לכן Clausius-Clapeyron מקורב}"
            description="L(T) למים יורד מ-40.7 kJ/mol ב-100°C ל-0 בנקודה הקריטית. הקירוב L=const טוב לTדלתא קטן."
          />
        </div>
      }
    />
  )
}
