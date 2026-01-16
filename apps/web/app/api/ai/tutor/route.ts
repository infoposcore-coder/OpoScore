// ===========================================
// OpoScore - API Tutor IA
// ===========================================

import { NextRequest, NextResponse } from 'next/server'
import { chatWithCache, type ChatMessage } from '@/lib/ai/groq'
import { buildTutorPrompt } from '@/lib/ai/prompts'
import { checkRateLimit, getRateLimitIdentifier, RATE_LIMITS } from '@/lib/rate-limit'

// Detectar modo demo
const DEMO_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL

interface TutorRequest {
  mensaje: string
  oposicion: string
  tema?: string
  historial?: ChatMessage[]
}

export async function POST(request: NextRequest) {
  try {
    let userId: string | undefined
    let isPremium = false

    // En modo producción, verificar autenticación
    if (!DEMO_MODE) {
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return NextResponse.json(
          { error: 'No autenticado' },
          { status: 401 }
        )
      }

      userId = user.id

      // Verificar si es premium para rate limiting más generoso
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .single()

      isPremium = !!subscription
    }

    // Rate limiting
    const identifier = getRateLimitIdentifier(request, userId)
    const rateLimit = isPremium ? RATE_LIMITS.ai : RATE_LIMITS.aiFree
    const { allowed, remaining, resetIn } = checkRateLimit(identifier, rateLimit)

    if (!allowed) {
      return NextResponse.json(
        {
          error: 'Demasiadas solicitudes. Por favor, espera un momento.',
          resetIn,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(resetIn),
            'Retry-After': String(resetIn),
          },
        }
      )
    }

    const body: TutorRequest = await request.json()
    const { mensaje, oposicion, tema, historial = [] } = body

    if (!mensaje || !oposicion) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: mensaje, oposicion' },
        { status: 400 }
      )
    }

    // Construir mensajes para la IA
    const systemPrompt = buildTutorPrompt(mensaje, oposicion, tema)

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...historial.slice(-10), // Últimos 10 mensajes del historial
      { role: 'user', content: mensaje },
    ]

    // Llamar a la IA (con caché para preguntas frecuentes)
    const respuesta = await chatWithCache(messages, {
      temperature: 0.7,
      max_tokens: 1024,
    })

    return NextResponse.json(
      {
        respuesta,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(resetIn),
        },
      }
    )
  } catch {
    // Tutor API error - consider logging to monitoring service
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
