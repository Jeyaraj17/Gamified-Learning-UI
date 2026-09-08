import { useState } from 'react'
import { ProgressBar } from '../components/ProgressBar'
import type { MechanicProps } from '../types'
import { Character, type CharacterState } from './runner/Character'
import { ObstacleQuestion } from './runner/ObstacleQuestion'
import { ParallaxBackground } from './runner/ParallaxBackground'

const CORRECT_DELAY_MS = 800
const WRONG_DELAY_MS = 700

export function RunnerGame({ questions, onAnswer, onComplete }: MechanicProps) {
  const [index, setIndex] = useState(0)
  const [charState, setCharState] = useState<CharacterState>('running')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)

  const question = questions[index]
  const moving = charState !== 'stumbling'

  function handleSelect(choiceIndex: number) {
    if (locked) return
    const correct = choiceIndex === question.correctIndex

    setSelectedIndex(choiceIndex)
    setLocked(true)
    setCharState(correct ? 'jumping' : 'stumbling')
    onAnswer(correct)

    window.setTimeout(
      () => {
        const isLast = index + 1 >= questions.length
        if (isLast) {
          setCharState('running')
          onComplete()
          return
        }
        setIndex((i) => i + 1)
        setSelectedIndex(null)
        setLocked(false)
        setCharState('running')
      },
      correct ? CORRECT_DELAY_MS : WRONG_DELAY_MS,
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <ProgressBar current={index} total={questions.length} />

      <div className="relative h-56 w-full">
        <ParallaxBackground moving={moving} />
        <div className="absolute bottom-8 left-10">
          <Character state={charState} />
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
