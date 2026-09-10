import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { subscribeToLeaderboard, type LeaderboardEntry } from '../services/leaderboard'
import { useSession } from '../store/useSession'

const MEDALS = ['🥇', '🥈', '🥉']

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null)
  const employeeId = useSession((s) => s.employeeId)

  useEffect(() => {
    const unsubscribe = subscribeToLeaderboard(setEntries)
    return unsubscribe
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-indigo-800 to-slate-900 px-4 py-8 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl text-amber-300 drop-shadow-[2px_2px_0_rgba(0,0,0,0.35)]">
              🏆 Leaderboard
            </h1>
            <p className="text-indigo-200">Top scores across the team.</p>
          </div>
          <Link to="/" className="text-sm font-semibold text-indigo-200 hover:text-white">
            ← Archive
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl bg-white/95 shadow-xl">
          {entries === null ? (
            <p className="p-6 text-center text-slate-500">Loading scores...</p>
          ) : entries.length === 0 ? (
            <p className="p-6 text-center text-slate-500">No scores yet — be the first to complete a challenge!</p>
          ) : (
            entries.map((entry, i) => (
              <div
                key={entry.employeeId}
                className={`flex items-center justify-between px-5 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'} ${
                  entry.employeeId === employeeId ? 'ring-2 ring-inset ring-indigo-400' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 text-center text-lg font-bold text-slate-500">
                    {MEDALS[i] ?? i + 1}
                  </span>
                  <span className="font-semibold text-slate-800">{entry.employeeId}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span>{entry.weeksCompleted} weeks</span>
                  <span className="font-bold text-indigo-600">{entry.totalPoints} pts</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
