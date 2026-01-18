// ===========================================
// OpoMetrics - useSubscription Hook (4 planes)
// ===========================================

'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { PLAN_FEATURES, type PlanType } from '@/lib/stripe/config'
import type { SubscriptionData } from '@/types/stripe'

interface UseSubscriptionReturn {
  subscription: SubscriptionData | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
  plan: PlanType
  isBasico: boolean
  isPro: boolean
  isElite: boolean
  isPaid: boolean
  canAccess: (feature: string) => boolean
}

export function useSubscription(): UseSubscriptionReturn {
  const supabase = createClient()

  const {
    data: subscription,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['subscription'],
    queryFn: async (): Promise<SubscriptionData | null> => {
      // Obtener usuario actual
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return null

      // Llamar a la función RPC de Supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.rpc as any)('get_user_plan', {
        p_user_id: user.id,
      })

      if (error) {
        console.error('Error fetching subscription:', error)
        // Si hay error, asumir plan gratuito
        return {
          planType: 'free',
          plan: 'free',
          status: 'free',
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
          isActive: true,
          isTrial: false,
        }
      }

      const plan = data?.[0] || {
        plan_type: 'free',
        status: 'free',
        current_period_end: null,
        cancel_at_period_end: false,
      }

      return {
        planType: plan.plan_type as PlanType,
        plan: plan.plan_type as PlanType,
        status: plan.status,
        currentPeriodEnd: plan.current_period_end
          ? new Date(plan.current_period_end)
          : null,
        cancelAtPeriodEnd: plan.cancel_at_period_end,
        isActive: ['active', 'trialing', 'free'].includes(plan.status),
        isTrial: plan.status === 'trialing',
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true,
  })

  // Helpers derivados
  const planType = subscription?.planType || 'free'
  const isBasico = planType === 'basico' || planType === 'pro' || planType === 'elite'
  const isPro = planType === 'pro' || planType === 'elite'
  const isElite = planType === 'elite'
  const isPaid = planType !== 'free'

  const canAccess = (feature: string): boolean => {
    return PLAN_FEATURES[planType]?.includes(feature) ?? false
  }

  return {
    subscription: subscription ?? null,
    isLoading,
    error: error as Error | null,
    refetch,
    plan: planType,
    isBasico,
    isPro,
    isElite,
    isPaid,
    canAccess,
  }
}

/**
 * Hook simplificado para verificar acceso a una feature específica
 */
export function useFeatureAccess(feature: string): {
  hasAccess: boolean
  isLoading: boolean
  requiredPlan: PlanType
} {
  const { canAccess, isLoading } = useSubscription()

  // Determinar qué plan requiere esta feature
  const getRequiredPlan = (): PlanType => {
    if (PLAN_FEATURES.free.includes(feature)) return 'free'
    if (PLAN_FEATURES.basico.includes(feature)) return 'basico'
    if (PLAN_FEATURES.pro.includes(feature)) return 'pro'
    if (PLAN_FEATURES.elite.includes(feature)) return 'elite'
    return 'free'
  }

  return {
    hasAccess: canAccess(feature),
    isLoading,
    requiredPlan: getRequiredPlan(),
  }
}

/**
 * Hook para manejar el checkout
 */
export function useCheckout() {
  const checkout = async (priceId: string): Promise<void> => {
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al iniciar checkout')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Checkout error:', error)
      throw error
    }
  }

  return { checkout }
}

/**
 * Hook para acceder al portal de facturación
 */
export function useBillingPortal() {
  const openPortal = async (): Promise<void> => {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al acceder al portal')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Portal error:', error)
      throw error
    }
  }

  return { openPortal }
}

// Mantener compatibilidad con código antiguo que usa isPremium
export function useLegacySubscription() {
  const sub = useSubscription()
  return {
    ...sub,
    isPremium: sub.isPro, // Mapear isPremium a isPro para compatibilidad
  }
}
