// ===========================================
// OpoScore - useOnboarding Hook
// Gestiona el estado del onboarding
// ===========================================

'use client'

import { useState, useEffect } from 'react'

const ONBOARDING_KEY = 'oposcore_onboarding_completed'

interface OnboardingState {
  completedAt?: string
  oposicion?: string
  experiencia?: string
  horasDiarias?: string
}

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [onboardingData, setOnboardingData] = useState<OnboardingState | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(ONBOARDING_KEY)
    if (stored) {
      try {
        setOnboardingData(JSON.parse(stored))
        setShowOnboarding(false)
      } catch {
        setShowOnboarding(true)
      }
    } else {
      setShowOnboarding(true)
    }
    setIsLoading(false)
  }, [])

  const completeOnboarding = (data?: OnboardingState) => {
    const state: OnboardingState = {
      completedAt: new Date().toISOString(),
      ...data,
    }
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(state))
    setOnboardingData(state)
    setShowOnboarding(false)
  }

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY)
    setOnboardingData(null)
    setShowOnboarding(true)
  }

  return {
    showOnboarding,
    isLoading,
    onboardingData,
    completeOnboarding,
    resetOnboarding,
  }
}
