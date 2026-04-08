/**
 * Node 3.1 — החוק הראשון של התרמודינמיקה
 * Explore: דיאגרמת זרימת אנרגיה — sliders לdQ, dW ← רואים dU
 * Build:   dU = dQ + dW, עבודה תרמודינמית P·dV
 * Apply:   תהליכים שונים (איזו-תרמי, אדיאבטי, איזו-כורי)
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

const meta = UNITS[2].nodes[0]

// ══════════════════════════════════════════════════════════════════════
// EXPLORE — זרימת אנרגיה
// ══════════════════════════════════════════════════════════════════════
function EnergyFlow() {
  const [dQ, setDQ] = useState(30)   // heat added
  const [dW, setDW] = useState(-10)  // work done ON system

  const dU = dQ + dW
  const color = dU > 0 ? '#34d399' : dU < 0 ? '#f87171' : '#FDE68A'

  return (
    <div className="space-y-4">
      {/* SVG energy diagram */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#111827', height: 160 }}>
        <svg width="100%" height="160" viewBox="0 0 300 160">
          {/* System box */}
          <rect x={100} y={50} width={100} height={70} rx={8}
            fill={`${color}22`} stroke={color} strokeWidth={2} />
          <text x={150} y={82} fill={color} fontSize={10} textAnchor="middle" fontWeight="bold">מערכת</text>
          <text x={150} y={96} fill={color} fontSize={9} textAnchor="middle">U → U + {dU}</text>
          <text x={150} y={110} fill={color} fontSize={8} textAnchor="middle">
            ΔU = {dU > 0 ? '+' : ''}{dU}
          </text>

          {/* Heat arrow (from left) */}
          {dQ !== 0 && (
            <>
              <motion.line x1={10} y1={85} x2={96} y2={85} stroke="#f59e0b"
                strokeWidth={Math.max(1, Math.abs(dQ) / 10)} strokeDasharray={dQ > 0 ? '' : '6,3'}
                animate={{ strokeDashoffset: dQ > 0 ? [0, -20] : [0, 20] }}
                transition={{ repeat: Infinity, duration: 1 }} />
              <polygon points={dQ > 0 ? '96,80 96,90 104,85' : '14,80 14,90 6,85'} fill="#f59e0b" />
              <text x={10} y={75} fill="#f59e0b" fontSize={9}>Q={dQ > 0 ? '+' : ''}{dQ}</text>
            </>
          )}

          {/* Work arrow (to right = work done by system, from right = work done on) */}
          {dW !== 0 && (
            <>
              <motion.line x1={204} y1={85} x2={290} y2={85} stroke="#60a5fa"
                strokeWidth={Math.max(1, Math.abs(dW) / 10)} strokeDasharray={dW < 0 ? '' : '6,3'}
                animate={{ strokeDashoffset: dW < 0 ? [0, 20] : [0, -20] }}
                transition={{ repeat: Infinity, duration: 1 }} />
              <polygon points={dW < 0 ? '200,80 200,90 192,85' : '286,80 286,90 294,85'} fill="#60a5fa" />
              <text x={215} y={75} fill="#60a5fa" fontSize={9}>W={dW > 0 ? '+' : ''}{dW}</text>
            </>
          )}

          {/* Legend */}
          <text x={150} y={150} fill="rgba(255,255,255,0.3)" fontSize={7} textAnchor="middle">
            dU = dQ + dW = {dQ} + ({dW}) = {dU}
          </text>
        </svg>
      </div>

      {/* Sliders */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <label style={{ color: '#f59e0b' }}>חום נכנס dQ = {dQ > 0 ? '+' : ''}{dQ}</label>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{dQ > 0 ? '← חום נספג' : '← חום מופלט'}</span>
          </div>
          <input type="range" min={-50} max={50} value={dQ} onChange={e => setDQ(Number(e.target.value))} className="w-full" />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <label style={{ color: '#60a5fa' }}>עבודה על המערכת dW = {dW > 0 ? '+' : ''}{dW}</label>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{dW > 0 ? '← דחיסה' : '← התפשטות'}</span>
          </div>
          <input type="range" min={-50} max={50} value={dW} onChange={e => setDW(Number(e.target.value))} className="w-full" />
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl p-3 text-center" style={{ background: `${color}22`, border: `1px solid ${color}` }}>
        <span className="text-sm font-bold" style={{ color }}>
          ΔU = {dU > 0 ? '+' : ''}{dU} — אנרגיה פנימית {dU > 0 ? 'עלתה' : dU < 0 ? 'ירדה' : 'לא השתנתה'}
        </span>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════
const STEPS: DerivationStep[] = [
  {
    title: 'שלב 1 — אנרגיה פנימית',
    content: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed">
          אנרגיה פנימית U = סכום אנרגיות כל המולקולות. היא <strong>פונקציית מצב</strong> — תלויה רק ב-T,V,N.
        </p>
        <p className="text-sm">שני דרכים להעביר אנרגיה:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg p-2" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid #f59e0b' }}>
            <div className="font-semibold" style={{ color: '#f59e0b' }}>חום Q</div>
            <div style={{ color: 'var(--text-muted)' }}>מעבר אנרגיה בגלל הפרש T</div>
          </div>
          <div className="rounded-lg p-2" style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid #60a5fa' }}>
            <div className="font-semibold" style={{ color: '#60a5fa' }}>עבודה W</div>
            <div style={{ color: 'var(--text-muted)' }}>מעבר אנרגיה דרך כוח מאקרוסקופי</div>
          </div>
        </div>
      </div>
    ),
    interimQuestion: {
      prompt: 'אם חימום גז בכלי נוקשה (V=const), האם נעשית עבודה מכנית?',
      hint: 'עבודה W = -P·dV',
      validate: s => s.includes('לא') || s.includes('אין') || s.includes('אפס') || s.toLowerCase().includes('no'),
      correctAnswer: 'לא — V קבוע → dV=0 → W=0',
    },
  },
  {
    title: 'שלב 2 — החוק הראשון',
    content: (
      <div className="space-y-3">
        <BlockMath tex="dU = \delta Q + \delta W" />
        <p className="text-sm">קונבנציות:</p>
        <ul className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
          <li>• δQ {'>'} 0 — חום נספג על-ידי המערכת</li>
          <li>• δW {'='} -PdV (IUPAC): W {'>'} 0 — עבודה על המערכת (דחיסה)</li>
        </ul>
        <p className="text-sm">עבור גז אידיאלי:</p>
        <BlockMath tex="dU = nC_V dT \quad \text{(תמיד, לא רק בV-קבוע!)}" />
      </div>
    ),
    interimQuestion: {
      prompt: 'גז אידיאלי מתפשט אדיאבטית (Q=0). מה קורה לT?',
      hint: 'dU = -PdV < 0 (התפשטות), ו-dU = nCv·dT',
      validate: s => s.includes('יור') || s.includes('קטן') || s.includes('decreases') || s.includes('מתקרר'),
      correctAnswer: 'T יורד — גז מתקרר',
    },
  },
  {
    title: 'שלב 3 — תהליכים חשובים',
    content: (
      <div className="space-y-3">
        <div className="space-y-2 text-sm">
          {[
            { name: 'איזו-תרמי (T=const)', eq: 'dU=0,\\ Q=-W', note: 'גז אידיאלי: Q=nRT·ln(V₂/V₁)' },
            { name: 'אדיאבטי (Q=0)', eq: 'dU=W,\\ TV^{\\gamma-1}=\\text{const}', note: 'ללא חילוף חום' },
            { name: 'איזו-כורי (V=const)', eq: 'dU=Q,\\ W=0', note: 'כל החום הופך לU' },
            { name: 'איזו-בארי (P=const)', eq: 'dU=Q-P\\Delta V,\\ Q=nC_P dT', note: 'Cp = Cv + R' },
          ].map(row => (
            <div key={row.name} className="rounded-lg p-2" style={{ background: 'var(--accent-soft)' }}>
              <div className="font-semibold text-xs" style={{ color: 'var(--accent)' }}>{row.name}</div>
              <BlockMath tex={row.eq} />
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{row.note}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    interimQuestion: {
      prompt: 'בתהליך אדיאבטי של גז אידיאלי, מהו הקשר בין P ל-V?',
      hint: 'PV^γ = const, γ = Cp/Cv',
      validate: s => s.includes('γ') || s.includes('gamma') || s.includes('PV^') || s.includes('pv'),
      correctAnswer: 'PVᵞ = const',
    },
  },
]

export default function Node31({ onBack }: { onBack: () => void }) {
  return (
    <NodeLayout meta={meta} onBack={onBack}
      explore={<div className="space-y-4"><GlassCard padding="md"><h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>זרימת אנרגיה — חום ועבודה</h3><EnergyFlow /></GlassCard></div>}
      build={<div className="space-y-4"><GlassCard padding="md"><p className="text-xs" style={{ color: 'var(--text-muted)' }}>dU = δQ + δW — שימור אנרגיה תרמודינמי</p></GlassCard><ScaffoldedDerivation steps={STEPS} /></div>}
      apply={
        <div className="space-y-3">
          <GlassCard padding="md">
            <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text)' }}>מה קורה בכל תהליך?</h3>
            <div className="space-y-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <p>• <strong style={{ color: 'var(--text)' }}>מנוע קיטור:</strong> Q_H נכנס, W יוצא, Q_C מופלט. יעילות = W/Q_H</p>
              <p>• <strong style={{ color: 'var(--text)' }}>מקרר:</strong> W על המערכת, Q_C נספג, Q_H מופלט.</p>
              <p>• שימושי: bU ← Q עדיף לחימום של תנאי ביתי, בו V קבוע.</p>
            </div>
          </GlassCard>
          <TrapCard
            title="Q ו-W הם פונקציות מסלול!"
            wrongFormula="Q = \Delta U_Q \text{ (פונקציית מצב)}"
            rightFormula="\oint \delta Q \neq 0,\quad \oint \delta W \neq 0"
            description="Q ו-W תלויים בדרך (מסלול) ולא רק במצב ההתחלה והסוף. רק dU = δQ+δW אדיטיבי ועצמאי-מסלול!"
          />
        </div>
      }
    />
  )
}
