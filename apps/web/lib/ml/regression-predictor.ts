// ===========================================
// OpoMetrics - Predictor con Regresión (PRO)
// Linear Regression + Logistic Regression
// ===========================================

import type {
  MLFeatures,
  RegressionPrediction,
  FactorAnalysis,
  Recommendation
} from './types'
import { linearRegression } from './ranking-service'

// Pesos del modelo entrenado (simulados basados en análisis de opositores)
const MODEL_WEIGHTS = {
  porcentajeGlobal: 0.25,
  porcentajeUltimos7Dias: 0.15,
  tendenciaMejora: 0.10,
  consistencia: 0.15,
  volumen: 0.10,
  cobertura: 0.15,
  simulacros: 0.10,
}

// Umbrales para aprobar (basados en históricos)
const UMBRAL_APROBADO = 0.65 // 65% probabilidad mínima
const UMBRAL_EN_RIESGO = 0.45

/**
 * Predicción usando Regresión Lineal Múltiple
 */
export function predictWithLinearRegression(features: MLFeatures): {
  probabilidad: number
  coeficientes: { intercepto: number; pesos: Record<string, number> }
  rSquared: number
} {
  // Normalizar features a escala 0-1
  const normalized = normalizeFeatures(features)

  // Calcular score lineal ponderado
  let score = 0.15 // Intercepto base

  const pesos: Record<string, number> = {}

  // Rendimiento (peso alto)
  pesos.porcentajeGlobal = MODEL_WEIGHTS.porcentajeGlobal
  score += normalized.porcentajeGlobal * MODEL_WEIGHTS.porcentajeGlobal

  pesos.porcentajeReciente = MODEL_WEIGHTS.porcentajeUltimos7Dias
  score += normalized.porcentajeUltimos7Dias * MODEL_WEIGHTS.porcentajeUltimos7Dias

  // Tendencia
  pesos.tendencia = MODEL_WEIGHTS.tendenciaMejora
  const tendenciaNorm = Math.min(1, Math.max(0, (features.tendenciaMejora + 10) / 20))
  score += tendenciaNorm * MODEL_WEIGHTS.tendenciaMejora

  // Consistencia
  pesos.consistencia = MODEL_WEIGHTS.consistencia
  const consistencia = calculateConsistencyScore(features)
  score += consistencia * MODEL_WEIGHTS.consistencia

  // Volumen de práctica
  pesos.volumen = MODEL_WEIGHTS.volumen
  const volumen = Math.min(1, Math.log10(features.preguntasRespondidas + 1) / 4)
  score += volumen * MODEL_WEIGHTS.volumen

  // Cobertura del temario
  pesos.cobertura = MODEL_WEIGHTS.cobertura
  const cobertura = (features.porcentajeTemasVistos + features.porcentajeTemasDominados * 2) / 300
  score += cobertura * MODEL_WEIGHTS.cobertura

  // Simulacros
  pesos.simulacros = MODEL_WEIGHTS.simulacros
  const simScore = features.simulacrosCompletados > 0
    ? Math.min(1, (features.mediaSimulacros / 100) * Math.min(1, features.simulacrosCompletados / 5))
    : 0.2
  score += simScore * MODEL_WEIGHTS.simulacros

  // Ajustar al rango 0-1
  const probabilidad = Math.max(0.1, Math.min(0.95, score))

  // R² simulado basado en cantidad de datos
  const rSquared = Math.min(0.85, 0.5 + (features.preguntasRespondidas / 2000) * 0.35)

  return {
    probabilidad: Math.round(probabilidad * 100),
    coeficientes: { intercepto: 0.15, pesos },
    rSquared: Math.round(rSquared * 100) / 100,
  }
}

/**
 * Predicción usando Regresión Logística
 * P(aprobar) = 1 / (1 + e^(-z)) donde z = sum(wi * xi)
 */
