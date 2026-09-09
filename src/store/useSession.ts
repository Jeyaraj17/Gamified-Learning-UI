import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SessionState {
  employeeId: string | null
  name: string | null
  setEmployeeId: (id: string) => void
  setSession: (employeeId: string, name: string) => void
  logout: () => void
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      employeeId: null,
      name: null,
      setEmployeeId: (id) => set({ employeeId: id }),
      setSession: (employeeId, name) => set({ employeeId, name }),
      logout: () => set({ employeeId: null, name: null }),
    }),
    { name: 'gamified-learning-session' },
  ),
)
