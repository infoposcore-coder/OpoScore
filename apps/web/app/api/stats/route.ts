// ===========================================
// OpoMetrics - API de Estadísticas y Métricas ML
// ===========================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  calculateBasicStats,
  getDailyStats,
  calculateRanking,
  calculateBloqueStats,
  extractMLFeatures,
  predictAprobado,
  getAllMetrics,
} from '@/lib/stats/calculator'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Obtener parámetros
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'all'
    const oposicionId = searchParams.get('oposicion_id')

    // Obtener plan del usuario (simulado por ahora - TODO: integrar con Stripe)
    // Por defecto pro para testing
    const userPlan = 'pro' as 'free' | 'basic' | 'pro' | 'elite'

    let data

    switch (type) {
      case 'basic':
        data = await calculateBasicStats(supabase, user.id)
        break

      case 'daily':
        const days = parseInt(searchParams.get('days') || '30')
        data = await getDailyStats(supabase, user.id, days)
        break

      case 'ranking':
        if (userPlan === 'free') {
          return NextResponse.json(
            { error: 'Upgrade required', requiredPlan: 'basic' },
            { status: 403 }
          )
        }
        data = await calculateRanking(supabase, user.id, oposicionId || undefined)
        break

      case 'bloques':
        if (userPlan === 'free' || userPlan === 'basic') {
          return NextResponse.json(
            { error: 'Upgrade required', requiredPlan: 'pro' },
            { status: 403 }
          )
        }
        if (!oposicionId) {
          return NextResponse.json(
            { error: 'oposicion_id is required' },
            { status: 400 }
          )
        }
        data = await calculateBloqueStats(supabase, user.id, oposicionId)
        break

      case 'prediction':
        if (userPlan === 'free' || userPlan === 'basic') {
          return NextResponse.json(
            { error: 'Upgrade required', requiredPlan: 'pro' },
            { status: 403 }
          )
        }
        const features = await extractMLFeatures(supabase, user.id, oposicionId || undefined)
        data = {
          features,
          prediction: predictAprobado(features),
        }
        break

      case 'all':
      default:
        data = await getAllMetrics(supabase, user.id, oposicionId || undefined, userPlan)
        break
    }

    return NextResponse.json({
      success: true,
      data,
      plan: userPlan,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Error en API stats:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Endpoint para registrar respuesta (tracking)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { preguntaId, respuestaId, esCorrecta, tiempoMs, testId, sessionId } = body

    if (!preguntaId || esCorrecta === undefined) {
      return NextResponse.json(
        { error: 'preguntaId y esCorrecta son requeridos' },
        { status: 400 }
      )
    }

    // Insertar respuesta en user_responses
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('user_responses')
      .insert({
        user_id: user.id,
        pregunta_id: preguntaId,
        respuesta_elegida: respuestaId,
        es_correcta: esCorrecta,
        tiempo_respuesta_ms: tiempoMs,
        test_id: testId,
        session_id: sessionId,
      })
      .select()
      .single()

    if (error) {
      // Si la tabla no existe, retornar éxito de todas formas
      // (para que funcione antes de ejecutar la migración)
      if (error.code === '42P01') {
        return NextResponse.json({
          success: true,
          message: 'Tracking table not yet created',
          tracked: false,
        })
      }
      throw error
    }

    return NextResponse.json({
      success: true,
      tracked: true,
      data,
    })

  } catch (error) {
    console.error('Error tracking response:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
