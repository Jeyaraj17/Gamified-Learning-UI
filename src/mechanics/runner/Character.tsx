import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export type CharacterState = 'idle' | 'running' | 'jumping' | 'falling'

const bodyVariants: Variants = {
  idle: { y: [0, -3, 0], scaleX: 1, scaleY: 1, rotate: 0, transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } },
  running: { y: [0, -6, 0], scaleX: 1, scaleY: 1, rotate: 0, transition: { duration: 0.32, repeat: Infinity, ease: 'easeInOut' } },
  jumping: {
    y: [0, 6, -48, -52, -48, 4, 0],
    scaleY: [1, 0.8, 1.06, 1.08, 1.06, 0.85, 1],
    scaleX: [1, 1.15, 0.95, 0.92, 0.95, 1.12, 1],
    rotate: [0, 0, -8, -10, -6, 0, 0],
    transition: { duration: 0.72, times: [0, 0.12, 0.38, 0.52, 0.68, 0.88, 1], ease: 'easeInOut' },
  },
  falling: {
    y: [0, -10, 16, 50, 62, 62, 20, 0],
    scaleY: [1, 1.1, 0.95, 0.9, 0.78, 0.78, 1.05, 1],
    scaleX: [1, 0.9, 1.05, 1.05, 1.15, 1.15, 0.95, 1],
    rotate: [0, -6, 12, 28, 35, 35, 10, 0],
    transition: { duration: 0.85, times: [0, 0.15, 0.35, 0.55, 0.68, 0.72, 0.88, 1], ease: 'easeInOut' },
  },
}

const shadowVariants: Variants = {
  idle: { scaleX: [1, 0.92, 1], opacity: [0.35, 0.3, 0.35], transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } },
  running: { scaleX: [1, 0.85, 1], opacity: [0.35, 0.28, 0.35], transition: { duration: 0.32, repeat: Infinity, ease: 'easeInOut' } },
  jumping: { scaleX: [1, 0.45, 1], opacity: [0.35, 0.1, 0.35], transition: { duration: 0.72, ease: 'easeOut' } },
  falling: { scaleX: [1, 0.6, 0], opacity: [0.35, 0.2, 0], transition: { duration: 0.85, times: [0, 0.4, 0.7] } },
}

const legVariantsLeft: Variants = {
  idle: { rotate: 0 },
  running: { rotate: [-25, 25, -25], transition: { duration: 0.28, repeat: Infinity, ease: 'easeInOut' } },
  jumping: { rotate: [10, -20, 15, 15, 15, -5, 10], transition: { duration: 0.72 } },
  falling: { rotate: [0, -25, 25, -20, -20, 10, 0], transition: { duration: 0.85 } },
}

const legVariantsRight: Variants = {
  idle: { rotate: 0 },
  running: { rotate: [25, -25, 25], transition: { duration: 0.28, repeat: Infinity, ease: 'easeInOut' } },
  jumping: { rotate: [-10, 20, -15, -15, -15, 5, -10], transition: { duration: 0.72 } },
  falling: { rotate: [0, 25, -25, 20, 20, -10, 0], transition: { duration: 0.85 } },
}

const armVariantsLeft: Variants = {
  idle: { rotate: 0 },
  running: { rotate: [20, -20, 20], transition: { duration: 0.32, repeat: Infinity, ease: 'easeInOut' } },
  jumping: { rotate: [10, -50, -40, -40, -40, 20, 10], transition: { duration: 0.72 } },
  falling: { rotate: [30, 70, 60, 60, 60, -30, 30], transition: { duration: 0.85 } },
}

const armVariantsRight: Variants = {
  idle: { rotate: 0 },
  running: { rotate: [-20, 20, -20], transition: { duration: 0.32, repeat: Infinity, ease: 'easeInOut' } },
  jumping: { rotate: [-10, 50, 40, 40, 40, -20, -10], transition: { duration: 0.72 } },
  falling: { rotate: [-30, -70, -60, -60, -60, 30, -30], transition: { duration: 0.85 } },
}

