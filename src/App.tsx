import React, { useState, useEffect, lazy, Suspense, Component } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, BarChart2, Map, ChevronLeft, Target } from 'lucide-react'
import ThemeToggle from './components/ThemeToggle'
import GlassCard from './components/GlassCard'
import KnowledgeGraph from './components/KnowledgeGraph'
import PracticeMode from './components/PracticeMode'
import { UNITS, ALL_NODES } from './data/units'
import { loadAllProgress } from './hooks/useNodeProgress'

// ── Lazy-load all nodes ────────────────────────────────────────────
// Unit 1
const Node11 = lazy(() => import('./units/unit1/Node11'))
const Node12 = lazy(() => import('./units/unit1/Node12'))
const Node13 = lazy(() => import('./units/unit1/Node13'))
const Node14 = lazy(() => import('./units/unit1/Node14'))
const Node15 = lazy(() => import('./units/unit1/Node15'))
const Node16 = lazy(() => import('./units/unit1/Node16'))
// Unit 2
const Node21 = lazy(() => import('./units/unit2/Node21'))
const Node22 = lazy(() => import('./units/unit2/Node22'))
const Node23 = lazy(() => import('./units/unit2/Node23'))
const Node24 = lazy(() => import('./units/unit2/Node24'))
const Node25 = lazy(() => import('./units/unit2/Node25'))
// Unit 3
const Node31 = lazy(() => import('./units/unit3/Node31'))
const Node32 = lazy(() => import('./units/unit3/Node32'))
const Node33 = lazy(() => import('./units/unit3/Node33'))
const Node34 = lazy(() => import('./units/unit3/Node34'))
const Node35 = lazy(() => import('./units/unit3/Node35'))
const Node36 = lazy(() => import('./units/unit3/Node36'))
// Unit 4
const Node41 = lazy(() => import('./units/unit4/Node41'))
const Node42 = lazy(() => import('./units/unit4/Node42'))
const Node43 = lazy(() => import('./units/unit4/Node43'))
const Node44 = lazy(() => import('./units/unit4/Node44'))
const Node45 = lazy(() => import('./units/unit4/Node45'))
const Node46 = lazy(() => import('./units/unit4/Node46'))
// Unit 5
const Node51 = lazy(() => import('./units/unit5/Node51'))
const Node52 = lazy(() => import('./units/unit5/Node52'))
const Node53 = lazy(() => import('./units/unit5/Node53'))
const Node54 = lazy(() => import('./units/unit5/Node54'))
const Node55 = lazy(() => import('./units/unit5/Node55'))

type Screen = 'home' | 'unit' | 'node' | 'graph' | 'practice'

const UNIT_COLORS = [
  '#0D9488', '#7C3AED', '#EA580C', '#0369A1', '#BE185D',
]

