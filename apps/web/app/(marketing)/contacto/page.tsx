// ===========================================
// OpoScore - Página de Contacto
// ===========================================

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  })
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simular envío (en producción, conectar con API de email)
    await new Promise(resolve => setTimeout(resolve, 1000))

    setEnviado(true)
    setLoading(false)
  }

  if (enviado) {
    return (
      <div className="min-h-screen bg-muted/30 py-12 px-4">
        <div className="max-w-lg mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-bold mb-2">¡Mensaje enviado!</h2>
              <p className="text-muted-foreground mb-6">
                Hemos recibido tu mensaje. Te responderemos en un plazo máximo de 24-48 horas.
              </p>
              <Link href="/">
                <Button>Volver al inicio</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            ← Volver al inicio
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulario */}
          <Card>
            <CardHeader>
              <CardTitle>Contacta con nosotros</CardTitle>
              <CardDescription>
                ¿Tienes alguna pregunta o sugerencia? Escríbenos y te responderemos lo antes posible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asunto">Asunto</Label>
                  <Input
                    id="asunto"
                    placeholder="¿En qué podemos ayudarte?"
                    value={formData.asunto}
                    onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mensaje">Mensaje</Label>
                  <Textarea
                    id="mensaje"
                    placeholder="Escribe tu mensaje aquí..."
                    rows={5}
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar mensaje'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info de contacto */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información de contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:soporte@oposcore.es" className="text-primary hover:underline">
                      soporte@oposcore.es
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">⏰</span>
                  </div>
                  <div>
                    <p className="font-medium">Horario de atención</p>
                    <p className="text-muted-foreground text-sm">
                      Lunes a Viernes: 9:00 - 19:00
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">💬</span>
                  </div>
                  <div>
                    <p className="font-medium">Tiempo de respuesta</p>
                    <p className="text-muted-foreground text-sm">
                      Máximo 24-48 horas laborables
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preguntas frecuentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert>
                  <AlertDescription>
                    Antes de contactarnos, revisa nuestra sección de{' '}
                    <Link href="/#faq" className="text-primary hover:underline">
                      preguntas frecuentes
                    </Link>
                    . Puede que tu duda ya esté resuelta.
                  </AlertDescription>
                </Alert>
                <p className="text-sm text-muted-foreground">
                  Para consultas sobre facturación o suscripciones, incluye el email
                  asociado a tu cuenta para agilizar la respuesta.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
