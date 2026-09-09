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
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        className="relative z-10 w-full max-w-sm rounded-3xl bg-white/95 p-8 text-center shadow-2xl"
      >
        <div className="mx-auto flex h-24 w-24 items-center justify-center">
          <Character state="idle" />
        </div>

        <h1 className="mt-2 text-2xl font-extrabold text-slate-800">Learning Quest</h1>

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
              <motion.button
                type="submit"
                disabled={!employeeId.trim() || busy}
                whileHover={employeeId.trim() && !busy ? { scale: 1.03 } : undefined}
                whileTap={employeeId.trim() && !busy ? { scale: 0.97 } : undefined}
                className="rounded-xl bg-indigo-600 px-4 py-3 text-lg font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {busy ? 'Checking...' : "Let's Go 🚀"}
              </motion.button>
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
              <motion.button
                type="submit"
                disabled={!name.trim() || busy}
                whileHover={name.trim() && !busy ? { scale: 1.03 } : undefined}
                whileTap={name.trim() && !busy ? { scale: 0.97 } : undefined}
                className="rounded-xl bg-indigo-600 px-4 py-3 text-lg font-bold text-white shadow-lg transition disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {busy ? 'Setting up...' : 'Get Started 🎮'}
              </motion.button>
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
