// ===========================================
// OpoMetrics - Comparación Vacantes/Competidores (ELITE)
// Sistema de análisis competitivo
// ===========================================

import type { VacancyComparison } from './types'

/**
 * Datos de convocatoria
 */
export interface ConvocatoriaData {
  nombre: string
  plazasOfertadas: number
  fechaExamen: string | null
  aspirantesEstimados: number
  scoreCorteHistorico: number // Media histórica de nota de corte
  tasaAprobados: number // % histórico de aprobados
}

/**
 * Datos de competidores en la plataforma
 */
export interface CompetidorData {
  score: number // Puntuación normalizada 0-100
  diasEstudio: number
  preguntasRespondidas: number
  porcentajeAciertos: number
}

/**
 * Calcula la comparación de vacantes y competidores
 */
export function calculateVacancyComparison(
  userScore: number,
  convocatoria: ConvocatoriaData,
  competidores: CompetidorData[]
): VacancyComparison {
  // Ordenar competidores por score
  const sortedCompetidores = [...competidores].sort((a, b) => b.score - a.score)
  const totalCompetidores = sortedCompetidores.length

  // Calcular posición estimada del usuario
  const posicionEstimada = sortedCompetidores.filter(c => c.score > userScore).length + 1

  // Ratio plazas/opositores
  const ratioPlazasOpositores = convocatoria.plazasOfertadas / convocatoria.aspirantesEstimados

  // Determinar si está dentro del corte estimado
  const posicionCorte = Math.ceil(convocatoria.plazasOfertadas *
    (totalCompetidores / convocatoria.aspirantesEstimados))
  const dentroDelCorte = posicionEstimada <= posicionCorte
  const margenHastaCorte = posicionCorte - posicionEstimada

  // Estadísticas de competidores
  const mejorQueUsuario = sortedCompetidores.filter(c => c.score > userScore).length
  const peorQueUsuario = sortedCompetidores.filter(c => c.score < userScore).length
  const mismoNivel = sortedCompetidores.filter(c =>
    Math.abs(c.score - userScore) <= 5
  ).length

  // Distribución de scores
  const scores = sortedCompetidores.map(c => c.score)
  const distribucionScores = calculateScoreDistribution(scores, userScore, convocatoria)

  // Calcular proyección
  const proyeccion = calculateProjection(
    userScore,
    posicionEstimada,
    convocatoria,
    totalCompetidores
  )

  return {
    convocatoria: {
      nombre: convocatoria.nombre,
      plazasOfertadas: convocatoria.plazasOfertadas,
      fechaExamen: convocatoria.fechaExamen,
      ratioPlazasOpositores: Math.round(ratioPlazasOpositores * 1000) / 10, // en %
    },
    posicionEstimada,
    dentroDelCorte,
    margenHastaCorte,
    competidores: {
      total: totalCompetidores,
      mejorQueUsuario,
      peorQueUsuario,
      mismoNivel,
    },
    distribucionScores,
    proyeccion,
  }
}

/**
 * Calcula la distribución de scores con percentiles
 */
function calculateScoreDistribution(
  scores: number[],
  userScore: number,
  convocatoria: ConvocatoriaData
): VacancyComparison['distribucionScores'] {
  if (scores.length === 0) {
    return {
      percentil10: 0,
      percentil25: 0,
      percentil50: 0,
      percentil75: 0,
      percentil90: 0,
      scoreUsuario: userScore,
      scoreCorteEstimado: convocatoria.scoreCorteHistorico,
    }
  }

  const sorted = [...scores].sort((a, b) => a - b)
  const n = sorted.length

  const getPercentile = (p: number) => {
    const index = Math.ceil((p / 100) * n) - 1
    return sorted[Math.max(0, Math.min(index, n - 1))]
  }

  return {
    percentil10: Math.round(getPercentile(10) * 10) / 10,
    percentil25: Math.round(getPercentile(25) * 10) / 10,
    percentil50: Math.round(getPercentile(50) * 10) / 10,
    percentil75: Math.round(getPercentile(75) * 10) / 10,
    percentil90: Math.round(getPercentile(90) * 10) / 10,
    scoreUsuario: Math.round(userScore * 10) / 10,
    scoreCorteEstimado: convocatoria.scoreCorteHistorico,
  }
}

/**
 * Calcula proyección de probabilidad de plaza
 */
