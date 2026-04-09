/**
 * usePracticeSession — SM-2 spaced repetition + streak + XP + daily goal
 */
import { useState, useCallback } from 'react'
import type {
  PracticeQuestion, PracticeRecord, PracticeConfidence,
  DailyStats, XPRecord, BadgeRecord, BadgeId,
} from '../types'
import { PRACTICE_BANK } from '../data/practiceBank'

// ── Storage keys ──────────────────────────────────────────────────────
const KEY_Q   = (id: string) => `pq-${id}`
const KEY_DAY = 'pq-daily'
const KEY_XP  = 'pq-xp'
const KEY_BADGES = 'pq-badges'

// ── SM-2 ──────────────────────────────────────────────────────────────
const INITIAL_RECORD: Omit<PracticeRecord, 'lastSeen' | 'confidence'> = {
  timesShown: 0, interval: 1, easiness: 2.5, repetitions: 0,
}

function sm2(rec: PracticeRecord, confidence: PracticeConfidence): PracticeRecord {
  // q: knew=5, unsure=3, missed=1
  const q = confidence === 'knew' ? 5 : confidence === 'unsure' ? 3 : 1
  const ef = Math.max(1.3, rec.easiness + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const reps = q >= 3 ? rec.repetitions + 1 : 0
  let interval: number
  if (q < 3) interval = 1
  else if (reps === 1) interval = 1
  else if (reps === 2) interval = 6
  else interval = Math.round(rec.interval * ef)
  return {
    ...rec,
    lastSeen: new Date().toISOString(),
    confidence,
    timesShown: rec.timesShown + 1,
    interval,
    easiness: ef,
    repetitions: reps,
  }
}

// ── Due score: higher = more urgent ──────────────────────────────────
function dueScore(rec: PracticeRecord | null): number {
  if (!rec) return 100                     // never seen → highest priority
  if (rec.confidence === 'missed') return 80
  const daysSince = (Date.now() - new Date(rec.lastSeen).getTime()) / 86_400_000
  const overdue = daysSince - rec.interval
  if (overdue >= 0) return 60 + Math.min(overdue * 10, 30)  // due / overdue
  if (rec.confidence === 'unsure') return 20
  return Math.max(0.5, daysSince * 0.5)   // well known, cooldown
}

// ── Load / save helpers ───────────────────────────────────────────────
function load<T>(key: string, fallback: T): T {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback }
  catch { return fallback }
}
function save(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch { /* ignore */ }
}

function loadRecord(id: string): PracticeRecord | null {
  return load<PracticeRecord | null>(KEY_Q(id), null)
}
function loadAllRecords(): Record<string, PracticeRecord> {
  const out: Record<string, PracticeRecord> = {}
  PRACTICE_BANK.forEach(q => { const r = loadRecord(q.id); if (r) out[q.id] = r })
  return out
}

// ── Daily stats ────────────────────────────────────────────────────────
const TODAY = () => new Date().toISOString().slice(0, 10)

function loadDaily(): DailyStats {
  const stored = load<DailyStats | null>(KEY_DAY, null)
  if (stored?.date === TODAY()) return stored
  // new day
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
  const yDate = yesterday.toISOString().slice(0, 10)
  const prevStreak = stored?.date === yDate && stored.answered >= DAILY_GOAL
    ? stored.streak : 0
  const fresh: DailyStats = { date: TODAY(), answered: 0, knew: 0, streak: prevStreak }
  save(KEY_DAY, fresh)
  return fresh
}

export const DAILY_GOAL = 5

// ── XP ────────────────────────────────────────────────────────────────
const XP_MAP: Record<PracticeConfidence, number> = { knew: 10, unsure: 5, missed: 2 }
const DIFFICULTY_MULT: Record<1|2|3, number> = { 1: 1, 2: 1.5, 3: 2 }

function xpForAnswer(q: PracticeQuestion, c: PracticeConfidence) {
  return Math.round(XP_MAP[c] * DIFFICULTY_MULT[q.difficulty])
}

