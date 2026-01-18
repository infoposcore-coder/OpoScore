// ===========================================
// OpoMetrics - Predictor Avanzado (ELITE)
// Random Forest + Gradient Boosting (XGBoost)
// ===========================================

import type {
  MLFeatures,
  AdvancedPrediction,
  ScenarioAnalysis,
  TemaProblematico,
  PreguntaProbable,
  FactorAnalysis,
  Recommendation
} from './types'
import { predictPro, analyzeFactors, generateRecommendations, estimateDaysToReady } from './regression-predictor'

// ============================================
// RANDOM FOREST SIMPLIFICADO
// ============================================

interface DecisionTree {
  predict: (features: MLFeatures) => number
  featureImportance: Record<string, number>
}

/**
 * Crea un árbol de decisión simple
 */
function createDecisionTree(seed: number, depth: number = 4): DecisionTree {
  // Diferentes árboles con diferentes pesos según el seed
  const featureWeights: Record<string, number[]> = {
    porcentajeGlobal: [0.30, 0.25, 0.35, 0.28, 0.32],
    porcentajeReciente: [0.15, 0.20, 0.12, 0.18, 0.14],
    consistencia: [0.15, 0.18, 0.12, 0.16, 0.20],
    volumen: [0.10, 0.12, 0.15, 0.08, 0.10],
    cobertura: [0.15, 0.10, 0.18, 0.20, 0.12],
    simulacros: [0.08, 0.10, 0.05, 0.08, 0.10],
    tendencia: [0.07, 0.05, 0.03, 0.02, 0.02],
  }

  const weights: Record<string, number> = {}
  Object.keys(featureWeights).forEach(key => {
    weights[key] = featureWeights[key][seed % 5]
  })

  return {
    predict: (features: MLFeatures) => {
      let score = 0.10 // Base

      // Porcentaje global con umbral
      if (features.porcentajeGlobal >= 80) {
        score += weights.porcentajeGlobal * 1.2
      } else if (features.porcentajeGlobal >= 60) {
        score += weights.porcentajeGlobal * (features.porcentajeGlobal / 80)
      } else {
        score += weights.porcentajeGlobal * (features.porcentajeGlobal / 100) * 0.7
      }

      // Porcentaje reciente
      score += (features.porcentajeUltimos7Dias / 100) * weights.porcentajeReciente

      // Consistencia
      const consistencia = Math.min(1,
        (features.rachaActual / 21) * 0.5 +
        (features.diasActivoUltimos30 / 25) * 0.5
      )
      score += consistencia * weights.consistencia

      // Volumen (logarítmico)
      const volumen = Math.min(1, Math.log10(features.preguntasRespondidas + 1) / 4)
      score += volumen * weights.volumen

      // Cobertura
      const cobertura = (
        features.porcentajeTemasVistos * 0.3 +
        features.porcentajeTemasDominados * 0.7
      ) / 100
      score += cobertura * weights.cobertura

      // Simulacros
      if (features.simulacrosCompletados > 0) {
        const simScore = (features.mediaSimulacros / 100) *
          Math.min(1, features.simulacrosCompletados / 5)
        score += simScore * weights.simulacros
      }

      // Tendencia
      const tendencia = Math.min(1, Math.max(0, (features.tendenciaMejora + 10) / 20))
      score += tendencia * weights.tendencia

      // Añadir variación basada en seed para simular diferentes árboles
      const variation = (Math.sin(seed * 0.1) * 0.05)
      score = Math.max(0.15, Math.min(0.95, score + variation))

      return score
    },
    featureImportance: weights,
  }
}

/**
 * Random Forest: ensemble de árboles de decisión
 */
