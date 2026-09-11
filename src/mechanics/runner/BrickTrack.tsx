import { motion } from 'framer-motion'
import { Character, type CharacterState } from './Character'

interface BrickTrackProps {
  total: number
  worldPos: number
  charState: CharacterState
}

const SPACING = 130
const BRICK_W = 64
const BRICK_H = 32
const BRICK_LIFT = 24
const ANCHOR = 120

function brickX(i: number) {
  return i * SPACING
}

export function BrickTrack({ total, worldPos, charState }: BrickTrackProps) {
  const slots = total + 1 // last slot is the finish flag
  const worldWidth = brickX(slots - 1) + BRICK_W + 40

  return (
    <div className="relative h-28 w-full">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute bottom-0 h-full"
          style={{ width: worldWidth }}
          initial={false}
          animate={{ x: ANCHOR - worldPos * SPACING }}
          transition={{ type: 'spring', stiffness: 90, damping: 16 }}
        >
          {Array.from({ length: slots - 1 }).map((_, i) => (
            <div
              key={`gap-${i}`}
              className="absolute bottom-0 bg-gradient-to-b from-slate-800 via-slate-900 to-black"
              style={{ left: brickX(i) + BRICK_W, width: SPACING - BRICK_W, height: BRICK_LIFT + BRICK_H }}
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-[repeating-linear-gradient(45deg,#f59e0b_0_6px,#1e293b_6px_12px)]" />
            </div>
          ))}

          {Array.from({ length: slots }).map((_, i) => {
            const isFlag = i === slots - 1
            return (
              <div
                key={i}
                className="absolute rounded-md border-b-4 border-amber-900/40 bg-gradient-to-b from-amber-500 to-amber-700 shadow-lg"
                style={{ left: brickX(i), width: BRICK_W, height: BRICK_H, bottom: BRICK_LIFT }}
              >
                <div className="mx-1 mt-1 h-1.5 rounded-full bg-amber-300/60" />
                {isFlag && <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-3xl">🏁</div>}
              </div>
            )
          })}
        </motion.div>
      </div>

      <div className="absolute" style={{ left: ANCHOR - 48, bottom: BRICK_LIFT + BRICK_H - 8 }}>
        <Character state={charState} />
      </div>
    </div>
  )
}
