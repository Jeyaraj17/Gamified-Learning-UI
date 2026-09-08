import { motion } from 'framer-motion'
import { useState } from 'react'
import { Character } from '../mechanics/runner/Character'

interface LoginScreenProps {
  onSubmit: (employeeId: string) => void
}

export function LoginScreen({ onSubmit }: LoginScreenProps) {
  const [value, setValue] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-800 to-purple-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        className="w-full max-w-sm rounded-3xl bg-white/95 p-8 text-center shadow-2xl"
      >
        <div className="mx-auto flex h-24 w-24 items-center justify-center">
          <Character state="idle" />
        </div>

        <h1 className="mt-2 text-2xl font-extrabold text-slate-800">Learning Quest</h1>
        <p className="mt-1 text-sm text-slate-500">Enter your Employee ID to start your journey</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 2439711"
            className="rounded-xl border-2 border-slate-200 px-4 py-3 text-center text-lg font-semibold text-slate-800 outline-none focus:border-indigo-400"
          />
          <motion.button
            type="submit"
            disabled={!value.trim()}
            whileHover={value.trim() ? { scale: 1.03 } : undefined}
            whileTap={value.trim() ? { scale: 0.97 } : undefined}
            className="rounded-xl bg-indigo-600 px-4 py-3 text-lg font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Let's Go 🚀
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
