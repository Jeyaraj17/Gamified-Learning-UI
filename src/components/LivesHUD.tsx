import { motion } from 'framer-motion'

interface LivesHUDProps {
  lives: number
  maxLives: number
}

export function LivesHUD({ lives, maxLives }: LivesHUDProps) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-white/90 px-4 py-2 shadow-lg backdrop-blur">
      {Array.from({ length: maxLives }).map((_, i) => {
        const filled = i < lives
        return (
          <motion.span
            key={i}
            className="text-xl"
            initial={false}
            animate={filled ? { scale: 1, rotate: 0 } : { scale: [1.4, 0.9, 1], rotate: [0, -15, 0] }}
            transition={{ duration: 0.4 }}
          >
            {filled ? '❤️' : '🖤'}
          </motion.span>
        )
      })}
    </div>
  )
}
