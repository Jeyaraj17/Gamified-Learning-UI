import { useEffect, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { LoadingTransition } from './components/LoadingTransition'
import { ArchiveHome } from './pages/ArchiveHome'
import { Leaderboard } from './pages/Leaderboard'
import { LoginScreen } from './pages/LoginScreen'
import { WeekPage } from './pages/WeekPage'
import { fetchSession } from './services/session'
import { useGameProgress } from './store/useGameProgress'
import { useSession } from './store/useSession'

type Phase = 'login' | 'loading' | 'ready'
const MIN_LOADING_MS = 2000

export default function App() {
  const employeeId = useSession((s) => s.employeeId)
  const setEmployeeId = useSession((s) => s.setEmployeeId)
  const setSession = useSession((s) => s.setSession)
  const logout = useSession((s) => s.logout)
  const hydrate = useGameProgress((s) => s.hydrate)
  const reset = useGameProgress((s) => s.reset)
  const [phase, setPhase] = useState<Phase>(employeeId ? 'loading' : 'login')

  useEffect(() => {
    if (!employeeId && phase === 'ready') {
      reset()
      setPhase('login')
    }
  }, [employeeId, phase])

  useEffect(() => {
    if (phase !== 'loading' || !employeeId) return
    let cancelled = false
    const minDelay = new Promise((resolve) => window.setTimeout(resolve, MIN_LOADING_MS))

    Promise.allSettled([fetchSession(employeeId), minDelay]).then(([result]) => {
      if (cancelled) return
      if (result.status === 'fulfilled') {
        const data = result.value
        if (data) {
          hydrate(data.weeks)
          setSession(employeeId, data.name)
          setPhase('ready')
        } else {
          // This device knows an employee ID the server doesn't recognize — start fresh.
          reset()
          logout()
          setPhase('login')
        }
      } else {
        // Offline — proceed with whatever is cached locally on this device.
        setPhase('ready')
      }
    })

    return () => {
      cancelled = true
    }
  }, [phase, employeeId])

  if (phase === 'login') {
    return (
      <LoginScreen
        onLogin={(id) => {
          setEmployeeId(id)
          setPhase('loading')
        }}
      />
    )
  }

  if (phase === 'loading') {
    return <LoadingTransition />
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ArchiveHome />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/week/:weekId" element={<WeekPage />} />
      </Routes>
    </HashRouter>
  )
}
