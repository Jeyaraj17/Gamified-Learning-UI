import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WeekProgress } from '../types'

const POINTS_PER_CORRECT = 10

function emptyProgress(): WeekProgress {
  return {
    answered: 0,
    correct: 0,
    wrong: 0,
    currentStreak: 0,
    bestStreak: 0,
    completed: false,
    badges: [],
  }
}

interface GameProgressState {
  weeks: Record<string, WeekProgress>
  answerQuestion: (weekId: string, correct: boolean) => void
  finishWeek: (weekId: string, totalQuestions: number) => void
  totalPoints: () => number
}

export const useGameProgress = create<GameProgressState>()(
  persist(
    (set, get) => ({
      weeks: {},

      answerQuestion: (weekId, correct) =>
        set((state) => {
          const prev = state.weeks[weekId] ?? emptyProgress()
          if (prev.completed) return state
          const currentStreak = correct ? prev.currentStreak + 1 : 0
          const bestStreak = Math.max(prev.bestStreak, currentStreak)
          const badges = new Set(prev.badges)
          if (currentStreak >= 3) badges.add('streak3')

          const next: WeekProgress = {
            ...prev,
            answered: prev.answered + 1,
            correct: prev.correct + (correct ? 1 : 0),
            wrong: prev.wrong + (correct ? 0 : 1),
            currentStreak,
            bestStreak,
            badges: Array.from(badges),
          }
          return { weeks: { ...state.weeks, [weekId]: next } }
        }),

      finishWeek: (weekId, totalQuestions) =>
        set((state) => {
          const prev = state.weeks[weekId] ?? emptyProgress()
          if (prev.completed) return state
          const badges = new Set(prev.badges)
          badges.add('finisher')
          if (prev.wrong === 0 && prev.answered >= totalQuestions) badges.add('perfect')

          const next: WeekProgress = {
            ...prev,
            completed: true,
            badges: Array.from(badges),
          }
          return { weeks: { ...state.weeks, [weekId]: next } }
        }),

      totalPoints: () =>
        Object.values(get().weeks).reduce((sum, w) => sum + w.correct * POINTS_PER_CORRECT, 0),
    }),
    { name: 'gamified-learning-progress' },
  ),
)

export function getWeekProgress(weekId: string): WeekProgress {
  return useGameProgress.getState().weeks[weekId] ?? emptyProgress()
}
