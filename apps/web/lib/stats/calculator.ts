// ===========================================
// OpoMetrics - Calculador de Estadísticas y ML
// ===========================================

import { SupabaseClient } from '@supabase/supabase-js'

// Tipo genérico para cualquier cliente Supabase
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = SupabaseClient<any, any, any>

// Tipos
export interface BasicStats {
  totalPreguntas: number
  totalCorrectas: number
  porcentajeGlobal: number
  testsCompletados: number
  rachaActual: number
  mejorRacha: number
  minutosEstudio: number
}

export interface DailyStats {
  fecha: string
  preguntas: number
  correctas: number
  porcentaje: number
  minutos: number
}

export interface RankingData {
  posicionGlobal: number
  totalUsuarios: number
  percentil: number
  posicionOposicion: number
  totalOposicion: number
  percentilOposicion: number
}

export interface BloqueStats {
  bloqueId: string
  bloqueNombre: string
  totalPreguntas: number
  correctas: number
  porcentaje: number
  mediaPlataforma: number
  diferencia: number
  estado: 'dominado' | 'avanzado' | 'progreso' | 'debil' | 'critico'
}

export interface PredictionData {
  probabilidadAprobado: number
  confianzaModelo: number
  diasHastaListo: number
  fechaEstimadaListo: string
  factoresPositivos: string[]
  factoresNegativos: string[]
  recomendaciones: string[]
}

export interface MLFeatures {
  porcentajeGlobal: number
  porcentajeUltimos7Dias: number
  tendenciaMejora: number
  testsCompletados: number
  preguntasRespondidas: number
  diasActivo: number
  minutosEstudioDiarioPromedio: number
  rachaActual: number
  rachaMaxima: number
  diasSinEstudiarUltimoMes: number
  porcentajeTemasVistos: number
  porcentajeTemasDominados: number
  simulacrosCompletados: number
  mediaSimulacros: number
}