interface CharacterProps {
  state: CharacterState
}

function DustPuff() {
  return (
    <motion.div
      className="absolute bottom-0 left-1/2 -translate-x-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      {[-10, 0, 10].map((dx) => (
        <motion.span
          key={dx}
          className="absolute h-2 w-2 rounded-full bg-white/70"
          initial={{ x: 0, y: 0, scale: 0.4, opacity: 0.8 }}
          animate={{ x: dx * 2.2, y: -8, scale: 1, opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />
      ))}
    </motion.div>
  )
}

export function Character({ state }: CharacterProps) {
  const [showDust, setShowDust] = useState(false)
  const prevState = useRef(state)

  useEffect(() => {
    const was = prevState.current
    prevState.current = state
    const wasAirborne = was === 'jumping' || was === 'falling'
    if (wasAirborne && state !== was) {
      setShowDust(true)
      const t = window.setTimeout(() => setShowDust(false), 450)
      return () => window.clearTimeout(t)
    }
  }, [state])

  return (
    <div className="relative h-28 w-24">
      <motion.div
        className="absolute bottom-0 left-1/2 h-3 w-16 -translate-x-1/2 rounded-full bg-black/40 blur-[2px]"
        animate={state}
        variants={shadowVariants}
      />

      <AnimatePresence>{showDust && <DustPuff />}</AnimatePresence>

      {state === 'running' && (
        <motion.div
          className="absolute top-8 -left-6 flex flex-col gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="block h-1 w-5 rounded-full bg-white/70" />
          <span className="block h-1 w-3 rounded-full bg-white/50" />
        </motion.div>
      )}

      <motion.div className="relative h-24 w-24" animate={state} variants={bodyVariants}>
        <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-xl">
          <defs>
            <radialGradient id="bodyGradient" cx="38%" cy="32%" r="70%">
              <stop offset="0%" stopColor="#ffb27a" />
              <stop offset="60%" stopColor="#ff6b3d" />
              <stop offset="100%" stopColor="#e14e1f" />
            </radialGradient>
          </defs>

          <motion.rect
            x="56"
            y="48"
            width="9"
            height="20"
            rx="4"
            fill="#ffb27a"
            style={{ originX: 0.5, originY: 0 }}
            animate={state}
            variants={armVariantsRight}
          />
          <motion.rect
            x="34"
            y="70"
            width="10"
            height="22"
            rx="4"
            fill="#2c2c54"
            style={{ originX: 0.5, originY: 0 }}
            animate={state}
            variants={legVariantsLeft}
          />
          <motion.rect
            x="56"
            y="70"
            width="10"
            height="22"
            rx="4"
            fill="#2c2c54"
            style={{ originX: 0.5, originY: 0 }}
            animate={state}
            variants={legVariantsRight}
          />

          <circle cx="50" cy="45" r="28" fill="url(#bodyGradient)" />
          <path d="M28 30 Q50 12 72 30" stroke="#fbbf24" strokeWidth="5" fill="none" strokeLinecap="round" />

          <circle cx="40" cy="40" r="5.5" fill="white" />
          <circle cx="60" cy="40" r="5.5" fill="white" />
          <circle cx="40" cy="40" r="2.4" fill="#111827" />
          <circle cx="60" cy="40" r="2.4" fill="#111827" />

          {state === 'falling' ? (
            <>
              <path d="M38 58 Q50 52 62 58" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round" />
              <circle cx="68" cy="30" r="3" fill="#7dd3fc" />
            </>
          ) : (
            <path d="M38 55 Q50 66 62 55" stroke="#111827" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}

          <motion.rect
            x="34"
            y="48"
            width="9"
            height="20"
            rx="4"
            fill="#ffb27a"
            style={{ originX: 0.5, originY: 0 }}
            animate={state}
            variants={armVariantsLeft}
          />
        </svg>
      </motion.div>
    </div>
  )
}
