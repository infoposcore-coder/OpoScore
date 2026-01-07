// ===========================================
// OpoScore - Dashboard Content Wrapper
// Maneja el onboarding y contenido del dashboard
// ===========================================

'use client'

import { useOnboarding } from '@/hooks/useOnboarding'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'

interface DashboardContentProps {
  children: React.ReactNode
}

export function DashboardContent({ children }: DashboardContentProps) {
  const { showOnboarding, isLoading, completeOnboarding } = useOnboarding()

  // Activar atajos de teclado
  useKeyboardShortcuts({ enabled: !showOnboarding })

  // No mostrar nada mientras carga para evitar flash
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      {showOnboarding && (
        <OnboardingFlow
          onComplete={(data) => {
            console.log('Onboarding completado:', data)
            completeOnboarding(data)
          }}
          onSkip={() => completeOnboarding()}
        />
      )}
      {children}
    </>
  )
}
