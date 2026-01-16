// ===========================================
// OpoScore - Stripe Checkout API
// ===========================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getOrCreateCustomer, createCheckoutSession } from '@/lib/stripe/helpers'
import type { CheckoutRequest, CheckoutResponse } from '@/types/stripe'

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

    // 2. Obtener datos del request
    const body: CheckoutRequest = await request.json()
    const { priceId } = body

    if (!priceId) {
      return NextResponse.json(
        { error: 'Falta el ID del precio' },
        { status: 400 }
      )
    }

    // 2.1 Validar que el priceId existe y está activo en la base de datos
    const { data: validPrice, error: priceError } = await supabase
      .from('prices')
      .select('id, active, product_id')
      .eq('id', priceId)
      .eq('active', true)
      .single()

    if (priceError || !validPrice) {
      return NextResponse.json(
        { error: 'Precio no válido o inactivo' },
        { status: 400 }
      )
    }

    // 3. Obtener perfil del usuario
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single() as { data: { full_name: string | null; email: string } | null }

    // 4. Obtener o crear customer en Stripe
    const customerId = await getOrCreateCustomer(
      user.id,
      user.email || profile?.email || '',
      profile?.full_name || undefined
    )

    // 5. Crear sesión de checkout
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const checkoutUrl = await createCheckoutSession({
      customerId,
      priceId,
      userId: user.id,
      successUrl: `${appUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/precios?checkout=canceled`,
    })

    // 6. Devolver URL de checkout
    const response: CheckoutResponse = { url: checkoutUrl }
    return NextResponse.json(response)
  } catch {
    // Checkout error - consider logging to monitoring service
    return NextResponse.json(
      { error: 'Error al crear sesión de pago' },
      { status: 500 }
    )
  }
}
