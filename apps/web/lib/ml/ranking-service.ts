// ===========================================
// OpoScore - Servicio de Ranking (BÁSICO)
// Ranking, percentiles y tendencias
// ===========================================

import type { RankingResult, TrendResult, DailyDataPoint } from './types'

/**
 * Calcula el ranking del usuario comparado con otros
 */
export function calculateRanking(
  userScore: number,
  allScores: number[],
  userScoreOposicion?: number,
  oposicionScores?: number[]
): RankingResult {
  // Ordenar scores descendente
  const sortedGlobal = [...allScores].sort((a, b) => b - a)
  const posicionGlobal = sortedGlobal.findIndex(s => s <= userScore) + 1 || sortedGlobal.length
  const totalUsuarios = sortedGlobal.length

  // Calcular percentil global
  const usuariosPorDebajo = sortedGlobal.filter(s => s < userScore).length
  const percentilGlobal = totalUsuarios > 0
    ? Math.round((usuariosPorDebajo / totalUsuarios) * 100)
    : 0

  // Ranking por oposición
  let posicionOposicion = 0
  let totalOposicion = 0
  let percentilOposicion = 0

  if (oposicionScores && oposicionScores.length > 0) {
    const sortedOposicion = [...oposicionScores].sort((a, b) => b - a)
    const scoreOpo = userScoreOposicion ?? userScore
    posicionOposicion = sortedOposicion.findIndex(s => s <= scoreOpo) + 1 || sortedOposicion.length
    totalOposicion = sortedOposicion.length
    const opoUsuariosPorDebajo = sortedOposicion.filter(s => s < scoreOpo).length
    percentilOposicion = totalOposicion > 0
      ? Math.round((opoUsuariosPorDebajo / totalOposicion) * 100)
      : 0
  }

  // Calcular percentiles de distribución
  const percentiles = calculatePercentiles(sortedGlobal, userScore)

  return {
    posicionGlobal,
    totalUsuarios,
    percentilGlobal,
    posicionOposicion,
    totalOposicion,
    percentilOposicion,
    tendenciaSemanal: 'estable', // Se actualiza con datos históricos
    cambioUltimaSemana: 0,
    percentiles,
  }
}

/**
 * Calcula percentiles de la distribución
 */
function calculatePercentiles(
  sortedScores: number[],
  userScore: number
): RankingResult['percentiles'] {
  const n = sortedScores.length
  if (n === 0) {
    return { p25: 0, p50: 0, p75: 0, p90: 0, userValue: userScore }
  }

  const getPercentile = (p: number) => {
    const index = Math.ceil((p / 100) * n) - 1
    return sortedScores[Math.max(0, Math.min(index, n - 1))]
  }

  return {
    p25: getPercentile(25),
    p50: getPercentile(50),
    p75: getPercentile(75),
    p90: getPercentile(90),
    userValue: userScore,
  }
}

/**
 * Calcula media móvil simple
 */
export function calculateMovingAverage(
  data: number[],
  windowSize: number
): number[] {
  if (data.length < windowSize) return data

  const result: number[] = []

  for (let i = windowSize - 1; i < data.length; i++) {
    const window = data.slice(i - windowSize + 1, i + 1)
    const sum = window.reduce((a, b) => a + b, 0)
    result.push(Math.round((sum / windowSize) * 10) / 10)
  }

  return result
}

/**
 * Calcula media móvil exponencial (EMA)
 * Da más peso a valores recientes
 */
export function calculateEMA(
  data: number[],
  windowSize: number
): number[] {
  if (data.length === 0) return []

  const multiplier = 2 / (windowSize + 1)
  const result: number[] = [data[0]]

  for (let i = 1; i < data.length; i++) {
    const ema = (data[i] - result[i - 1]) * multiplier + result[i - 1]
    result.push(Math.round(ema * 10) / 10)
  }

  return result
}

/**
 * Calcula tendencias usando regresión lineal simple
 */
