// ===========================================
// OpoScore - UpgradePrompt Component
// ===========================================

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PLANS, type PlanType } from '@/lib/stripe/config'

interface UpgradePromptProps {
  /** Plan requerido para acceder */
  requiredPlan: PlanType
  /** Nombre de la feature (opcional) */
  feature?: string
  /** Nombre legible de la feature */
  featureName?: string
  /** Variante del componente */
  variant?: 'full' | 'compact' | 'inline'
}

/**
 * Componente que muestra un prompt para actualizar el plan.
 */
export function UpgradePrompt({
  requiredPlan,
  feature,
  featureName,
  variant = 'full',
}: UpgradePromptProps) {
  const plan = PLANS[requiredPlan]

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex-1">
          <p className="text-sm font-medium">
            {featureName || 'Esta funcionalidad'} requiere{' '}
            <Badge variant="secondary" className="ml-1">
              {plan.name}
            </Badge>
          </p>
        </div>
        <Link href={`/precios?upgrade=${requiredPlan}&feature=${feature || ''}`}>
          <Button size="sm">Actualizar</Button>
        </Link>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">
            Funcionalidad {plan.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {featureName || 'Esta funcionalidad'} está disponible en el plan{' '}
            {plan.name}.
          </p>
          <Link href={`/precios?upgrade=${requiredPlan}&feature=${feature || ''}`}>
            <Button>Ver planes</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  // Variante full (default)
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="max-w-md w-full border-primary/20">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <Badge className="mx-auto mb-2" variant="secondary">
            Plan {plan.name}
          </Badge>
          <CardTitle className="text-xl">
            Desbloquea {featureName || 'esta funcionalidad'}
          </CardTitle>
          <CardDescription className="text-base">
            Para acceder a {featureName || 'esta funcionalidad'}, necesitas el
            plan {plan.name}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm font-medium mb-2">
              Con {plan.name} obtienes:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {plan.features.slice(0, 4).map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {plan.price}€
              <span className="text-sm font-normal text-muted-foreground">
                /mes
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              7 días de prueba gratis
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href={`/precios?upgrade=${requiredPlan}&feature=${feature || ''}`}
            >
              <Button className="w-full" size="lg">
                Actualizar a {plan.name}
              </Button>
            </Link>
            <Link href="/precios">
              <Button variant="ghost" className="w-full">
                Ver todos los planes
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Banner de upgrade más sutil para mostrar en headers/sidebars
 */
export function UpgradeBanner() {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">Pasa a Premium</p>
          <p className="text-xs text-muted-foreground truncate">
            Desbloquea todas las funcionalidades
          </p>
        </div>
        <Link href="/precios">
          <Button size="sm" variant="outline">
            Ver
          </Button>
        </Link>
      </div>
    </div>
  )
}
