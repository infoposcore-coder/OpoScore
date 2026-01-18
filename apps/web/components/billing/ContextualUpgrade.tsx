// ===========================================
// OpoMetrics - Contextual Upgrade Prompts
// Muestra prompts de upgrade en contextos específicos
// ===========================================

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useSubscription } from '@/hooks/useSubscription'

interface ContextualUpgradeProps {
  /** Contexto donde se muestra el prompt */
  context: 'tests_limit' | 'simulacro_locked' | 'tutor_limit' | 'flashcards_limit' | 'stats_locked'
  /** Mensaje personalizado */
  message?: string
  /** Cerrar automáticamente después de X segundos */
  autoClose?: number
  /** Callback al cerrar */
  onClose?: () => void
}

const CONTEXT_CONFIG = {
  tests_limit: {
    icon: '📝',
    title: 'Has alcanzado el límite de tests',
    description: 'Con Premium tienes tests ilimitados para practicar sin restricciones.',
    cta: 'Desbloquear tests ilimitados',
  },
  simulacro_locked: {
    icon: '⏱️',
    title: 'Simulacros disponibles en Premium',
    description: 'Practica en condiciones reales de examen con tiempo cronometrado.',
    cta: 'Acceder a simulacros',
  },
  tutor_limit: {
    icon: '🤖',
    title: 'Has alcanzado el límite del Tutor IA',
    description: 'Los usuarios Premium tienen acceso ilimitado al tutor 24/7.',
    cta: 'Tutor IA ilimitado',
  },
  flashcards_limit: {
    icon: '🧠',
    title: 'Flashcards avanzadas en Premium',
    description: 'Genera flashcards con IA y accede a estadísticas detalladas.',
    cta: 'Mejorar flashcards',
  },
  stats_locked: {
    icon: '📊',
    title: 'Estadísticas avanzadas',
    description: 'Analiza tu progreso con gráficos detallados y predicciones.',
    cta: 'Ver estadísticas avanzadas',
  },
}

export function ContextualUpgrade({
  context,
  message,
  autoClose,
  onClose,
}: ContextualUpgradeProps) {
  const [visible, setVisible] = useState(true)
  const { isPro } = useSubscription()

  useEffect(() => {
    if (autoClose && autoClose > 0) {
      const timer = setTimeout(() => {
        setVisible(false)
        onClose?.()
      }, autoClose * 1000)
      return () => clearTimeout(timer)
    }
  }, [autoClose, onClose])

  // No mostrar si ya es pro o superior
  if (isPro || !visible) {
    return null
  }

  const config = CONTEXT_CONFIG[context]

  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
      <CardContent className="py-4">
        <div className="flex items-start gap-4">
          <div className="text-3xl flex-shrink-0">{config.icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm">{config.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {message || config.description}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link href={`/precios?context=${context}`}>
              <Button size="sm">{config.cta}</Button>
            </Link>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setVisible(false)
                  onClose()
                }}
              >
                Ahora no
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Hook para mostrar upgrade prompts de forma programática
 */
export function useUpgradePrompt() {
  const [promptContext, setPromptContext] = useState<ContextualUpgradeProps['context'] | null>(null)
  const { isPro, canAccess } = useSubscription()

  const showUpgrade = (context: ContextualUpgradeProps['context']) => {
    if (!isPro) {
      setPromptContext(context)
    }
  }

  const hideUpgrade = () => {
    setPromptContext(null)
  }

  const checkAndPrompt = (feature: string, context: ContextualUpgradeProps['context']) => {
    if (!canAccess(feature)) {
      showUpgrade(context)
      return false
    }
    return true
  }

  return {
    promptContext,
    showUpgrade,
    hideUpgrade,
    checkAndPrompt,
    UpgradePromptComponent: promptContext ? (
      <ContextualUpgrade
        context={promptContext}
        onClose={hideUpgrade}
        autoClose={10}
      />
    ) : null,
  }
}
