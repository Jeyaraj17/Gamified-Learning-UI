import type { BadgeDef } from '../types'

export const BADGES: Record<string, BadgeDef> = {
  streak3: {
    id: 'streak3',
    label: 'On a Roll',
    emoji: '🔥',
    description: 'Answered 3 in a row correctly',
  },
  perfect: {
    id: 'perfect',
    label: 'Flawless Run',
    emoji: '🌟',
    description: 'Finished a week with zero wrong answers',
  },
  finisher: {
    id: 'finisher',
    label: 'Trail Finished',
    emoji: '🏁',
    description: 'Completed a week',
  },
}
