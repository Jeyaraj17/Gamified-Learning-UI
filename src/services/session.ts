import type { WeekProgress } from '../types'

export interface SessionData {
  employeeId: string
  name: string
  weeks: Record<string, WeekProgress>
}

export async function fetchSession(employeeId: string): Promise<SessionData | null> {
  const res = await fetch(`/api/session?employeeId=${encodeURIComponent(employeeId)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to load session')
  return res.json()
}

export async function registerSession(employeeId: string, name: string): Promise<SessionData> {
  const res = await fetch('/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employeeId, name }),
  })
  if (!res.ok) throw new Error('Failed to register')
  return res.json()
}

export async function syncProgress(employeeId: string, weeks: Record<string, WeekProgress>) {
  try {
    await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, weeks }),
    })
  } catch {
    // Best-effort only — local progress is already saved regardless.
  }
}
