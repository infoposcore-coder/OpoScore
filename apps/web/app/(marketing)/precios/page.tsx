// ===========================================
// OpoScore - Pagina de Precios con Stripe
// ===========================================

'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import Link from 'next/link'
import { useCheckout, useSubscription } from '@/hooks/useSubscription'
import { TRIAL_DAYS } from '@/lib/stripe/config'

// IDs de precios de Stripe (configurar en .env)
const PRICE_IDS = {
  premium: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTHLY || '',
    yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_YEARLY || '',
  },
  elite: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE_MONTHLY || '',
    yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE_YEARLY || '',
  },
}

const planes = [
  {
    id: 'gratuito' as const,
    nombre: 'Gratuito',
    descripcion: 'Perfecto para empezar',
    precioMensual: 0,
    precioAnual: 0,
    features: [
      { texto: '50 preguntas/mes', incluido: true },
      { texto: '1 test diario', incluido: true },
      { texto: 'Flashcards básicas', incluido: true },
      { texto: 'OpoScore básico', incluido: true },
      { texto: 'Tests ilimitados', incluido: false },
      { texto: 'Simulacros oficiales', incluido: false },
      { texto: 'Tutor IA 24/7', incluido: false },
      { texto: 'Estadísticas avanzadas', incluido: false },
    ],
    cta: 'Empezar gratis',
    destacado: false,
  },
  {
    id: 'premium' as const,
    nombre: 'Premium',
    descripcion: 'Para opositores serios',
    precioMensual: 14.99,
    precioAnual: 9.99,
    features: [
      { texto: 'Preguntas ilimitadas', incluido: true },
      { texto: 'Tests ilimitados', incluido: true },
      { texto: 'Simulacros oficiales', incluido: true },
      { texto: 'Tutor IA 24/7', incluido: true },
      { texto: 'Flashcards con IA', incluido: true },
      { texto: 'Estadísticas detalladas', incluido: true },
      { texto: 'Sin anuncios', incluido: true },
      { texto: 'Soporte prioritario', incluido: false },
    ],
    cta: 'Empezar prueba gratis',
    destacado: true,
    badge: 'Más popular',
  },
  {
    id: 'elite' as const,
    nombre: 'Elite',
    descripcion: 'Preparación total',
    precioMensual: 29.99,
    precioAnual: 19.99,
    features: [
      { texto: 'Todo de Premium', incluido: true },
      { texto: 'Soporte 24/7 prioritario', incluido: true },
      { texto: 'Sesiones 1:1 mensuales', incluido: true },
      { texto: 'Plan de estudio personalizado', incluido: true },
      { texto: 'Análisis de debilidades', incluido: true },
      { texto: 'Acceso anticipado a features', incluido: true },
      { texto: 'Comunidad privada de élite', incluido: true },
      { texto: 'Garantía de aprobado', incluido: true },
    ],
    cta: 'Empezar prueba gratis',
    destacado: false,
    badge: 'Máximo nivel',
  },
]

