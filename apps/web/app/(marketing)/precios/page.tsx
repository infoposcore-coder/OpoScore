// ===========================================
// OpoScore - Página de Precios con 4 Planes
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
  basico: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASICO_MONTHLY || '',
    yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASICO_YEARLY || '',
  },
  pro: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || '',
    yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || '',
  },
  elite: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE_MONTHLY || '',
    yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE_YEARLY || '',
  },
}

const planes = [
  {
    id: 'free' as const,
    nombre: 'Free',
    descripcion: 'Para empezar a explorar',
    precioMensual: 0,
    precioAnual: 0,
    features: [
      { texto: '25 preguntas/mes', incluido: true },
      { texto: '1 test diario', incluido: true },
      { texto: 'OpoScore básico', incluido: true },
      { texto: 'Acceso a 1 oposición', incluido: true },
      { texto: 'Estadísticas básicas', incluido: true },
      { texto: 'Ranking y tendencias', incluido: false },
      { texto: 'Predicción de aprobado', incluido: false },
      { texto: 'Análisis avanzado IA', incluido: false },
    ],
    mlFeatures: ['% de aciertos', 'Tests completados', 'Racha de estudio'],
    cta: 'Empezar gratis',
    destacado: false,
  },
  {
    id: 'basico' as const,
    nombre: 'Básico',
    descripcion: 'Analíticas inteligentes',
    precioMensual: 9.99,
    precioAnual: 6.99,
    features: [
      { texto: '200 preguntas/mes', incluido: true },
      { texto: '5 tests diarios', incluido: true },
      { texto: 'Acceso a 3 oposiciones', incluido: true },
      { texto: 'Flashcards básicas', incluido: true },
      { texto: 'Ranking entre opositores', incluido: true },
      { texto: 'Análisis de tendencias', incluido: true },
      { texto: 'Percentiles y proyecciones', incluido: true },
      { texto: 'Predicción ML', incluido: false },
    ],
    mlFeatures: ['Ranking global', 'Media móvil 7/30 días', 'Proyección de progreso', 'Percentiles'],
    cta: 'Empezar prueba gratis',
    destacado: false,
  },
  {
    id: 'pro' as const,
    nombre: 'Pro',
    descripcion: 'Predicciones con ML',
    precioMensual: 19.99,
    precioAnual: 14.99,
    features: [
      { texto: 'Preguntas ilimitadas', incluido: true },
      { texto: 'TODAS las oposiciones', incluido: true },
      { texto: 'Simulacros cronometrados', incluido: true },
      { texto: 'Tutor IA 24/7', incluido: true },
      { texto: 'Predicción de aprobado (ML)', incluido: true },
      { texto: 'Análisis por bloques', incluido: true },
      { texto: 'Recomendaciones IA', incluido: true },
      { texto: 'Sin anuncios', incluido: true },
    ],
    mlFeatures: ['Regresión Lineal', 'Regresión Logística', 'Intervalo de confianza', 'Análisis de factores', 'Recomendaciones personalizadas'],
    cta: 'Empezar prueba gratis',
    destacado: true,
    badge: 'Más popular',
  },
  {
    id: 'elite' as const,
    nombre: 'Elite',
    descripcion: 'IA de última generación',
    precioMensual: 39.99,
    precioAnual: 29.99,
    features: [
      { texto: 'Todo de Pro', incluido: true },
      { texto: 'Random Forest + XGBoost', incluido: true },
      { texto: 'Comparativa vacantes', incluido: true },
      { texto: 'Análisis de competidores', incluido: true },
      { texto: 'Escenarios predictivos', incluido: true },
      { texto: 'Sesiones 1:1 mensuales', incluido: true },
      { texto: 'Comunidad privada', incluido: true },
      { texto: 'Garantía de aprobado', incluido: true },
    ],
    mlFeatures: ['Random Forest', 'Gradient Boosting (XGBoost)', 'Ensemble de modelos', 'Análisis de escenarios', 'Comparativa plazas vs competidores', 'Predicción de preguntas'],
    cta: 'Empezar prueba gratis',
    destacado: false,
    badge: 'IA Avanzada',
  },
]

