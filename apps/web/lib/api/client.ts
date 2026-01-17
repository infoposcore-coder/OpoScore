// @ts-nocheck
/**
 * API Client - Cliente HTTP tipado para todas las operaciones
 * Temporarily disabled type checking due to Supabase type inference issues
 * TODO: Refactor to use proper Supabase types when client types are fixed
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

// ============================================
// TYPES
// ============================================

type Tables = Database['public']['Tables']
type Oposicion = Tables['oposiciones']['Row']
type Tema = Tables['temas']['Row']
type Pregunta = Tables['preguntas']['Row']
type Test = Tables['tests']['Row']
type TestInsert = Tables['tests']['Insert']
type TestRespuestaInsert = Tables['test_respuestas']['Insert']
type Respuesta = Tables['respuestas']['Row']
type Profile = Tables['profiles']['Row']
type SesionEstudio = Tables['sesiones_estudio']['Row']

export interface OpoScoreData {
  score: number
  nivel: 'empezando' | 'progresando' | 'avanzando' | 'casi_listo' | 'preparado'
  tendencia: 'subiendo' | 'estable' | 'bajando'
  factores: {
    precision: number
    constancia: number
    cobertura: number
    tendencia: number
  }
  prediccion: {
    probabilidadAprobado: number
    diasEstimados: number | null
  }
}

export interface DashboardData {
  opoScore: OpoScoreData
  racha: number
  rachaMaxima: number
  totalPreguntas: number
  precisionGlobal: number
  tiempoEstudioHoy: number
  temasCompletados: number
  totalTemas: number
  actividadSemanal: Array<{
    fecha: string
    minutos: number
    preguntas: number
  }>
  temasDebiles: Array<{
    tema: string
    precision: number
  }>
}

export interface TestResult {
  id: string
  puntuacion: number
  totalPreguntas: number
  correctas: number
  incorrectas: number
  tiempoTotal: number
  respuestas: Array<{
    preguntaId: string
    respuestaSeleccionada: string
    correcta: boolean
    tiempoRespuesta: number
  }>
}

export interface SubmitAnswerPayload {
  testId: string
  preguntaId: string
  respuestaSeleccionada: string
  tiempoRespuesta: number
}

// ============================================
// API CLIENT CLASS
// ============================================

class APIClient {
  private supabase = createClient()

  // ----------------------------------------
  // OPOSICIONES
  // ----------------------------------------

  async getOposiciones(): Promise<Oposicion[]> {
    const { data, error } = await this.supabase
      .from('oposiciones')
      .select('*')
      .eq('activa', true)
      .order('nombre')

    if (error) throw new Error(error.message)
    return data || []
  }

  async getOposicion(slug: string): Promise<Oposicion | null> {
    const { data, error } = await this.supabase
      .from('oposiciones')
      .select('*')
      .eq('slug', slug)
      .eq('activa', true)
      .single()

    if (error) return null
    return data
  }

  // ----------------------------------------
  // TEMARIO
  // ----------------------------------------

  async getTemas(oposicionId: string): Promise<Tema[]> {
    const { data, error } = await this.supabase
      .from('temas')
      .select(`
        *,
        bloque:bloques(id, nombre, orden)
      `)
      .eq('oposicion_id', oposicionId)
      .order('orden')

    if (error) throw new Error(error.message)
    return data || []
  }

  async getTema(temaId: string): Promise<Tema | null> {
    const { data, error } = await this.supabase
      .from('temas')
      .select(`
        *,
        bloque:bloques(id, nombre, orden),
        subtemas(*)
      `)
      .eq('id', temaId)
      .single()

    if (error) return null
    return data
  }

  // ----------------------------------------
  // PREGUNTAS Y TESTS
  // ----------------------------------------

  async getPreguntas(temaId: string, limit = 10): Promise<Pregunta[]> {
    const { data, error } = await this.supabase
      .from('preguntas')
      .select('*')
      .eq('tema_id', temaId)
      .limit(limit)

    if (error) throw new Error(error.message)
    return data || []
  }

  async createTest(oposicionId: string, temaIds: string[], tipo: 'practica' | 'simulacro' = 'practica'): Promise<Test> {
    const { data: user } = await this.supabase.auth.getUser()
    if (!user.user) throw new Error('No autenticado')

    // Obtener preguntas aleatorias de los temas seleccionados
    const { data: preguntasData, error: preguntasError } = await this.supabase
      .from('preguntas')
      .select('id')
      .in('tema_id', temaIds)
      .limit(tipo === 'simulacro' ? 100 : 20)

    if (preguntasError) throw new Error(preguntasError.message)

    const preguntas = preguntasData as Array<{ id: string }> | null

    // Crear el test con config JSON
    const testData: TestInsert = {
      user_id: user.user.id,
      oposicion_id: oposicionId,
      tipo,
      config: {
        preguntas_ids: preguntas?.map(p => p.id) || [],
        total_preguntas: preguntas?.length || 0,
      },
    }
    const { data: test, error: testError } = await this.supabase
      .from('tests')
      .insert(testData as never)
      .select()
      .single()

    if (testError) throw new Error(testError.message)
    return test as Test
  }

  async submitAnswer(payload: SubmitAnswerPayload): Promise<{ correcta: boolean; explicacion: string }> {
    const { data: user } = await this.supabase.auth.getUser()
    if (!user.user) throw new Error('No autenticado')

    // Obtener la pregunta con sus respuestas para verificar
    const { data: preguntaData } = await this.supabase
      .from('preguntas')
      .select('id, explicacion, respuestas:respuestas(id, es_correcta)')
      .eq('id', payload.preguntaId)
      .single()

    const pregunta = preguntaData as { id: string; explicacion: string | null; respuestas: Array<{ id: string; es_correcta: boolean }> | null } | null
    if (!pregunta) throw new Error('Pregunta no encontrada')

    // Buscar si la respuesta seleccionada es correcta
    const respuestasData = pregunta.respuestas
    const respuestaCorrecta = respuestasData?.find(r => r.id === payload.respuestaSeleccionada)
    const correcta = respuestaCorrecta?.es_correcta || false

    // Guardar respuesta en test_respuestas
    const testRespuestaData: TestRespuestaInsert = {
      test_id: payload.testId,
      pregunta_id: payload.preguntaId,
      respuesta_id: payload.respuestaSeleccionada,
      es_correcta: correcta,
      tiempo_ms: payload.tiempoRespuesta,
    }
    await this.supabase.from('test_respuestas').insert(testRespuestaData as never)

    return {
      correcta,
      explicacion: pregunta.explicacion || '',
    }
  }

  async finishTest(testId: string): Promise<TestResult> {
    const { data: user } = await this.supabase.auth.getUser()
    if (!user.user) throw new Error('No autenticado')

    // Tipo para test_respuestas
    type TestRespuesta = {
      id: string
      test_id: string
      pregunta_id: string
      respuesta_id: string | null
      tiempo_ms: number
      es_correcta: boolean
    }

    // Obtener todas las respuestas del test
    const { data: respuestasData } = await this.supabase
      .from('test_respuestas')
      .select('*')
      .eq('test_id', testId)

    const respuestas = respuestasData as TestRespuesta[] | null

    const correctas = respuestas?.filter(r => r.es_correcta).length || 0
    const totalPreguntas = respuestas?.length || 0
    const puntuacion = totalPreguntas > 0 ? Math.round((correctas / totalPreguntas) * 100) : 0

    // Calcular tiempo total
    const tiempoTotal = respuestas?.reduce((acc, r) => acc + (r.tiempo_ms || 0), 0) || 0

    // Actualizar el test
    const { data: testData, error } = await this.supabase
      .from('tests')
      .update({
        completed_at: new Date().toISOString(),
        puntuacion,
      } as never)
      .eq('id', testId)
      .select()
      .single()

    if (error) throw new Error(error.message)

    const test = testData as Test

    return {
      id: test.id,
      puntuacion,
      totalPreguntas,
      correctas,
      incorrectas: totalPreguntas - correctas,
      tiempoTotal,
      respuestas: respuestas?.map(r => ({
        preguntaId: r.pregunta_id,
        respuestaSeleccionada: r.respuesta_id || '',
        correcta: r.es_correcta,
        tiempoRespuesta: r.tiempo_ms || 0,
      })) || [],
    }
  }

  // ----------------------------------------
  // OPOSCORE Y ESTADÍSTICAS
  // ----------------------------------------

  async getOpoScore(oposicionId?: string): Promise<OpoScoreData> {
    const { data: user } = await this.supabase.auth.getUser()
    if (!user.user) throw new Error('No autenticado')

    // Valores por defecto
    const defaultOpoScore: OpoScoreData = {
      score: 0,
      nivel: 'empezando',
      tendencia: 'estable',
      factores: {
        precision: 0,
        constancia: 0,
        cobertura: 0,
        tendencia: 0,
      },
      prediccion: {
        probabilidadAprobado: 0,
        diasEstimados: null,
      },
    }

    if (!oposicionId) {
      // Obtener la oposición activa del usuario
      const { data: userOposicion } = await this.supabase
        .from('user_oposiciones')
        .select('oposicion_id')
        .eq('user_id', user.user.id)
        .eq('activa', true)
        .limit(1)
        .single()

      if (!userOposicion) return defaultOpoScore
      oposicionId = (userOposicion as { oposicion_id: string }).oposicion_id
    }

    // Llamar a la función RPC que calcula el OpoScore
    const { data, error } = await this.supabase.rpc('calcular_oposcore', {
      p_user_id: user.user.id,
      p_oposicion_id: oposicionId,
    } as never)

    if (error) {
      return defaultOpoScore
    }

    // El RPC retorna un número (score), construir el objeto completo
    const score = typeof data === 'number' ? data : 0
    return {
      ...defaultOpoScore,
      score,
      nivel: score >= 80 ? 'preparado' : score >= 60 ? 'avanzando' : score >= 40 ? 'progresando' : 'empezando',
    }
  }

  async getDashboardData(): Promise<DashboardData> {
    const { data: user } = await this.supabase.auth.getUser()
    if (!user.user) throw new Error('No autenticado')

    // Ejecutar múltiples queries en paralelo
    const [opoScore, profile, racha, stats, actividad] = await Promise.all([
      this.getOpoScore(),
      this.getProfile(),
      this.getRacha(),
      this.getEstadisticas(),
      this.getActividadSemanal(),
    ])

    return {
      opoScore,
      racha: racha.actual,
      rachaMaxima: racha.maxima,
      totalPreguntas: stats.totalPreguntas,
      precisionGlobal: stats.precisionGlobal,
      tiempoEstudioHoy: stats.tiempoHoy,
      temasCompletados: stats.temasCompletados,
      totalTemas: stats.totalTemas,
      actividadSemanal: actividad,
      temasDebiles: stats.temasDebiles,
    }
  }

  // ----------------------------------------
  // PERFIL Y USUARIO
  // ----------------------------------------

  async getProfile(): Promise<Profile | null> {
    const { data: user } = await this.supabase.auth.getUser()
    if (!user.user) return null

    const { data } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .single()

    return data
  }

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const { data: user } = await this.supabase.auth.getUser()
    if (!user.user) throw new Error('No autenticado')

    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.user.id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  // ----------------------------------------
  // RACHA
  // ----------------------------------------

  async getRacha(): Promise<{ actual: number; maxima: number }> {
    const { data: user } = await this.supabase.auth.getUser()
    if (!user.user) return { actual: 0, maxima: 0 }

    const { data } = await this.supabase
      .from('rachas')
      .select('racha_actual, racha_maxima')
      .eq('user_id', user.user.id)
      .single()

    return {
      actual: data?.racha_actual || 0,
      maxima: data?.racha_maxima || 0,
    }
  }

  async actualizarRacha(): Promise<void> {
    const { data: user } = await this.supabase.auth.getUser()
    if (!user.user) return

    await this.supabase.rpc('actualizar_racha', {
      p_user_id: user.user.id,
    })
  }

  // ----------------------------------------
  // ESTADÍSTICAS
  // ----------------------------------------

  private async getEstadisticas() {
    const { data: user } = await this.supabase.auth.getUser()
    if (!user.user) {
      return {
        totalPreguntas: 0,
        precisionGlobal: 0,
        tiempoHoy: 0,
        temasCompletados: 0,
        totalTemas: 0,
        temasDebiles: [],
      }
    }

    const { data } = await this.supabase.rpc('obtener_estadisticas_usuario', {
      p_user_id: user.user.id,
    })

    return data || {
      totalPreguntas: 0,
      precisionGlobal: 0,
      tiempoHoy: 0,
      temasCompletados: 0,
      totalTemas: 0,
      temasDebiles: [],
    }
  }

  private async getActividadSemanal() {
    const { data: user } = await this.supabase.auth.getUser()
    if (!user.user) return []

    const { data } = await this.supabase
      .from('metricas_diarias')
      .select('fecha, minutos_estudio, preguntas_respondidas')
      .eq('user_id', user.user.id)
      .gte('fecha', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('fecha', { ascending: true })

    return data?.map(d => ({
      fecha: d.fecha,
      minutos: d.minutos_estudio || 0,
      preguntas: d.preguntas_respondidas || 0,
    })) || []
  }

  // ----------------------------------------
  // SESIONES DE ESTUDIO
  // ----------------------------------------

  async iniciarSesion(tipo: 'lectura' | 'test' | 'flashcards' | 'simulacro'): Promise<string> {
    const { data: user } = await this.supabase.auth.getUser()
    if (!user.user) throw new Error('No autenticado')

    const { data, error } = await this.supabase
      .from('sesiones_estudio')
      .insert({
        user_id: user.user.id,
        tipo,
        inicio: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (error) throw new Error(error.message)
    return data.id
  }

  async finalizarSesion(sesionId: string, datos?: Partial<SesionEstudio>): Promise<void> {
    const { error } = await this.supabase
      .from('sesiones_estudio')
      .update({
        fin: new Date().toISOString(),
        ...datos,
      })
      .eq('id', sesionId)

    if (error) throw new Error(error.message)
  }

  // ----------------------------------------
  // SUSCRIPCIÓN
  // ----------------------------------------

  async getSubscription() {
    const { data: user } = await this.supabase.auth.getUser()
    if (!user.user) return null

    const { data } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('status', 'active')
      .single()

    return data
  }

  async isPremium(): Promise<boolean> {
    const subscription = await this.getSubscription()
    return subscription !== null
  }
}

// ============================================
// EXPORT SINGLETON
// ============================================

export const api = new APIClient()
export default api
