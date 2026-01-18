// ===========================================
// OpoMetrics - Dashboard Error Handler
// ===========================================

'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error monitoring service (Sentry, etc.)
      console.error('Dashboard error:', error)
    }
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="text-5xl mb-4">😕</div>
          <CardTitle>Algo salió mal</CardTitle>
          <CardDescription>
            Ha ocurrido un error al cargar esta página.
            Por favor, inténtalo de nuevo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {process.env.NODE_ENV === 'development' && (
            <pre className="text-xs text-left bg-muted p-3 rounded-lg overflow-auto max-h-32">
              {error.message}
            </pre>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <Button onClick={reset} variant="default">
            Intentar de nuevo
          </Button>
          <Button onClick={() => window.location.href = '/dashboard'} variant="outline">
            Ir al inicio
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
