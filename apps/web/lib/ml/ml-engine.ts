// ===========================================
// OpoScore - Motor ML Principal
// Orquesta todos los módulos según el plan
// ===========================================

import type { PlanType } from '@/lib/stripe/config'
import type {
  MLFeatures,
  BasicStatsResult,
  RankingResult,
  TrendResult,
  RegressionPrediction,
  AdvancedPrediction,
  VacancyComparison,
  DailyDataPoint,
  ML_CONFIG,
} from './types'
import { calculateBasicStats, aggregateDailyData, getStatsLastNDays } from './basic-stats'
import { calculateRanking, calculateTrends, detectTrend, calculateVolatility } from './ranking-service'
import { predictPro } from './regression-predictor'
import { predictElite } from './advanced-predictor'
import {
  calculateVacancyComparison,
  generateDemoCompetitors,
  CONVOCATORIAS_DEMO,
  type ConvocatoriaData,
  type CompetidorData
} from './vacancy-comparison'

// ============================================
// RESULTADO COMPLETO DE MÉTRICAS
// ============================================

export interface MLMetricsResult {
  plan: PlanType

  // FREE: Disponible para todos
  basicStats: BasicStatsResult

  // BÁSICO+: Ranking y tendencias
  ranking?: RankingResult
  trends?: TrendResult
  dailyData?: DailyDataPoint[]

  // PRO+: Predicciones con regresión
  prediction?: RegressionPrediction
  features?: MLFeatures

  // ELITE: Predicciones avanzadas y comparativa
  advancedPrediction?: AdvancedPrediction
  vacancyComparison?: VacancyComparison

  // Metadata
  calculatedAt: string
  cacheExpiry: string
}

// ============================================
// EXTRACCIÓN DE FEATURES
// ============================================

