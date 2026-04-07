import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { UNITS, ALL_NODES } from '../data/units'
import { loadAllProgress } from '../hooks/useNodeProgress'
import type { NodeStatus, NodeMeta } from '../types'

interface Props {
  onNodeClick: (nodeId: string) => void
}

const STATUS_COLORS: Record<NodeStatus, string> = {
  locked:      'var(--border)',
  available:   'var(--text-muted)',
  in_progress: 'var(--accent)',
  done:        'var(--success)',
}

const UNIT_COLORS = [
  '#0D9488', // teal   — unit 1
  '#7C3AED', // violet — unit 2
  '#EA580C', // orange — unit 3
  '#0369A1', // blue   — unit 4
  '#BE185D', // pink   — unit 5
]

// Layout: 5 columns (one per unit), nodes stacked vertically
const COL_W  = 160
const ROW_H  = 90
const PAD_X  = 40
const PAD_Y  = 50
const NODE_W = 130
const NODE_H = 56
const R      = 10

export default function KnowledgeGraph({ onNodeClick }: Props) {
  const allNodeIds = ALL_NODES.map(n => n.id)
  const allProgress = useMemo(() => loadAllProgress(allNodeIds), [])

  // Compute positions
  const positions: Record<string, { x: number; y: number }> = {}
  UNITS.forEach((unit, ui) => {
    unit.nodes.forEach((node, ni) => {
      positions[node.id] = {
        x: PAD_X + ui * COL_W,
        y: PAD_Y + ni * ROW_H,
      }
    })
  })

  const maxRows = Math.max(...UNITS.map(u => u.nodes.length))
  const svgW    = PAD_X * 2 + (UNITS.length - 1) * COL_W + NODE_W
  const svgH    = PAD_Y * 2 + (maxRows - 1) * ROW_H + NODE_H

  // Build edges from prereqs
  const edges: { from: NodeMeta; to: NodeMeta }[] = []
  ALL_NODES.forEach(node => {
    node.prereqs.forEach(reqId => {
      const from = ALL_NODES.find(n => n.id === reqId)
      if (from) edges.push({ from, to: node })
    })
  })

  function getStatus(nodeId: string): NodeStatus {
    return allProgress[nodeId]?.status ?? 'available'
  }

  return (
    <div className="w-full overflow-x-auto" style={{ background: 'var(--bg-secondary)', borderRadius: 20, padding: 12 }}>
      {/* Unit legends */}
      <div className="flex gap-4 flex-wrap mb-3 px-2">
        {UNITS.map((u, i) => (
          <div key={u.id} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: UNIT_COLORS[i] }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              יחידה {u.id}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 mr-2">
          <div className="w-3 h-3 rounded-full" style={{ background: 'var(--success)' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>הושלם</span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        width="100%"
        style={{ minWidth: svgW, direction: 'ltr' }}
      >
        {/* Edges */}
        {edges.map(({ from, to }, i) => {
          const fx = positions[from.id].x + NODE_W / 2
          const fy = positions[from.id].y + NODE_H
          const tx = positions[to.id].x + NODE_W / 2
          const ty = positions[to.id].y
          const my = (fy + ty) / 2

          return (
            <path
              key={i}
              d={`M ${fx} ${fy} C ${fx} ${my}, ${tx} ${my}, ${tx} ${ty}`}
              fill="none"
              stroke="var(--border)"
              strokeWidth={1.5}
              strokeDasharray={from.unitId !== to.unitId ? '4 3' : undefined}
            />
          )
        })}

        {/* Nodes */}
        {ALL_NODES.map(node => {
          const { x, y } = positions[node.id]
          const status    = getStatus(node.id)
          const unitIdx   = node.unitId - 1
          const color     = UNIT_COLORS[unitIdx]
          const isDone    = status === 'done'
          const isActive  = status === 'in_progress'

          return (
            <motion.g
              key={node.id}
              style={{ cursor: 'pointer' }}
              whileHover={{ scale: 1.04 }}
              onClick={() => onNodeClick(node.id)}
            >
              {/* Card bg */}
              <rect
                x={x}
                y={y}
                width={NODE_W}
                height={NODE_H}
                rx={R}
                ry={R}
                fill="var(--card)"
                stroke={isDone ? 'var(--success)' : isActive ? color : 'var(--border)'}
                strokeWidth={isDone || isActive ? 1.5 : 1}
              />
              {/* Color accent bar */}
              <rect
                x={x}
                y={y}
                width={6}
                height={NODE_H}
                rx={R / 2}
                ry={R / 2}
                fill={color}
                opacity={isDone ? 1 : 0.5}
              />

              {/* Node ID badge */}
              <text
                x={x + 14}
                y={y + 16}
                fontSize={8}
                fontWeight={700}
                fill={color}
                textAnchor="middle"
              >
                {node.id}
              </text>

              {/* Title */}
              <foreignObject x={x + 16} y={y + 8} width={NODE_W - 20} height={NODE_H - 12}>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    color: 'var(--text)',
                    fontFamily: 'Heebo, sans-serif',
                    direction: 'rtl',
                    lineHeight: 1.3,
                    marginTop: 12,
                    paddingRight: 2,
                  }}
                >
                  {node.title}
                </div>
              </foreignObject>

              {/* Status dot */}
              <circle
                cx={x + NODE_W - 10}
                cy={y + 10}
                r={4}
                fill={STATUS_COLORS[status]}
              />

              {/* Scaffolded indicator */}
              {node.isScaffolded && (
                <text x={x + NODE_W - 20} y={y + NODE_H - 7} fontSize={9} fill="var(--warn)">⚙️</text>
              )}
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}
