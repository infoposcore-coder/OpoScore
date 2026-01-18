// ===========================================
// OpoMetrics - Algoritmo de Puntuación v1
// ===========================================
// Score de 0-100 basado en múltiples factores (heurísticas sin ML)

export type Tendencia = 'subiendo' | 'estable' | 'bajando'

export interface OpoMetricsInput {
  porcentaje_temario_completado: number  // 0-100
  media_aciertos_tests: number           // 0-100
  dias_racha_actual: number
  tiempo_estudio_semana_horas: number
  tendencia_aciertos: Tendencia
  dias_hasta_examen: number | null
}

export interface OpoMetricsResult {
  score: number
  nivel: 'empezando' | 'en_progreso' | 'avanzando' | 'casi_listo' | 'preparado'
  color: string
  mensaje: string
  desglose: {
    completado: number
    aciertos: number
    constancia: number
    tiempo: number
    tendencia: number
  }
}

const WEIGHTS = {
  completado: 0.25,
  aciertos: 0.35,
  constancia: 0.20,
  tiempo: 0.10,
  tendencia: 0.10
} as const

const TENDENCIA_MAP: Record<Tendencia, number> = {
  subiendo: 100,
  estable: 60,
  bajando: 20
}

const NIVELES = [
  { max: 30, nivel: 'empezando', color: '#EF4444', mensaje: 'Estás empezando. ¡Cada paso cuenta!' },
  { max: 50, nivel: 'en_progreso', color: '#F97316', mensaje: 'Vas por buen camino. Mantén el ritmo.' },
  { max: 70, nivel: 'avanzando', color: '#EAB308', mensaje: 'Buen progreso. Sigue así.' },
  { max: 85, nivel: 'casi_listo', color: '#84CC16', mensaje: 'Casi preparado. Un último empujón.' },
  { max: 100, nivel: 'preparado', color: '#22C55E', mensaje: '¡Preparado para aprobar!' }
] as const

export function calcularOpoMetrics(input: OpoMetricsInput): OpoMetricsResult {
  // Factor: Temario completado
  const scoreCompletado = input.porcentaje_temario_completado * WEIGHTS.completado

  // Factor: Media de aciertos (el más importante)
  const scoreAciertos = input.media_aciertos_tests * WEIGHTS.aciertos

  // Factor: Constancia (racha) - máximo 20 días = 100%
  const constanciaScore = Math.min(input.dias_racha_actual * 5, 100)
  const scoreConstancia = constanciaScore * WEIGHTS.constancia

  // Factor: Tiempo de estudio semanal (objetivo: 15h/semana)
  const tiempoScore = Math.min((input.tiempo_estudio_semana_horas / 15) * 100, 100)
  const scoreTiempo = tiempoScore * WEIGHTS.tiempo

  // Factor: Tendencia
  const scoreTendencia = TENDENCIA_MAP[input.tendencia_aciertos] * WEIGHTS.tendencia

  // Score total
  const score = Math.round(
    scoreCompletado + scoreAciertos + scoreConstancia + scoreTiempo + scoreTendencia
  )

  // Determinar nivel
  const nivelInfo = NIVELES.find(n => score <= n.max) || NIVELES[NIVELES.length - 1]

  return {
    score,
    nivel: nivelInfo.nivel as OpoMetricsResult['nivel'],
    color: nivelInfo.color,
    mensaje: nivelInfo.mensaje,
    desglose: {
      completado: Math.round(scoreCompletado / WEIGHTS.completado),
      aciertos: Math.round(scoreAciertos / WEIGHTS.aciertos),
      constancia: Math.round(constanciaScore),
      tiempo: Math.round(tiempoScore),
      tendencia: TENDENCIA_MAP[input.tendencia_aciertos]
    }
  }
}

// Calcular tendencia basándose en los últimos 7 días de aciertos
export function calcularTendencia(aciertosDiarios: number[]): Tendencia {
  if (aciertosDiarios.length < 3) return 'estable'

  const ultimos = aciertosDiarios.slice(-7)
  const mitad = Math.floor(ultimos.length / 2)

  const primeraMitad = ultimos.slice(0, mitad)
  const segundaMitad = ultimos.slice(mitad)

  const mediaPrimera = primeraMitad.reduce((a, b) => a + b, 0) / primeraMitad.length
  const mediaSegunda = segundaMitad.reduce((a, b) => a + b, 0) / segundaMitad.length

  const diferencia = mediaSegunda - mediaPrimera

  if (diferencia > 5) return 'subiendo'
  if (diferencia < -5) return 'bajando'
  return 'estable'
}

// Estimar fecha de preparación basada en progreso actual
export function estimarFechaPreparacion(
  opometrics: number,
  tendencia: Tendencia,
  diasEstudiando: number
): Date | null {
  if (opometrics >= 85) {
    return new Date() // Ya está preparado
  }

  // Puntos que faltan para llegar a 85
  const puntosFaltantes = 85 - opometrics

  // Tasa de mejora basada en tendencia y tiempo estudiando
  let tasaDiaria: number
  switch (tendencia) {
    case 'subiendo':
      tasaDiaria = 0.8
      break
    case 'estable':
      tasaDiaria = 0.4
      break
    case 'bajando':
      tasaDiaria = 0.1
      break
  }

  // Ajustar por días estudiando (los primeros días se progresa más rápido)
  if (diasEstudiando < 30) {
    tasaDiaria *= 1.5
  } else if (diasEstudiando > 180) {
    tasaDiaria *= 0.8
  }

  const diasEstimados = Math.ceil(puntosFaltantes / tasaDiaria)

  const fechaEstimada = new Date()
  fechaEstimada.setDate(fechaEstimada.getDate() + diasEstimados)

  return fechaEstimada
}