function calculateProjection(
  userScore: number,
  posicionEstimada: number,
  convocatoria: ConvocatoriaData,
  totalCompetidoresPlataforma: number
): VacancyComparison['proyeccion'] {
  // Extrapolar posición a total de aspirantes
  const factorExtrapolacion = convocatoria.aspirantesEstimados / totalCompetidoresPlataforma
  const posicionExtrapolada = Math.round(posicionEstimada * factorExtrapolacion)

  // Puestos que faltan para estar en zona segura (top 80% de plazas)
  const zonaSegura = Math.ceil(convocatoria.plazasOfertadas * 0.8)
  const puestosQueFaltan = Math.max(0, posicionExtrapolada - zonaSegura)

  // Probabilidad de plaza basada en posición relativa
  let probabilidadPlaza: number
  if (posicionExtrapolada <= convocatoria.plazasOfertadas * 0.5) {
    // Top 50% de plazas: muy alta probabilidad
    probabilidadPlaza = 90 + (1 - posicionExtrapolada / (convocatoria.plazasOfertadas * 0.5)) * 8
  } else if (posicionExtrapolada <= convocatoria.plazasOfertadas) {
    // Dentro de plazas: probabilidad decreciente
    const factor = (posicionExtrapolada - convocatoria.plazasOfertadas * 0.5) /
      (convocatoria.plazasOfertadas * 0.5)
    probabilidadPlaza = 90 - factor * 40
  } else if (posicionExtrapolada <= convocatoria.plazasOfertadas * 1.2) {
    // Cerca del corte: probabilidad moderada
    probabilidadPlaza = 50 - (posicionExtrapolada - convocatoria.plazasOfertadas) /
      (convocatoria.plazasOfertadas * 0.2) * 25
  } else {
    // Lejos del corte: probabilidad baja
    const exceso = posicionExtrapolada / convocatoria.plazasOfertadas - 1.2
    probabilidadPlaza = Math.max(5, 25 - exceso * 20)
  }

  // Mejora necesaria para llegar al corte
  const mejoraNecesaria = userScore < convocatoria.scoreCorteHistorico
    ? convocatoria.scoreCorteHistorico - userScore
    : 0

  // Tiempo estimado para alcanzar (asumiendo 0.5% mejora por día)
  const tiempoEstimado = mejoraNecesaria > 0
    ? Math.ceil(mejoraNecesaria / 0.5)
    : 0

  return {
    probabilidadPlaza: Math.round(probabilidadPlaza),
    puestosQueFaltan,
    mejoraNecesaria: Math.round(mejoraNecesaria * 10) / 10,
    tiempoEstimado,
  }
}

/**
 * Genera datos de demo para competidores
 * Usado cuando no hay suficientes datos reales
 */
export function generateDemoCompetitors(
  numCompetidores: number,
  mediaScore: number = 65,
  desviacion: number = 12
): CompetidorData[] {
  const competidores: CompetidorData[] = []

  for (let i = 0; i < numCompetidores; i++) {
    // Distribución normal aproximada usando Box-Muller
    const u1 = Math.random()
    const u2 = Math.random()
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    const score = Math.max(20, Math.min(98, mediaScore + z * desviacion))

    competidores.push({
      score: Math.round(score * 10) / 10,
      diasEstudio: Math.floor(30 + Math.random() * 150),
      preguntasRespondidas: Math.floor(200 + Math.random() * 3000),
      porcentajeAciertos: Math.round((40 + Math.random() * 50) * 10) / 10,
    })
  }

  return competidores
}

/**
 * Datos de convocatorias conocidas (demo)
 */
export const CONVOCATORIAS_DEMO: Record<string, ConvocatoriaData> = {
  'auxiliar-administrativo-estado': {
    nombre: 'Auxiliar Administrativo del Estado',
    plazasOfertadas: 520,
    fechaExamen: '2026-06-15',
    aspirantesEstimados: 45000,
    scoreCorteHistorico: 72,
    tasaAprobados: 0.012,
  },
  'administrativo-estado': {
    nombre: 'Administrativo del Estado',
    plazasOfertadas: 350,
    fechaExamen: '2026-09-20',
    aspirantesEstimados: 28000,
    scoreCorteHistorico: 75,
    tasaAprobados: 0.0125,
  },
  'tramitacion-procesal': {
    nombre: 'Tramitación Procesal y Administrativa',
    plazasOfertadas: 1500,
    fechaExamen: '2026-05-10',
    aspirantesEstimados: 85000,
    scoreCorteHistorico: 68,
    tasaAprobados: 0.018,
  },
  'gestion-procesal': {
    nombre: 'Gestión Procesal y Administrativa',
    plazasOfertadas: 600,
    fechaExamen: '2026-07-12',
    aspirantesEstimados: 35000,
    scoreCorteHistorico: 74,
    tasaAprobados: 0.017,
  },
  'auxilio-judicial': {
    nombre: 'Auxilio Judicial',
    plazasOfertadas: 2000,
    fechaExamen: '2026-04-20',
    aspirantesEstimados: 95000,
    scoreCorteHistorico: 65,
    tasaAprobados: 0.021,
  },
  'tecnico-hacienda': {
    nombre: 'Técnico de Hacienda',
    plazasOfertadas: 450,
    fechaExamen: null,
    aspirantesEstimados: 25000,
    scoreCorteHistorico: 78,
    tasaAprobados: 0.018,
  },
  'inspector-hacienda': {
    nombre: 'Inspector de Hacienda',
    plazasOfertadas: 150,
    fechaExamen: null,
    aspirantesEstimados: 8000,
    scoreCorteHistorico: 82,
    tasaAprobados: 0.019,
  },
  'policia-nacional': {
    nombre: 'Policía Nacional (Escala Básica)',
    plazasOfertadas: 2800,
    fechaExamen: '2026-03-15',
    aspirantesEstimados: 65000,
    scoreCorteHistorico: 70,
    tasaAprobados: 0.043,
  },
  'guardia-civil': {
    nombre: 'Guardia Civil',
    plazasOfertadas: 2154,
    fechaExamen: '2026-04-01',
    aspirantesEstimados: 55000,
    scoreCorteHistorico: 68,
    tasaAprobados: 0.039,
  },
  'correos': {
    nombre: 'Personal Laboral de Correos',
    plazasOfertadas: 4055,
    fechaExamen: '2026-02-28',
    aspirantesEstimados: 120000,
    scoreCorteHistorico: 60,
    tasaAprobados: 0.034,
  },
}

