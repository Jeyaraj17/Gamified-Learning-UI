export interface Question {
  id: string
  prompt: string
  choices: string[]
  correctIndex: number
  explanation?: string
}

export interface WeekConfig {
  id: string
  weekNumber: number
  title: string
  topic: string
  mechanicId: string
  description: string
  questions: Question[]
}

export interface BadgeDef {
  id: string
  label: string
  emoji: string
  description: string
}

export interface WeekProgress {
  answered: number
  correct: number
  wrong: number
  currentStreak: number
  bestStreak: number
  completed: boolean
  badges: string[]
}

export interface MechanicProps {
  questions: Question[]
  onAnswer: (correct: boolean) => void
  onComplete: () => void
}
