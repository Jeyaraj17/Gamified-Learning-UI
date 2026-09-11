import { motion } from 'framer-motion'
import type { WeekConfig, WeekProgress } from '../types'

interface ChallengeBriefingProps {
  week: WeekConfig
  progress: WeekProgress | undefined
  name: string | null
  onStart: () => void
}

export function ChallengeBriefing({ week, progress, name, onStart }: ChallengeBriefingProps) {
  const completed = progress?.completed ?? false

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 160, damping: 20 }}
      className="rounded-3xl bg-white/95 p-8 text-center text-slate-800 shadow-2xl"
    >
      <p className="text-xs font-bold tracking-wide text-indigo-500 uppercase">
        Challenge invite {name ? `for ${name}` : ''}
      </p>
      <p className="mt-3 text-5xl">🎯</p>
      <h2 className="font-display mt-3 text-3xl text-indigo-700">{week.title}</h2>
      <p className="mt-1 font-medium text-slate-500">{week.topic}</p>
      <p className="mx-auto mt-4 max-w-sm text-sm text-slate-500">{week.description}</p>

      <div className="mt-5 flex justify-center gap-4 text-sm font-semibold text-slate-500">
        <span>📝 {week.questions.length} questions</span>
        <span>❤️❤️❤️ 3 lives</span>
        {completed && (
          <span>
            🏆 Scored: {progress?.correct}/{week.questions.length}
          </span>
        )}
      </div>

      <p className="mx-auto mt-2 max-w-sm text-xs text-slate-400">
        {completed
          ? 'Your score for this challenge is already locked in — replays are just for practice.'
          : 'Miss 3 answers and it’s game over — your score locks in wherever you stopped, so make them count!'}
      </p>

      <button
        onClick={onStart}
        className="btn-game mt-7 rounded-2xl bg-gradient-to-b from-indigo-500 to-indigo-700 px-8 py-3 text-lg font-bold text-white"
      >
        {completed ? 'Replay for practice 🔁' : 'Accept Challenge ▶'}
      </button>
    </motion.div>
  )
}
