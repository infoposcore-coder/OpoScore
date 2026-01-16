// ===========================================
// OpoScore - Rate Limiting Utility
// ===========================================
// Soporta Redis (Upstash) en producción y memoria en desarrollo

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

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetIn: number
}

// ============================================
// STORE: Redis (Upstash) o Memoria (fallback)
// ============================================

// Store en memoria (fallback para desarrollo)
const memoryStore = new Map<string, RateLimitEntry>()

// Limpiar entradas expiradas cada minuto (solo memoria)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of memoryStore.entries()) {
      if (entry.resetTime < now) {
        memoryStore.delete(key)
      }
    }
  }, 60000)
}

/**
 * Rate limit usando Upstash Redis (recomendado para producción)
 * Requiere: UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN
 */
async function checkRateLimitRedis(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    // Fallback a memoria si Redis no está configurado
    return checkRateLimitMemory(identifier, config)
  }

  const key = `ratelimit:${identifier}`
  const now = Date.now()
  const windowMs = config.windowSeconds * 1000

  try {
    // Usar MULTI para operaciones atómicas
    const response = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['PTTL', key],
      ]),
    })

    if (!response.ok) {
      console.error('[RateLimit] Redis error, falling back to memory')
      return checkRateLimitMemory(identifier, config)
    }

    const results = await response.json()
    const count = results[0]?.result || 1
    let ttl = results[1]?.result || -1

    // Si la key es nueva (TTL = -1), establecer expiración
    if (ttl === -1) {
      await fetch(`${url}/PEXPIRE/${key}/${windowMs}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
      ttl = windowMs
    }

    const resetIn = Math.ceil(ttl / 1000)
    const remaining = Math.max(0, config.limit - count)

    return {
      allowed: count <= config.limit,
      remaining,
      resetIn,
    }
  } catch (error) {
    console.error('[RateLimit] Redis error:', error)
    return checkRateLimitMemory(identifier, config)
  }
}

/**
 * Rate limit usando memoria (para desarrollo o fallback)
 */
function checkRateLimitMemory(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const windowMs = config.windowSeconds * 1000
  const key = identifier

  let entry = memoryStore.get(key)

  // Si no existe o expiró, crear nueva entrada
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 1,
      resetTime: now + windowMs,
    }
    memoryStore.set(key, entry)
    return {
      allowed: true,
      remaining: config.limit - 1,
      resetIn: config.windowSeconds,
    }
  }

  // Incrementar contador
  entry.count++
  memoryStore.set(key, entry)

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
 * Verifica si una request está dentro del límite permitido
 * Usa Redis en producción (si configurado), memoria en desarrollo
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  // Versión síncrona para compatibilidad - usa memoria
  // Para Redis (async), usar checkRateLimitAsync
  return checkRateLimitMemory(identifier, config)
}

/**
 * Versión asíncrona que soporta Redis
 * Recomendada para producción
 */
export async function checkRateLimitAsync(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  // Usar Redis si está configurado, sino memoria
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return checkRateLimitRedis(identifier, config)
  }
  return checkRateLimitMemory(identifier, config)
}

/**
 * Configuraciones predefinidas de rate limiting
 */
export const RATE_LIMITS = {
  // API de IA: 20 requests por minuto para usuarios premium
  ai: { limit: 20, windowSeconds: 60 },
  // API de IA para usuarios free: 5 requests por minuto
  aiFree: { limit: 5, windowSeconds: 60 },
  // API de checkout: 5 requests por minuto
  checkout: { limit: 5, windowSeconds: 60 },
  // API general: 100 requests por minuto
  general: { limit: 100, windowSeconds: 60 },
  // Tests: 30 por hora
  tests: { limit: 30, windowSeconds: 3600 },
  // Login attempts: 5 por minuto (protección brute force)
  login: { limit: 5, windowSeconds: 60 },
  // Register: 3 por hora (protección spam)
  register: { limit: 3, windowSeconds: 3600 },
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
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown'
  return `ip:${ip}`
}
