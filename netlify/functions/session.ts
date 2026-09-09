import { getStore } from '@netlify/blobs'

interface UserRecord {
  employeeId: string
  name: string
  weeks: Record<string, unknown>
  createdAt: number
  updatedAt: number
}

export default async (req: Request) => {
  const store = getStore('users')
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

    const weeks = body?.weeks && typeof body.weeks === 'object' ? body.weeks : existing?.weeks ?? {}

    const record: UserRecord = {
      employeeId,
      name,
      weeks,
      createdAt: existing?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    }
    await store.setJSON(employeeId, record)
    return Response.json(record)
  }

  return new Response('Method not allowed', { status: 405 })
}