// ── Badge evaluation ───────────────────────────────────────────────────
const BADGE_DEFS: { id: BadgeId; check: (ctx: BadgeCheckCtx) => boolean; label: string; emoji: string }[] = [
  { id: 'first_session',   label: 'צעד ראשון',         emoji: '🎯',
    check: ({ progress }) => progress.total >= 1 },
  { id: 'perfect_session', label: 'סשן מושלם',         emoji: '💎',
    check: ({ progress }) => progress.total >= 10 && progress.missed === 0 },
  { id: 'streak_3',        label: '3 ימים ברצף',       emoji: '🔥',
    check: ({ daily }) => daily.streak >= 3 },
  { id: 'streak_7',        label: 'שבוע שלם',          emoji: '🔥🔥',
    check: ({ daily }) => daily.streak >= 7 },
  { id: 'streak_30',       label: 'חודש שלם!',         emoji: '⚡',
    check: ({ daily }) => daily.streak >= 30 },
  { id: 'century',         label: '100 שאלות',         emoji: '💯',
    check: ({ xp }) => xp.total >= 100 * 7 }, // ~100 questions avg XP=7
  { id: 'unit1_master',    label: 'מומחה קינטיקה',    emoji: '🌡️',
    check: ({ records }) => unitMastery(records, 1) },
  { id: 'unit2_master',    label: 'מומחה אנטרופיה',   emoji: '♾️',
    check: ({ records }) => unitMastery(records, 2) },
  { id: 'unit3_master',    label: 'מומחה תרמודינמיקה', emoji: '⚙️',
    check: ({ records }) => unitMastery(records, 3) },
  { id: 'unit4_master',    label: 'מומחה קנוני',      emoji: '📐',
    check: ({ records }) => unitMastery(records, 4) },
  { id: 'unit5_master',    label: 'מומחה קוונטי',     emoji: '⚛️',
    check: ({ records }) => unitMastery(records, 5) },
]

interface BadgeCheckCtx {
  records: Record<string, PracticeRecord>
  daily: DailyStats
  xp: XPRecord
  progress: SessionProgress
}

function unitMastery(records: Record<string, PracticeRecord>, unitId: number) {
  const qs = PRACTICE_BANK.filter(q => q.unitId === unitId)
  if (qs.length === 0) return false
  const known = qs.filter(q => records[q.id]?.confidence === 'knew').length
  return known / qs.length >= 0.7
}

// ── Weighted random ────────────────────────────────────────────────────
function pickNext(
  records: Record<string, PracticeRecord>,
  lastId: string | null,
  unitFilter: number | null,
  diffFilter: 1|2|3 | null,
): PracticeQuestion {
  let pool = PRACTICE_BANK
  if (unitFilter) pool = pool.filter(q => q.unitId === unitFilter)
  if (diffFilter) pool = pool.filter(q => q.difficulty === diffFilter)
  if (pool.length === 0) pool = PRACTICE_BANK  // fallback

  // avoid immediate repeat
  const noRepeat = pool.filter(q => q.id !== lastId)
  if (noRepeat.length > 0) pool = noRepeat

  const scored = pool.map(q => ({ q, score: dueScore(records[q.id] ?? null) }))
  const total = scored.reduce((a, b) => a + b.score, 0)
  let r = Math.random() * total
  for (const { q, score } of scored) {
    r -= score; if (r <= 0) return q
  }
  return scored[scored.length - 1].q
}

// ── Types ──────────────────────────────────────────────────────────────
export interface SessionProgress {
  total: number; knew: number; unsure: number; missed: number; xpEarned: number
}

export const SESSION_SIZE = 10
export { BADGE_DEFS }

