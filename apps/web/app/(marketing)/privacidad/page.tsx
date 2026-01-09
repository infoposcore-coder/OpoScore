// ===========================================
// OpoScore - Política de Privacidad
// ===========================================

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Política de Privacidad - OpoScore',
  description: 'Política de privacidad y protección de datos de OpoScore',
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            ← Volver al inicio
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Política de Privacidad</CardTitle>
            <p className="text-muted-foreground">
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <h2 className="text-lg font-semibold mt-6 mb-3">1. Información que recopilamos</h2>
            <p className="text-muted-foreground mb-4">
              En OpoScore recopilamos la siguiente información para proporcionarte nuestros servicios:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Información de cuenta: nombre, email y contraseña cifrada</li>
              <li>Datos de uso: progreso de estudio, resultados de tests, tiempo de uso</li>
              <li>Información de pago: procesada de forma segura a través de Stripe</li>
              <li>Datos técnicos: tipo de dispositivo, navegador y dirección IP</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-3">2. Cómo usamos tu información</h2>
            <p className="text-muted-foreground mb-4">
              Utilizamos tu información para:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Proporcionar y mejorar nuestros servicios de preparación de oposiciones</li>
              <li>Personalizar tu experiencia de aprendizaje y calcular tu OpoScore</li>
              <li>Procesar pagos y gestionar tu suscripción</li>
              <li>Enviarte comunicaciones importantes sobre tu cuenta</li>
              <li>Mejorar nuestros algoritmos y contenidos</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-3">3. Protección de datos</h2>
            <p className="text-muted-foreground mb-4">
              Tu privacidad es nuestra prioridad. Implementamos medidas de seguridad técnicas y organizativas
              para proteger tus datos personales, incluyendo cifrado de datos en tránsito y en reposo,
              acceso restringido a la información y auditorías de seguridad regulares.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">4. Tus derechos</h2>
            <p className="text-muted-foreground mb-4">
              Conforme al RGPD, tienes derecho a:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Acceder a tus datos personales</li>
              <li>Rectificar datos inexactos</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Oponerte al tratamiento de tus datos</li>
              <li>Portabilidad de tus datos</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-3">5. Cookies</h2>
            <p className="text-muted-foreground mb-4">
              Utilizamos cookies esenciales para el funcionamiento de la plataforma y cookies
              analíticas para mejorar nuestros servicios. Puedes gestionar tus preferencias
              de cookies en cualquier momento desde la configuración de tu navegador.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">6. Contacto</h2>
            <p className="text-muted-foreground mb-4">
              Para cualquier consulta relacionada con la privacidad, puedes contactarnos en{' '}
              <a href="mailto:privacidad@oposcore.es" className="text-primary hover:underline">
                privacidad@oposcore.es
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
