// ===========================================
// OpoMetrics - Hook para Estadísticas
// ===========================================

'use client'

import { useState, useEffect, useCallback } from 'react'

interface BasicStats {
  totalPreguntas: number
  totalCorrectas: number
  porcentajeGlobal: number
  testsCompletados: number
  rachaActual: number
  mejorRacha: number
  minutosEstudio: number
}

interface DailyStats {
  fecha: string
  preguntas: number
  correctas: number
  porcentaje: number
  minutos: number
}

interface RankingData {
  posicionGlobal: number
  totalUsuarios: number
  percentil: number
  posicionOposicion: number
  totalOposicion: number
  percentilOposicion: number
}

interface BloqueStats {
  bloqueId: string
  bloqueNombre: string
  totalPreguntas: number
  correctas: number
  porcentaje: number
  mediaPlataforma: number
  diferencia: number
  estado: 'dominado' | 'avanzado' | 'progreso' | 'debil' | 'critico'
}

interface PredictionData {
  probabilidadAprobado: number
  confianzaModelo: number
  diasHastaListo: number
  fechaEstimadaListo: string
  factoresPositivos: string[]
  factoresNegativos: string[]
  recomendaciones: string[]
}

interface MLFeatures {
  porcentajeGlobal: number
  porcentajeUltimos7Dias: number
  tendenciaMejora: number
  testsCompletados: number
  preguntasRespondidas: number
  diasActivo: number
  minutosEstudioDiarioPromedio: number
  rachaActual: number
  rachaMaxima: number
  diasSinEstudiarUltimoMes: number
  porcentajeTemasVistos: number
  porcentajeTemasDominados: number
  simulacrosCompletados: number
  mediaSimulacros: number
}

interface AllStats {
  basic: BasicStats
  daily?: DailyStats[]
  ranking?: RankingData
  bloques?: BloqueStats[]
  prediction?: PredictionData
  features?: MLFeatures
}

interface UseStatsResult {
  stats: AllStats | null
  loading: boolean
  error: string | null
  plan: 'free' | 'basic' | 'pro' | 'elite'
  refetch: () => Promise<void>
}

export function useStats(oposicionId?: string): UseStatsResult {
  const [stats, setStats] = useState<AllStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [plan, setPlan] = useState<'free' | 'basic' | 'pro' | 'elite'>('free')

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({ type: 'all' })
      if (oposicionId) {
        params.append('oposicion_id', oposicionId)
      }

      const response = await fetch(`/api/stats?${params}`)

      if (!response.ok) {
        throw new Error('Error al cargar estadísticas')
      }

      const data = await response.json()

      if (data.success) {
        setStats(data.data)
        setPlan(data.plan || 'free')
      } else {
        throw new Error(data.error || 'Error desconocido')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      // Establecer datos por defecto en caso de error
      setStats({
        basic: {
          totalPreguntas: 0,
          totalCorrectas: 0,
          porcentajeGlobal: 0,
          testsCompletados: 0,
          rachaActual: 0,
          mejorRacha: 0,
          minutosEstudio: 0,
        }
      })
    } finally {
      setLoading(false)
    }
  }, [oposicionId])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    plan,
    refetch: fetchStats,
  }
}

// Hook para trackear respuestas
export function useTrackResponse() {
  const trackResponse = useCallback(async (
    preguntaId: string,
    respuestaId: string | null,
    esCorrecta: boolean,
    tiempoMs?: number,
    testId?: string
  ) => {
    try {
      await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preguntaId,
          respuestaId,
          esCorrecta,
          tiempoMs,
          testId,
        }),
      })
    } catch (error) {
      console.error('Error tracking response:', error)
    }
  }, [])

  return { trackResponse }
}