// Calculador de estadísticas básicas
export async function calculateBasicStats(
  supabase: AnySupabaseClient,
  userId: string
): Promise<BasicStats> {
  try {
    // Intentar obtener profile con stats avanzados
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('total_preguntas_respondidas, total_respuestas_correctas, porcentaje_global, minutos_totales_estudio, tests_totales_completados')
      .eq('id', userId)
      .single()

    // Si las columnas no existen, calcular desde test_respuestas
    if (profileError && profileError.message?.includes('column')) {
      // Fallback: calcular desde test_respuestas existentes
      const { data: respuestas } = await supabase
        .from('test_respuestas')
        .select('es_correcta, test_id')
        .eq('test_id', supabase.from('tests').select('id').eq('user_id', userId))

      const totalPreguntas = respuestas?.length || 0
      const totalCorrectas = respuestas?.filter(r => r.es_correcta).length || 0

      // Contar tests completados
      const { count: testsCount } = await supabase
        .from('tests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .not('completed_at', 'is', null)

      // Obtener racha
      const { data: racha } = await supabase
        .from('rachas')
        .select('dias_consecutivos, mejor_racha')
        .eq('user_id', userId)
        .single()

      return {
        totalPreguntas,
        totalCorrectas,
        porcentajeGlobal: totalPreguntas > 0 ? Math.round((totalCorrectas / totalPreguntas) * 100) : 0,
        testsCompletados: testsCount || 0,
        rachaActual: racha?.dias_consecutivos || 0,
        mejorRacha: racha?.mejor_racha || 0,
        minutosEstudio: 0,
      }
    }

    // Obtener racha
    const { data: racha } = await supabase
      .from('rachas')
      .select('dias_consecutivos, mejor_racha')
      .eq('user_id', userId)
      .single()

    return {
      totalPreguntas: profile?.total_preguntas_respondidas || 0,
      totalCorrectas: profile?.total_respuestas_correctas || 0,
      porcentajeGlobal: profile?.porcentaje_global || 0,
      testsCompletados: profile?.tests_totales_completados || 0,
      rachaActual: racha?.dias_consecutivos || 0,
      mejorRacha: racha?.mejor_racha || 0,
      minutosEstudio: profile?.minutos_totales_estudio || 0,
    }
  } catch (error) {
    console.error('Error calculating basic stats:', error)
    return {
      totalPreguntas: 0,
      totalCorrectas: 0,
      porcentajeGlobal: 0,
      testsCompletados: 0,
      rachaActual: 0,
      mejorRacha: 0,
      minutosEstudio: 0,
    }
  }
}

// Obtener estadísticas diarias (últimos N días)
export async function getDailyStats(
  supabase: AnySupabaseClient,
  userId: string,
  dias: number = 30
): Promise<DailyStats[]> {
  try {
    const fechaInicio = new Date()
    fechaInicio.setDate(fechaInicio.getDate() - dias)

    // Intentar con tabla user_daily_stats
    const { data, error } = await supabase
      .from('user_daily_stats')
      .select('fecha, preguntas_respondidas, respuestas_correctas, porcentaje_aciertos, minutos_estudio')
      .eq('user_id', userId)
      .gte('fecha', fechaInicio.toISOString().split('T')[0])
      .order('fecha', { ascending: true })

    // Si la tabla no existe, usar metricas_diarias como fallback
    if (error && (error.code === '42P01' || error.message?.includes('does not exist'))) {
      const { data: metricas } = await supabase
        .from('metricas_diarias')
        .select('fecha, preguntas_total, preguntas_correctas, tiempo_total_minutos')
        .eq('user_id', userId)
        .gte('fecha', fechaInicio.toISOString().split('T')[0])
        .order('fecha', { ascending: true })

      return (metricas || []).map(d => ({
        fecha: d.fecha,
        preguntas: d.preguntas_total || 0,
        correctas: d.preguntas_correctas || 0,
        porcentaje: d.preguntas_total > 0 ? Math.round((d.preguntas_correctas / d.preguntas_total) * 100) : 0,
        minutos: d.tiempo_total_minutos || 0,
      }))
    }

    return (data || []).map(d => ({
      fecha: d.fecha,
      preguntas: d.preguntas_respondidas || 0,
      correctas: d.respuestas_correctas || 0,
      porcentaje: d.porcentaje_aciertos || 0,
      minutos: d.minutos_estudio || 0,
    }))
  } catch (error) {
    console.error('Error getting daily stats:', error)
    return []
  }
}

// Calcular ranking
export async function calculateRanking(
  supabase: AnySupabaseClient,
  userId: string,
  oposicionId?: string
): Promise<RankingData> {
  try {
    // Intentar obtener stats del usuario con columnas ML
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('porcentaje_global, total_preguntas_respondidas')
      .eq('id', userId)
      .single()

    // Si columnas no existen, devolver ranking simulado
    if (profileError && profileError.message?.includes('column')) {
      // Ranking simulado basado en posición aleatoria para demo
      const totalUsuarios = 150 + Math.floor(Math.random() * 50)
      const posicion = Math.floor(Math.random() * 30) + 1
      const percentil = Math.round(((totalUsuarios - posicion + 1) / totalUsuarios) * 100)

      return {
        posicionGlobal: posicion,
        totalUsuarios,
        percentil,
        posicionOposicion: posicion,
        totalOposicion: totalUsuarios,
        percentilOposicion: percentil,
      }
    }

    if (!userProfile || (userProfile.total_preguntas_respondidas || 0) === 0) {
      return {
        posicionGlobal: 0,
        totalUsuarios: 0,
        percentil: 0,
        posicionOposicion: 0,
        totalOposicion: 0,
        percentilOposicion: 0,
      }
    }

    // Calcular score (porcentaje ponderado por volumen)
    const userScore = (userProfile.porcentaje_global || 0) *
      Math.log10(Math.max(userProfile.total_preguntas_respondidas || 0, 1) + 1)

    // Contar usuarios con mejor score
    const { count: mejoresCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gt('porcentaje_global', userProfile.porcentaje_global || 0)
      .gt('total_preguntas_respondidas', 0)

    // Total usuarios activos
    const { count: totalCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gt('total_preguntas_respondidas', 0)

    const posicion = (mejoresCount || 0) + 1
    const total = totalCount || 1
    const percentil = Math.round(((total - posicion + 1) / total) * 100)

    return {
      posicionGlobal: posicion,
      totalUsuarios: total,
      percentil: percentil,
      posicionOposicion: posicion, // TODO: filtrar por oposición
      totalOposicion: total,
      percentilOposicion: percentil,
    }
  } catch (error) {
    console.error('Error calculating ranking:', error)
    return {
      posicionGlobal: 0,
      totalUsuarios: 0,
      percentil: 0,
      posicionOposicion: 0,
      totalOposicion: 0,
      percentilOposicion: 0,
    }
  }
}

// Calcular estadísticas por bloque
export async function calculateBloqueStats(
  supabase: AnySupabaseClient,
  userId: string,
  oposicionId: string
): Promise<BloqueStats[]> {
  try {
    // Obtener bloques de la oposición
    const { data: bloques } = await supabase
      .from('bloques')
      .select('id, nombre')
      .eq('oposicion_id', oposicionId)
      .order('orden')

    if (!bloques) return []

    const stats: BloqueStats[] = []

    // Primero intentamos ver si la tabla user_responses existe
    const { error: tableCheckError } = await supabase
      .from('user_responses')
      .select('id')
      .limit(1)

    const useTestRespuestas = tableCheckError && (
      tableCheckError.code === '42P01' ||
      tableCheckError.message?.includes('does not exist')
    )

    for (const bloque of bloques) {
      // Obtener temas del bloque
      const { data: temas } = await supabase
        .from('temas')
        .select('id')
        .eq('bloque_id', bloque.id)

      if (!temas || temas.length === 0) continue

      const temaIds = temas.map(t => t.id)

      // Obtener preguntas de estos temas
      const { data: preguntas } = await supabase
        .from('preguntas')
        .select('id')
        .in('tema_id', temaIds)

      if (!preguntas || preguntas.length === 0) continue

      const preguntaIds = preguntas.map(p => p.id)

      let total = 0
      let correctas = 0

      if (useTestRespuestas) {
        // Fallback: usar test_respuestas
        const { data: respuestas } = await supabase
          .from('test_respuestas')
          .select('es_correcta, pregunta_id')
          .in('pregunta_id', preguntaIds)

        total = respuestas?.length || 0
        correctas = respuestas?.filter(r => r.es_correcta).length || 0
      } else {
        // Usar user_responses
        const { data: respuestas } = await supabase
          .from('user_responses')
          .select('es_correcta, pregunta_id')
          .eq('user_id', userId)
          .in('pregunta_id', preguntaIds)

        total = respuestas?.length || 0
        correctas = respuestas?.filter(r => r.es_correcta).length || 0
      }

      const porcentaje = total > 0 ? Math.round((correctas / total) * 100) : 0

      // Media plataforma (simulada por ahora)
      const mediaPlataforma = 65 // TODO: calcular real

      let estado: BloqueStats['estado']
      if (porcentaje >= 85) estado = 'dominado'
      else if (porcentaje >= 70) estado = 'avanzado'
      else if (porcentaje >= 50) estado = 'progreso'
      else if (porcentaje >= 30) estado = 'debil'
      else estado = 'critico'

      stats.push({
        bloqueId: bloque.id,
        bloqueNombre: bloque.nombre,
        totalPreguntas: total,
        correctas,
        porcentaje,
        mediaPlataforma,
        diferencia: porcentaje - mediaPlataforma,
        estado,
      })
    }

    return stats
  } catch (error) {
    console.error('Error calculating bloque stats:', error)
    return []
  }
}

// Extraer features para ML
export async function extractMLFeatures(
  supabase: AnySupabaseClient,
  userId: string,
  oposicionId?: string
): Promise<MLFeatures> {
  const basicStats = await calculateBasicStats(supabase, userId)
  const dailyStats = await getDailyStats(supabase, userId, 30)

  // Calcular tendencia (últimos 7 días vs anteriores 7)
  const ultimos7 = dailyStats.slice(-7)
  const anteriores7 = dailyStats.slice(-14, -7)

  const promedioUltimos7 = ultimos7.length > 0
    ? ultimos7.reduce((sum, d) => sum + d.porcentaje, 0) / ultimos7.length
    : 0
  const promedioAnteriores7 = anteriores7.length > 0
    ? anteriores7.reduce((sum, d) => sum + d.porcentaje, 0) / anteriores7.length
    : promedioUltimos7

  const tendencia = promedioUltimos7 - promedioAnteriores7

  // Días activo
  const diasActivo = dailyStats.filter(d => d.preguntas > 0).length

  // Minutos promedio
  const minutosPromedio = diasActivo > 0
    ? dailyStats.reduce((sum, d) => sum + d.minutos, 0) / diasActivo
    : 0

  // Días sin estudiar último mes
  const diasSinEstudiar = 30 - diasActivo

  return {
    porcentajeGlobal: basicStats.porcentajeGlobal,
    porcentajeUltimos7Dias: promedioUltimos7,
    tendenciaMejora: tendencia,
    testsCompletados: basicStats.testsCompletados,
    preguntasRespondidas: basicStats.totalPreguntas,
    diasActivo,
    minutosEstudioDiarioPromedio: minutosPromedio,
    rachaActual: basicStats.rachaActual,
    rachaMaxima: basicStats.mejorRacha,
    diasSinEstudiarUltimoMes: diasSinEstudiar,
    porcentajeTemasVistos: 0, // TODO: calcular
    porcentajeTemasDominados: 0, // TODO: calcular
    simulacrosCompletados: 0, // TODO: calcular
    mediaSimulacros: 0, // TODO: calcular
  }
}

// Modelo ML simplificado (basado en reglas ponderadas)
export function predictAprobado(features: MLFeatures): PredictionData {
  // Pesos del modelo simplificado
  const weights = {
    porcentajeGlobal: 0.30,
    tendenciaMejora: 0.10,
    consistencia: 0.20,
    volumen: 0.15,
    cobertura: 0.15,
    simulacros: 0.10,
  }

  // Calcular componentes
  const scoreRendimiento = Math.min(features.porcentajeGlobal / 100, 1)

  const scoreTendencia = features.tendenciaMejora > 0
    ? Math.min(0.5 + features.tendenciaMejora / 20, 1)
    : Math.max(0.5 + features.tendenciaMejora / 20, 0)

  const scoreConsistencia = Math.min(
    (features.rachaActual / 30) * 0.5 +
    (1 - features.diasSinEstudiarUltimoMes / 30) * 0.5,
    1
  )

  const scoreVolumen = Math.min(
    Math.log10(features.preguntasRespondidas + 1) / 4, // ~10000 preguntas = 1
    1
  )

  const scoreCobertura = (features.porcentajeTemasVistos + features.porcentajeTemasDominados) / 200

  const scoreSimulacros = features.simulacrosCompletados > 0
    ? Math.min(features.mediaSimulacros / 100 * (features.simulacrosCompletados / 10), 1)
    : 0.3 // Penalización por no hacer simulacros

  // Calcular probabilidad ponderada
  let probabilidad = (
    scoreRendimiento * weights.porcentajeGlobal +
    scoreTendencia * weights.tendenciaMejora +
    scoreConsistencia * weights.consistencia +
    scoreVolumen * weights.volumen +
    scoreCobertura * weights.cobertura +
    scoreSimulacros * weights.simulacros
  ) * 100

  // Ajustar al rango razonable (30-95%)
  probabilidad = Math.max(30, Math.min(95, probabilidad))

  // Confianza basada en datos disponibles
  const confianza = Math.min(
    50 + (features.preguntasRespondidas / 100) * 20 + (features.diasActivo / 30) * 30,
    95
  )

  // Estimar días hasta listo (85% probabilidad)
  const diasHastaListo = probabilidad >= 85
    ? 0
    : Math.round((85 - probabilidad) / (features.tendenciaMejora > 0 ? features.tendenciaMejora : 0.5))

  const fechaListo = new Date()
  fechaListo.setDate(fechaListo.getDate() + diasHastaListo)

  // Factores
  const factoresPositivos: string[] = []
  const factoresNegativos: string[] = []
  const recomendaciones: string[] = []

  if (features.porcentajeGlobal >= 70) {
    factoresPositivos.push('Buen porcentaje de aciertos global')
  } else {
    factoresNegativos.push('Porcentaje de aciertos por debajo del ideal')
    recomendaciones.push('Enfócate en repasar los temas donde más fallas')
  }

  if (features.tendenciaMejora > 0) {
    factoresPositivos.push('Tendencia de mejora positiva')
  } else if (features.tendenciaMejora < -5) {
    factoresNegativos.push('Tu rendimiento ha bajado últimamente')
    recomendaciones.push('Descansa y retoma con energía renovada')
  }

  if (features.rachaActual >= 7) {
    factoresPositivos.push('Excelente constancia de estudio')
  } else if (features.rachaActual < 3) {
    factoresNegativos.push('Falta constancia en el estudio')
    recomendaciones.push('Intenta estudiar al menos 15 minutos cada día')
  }

  if (features.preguntasRespondidas >= 500) {
    factoresPositivos.push('Buen volumen de práctica')
  } else {
    factoresNegativos.push('Necesitas más práctica')
    recomendaciones.push('Aumenta el número de tests diarios')
  }

  return {
    probabilidadAprobado: Math.round(probabilidad),
    confianzaModelo: Math.round(confianza),
    diasHastaListo,
    fechaEstimadaListo: fechaListo.toISOString().split('T')[0],
    factoresPositivos,
    factoresNegativos,
    recomendaciones,
  }
}

// Función principal para obtener todas las métricas
export async function getAllMetrics(
  supabase: AnySupabaseClient,
  userId: string,
  oposicionId?: string,
  userPlan: 'free' | 'basic' | 'pro' | 'elite' = 'free'
) {
  const basicStats = await calculateBasicStats(supabase, userId)

  // Métricas básicas para todos
  const result: {
    basic: BasicStats
    daily?: DailyStats[]
    ranking?: RankingData
    bloques?: BloqueStats[]
    prediction?: PredictionData
    features?: MLFeatures
  } = {
    basic: basicStats,
  }

  // Básico+: Historial y ranking
  if (userPlan !== 'free') {
    result.daily = await getDailyStats(supabase, userId, 30)
    result.ranking = await calculateRanking(supabase, userId, oposicionId)
  }

  // Pro+: Predicciones y análisis por bloque
  if (userPlan === 'pro' || userPlan === 'elite') {
    if (oposicionId) {
      result.bloques = await calculateBloqueStats(supabase, userId, oposicionId)
    }
    result.features = await extractMLFeatures(supabase, userId, oposicionId)
    result.prediction = predictAprobado(result.features)
  }

  return result
}
