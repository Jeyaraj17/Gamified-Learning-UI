const POLL_INTERVAL_MS = 8000

export interface LeaderboardEntry {
  employeeId: string
  name: string
  totalPoints: number
  weeksCompleted: number
}

export function subscribeToLeaderboard(callback: (entries: LeaderboardEntry[]) => void) {
  let cancelled = false

  async function fetchOnce() {
    try {
      const res = await fetch('/api/scores')
      if (!res.ok) throw new Error('Failed to load leaderboard')
      const data: LeaderboardEntry[] = await res.json()
      if (!cancelled) callback(data)
    } catch {
      if (!cancelled) callback([])
    }
  }

  fetchOnce()
  const interval = window.setInterval(fetchOnce, POLL_INTERVAL_MS)

  return () => {
    cancelled = true
    window.clearInterval(interval)
  }
}
