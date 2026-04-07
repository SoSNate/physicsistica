import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('stat-physics-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('stat-physics-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      onClick={() => setDark(d => !d)}
      className="rounded-full p-2 transition-all duration-200 active:scale-90"
      style={{
        background: 'var(--accent-soft)',
        color: 'var(--accent)',
        border: '1px solid var(--border)',
      }}
      aria-label={dark ? 'עבור למצב יום' : 'עבור למצב לילה'}
      title={dark ? 'מצב יום' : 'מצב לילה'}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
