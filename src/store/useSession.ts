import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SessionState {
  employeeId: string | null
  setEmployeeId: (id: string) => void
  logout: () => void
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      employeeId: null,
      setEmployeeId: (id) => set({ employeeId: id }),
      logout: () => set({ employeeId: null }),
    }),
    { name: 'gamified-learning-session' },
  ),
)
