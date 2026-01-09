// ===========================================
// OpoScore - Stripe Configuration
// ===========================================

export type PlanType = 'free' | 'premium' | 'elite'

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
    name: 'Gratuito',
    description: 'Para empezar a prepararte',
    price: 0,
    priceYearly: 0,
    features: [
      '50 preguntas al mes',
      '1 test diario',
      'Flashcards básicas',
      'OpoScore básico',
    ],
  },
  premium: {
    name: 'Premium',
    description: 'Todo lo que necesitas para aprobar',
    price: 14.99,
    priceYearly: 9.99, // por mes, facturado anualmente
    popular: true,
    features: [
      'Preguntas ilimitadas',
      'Tests ilimitados',
      'Simulacros cronometrados',
      'Tutor IA 24/7',
      'Estadísticas avanzadas',
      'Flashcards con IA',
      'Sin anuncios',
    ],
  },
  elite: {
    name: 'Elite',
    description: 'El máximo nivel de preparación',
    price: 29.99,
    priceYearly: 19.99, // por mes, facturado anualmente
    features: [
      'Todo de Premium',
      'Soporte prioritario 24/7',
      'Sesiones 1:1 mensuales',
      'Plan de estudio personalizado',
      'Acceso anticipado a nuevas features',
      'Comunidad privada de élite',
    ],
  },
}

// Features y qué plan las desbloquea
export const PLAN_FEATURES: Record<PlanType, string[]> = {
  free: ['tests_basicos', 'flashcards_basicas', 'oposcore_basico'],
  premium: [
    'tests_basicos',
    'flashcards_basicas',
    'oposcore_basico',
    'simulacros',
    'tests_ilimitados',
    'estadisticas_avanzadas',
    'tutor_ia',
    'flashcards_ia',
    'sin_anuncios',
  ],
  elite: [
    'tests_basicos',
    'flashcards_basicas',
    'oposcore_basico',
    'simulacros',
    'tests_ilimitados',
    'estadisticas_avanzadas',
    'tutor_ia',
    'flashcards_ia',
    'sin_anuncios',
    'soporte_prioritario',
    'sesiones_1a1',
    'plan_personalizado',
    'acceso_anticipado',
    'comunidad_elite',
  ],
}

// Días de prueba gratuita
export const TRIAL_DAYS = 7

// Feature names para UI
export const FEATURE_NAMES: Record<string, string> = {
  simulacros: 'Simulacros cronometrados',
  tutor_ia: 'Tutor IA 24/7',
  tests_ilimitados: 'Tests ilimitados',
  estadisticas_avanzadas: 'Estadísticas avanzadas',
  flashcards_ia: 'Flashcards con IA',
  soporte_prioritario: 'Soporte prioritario',
  sesiones_1a1: 'Sesiones 1:1',
}

// Verifica si un plan tiene acceso a una feature
export function planHasFeature(plan: PlanType, feature: string): boolean {
  return PLAN_FEATURES[plan]?.includes(feature) ?? false
}

// Obtiene el plan mínimo requerido para una feature
export function getRequiredPlan(feature: string): PlanType {
  if (PLAN_FEATURES.free.includes(feature)) return 'free'
  if (PLAN_FEATURES.premium.includes(feature)) return 'premium'
  if (PLAN_FEATURES.elite.includes(feature)) return 'elite'
  return 'free'
}
