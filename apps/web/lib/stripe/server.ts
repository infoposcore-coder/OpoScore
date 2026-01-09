// ===========================================
// OpoScore - Stripe Server Client
// ===========================================

import Stripe from 'stripe'

// Lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      // @ts-expect-error - Using stable API version
      apiVersion: '2023-10-16',
      typescript: true,
      appInfo: {
        name: 'OpoScore',
        version: '1.0.0',
      },
    })
  }
  return stripeInstance
}

// For backwards compatibility - getter that lazily initializes
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return getStripe()[prop as keyof Stripe]
  },
})
