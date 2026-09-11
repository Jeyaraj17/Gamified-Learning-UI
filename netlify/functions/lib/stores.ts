// Bumping this name starts a fresh namespace — old records are left orphaned
// rather than migrated, which is what we want when the schema changes.
export const USERS_STORE = 'users-v2'

// Only the fields the backend reasons about; the client stores more per week.
export interface StoredWeek {
  completed?: boolean
  failed?: boolean
}

export interface UserRecord {
  employeeId: string
  name: string
  weeks: Record<string, StoredWeek>
  totalPoints: number
  createdAt: number
  updatedAt: number
}
