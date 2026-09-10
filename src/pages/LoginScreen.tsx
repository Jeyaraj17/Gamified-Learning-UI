import { motion } from 'framer-motion'
import { useState } from 'react'
import { AnimatedLoginBackground } from '../components/AnimatedLoginBackground'
import { Character } from '../mechanics/runner/Character'
import { fetchSession, registerSession } from '../services/session'

interface LoginScreenProps {
  onLogin: (employeeId: string) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [employeeId, setEmployeeId] = useState('')
  const [name, setName] = useState('')
  const [step, setStep] = useState<'id' | 'name'>('id')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleIdSubmit(e: React.FormEvent) {
    e.preventDefault()
    const id = employeeId.trim()
    if (!id || busy) return
    setBusy(true)
    setError('')
    try {
      const existing = await fetchSession(id)
      if (existing) {
        onLogin(id)
        return
      }
      setStep('name')
    } catch {
      setError("Couldn't reach the server — check your connection and try again.")
    } finally {
      setBusy(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    const trimmedName = name.trim()
    const id = employeeId.trim()
    if (!trimmedName || busy) return
    setBusy(true)
    setError('')
    try {
      await registerSession(id, trimmedName)
      onLogin(id)
    } catch {
      setError("Couldn't register — check your connection and try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <AnimatedLoginBackground />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        className="relative z-10 w-full max-w-sm rounded-3xl border-4 border-white/60 bg-white/95 p-8 text-center shadow-2xl"
      >
        <div className="mx-auto flex h-24 w-24 items-center justify-center">
          <Character state="idle" />
        </div>

        <motion.h1
          initial={{ scale: 0.6, rotate: -4, opacity: 0 }}
          animate={{ scale: 1, rotate: -2, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.15 }}
          className="font-display mt-2 text-4xl text-indigo-600 drop-shadow-[2px_2px_0_rgba(99,102,241,0.25)]"
        >
          Learning Quest
        </motion.h1>

        {step === 'id' ? (
          <>
            <p className="mt-1 text-sm text-slate-500">Enter your Employee ID to start your journey</p>
            <form onSubmit={handleIdSubmit} className="mt-6 flex flex-col gap-3">
              <input
                autoFocus
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="e.g. 2439711"
                className="rounded-xl border-2 border-slate-200 px-4 py-3 text-center text-lg font-semibold text-slate-800 outline-none focus:border-indigo-400"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={!employeeId.trim() || busy}
                className="btn-game rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 px-4 py-3 text-lg font-bold text-white disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300"
              >
                {busy ? 'Checking...' : "Let's Go 🚀"}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-slate-500">
              Welcome! Looks like it's your first time here — what's your name?
            </p>
            <form onSubmit={handleRegister} className="mt-6 flex flex-col gap-3">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="rounded-xl border-2 border-slate-200 px-4 py-3 text-center text-lg font-semibold text-slate-800 outline-none focus:border-indigo-400"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={!name.trim() || busy}
                className="btn-game rounded-2xl bg-gradient-to-b from-amber-400 to-orange-500 px-4 py-3 text-lg font-bold text-white disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300"
              >
                {busy ? 'Setting up...' : 'Get Started 🎮'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('id')
                  setError('')
                }}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ← back
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  )
}
