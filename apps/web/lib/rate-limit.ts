// ===========================================
// OpoScore - Rate Limiting Utility
// ===========================================

interface RateLimitConfig {
  /** Número máximo de requests permitidos */
  limit: number
  /** Ventana de tiempo en segundos */
  windowSeconds: number
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

// Store en memoria (en producción usar Redis)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Limpiar entradas expiradas cada minuto
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60000)

/**
 * Verifica si una request está dentro del límite permitido
 * @returns true si está permitido, false si excede el límite
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const windowMs = config.windowSeconds * 1000
  const key = identifier

  let entry = rateLimitStore.get(key)

  // Si no existe o expiró, crear nueva entrada
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 1,
      resetTime: now + windowMs,
    }
    rateLimitStore.set(key, entry)
    return {
      allowed: true,
      remaining: config.limit - 1,
      resetIn: config.windowSeconds,
    }
  }

  // Incrementar contador
  entry.count++
  rateLimitStore.set(key, entry)

  const resetIn = Math.ceil((entry.resetTime - now) / 1000)

  if (entry.count > config.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetIn,
    }
  }

  return {
    allowed: true,
    remaining: config.limit - entry.count,
    resetIn,
  }
}

/**
 * Configuraciones predefinidas de rate limiting
 */
export const RATE_LIMITS = {
  // API de IA: 20 requests por minuto para usuarios normales
  ai: { limit: 20, windowSeconds: 60 },
  // API de IA para usuarios free: 5 requests por minuto
  aiFree: { limit: 5, windowSeconds: 60 },
  // API de checkout: 5 requests por minuto
  checkout: { limit: 5, windowSeconds: 60 },
  // API general: 100 requests por minuto
  general: { limit: 100, windowSeconds: 60 },
  // Tests: 30 por hora
  tests: { limit: 30, windowSeconds: 3600 },
} as const

/**
 * Obtiene el identificador para rate limiting desde una request
 */
export function getRateLimitIdentifier(
  request: Request,
  userId?: string
): string {
  // Preferir userId si está disponible
  if (userId) {
    return `user:${userId}`
  }

  // Fallback a IP
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
  return `ip:${ip}`
}
