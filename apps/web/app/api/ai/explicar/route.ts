// ===========================================
// OpoMetrics - API Explicar Pregunta
// ===========================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { chatWithCache, type ChatMessage } from '@/lib/ai/groq'
import { buildExplicacionPrompt } from '@/lib/ai/prompts'

export const runtime = 'edge'

interface ExplicarRequest {
  preguntaId: string
  respuestaUsuarioId: string
}

interface RespuestaData {
  id: string
  texto: string
  es_correcta: boolean
  orden: number
}

interface PreguntaConRespuestas {
  enunciado: string
  explicacion: string | null
  respuestas: RespuestaData[]
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const body: ExplicarRequest = await request.json()
    const { preguntaId, respuestaUsuarioId } = body

    if (!preguntaId) {
      return NextResponse.json(
        { error: 'Falta el ID de la pregunta' },
        { status: 400 }
      )
    }

    // Obtener la pregunta y sus respuestas
    const { data: pregunta, error: preguntaError } = await supabase
      .from('preguntas')
      .select(`
        enunciado,
        explicacion,
        respuestas (
          id,
          texto,
          es_correcta,
          orden
        )
      `)
      .eq('id', preguntaId)
      .single() as { data: PreguntaConRespuestas | null; error: unknown }

    if (preguntaError || !pregunta) {
      return NextResponse.json(
        { error: 'Pregunta no encontrada' },
        { status: 404 }
      )
    }

    // Si ya tiene explicación en la BD, usarla directamente
    if (pregunta.explicacion) {
      return NextResponse.json({
        explicacion: pregunta.explicacion,
        fuente: 'database',
        timestamp: new Date().toISOString(),
      })
    }

    // Generar explicación con IA
    const respuestaUsuario = pregunta.respuestas.find(r => r.id === respuestaUsuarioId)
    const respuestaTexto = respuestaUsuario
      ? `${String.fromCharCode(65 + respuestaUsuario.orden - 1)}) ${respuestaUsuario.texto}`
      : 'No respondió'

    const opciones = pregunta.respuestas
      .sort((a, b) => a.orden - b.orden)
      .map(r => ({
        texto: r.texto,
        esCorrecta: r.es_correcta,
      }))

    const prompt = buildExplicacionPrompt(pregunta.enunciado, opciones, respuestaTexto)

    const messages: ChatMessage[] = [
      { role: 'user', content: prompt },
    ]

    const explicacion = await chatWithCache(messages, {
      temperature: 0.3, // Más determinístico para explicaciones
      max_tokens: 512,
    })

    return NextResponse.json({
      explicacion,
      fuente: 'ai',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Explicar API error:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
