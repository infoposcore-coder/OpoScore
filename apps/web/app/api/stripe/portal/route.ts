// ===========================================
// OpoScore - Stripe Customer Portal API
// ===========================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCustomerId, createPortalSession } from '@/lib/stripe/helpers'
import type { PortalResponse } from '@/types/stripe'

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // 2. Obtener customer_id
    const customerId = await getCustomerId(user.id)

    if (!customerId) {
      return NextResponse.json(
        { error: 'No tienes una suscripción activa' },
        { status: 404 }
      )
    }

    // 3. Crear sesión del portal
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const portalUrl = await createPortalSession({
      customerId,
      returnUrl: `${appUrl}/perfil`,
    })

    // 4. Devolver URL del portal
    const response: PortalResponse = { url: portalUrl }
    return NextResponse.json(response)
  } catch (error) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { error: 'Error al acceder al portal de facturación' },
      { status: 500 }
    )
  }
}
