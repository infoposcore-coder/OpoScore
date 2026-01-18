// ===========================================
// OpoMetrics - Stripe Types
// ===========================================

import type { PlanType } from '@/lib/stripe/config'

export interface SubscriptionData {
  planType: PlanType
  plan: PlanType // Alias for planType for convenience
  status: string
  currentPeriodEnd: Date | null
  cancelAtPeriodEnd: boolean
  isActive: boolean
  isTrial: boolean
}

export interface CheckoutRequest {
  priceId: string
}

export interface CheckoutResponse {
  url: string
}

export interface PortalResponse {
  url: string
}

export interface SubscriptionResponse {
  subscription: SubscriptionData | null
}

// Stripe webhook event types we handle
export type StripeWebhookEvent =
  | 'checkout.session.completed'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'invoice.payment_succeeded'
  | 'invoice.payment_failed'
  | 'customer.created'
  | 'customer.updated'
  | 'product.created'
  | 'product.updated'
  | 'price.created'
  | 'price.updated'
