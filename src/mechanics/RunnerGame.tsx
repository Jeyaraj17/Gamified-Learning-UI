import { useState } from 'react'
import { LivesHUD } from '../components/LivesHUD'
import { ProgressBar } from '../components/ProgressBar'
import type { MechanicProps } from '../types'
import { BrickTrack } from './runner/BrickTrack'
import type { CharacterState } from './runner/Character'
import { ObstacleQuestion } from './runner/ObstacleQuestion'
import { ParallaxBackground } from './runner/ParallaxBackground'

const MAX_LIVES = 3
const CORRECT_DELAY_MS = 750
const WRONG_DELAY_MS = 950

export function RunnerGame({ questions, onAnswer, onComplete, onGameOver }: MechanicProps) {
  const [index, setIndex] = useState(0)
  const [worldPos, setWorldPos] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)
  const [charState, setCharState] = useState<CharacterState>('idle')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)

  const question = questions[index]

  function advance() {
    const isLast = index + 1 >= questions.length
    if (isLast) {
      setCharState('idle')
      onComplete()
      return
    }
    setIndex((i) => i + 1)
    setSelectedIndex(null)
    setLocked(false)
    setCharState('idle')
  }

  function handleSelect(choiceIndex: number) {
    if (locked) return
    const correct = choiceIndex === question.correctIndex

    setSelectedIndex(choiceIndex)
    setLocked(true)
    onAnswer(correct)
    setWorldPos((p) => p + 1)

    if (correct) {
      setCharState('jumping')
      window.setTimeout(advance, CORRECT_DELAY_MS)
      return
    }

    setCharState('falling')
    const remaining = lives - 1
    setLives(remaining)
    window.setTimeout(remaining <= 0 ? onGameOver : advance, WRONG_DELAY_MS)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar current={index} total={questions.length} />
        </div>
        <LivesHUD lives={lives} maxLives={MAX_LIVES} />
      </div>

      <div className="relative h-64 w-full overflow-hidden rounded-3xl">
        <ParallaxBackground />
        <div className="absolute inset-x-0 bottom-4">
          <BrickTrack total={questions.length} worldPos={worldPos} charState={charState} />
        </div>
      </div>

      <ObstacleQuestion
        question={question}
        selectedIndex={selectedIndex}
        disabled={locked}
        onSelect={handleSelect}
      />
    </div>
  )
}
