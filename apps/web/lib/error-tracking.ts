// ===========================================
// OpoMetrics - Error Tracking Utility
// ===========================================
// Preparado para integrar con Sentry u otros servicios

interface ErrorContext {
  userId?: string
  email?: string
  page?: string
  action?: string
  extra?: Record<string, unknown>
}

interface ErrorEvent {
  message: string
  stack?: string
  context: ErrorContext
  timestamp: string
  severity: 'error' | 'warning' | 'info'
}

// Cola de errores para enviar en batch (en producción)
const errorQueue: ErrorEvent[] = []

/**
 * Captura un error y lo registra
 */
export function captureError(
  error: Error | string,
  context: ErrorContext = {},
  severity: ErrorEvent['severity'] = 'error'
): void {
  const errorEvent: ErrorEvent = {
    message: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
    context,
    timestamp: new Date().toISOString(),
    severity,
  }

  // En desarrollo, solo log
  if (process.env.NODE_ENV === 'development') {
    console.error('[ErrorTracking]', errorEvent)
    return
  }

  // En producción, añadir a la cola
  errorQueue.push(errorEvent)

  // Si hay Sentry configurado, enviar directamente
  // TODO: Descomentar cuando se integre Sentry
  // if (typeof Sentry !== 'undefined') {
  //   Sentry.captureException(error, { extra: context })
  // }

  // Enviar errores críticos inmediatamente
  if (severity === 'error' && errorQueue.length > 0) {
    flushErrors()
  }
}

/**
 * Captura un mensaje de advertencia
 */
export function captureWarning(
  message: string,
  context: ErrorContext = {}
): void {
  captureError(message, context, 'warning')
}

/**
 * Captura información de debug
 */
export function captureInfo(
  message: string,
  context: ErrorContext = {}
): void {
  captureError(message, context, 'info')
}

/**
 * Establece el contexto del usuario actual
 */
export function setUserContext(user: { id: string; email?: string }): void {
  // TODO: Cuando se integre Sentry
  // Sentry.setUser({ id: user.id, email: user.email })

  if (process.env.NODE_ENV === 'development') {
    console.log('[ErrorTracking] User context set:', user.id)
  }
}

/**
 * Limpia el contexto del usuario (logout)
 */
export function clearUserContext(): void {
  // TODO: Cuando se integre Sentry
  // Sentry.setUser(null)
}

/**
 * Envía los errores acumulados al servidor
 */
async function flushErrors(): Promise<void> {
  if (errorQueue.length === 0) return

  const errorsToSend = [...errorQueue]
  errorQueue.length = 0

  try {
    // En producción, enviar a un endpoint o servicio externo
    // Por ahora solo logueamos en server
    if (typeof window === 'undefined') {
      console.error('[ErrorTracking] Errors to report:', errorsToSend.length)
      errorsToSend.forEach(e => console.error(e))
    }
  } catch (e) {
    // Si falla el envío, devolver a la cola
    errorQueue.push(...errorsToSend)
    console.error('[ErrorTracking] Failed to flush errors:', e)
  }
}

/**
 * Wrapper para funciones async que captura errores automáticamente
 */
export function withErrorTracking<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context: ErrorContext = {}
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      captureError(error as Error, context)
      throw error
    }
  }) as T
}

/**
 * Error boundary helper para componentes React
 */
export function handleComponentError(
  error: Error,
  componentName: string,
  errorInfo?: { componentStack?: string }
): void {
  captureError(error, {
    action: 'component_error',
    extra: {
      componentName,
      componentStack: errorInfo?.componentStack,
    },
  })
}
