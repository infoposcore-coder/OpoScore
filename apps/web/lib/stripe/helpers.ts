// ===========================================
// OpoMetrics - Stripe Helper Functions
// ===========================================

import { stripe } from './server'
import { createServiceClient } from '@/lib/supabase/server'
import { TRIAL_DAYS } from './config'

/**
 * Obtiene o crea un customer de Stripe para un usuario
 */
export async function getOrCreateCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  const supabase = createServiceClient()

  // Buscar customer existente
  const { data: existingCustomer } = await (supabase
    .from('customers') as any)
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single() as { data: { stripe_customer_id: string } | null }

  if (existingCustomer?.stripe_customer_id) {
    return existingCustomer.stripe_customer_id
  }

  // Crear nuevo customer en Stripe
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      user_id: userId,
    },
  })

  // Guardar en base de datos
  await (supabase.from('customers') as any).upsert({
    user_id: userId,
    stripe_customer_id: customer.id,
  })

  return customer.id
}

/**
 * Crea una sesión de checkout de Stripe
 */
export async function createCheckoutSession({
  customerId,
  priceId,
  userId,
  successUrl,
  cancelUrl,
}: {
  customerId: string
  priceId: string
  userId: string
  successUrl: string
  cancelUrl: string
}): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      trial_period_days: TRIAL_DAYS,
      metadata: {
        user_id: userId,
      },
    },
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    customer_update: {
      address: 'auto',
      name: 'auto',
    },
    locale: 'es',
  })

  if (!session.url) {
    throw new Error('No se pudo crear la sesión de checkout')
  }

  return session.url
}

/**
 * Crea una sesión del portal de facturación de Stripe
 */
export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session.url
}

/**
 * Sincroniza un producto de Stripe a la base de datos
 */
export async function upsertProduct(product: {
  id: string
  active: boolean
  name: string
  description?: string | null
  image?: string | null
  metadata: Record<string, string>
}) {
  const supabase = createServiceClient()

  const { error } = await (supabase.from('products') as any).upsert({
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description || null,
    image: product.image || null,
    metadata: product.metadata,
  })

  if (error) throw error
}

/**
 * Sincroniza un precio de Stripe a la base de datos
 */
export async function upsertPrice(price: {
  id: string
  product_id: string
  active: boolean
  currency: string
  unit_amount: number | null
  type: string
  interval?: string | null
  interval_count?: number | null
  trial_period_days?: number | null
  metadata: Record<string, string>
}) {
  const supabase = createServiceClient()

  const { error } = await (supabase.from('prices') as any).upsert({
    id: price.id,
    product_id: price.product_id,
    active: price.active,
    currency: price.currency,
    unit_amount: price.unit_amount,
    type: price.type,
    interval: price.interval || null,
    interval_count: price.interval_count || null,
    trial_period_days: price.trial_period_days || null,
    metadata: price.metadata,
  })

  if (error) throw error
}

/**
 * Sincroniza una suscripción de Stripe a la base de datos
 */
export async function upsertSubscription(subscription: {
  id: string
  user_id: string
  status: string
  price_id: string
  quantity: number
  cancel_at_period_end: boolean
  cancel_at: Date | null
  canceled_at: Date | null
  current_period_start: Date
  current_period_end: Date
  trial_start: Date | null
  trial_end: Date | null
  metadata: Record<string, string>
}) {
  const supabase = createServiceClient()

  const { error } = await (supabase.from('subscriptions') as any).upsert({
    id: subscription.id,
    user_id: subscription.user_id,
    status: subscription.status,
    price_id: subscription.price_id,
    quantity: subscription.quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at?.toISOString() || null,
    canceled_at: subscription.canceled_at?.toISOString() || null,
    current_period_start: subscription.current_period_start.toISOString(),
    current_period_end: subscription.current_period_end.toISOString(),
    trial_start: subscription.trial_start?.toISOString() || null,
    trial_end: subscription.trial_end?.toISOString() || null,
    metadata: subscription.metadata,
  })

  if (error) throw error
}

/**
 * Elimina una suscripción de la base de datos
 */
export async function deleteSubscription(subscriptionId: string) {
  const supabase = createServiceClient()

  const { error } = await (supabase
    .from('subscriptions') as any)
    .delete()
    .eq('id', subscriptionId)

  if (error) throw error
}

/**
 * Obtiene el customer_id de Stripe para un usuario
 */
export async function getCustomerId(userId: string): Promise<string | null> {
  const supabase = createServiceClient()

  const { data } = await (supabase
    .from('customers') as any)
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single() as { data: { stripe_customer_id: string } | null }

  return data?.stripe_customer_id || null
}
