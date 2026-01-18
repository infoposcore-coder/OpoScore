// ===========================================
// OpoMetrics - Tipos del Sistema ML
// ===========================================

import type { PlanType } from '@/lib/stripe/config'

// ============================================
// TIPOS BASE
// ============================================

export interface MLFeatures {
  // Métricas de rendimiento
  porcentajeGlobal: number
  porcentajeUltimos7Dias: number
  porcentajeUltimos30Dias: number
  tendenciaMejora: number
  volatilidad: number

  // Métricas de volumen
  testsCompletados: number
  preguntasRespondidas: number
  preguntasPorDia: number

  // Métricas de consistencia
  diasActivo: number
  diasActivoUltimos30: number
  rachaActual: number
  rachaMaxima: number
  diasSinEstudiar: number

  // Métricas de cobertura
  porcentajeTemasVistos: number
  porcentajeTemasDominados: number // >= 80%
  porcentajeTemasDebiles: number   // < 50%

  // Métricas de simulacros
  simulacrosCompletados: number
  mediaSimulacros: number
  mejorSimulacro: number

  // Métricas temporales
  minutosEstudioTotal: number
  minutosEstudioPromedioDiario: number
  horaPreferidaEstudio: number // 0-23

  // Métricas de dificultad
  porcentajeFaciles: number
  porcentajeMedias: number
  porcentajeDificiles: number
}

export interface DailyDataPoint {
  fecha: string
  preguntas: number
  correctas: number
  porcentaje: number
  minutos: number
}

// ============================================
// RESULTADOS POR TIER
// ============================================

// FREE: Estadísticas básicas
export interface BasicStatsResult {
  totalPreguntas: number
  totalCorrectas: number
  porcentajeGlobal: number
  testsCompletados: number
  rachaActual: number
  mejorRacha: number
  minutosEstudio: number
}

// BÁSICO: Ranking y tendencias
export interface RankingResult {
  // Ranking global
  posicionGlobal: number
  totalUsuarios: number
  percentilGlobal: number

  // Ranking por oposición
  posicionOposicion: number
  totalOposicion: number
  percentilOposicion: number

  // Tendencias
  tendenciaSemanal: 'subiendo' | 'estable' | 'bajando'
  cambioUltimaSemana: number

  // Percentiles detallados
  percentiles: {
    p25: number
    p50: number
    p75: number
    p90: number
    userValue: number
  }
}

export interface TrendResult {
  mediaMovil7Dias: number[]
  mediaMovil30Dias: number[]
  tendenciaLineal: number // pendiente
  proyeccion7Dias: number
  proyeccion30Dias: number
}

// PRO: Predicciones con regresión
export interface RegressionPrediction {
  probabilidadAprobado: number
  confianzaModelo: number
  intervaloConfianza: {
    inferior: number
    superior: number
  }

  // Regresión lineal
  coeficientes: {
    intercepto: number
    pesos: Record<string, number>
  }
  rSquared: number

  // Regresión logística
  logOdds: number
  clasificacion: 'aprobará' | 'en_riesgo' | 'necesita_mejorar'

  // Análisis temporal
  diasHastaListo: number
  fechaEstimadaListo: string
  velocidadMejora: number // % por día

  // Factores
  factoresPositivos: FactorAnalysis[]
  factoresNegativos: FactorAnalysis[]
  recomendaciones: Recommendation[]
}

export interface FactorAnalysis {
  nombre: string
  valor: number
  impacto: 'alto' | 'medio' | 'bajo'
  contribucion: number // % de contribución al resultado
}

export interface Recommendation {
  tipo: 'urgente' | 'importante' | 'sugerencia'
  mensaje: string
  accion?: string
  impactoEstimado: number // % de mejora esperada
}

// ELITE: Predicciones avanzadas
export interface AdvancedPrediction extends RegressionPrediction {
  // Random Forest
  randomForest: {
    probabilidad: number
    confianza: number
    importanciaFeatures: Record<string, number>
    arbolesAcuerdo: number // % de árboles que predicen aprobado
  }

