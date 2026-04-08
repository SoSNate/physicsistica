import { useState, useCallback } from 'react'
import type { PracticeQuestion, PracticeRecord, PracticeConfidence } from '../types'
import { PRACTICE_BANK } from '../data/practiceBank'

const storageKey = (id: string) => `stat-physics-pq-${id}`

function loadRecord(id: string): PracticeRecord | null {
  try {
    const raw = localStorage.getItem(storageKey(id))
    return raw ? (JSON.parse(raw) as PracticeRecord) : null
  } catch {
    return null
  }
}

function saveRecord(id: string, rec: PracticeRecord) {
  try {
    localStorage.setItem(storageKey(id), JSON.stringify(rec))
  } catch {
    // ignore storage errors
  }
}

function loadAllRecords(bank: PracticeQuestion[]): Record<string, PracticeRecord> {
  const out: Record<string, PracticeRecord> = {}
  bank.forEach(q => {
    const r = loadRecord(q.id)
    if (r) out[q.id] = r
  })
  return out
}

function weightedRandom<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]
    if (r <= 0) return items[i]
  }
  return items[items.length - 1]
}

function pickNext(
  bank: PracticeQuestion[],
  records: Record<string, PracticeRecord>,
  lastNodeId: string | null,
  unitFilter: number | null,
  excludeId: string | null,
): PracticeQuestion {
  let pool = unitFilter ? bank.filter(q => q.unitId === unitFilter) : [...bank]

  // avoid repeating same node back-to-back (fall back to full pool if needed)
  const noRepeat = pool.filter(q => q.nodeId !== lastNodeId)
  if (noRepeat.length > 0) pool = noRepeat

  // avoid showing same question twice in a row
  if (excludeId) {
    const noSame = pool.filter(q => q.id !== excludeId)
    if (noSame.length > 0) pool = noSame
  }

  const weights = pool.map(q => {
    const rec = records[q.id]
    if (!rec) return 10
    if (rec.confidence === 'missed') return 8
    if (rec.confidence === 'unsure') return 4
    // knew — spaced repetition by days since last seen
    const daysSince = (Date.now() - new Date(rec.lastSeen).getTime()) / 86_400_000
    return Math.max(0.5, Math.min(daysSince, 3))
  })

  return weightedRandom(pool, weights)
}

export interface SessionProgress {
  total: number
  knew: number
  unsure: number
  missed: number
}

const SESSION_SIZE = 10

export function usePracticeSession(unitFilter: number | null) {
  const [records, setRecords] = useState<Record<string, PracticeRecord>>(() =>
    loadAllRecords(PRACTICE_BANK),
  )
  const [lastNodeId, setLastNodeId] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<PracticeQuestion>(() =>
    pickNext(PRACTICE_BANK, loadAllRecords(PRACTICE_BANK), null, unitFilter, null),
  )
  const [revealed, setReveal] = useState(false)
  const [sessionProgress, setSessionProgress] = useState<SessionProgress>({
    total: 0,
    knew: 0,
    unsure: 0,
    missed: 0,
  })
  const [sessionDone, setSessionDone] = useState(false)

  const recordAnswer = useCallback(
    (confidence: PracticeConfidence) => {
      const qId = currentQuestion.id
      const existing = records[qId]
      const updated: PracticeRecord = {
        lastSeen: new Date().toISOString(),
        confidence,
        timesShown: (existing?.timesShown ?? 0) + 1,
      }
      saveRecord(qId, updated)
      const nextRecords = { ...records, [qId]: updated }
      setRecords(nextRecords)

      const newProgress: SessionProgress = {
        total:  sessionProgress.total + 1,
        knew:   sessionProgress.knew   + (confidence === 'knew'   ? 1 : 0),
        unsure: sessionProgress.unsure + (confidence === 'unsure' ? 1 : 0),
        missed: sessionProgress.missed + (confidence === 'missed' ? 1 : 0),
      }
      setSessionProgress(newProgress)

      if (newProgress.total >= SESSION_SIZE) {
        setSessionDone(true)
        return
      }

      setLastNodeId(currentQuestion.nodeId)
      const next = pickNext(PRACTICE_BANK, nextRecords, currentQuestion.nodeId, unitFilter, qId)
      setCurrentQuestion(next)
      setReveal(false)
    },
    [currentQuestion, records, sessionProgress, unitFilter],
  )

  const restartSession = useCallback(() => {
    const freshRecords = loadAllRecords(PRACTICE_BANK)
    setRecords(freshRecords)
    setLastNodeId(null)
    setCurrentQuestion(pickNext(PRACTICE_BANK, freshRecords, null, unitFilter, null))
    setReveal(false)
    setSessionProgress({ total: 0, knew: 0, unsure: 0, missed: 0 })
    setSessionDone(false)
  }, [unitFilter])

  return {
    currentQuestion,
    revealed,
    setReveal,
    sessionProgress,
    sessionDone,
    recordAnswer,
    restartSession,
    sessionSize: SESSION_SIZE,
  }
}
