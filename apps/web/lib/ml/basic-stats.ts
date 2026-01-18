// ===========================================
// OpoScore - Estadísticas Básicas (FREE)
// Métricas disponibles para todos los usuarios
// ===========================================

import type { BasicStatsResult, DailyDataPoint } from './types'

/**
 * Calcula estadísticas básicas a partir de datos de respuestas
 */
export function calculateBasicStats(
  respuestas: Array<{ es_correcta: boolean; created_at: string }>,
  rachaActual: number = 0,
  mejorRacha: number = 0,
  minutosTotal: number = 0
): BasicStatsResult {
  const totalPreguntas = respuestas.length
  const totalCorrectas = respuestas.filter(r => r.es_correcta).length

  // Agrupar por día para contar tests (asumimos un test por sesión de respuestas)
  const respuestasPorDia = new Map<string, number>()
  respuestas.forEach(r => {
    const fecha = r.created_at.split('T')[0]
    respuestasPorDia.set(fecha, (respuestasPorDia.get(fecha) || 0) + 1)
  })

  // Estimamos tests como días con al menos 10 respuestas
  const testsCompletados = Array.from(respuestasPorDia.values())
    .filter(count => count >= 10).length

  return {
    totalPreguntas,
    totalCorrectas,
    porcentajeGlobal: totalPreguntas > 0
      ? Math.round((totalCorrectas / totalPreguntas) * 1000) / 10
      : 0,
    testsCompletados,
    rachaActual,
    mejorRacha,
    minutosEstudio: minutosTotal,
  }
}

/**
 * Calcula la racha de días consecutivos estudiando
 */
export function calculateStreak(dailyData: DailyDataPoint[]): {
  actual: number
  mejor: number
} {
  if (dailyData.length === 0) return { actual: 0, mejor: 0 }

  // Ordenar por fecha descendente
  const sorted = [...dailyData].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  )

  // Calcular racha actual (días consecutivos desde hoy)
  let rachaActual = 0
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  for (let i = 0; i < sorted.length; i++) {
    const fechaData = new Date(sorted[i].fecha)
    fechaData.setHours(0, 0, 0, 0)

    const diasDiferencia = Math.floor(
      (hoy.getTime() - fechaData.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diasDiferencia === i && sorted[i].preguntas > 0) {
      rachaActual++
    } else {
      break
    }
  }

  // Calcular mejor racha histórica
  let mejorRacha = 0
  let rachaTemp = 0

  // Ordenar ascendente para calcular mejor racha
  const sortedAsc = [...dailyData].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  )

  for (let i = 0; i < sortedAsc.length; i++) {
    if (sortedAsc[i].preguntas > 0) {
      if (i === 0) {
        rachaTemp = 1
      } else {
        const fechaAnterior = new Date(sortedAsc[i - 1].fecha)
        const fechaActual = new Date(sortedAsc[i].fecha)
        const diffDias = Math.floor(
          (fechaActual.getTime() - fechaAnterior.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (diffDias === 1) {
          rachaTemp++
        } else {
          mejorRacha = Math.max(mejorRacha, rachaTemp)
          rachaTemp = 1
        }
      }
    } else {
      mejorRacha = Math.max(mejorRacha, rachaTemp)
      rachaTemp = 0
    }
  }

  mejorRacha = Math.max(mejorRacha, rachaTemp, rachaActual)

  return { actual: rachaActual, mejor: mejorRacha }
}

/**
 * Agrupa respuestas por día
 */
export function aggregateDailyData(
  respuestas: Array<{
    es_correcta: boolean
    created_at: string
    tiempo_respuesta_ms?: number
  }>
): DailyDataPoint[] {
  const porDia = new Map<string, {
    preguntas: number
    correctas: number
    tiempoMs: number
  }>()

  respuestas.forEach(r => {
    const fecha = r.created_at.split('T')[0]
    const existing = porDia.get(fecha) || { preguntas: 0, correctas: 0, tiempoMs: 0 }

    porDia.set(fecha, {
      preguntas: existing.preguntas + 1,
      correctas: existing.correctas + (r.es_correcta ? 1 : 0),
      tiempoMs: existing.tiempoMs + (r.tiempo_respuesta_ms || 0),
    })
  })

  return Array.from(porDia.entries())
    .map(([fecha, data]) => ({
      fecha,
      preguntas: data.preguntas,
      correctas: data.correctas,
      porcentaje: data.preguntas > 0
        ? Math.round((data.correctas / data.preguntas) * 100)
        : 0,
      minutos: Math.round(data.tiempoMs / 60000),
    }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
}

/**
 * Calcula estadísticas de los últimos N días
 */
export function getStatsLastNDays(
  dailyData: DailyDataPoint[],
  dias: number
): {
  totalPreguntas: number
  totalCorrectas: number
  porcentaje: number
  diasActivos: number
  minutosTotal: number
} {
  const fechaLimite = new Date()
  fechaLimite.setDate(fechaLimite.getDate() - dias)

  const filtrado = dailyData.filter(
    d => new Date(d.fecha) >= fechaLimite
  )

  const totalPreguntas = filtrado.reduce((sum, d) => sum + d.preguntas, 0)
  const totalCorrectas = filtrado.reduce((sum, d) => sum + d.correctas, 0)
  const diasActivos = filtrado.filter(d => d.preguntas > 0).length
  const minutosTotal = filtrado.reduce((sum, d) => sum + d.minutos, 0)

  return {
    totalPreguntas,
    totalCorrectas,
    porcentaje: totalPreguntas > 0
      ? Math.round((totalCorrectas / totalPreguntas) * 100)
      : 0,
    diasActivos,
    minutosTotal,
  }
}