// Componente interno que usa useSearchParams
function PreciosContent() {
  const [anual, setAnual] = useState(true)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const { checkout } = useCheckout()
  const { isPremium, isElite } = useSubscription()

  // Obtener parametros de URL
  const upgradeRequired = searchParams.get('upgrade')
  const checkoutResult = searchParams.get('checkout')

  const handleSubscribe = async (planId: 'premium' | 'elite') => {
    try {
      setLoadingPlan(planId)
      const priceId = anual ? PRICE_IDS[planId].yearly : PRICE_IDS[planId].monthly

      if (!priceId) {
        alert('Error: Los precios de Stripe no están configurados. Contacta con soporte.')
        return
      }

      await checkout(priceId)
    } catch (error) {
      console.error('Error al suscribirse:', error)
      alert('Error al procesar el pago. Por favor, inténtalo de nuevo.')
    } finally {
      setLoadingPlan(null)
    }
  }

  const getPlanButton = (plan: typeof planes[0]) => {
    // Si es el plan gratuito
    if (plan.id === 'gratuito') {
      return (
        <Link href="/register">
          <Button className="w-full" variant="outline" size="lg">
            {plan.cta}
          </Button>
        </Link>
      )
    }

    // Si ya tiene este plan o superior
    const hasThisPlan = (plan.id === 'premium' && isPremium) || (plan.id === 'elite' && isElite)
    const hasBetterPlan = plan.id === 'premium' && isElite

    if (hasThisPlan) {
      return (
        <Button className="w-full" variant="outline" size="lg" disabled>
          Plan actual
        </Button>
      )
    }

    if (hasBetterPlan) {
      return (
        <Button className="w-full" variant="outline" size="lg" disabled>
          Ya tienes Elite
        </Button>
      )
    }

    // Boton de suscripcion
    return (
      <Button
        className="w-full"
        variant={plan.destacado ? 'default' : 'outline'}
        size="lg"
        onClick={() => handleSubscribe(plan.id as 'premium' | 'elite')}
        disabled={loadingPlan !== null}
      >
        {loadingPlan === plan.id ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Procesando...
          </span>
        ) : (
          plan.cta
        )}
      </Button>
    )
  }

  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Notificacion de checkout */}
        {checkoutResult === 'success' && (
          <motion.div
            className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-green-800 font-medium">
              ¡Bienvenido a Premium! Tu suscripción se ha activado correctamente.
            </p>
          </motion.div>
        )}

        {checkoutResult === 'canceled' && (
          <motion.div
            className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-yellow-800 font-medium">
              El proceso de pago fue cancelado. Puedes intentarlo de nuevo cuando quieras.
            </p>
          </motion.div>
        )}

        {upgradeRequired && (
          <motion.div
            className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-lg text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-primary font-medium">
              Esta funcionalidad requiere el plan {upgradeRequired === 'premium' ? 'Premium' : 'Elite'}.
              Elige tu plan para desbloquearla.
            </p>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge variant="secondary" className="mb-4">Precios transparentes</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Elige tu plan de preparación
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Invierte en tu futuro. Todos los planes de pago incluyen {TRIAL_DAYS} días de prueba gratuita.
          </p>

          {/* Toggle anual/mensual */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={!anual ? 'font-medium' : 'text-muted-foreground'}>Mensual</span>
            <Switch checked={anual} onCheckedChange={setAnual} />
            <span className={anual ? 'font-medium' : 'text-muted-foreground'}>
              Anual
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                -33%
              </Badge>
            </span>
          </div>
        </motion.div>

        {/* Planes */}
        <div className="grid gap-8 md:grid-cols-3">
          {planes.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative h-full flex flex-col ${
                plan.destacado
                  ? 'border-primary shadow-lg scale-105 z-10'
                  : ''
              }`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">{plan.nombre}</CardTitle>
                  <CardDescription>{plan.descripcion}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {/* Precio */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">
                        {anual ? plan.precioAnual : plan.precioMensual}€
                      </span>
                      <span className="text-muted-foreground">/mes</span>
                    </div>
                    {anual && plan.precioAnual > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Facturado anualmente ({(plan.precioAnual * 12).toFixed(0)}€/año)
                      </p>
                    )}
                    {plan.precioMensual > 0 && (
                      <p className="text-xs text-primary mt-2">
                        {TRIAL_DAYS} días de prueba gratis
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {feature.incluido ? (
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span className={feature.incluido ? '' : 'text-muted-foreground/50'}>
                          {feature.texto}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {getPlanButton(plan)}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Metodos de pago */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm text-muted-foreground mb-3">Métodos de pago seguros</p>
          <div className="flex items-center justify-center gap-4 opacity-60">
            <svg className="h-8" viewBox="0 0 50 32" fill="currentColor">
              <path d="M20.4 10.3h-3.6l2.3 14h3.6l-2.3-14zm14.9 0l-3.4 9.6-.4-1.9-1.2-5.9c-.2-.9-.8-1.7-1.8-1.8H24l-.1.3c1.5.4 2.8.9 3.9 1.5l3.3 12.4h3.8l5.7-14.2h-3.8zm-7.4 14h-3.5l2.1-14h3.5l-2.1 14z"/>
            </svg>
            <svg className="h-8" viewBox="0 0 50 32" fill="currentColor">
              <path d="M35 16.3c0 4.8-3.9 8.7-8.7 8.7s-8.7-3.9-8.7-8.7 3.9-8.7 8.7-8.7 8.7 3.9 8.7 8.7z"/>
              <path d="M23.7 16.3c0 4.8-3.9 8.7-8.7 8.7S6.3 21.1 6.3 16.3s3.9-8.7 8.7-8.7 8.7 3.9 8.7 8.7z" opacity=".65"/>
            </svg>
            <span className="text-sm">Stripe Secure</span>
          </div>
        </motion.div>

        {/* FAQ Pricing */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Preguntas frecuentes</h2>
          <div className="grid gap-6 md:grid-cols-2 text-left max-w-4xl mx-auto">
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">¿Puedo cancelar en cualquier momento?</h3>
              <p className="text-sm text-muted-foreground">
                Sí, puedes cancelar tu suscripción en cualquier momento desde tu perfil. No hay contratos ni permanencias.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">¿Qué métodos de pago aceptáis?</h3>
              <p className="text-sm text-muted-foreground">
                Aceptamos todas las tarjetas de crédito y débito principales (Visa, Mastercard, Amex) a través de Stripe.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">¿Cómo funciona la prueba gratuita?</h3>
              <p className="text-sm text-muted-foreground">
                Tienes {TRIAL_DAYS} días para probar todas las funcionalidades Premium. No se te cobrará hasta que termine el periodo de prueba.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">¿Puedo cambiar de plan?</h3>
              <p className="text-sm text-muted-foreground">
                Puedes actualizar o degradar tu plan en cualquier momento desde el portal de facturación.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Garantia */}
        <motion.div
          className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-4xl mb-4">🛡️</div>
          <h3 className="text-xl font-bold mb-2">Garantía de devolución de 7 días</h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Si no estás satisfecho con OpoScore, te devolvemos el 100% de tu dinero durante los primeros 7 días. Sin preguntas.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

// Loading fallback para Suspense
function PreciosLoading() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-6 w-32 bg-muted rounded mx-auto mb-4 animate-pulse" />
          <div className="h-12 w-96 bg-muted rounded mx-auto mb-4 animate-pulse" />
          <div className="h-6 w-64 bg-muted rounded mx-auto animate-pulse" />
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}

// Componente principal con Suspense
export default function PreciosPage() {
  return (
    <Suspense fallback={<PreciosLoading />}>
      <PreciosContent />
    </Suspense>
  )
}
