import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total === 0 ? 0 : Math.min(100, (current / total) * 100)
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-white/30">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
    </div>
  )
}
