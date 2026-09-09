import { getStore } from '@netlify/blobs'

interface ScoreEntry {
  employeeId: string
  totalPoints: number
  weeksCompleted: number
  updatedAt: number
}

export default async (req: Request) => {
  const store = getStore('leaderboard-scores')

  if (req.method === 'GET') {
    const { blobs } = await store.list()
    const entries = await Promise.all(
      blobs.map((b) => store.get(b.key, { type: 'json' }) as Promise<ScoreEntry | null>),
    )
    const sorted = entries
      .filter((e): e is ScoreEntry => e !== null)
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 50)
    return Response.json(sorted)
  }

  if (req.method === 'POST') {
    const body = await req.json()
    const { employeeId, totalPoints, weeksCompleted } = body ?? {}

    if (typeof employeeId !== 'string' || !employeeId.trim()) {
      return new Response('Invalid employeeId', { status: 400 })
    }
    if (typeof totalPoints !== 'number' || totalPoints < 0) {
      return new Response('Invalid totalPoints', { status: 400 })
    }

    const entry: ScoreEntry = {
      employeeId: employeeId.trim(),
      totalPoints,
      weeksCompleted: typeof weeksCompleted === 'number' ? weeksCompleted : 0,
      updatedAt: Date.now(),
    }
    await store.setJSON(entry.employeeId, entry)
    return new Response(null, { status: 204 })
  }

  return new Response('Method not allowed', { status: 405 })
}
