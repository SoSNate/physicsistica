import type { ReactNode, CSSProperties } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: () => void
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
}

export default function GlassCard({
  children,
  className = '',
  style,
  onClick,
  hover = false,
  padding = 'md',
}: GlassCardProps) {
  const hoverCls = hover
    ? 'cursor-pointer transition-all duration-200 hover:scale-[1.01]'
    : ''

  return (
    <div
      className={`rounded-2xl ${paddingMap[padding]} ${hoverCls} ${className}`}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