export function predictWithLogisticRegression(features: MLFeatures): {
  probabilidad: number
  logOdds: number
  clasificacion: 'aprobará' | 'en_riesgo' | 'necesita_mejorar'
} {
  const normalized = normalizeFeatures(features)

  // Calcular log-odds (z)
  let z = -2.5 // Intercepto (sesgo hacia necesitar más estudio)

  // Features con coeficientes logísticos
  z += normalized.porcentajeGlobal * 3.5
  z += normalized.porcentajeUltimos7Dias * 2.0
  z += Math.min(1, Math.max(-1, features.tendenciaMejora / 10)) * 1.5
  z += calculateConsistencyScore(features) * 2.0
  z += Math.min(1, features.preguntasRespondidas / 3000) * 1.5
  z += (features.porcentajeTemasDominados / 100) * 2.5
  z += (features.simulacrosCompletados > 0 ? features.mediaSimulacros / 100 : 0) * 1.0

  // Penalizaciones
  if (features.diasSinEstudiar > 7) z -= 0.5
  if (features.volatilidad > 15) z -= 0.3
  if (features.porcentajeTemasDebiles > 30) z -= 0.5

  // Función sigmoide
  const probabilidad = 1 / (1 + Math.exp(-z))

  // Clasificación
  let clasificacion: 'aprobará' | 'en_riesgo' | 'necesita_mejorar'
  if (probabilidad >= UMBRAL_APROBADO) {
    clasificacion = 'aprobará'
  } else if (probabilidad >= UMBRAL_EN_RIESGO) {
    clasificacion = 'en_riesgo'
  } else {
    clasificacion = 'necesita_mejorar'
  }

  return {
    probabilidad: Math.round(probabilidad * 100),
    logOdds: Math.round(z * 100) / 100,
    clasificacion,
  }
}

/**
 * Calcula intervalo de confianza para la predicción
 */
export function calculateConfidenceInterval(
  probabilidad: number,
  numMuestras: number
): { inferior: number; superior: number } {
  // Error estándar aproximado
  const p = probabilidad / 100
  const se = Math.sqrt((p * (1 - p)) / Math.max(numMuestras, 30))

  // Intervalo 95% (z = 1.96)
  const margen = 1.96 * se * 100

  return {
    inferior: Math.max(0, Math.round(probabilidad - margen)),
    superior: Math.min(100, Math.round(probabilidad + margen)),
  }
}

/**
 * Análisis de factores que contribuyen a la predicción
 */
export function analyzeFactors(features: MLFeatures): {
  positivos: FactorAnalysis[]
  negativos: FactorAnalysis[]
} {
  const positivos: FactorAnalysis[] = []
  const negativos: FactorAnalysis[] = []

  // Porcentaje global
  if (features.porcentajeGlobal >= 75) {
    positivos.push({
      nombre: 'Excelente porcentaje de aciertos',
      valor: features.porcentajeGlobal,
      impacto: 'alto',
      contribucion: 25,
    })
  } else if (features.porcentajeGlobal >= 60) {
    positivos.push({
      nombre: 'Buen porcentaje de aciertos',
      valor: features.porcentajeGlobal,
      impacto: 'medio',
      contribucion: 15,
    })
  } else {
    negativos.push({
      nombre: 'Porcentaje de aciertos bajo',
      valor: features.porcentajeGlobal,
      impacto: features.porcentajeGlobal < 50 ? 'alto' : 'medio',
      contribucion: features.porcentajeGlobal < 50 ? -20 : -10,
    })
  }

  // Tendencia
  if (features.tendenciaMejora > 5) {
    positivos.push({
      nombre: 'Tendencia de mejora muy positiva',
      valor: features.tendenciaMejora,
      impacto: 'alto',
      contribucion: 15,
    })
  } else if (features.tendenciaMejora > 0) {
    positivos.push({
      nombre: 'Mejorando progresivamente',
      valor: features.tendenciaMejora,
      impacto: 'bajo',
      contribucion: 5,
    })
  } else if (features.tendenciaMejora < -5) {
    negativos.push({
      nombre: 'Rendimiento en descenso',
      valor: features.tendenciaMejora,
      impacto: 'alto',
      contribucion: -15,
    })
  }

  // Consistencia
  if (features.rachaActual >= 14) {
    positivos.push({
      nombre: 'Excelente constancia de estudio',
      valor: features.rachaActual,
      impacto: 'alto',
      contribucion: 15,
    })
  } else if (features.rachaActual >= 7) {
    positivos.push({
      nombre: 'Buena racha de estudio',
      valor: features.rachaActual,
      impacto: 'medio',
      contribucion: 10,
    })
  } else if (features.rachaActual < 3) {
    negativos.push({
      nombre: 'Falta constancia en el estudio',
      valor: features.rachaActual,
      impacto: features.rachaActual === 0 ? 'alto' : 'medio',
      contribucion: features.rachaActual === 0 ? -15 : -8,
    })
  }

  // Volumen
  if (features.preguntasRespondidas >= 2000) {
    positivos.push({
      nombre: 'Gran volumen de práctica',
      valor: features.preguntasRespondidas,
      impacto: 'alto',
      contribucion: 12,
    })
  } else if (features.preguntasRespondidas >= 500) {
    positivos.push({
      nombre: 'Buen volumen de práctica',
      valor: features.preguntasRespondidas,
      impacto: 'medio',
      contribucion: 7,
    })
  } else {
    negativos.push({
      nombre: 'Necesitas más práctica',
      valor: features.preguntasRespondidas,
      impacto: features.preguntasRespondidas < 100 ? 'alto' : 'medio',
      contribucion: -10,
    })
  }

  // Cobertura temario
  if (features.porcentajeTemasDominados >= 70) {
    positivos.push({
      nombre: 'Dominas la mayoría del temario',
      valor: features.porcentajeTemasDominados,
      impacto: 'alto',
      contribucion: 18,
    })
  } else if (features.porcentajeTemasDebiles > 40) {
    negativos.push({
      nombre: 'Muchos temas débiles por reforzar',
      valor: features.porcentajeTemasDebiles,
      impacto: 'alto',
      contribucion: -15,
    })
  }

  // Simulacros
  if (features.simulacrosCompletados >= 5 && features.mediaSimulacros >= 70) {
    positivos.push({
      nombre: 'Buenos resultados en simulacros',
      valor: features.mediaSimulacros,
      impacto: 'alto',
      contribucion: 12,
    })
  } else if (features.simulacrosCompletados === 0) {
    negativos.push({
      nombre: 'No has realizado simulacros',
      valor: 0,
      impacto: 'medio',
      contribucion: -8,
    })
  }

  // Ordenar por impacto
  positivos.sort((a, b) => b.contribucion - a.contribucion)
  negativos.sort((a, b) => a.contribucion - b.contribucion)

  return { positivos, negativos }
}

