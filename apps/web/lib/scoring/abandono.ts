// ===========================================
// OpoMetrics - Sistema Anti-Abandono v1
// ===========================================
// Detección de señales de abandono sin ML (reglas heurísticas)

export type TipoAlerta = 'inactividad' | 'caida_rendimiento' | 'patron_evasion' | 'racha_rota'
export type NivelRiesgo = 'bajo' | 'medio' | 'alto'
export type TipoAccion =
  | 'email_micro_reto'
  | 'mensaje_motivacional_ajuste_dificultad'
  | 'oferta_tutoria_checkin'
  | 'modo_recuperacion_3_dias'
  | 'recordatorio_suave'

export interface UserMetrics {
  dias_sin_login: number
  caida_aciertos_porcentaje: number
  logins_sin_actividad: number
  racha_anterior: number
  racha_actual: number
  tiempo_estudio_ultima_semana_minutos: number
  tiempo_estudio_semana_anterior_minutos: number
}

export interface AbandonoSignal {
  tipo: TipoAlerta
  nivel: NivelRiesgo
  accion: TipoAccion
  mensaje: string
  prioridad: number
}

export interface IntervencionRecomendada {
  tipo: 'email' | 'push' | 'in_app'
  asunto?: string
  contenido: string
  cta_texto: string
  cta_url: string
}

// Detectar todas las señales de abandono
export function detectarAbandono(metrics: UserMetrics): AbandonoSignal[] {
  const signals: AbandonoSignal[] = []

  // Señal 1: Inactividad prolongada
  if (metrics.dias_sin_login >= 3) {
    signals.push({
      tipo: 'inactividad',
      nivel: metrics.dias_sin_login >= 7 ? 'alto' : 'medio',
      accion: 'email_micro_reto',
      mensaje: metrics.dias_sin_login >= 7
        ? 'Llevas más de una semana sin entrar. ¡Te echamos de menos!'
        : 'Han pasado unos días desde tu última sesión.',
      prioridad: metrics.dias_sin_login >= 7 ? 1 : 2
    })
  }

  // Señal 2: Caída en rendimiento
  if (metrics.caida_aciertos_porcentaje > 20) {
    signals.push({
      tipo: 'caida_rendimiento',
      nivel: metrics.caida_aciertos_porcentaje > 35 ? 'alto' : 'medio',
      accion: 'mensaje_motivacional_ajuste_dificultad',
      mensaje: 'Hemos notado que el rendimiento ha bajado. ¿Ajustamos la dificultad?',
      prioridad: 2
    })
  }

  // Señal 3: Login sin actividad (>3 veces)
  if (metrics.logins_sin_actividad >= 3) {
    signals.push({
      tipo: 'patron_evasion',
      nivel: 'alto',
      accion: 'oferta_tutoria_checkin',
      mensaje: 'Vemos que entras pero no estudias. ¿Algo te bloquea?',
      prioridad: 1
    })
  }

  // Señal 4: Racha rota después de 7+ días
  if (metrics.racha_anterior >= 7 && metrics.racha_actual === 0) {
    signals.push({
      tipo: 'racha_rota',
      nivel: metrics.racha_anterior >= 14 ? 'alto' : 'medio',
      accion: 'modo_recuperacion_3_dias',
      mensaje: `¡Tu racha de ${metrics.racha_anterior} días se rompió! Activa el modo recuperación.`,
      prioridad: 2
    })
  }

  // Señal 5: Bajada drástica de tiempo de estudio
  if (
    metrics.tiempo_estudio_semana_anterior_minutos > 120 &&
    metrics.tiempo_estudio_ultima_semana_minutos < metrics.tiempo_estudio_semana_anterior_minutos * 0.3
  ) {
    signals.push({
      tipo: 'inactividad',
      nivel: 'bajo',
      accion: 'recordatorio_suave',
      mensaje: 'Tu tiempo de estudio ha bajado mucho esta semana.',
      prioridad: 3
    })
  }

  // Ordenar por prioridad
  return signals.sort((a, b) => a.prioridad - b.prioridad)
}

// Generar intervención recomendada basada en la señal
export function generarIntervencion(signal: AbandonoSignal): IntervencionRecomendada {
  switch (signal.accion) {
    case 'email_micro_reto':
      return {
        tipo: 'email',
        asunto: '🎯 Un micro-reto de 5 minutos te espera',
        contenido: `
          Sabemos que a veces cuesta retomar el ritmo.
          Por eso hemos preparado un reto rápido de solo 5 minutos.

          Sin presión, sin compromiso. Solo 5 preguntas para volver a coger el hábito.
        `,
        cta_texto: 'Hacer micro-reto',
        cta_url: '/estudiar?modo=micro'
      }

    case 'mensaje_motivacional_ajuste_dificultad':
      return {
        tipo: 'in_app',
        contenido: `
          Los baches son normales en cualquier oposición.
          Hemos detectado que algunas áreas necesitan refuerzo.

          ¿Quieres que ajustemos la dificultad temporalmente?
        `,
        cta_texto: 'Ajustar dificultad',
        cta_url: '/perfil/configuracion'
      }

    case 'oferta_tutoria_checkin':
      return {
        tipo: 'in_app',
        contenido: `
          Parece que algo te está frenando.
          ¿Te ayudamos a identificar qué es?

          Nuestro tutor IA puede hacer un diagnóstico rápido contigo.
        `,
        cta_texto: 'Hablar con tutor IA',
        cta_url: '/tutor?modo=checkin'
      }

    case 'modo_recuperacion_3_dias':
      return {
        tipo: 'push',
        contenido: `
          ¡Modo Recuperación activado!

          Durante 3 días tendrás sesiones más cortas (10 min)
          con contenido de repaso ligero para volver al ritmo.
        `,
        cta_texto: 'Empezar recuperación',
        cta_url: '/estudiar?modo=recuperacion'
      }

    case 'recordatorio_suave':
    default:
      return {
        tipo: 'push',
        contenido: 'Tu oposición te espera. ¿15 minutos hoy?',
        cta_texto: 'Estudiar ahora',
        cta_url: '/estudiar'
      }
  }
}

// Calcular nivel de riesgo global de abandono (0-100)
export function calcularRiesgoAbandono(metrics: UserMetrics): number {
  let riesgo = 0

  // Inactividad (peso: 40%)
  if (metrics.dias_sin_login >= 14) riesgo += 40
  else if (metrics.dias_sin_login >= 7) riesgo += 30
  else if (metrics.dias_sin_login >= 3) riesgo += 15

  // Patrón de evasión (peso: 30%)
  if (metrics.logins_sin_actividad >= 5) riesgo += 30
  else if (metrics.logins_sin_actividad >= 3) riesgo += 20
  else if (metrics.logins_sin_actividad >= 2) riesgo += 10

  // Caída de rendimiento (peso: 20%)
  if (metrics.caida_aciertos_porcentaje > 40) riesgo += 20
  else if (metrics.caida_aciertos_porcentaje > 20) riesgo += 10

  // Racha rota (peso: 10%)
  if (metrics.racha_anterior >= 7 && metrics.racha_actual === 0) riesgo += 10

  return Math.min(riesgo, 100)
}
