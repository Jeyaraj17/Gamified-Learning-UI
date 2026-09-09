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
      <h2 className="mt-3 text-2xl font-extrabold">{week.title}</h2>
      <p className="mt-1 font-medium text-slate-500">{week.topic}</p>
      <p className="mx-auto mt-4 max-w-sm text-sm text-slate-500">{week.description}</p>

      <div className="mt-5 flex justify-center gap-4 text-sm font-semibold text-slate-500">
        <span>📝 {week.questions.length} questions</span>
        {completed && <span>🏆 Best: {progress?.correct}/{week.questions.length}</span>}
      </div>

      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        className="mt-7 rounded-full bg-indigo-600 px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-indigo-700"
      >
        {completed ? 'Replay Challenge 🔁' : 'Accept Challenge ▶'}
      </motion.button>
    </motion.div>
  )
}