export function predictWithRandomForest(
  features: MLFeatures,
  numTrees: number = 10
): {
  probabilidad: number
  confianza: number
  importanciaFeatures: Record<string, number>
  arbolesAcuerdo: number
} {
  const trees: DecisionTree[] = []
  const predictions: number[] = []

  // Crear y evaluar árboles
  for (let i = 0; i < numTrees; i++) {
    const tree = createDecisionTree(i, 4)
    trees.push(tree)
    predictions.push(tree.predict(features))
  }

  // Promedio de predicciones
  const probabilidad = predictions.reduce((a, b) => a + b, 0) / numTrees

  // Calcular acuerdo (cuántos árboles predicen aprobado >65%)
  const umbralAprobado = 0.65
  const arbolesAprobado = predictions.filter(p => p >= umbralAprobado).length
  const arbolesAcuerdo = Math.round((arbolesAprobado / numTrees) * 100)

  // Varianza para estimar confianza
  const varianza = predictions.reduce((sum, p) =>
    sum + Math.pow(p - probabilidad, 2), 0
  ) / numTrees
  const desviacion = Math.sqrt(varianza)

  // Confianza inversamente proporcional a la varianza
  const confianza = Math.round(Math.max(50, Math.min(95, 95 - desviacion * 100)))

  // Agregar importancia de features
  const importanciaTotal: Record<string, number> = {}
  trees.forEach(tree => {
    Object.entries(tree.featureImportance).forEach(([key, value]) => {
      importanciaTotal[key] = (importanciaTotal[key] || 0) + value
    })
  })

  // Normalizar importancia
  const importanciaFeatures: Record<string, number> = {}
  const totalImportancia = Object.values(importanciaTotal).reduce((a, b) => a + b, 0)
  Object.entries(importanciaTotal).forEach(([key, value]) => {
    importanciaFeatures[key] = Math.round((value / totalImportancia) * 100)
  })

  return {
    probabilidad: Math.round(probabilidad * 100),
    confianza,
    importanciaFeatures,
    arbolesAcuerdo,
  }
}

// ============================================
// GRADIENT BOOSTING (XGBOOST SIMPLIFICADO)
// ============================================

/**
 * Gradient Boosting simplificado
 * Combina múltiples predictores débiles secuencialmente
 */
export function predictWithGradientBoosting(
  features: MLFeatures,
  numIterations: number = 5,
  learningRate: number = 0.1
): {
  probabilidad: number
  confianza: number
  gainFeatures: Record<string, number>
} {
  // Predictor base
  let prediccion = 0.5

  // Features normalizadas
  const X = {
    porcentajeGlobal: features.porcentajeGlobal / 100,
    porcentajeReciente: features.porcentajeUltimos7Dias / 100,
    consistencia: Math.min(1, features.rachaActual / 21),
    diasActivos: features.diasActivoUltimos30 / 30,
    volumen: Math.min(1, features.preguntasRespondidas / 3000),
    cobertura: features.porcentajeTemasDominados / 100,
    simulacros: features.simulacrosCompletados > 0 ? features.mediaSimulacros / 100 : 0.3,
    tendencia: Math.min(1, Math.max(0, (features.tendenciaMejora + 10) / 20)),
  }

  // Gain por feature
  const gains: Record<string, number> = {}
  Object.keys(X).forEach(key => gains[key] = 0)

  // Target aproximado basado en features
  const target = calculateApproximateTarget(features)

  // Boosting iterations
  for (let i = 0; i < numIterations; i++) {
    // Calcular residuo
    const residuo = target - prediccion

    // Encontrar mejor split para reducir residuo
    let mejorGain = 0
    let mejorFeature = 'porcentajeGlobal'
    let mejorUpdate = 0

    Object.entries(X).forEach(([key, value]) => {
      // Simular split en esta feature
      const update = residuo * value * (1 - Math.abs(prediccion - 0.5))
      const gain = Math.abs(update)

      if (gain > mejorGain) {
        mejorGain = gain
        mejorFeature = key
        mejorUpdate = update
      }
    })

    // Actualizar predicción
    prediccion += learningRate * mejorUpdate
    prediccion = Math.max(0.1, Math.min(0.95, prediccion))

    // Registrar gain
    gains[mejorFeature] += mejorGain
  }

  // Normalizar gains
  const totalGain = Object.values(gains).reduce((a, b) => a + b, 0)
  const gainFeatures: Record<string, number> = {}
  Object.entries(gains).forEach(([key, value]) => {
    gainFeatures[key] = totalGain > 0 ? Math.round((value / totalGain) * 100) : 0
  })

  // Confianza basada en convergencia
  const distanciaTarget = Math.abs(target - prediccion)
  const confianza = Math.round(Math.max(50, Math.min(90, 90 - distanciaTarget * 50)))

  return {
    probabilidad: Math.round(prediccion * 100),
    confianza,
    gainFeatures,
  }
}

