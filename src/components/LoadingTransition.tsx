import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Character } from '../mechanics/runner/Character'

const TIPS = [
  'Warming up your brain...',
  'Tip: Read every option before you jump.',
  'Loading this week\'s challenge...',
  'Tip: Streaks earn you bonus badges!',
]

const DURATION_MS = 2400

interface LoadingTransitionProps {
  onDone: () => void
}

export function LoadingTransition({ onDone }: LoadingTransitionProps) {
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    const tipInterval = window.setInterval(() => {
      setTipIndex((i) => (i + 1) % TIPS.length)
    }, DURATION_MS / TIPS.length)

    const doneTimer = window.setTimeout(onDone, DURATION_MS)

    return () => {
      window.clearInterval(tipInterval)
      window.clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-indigo-950 via-indigo-800 to-purple-900 text-white">
      <Character state="running" />

      <p className="h-6 text-sm font-medium text-indigo-200">{TIPS[tipIndex]}</p>

      <div className="h-2 w-56 overflow-hidden rounded-full bg-white/20">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: DURATION_MS / 1000, ease: 'linear' }}
        />
      </div>
    </div>
  )
}
