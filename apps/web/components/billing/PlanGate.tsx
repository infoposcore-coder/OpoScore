// ===========================================
// OpoMetrics - PlanGate Component
// ===========================================

'use client'

import { useFeatureAccess } from '@/hooks/useSubscription'
import { UpgradePrompt } from './UpgradePrompt'
import { FEATURE_NAMES } from '@/lib/stripe/config'

interface PlanGateProps {
  /** Feature requerida para acceder */
  feature: string
  /** Contenido a mostrar si tiene acceso */
  children: React.ReactNode
  /** Contenido alternativo si no tiene acceso (opcional) */
  fallback?: React.ReactNode
  /** Mostrar skeleton mientras carga */
  showLoading?: boolean
}

/**
 * Componente que protege contenido según el plan del usuario.
 * Si el usuario no tiene acceso, muestra un prompt de upgrade.
 *
 * @example
 * ```tsx
 * <PlanGate feature="simulacros">
 *   <SimulacrosContent />
 * </PlanGate>
 * ```
 */
export function PlanGate({
  feature,
  children,
  fallback,
  showLoading = true,
}: PlanGateProps) {
  const { hasAccess, isLoading, requiredPlan } = useFeatureAccess(feature)

  // Mostrar loading
  if (isLoading && showLoading) {
    return (
      <div className="animate-pulse space-y-4 p-6">
        <div className="h-8 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="h-32 bg-muted rounded" />
      </div>
    )
  }

  // Si tiene acceso, mostrar contenido
  if (hasAccess) {
    return <>{children}</>
  }

  // Si no tiene acceso, mostrar fallback o UpgradePrompt
  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <UpgradePrompt
      requiredPlan={requiredPlan}
      feature={feature}
      featureName={FEATURE_NAMES[feature] || feature}
    />
  )
}

/**
 * HOC para proteger páginas completas
 */
export function withPlanGate<P extends object>(
  Component: React.ComponentType<P>,
  feature: string
) {
  return function ProtectedComponent(props: P) {
    return (
      <PlanGate feature={feature}>
        <Component {...props} />
      </PlanGate>
    )
  }
}
