// ===========================================
// OpoMetrics - Global Error Handler
// ===========================================

'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function GlobalError({
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
      console.error('Global error:', error)
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <Link href="/" className="text-2xl font-bold text-primary mb-2 block">
            OpoMetrics
          </Link>
          <div className="text-5xl mb-4">😕</div>
          <CardTitle>Error inesperado</CardTitle>
          <CardDescription>
            Algo no funcionó como esperábamos.
            Nuestro equipo ha sido notificado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {process.env.NODE_ENV === 'development' && (
            <div className="space-y-2">
              <pre className="text-xs text-left bg-muted p-3 rounded-lg overflow-auto max-h-32">
                {error.message}
              </pre>
              {error.digest && (
                <p className="text-xs text-muted-foreground">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <Button onClick={reset} variant="default">
            Intentar de nuevo
          </Button>
          <Link href="/">
            <Button variant="outline">
              Volver al inicio
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
