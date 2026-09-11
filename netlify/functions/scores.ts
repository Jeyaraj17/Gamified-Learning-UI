import { getStore } from '@netlify/blobs'
import { USERS_STORE, type UserRecord } from './lib/stores'

function weeksCompleted(weeks: UserRecord['weeks']) {
  return Object.values(weeks ?? {}).filter((w) => w?.completed && !w.failed).length
}

export default async (req: Request) => {
  if (req.method !== 'GET') return new Response('Method not allowed', { status: 405 })

  const store = getStore(USERS_STORE)
  const { blobs } = await store.list()
  const users = await Promise.all(
    blobs.map((b) => store.get(b.key, { type: 'json' }) as Promise<UserRecord | null>),
  )

  const board = users
    .filter((u): u is UserRecord => u !== null)
    .map((u) => ({
      employeeId: u.employeeId,
      name: u.name,
      totalPoints: u.totalPoints ?? 0,
      weeksCompleted: weeksCompleted(u.weeks),
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 50)

  return Response.json(board)
}
