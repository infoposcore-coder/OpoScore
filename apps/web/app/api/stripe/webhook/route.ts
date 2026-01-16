// ===========================================
// OpoScore - Stripe Webhook Handler
// ===========================================

import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe/server'
import {
  upsertProduct,
  upsertPrice,
  upsertSubscription,
  deleteSubscription,
} from '@/lib/stripe/helpers'
import { createServiceClient } from '@/lib/supabase/server'

// Type extensions for Stripe types with fields that may vary by API version
interface StripeSubscriptionWithPeriod extends Stripe.Subscription {
  current_period_start: number
  current_period_end: number
  trial_start: number | null
  trial_end: number | null
}

interface StripeInvoiceWithSubscription extends Stripe.Invoice {
  subscription: string | null
}

// Importante: Usar nodejs runtime para webhooks (no edge)
export const runtime = 'nodejs'

// Desactivar body parser automático
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No stripe signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const error = err as Error
    // Error logged for debugging - consider using proper logging service in production
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      // ========== Checkout completado ==========
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        // Checkout completed - session.id available for tracking

        // La suscripción se creará automáticamente con customer.subscription.created
        // Aquí podemos hacer cosas adicionales como enviar email de bienvenida
        break
      }

      // ========== Suscripción creada/actualizada ==========
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as StripeSubscriptionWithPeriod
        // Subscription event processed

        // Obtener user_id desde metadata o customer
        let userId: string | undefined = subscription.metadata?.user_id

        if (!userId) {
          // Buscar por customer_id
          const supabase = createServiceClient()
          const { data: customer } = await supabase
            .from('customers')
            .select('user_id')
            .eq('stripe_customer_id', subscription.customer as string)
            .single() as { data: { user_id: string } | null }

          userId = customer?.user_id
        }

        if (!userId) {
          // Warning: No user_id found for subscription - skipping
          break
        }

        await upsertSubscription({
          id: subscription.id,
          user_id: userId,
          status: subscription.status,
          price_id: subscription.items.data[0].price.id,
          quantity: subscription.items.data[0].quantity || 1,
          cancel_at_period_end: subscription.cancel_at_period_end,
          cancel_at: subscription.cancel_at
            ? new Date(subscription.cancel_at * 1000)
            : null,
          canceled_at: subscription.canceled_at
            ? new Date(subscription.canceled_at * 1000)
            : null,
          current_period_start: new Date(
            subscription.current_period_start * 1000
          ),
          current_period_end: new Date(subscription.current_period_end * 1000),
          trial_start: subscription.trial_start
            ? new Date(subscription.trial_start * 1000)
            : null,
          trial_end: subscription.trial_end
            ? new Date(subscription.trial_end * 1000)
            : null,
          metadata: subscription.metadata as Record<string, string>,
        })
        break
      }

      // ========== Suscripción eliminada ==========
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        // Subscription deletion processed

        // En lugar de eliminar, actualizamos el status a 'canceled'
        const supabase = createServiceClient()
        await (supabase
          .from('subscriptions') as any)
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
          })
          .eq('id', subscription.id)
        break
      }

      // ========== Pago fallido ==========
      case 'invoice.payment_failed': {
        const invoice = event.data.object as StripeInvoiceWithSubscription
        // Payment failure recorded

        // Actualizar estado de suscripción a past_due
        if (invoice.subscription) {
          const supabase = createServiceClient()
          await (supabase
            .from('subscriptions') as any)
            .update({ status: 'past_due' })
            .eq('id', invoice.subscription as string)
        }

        // TODO: Enviar email de notificación al usuario
        break
      }

      // ========== Pago exitoso ==========
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as StripeInvoiceWithSubscription
        // Payment success recorded

        // Actualizar periodo de suscripción
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          ) as unknown as StripeSubscriptionWithPeriod

          const supabase = createServiceClient()
          await (supabase
            .from('subscriptions') as any)
            .update({
              status: 'active',
              current_period_start: new Date(
                subscription.current_period_start * 1000
              ).toISOString(),
              current_period_end: new Date(
                subscription.current_period_end * 1000
              ).toISOString(),
            })
            .eq('id', subscription.id)
        }
        break
      }

      // ========== Producto creado/actualizado ==========
      case 'product.created':
      case 'product.updated': {
        const product = event.data.object as Stripe.Product
        // Product sync completed

        await upsertProduct({
          id: product.id,
          active: product.active,
          name: product.name,
          description: product.description,
          image: product.images?.[0] || null,
          metadata: product.metadata as Record<string, string>,
        })
        break
      }

      // ========== Precio creado/actualizado ==========
      case 'price.created':
      case 'price.updated': {
        const price = event.data.object as Stripe.Price
        // Price sync completed

        await upsertPrice({
          id: price.id,
          product_id: price.product as string,
          active: price.active,
          currency: price.currency,
          unit_amount: price.unit_amount,
          type: price.type,
          interval: price.recurring?.interval || null,
          interval_count: price.recurring?.interval_count || null,
          trial_period_days: price.recurring?.trial_period_days || null,
          metadata: price.metadata as Record<string, string>,
        })
        break
      }

      default:
        // Unhandled webhook event type received
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    // Webhook handler error - consider logging to monitoring service
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
