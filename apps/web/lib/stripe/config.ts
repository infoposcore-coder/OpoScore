// ===========================================
// OpoScore - Stripe Configuration
// ===========================================

export type PlanType = 'free' | 'basico' | 'pro' | 'elite'

export interface Plan {
  name: string
  description: string
  price: number
  priceYearly: number
  features: string[]
  popular?: boolean
}

export const PLANS: Record<PlanType, Plan> = {
  free: {
    name: 'Free',
    description: 'Para empezar a explorar',
    price: 0,
    priceYearly: 0,
    features: [
      '25 preguntas al mes',
      '1 test diario',
      'OpoScore básico',
      'Acceso a 1 oposición',
    ],
  },
  basico: {
    name: 'Básico',
    description: 'Para empezar a prepararte en serio',
    price: 9.99,
    priceYearly: 6.99, // por mes, facturado anualmente
    features: [
      '200 preguntas al mes',
      '5 tests diarios',
      'Flashcards básicas',
      'OpoScore completo',
      'Acceso a 3 oposiciones',
      'Estadísticas básicas',
    ],
  },
  pro: {
    name: 'Pro',
    description: 'Todo lo que necesitas para aprobar',
    price: 19.99,
    priceYearly: 14.99, // por mes, facturado anualmente
    popular: true,
    features: [
      'Preguntas ilimitadas',
      'Tests ilimitados',
      'Simulacros cronometrados',
      'Tutor IA 24/7',
      'Flashcards con IA',
      'Acceso a TODAS las oposiciones',
      'Estadísticas avanzadas',
      'Sin anuncios',
    ],
  },
  elite: {
    name: 'Elite',
    description: 'El máximo nivel de preparación',
    price: 39.99,
    priceYearly: 29.99, // por mes, facturado anualmente
    features: [
      'Todo de Pro',
      'Soporte prioritario 24/7',
      'Sesiones 1:1 mensuales',
      'Plan de estudio personalizado',
      'Análisis predictivo avanzado',
      'Acceso anticipado a nuevas features',
      'Comunidad privada de élite',
      'Garantía de aprobado',
    ],
  },
}

// Features y qué plan las desbloquea
export const PLAN_FEATURES: Record<PlanType, string[]> = {
  free: [
    'tests_basicos',
    'oposcore_basico',
    'una_oposicion',
    // ML: Estadísticas básicas
    'ml_basic_stats',
  ],
  basico: [
    'tests_basicos',
    'oposcore_basico',
    'flashcards_basicas',
    'tres_oposiciones',
    'estadisticas_basicas',
    // ML: Ranking y tendencias
    'ml_basic_stats',
    'ml_ranking',
    'ml_trends',
    'ml_percentiles',
    'ml_moving_average',
  ],
  pro: [
    'tests_basicos',
    'oposcore_basico',
    'flashcards_basicas',
    'todas_oposiciones',
    'estadisticas_basicas',
    'simulacros',
    'tests_ilimitados',
    'estadisticas_avanzadas',
    'tutor_ia',
    'flashcards_ia',
    'sin_anuncios',
    // ML: Predicciones con regresión
    'ml_basic_stats',
    'ml_ranking',
    'ml_trends',
    'ml_percentiles',
    'ml_moving_average',
    'ml_linear_regression',
    'ml_logistic_regression',
    'ml_prediction',
    'ml_confidence_interval',
    'ml_factor_analysis',
    'ml_recommendations',
  ],
  elite: [
    'tests_basicos',
    'oposcore_basico',
    'flashcards_basicas',
    'todas_oposiciones',
    'estadisticas_basicas',
    'simulacros',
    'tests_ilimitados',
    'estadisticas_avanzadas',
    'tutor_ia',
    'flashcards_ia',
    'sin_anuncios',
    'soporte_prioritario',
    'sesiones_1a1',
    'plan_personalizado',
    'prediccion_avanzada',
    'acceso_anticipado',
    'comunidad_elite',
    'garantia_aprobado',
    // ML: IA Avanzada completa
    'ml_basic_stats',
    'ml_ranking',
    'ml_trends',
    'ml_percentiles',
    'ml_moving_average',
    'ml_linear_regression',
    'ml_logistic_regression',
    'ml_prediction',
    'ml_confidence_interval',
    'ml_factor_analysis',
    'ml_recommendations',
    'ml_random_forest',
    'ml_xgboost',
    'ml_ensemble',
    'ml_scenario_analysis',
    'ml_vacancy_comparison',
    'ml_competitor_analysis',
    'ml_question_prediction',
  ],
}

// ML Feature descriptions
export const ML_FEATURE_NAMES: Record<string, string> = {
  ml_basic_stats: 'Estadísticas básicas',
  ml_ranking: 'Ranking entre opositores',
  ml_trends: 'Análisis de tendencias',
  ml_percentiles: 'Percentiles',
  ml_moving_average: 'Media móvil 7/30 días',
  ml_linear_regression: 'Regresión Lineal',
  ml_logistic_regression: 'Regresión Logística',
  ml_prediction: 'Predicción de aprobado',
  ml_confidence_interval: 'Intervalo de confianza',
  ml_factor_analysis: 'Análisis de factores',
  ml_recommendations: 'Recomendaciones personalizadas',
  ml_random_forest: 'Random Forest',
  ml_xgboost: 'Gradient Boosting (XGBoost)',
  ml_ensemble: 'Ensemble de modelos',
  ml_scenario_analysis: 'Análisis de escenarios',
  ml_vacancy_comparison: 'Comparativa de vacantes',
  ml_competitor_analysis: 'Análisis de competidores',
  ml_question_prediction: 'Predicción de preguntas',
}

// Días de prueba gratuita
export const TRIAL_DAYS = 7

// Feature names para UI
export const FEATURE_NAMES: Record<string, string> = {
  simulacros: 'Simulacros cronometrados',
  tutor_ia: 'Tutor IA 24/7',
  tests_ilimitados: 'Tests ilimitados',
  estadisticas_avanzadas: 'Estadísticas avanzadas',
  estadisticas_basicas: 'Estadísticas básicas',
  flashcards_ia: 'Flashcards con IA',
  flashcards_basicas: 'Flashcards básicas',
  soporte_prioritario: 'Soporte prioritario',
  sesiones_1a1: 'Sesiones 1:1',
  todas_oposiciones: 'Todas las oposiciones',
  tres_oposiciones: '3 oposiciones',
  una_oposicion: '1 oposición',
  garantia_aprobado: 'Garantía de aprobado',
}

// Verifica si un plan tiene acceso a una feature
export function planHasFeature(plan: PlanType, feature: string): boolean {
  return PLAN_FEATURES[plan]?.includes(feature) ?? false
}

// Obtiene el plan mínimo requerido para una feature
export function getRequiredPlan(feature: string): PlanType {
  if (PLAN_FEATURES.free.includes(feature)) return 'free'
  if (PLAN_FEATURES.basico.includes(feature)) return 'basico'
  if (PLAN_FEATURES.pro.includes(feature)) return 'pro'
  if (PLAN_FEATURES.elite.includes(feature)) return 'elite'
  return 'free'
}