/**
 * Genera recomendaciones personalizadas basadas en los features
 */
export function generateRecommendations(features: MLFeatures): Recommendation[] {
  const recomendaciones: Recommendation[] = []

  // Recomendación urgente: rendimiento muy bajo
  if (features.porcentajeGlobal < 50) {
    recomendaciones.push({
      tipo: 'urgente',
      mensaje: 'Tu porcentaje de aciertos está por debajo del mínimo recomendado',
      accion: 'Enfócate en repasar los conceptos básicos antes de continuar con tests',
      impactoEstimado: 15,
    })
  }

  // Urgente: sin estudiar varios días
  if (features.diasSinEstudiar >= 5) {
    recomendaciones.push({
      tipo: 'urgente',
      mensaje: `Llevas ${features.diasSinEstudiar} días sin estudiar`,
      accion: 'Retoma el estudio hoy con una sesión corta de 15-20 minutos',
      impactoEstimado: 10,
    })
  }

  // Importante: pocos simulacros
  if (features.simulacrosCompletados < 3) {
    recomendaciones.push({
      tipo: 'importante',
      mensaje: 'Necesitas practicar más con simulacros reales',
      accion: 'Realiza al menos 1 simulacro completo por semana',
      impactoEstimado: 12,
    })
  }

  // Importante: temas débiles
  if (features.porcentajeTemasDebiles > 30) {
    recomendaciones.push({
      tipo: 'importante',
      mensaje: `Tienes un ${features.porcentajeTemasDebiles}% de temas débiles`,
      accion: 'Dedica sesiones específicas a reforzar tus puntos débiles',
      impactoEstimado: 15,
    })
  }

  // Importante: poca cobertura
  if (features.porcentajeTemasVistos < 70) {
    recomendaciones.push({
      tipo: 'importante',
      mensaje: `Solo has visto el ${features.porcentajeTemasVistos}% del temario`,
      accion: 'Avanza en temas nuevos mientras refuerzas los existentes',
      impactoEstimado: 10,
    })
  }

  // Sugerencia: mejorar consistencia
  if (features.rachaActual < 7 && features.diasActivoUltimos30 < 20) {
    recomendaciones.push({
      tipo: 'sugerencia',
      mensaje: 'La consistencia es clave para el éxito',
      accion: 'Establece una rutina diaria de estudio, aunque sea breve',
      impactoEstimado: 8,
    })
  }

  // Sugerencia: aumentar volumen
  if (features.preguntasPorDia < 30 && features.preguntasRespondidas < 1000) {
    recomendaciones.push({
      tipo: 'sugerencia',
      mensaje: 'Podrías aumentar tu volumen de práctica',
      accion: 'Intenta responder al menos 50 preguntas al día',
      impactoEstimado: 6,
    })
  }

  // Sugerencia: volatilidad alta
  if (features.volatilidad > 20) {
    recomendaciones.push({
      tipo: 'sugerencia',
      mensaje: 'Tu rendimiento es muy variable',
      accion: 'Busca condiciones de estudio más consistentes y descansa bien',
      impactoEstimado: 5,
    })
  }

  // Ordenar por tipo y impacto
  const orden = { urgente: 0, importante: 1, sugerencia: 2 }
  recomendaciones.sort((a, b) => {
    const tipoA = orden[a.tipo]
    const tipoB = orden[b.tipo]
    if (tipoA !== tipoB) return tipoA - tipoB
    return b.impactoEstimado - a.impactoEstimado
  })

  return recomendaciones.slice(0, 5) // Máximo 5 recomendaciones
}

