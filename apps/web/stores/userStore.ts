// ===========================================
// OpoMetrics - User Store (Zustand)
// ===========================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, UserOposicion, Racha } from '@/types/database'

interface UserState {
  // Datos del usuario
  profile: Profile | null
  oposicionActiva: UserOposicion | null
  racha: Racha | null
  opoMetrics: number

  // Estado de carga
  isLoading: boolean
  error: string | null

  // Acciones
  setProfile: (profile: Profile | null) => void
  setOposicionActiva: (oposicion: UserOposicion | null) => void
  setRacha: (racha: Racha | null) => void
  setOpoMetrics: (score: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  profile: null,
  oposicionActiva: null,
  racha: null,
  opoMetrics: 0,
  isLoading: false,
  error: null,
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,

      setProfile: (profile) => set({ profile }),
      setOposicionActiva: (oposicion) => set({ oposicionActiva: oposicion }),
      setRacha: (racha) => set({ racha }),
      setOpoMetrics: (score) => set({ opoMetrics: score }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    {
      name: 'opometrics-user',
      partialize: (state) => ({
        // Solo persistir datos no sensibles
        oposicionActiva: state.oposicionActiva,
        opoMetrics: state.opoMetrics,
      }),
    }
  )
)
