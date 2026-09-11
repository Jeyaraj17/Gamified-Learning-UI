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

type Phase = 'briefing' | 'playing' | 'finished' | 'gameover'

export function WeekPage() {
  const { weekId } = useParams<{ weekId: string }>()
  const week = weekId ? getWeekById(weekId) : undefined
  const employeeId = useSession((s) => s.employeeId)
  const name = useSession((s) => s.name)

  const weekProgress = useGameProgress((s) => (weekId ? s.weeks[weekId] : undefined))
  const totalPoints = useGameProgress((s) => s.totalPoints())
  const weekPoints = useGameProgress((s) => (weekId ? s.weekPoints(weekId) : 0))
  const answerQuestion = useGameProgress((s) => s.answerQuestion)
  const finishWeek = useGameProgress((s) => s.finishWeek)
  const failWeek = useGameProgress((s) => s.failWeek)

  const [toastBadge, setToastBadge] = useState<BadgeDef | null>(null)
  const [phase, setPhase] = useState<Phase>('briefing')
  const [attempt, setAttempt] = useState(0)
  const [justRecorded, setJustRecorded] = useState(false)
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

  // Locks the score in on the first run that reaches an end, then publishes it.
  // Later replays are practice only — the store ignores them once completed.
  function finalize(outcome: 'finished' | 'gameover') {
    const alreadyLocked = useGameProgress.getState().weeks[week!.id]?.completed ?? false

    if (outcome === 'finished') finishWeek(week!.id, week!.questions.length)
    else failWeek(week!.id)

    const updated = useGameProgress.getState().weeks[week!.id]
    if (updated) announceNewBadges(updated.badges)

    if (!alreadyLocked && employeeId) {
      const allWeeks = useGameProgress.getState().weeks
      const weeksCompleted = Object.values(allWeeks).filter((w) => w.completed && !w.failed).length
      submitScore(employeeId, useGameProgress.getState().totalPoints(), weeksCompleted)
      syncProgress(employeeId, allWeeks)
    }

    setJustRecorded(!alreadyLocked)
    setPhase(outcome)
  }

  function restart() {
    setAttempt((a) => a + 1)
    setPhase('playing')
  }

  const streak = weekProgress?.currentStreak ?? 0
  const scoreLine = `${weekProgress?.correct ?? 0} / ${week.questions.length} correct · ${weekPoints} pts`

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
        {phase === 'gameover' ? (
          <div className="rounded-3xl border-4 border-red-300 bg-white/95 p-8 text-center text-slate-800 shadow-2xl">
            <p className="text-5xl">💀</p>
            <h2 className="font-display mt-2 text-4xl text-red-500">GAME OVER</h2>
            <p className="mt-1 text-slate-500">You ran out of lives!</p>

            <div className="mx-auto mt-5 max-w-xs rounded-2xl bg-slate-100 p-4">
              <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">
                {justRecorded ? 'Final score' : 'Your recorded score'}
              </p>
              <p className="font-display mt-1 text-2xl text-indigo-700">{scoreLine}</p>
            </div>

            <p className="mx-auto mt-4 max-w-sm text-xs text-slate-400">
              {justRecorded
                ? 'This score is final and has been recorded on the leaderboard. You can replay for practice, but your score stays as is.'
                : 'Practice run — your recorded score is unchanged.'}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={restart}
                className="btn-game rounded-2xl bg-gradient-to-b from-amber-400 to-orange-500 px-6 py-3 font-bold text-white"
              >
                Restart 🔁
              </button>
              <Link
                to="/"
                className="btn-game rounded-2xl bg-gradient-to-b from-indigo-500 to-indigo-700 px-6 py-3 font-bold text-white"
              >
                Back to archive
              </Link>
            </div>
          </div>
        ) : phase === 'finished' ? (
          <div className="rounded-3xl border-4 border-emerald-300 bg-white/95 p-8 text-center text-slate-800 shadow-2xl">
            <p className="text-5xl">🏁</p>
            <h2 className="font-display mt-2 text-4xl text-emerald-600">CHALLENGE COMPLETE!</h2>
            <p className="mt-1 text-slate-500">You made it to the finish flag.</p>

            <div className="mx-auto mt-5 max-w-xs rounded-2xl bg-slate-100 p-4">
              <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">
                {justRecorded ? 'Final score' : 'Your recorded score'}
              </p>
              <p className="font-display mt-1 text-2xl text-indigo-700">{scoreLine}</p>
            </div>

            <p className="mx-auto mt-4 max-w-sm text-xs text-slate-400">
              {justRecorded
                ? 'This score is final and has been recorded on the leaderboard.'
                : 'Practice run — your recorded score is unchanged.'}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={restart}
                className="btn-game rounded-2xl bg-gradient-to-b from-amber-400 to-orange-500 px-6 py-3 font-bold text-white"
              >
                Replay 🔁
              </button>
              <Link
                to="/"
                className="btn-game rounded-2xl bg-gradient-to-b from-indigo-500 to-indigo-700 px-6 py-3 font-bold text-white"
              >
                Back to archive
              </Link>
            </div>
          </div>
        ) : phase === 'playing' ? (
          <Mechanic
            key={attempt}
            questions={week.questions}
            onAnswer={handleAnswer}
            onComplete={() => finalize('finished')}
            onGameOver={() => finalize('gameover')}
          />
        ) : (
          <ChallengeBriefing
            week={week}
            progress={weekProgress}
            name={name}
            onStart={() => setPhase('playing')}
          />
        )}
      </div>
    </div>
  )
}
