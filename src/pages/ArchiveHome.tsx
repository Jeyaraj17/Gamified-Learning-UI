import { Link } from 'react-router-dom'
import { PointsHUD } from '../components/PointsHUD'
import { BADGES } from '../content/badges'
import { WEEKS } from '../content/weeks'
import { useGameProgress } from '../store/useGameProgress'
import { useSession } from '../store/useSession'

export function ArchiveHome() {
  const weeksProgress = useGameProgress((s) => s.weeks)
  const totalPoints = useGameProgress((s) => s.totalPoints())
  const name = useSession((s) => s.name)
  const logout = useSession((s) => s.logout)

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-indigo-800 to-slate-900 px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl text-amber-300 drop-shadow-[2px_2px_0_rgba(0,0,0,0.35)]">
              🎮 Learning Quest
            </h1>
            <p className="text-indigo-200">
              Hi {name} ·{' '}
              <button onClick={logout} className="underline hover:text-white">
                switch user
              </button>
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <PointsHUD points={totalPoints} streak={0} />
            <Link
              to="/leaderboard"
              className="text-sm font-semibold text-indigo-200 hover:text-white"
            >
              🏆 Leaderboard
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {WEEKS.map((week) => {
            const progress = weeksProgress[week.id]
            const completed = progress?.completed ?? false
            return (
              <Link
                key={week.id}
                to={`/week/${week.id}`}
                className="rounded-2xl border-b-4 border-indigo-200 bg-white/95 p-5 text-slate-800 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <p className="text-xs font-bold tracking-wide text-indigo-500 uppercase">
                  Week {week.weekNumber}
                </p>
                <h2 className="font-display mt-1 text-xl text-indigo-700">{week.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{week.topic}</p>
                <p className="mt-3 text-sm text-slate-400">{week.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {completed ? (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      ✅ Completed
                    </span>
                  ) : (
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                      ▶ Play
                    </span>
                  )}
                  {progress?.badges.map((id) => {
                    const def = BADGES[id]
                    if (!def) return null
                    return (
                      <span key={id} title={def.label} className="text-lg">
                        {def.emoji}
                      </span>
                    )
                  })}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
