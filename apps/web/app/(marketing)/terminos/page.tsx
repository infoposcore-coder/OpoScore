// ===========================================
// OpoScore - Términos de Uso
// ===========================================

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Términos de Uso - OpoScore',
  description: 'Términos y condiciones de uso de OpoScore',
}

export default function TerminosPage() {
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
            <CardTitle className="text-2xl">Términos de Uso</CardTitle>
            <p className="text-muted-foreground">
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <h2 className="text-lg font-semibold mt-6 mb-3">1. Aceptación de los términos</h2>
            <p className="text-muted-foreground mb-4">
              Al acceder y utilizar OpoScore, aceptas estos términos de uso en su totalidad.
              Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestros servicios.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">2. Descripción del servicio</h2>
            <p className="text-muted-foreground mb-4">
              OpoScore es una plataforma de preparación de oposiciones que ofrece:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Tests y simulacros de examen</li>
              <li>Sistema de flashcards con repetición espaciada</li>
              <li>Tutor IA para resolver dudas</li>
              <li>Seguimiento del progreso y predicción de resultados (OpoScore)</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-3">3. Cuentas de usuario</h2>
            <p className="text-muted-foreground mb-4">
              Eres responsable de mantener la confidencialidad de tu cuenta y contraseña.
              Debes notificarnos inmediatamente cualquier uso no autorizado de tu cuenta.
              No puedes compartir tu cuenta con terceros ni crear múltiples cuentas.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">4. Suscripciones y pagos</h2>
            <p className="text-muted-foreground mb-4">
              Los planes de pago se facturan de forma recurrente según el periodo seleccionado.
              Puedes cancelar tu suscripción en cualquier momento desde tu perfil.
              No hay reembolsos por periodos parciales, excepto durante los primeros 30 días
              según nuestra garantía de devolución.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">5. Propiedad intelectual</h2>
            <p className="text-muted-foreground mb-4">
              Todo el contenido de OpoScore (textos, preguntas, diseños, código) está protegido
              por derechos de propiedad intelectual. No está permitida la reproducción,
              distribución o modificación sin autorización expresa.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">6. Uso aceptable</h2>
            <p className="text-muted-foreground mb-4">
              Te comprometes a no:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Copiar o distribuir el contenido de la plataforma</li>
              <li>Intentar acceder a áreas restringidas del sistema</li>
              <li>Usar la plataforma para fines ilegales</li>
              <li>Interferir con el funcionamiento normal del servicio</li>
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-3">7. Limitación de responsabilidad</h2>
            <p className="text-muted-foreground mb-4">
              OpoScore proporciona herramientas de estudio pero no garantiza el aprobado
              de ninguna oposición. Los resultados dependen del esfuerzo individual de cada usuario.
              El OpoScore es una estimación basada en datos y no una predicción garantizada.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">8. Modificaciones</h2>
            <p className="text-muted-foreground mb-4">
              Nos reservamos el derecho de modificar estos términos en cualquier momento.
              Los cambios serán comunicados a través de la plataforma o por email.
            </p>

            <h2 className="text-lg font-semibold mt-6 mb-3">9. Contacto</h2>
            <p className="text-muted-foreground mb-4">
              Para cualquier consulta sobre estos términos, contacta con{' '}
              <a href="mailto:legal@oposcore.es" className="text-primary hover:underline">
                legal@oposcore.es
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
