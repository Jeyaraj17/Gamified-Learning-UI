import { motion } from 'framer-motion'
import { Character, type CharacterState } from './Character'

interface BrickTrackProps {
  total: number
  current: number
  charState: CharacterState
}

function brickLeftPct(i: number, total: number) {
  return ((i + 0.5) / total) * 100
}

export function BrickTrack({ total, current, charState }: BrickTrackProps) {
  return (
    <div className="relative h-24 w-full px-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="absolute bottom-0 h-8 w-14 -translate-x-1/2 rounded-md border-b-4 border-amber-900/40 bg-gradient-to-b from-amber-500 to-amber-700 shadow-md"
          style={{ left: `${brickLeftPct(i, total)}%` }}
        >
          <div className="mx-1 mt-1 h-1.5 rounded-full bg-amber-300/60" />
        </div>
      ))}

      <motion.div
        className="absolute bottom-6 -translate-x-1/2"
        animate={{ left: `${brickLeftPct(current, total)}%` }}
        transition={{ type: 'spring', stiffness: 150, damping: 18 }}
      >
        <Character state={charState} />
      </motion.div>
    </div>
  )
}