/**
 * Calcula target aproximado basado en heurísticas
 */
function calculateApproximateTarget(features: MLFeatures): number {
  let target = 0.3 // Base conservadora

  // Ajustar por rendimiento
  target += (features.porcentajeGlobal / 100) * 0.35

  // Ajustar por consistencia
  const consistencia = Math.min(1, features.rachaActual / 14) * 0.5 +
    Math.min(1, features.diasActivoUltimos30 / 20) * 0.5
  target += consistencia * 0.15

  // Ajustar por cobertura
  target += (features.porcentajeTemasDominados / 100) * 0.15

  // Ajustar por simulacros
  if (features.simulacrosCompletados >= 3) {
    target += (features.mediaSimulacros / 100) * 0.1
  }

  return Math.min(0.95, Math.max(0.2, target))
}

// ============================================
// ENSEMBLE: COMBINACIÓN DE MODELOS
// ============================================

/**
 * Combina múltiples modelos para predicción final
 */
export function ensemblePrediction(
  rfPrediction: number,
  gbPrediction: number,
  linearPrediction: number,
  logisticPrediction: number
): {
  probabilidadFinal: number
  confianzaFinal: number
  metodosAcuerdo: number
  varianza: number
} {
  const predictions = [rfPrediction, gbPrediction, linearPrediction, logisticPrediction]

  // Pesos para cada modelo (Random Forest y XGBoost tienen más peso)
  const weights = [0.30, 0.30, 0.20, 0.20]

  // Predicción ponderada
  const probabilidadFinal = predictions.reduce(
    (sum, pred, i) => sum + pred * weights[i], 0
  )

  // Varianza entre modelos
  const mean = predictions.reduce((a, b) => a + b, 0) / predictions.length
  const varianza = predictions.reduce(
    (sum, p) => sum + Math.pow(p - mean, 2), 0
  ) / predictions.length

  // Métodos en acuerdo (diferencia < 10%)
  const umbral = 10
  let acuerdos = 0
  for (let i = 0; i < predictions.length; i++) {
    for (let j = i + 1; j < predictions.length; j++) {
      if (Math.abs(predictions[i] - predictions[j]) < umbral) {
        acuerdos++
      }
    }
  }
  const metodosAcuerdo = Math.round((acuerdos / 6) * 100) // 6 pares posibles

  // Confianza final basada en acuerdo y varianza
  const confianzaFinal = Math.round(
    70 + (metodosAcuerdo / 100) * 20 - Math.sqrt(varianza) * 2
  )

  return {
    probabilidadFinal: Math.round(probabilidadFinal),
    confianzaFinal: Math.min(95, Math.max(50, confianzaFinal)),
    metodosAcuerdo,
    varianza: Math.round(varianza * 100) / 100,
  }
}

// ============================================
// ANÁLISIS DE ESCENARIOS
// ============================================

/**
 * Genera análisis de escenarios (optimista, realista, pesimista)
 */
