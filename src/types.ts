import type { ReactNode } from 'react'

/* ─── Node (module) metadata ─────────────────────────────────────── */
export type NodeStatus = 'locked' | 'available' | 'in_progress' | 'done'
export type NodeType = 'Concept' | 'Theorem' | 'Procedure' | 'Application'
export type PhaseId = 'explore' | 'build' | 'apply'

export interface NodeMeta {
  id: string              // e.g. "1.2"
  unitId: number          // 1–5
  title: string           // "משוואת המצב הקינטית"
  subtitle: string
  type: NodeType
  isScaffolded: boolean   // ⚙️ flag
  prereqs: string[]       // node IDs that must be done first
  color: string           // tailwind gradient class
}

/* ─── Scaffolded Derivation ─────────────────────────────────────── */
export interface InterimQuestion {
  prompt: string
  hint: string
  validate: (input: string) => boolean
  correctAnswer?: string  // shown after 2 failed attempts
}

export interface DerivationStep {
  title: string
  content: ReactNode
  interimQuestion?: InterimQuestion
}

/* ─── Apply phase questions ─────────────────────────────────────── */
export type QuestionType = 'what_if' | 'limit' | 'model_compare' | 'numeric'

export interface ApplyQuestion {
  id: string
  type: QuestionType
  prompt: ReactNode
  hint: string
  trapWarning?: string    // common mistake to avoid
  validate: (input: string) => boolean
  solution: ReactNode
}

/* ─── Trap Card ─────────────────────────────────────────────────── */
export interface TrapInfo {
  title: string           // "הבלבול הקלאסי"
  description: ReactNode
  wrongFormula?: string   // LaTeX — the wrong version
  rightFormula?: string   // LaTeX — the correct version
  examExample?: ReactNode // real exam question that exploits this trap
}

/* ─── Progress tracking ─────────────────────────────────────────── */
export interface NodeProgress {
  nodeId: string
  status: NodeStatus
  currentPhase: PhaseId
  scaffoldStep: number    // which derivation step reached
  applyAnswered: number   // how many apply questions answered
  completedAt?: string    // ISO timestamp
}

/* ─── Unit metadata ─────────────────────────────────────────────── */
export interface UnitMeta {
  id: number
  title: string
  subtitle: string
  icon: string            // emoji
  color: string           // CSS gradient string
  nodes: NodeMeta[]
}