export function extractMLFeatures(
  dailyData: DailyDataPoint[],
  basicStats: BasicStatsResult,
  temasStats?: Array<{
    visto: boolean
    porcentaje: number
  }>
): MLFeatures {
  // Estadísticas de períodos
  const stats7 = getStatsLastNDays(dailyData, 7)
  const stats30 = getStatsLastNDays(dailyData, 30)

  // Calcular tendencia
  const porcentajesUltimos14 = dailyData.slice(-14).map(d => d.porcentaje)
  const ultimos7 = porcentajesUltimos14.slice(-7)
  const anteriores7 = porcentajesUltimos14.slice(0, 7)

  const mediaUltimos7 = ultimos7.length > 0
    ? ultimos7.reduce((a, b) => a + b, 0) / ultimos7.length
    : 0
  const mediaAnteriores7 = anteriores7.length > 0
    ? anteriores7.reduce((a, b) => a + b, 0) / anteriores7.length
    : mediaUltimos7

  const tendenciaMejora = mediaUltimos7 - mediaAnteriores7

  // Volatilidad
  const volatilidad = calculateVolatility(dailyData.map(d => d.porcentaje))

  // Preguntas por día promedio
  const diasConActividad = dailyData.filter(d => d.preguntas > 0).length
  const preguntasPorDia = diasConActividad > 0
    ? basicStats.totalPreguntas / diasConActividad
    : 0

  // Cobertura del temario
  let porcentajeTemasVistos = 0
  let porcentajeTemasDominados = 0
  let porcentajeTemasDebiles = 0

  if (temasStats && temasStats.length > 0) {
    const temasVistos = temasStats.filter(t => t.visto).length
    porcentajeTemasVistos = Math.round((temasVistos / temasStats.length) * 100)

    const temasDominados = temasStats.filter(t => t.porcentaje >= 80).length
    porcentajeTemasDominados = Math.round((temasDominados / temasStats.length) * 100)

    const temasDebiles = temasStats.filter(t => t.porcentaje < 50 && t.porcentaje > 0).length
    porcentajeTemasDebiles = Math.round((temasDebiles / temasStats.length) * 100)
  }

  // Días sin estudiar
  const hoy = new Date()
  let diasSinEstudiar = 0
  for (let i = dailyData.length - 1; i >= 0; i--) {
    const fecha = new Date(dailyData[i].fecha)
    const diffDias = Math.floor((hoy.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDias === diasSinEstudiar && dailyData[i].preguntas === 0) {
      diasSinEstudiar++
    } else {
      break
    }
  }

  return {
    // Rendimiento
    porcentajeGlobal: basicStats.porcentajeGlobal,
    porcentajeUltimos7Dias: stats7.porcentaje,
    porcentajeUltimos30Dias: stats30.porcentaje,
    tendenciaMejora,
    volatilidad,

    // Volumen
    testsCompletados: basicStats.testsCompletados,
    preguntasRespondidas: basicStats.totalPreguntas,
    preguntasPorDia: Math.round(preguntasPorDia * 10) / 10,

    // Consistencia
    diasActivo: stats30.diasActivos,
    diasActivoUltimos30: stats30.diasActivos,
    rachaActual: basicStats.rachaActual,
    rachaMaxima: basicStats.mejorRacha,
    diasSinEstudiar,

    // Cobertura
    porcentajeTemasVistos,
    porcentajeTemasDominados,
    porcentajeTemasDebiles,

    // Simulacros (se poblará desde BD si disponible)
    simulacrosCompletados: 0,
    mediaSimulacros: 0,
    mejorSimulacro: 0,

    // Temporales
    minutosEstudioTotal: basicStats.minutosEstudio,
    minutosEstudioPromedioDiario: stats30.diasActivos > 0
      ? Math.round(stats30.minutosTotal / stats30.diasActivos)
      : 0,
    horaPreferidaEstudio: 20, // Default, se calcularía con datos de timestamps

    // Dificultad (se poblará si hay datos)
    porcentajeFaciles: 0,
    porcentajeMedias: 0,
    porcentajeDificiles: 0,
  }
}

// ============================================
// FUNCIÓN PRINCIPAL DEL MOTOR ML
// ============================================

/**
 * Calcula todas las métricas según el plan del usuario
 */
export async function calculateMLMetrics(
  respuestas: Array<{ es_correcta: boolean; created_at: string; tiempo_respuesta_ms?: number }>,
  plan: PlanType,
  options?: {
    rachaActual?: number
    mejorRacha?: number
    minutosTotal?: number
    allUsersScores?: number[]
    oposicionScores?: number[]
    oposicionId?: string
    temasStats?: Array<{ visto: boolean; porcentaje: number }>
    convocatoria?: ConvocatoriaData
    competidores?: CompetidorData[]
    temasConPeso?: Array<{
      temaId: string
      temaNombre: string
      porcentaje: number
      preguntasRespondidas: number
      pesoExamen: number
      frecuenciaHistorica: number
      tipoContenido: string
    }>
  }
): Promise<MLMetricsResult> {
  const now = new Date()

  // Agregar datos diarios
  const dailyData = aggregateDailyData(respuestas)

  // Calcular estadísticas básicas (FREE)
  const basicStats = calculateBasicStats(
    respuestas,
    options?.rachaActual || 0,
    options?.mejorRacha || 0,
    options?.minutosTotal || 0
  )

  // Resultado base
  const result: MLMetricsResult = {
    plan,
    basicStats,
    calculatedAt: now.toISOString(),
    cacheExpiry: new Date(now.getTime() + getCacheMinutes(plan) * 60000).toISOString(),
  }

  // BÁSICO+: Ranking y tendencias
  if (plan !== 'free') {
    result.dailyData = dailyData

    // Ranking
    if (options?.allUsersScores) {
      result.ranking = calculateRanking(
        basicStats.porcentajeGlobal,
        options.allUsersScores,
        basicStats.porcentajeGlobal,
        options.oposicionScores
      )

      // Actualizar tendencia del ranking
      result.ranking.tendenciaSemanal = detectTrend(dailyData, 7)
    }

    // Tendencias
    if (dailyData.length > 0) {
      result.trends = calculateTrends(dailyData)
    }
  }

  // PRO+: Predicciones con regresión
  if (plan === 'pro' || plan === 'elite') {
    const features = extractMLFeatures(dailyData, basicStats, options?.temasStats)
    result.features = features

    if (plan === 'pro') {
      result.prediction = predictPro(features)
    }
  }

  // ELITE: Predicciones avanzadas y comparativa
  if (plan === 'elite') {
    const features = result.features || extractMLFeatures(dailyData, basicStats, options?.temasStats)

    // Predicción avanzada
    result.advancedPrediction = predictElite(features, options?.temasConPeso)

    // Comparación con vacantes
    if (options?.oposicionId && options?.convocatoria) {
      const competidores = options.competidores ||
        generateDemoCompetitors(200, 65, 12)

      result.vacancyComparison = calculateVacancyComparison(
        basicStats.porcentajeGlobal,
        options.convocatoria,
        competidores
      )
    } else if (options?.oposicionId) {
      // Intentar usar datos demo
      const convocatoriaDemo = CONVOCATORIAS_DEMO[options.oposicionId]
      if (convocatoriaDemo) {
        const competidores = generateDemoCompetitors(200, 65, 12)
        result.vacancyComparison = calculateVacancyComparison(
          basicStats.porcentajeGlobal,
          convocatoriaDemo,
          competidores
        )
      }
    }
  }

  return result
}

/**
 * Obtiene minutos de caché según el plan
 */
function getCacheMinutes(plan: PlanType): number {
  switch (plan) {
    case 'free': return 1440 // 24 horas
    case 'basico': return 60 // 1 hora
    case 'pro': return 30
    case 'elite': return 15
    default: return 1440
  }
}

// ============================================
// UTILIDADES DE FORMATO
// ============================================

/**
 * Formatea la probabilidad para mostrar
 */
export function formatProbability(prob: number): {
  text: string
  emoji: string
  color: 'green' | 'lime' | 'yellow' | 'orange' | 'red'
} {
  if (prob >= 80) {
    return { text: 'Muy alta', emoji: '🎯', color: 'green' }
  } else if (prob >= 65) {
    return { text: 'Alta', emoji: '📈', color: 'lime' }
  } else if (prob >= 50) {
    return { text: 'Moderada', emoji: '💪', color: 'yellow' }
  } else if (prob >= 35) {
    return { text: 'Baja', emoji: '📚', color: 'orange' }
  } else {
    return { text: 'Muy baja', emoji: '⚠️', color: 'red' }
  }
}

/**
 * Formatea el ranking para mostrar
 */
export function formatRanking(ranking: RankingResult): {
  position: string
  badge: string
  description: string
} {
  const { posicionGlobal, totalUsuarios, percentilGlobal } = ranking

  let badge: string
  if (percentilGlobal >= 95) {
    badge = '🏆 Top 5%'
  } else if (percentilGlobal >= 90) {
    badge = '🥇 Top 10%'
  } else if (percentilGlobal >= 75) {
    badge = '🥈 Top 25%'
  } else if (percentilGlobal >= 50) {
    badge = '🥉 Top 50%'
  } else {
    badge = '📊 En progreso'
  }

  return {
    position: `#${posicionGlobal} de ${totalUsuarios}`,
    badge,
    description: `Mejor que el ${percentilGlobal}% de usuarios`,
  }
}

/**
 * Genera resumen textual de las métricas
 */
export function generateMetricsSummary(result: MLMetricsResult): string[] {
  const summary: string[] = []

  // Básico
  summary.push(
    `Has respondido ${result.basicStats.totalPreguntas} preguntas con un ${result.basicStats.porcentajeGlobal}% de aciertos.`
  )

  if (result.basicStats.rachaActual > 0) {
    summary.push(
      `Llevas una racha de ${result.basicStats.rachaActual} días estudiando.`
    )
  }

  // Ranking
  if (result.ranking) {
    summary.push(
      `Estás en el puesto #${result.ranking.posicionGlobal} de ${result.ranking.totalUsuarios} usuarios (percentil ${result.ranking.percentilGlobal}).`
    )
  }

  // Tendencias
  if (result.trends) {
    if (result.trends.tendenciaLineal > 0.5) {
      summary.push('Tu rendimiento está mejorando de forma constante.')
    } else if (result.trends.tendenciaLineal < -0.5) {
      summary.push('Tu rendimiento ha bajado últimamente. Considera ajustar tu rutina.')
    }
  }

  // Predicción
  if (result.prediction) {
    const prob = formatProbability(result.prediction.probabilidadAprobado)
    summary.push(
      `Tu probabilidad de aprobar es ${prob.text.toLowerCase()} (${result.prediction.probabilidadAprobado}%).`
    )

    if (result.prediction.diasHastaListo > 0) {
      summary.push(
        `Estimamos que estarás listo en ${result.prediction.diasHastaListo} días.`
      )
    }
  }

  // Avanzado
  if (result.advancedPrediction?.ensemble) {
    summary.push(
      `Nuestros ${result.advancedPrediction.ensemble.metodosAcuerdo}% de modelos coinciden en la predicción.`
    )
  }

  // Vacantes
  if (result.vacancyComparison) {
    const vc = result.vacancyComparison
    if (vc.dentroDelCorte) {
      summary.push(
        `Estás dentro del corte estimado para ${vc.convocatoria.nombre}.`
      )
    } else {
      summary.push(
        `Necesitas subir ${vc.proyeccion.puestosQueFaltan} puestos para estar en zona segura.`
      )
    }
  }

  return summary
}
