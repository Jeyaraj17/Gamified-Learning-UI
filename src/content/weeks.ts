import type { WeekConfig } from '../types'
import { week01Questions } from './questions/week-01'

export const WEEKS: WeekConfig[] = [
  {
    id: 'week-01',
    weekNumber: 1,
    title: 'Testing Trail',
    topic: 'Testing concepts & best practices',
    mechanicId: 'runner',
    description: 'Run, jump, and dodge your way through core testing concepts.',
    questions: week01Questions,
  },
]

export function getWeekById(id: string): WeekConfig | undefined {
  return WEEKS.find((w) => w.id === id)
}