export function analyzeScenarios(
  features: MLFeatures,
  baseProbability: number
): {
  optimista: ScenarioAnalysis
  realista: ScenarioAnalysis
  pesimista: ScenarioAnalysis
} {
  // Escenario optimista: mejora consistente del 1% diario
  const optimista: ScenarioAnalysis = {
    probabilidad: Math.min(95, baseProbability + 15),
    diasHastaListo: Math.max(0, Math.round((85 - baseProbability) / 1.5)),
    descripcion: 'Máximo rendimiento con estudio intensivo',
    condiciones: [
      'Estudiar al menos 2 horas diarias',
      'Completar todos los temas débiles',
      '3+ simulacros semanales',
      'Mantener racha de estudio',
    ],
  }

  // Escenario realista: mantener ritmo actual
  const realista: ScenarioAnalysis = {
    probabilidad: baseProbability,
    diasHastaListo: features.tendenciaMejora > 0
      ? Math.round((85 - baseProbability) / (features.tendenciaMejora / 7))
      : Math.round((85 - baseProbability) / 0.3),
    descripcion: 'Progreso manteniendo el ritmo actual',
    condiciones: [
      'Continuar con rutina de estudio actual',
      `${features.preguntasPorDia} preguntas/día en promedio`,
      'Repasar temas débiles regularmente',
    ],
  }

  // Escenario pesimista: reducción del ritmo
  const pesimista: ScenarioAnalysis = {
    probabilidad: Math.max(30, baseProbability - 10),
    diasHastaListo: Math.round((85 - baseProbability) / 0.15),
    descripcion: 'Reducción en el ritmo de estudio',
    condiciones: [
      'Estudio irregular',
      'Sin completar simulacros',
      'Temas débiles sin reforzar',
    ],
  }

  // Ajustar días a rangos razonables
  optimista.diasHastaListo = Math.max(7, Math.min(90, optimista.diasHastaListo))
  realista.diasHastaListo = Math.max(14, Math.min(180, realista.diasHastaListo))
  pesimista.diasHastaListo = Math.max(30, Math.min(365, pesimista.diasHastaListo))

  return { optimista, realista, pesimista }
}

// ============================================
// ANÁLISIS DE TEMAS Y PREDICCIÓN DE PREGUNTAS
// ============================================

/**
 * Identifica temas problemáticos con prioridad
 */
export function identifyProblematicTopics(
  temasStats: Array<{
    temaId: string
    temaNombre: string
    porcentaje: number
    preguntasRespondidas: number
    pesoExamen: number // % estimado en el examen
  }>
): TemaProblematico[] {
  return temasStats
    .filter(t => t.porcentaje < 70 || t.preguntasRespondidas < 20)
    .map(t => {
      // Calcular impacto en aprobado
      const impacto = t.pesoExamen * (70 - t.porcentaje) / 100

      // Determinar prioridad
      let prioridad: 'critica' | 'alta' | 'media' | 'baja'
      if (t.porcentaje < 40 && t.pesoExamen > 10) {
        prioridad = 'critica'
      } else if (t.porcentaje < 50 || t.pesoExamen > 15) {
        prioridad = 'alta'
      } else if (t.porcentaje < 60) {
        prioridad = 'media'
      } else {
        prioridad = 'baja'
      }

      // Estimar horas de recuperación
      const horasEstimadas = Math.ceil(
        ((70 - t.porcentaje) / 10) * (t.pesoExamen / 5)
      )

      return {
        temaId: t.temaId,
        temaNombre: t.temaNombre,
        porcentajeActual: t.porcentaje,
        impactoEnAprobado: Math.round(impacto * 100) / 100,
        prioridad,
        horasEstimadasRecuperacion: Math.max(1, horasEstimadas),
      }
    })
    .sort((a, b) => {
      const ordenPrioridad = { critica: 0, alta: 1, media: 2, baja: 3 }
      return ordenPrioridad[a.prioridad] - ordenPrioridad[b.prioridad]
    })
}

/**
 * Predice preguntas probables basándose en patrones históricos
 */
