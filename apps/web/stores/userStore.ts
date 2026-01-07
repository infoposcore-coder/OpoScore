// ===========================================
// OpoScore - User Store (Zustand)
// ===========================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, UserOposicion, Racha } from '@/types/database'

interface UserState {
  // Datos del usuario
  profile: Profile | null
  oposicionActiva: UserOposicion | null
  racha: Racha | null
  opoScore: number

  // Estado de carga
  isLoading: boolean
  error: string | null

  // Acciones
  setProfile: (profile: Profile | null) => void
  setOposicionActiva: (oposicion: UserOposicion | null) => void
  setRacha: (racha: Racha | null) => void
  setOpoScore: (score: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  profile: null,
  oposicionActiva: null,
  racha: null,
  opoScore: 0,
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
      setOpoScore: (score) => set({ opoScore: score }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    {
      name: 'oposcore-user',
      partialize: (state) => ({
        // Solo persistir datos no sensibles
        oposicionActiva: state.oposicionActiva,
        opoScore: state.opoScore,
      }),
    }
  )
)
