// ===========================================
// OpoScore - Pagina de Precios Premium
// ===========================================

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import Link from 'next/link'

const planes = [
  {
    id: 'gratuito',
    nombre: 'Gratuito',
    descripcion: 'Perfecto para empezar',
    precioMensual: 0,
    precioAnual: 0,
    features: [
      { texto: '50 preguntas/mes', incluido: true },
      { texto: '1 test diario', incluido: true },
      { texto: 'Flashcards basicas', incluido: true },
      { texto: 'OpoScore basico', incluido: true },
      { texto: 'Tests ilimitados', incluido: false },
      { texto: 'Simulacros oficiales', incluido: false },
      { texto: 'Estadisticas avanzadas', incluido: false },
      { texto: 'Soporte prioritario', incluido: false },
    ],
    cta: 'Empezar gratis',
    destacado: false,
  },
  {
    id: 'premium',
    nombre: 'Premium',
    descripcion: 'Para opositores serios',
    precioMensual: 14.99,
    precioAnual: 9.99,
    features: [
      { texto: 'Preguntas ilimitadas', incluido: true },
      { texto: 'Tests ilimitados', incluido: true },
      { texto: 'Flashcards con IA', incluido: true },
      { texto: 'OpoScore avanzado', incluido: true },
      { texto: 'Simulacros oficiales', incluido: true },
      { texto: 'Estadisticas detalladas', incluido: true },
      { texto: 'Sin anuncios', incluido: true },
      { texto: 'Soporte 24/7', incluido: false },
    ],
    cta: 'Empezar prueba gratis',
    destacado: true,
    badge: 'Mas popular',
  },
  {
    id: 'elite',
    nombre: 'Elite',
    descripcion: 'Preparacion total',
    precioMensual: 29.99,
    precioAnual: 19.99,
    features: [
      { texto: 'Todo de Premium', incluido: true },
      { texto: 'Tutor IA personal', incluido: true },
      { texto: 'Plan de estudio adaptativo', incluido: true },
      { texto: 'Prediccion de examen', incluido: true },
      { texto: 'Analisis de debilidades', incluido: true },
      { texto: 'Sesiones 1:1 mensuales', incluido: true },
      { texto: 'Acceso anticipado', incluido: true },
      { texto: 'Soporte 24/7 prioritario', incluido: true },
    ],
    cta: 'Contactar ventas',
    destacado: false,
    badge: 'Para instituciones',
  },
]

export default function PreciosPage() {
  const [anual, setAnual] = useState(true)

  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge variant="secondary" className="mb-4">Precios transparentes</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Elige tu plan de preparacion
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Invierte en tu futuro. Todos los planes incluyen 14 dias de prueba gratuita.
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
                  <Link href={plan.id === 'elite' ? '/contacto' : '/registro'}>
                    <Button
                      className="w-full"
                      variant={plan.destacado ? 'default' : 'outline'}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

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
                Si, puedes cancelar tu suscripcion en cualquier momento. No hay contratos ni permanencias.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">¿Que metodos de pago aceptais?</h3>
              <p className="text-sm text-muted-foreground">
                Aceptamos tarjetas de credito/debito, PayPal y transferencia bancaria para planes anuales.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">¿Hay descuento para estudiantes?</h3>
              <p className="text-sm text-muted-foreground">
                Si, ofrecemos un 20% de descuento adicional con email .edu verificado.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">¿Puedo cambiar de plan?</h3>
              <p className="text-sm text-muted-foreground">
                Puedes actualizar o degradar tu plan en cualquier momento. El cambio se aplica inmediatamente.
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
          <h3 className="text-xl font-bold mb-2">Garantia de devolucion de 30 dias</h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Si no estas satisfecho con OpoScore, te devolvemos el 100% de tu dinero durante los primeros 30 dias. Sin preguntas.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