/**
 * Estima días hasta alcanzar probabilidad objetivo
 */
export function estimateDaysToReady(
  currentProb: number,
  targetProb: number,
  tendencia: number,
  diasActivo: number
): { dias: number; fecha: string } {
  if (currentProb >= targetProb) {
    return { dias: 0, fecha: new Date().toISOString().split('T')[0] }
  }

  // Si no hay tendencia o es negativa, estimar basado en ritmo típico
  const mejoraDiaria = tendencia > 0
    ? tendencia / 7 // Convertir tendencia semanal a diaria
    : 0.5 // Mejora típica asumida

  const diferencia = targetProb - currentProb
  let diasEstimados = Math.ceil(diferencia / mejoraDiaria)

  // Ajustar por días de estudio efectivos (no todos los días se estudia)
  const ratioEstudio = diasActivo > 0
    ? Math.min(1, diasActivo / 30)
    : 0.5

  diasEstimados = Math.ceil(diasEstimados / ratioEstudio)

  // Limitar a un rango razonable
  diasEstimados = Math.min(365, Math.max(7, diasEstimados))

  const fechaEstimada = new Date()
  fechaEstimada.setDate(fechaEstimada.getDate() + diasEstimados)

  return {
    dias: diasEstimados,
    fecha: fechaEstimada.toISOString().split('T')[0],
  }
}

/**
 * Predicción completa para plan PRO
 */
export function predictPro(features: MLFeatures): RegressionPrediction {
  // Predicciones con ambos métodos
  const linear = predictWithLinearRegression(features)
  const logistic = predictWithLogisticRegression(features)

  // Combinar predicciones (promedio ponderado)
  const probCombinada = Math.round(
    linear.probabilidad * 0.4 + logistic.probabilidad * 0.6
  )

  // Intervalo de confianza
  const intervalo = calculateConfidenceInterval(
    probCombinada,
    features.preguntasRespondidas
  )

  // Confianza del modelo basada en datos disponibles
  const confianza = calculateModelConfidence(features)

  // Análisis de factores
  const { positivos, negativos } = analyzeFactors(features)

  // Recomendaciones
  const recomendaciones = generateRecommendations(features)

  // Estimación temporal
  const estimacion = estimateDaysToReady(
    probCombinada,
    85, // Objetivo: 85%
    features.tendenciaMejora,
    features.diasActivoUltimos30
  )

  // Velocidad de mejora (% por día)
  const velocidadMejora = features.tendenciaMejora > 0
    ? Math.round((features.tendenciaMejora / 7) * 100) / 100
    : 0

  return {
    probabilidadAprobado: probCombinada,
    confianzaModelo: confianza,
    intervaloConfianza: intervalo,
    coeficientes: linear.coeficientes,
    rSquared: linear.rSquared,
    logOdds: logistic.logOdds,
    clasificacion: logistic.clasificacion,
    diasHastaListo: estimacion.dias,
    fechaEstimadaListo: estimacion.fecha,
    velocidadMejora,
    factoresPositivos: positivos,
    factoresNegativos: negativos,
    recomendaciones,
  }
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function normalizeFeatures(features: MLFeatures): {
  porcentajeGlobal: number
  porcentajeUltimos7Dias: number
  porcentajeUltimos30Dias: number
} {
  return {
    porcentajeGlobal: features.porcentajeGlobal / 100,
    porcentajeUltimos7Dias: features.porcentajeUltimos7Dias / 100,
    porcentajeUltimos30Dias: features.porcentajeUltimos30Dias / 100,
  }
}

function calculateConsistencyScore(features: MLFeatures): number {
  // Score de consistencia basado en racha y días activos
  const rachaScore = Math.min(1, features.rachaActual / 30)
  const activoScore = Math.min(1, features.diasActivoUltimos30 / 25)
  const sinEstudiarPenalty = Math.max(0, 1 - features.diasSinEstudiar / 14)

  return (rachaScore * 0.4 + activoScore * 0.4 + sinEstudiarPenalty * 0.2)
}

function calculateModelConfidence(features: MLFeatures): number {
  // Confianza basada en cantidad de datos
  let confianza = 40 // Base

  // Más preguntas = más confianza
  confianza += Math.min(25, features.preguntasRespondidas / 80)

  // Más días activos = más confianza
  confianza += Math.min(15, features.diasActivoUltimos30 / 2)

  // Simulacros aumentan confianza
  confianza += Math.min(10, features.simulacrosCompletados * 2)

  // Baja volatilidad = más confianza
  if (features.volatilidad < 10) confianza += 10
  else if (features.volatilidad < 20) confianza += 5

  return Math.min(95, Math.round(confianza))
}
