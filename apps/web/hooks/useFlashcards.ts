// ===========================================
// OpoScore - Hook useFlashcards
// ===========================================

'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import {
  calcularProximaRevision,
  calcularEstadisticasLeitner,
  type LeitnerStats,
  type NumeroCaja,
} from '@/lib/spaced-repetition/leitner'
import type { Flashcard } from '@/types/database'

// Hook para obtener flashcards pendientes de revisión
export function usePendingFlashcards(userId: string, temaId?: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['flashcards', 'pending', userId, temaId],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0]

      let query = supabase
        .from('flashcards')
        .select(`
          *,
          tema:temas(nombre)
        `)
        .eq('user_id', userId)
        .lte('proxima_revision', today)
        .order('caja', { ascending: true })
        .order('proxima_revision', { ascending: true })

      if (temaId) {
        query = query.eq('tema_id', temaId)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })
}

// Hook para obtener todas las flashcards de un usuario
export function useFlashcards(userId: string, temaId?: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['flashcards', userId, temaId],
    queryFn: async () => {
      let query = supabase
        .from('flashcards')
        .select(`
          *,
          tema:temas(nombre)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (temaId) {
        query = query.eq('tema_id', temaId)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })
}

// Hook para obtener estadísticas de flashcards
export function useFlashcardStats(userId: string): {
  data: LeitnerStats | undefined
  isLoading: boolean
  error: Error | null
} {
  const supabase = createClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['flashcards', 'stats', userId],
    queryFn: async () => {
      const { data: flashcards, error } = await supabase
        .from('flashcards')
        .select('caja, proxima_revision')
        .eq('user_id', userId)

      if (error) throw error

      return calcularEstadisticasLeitner(flashcards || [])
    },
    enabled: !!userId,
  })

  return { data, isLoading, error: error as Error | null }
}

// Hook para crear una flashcard
export function useCreateFlashcard() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      temaId,
      frente,
      reverso,
    }: {
      temaId: string
      frente: string
      reverso: string
    }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('flashcards')
        .insert({
          user_id: user.id,
          tema_id: temaId,
          frente,
          reverso,
          caja: 1,
          proxima_revision: new Date().toISOString().split('T')[0],
        })
        .select()
        .single()

      if (error) throw error
      return data as Flashcard
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] })
    },
  })
}

// Hook para revisar una flashcard
export function useReviewFlashcard() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      flashcardId,
      acertada,
      tiempoRespuestaMs,
    }: {
      flashcardId: string
      acertada: boolean
      tiempoRespuestaMs?: number
    }) => {
      // Obtener flashcard actual
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: flashcard, error: fetchError } = await (supabase as any)
        .from('flashcards')
        .select('caja')
        .eq('id', flashcardId)
        .single()

      if (fetchError) throw fetchError

      const cajaActual = (flashcard?.caja ?? 1) as NumeroCaja
      const { nuevaCaja, proximaRevision } = calcularProximaRevision(cajaActual, acertada)

      // Registrar la revisión
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: reviewError } = await (supabase as any)
        .from('flashcard_reviews')
        .insert({
          flashcard_id: flashcardId,
          acertada,
          caja_anterior: cajaActual,
          caja_nueva: nuevaCaja,
          tiempo_respuesta_ms: tiempoRespuestaMs,
        })

      if (reviewError) throw reviewError

      // El trigger de la BD actualizará la flashcard automáticamente

      return { nuevaCaja, proximaRevision, acertada }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] })
      queryClient.invalidateQueries({ queryKey: ['oposcore'] })
    },
  })
}

// Hook para eliminar una flashcard
export function useDeleteFlashcard() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (flashcardId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('flashcards')
        .delete()
        .eq('id', flashcardId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] })
    },
  })
}

// Hook para editar una flashcard
export function useUpdateFlashcard() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      flashcardId,
      frente,
      reverso,
    }: {
      flashcardId: string
      frente?: string
      reverso?: string
    }) => {
      const updates: Record<string, string> = {}
      if (frente !== undefined) updates.frente = frente
      if (reverso !== undefined) updates.reverso = reverso

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('flashcards')
        .update(updates)
        .eq('id', flashcardId)
        .select()
        .single()

      if (error) throw error
      return data as Flashcard
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] })
    },
  })
}