// Componente interno que usa useSearchParams
function PreciosContent() {
  const [anual, setAnual] = useState(true)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const { checkout } = useCheckout()
  const { subscription } = useSubscription()

  // Obtener parámetros de URL
  const upgradeRequired = searchParams.get('upgrade')
  const checkoutResult = searchParams.get('checkout')

  // Verificar plan actual del usuario
  const currentPlan = subscription?.plan || 'free'

  const handleSubscribe = async (planId: 'basico' | 'pro' | 'elite') => {
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
    if (plan.id === 'free') {
      return (
        <Link href="/register" className="w-full">
          <Button className="w-full" variant="outline" size="lg">
            {plan.cta}
          </Button>
        </Link>
      )
    }

    // Si ya tiene este plan
    if (currentPlan === plan.id) {
      return (
        <Button className="w-full" variant="outline" size="lg" disabled>
          Plan actual
        </Button>
      )
    }

    // Si tiene un plan superior
    const planOrder = ['free', 'basico', 'pro', 'elite']
    const currentIndex = planOrder.indexOf(currentPlan)
    const planIndex = planOrder.indexOf(plan.id)
    
    if (currentIndex > planIndex) {
      return (
        <Button className="w-full" variant="outline" size="lg" disabled>
          Ya tienes un plan superior
        </Button>
      )
    }

    // Botón de suscripción
    return (
      <Button
        className="w-full"
        variant={plan.destacado ? 'default' : 'outline'}
        size="lg"
        onClick={() => handleSubscribe(plan.id as 'basico' | 'pro' | 'elite')}
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
      <div className="max-w-7xl mx-auto">
        {/* Notificación de checkout */}
        {checkoutResult === 'success' && (
          <motion.div
            className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-green-800 font-medium">
              ¡Bienvenido! Tu suscripción se ha activado correctamente.
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
              Esta funcionalidad requiere el plan {upgradeRequired}.
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
                -30%
              </Badge>
            </span>
          </div>
        </motion.div>

        {/* Planes */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                    <Badge className={plan.destacado ? 'bg-primary text-primary-foreground' : 'bg-secondary'}>
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
                  <ul className="space-y-2 mb-4 flex-1 text-sm">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {feature.incluido ? (
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span className={feature.incluido ? '' : 'text-muted-foreground/50'}>
                          {feature.texto}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* ML Features Badge */}
                  {'mlFeatures' in plan && plan.mlFeatures && (
                    <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
                      <p className="text-xs font-medium text-primary mb-2 flex items-center gap-1">
                        <span>🧠</span> Analíticas ML incluidas:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {plan.mlFeatures.slice(0, 4).map((ml, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {ml}
                          </Badge>
                        ))}
                        {plan.mlFeatures.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{plan.mlFeatures.length - 4} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  {getPlanButton(plan)}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Comparativa de Analíticas ML */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">Comparativa de Inteligencia Artificial</Badge>
            <h2 className="text-2xl font-bold">Analíticas y Machine Learning por plan</h2>
            <p className="text-muted-foreground mt-2">Cuanto más avanzado el plan, más precisas las predicciones</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Analítica</th>
                  <th className="text-center py-3 px-4">Free</th>
                  <th className="text-center py-3 px-4">Básico</th>
                  <th className="text-center py-3 px-4 bg-primary/5">Pro</th>
                  <th className="text-center py-3 px-4">Elite</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b bg-muted/30">
                  <td className="py-3 px-4 font-medium" colSpan={5}>📊 Estadísticas Básicas</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">% de aciertos y tests</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                  <td className="text-center py-3 px-4 bg-primary/5 text-green-500">✓</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Racha de estudio</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                  <td className="text-center py-3 px-4 bg-primary/5 text-green-500">✓</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                </tr>
                <tr className="border-b bg-muted/30">
                  <td className="py-3 px-4 font-medium" colSpan={5}>📈 Ranking y Tendencias</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Ranking entre opositores</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                  <td className="text-center py-3 px-4 bg-primary/5 text-green-500">✓</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Media móvil 7/30 días</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                  <td className="text-center py-3 px-4 bg-primary/5 text-green-500">✓</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Percentiles y proyecciones</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                  <td className="text-center py-3 px-4 bg-primary/5 text-green-500">✓</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                </tr>
                <tr className="border-b bg-muted/30">
                  <td className="py-3 px-4 font-medium" colSpan={5}>🧠 Machine Learning</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Regresión Lineal</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 bg-primary/5 text-green-500">✓</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Regresión Logística</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 bg-primary/5 text-green-500">✓</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Probabilidad de aprobado</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 bg-primary/5 text-green-500">✓</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Intervalo de confianza</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 bg-primary/5 text-green-500">✓</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                </tr>
                <tr className="border-b bg-muted/30">
                  <td className="py-3 px-4 font-medium" colSpan={5}>🚀 IA Avanzada (Elite)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Random Forest</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 bg-primary/5 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Gradient Boosting (XGBoost)</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 bg-primary/5 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Ensemble de modelos</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 bg-primary/5 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Análisis de escenarios</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 bg-primary/5 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Comparativa vacantes vs competidores</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 bg-primary/5 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Predicción de preguntas probables</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 bg-primary/5 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Comparativa general */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          <h3 className="text-xl font-bold text-center mb-6">Comparativa general</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Característica</th>
                  <th className="text-center py-3 px-4">Free</th>
                  <th className="text-center py-3 px-4">Básico</th>
                  <th className="text-center py-3 px-4 bg-primary/5">Pro</th>
                  <th className="text-center py-3 px-4">Elite</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Preguntas</td>
                  <td className="text-center py-3 px-4">25/mes</td>
                  <td className="text-center py-3 px-4">200/mes</td>
                  <td className="text-center py-3 px-4 bg-primary/5 font-medium">Ilimitadas</td>
                  <td className="text-center py-3 px-4">Ilimitadas</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Oposiciones</td>
                  <td className="text-center py-3 px-4">1</td>
                  <td className="text-center py-3 px-4">3</td>
                  <td className="text-center py-3 px-4 bg-primary/5 font-medium">Todas</td>
                  <td className="text-center py-3 px-4">Todas</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Simulacros cronometrados</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 bg-primary/5 text-green-500">✓</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Tutor IA 24/7</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 bg-primary/5 text-green-500">✓</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Sesiones 1:1 mensuales</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 bg-primary/5 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Garantía de aprobado</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 bg-primary/5 text-muted-foreground">-</td>
                  <td className="text-center py-3 px-4 text-green-500">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Métodos de pago */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
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
          transition={{ delay: 0.7 }}
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
              <h3 className="font-medium mb-2">¿Puedo cambiar de plan?</h3>
              <p className="text-sm text-muted-foreground">
                Sí, puedes subir o bajar de plan en cualquier momento. El cambio se aplica inmediatamente.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">¿Cómo funciona la prueba gratuita?</h3>
              <p className="text-sm text-muted-foreground">
                Tienes {TRIAL_DAYS} días para probar todas las funcionalidades. No se te cobrará hasta que termine.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">¿Qué es la garantía de aprobado?</h3>
              <p className="text-sm text-muted-foreground">
                Si no apruebas tu oposición con el plan Elite, te devolvemos el 100% o extendemos tu suscripción gratis.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Garantía */}
        <motion.div
          className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
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
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-6 w-32 bg-muted rounded mx-auto mb-4 animate-pulse" />
          <div className="h-12 w-96 bg-muted rounded mx-auto mb-4 animate-pulse" />
          <div className="h-6 w-64 bg-muted rounded mx-auto animate-pulse" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[500px] bg-muted rounded-lg animate-pulse" />
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