export function calculateTrends(dailyData: DailyDataPoint[]): TrendResult {
  const porcentajes = dailyData.map(d => d.porcentaje)

  // Media móvil 7 días
  const ma7 = calculateMovingAverage(porcentajes, 7)

  // Media móvil 30 días
  const ma30 = calculateMovingAverage(porcentajes, 30)

  // Regresión lineal para tendencia
  const { slope, intercept } = linearRegression(
    porcentajes.map((_, i) => i),
    porcentajes
  )

  // Proyecciones
  const lastIndex = porcentajes.length - 1
  const proyeccion7 = Math.max(0, Math.min(100,
    Math.round((slope * (lastIndex + 7) + intercept) * 10) / 10
  ))
  const proyeccion30 = Math.max(0, Math.min(100,
    Math.round((slope * (lastIndex + 30) + intercept) * 10) / 10
  ))

  return {
    mediaMovil7Dias: ma7,
    mediaMovil30Dias: ma30,
    tendenciaLineal: Math.round(slope * 1000) / 1000, // pendiente por día
    proyeccion7Dias: proyeccion7,
    proyeccion30Dias: proyeccion30,
  }
}

/**
 * Regresión lineal simple (mínimos cuadrados)
 */
export function linearRegression(
  x: number[],
  y: number[]
): { slope: number; intercept: number; rSquared: number } {
  const n = x.length
  if (n === 0 || n !== y.length) {
    return { slope: 0, intercept: 0, rSquared: 0 }
  }

  // Calcular medias
  const meanX = x.reduce((a, b) => a + b, 0) / n
  const meanY = y.reduce((a, b) => a + b, 0) / n

  // Calcular varianzas y covarianza
  let ssXX = 0
  let ssYY = 0
  let ssXY = 0

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX
    const dy = y[i] - meanY
    ssXX += dx * dx
    ssYY += dy * dy
    ssXY += dx * dy
  }

  // Coeficientes
  const slope = ssXX !== 0 ? ssXY / ssXX : 0
  const intercept = meanY - slope * meanX

  // R-cuadrado
  const rSquared = ssXX * ssYY !== 0 ? (ssXY * ssXY) / (ssXX * ssYY) : 0

  return { slope, intercept, rSquared }
}

/**
 * Detecta la tendencia reciente
 */
export function detectTrend(
  dailyData: DailyDataPoint[],
  diasAnalisis: number = 7
): 'subiendo' | 'estable' | 'bajando' {
  if (dailyData.length < 2) return 'estable'

  const recientes = dailyData.slice(-diasAnalisis)
  const anteriores = dailyData.slice(-diasAnalisis * 2, -diasAnalisis)

  if (recientes.length === 0 || anteriores.length === 0) return 'estable'

  const mediaReciente = recientes.reduce((sum, d) => sum + d.porcentaje, 0) / recientes.length
  const mediaAnterior = anteriores.reduce((sum, d) => sum + d.porcentaje, 0) / anteriores.length

  const diferencia = mediaReciente - mediaAnterior

  if (diferencia > 3) return 'subiendo'
  if (diferencia < -3) return 'bajando'
  return 'estable'
}

/**
 * Calcula la volatilidad (desviación estándar) del rendimiento
 */
export function calculateVolatility(porcentajes: number[]): number {
  if (porcentajes.length < 2) return 0

  const mean = porcentajes.reduce((a, b) => a + b, 0) / porcentajes.length
  const squaredDiffs = porcentajes.map(p => Math.pow(p - mean, 2))
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / porcentajes.length

  return Math.round(Math.sqrt(avgSquaredDiff) * 10) / 10
}

/**
 * Compara el ranking actual con el de hace N días
 */
export function compareRankingChange(
  currentRanking: number,
  historicalRankings: Array<{ fecha: string; posicion: number }>,
  diasAtras: number = 7
): { cambio: number; tendencia: 'subiendo' | 'estable' | 'bajando' } {
  const fechaLimite = new Date()
  fechaLimite.setDate(fechaLimite.getDate() - diasAtras)

  const rankingAnterior = historicalRankings.find(
    r => new Date(r.fecha) <= fechaLimite
  )

  if (!rankingAnterior) {
    return { cambio: 0, tendencia: 'estable' }
  }

  const cambio = rankingAnterior.posicion - currentRanking // Positivo = mejoró

  let tendencia: 'subiendo' | 'estable' | 'bajando' = 'estable'
  if (cambio > 2) tendencia = 'subiendo'
  else if (cambio < -2) tendencia = 'bajando'

  return { cambio, tendencia }
}