export default function App() {
  const [screen, setScreen]       = useState<Screen>('home')
  const [activeUnit, setActiveUnit] = useState<number | null>(null)
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)

  // Force apply saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('stat-physics-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark', saved ? saved === 'dark' : prefersDark)
  }, [])

  function openUnit(unitId: number) {
    setActiveUnit(unitId)
    setScreen('unit')
  }

  function openNode(nodeId: string) {
    setActiveNodeId(nodeId)
    setScreen('node')
  }

  function goHome() {
    setScreen('home')
    setActiveUnit(null)
    setActiveNodeId(null)
  }

  // ── Render node ────────────────────────────────────────────────────
  if (screen === 'node' && activeNodeId) {
    const NodeComponent = resolveNode(activeNodeId)
    const handleBack = () => {
      const node = ALL_NODES.find(n => n.id === activeNodeId)
      if (node) { setActiveUnit(node.unitId); setScreen('unit') }
      else goHome()
    }
    if (NodeComponent) {
      return (
        <NodeErrorBoundary onBack={handleBack}>
          <Suspense fallback={<LoadingScreen />}>
            <NodeComponent onBack={handleBack} />
          </Suspense>
        </NodeErrorBoundary>
      )
    }
    return <ComingSoon nodeId={activeNodeId} onBack={() => { setScreen('unit') }} />
  }

  // ── Practice mode ─────────────────────────────────────────────────
  if (screen === 'practice') {
    return <PracticeMode onBack={goHome} />
  }

  // ── Knowledge graph ────────────────────────────────────────────────
  if (screen === 'graph') {
    return (
      <div dir="rtl" className="min-h-screen p-4" style={{ background: 'var(--bg)' }}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={goHome} className="flex items-center gap-1 text-sm rounded-xl px-3 py-1.5 transition-all"
            style={{ color: 'var(--text-muted)', background: 'var(--accent-soft)' }}>
            <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} />
            חזרה
          </button>
          <h2 className="font-bold text-lg" style={{ color: 'var(--text)' }}>מפת הידע — פיסיקה סטטיסטית</h2>
          <div className="mr-auto"><ThemeToggle /></div>
        </div>
        <KnowledgeGraph onNodeClick={id => openNode(id)} />
      </div>
    )
  }

  // ── Unit screen ────────────────────────────────────────────────────
  if (screen === 'unit' && activeUnit) {
    const unit = UNITS.find(u => u.id === activeUnit)
    if (!unit) { goHome(); return null }
    const progress = loadAllProgress(unit.nodes.map(n => n.id))
    const color = UNIT_COLORS[activeUnit - 1]

    return (
      <div dir="rtl" className="min-h-screen p-4" style={{ background: 'var(--bg)' }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={goHome} className="flex items-center gap-1 text-sm rounded-xl px-3 py-1.5"
            style={{ color: 'var(--text-muted)', background: 'var(--accent-soft)' }}>
            <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} />
            חזרה
          </button>
          <div>
            <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>יחידה {unit.id}</div>
            <h1 className="font-bold text-xl leading-tight" style={{ color: 'var(--text)' }}>{unit.title}</h1>
          </div>
          <div className="mr-auto"><ThemeToggle /></div>
        </div>

        {/* Node cards */}
        <div className="space-y-3">
          {unit.nodes.map((node, i) => {
            const np = progress[node.id]
            const isDone = np?.status === 'done'
            const isActive = np?.status === 'in_progress'

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <GlassCard
                  hover
                  padding="md"
                  onClick={() => openNode(node.id)}
                  style={{ borderColor: isDone ? 'var(--success)' : isActive ? color : undefined }}
                >
                  <div className="flex items-start gap-3">
                    {/* Number badge */}
                    <span
                      className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{ background: `color-mix(in srgb, ${color} 18%, transparent)`, color }}
                    >
                      {node.id}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{node.title}</h3>
                        {node.isScaffolded && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                            style={{ background: 'var(--warn-soft)', color: 'var(--warn)' }}>⚙️ גזירה</span>
                        )}
                        {isDone && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                            style={{ background: 'var(--success-soft)', color: 'var(--success)' }}>✓ הושלם</span>
                        )}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{node.subtitle}</p>
                      {/* Phase progress dots */}
                      <div className="flex gap-1.5 mt-2">
                        {(['explore', 'build', 'apply'] as const).map(ph => {
                          const phOrder = ['explore', 'build', 'apply']
                          const reached = phOrder.indexOf(np?.currentPhase ?? 'explore')
                          const me = phOrder.indexOf(ph)
                          return (
                            <div key={ph} className="w-4 h-1 rounded-full transition-all"
                              style={{ background: me <= reached || isDone ? color : 'var(--border)' }} />
                          )
                        })}
                      </div>
                    </div>
                    <ChevronLeft size={14} style={{ color: 'var(--text-muted)', flexShrink: 0, transform: 'rotate(180deg)' }} />
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Home screen ────────────────────────────────────────────────────
  const allProgress = loadAllProgress(ALL_NODES.map(n => n.id))
  const totalDone = Object.values(allProgress).filter(p => p.status === 'done').length
  const totalNodes = ALL_NODES.length

  return (
    <div dir="rtl" className="min-h-screen p-4 pb-8" style={{ background: 'var(--bg)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold leading-tight" style={{ color: 'var(--text)' }}>
            פיסיקה סטטיסטית
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            האוניברסיטה הפתוחה — 20314-3011
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScreen('graph')}
            className="flex items-center gap-1.5 text-xs rounded-xl px-3 py-1.5 font-medium transition-all"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            <Map size={13} />
            מפת ידע
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Overall progress bar */}
      <GlassCard padding="sm" className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <BarChart2 size={13} style={{ color: 'var(--accent)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>התקדמות כללית</span>
          </div>
          <span className="text-xs font-bold mono" style={{ color: 'var(--accent)', direction: 'ltr' }}>
            {totalDone}/{totalNodes}
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--accent)' }}
            initial={{ width: 0 }}
            animate={{ width: `${(totalDone / totalNodes) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </GlassCard>

      {/* Unit cards */}
      <div className="space-y-3">
        {UNITS.map((unit, i) => {
          const color = UNIT_COLORS[i]
          const unitProgress = loadAllProgress(unit.nodes.map(n => n.id))
          const done = Object.values(unitProgress).filter(p => p.status === 'done').length
          const pct  = (done / unit.nodes.length) * 100

          return (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard hover padding="md" onClick={() => openUnit(unit.id)}>
                <div className="flex items-center gap-3">
                  <span
                    className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: `color-mix(in srgb, ${color} 16%, transparent)` }}
                  >
                    {unit.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[10px] font-semibold" style={{ color }}>יחידה {unit.id}</span>
                      <h2 className="font-bold text-sm truncate" style={{ color: 'var(--text)' }}>{unit.title}</h2>
                    </div>
                    <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{unit.subtitle}</p>
                    {/* Mini progress */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <span className="text-[10px] font-bold mono" style={{ color, direction: 'ltr' }}>
                        {done}/{unit.nodes.length}
                      </span>
                    </div>
                  </div>
                  <BookOpen size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────
function resolveNode(nodeId: string) {
  const map: Record<string, React.LazyExoticComponent<React.ComponentType<{ onBack: () => void }>>> = {
    '1.1': Node11, '1.2': Node12, '1.3': Node13, '1.4': Node14, '1.5': Node15, '1.6': Node16,
    '2.1': Node21, '2.2': Node22, '2.3': Node23, '2.4': Node24, '2.5': Node25,
    '3.1': Node31, '3.2': Node32, '3.3': Node33, '3.4': Node34, '3.5': Node35, '3.6': Node36,
    '4.1': Node41, '4.2': Node42, '4.3': Node43, '4.4': Node44, '4.5': Node45, '4.6': Node46,
    '5.1': Node51, '5.2': Node52, '5.3': Node53, '5.4': Node54, '5.5': Node55,
  }
  return map[nodeId] ?? null
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="text-sm anim-pulse" style={{ color: 'var(--text-muted)' }}>טוען...</div>
    </div>
  )
}

class NodeErrorBoundary extends Component<
  { children: React.ReactNode; onBack: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onBack: () => void }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return (
        <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center gap-4 p-6" style={{ background: 'var(--bg)' }}>
          <div className="text-4xl">⚠️</div>
          <h2 className="font-bold text-lg text-center" style={{ color: 'var(--text)' }}>אירעה שגיאה בטעינת הצומת</h2>
          <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>נסה לרענן את הדף, או חזור לרשימת הצמתים.</p>
          <button
            onClick={this.props.onBack}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            חזרה
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function ComingSoon({ nodeId, onBack }: { nodeId: string; onBack: () => void }) {
  const node = ALL_NODES.find(n => n.id === nodeId)
  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center gap-4 p-6" style={{ background: 'var(--bg)' }}>
      <div className="text-4xl">🚧</div>
      <h2 className="font-bold text-lg text-center" style={{ color: 'var(--text)' }}>
        {node?.title ?? `Node ${nodeId}`}
      </h2>
      <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
        יחידה זו בפיתוח — בקרוב!
      </p>
      <button
        onClick={onBack}
        className="px-5 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        חזרה
      </button>
    </div>
  )
}
