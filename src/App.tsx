import { useEffect, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { LoadingTransition } from './components/LoadingTransition'
import { ArchiveHome } from './pages/ArchiveHome'
import { Leaderboard } from './pages/Leaderboard'
import { LoginScreen } from './pages/LoginScreen'
import { WeekPage } from './pages/WeekPage'
import { useSession } from './store/useSession'

type Phase = 'login' | 'loading' | 'ready'

export default function App() {
  const employeeId = useSession((s) => s.employeeId)
  const setEmployeeId = useSession((s) => s.setEmployeeId)
  const [phase, setPhase] = useState<Phase>(employeeId ? 'ready' : 'login')

  useEffect(() => {
    if (!employeeId && phase === 'ready') setPhase('login')
  }, [employeeId, phase])

  if (phase === 'login') {
    return (
      <LoginScreen
        onSubmit={(id) => {
          setEmployeeId(id)
          setPhase('loading')
        }}
      />
    )
  }

  if (phase === 'loading') {
    return <LoadingTransition onDone={() => setPhase('ready')} />
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