  // Gradient Boosting (XGBoost simplificado)
  gradientBoosting: {
    probabilidad: number
    confianza: number
    gainFeatures: Record<string, number>
  }

  // Ensemble final
  ensemble: {
    probabilidadFinal: number
    confianzaFinal: number
    metodosAcuerdo: number
    varianza: number
  }

  // Análisis de escenarios
  escenarios: {
    optimista: ScenarioAnalysis
    realista: ScenarioAnalysis
    pesimista: ScenarioAnalysis
  }

  // Predicción de preguntas
  temasProblematicos: TemaProblematico[]
  preguntasProbables: PreguntaProbable[]
}

export interface ScenarioAnalysis {
  probabilidad: number
  diasHastaListo: number
  descripcion: string
  condiciones: string[]
}

export interface TemaProblematico {
  temaId: string
  temaNombre: string
  porcentajeActual: number
  impactoEnAprobado: number
  prioridad: 'critica' | 'alta' | 'media' | 'baja'
  horasEstimadasRecuperacion: number
}

export interface PreguntaProbable {
  temaId: string
  temaNombre: string
  tipoContenido: string
  probabilidadExamen: number
  preparacionUsuario: number
  recomendacion: string
}

// ============================================
// COMPARACIÓN VACANTES/COMPETIDORES
// ============================================

export interface VacancyComparison {
  // Datos de la convocatoria
  convocatoria: {
    nombre: string
    plazasOfertadas: number
    fechaExamen: string | null
    ratioPlazasOpositores: number
  }

  // Posición del usuario
  posicionEstimada: number
  dentroDelCorte: boolean
  margenHastaCorte: number // positivo = dentro, negativo = fuera

  // Comparación con competidores
  competidores: {
    total: number
    mejorQueUsuario: number
    peorQueUsuario: number
    mismoNivel: number // ±5%
  }

  // Distribución de scores
  distribucionScores: {
    percentil10: number
    percentil25: number
    percentil50: number
    percentil75: number
    percentil90: number
    scoreUsuario: number
    scoreCorteEstimado: number
  }

  // Proyección
  proyeccion: {
    probabilidadPlaza: number
    puestosQueFaltan: number
    mejoraNecesaria: number // % de mejora para estar en corte
    tiempoEstimado: number // días para alcanzar corte
  }
}

// ============================================
// CONFIGURACIÓN ML POR PLAN
// ============================================

export interface MLConfig {
  plan: PlanType
  featuresDisponibles: string[]
  algoritmos: string[]
  actualizacionMinutos: number
  historialDias: number
}

export const ML_CONFIG: Record<PlanType, MLConfig> = {
  free: {
    plan: 'free',
    featuresDisponibles: ['basic_stats'],
    algoritmos: ['none'],
    actualizacionMinutos: 1440, // 1 día
    historialDias: 7,
  },
  basico: {
    plan: 'basico',
    featuresDisponibles: ['basic_stats', 'ranking', 'trends', 'percentiles'],
    algoritmos: ['moving_average'],
    actualizacionMinutos: 60, // 1 hora
    historialDias: 30,
  },
  pro: {
    plan: 'pro',
    featuresDisponibles: [
      'basic_stats', 'ranking', 'trends', 'percentiles',
      'prediction', 'weakness_analysis', 'recommendations'
    ],
    algoritmos: ['moving_average', 'linear_regression', 'logistic_regression'],
    actualizacionMinutos: 30,
    historialDias: 90,
  },
  elite: {
    plan: 'elite',
    featuresDisponibles: [
      'basic_stats', 'ranking', 'trends', 'percentiles',
      'prediction', 'weakness_analysis', 'recommendations',
      'random_forest', 'xgboost', 'vacancy_comparison',
      'scenario_analysis', 'question_prediction'
    ],
    algoritmos: [
      'moving_average', 'linear_regression', 'logistic_regression',
      'random_forest', 'gradient_boosting', 'ensemble'
    ],
    actualizacionMinutos: 15,
    historialDias: 365,
  },
}
