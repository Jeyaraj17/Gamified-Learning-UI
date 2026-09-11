import { getStore } from '@netlify/blobs'
import { USERS_STORE, type UserRecord } from './lib/stores'

export default async (req: Request) => {
  const store = getStore(USERS_STORE)
  const url = new URL(req.url)

  if (req.method === 'GET') {
    const employeeId = url.searchParams.get('employeeId')?.trim()
    if (!employeeId) return new Response('Missing employeeId', { status: 400 })

    const user = (await store.get(employeeId, { type: 'json' })) as UserRecord | null
    if (!user) return new Response(null, { status: 404 })
    return Response.json(user)
  }

  if (req.method === 'POST') {
    const body = await req.json().catch(() => null)
    const employeeId = typeof body?.employeeId === 'string' ? body.employeeId.trim() : ''
    if (!employeeId) return new Response('Invalid employeeId', { status: 400 })

    const existing = (await store.get(employeeId, { type: 'json' })) as UserRecord | null
    const name = typeof body?.name === 'string' && body.name.trim() ? body.name.trim() : existing?.name
    if (!name) return new Response('Name required for new registration', { status: 400 })

    const record: UserRecord = {
      employeeId,
      name,
      weeks: body?.weeks && typeof body.weeks === 'object' ? body.weeks : existing?.weeks ?? {},
      totalPoints:
        typeof body?.totalPoints === 'number' && body.totalPoints >= 0
          ? body.totalPoints
          : existing?.totalPoints ?? 0,
      createdAt: existing?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    }
    await store.setJSON(employeeId, record)
    return Response.json(record)
  }

  return new Response('Method not allowed', { status: 405 })
}