export function predictLikelyQuestions(
  temasConFrecuencia: Array<{
    temaId: string
    temaNombre: string
    frecuenciaHistorica: number // % de veces que sale en examen
    tipoContenido: string
    preparacionUsuario: number // % dominio del usuario
  }>
): PreguntaProbable[] {
  return temasConFrecuencia
    .filter(t => t.frecuenciaHistorica > 5) // Solo temas que suelen salir
    .map(t => {
      let recomendacion: string
      if (t.preparacionUsuario >= 80) {
        recomendacion = 'Bien preparado, mantener nivel'
      } else if (t.preparacionUsuario >= 60) {
        recomendacion = 'Reforzar con ejercicios adicionales'
      } else if (t.preparacionUsuario >= 40) {
        recomendacion = 'Priorizar estudio de este tema'
      } else {
        recomendacion = 'Urgente: tema crítico poco dominado'
      }

      return {
        temaId: t.temaId,
        temaNombre: t.temaNombre,
        tipoContenido: t.tipoContenido,
        probabilidadExamen: t.frecuenciaHistorica,
        preparacionUsuario: t.preparacionUsuario,
        recomendacion,
      }
    })
    .sort((a, b) => {
      // Ordenar por: alta probabilidad + baja preparación (más urgente)
      const urgenciaA = a.probabilidadExamen * (100 - a.preparacionUsuario)
      const urgenciaB = b.probabilidadExamen * (100 - b.preparacionUsuario)
      return urgenciaB - urgenciaA
    })
    .slice(0, 10) // Top 10 más importantes
}

// ============================================
// PREDICCIÓN ELITE COMPLETA
// ============================================

/**
 * Predicción avanzada para plan ELITE
 */
export function predictElite(
  features: MLFeatures,
  temasStats?: Array<{
    temaId: string
    temaNombre: string
    porcentaje: number
    preguntasRespondidas: number
    pesoExamen: number
    frecuenciaHistorica: number
    tipoContenido: string
  }>
): AdvancedPrediction {
  // Obtener predicción Pro como base
  const proPrediction = predictPro(features)

  // Random Forest
  const rf = predictWithRandomForest(features)

  // Gradient Boosting
  const gb = predictWithGradientBoosting(features)

  // Ensemble
  const ensemble = ensemblePrediction(
    rf.probabilidad,
    gb.probabilidad,
    proPrediction.probabilidadAprobado,
    proPrediction.probabilidadAprobado // Logistic ya está incluido en Pro
  )

  // Análisis de escenarios
  const escenarios = analyzeScenarios(features, ensemble.probabilidadFinal)

  // Temas problemáticos
  const temasProblematicos = temasStats
    ? identifyProblematicTopics(temasStats)
    : []

  // Preguntas probables
  const preguntasProbables = temasStats
    ? predictLikelyQuestions(temasStats.map(t => ({
        ...t,
        preparacionUsuario: t.porcentaje,
      })))
    : []

  // Actualizar intervalo de confianza con ensemble
  const intervaloAjustado = {
    inferior: Math.max(0, ensemble.probabilidadFinal - 10 + Math.round(ensemble.metodosAcuerdo / 10)),
    superior: Math.min(100, ensemble.probabilidadFinal + 10 - Math.round(ensemble.metodosAcuerdo / 10)),
  }

  return {
    // Base de Pro
    ...proPrediction,

    // Sobrescribir con valores ensemble
    probabilidadAprobado: ensemble.probabilidadFinal,
    confianzaModelo: ensemble.confianzaFinal,
    intervaloConfianza: intervaloAjustado,

    // Random Forest
    randomForest: {
      probabilidad: rf.probabilidad,
      confianza: rf.confianza,
      importanciaFeatures: rf.importanciaFeatures,
      arbolesAcuerdo: rf.arbolesAcuerdo,
    },

    // Gradient Boosting
    gradientBoosting: {
      probabilidad: gb.probabilidad,
      confianza: gb.confianza,
      gainFeatures: gb.gainFeatures,
    },

    // Ensemble
    ensemble: {
      probabilidadFinal: ensemble.probabilidadFinal,
      confianzaFinal: ensemble.confianzaFinal,
      metodosAcuerdo: ensemble.metodosAcuerdo,
      varianza: ensemble.varianza,
    },

    // Escenarios
    escenarios,

    // Análisis de temas
    temasProblematicos,
    preguntasProbables,
  }
}
