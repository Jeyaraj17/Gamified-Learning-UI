import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BadgeToast } from '../components/BadgeToast'
import { PointsHUD } from '../components/PointsHUD'
import { BADGES } from '../content/badges'
import { getWeekById } from '../content/weeks'
import { MECHANIC_REGISTRY } from '../mechanics/registry'
import { submitScore } from '../services/leaderboard'
import { syncProgress } from '../services/session'
import { useGameProgress } from '../store/useGameProgress'
import { useSession } from '../store/useSession'
import type { BadgeDef } from '../types'
import { ChallengeBriefing } from './ChallengeBriefing'

export function WeekPage() {
  const { weekId } = useParams<{ weekId: string }>()
  const week = weekId ? getWeekById(weekId) : undefined
  const employeeId = useSession((s) => s.employeeId)
  const name = useSession((s) => s.name)

  const weekProgress = useGameProgress((s) => (weekId ? s.weeks[weekId] : undefined))
  const totalPoints = useGameProgress((s) => s.totalPoints())
  const answerQuestion = useGameProgress((s) => s.answerQuestion)
  const finishWeek = useGameProgress((s) => s.finishWeek)
  const resetWeekAttempt = useGameProgress((s) => s.resetWeekAttempt)

  const [toastBadge, setToastBadge] = useState<BadgeDef | null>(null)
  const [started, setStarted] = useState(false)
  const [justFinished, setJustFinished] = useState(false)
  const knownBadges = useRef<Set<string>>(new Set(weekProgress?.badges ?? []))

  if (!week) {
    return (
      <div className="p-10 text-center text-white">
        <p>Week not found.</p>
        <Link to="/" className="underline">
          Back to archive
        </Link>
      </div>
    )
  }

  const Mechanic = MECHANIC_REGISTRY[week.mechanicId]

  function announceNewBadges(badges: string[]) {
    const fresh = badges.find((id) => !knownBadges.current.has(id))
    if (!fresh) return
    knownBadges.current.add(fresh)
    const def = BADGES[fresh]
    if (def) {
      setToastBadge(def)
      window.setTimeout(() => setToastBadge(null), 2600)
    }
  }

  function handleAnswer(correct: boolean) {
    answerQuestion(week!.id, correct)
    const updated = useGameProgress.getState().weeks[week!.id]
    if (updated) announceNewBadges(updated.badges)
  }

  function handleComplete() {
    const wasCompleted = useGameProgress.getState().weeks[week!.id]?.completed ?? false
    finishWeek(week!.id, week!.questions.length)
    const updated = useGameProgress.getState().weeks[week!.id]
    if (updated) announceNewBadges(updated.badges)

    if (!wasCompleted && employeeId) {
      const allWeeks = useGameProgress.getState().weeks
      const weeksCompleted = Object.values(allWeeks).filter((w) => w.completed).length
      submitScore(employeeId, useGameProgress.getState().totalPoints(), weeksCompleted)
      syncProgress(employeeId, allWeeks)
    }

    setJustFinished(true)
  }

  function handleRestart() {
    resetWeekAttempt(week!.id)
    knownBadges.current = new Set()
  }

  const streak = weekProgress?.currentStreak ?? 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-indigo-800 to-slate-900 px-4 py-6 text-white">
      <BadgeToast badge={toastBadge} />

      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <Link to="/" className="text-sm font-semibold text-indigo-200 hover:text-white">
          ← Archive
        </Link>
        <PointsHUD points={totalPoints} streak={streak} />
      </div>

      <div className="mx-auto mt-4 max-w-2xl">
        <h1 className="font-display text-3xl text-amber-300">{week.title}</h1>
        <p className="text-indigo-200">{week.topic}</p>
      </div>

      <div className="mx-auto mt-6 max-w-2xl">
        {justFinished ? (
          <div className="rounded-2xl bg-white/95 p-8 text-center text-slate-800 shadow-2xl">
            <p className="text-4xl">🏁</p>
            <h2 className="font-display mt-2 text-2xl text-indigo-700">Week complete!</h2>
            <p className="mt-1 text-slate-500">
              {weekProgress?.correct ?? 0} / {week.questions.length} correct
            </p>
            <Link
              to="/"
              className="btn-game mt-4 inline-block rounded-2xl bg-gradient-to-b from-indigo-500 to-indigo-700 px-6 py-2 font-semibold text-white"
            >
              Back to archive
            </Link>
          </div>
        ) : started ? (
          <Mechanic
            questions={week.questions}
            onAnswer={handleAnswer}
            onComplete={handleComplete}
            onRestart={handleRestart}
          />
        ) : (
          <ChallengeBriefing
            week={week}
            progress={weekProgress}
            name={name}
            onStart={() => setStarted(true)}
          />
        )}
      </div>
    </div>
  )
}
