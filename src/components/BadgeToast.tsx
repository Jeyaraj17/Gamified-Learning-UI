import { AnimatePresence, motion } from 'framer-motion'
import type { BadgeDef } from '../types'

interface BadgeToastProps {
  badge: BadgeDef | null
}

export function BadgeToast({ badge }: BadgeToastProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center">
      <AnimatePresence>
        {badge && (
          <motion.div
            key={badge.id}
            initial={{ y: -40, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3 text-white shadow-2xl ring-2 ring-amber-400"
          >
            <span className="text-3xl">{badge.emoji}</span>
            <div className="text-left">
              <p className="text-sm font-bold text-amber-300">Badge unlocked!</p>
              <p className="text-base font-semibold">{badge.label}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
