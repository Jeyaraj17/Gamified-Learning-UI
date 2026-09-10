import { motion } from 'framer-motion'
import type { Question } from '../../types'

interface ObstacleQuestionProps {
  question: Question
  selectedIndex: number | null
  disabled: boolean
  onSelect: (index: number) => void
}

const LETTERS = ['A', 'B', 'C', 'D']
const LETTER_COLORS = ['bg-sky-500', 'bg-violet-500', 'bg-pink-500', 'bg-amber-500']

export function ObstacleQuestion({ question, selectedIndex, disabled, onSelect }: ObstacleQuestionProps) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border-b-4 border-indigo-200 bg-white/95 p-5 shadow-2xl"
    >
      <p className="mb-4 text-xl font-bold text-slate-800">{question.prompt}</p>
      <div className="grid gap-2">
        {question.choices.map((choice, i) => {
          const isSelected = selectedIndex === i
          const isCorrect = i === question.correctIndex
          let border = 'border-slate-200 bg-slate-50 hover:bg-slate-100'
          if (selectedIndex !== null) {
            if (isSelected && isCorrect) border = 'border-emerald-500 bg-emerald-100'
            else if (isSelected && !isCorrect) border = 'border-red-500 bg-red-100'
            else if (isCorrect) border = 'border-emerald-500 bg-emerald-50'
          }

          return (
            <motion.button
              key={i}
              disabled={disabled}
              onClick={() => onSelect(i)}
              whileHover={!disabled ? { scale: 1.015 } : undefined}
              whileTap={!disabled ? { scale: 0.98 } : undefined}
              animate={isSelected && !isCorrect ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
              transition={isSelected && !isCorrect ? { duration: 0.4 } : { type: 'spring', stiffness: 300 }}
              className={`flex items-center gap-3 rounded-2xl border-2 border-b-4 px-4 py-3 text-left font-semibold text-slate-700 transition disabled:cursor-not-allowed ${border}`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${LETTER_COLORS[i]}`}
              >
                {LETTERS[i]}
              </span>
              <span className="flex-1">{choice}</span>
              {selectedIndex !== null && isCorrect && <span className="text-lg">✅</span>}
              {isSelected && !isCorrect && <span className="text-lg">❌</span>}
            </motion.button>
          )
        })}
      </div>
      {selectedIndex !== null && question.explanation && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-sm text-slate-500"
        >
          {question.explanation}
        </motion.p>
      )}
    </motion.div>
  )
}
