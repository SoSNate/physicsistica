import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { HelpCircle } from 'lucide-react'
import GlassCard from './GlassCard'
import { LiveMath } from './MathBlock'

interface WhatIfParam {
  key: string
  label: string           // "טמפרטורה T"
  symbol: string          // LaTeX symbol "T"
  unit: string            // "K"
  min: number
  max: number
  step: number
  defaultValue: number
  criticalPoints?: { value: number; label: string }[]  // marked on slider
}

interface WhatIfExplorerProps {
  title: string
  description: ReactNode
  params: WhatIfParam[]
  renderFormula: (values: Record<string, number>) => string   // returns LaTeX
  renderVisualization?: (values: Record<string, number>) => ReactNode
  questions: {
    prompt: string
    answer: (values: Record<string, number>) => string  // description of what happens
  }[]
}

export default function WhatIfExplorer({
  title,
  description,
  params,
  renderFormula,
  renderVisualization,
  questions,
}: WhatIfExplorerProps) {
  const [values, setValues] = useState<Record<string, number>>(
    () => Object.fromEntries(params.map(p => [p.key, p.defaultValue]))
  )
  const [activeQ, setActiveQ] = useState<number | null>(null)

  function setValue(key: string, val: number) {
    setValues(prev => ({ ...prev, [key]: val }))
  }

  const formula = renderFormula(values)

  return (
    <GlassCard padding="none" className="overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <HelpCircle size={15} style={{ color: 'var(--warn)' }} />
          <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--warn)' }}>
            מה קורה אם...?
          </span>
        </div>
        <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{title}</h3>
        <div className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {description}
        </div>
      </div>

      {/* Live formula */}
      <div
        className="mx-4 rounded-xl px-4 py-3 text-center"
        style={{ background: 'var(--accent-soft)', border: '1px solid var(--border)' }}
      >
        <motion.div
          key={formula}
          initial={{ scale: 0.97, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <LiveMath tex={formula} />
        </motion.div>
      </div>

      {/* Visualization slot */}
      {renderVisualization && (
        <div className="mx-4 mt-3">
          {renderVisualization(values)}
        </div>
      )}

      {/* Sliders */}
      <div className="px-4 pt-3 space-y-3 pb-4">
        {params.map(param => (
          <div key={param.key}>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>
                <LiveMath tex={param.symbol} /> — {param.label}
              </span>
              <span
                className="text-sm font-bold mono"
                style={{ color: 'var(--accent)', direction: 'ltr' }}
              >
                {values[param.key].toFixed(param.step < 1 ? 2 : 0)} {param.unit}
              </span>
            </div>

            {/* Slider with critical points */}
            <div className="relative">
              <input
                type="range"
                min={param.min}
                max={param.max}
                step={param.step}
                value={values[param.key]}
                onChange={e => setValue(param.key, parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--accent) ${
                    ((values[param.key] - param.min) / (param.max - param.min)) * 100
                  }%, var(--border) 0%)`,
                  direction: 'ltr',
                }}
              />
              {/* Critical point markers */}
              {param.criticalPoints?.map(cp => {
                const pct = ((cp.value - param.min) / (param.max - param.min)) * 100
                return (
                  <div
                    key={cp.value}
                    className="absolute top-0 flex flex-col items-center"
                    style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
                    title={cp.label}
                  >
                    <div className="w-1 h-1.5 rounded-full mt-0" style={{ background: 'var(--danger)' }} />
                    <span className="text-[9px] mt-0.5 whitespace-nowrap" style={{ color: 'var(--danger)' }}>
                      {cp.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* What-If questions */}
        {questions.length > 0 && (
          <div className="space-y-2 mt-1">
            <div className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
              שאלות חשיבה:
            </div>
            {questions.map((q, i) => (
              <div key={i}>
                <button
                  onClick={() => setActiveQ(activeQ === i ? null : i)}
                  className="w-full text-right text-xs px-3 py-2 rounded-lg transition-all"
                  style={{
                    background: activeQ === i ? 'var(--warn-soft)' : 'var(--bg-secondary)',
                    color: activeQ === i ? 'var(--warn)' : 'var(--text-muted)',
                    border: `1px solid ${activeQ === i ? 'var(--warn)' : 'transparent'}`,
                  }}
                >
                  {q.prompt}
                </button>
                {activeQ === i && (
                  <motion.div
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 text-xs px-3 py-2 rounded-lg leading-relaxed"
                    style={{ background: 'var(--success-soft)', color: 'var(--success)', border: '1px solid var(--border)' }}
                  >
                    {q.answer(values)}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  )
}
