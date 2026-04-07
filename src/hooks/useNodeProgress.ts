import { useState, useCallback } from 'react'
import type { NodeProgress, PhaseId, NodeStatus } from '../types'

function storageKey(nodeId: string) {
  return `stat-physics-node-${nodeId}`
}

function defaultProgress(nodeId: string): NodeProgress {
  return {
    nodeId,
    status: 'available',
    currentPhase: 'explore',
    scaffoldStep: 0,
    applyAnswered: 0,
  }
}

function load(nodeId: string): NodeProgress {
  try {
    const raw = localStorage.getItem(storageKey(nodeId))
    return raw ? JSON.parse(raw) : defaultProgress(nodeId)
  } catch {
    return defaultProgress(nodeId)
  }
}

function save(p: NodeProgress) {
  localStorage.setItem(storageKey(p.nodeId), JSON.stringify(p))
}

export function useNodeProgress(nodeId: string) {
  const [progress, setProgress] = useState<NodeProgress>(() => load(nodeId))

  const update = useCallback((patch: Partial<NodeProgress>) => {
    setProgress(prev => {
      const next = { ...prev, ...patch }
      save(next)
      return next
    })
  }, [])

  const setPhase = useCallback((phase: PhaseId) => {
    setProgress(prev => {
      const phaseOrder: PhaseId[] = ['explore', 'build', 'apply']
      const prevIdx    = phaseOrder.indexOf(prev.currentPhase)
      const nextIdx    = phaseOrder.indexOf(phase)
      const current    = nextIdx > prevIdx ? phase : prev.currentPhase
      const status: NodeStatus =
        phase === 'apply' ? 'in_progress' : prev.status === 'available' ? 'in_progress' : prev.status
      const next = { ...prev, currentPhase: current, status }
      save(next)
      return next
    })
  }, [])

  const markDone = useCallback(() => {
    setProgress(prev => {
      const next: NodeProgress = {
        ...prev,
        status: 'done',
        currentPhase: 'apply',
        completedAt: new Date().toISOString(),
      }
      save(next)
      return next
    })
  }, [])

  const advanceScaffold = useCallback(() => {
    update({ scaffoldStep: progress.scaffoldStep + 1 })
  }, [progress.scaffoldStep, update])

  return { progress, setPhase, markDone, advanceScaffold, update }
}

/* Load all nodes for a unit (to compute KnowledgeGraph status) */
export function loadAllProgress(nodeIds: string[]): Record<string, NodeProgress> {
  return Object.fromEntries(nodeIds.map(id => [id, load(id)]))
}
