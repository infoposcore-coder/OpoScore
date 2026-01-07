// ===========================================
// OpoScore - Hook useTests
// ===========================================

'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Test, Pregunta, Respuesta } from '@/types/database'

interface GenerateTestParams {
  oposicionId: string
  temaIds?: string[]
  cantidad?: number
  dificultad?: 'facil' | 'media' | 'dificil' | 'mixta'
  tipo?: 'practica' | 'simulacro' | 'repaso'
}

interface PreguntaConRespuestas extends Pregunta {
  respuestas: Respuesta[]
}

interface TestConPreguntas extends Test {
  preguntas: PreguntaConRespuestas[]
}

// Hook para generar un nuevo test
export function useGenerateTest() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      oposicionId,
      temaIds,
      cantidad = 20,
      dificultad = 'mixta',
      tipo = 'practica',
    }: GenerateTestParams): Promise<TestConPreguntas> => {
      // Obtener usuario actual
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      // Construir query de preguntas
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any)
        .from('preguntas')
        .select(`
          *,
          respuestas (*)
        `)

      // Filtrar por temas si se especifican
      if (temaIds && temaIds.length > 0) {
        query = query.in('tema_id', temaIds)
      } else {
        // Obtener todos los temas de la oposición
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: temas } = await (supabase as any)
          .from('temas')
          .select('id')
          .eq('bloque.oposicion_id', oposicionId)

        if (temas) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          query = query.in('tema_id', temas.map((t: any) => t.id))
        }
      }

      // Filtrar por dificultad
      if (dificultad !== 'mixta') {
        query = query.eq('dificultad', dificultad)
      }

      const { data: preguntas, error: preguntasError } = await query

      if (preguntasError) throw preguntasError
      if (!preguntas || preguntas.length === 0) {
        throw new Error('No hay preguntas disponibles con los criterios seleccionados')
      }

      // Seleccionar preguntas aleatorias
      const preguntasAleatorias = shuffleArray(preguntas as PreguntaConRespuestas[]).slice(0, cantidad)

      // Crear el test
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: test, error: testError } = await (supabase as any)
        .from('tests')
        .insert({
          user_id: user.id,
          oposicion_id: oposicionId,
          tipo,
          config: {
            cantidad,
            dificultad,
            tema_ids: temaIds,
          },
        })
        .select()
        .single()

      if (testError) throw testError

      return {
        ...(test as Test),
        preguntas: preguntasAleatorias,
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] })
    },
  })
}

// Hook para enviar respuestas de un test
export function useSubmitTest() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      testId,
      respuestas,
    }: {
      testId: string
      respuestas: { preguntaId: string; respuestaId: string | null; tiempoMs: number }[]
    }) => {
      // Obtener las respuestas correctas
      const preguntaIds = respuestas.map(r => r.preguntaId)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: respuestasCorrectas } = await (supabase as any)
        .from('respuestas')
        .select('id, pregunta_id, es_correcta')
        .in('pregunta_id', preguntaIds)
        .eq('es_correcta', true)

      const correctasMap = new Map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        respuestasCorrectas?.map((r: any) => [r.pregunta_id, r.id]) || []
      )

      // Insertar respuestas del test
      const testRespuestas = respuestas.map(r => ({
        test_id: testId,
        pregunta_id: r.preguntaId,
        respuesta_id: r.respuestaId,
        tiempo_ms: r.tiempoMs,
        es_correcta: r.respuestaId === correctasMap.get(r.preguntaId),
      }))

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: respuestasError } = await (supabase as any)
        .from('test_respuestas')
        .insert(testRespuestas)

      if (respuestasError) throw respuestasError

      // Marcar test como completado
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: test, error: testError } = await (supabase as any)
        .from('tests')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', testId)
        .select()
        .single()

      if (testError) throw testError

      return test as Test
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] })
      queryClient.invalidateQueries({ queryKey: ['oposcore'] })
    },
  })
}

// Tipos para resultados de test
interface TestRespuestaConPregunta {
  es_correcta: boolean
  tiempo_ms: number
  pregunta: Pregunta & { respuestas: Respuesta[] }
}

// Hook para obtener historial de tests
export function useTestHistory(userId: string, oposicionId?: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tests', 'history', userId, oposicionId],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any)
        .from('tests')
        .select(`
          *,
          oposicion:oposiciones(nombre, slug)
        `)
        .eq('user_id', userId)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(50)

      if (oposicionId) {
        query = query.eq('oposicion_id', oposicionId)
      }

      const { data, error } = await query

      if (error) throw error
      return (data || []) as Test[]
    },
    enabled: !!userId,
  })
}

// Hook para obtener resultados de un test específico
export function useTestResults(testId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['tests', testId, 'results'],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: test, error: testError } = await (supabase as any)
        .from('tests')
        .select('*')
        .eq('id', testId)
        .single()

      if (testError) throw testError

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: respuestas, error: respuestasError } = await (supabase as any)
        .from('test_respuestas')
        .select(`
          *,
          pregunta:preguntas(
            *,
            respuestas(*)
          )
        `)
        .eq('test_id', testId) as { data: TestRespuestaConPregunta[] | null; error: unknown }

      if (respuestasError) throw respuestasError

      const correctas = respuestas?.filter(r => r.es_correcta).length || 0
      const total = respuestas?.length || 0

      return {
        test: test as Test,
        respuestas,
        estadisticas: {
          correctas,
          incorrectas: total - correctas,
          total,
          porcentaje: total > 0 ? Math.round((correctas / total) * 100) : 0,
          tiempoTotal: respuestas?.reduce((acc, r) => acc + r.tiempo_ms, 0) || 0,
        },
      }
    },
    enabled: !!testId,
  })
}

// Utilidad para mezclar array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