export function usePracticeSession(
  unitFilter: number | null,
  diffFilter: 1|2|3 | null = null,
) {
  const [records, setRecords] = useState<Record<string, PracticeRecord>>(loadAllRecords)
  const [daily,   setDaily]   = useState<DailyStats>(loadDaily)
  const [xp,      setXp]      = useState<XPRecord>(() => load<XPRecord>(KEY_XP, { total: 0, byUnit: {}, lastEarned: '' }))
  const [badges,  setBadges]  = useState<BadgeRecord[]>(() => load<BadgeRecord[]>(KEY_BADGES, []))
  const [newBadge, setNewBadge] = useState<BadgeRecord | null>(null)

  const [currentQuestion, setCurrentQuestion] = useState<PracticeQuestion>(() =>
    pickNext(loadAllRecords(), null, unitFilter, diffFilter))
  const [sessionProgress, setSessionProgress] = useState<SessionProgress>(
    { total: 0, knew: 0, unsure: 0, missed: 0, xpEarned: 0 })
  const [sessionDone, setSessionDone] = useState(false)

  const recordAnswer = useCallback((confidence: PracticeConfidence) => {
    const q = currentQuestion
    const prev = records[q.id] ?? { ...INITIAL_RECORD, lastSeen: '', confidence: 'missed' }
    const updated = sm2(prev, confidence)

    // persist
    save(KEY_Q(q.id), updated)
    const nextRecords = { ...records, [q.id]: updated }
    setRecords(nextRecords)

    // xp
    const earned = xpForAnswer(q, confidence)
    const nextXp: XPRecord = {
      total: xp.total + earned,
      byUnit: { ...xp.byUnit, [q.unitId]: (xp.byUnit[q.unitId] ?? 0) + earned },
      lastEarned: new Date().toISOString(),
    }
    save(KEY_XP, nextXp)
    setXp(nextXp)

    // daily — streak bumps exactly once when the daily goal count is just reached
    const nextAnswered = daily.answered + 1
    const nextDaily: DailyStats = {
      ...daily,
      answered: nextAnswered,
      knew: daily.knew + (confidence === 'knew' ? 1 : 0),
      streak: nextAnswered === DAILY_GOAL ? daily.streak + 1 : daily.streak,
    }
    save(KEY_DAY, nextDaily)
    setDaily(nextDaily)

    // progress
    const newProgress: SessionProgress = {
      total:     sessionProgress.total + 1,
      knew:      sessionProgress.knew   + (confidence === 'knew'   ? 1 : 0),
      unsure:    sessionProgress.unsure + (confidence === 'unsure' ? 1 : 0),
      missed:    sessionProgress.missed + (confidence === 'missed' ? 1 : 0),
      xpEarned:  sessionProgress.xpEarned + earned,
    }
    setSessionProgress(newProgress)

    // badges
    const ctx: BadgeCheckCtx = { records: nextRecords, daily: nextDaily, xp: nextXp, progress: newProgress }
    const earnedIds = new Set(badges.map(b => b.id))
    const newBadges = BADGE_DEFS.filter(bd => !earnedIds.has(bd.id) && bd.check(ctx))
    if (newBadges.length > 0) {
      const added = newBadges.map(bd => ({ id: bd.id, earnedAt: new Date().toISOString() }))
      const allBadges = [...badges, ...added]
      save(KEY_BADGES, allBadges)
      setBadges(allBadges)
      setNewBadge(added[0])
    }

    if (newProgress.total >= SESSION_SIZE) { setSessionDone(true); return }

    setCurrentQuestion(pickNext(nextRecords, q.id, unitFilter, diffFilter))
  }, [currentQuestion, records, sessionProgress, daily, xp, badges, unitFilter, diffFilter])

  const restartSession = useCallback(() => {
    const fresh = loadAllRecords()
    setRecords(fresh)
    setDaily(loadDaily())
    setCurrentQuestion(pickNext(fresh, null, unitFilter, diffFilter))
    setSessionProgress({ total: 0, knew: 0, unsure: 0, missed: 0, xpEarned: 0 })
    setSessionDone(false)
    setNewBadge(null)
  }, [unitFilter, diffFilter])

  const dismissBadge = useCallback(() => setNewBadge(null), [])

  // ── Stats ────────────────────────────────────────────────────────
  const stats = {
    totalAnswered: Object.values(records).reduce((s, r) => s + r.timesShown, 0),
    masteredCount: Object.values(records).filter(r => r.confidence === 'knew' && r.repetitions >= 2).length,
    dueCount: PRACTICE_BANK.filter(q => {
      const r = records[q.id]
      return !r || dueScore(r) >= 50
    }).length,
    byUnit: [1,2,3,4,5].map(uid => {
      const qs = PRACTICE_BANK.filter(q => q.unitId === uid)
      const known = qs.filter(q => records[q.id]?.confidence === 'knew').length
      return { unitId: uid, total: qs.length, known }
    }),
  }

  return {
    currentQuestion, sessionProgress, sessionDone,
    recordAnswer, restartSession,
    sessionSize: SESSION_SIZE,
    daily, xp, badges, newBadge, dismissBadge,
    stats,
  }
}
