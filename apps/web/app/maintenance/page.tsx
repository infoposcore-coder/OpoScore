// ===========================================
// OpoScore - Página de Mantenimiento
// ===========================================

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="text-6xl mb-4">🔧</div>
          <CardTitle className="text-2xl">En Mantenimiento</CardTitle>
          <CardDescription className="text-base">
            Estamos realizando mejoras en el sistema.
            Volveremos pronto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Si necesitas ayuda urgente, contáctanos en{' '}
            <a href="mailto:soporte@oposcore.es" className="text-primary hover:underline">
              soporte@oposcore.es
            </a>
          </p>
          <Link href="/" className="text-primary hover:underline text-sm">
            ← Volver al inicio
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
