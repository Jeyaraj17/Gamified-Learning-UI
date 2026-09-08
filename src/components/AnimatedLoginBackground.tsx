import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useMemo } from 'react'
import { Character } from '../mechanics/runner/Character'

interface Star {
  left: number
  top: number
  size: number
  delay: number
  duration: number
}

function useStars(count: number): Star[] {
  return useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 70,
        size: 1 + Math.random() * 2.5,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3,
      })),
    [count],
  )
}

export function AnimatedLoginBackground() {
  const stars = useStars(50)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 40, damping: 18 })
  const sy = useSpring(my, { stiffness: 40, damping: 18 })

  const orbX = useTransform(sx, (v) => v * 18)
  const orbY = useTransform(sy, (v) => v * 12)
  const starX = useTransform(sx, (v) => v * 30)
  const starY = useTransform(sy, (v) => v * 20)
  const hillX = useTransform(sx, (v) => v * 45)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const { innerWidth, innerHeight } = window
    mx.set(e.clientX / innerWidth - 0.5)
    my.set(e.clientY / innerHeight - 0.5)
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="absolute inset-0 overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-800 to-purple-900"
      style={{ backgroundSize: '200% 200%', animation: 'gradient-pan 12s ease-in-out infinite' }}
    >
      <motion.div className="absolute inset-0" style={{ x: orbX, y: orbY }}>
        <div
          className="absolute top-[8%] left-[12%] h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl"
          style={{ animation: 'float-orb 9s ease-in-out infinite' }}
        />
        <div
          className="absolute top-[45%] right-[8%] h-80 w-80 rounded-full bg-sky-500/25 blur-3xl"
          style={{ animation: 'float-orb 11s ease-in-out infinite 1s' }}
        />
        <div
          className="absolute bottom-[10%] left-[35%] h-64 w-64 rounded-full bg-amber-400/20 blur-3xl"
          style={{ animation: 'float-orb 8s ease-in-out infinite 2s' }}
        />
      </motion.div>

      <motion.div className="absolute inset-0" style={{ x: starX, y: starY }}>
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animation: `twinkle ${s.duration}s ease-in-out infinite ${s.delay}s`,
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 flex h-40 w-[200%] opacity-40"
        style={{ x: hillX, animation: 'scroll-slow 30s linear infinite' }}
      >
        {[0, 1].map((i) => (
          <svg key={i} viewBox="0 0 400 100" className="h-full w-1/2" preserveAspectRatio="none">
            <path d="M0 100 Q60 30 140 80 T280 70 T400 90 V100 Z" fill="#1e1b4b" />
            <path d="M0 100 Q100 55 200 90 T400 80 V100 Z" fill="#0b1021" />
          </svg>
        ))}
      </motion.div>

      <div
        className="absolute bottom-4 h-16 w-14 opacity-70"
        style={{ animation: 'run-across 8s linear infinite' }}
      >
        <Character state="running" />
      </div>
    </div>
  )
}