/**
 * Calcula estadísticas comparativas del usuario vs. media de aprobados históricos
 */
export function compareWithHistoricalApproved(
  userStats: {
    porcentajeAciertos: number
    horasEstudio: number
    temasCompletados: number
    simulacrosRealizados: number
  },
  convocatoria: ConvocatoriaData
): {
  comparacion: Record<string, { usuario: number; mediaAprobados: number; diferencia: number }>
  nivelPreparacion: 'excelente' | 'bueno' | 'en_progreso' | 'necesita_mejorar'
  puntosFuertes: string[]
  areasDebiles: string[]
} {
  // Datos aproximados de aprobados históricos (benchmark)
  const mediaAprobados = {
    porcentajeAciertos: convocatoria.scoreCorteHistorico + 5,
    horasEstudio: 600, // horas totales típicas
    temasCompletados: 100, // % del temario
    simulacrosRealizados: 15,
  }

  const comparacion = {
    porcentajeAciertos: {
      usuario: userStats.porcentajeAciertos,
      mediaAprobados: mediaAprobados.porcentajeAciertos,
      diferencia: userStats.porcentajeAciertos - mediaAprobados.porcentajeAciertos,
    },
    horasEstudio: {
      usuario: userStats.horasEstudio,
      mediaAprobados: mediaAprobados.horasEstudio,
      diferencia: userStats.horasEstudio - mediaAprobados.horasEstudio,
    },
    temasCompletados: {
      usuario: userStats.temasCompletados,
      mediaAprobados: mediaAprobados.temasCompletados,
      diferencia: userStats.temasCompletados - mediaAprobados.temasCompletados,
    },
    simulacrosRealizados: {
      usuario: userStats.simulacrosRealizados,
      mediaAprobados: mediaAprobados.simulacrosRealizados,
      diferencia: userStats.simulacrosRealizados - mediaAprobados.simulacrosRealizados,
    },
  }

  // Calcular nivel de preparación
  let puntosPositivos = 0
  Object.values(comparacion).forEach(c => {
    if (c.diferencia >= 0) puntosPositivos++
  })

  let nivelPreparacion: 'excelente' | 'bueno' | 'en_progreso' | 'necesita_mejorar'
  if (puntosPositivos === 4 && comparacion.porcentajeAciertos.diferencia > 5) {
    nivelPreparacion = 'excelente'
  } else if (puntosPositivos >= 3) {
    nivelPreparacion = 'bueno'
  } else if (puntosPositivos >= 2) {
    nivelPreparacion = 'en_progreso'
  } else {
    nivelPreparacion = 'necesita_mejorar'
  }

  // Identificar puntos fuertes y débiles
  const puntosFuertes: string[] = []
  const areasDebiles: string[] = []

  if (comparacion.porcentajeAciertos.diferencia >= 0) {
    puntosFuertes.push('Buen porcentaje de aciertos')
  } else {
    areasDebiles.push('Mejorar porcentaje de aciertos')
  }

  if (comparacion.horasEstudio.diferencia >= 0) {
    puntosFuertes.push('Suficientes horas de estudio')
  } else {
    areasDebiles.push(`Faltan ${Math.abs(Math.round(comparacion.horasEstudio.diferencia))} horas de estudio`)
  }

  if (comparacion.temasCompletados.diferencia >= 0) {
    puntosFuertes.push('Buen avance en el temario')
  } else {
    areasDebiles.push('Completar más temas del temario')
  }

  if (comparacion.simulacrosRealizados.diferencia >= 0) {
    puntosFuertes.push('Buena práctica con simulacros')
  } else {
    areasDebiles.push(`Realizar ${Math.abs(comparacion.simulacrosRealizados.diferencia)} simulacros más`)
  }

  return {
    comparacion,
    nivelPreparacion,
    puntosFuertes,
    areasDebiles,
  }
}
