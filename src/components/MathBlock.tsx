import { useMemo } from 'react'
import katex from 'katex'

interface MathProps {
  tex: string
  className?: string
}

function render(tex: string, display: boolean): string {
  try {
    return katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
      output: 'html',
      trust: false,
    })
  } catch {
    return `<span style="color:var(--danger);font-family:monospace;font-size:0.85em">[KaTeX error: ${tex}]</span>`
  }
}

/* Display-mode — centered block, no slash fractions */
export function BlockMath({ tex, className = '' }: MathProps) {
  const html = useMemo(() => render(tex, true), [tex])
  return (
    <div
      className={`math-block ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

/* Inline — sits within a sentence */
export function InlineMath({ tex, className = '' }: MathProps) {
  const html = useMemo(() => render(tex, false), [tex])
  return (
    <span
      className={`math-inline ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

/* Live — for sliders / real-time updates (not memoized) */
export function LiveMath({ tex, className = '' }: MathProps) {
  const html = render(tex, false)
  return (
    <span
      className={`math-inline ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

/* Shorthand aliases */
export const M = InlineMath
export const BM = BlockMath
