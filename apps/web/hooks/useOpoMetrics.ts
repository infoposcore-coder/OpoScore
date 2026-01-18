// ===========================================
// OpoMetrics - Hook useOpoMetrics
// ===========================================

'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { calcularOpoMetrics, calcularTendencia, type OpoMetricsResult } from '@/lib/scoring/opometrics'

interface UseOpoMetricsOptions {
  userId: string
  oposicionId: string
  enabled?: boolean
}

interface OpoMetricsData extends OpoMetricsResult {
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

// Tipos temporales hasta que se generen los tipos de Supabase
interface ProgresoTemaConRelaciones {
  porcentaje_completado: number
  tema?: { bloque?: { oposicion_id: string } }
}

interface TestPuntuacion {
  puntuacion: number | null
}

interface RachaData {
  dias_consecutivos: number
}

interface SesionData {
  duracion_minutos: number | null
}

interface MetricaData {
  fecha: string
  preguntas_total: number
  preguntas_correctas: number
}

export function useOpoMetrics({ userId, oposicionId, enabled = true }: UseOpoMetricsOptions): OpoMetricsData {
  const supabase = createClient()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['opometrics', userId, oposicionId],
    queryFn: async () => {
      // Obtener progreso de temas
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: progresoTemas } = await (supabase as any)
        .from('progreso_temas')
        .select(`
          porcentaje_completado,
          tema:temas!inner(
            bloque:bloques!inner(
              oposicion_id
            )
          )
        `)
        .eq('user_id', userId) as { data: ProgresoTemaConRelaciones[] | null }

      const temasOposicion = progresoTemas?.filter(
        (p) => p.tema?.bloque?.oposicion_id === oposicionId
      ) || []

      const porcentajeCompletado = temasOposicion.length > 0
        ? temasOposicion.reduce((acc, t) => acc + t.porcentaje_completado, 0) / temasOposicion.length
        : 0

      // Obtener media de aciertos en tests (últimos 30 días)
      const hace30Dias = new Date()
      hace30Dias.setDate(hace30Dias.getDate() - 30)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: tests } = await (supabase as any)
        .from('tests')
        .select('puntuacion')
        .eq('user_id', userId)
        .eq('oposicion_id', oposicionId)
        .not('completed_at', 'is', null)
        .gte('created_at', hace30Dias.toISOString()) as { data: TestPuntuacion[] | null }

      const mediaAciertos = tests && tests.length > 0
        ? tests.reduce((acc, t) => acc + (t.puntuacion || 0), 0) / tests.length
        : 0

      // Obtener racha
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: racha } = await (supabase as any)
        .from('rachas')
        .select('dias_consecutivos')
        .eq('user_id', userId)
        .single() as { data: RachaData | null }

      const diasRacha = racha?.dias_consecutivos || 0

      // Obtener tiempo de estudio semanal
      const hace7Dias = new Date()
      hace7Dias.setDate(hace7Dias.getDate() - 7)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: sesiones } = await (supabase as any)
        .from('sesiones_estudio')
        .select('duracion_minutos')
        .eq('user_id', userId)
        .eq('oposicion_id', oposicionId)
        .gte('inicio', hace7Dias.toISOString()) as { data: SesionData[] | null }

      const tiempoSemanaHoras = sesiones
        ? sesiones.reduce((acc, s) => acc + (s.duracion_minutos || 0), 0) / 60
        : 0

      // Obtener métricas diarias para tendencia
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: metricas } = await (supabase as any)
        .from('metricas_diarias')
        .select('fecha, preguntas_total, preguntas_correctas')
        .eq('user_id', userId)
        .eq('oposicion_id', oposicionId)
        .order('fecha', { ascending: true })
        .limit(7) as { data: MetricaData[] | null }

      const aciertosDiarios = metricas?.map(m =>
        m.preguntas_total > 0 ? (m.preguntas_correctas / m.preguntas_total) * 100 : 0
      ) || []

      const tendencia = calcularTendencia(aciertosDiarios)

      // Calcular OpoMetrics
      return calcularOpoMetrics({
        porcentaje_temario_completado: porcentajeCompletado,
        media_aciertos_tests: mediaAciertos,
        dias_racha_actual: diasRacha,
        tiempo_estudio_semana_horas: tiempoSemanaHoras,
        tendencia_aciertos: tendencia,
        dias_hasta_examen: null, // TODO: Obtener de user_oposiciones
      })
    },
    enabled: enabled && !!userId && !!oposicionId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  })

  return {
    score: data?.score || 0,
    nivel: data?.nivel || 'empezando',
    color: data?.color || '#EF4444',
    mensaje: data?.mensaje || '',
    desglose: data?.desglose || {
      completado: 0,
      aciertos: 0,
      constancia: 0,
      tiempo: 0,
      tendencia: 0,
    },
    isLoading,
    error: error as Error | null,
    refetch,
  }
}

// Hook para obtener historial de OpoMetrics
export function useOpoMetricsHistory({ userId, oposicionId, days = 30 }: UseOpoMetricsOptions & { days?: number }) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['opometrics-history', userId, oposicionId, days],
    queryFn: async () => {
      const fechaInicio = new Date()
      fechaInicio.setDate(fechaInicio.getDate() - days)

      const { data, error } = await supabase
        .from('metricas_diarias')
        .select('fecha, opometrics')
        .eq('user_id', userId)
        .eq('oposicion_id', oposicionId)
        .gte('fecha', fechaInicio.toISOString().split('T')[0])
        .order('fecha', { ascending: true })

      if (error) throw error

      return data || []
    },
    enabled: !!userId && !!oposicionId,
  })
}
